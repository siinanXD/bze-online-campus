-- =====================================================================
-- BZE Online Campus — Migration 0005 (AP-10): Fortschritt, Gates, Score
-- Additiv. Spec §4.1 (Views), §4.2 (Kaskade/Prüfungsreife), Achievements.
-- Bestehende Views thema/bereich werden korrigiert (Kern-Denominator =
-- alle freigegebenen Kernfragen, nicht nur Mastery-Zeilen).
-- =====================================================================

-- ---------------------------------------------------------------------
-- Achievement-Katalog (globale Referenzdaten; Admin schreibt, alle lesen)
-- bedingung.typ: kern_abgeschlossen | lernpunkte_summe
-- ---------------------------------------------------------------------
insert into achievements (id, code, titel_key, beschreibung_key, bedingung, punkte) values
  ('a0000001-0001-4000-8000-000000000001', 'erste_kernfrage',
   'achievement.ersteKernfrage.titel', 'achievement.ersteKernfrage.beschreibung',
   '{"typ":"kern_abgeschlossen","anzahl":1}'::jsonb, 10),
  ('a0000001-0001-4000-8000-000000000002', 'zehn_kernfragen',
   'achievement.zehnKernfragen.titel', 'achievement.zehnKernfragen.beschreibung',
   '{"typ":"kern_abgeschlossen","anzahl":10}'::jsonb, 30),
  ('a0000001-0001-4000-8000-000000000003', 'hundert_punkte',
   'achievement.hundertPunkte.titel', 'achievement.hundertPunkte.beschreibung',
   '{"typ":"lernpunkte_summe","min":100}'::jsonb, 20)
on conflict (code) do nothing;


-- ---------------------------------------------------------------------
-- Achievement-Prüfung für einen Nutzer (idempotent, nur freischalten)
-- ---------------------------------------------------------------------
create or replace function pruefe_achievements(p_user_id uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  a          achievements%rowtype;
  v_kern     int;
  v_punkte   int;
  v_ok       boolean;
begin
  select count(*)::int into v_kern
    from fragen_mastery m
    join fragen f on f.id = m.frage_id
   where m.user_id = p_user_id and f.kern and m.status = 'abgeschlossen';

  select coalesce(sum(punkte), 0)::int into v_punkte
    from lernpunkte where user_id = p_user_id;

  for a in select * from achievements loop
    v_ok := false;
    if a.bedingung->>'typ' = 'kern_abgeschlossen' then
      v_ok := v_kern >= coalesce((a.bedingung->>'anzahl')::int, 1);
    elsif a.bedingung->>'typ' = 'lernpunkte_summe' then
      v_ok := v_punkte >= coalesce((a.bedingung->>'min')::int, 100);
    end if;

    if v_ok then
      insert into nutzer_achievements (user_id, achievement_id)
      values (p_user_id, a.id)
      on conflict do nothing;

      -- Lernpunkte nur einmal beim Freischalten
      if a.punkte > 0 then
        insert into lernpunkte (user_id, grund, punkte, referenz_id)
        select p_user_id, 'achievement:' || a.code, a.punkte, a.id
         where not exists (
           select 1 from lernpunkte
            where user_id = p_user_id and grund = 'achievement:' || a.code
         );
      end if;
    end if;
  end loop;
end $$;

revoke all on function pruefe_achievements(uuid) from public;
grant execute on function pruefe_achievements(uuid) to authenticated;


-- Unique für Idempotenz (additiv, falls noch nicht vorhanden)
do $$ begin
  alter table pruefungsreife
    add constraint pruefungsreife_user_phase_unique unique (user_id, phase_id);
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------
-- Phasenabschluss → Prüfungsreife-Empfehlung (keine Zulassung!)
-- Kriterien: alle Kernfragen der Phase abgeschlossen + mindest_wochenpruefungen
-- mit gesamtpunkte >= 50. Fachkunde wird in der App-Schicht angezeigt.
-- ---------------------------------------------------------------------
create or replace function pruefe_pruefungsreife(p_user_id uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  ph         record;
  v_kern_g   int;
  v_kern_f   int;
  v_pruef_ok int;
begin
  for ph in
    select ap.id, ap.mindest_wochenpruefungen
      from ausbildungsphasen ap
      join pruefungsbereiche pb on pb.phase_id = ap.id
      join themen th on th.pruefungsbereich_id = pb.id
      join fragen f on f.thema_id = th.id and f.status = 'freigegeben' and f.kern
     group by ap.id, ap.mindest_wochenpruefungen
  loop
    select
      count(*)::int,
      count(*) filter (where m.status = 'abgeschlossen')::int
      into v_kern_g, v_kern_f
    from fragen f
    join themen th on th.id = f.thema_id
    join pruefungsbereiche pb on pb.id = th.pruefungsbereich_id
    left join fragen_mastery m on m.frage_id = f.id and m.user_id = p_user_id
    where pb.phase_id = ph.id and f.status = 'freigegeben' and f.kern;

    if v_kern_g = 0 or v_kern_f < v_kern_g then
      continue;
    end if;

    select count(*)::int into v_pruef_ok
      from pruefung_ergebnisse
     where user_id = p_user_id
       and gesamtpunkte is not null
       and gesamtpunkte >= 50;

    if v_pruef_ok < coalesce(ph.mindest_wochenpruefungen, 0) then
      continue;
    end if;

    insert into pruefungsreife (user_id, phase_id, kriterien_erfuellt_am)
    values (p_user_id, ph.id, now())
    on conflict (user_id, phase_id) do nothing;
  end loop;
end $$;

revoke all on function pruefe_pruefungsreife(uuid) from public;
grant execute on function pruefe_pruefungsreife(uuid) to authenticated;


-- ---------------------------------------------------------------------
-- verarbeite_versuch: Achievement- und Prüfungsreife-Hooks ergänzen
-- (vollständiger Replace der AP-06-Funktion, Logik unverändert + Hooks)
-- ---------------------------------------------------------------------
create or replace function verarbeite_versuch(
  p_frage_id        uuid,
  p_ist_korrekt     boolean       default null,
  p_antwort         jsonb         default null,
  p_erzielte_punkte numeric       default null,
  p_dauer_sekunden  int           default null,
  p_antwort_sprache text          default 'de'
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid        uuid := auth.uid();
  v_typ        frage_typ_t;
  v_maxp       numeric;
  v_cfg        jsonb;
  v_streak_ziel int;
  v_spacing    int;
  v_schwelle   numeric;
  v_korrekt    boolean;
  m            fragen_mastery%rowtype;
  v_neu        boolean := false;
  v_inc        boolean;
  v_andere     int;
  v_status     mastery_status_t;
  v_streak     smallint;
  v_war_fertig boolean;
  v_punkte     int := 0;
begin
  if v_uid is null then raise exception 'nicht angemeldet'; end if;

  select f.typ, coalesce(fl.max_punkte, 4)
    into v_typ, v_maxp
    from fragen f
    left join freitext_loesungen fl on fl.frage_id = f.id
   where f.id = p_frage_id;
  if not found then raise exception 'frage_unbekannt'; end if;

  select t.einstellungen into v_cfg
    from traeger t join profiles p on p.traeger_id = t.id
   where p.id = v_uid;
  v_streak_ziel := coalesce((v_cfg->>'mastery_streak')::int, 2);
  v_spacing     := coalesce((v_cfg->>'spacing_stunden')::int, 12);
  v_schwelle    := coalesce((v_cfg->>'freitext_schwellwert')::numeric, 0.75);

  if v_typ = 'freitext' and p_erzielte_punkte is not null then
    v_korrekt := (p_erzielte_punkte / nullif(v_maxp,0)) >= v_schwelle;
  else
    v_korrekt := coalesce(p_ist_korrekt, false);
  end if;

  insert into versuche (user_id, frage_id, antwort, antwort_sprache, ist_korrekt, erzielte_punkte, dauer_sekunden)
  values (v_uid, p_frage_id, p_antwort, p_antwort_sprache, v_korrekt, p_erzielte_punkte, p_dauer_sekunden);

  select * into m from fragen_mastery where user_id = v_uid and frage_id = p_frage_id;
  if not found then
    v_neu := true;
    m.status := 'neu'; m.streak := 0; m.fehler_gesamt := 0; m.richtig_gesamt := 0;
    m.letzter_versuch := null; m.naechste_faelligkeit := null;
  end if;
  v_war_fertig := (m.status = 'abgeschlossen');
  v_streak := m.streak;
  v_status := m.status;

  if v_korrekt then
    if m.letzter_versuch is null then
      v_inc := true;
    elsif now() - m.letzter_versuch >= make_interval(hours => v_spacing) then
      v_inc := true;
    else
      select count(distinct frage_id) into v_andere
        from versuche
       where user_id = v_uid and frage_id <> p_frage_id and created_at > m.letzter_versuch;
      v_inc := (v_andere >= 20);
    end if;

    if v_inc then v_streak := v_streak + 1; end if;

    if v_streak >= v_streak_ziel or v_war_fertig then
      v_status := 'abgeschlossen';
    else
      v_status := 'einmal_richtig';
    end if;

    if v_neu then
      insert into fragen_mastery (user_id, frage_id, status, streak, richtig_gesamt, letzter_versuch, naechste_faelligkeit)
      values (v_uid, p_frage_id, v_status, v_streak, 1, now(),
              case when v_status='abgeschlossen' then null else now() + make_interval(hours => v_spacing) end);
    else
      update fragen_mastery set
        status = v_status,
        streak = v_streak,
        richtig_gesamt = m.richtig_gesamt + 1,
        letzter_versuch = now(),
        naechste_faelligkeit = case when v_status = 'abgeschlossen' then null
                                    else now() + make_interval(hours => v_spacing) end,
        updated_at = now()
      where user_id = v_uid and frage_id = p_frage_id;
    end if;

    v_punkte := 10 + case when v_status = 'abgeschlossen' and not v_war_fertig then 20 else 0 end;
  else
    v_status := 'falsch';
    v_streak := 0;
    if v_neu then
      insert into fragen_mastery (user_id, frage_id, status, streak, fehler_gesamt, letzter_versuch, naechste_faelligkeit)
      values (v_uid, p_frage_id, 'falsch', 0, 1, now(), now());
    else
      update fragen_mastery set
        status = 'falsch', streak = 0, fehler_gesamt = m.fehler_gesamt + 1,
        letzter_versuch = now(), naechste_faelligkeit = now(), updated_at = now()
      where user_id = v_uid and frage_id = p_frage_id;
    end if;
    v_punkte := 0;
  end if;

  if v_punkte > 0 then
    insert into lernpunkte (user_id, grund, punkte, referenz_id)
    values (v_uid, case when v_status='abgeschlossen' then 'frage_abgeschlossen' else 'frage_richtig' end,
            v_punkte, p_frage_id);
  end if;

  -- Spec §4.1: Achievement-Bedingungen prüfen; Phasenabschluss → Empfehlung
  perform pruefe_achievements(v_uid);
  if v_status = 'abgeschlossen' and not v_war_fertig then
    perform pruefe_pruefungsreife(v_uid);
  end if;

  return jsonb_build_object(
    'status', v_status,
    'streak', v_streak,
    'ist_korrekt', v_korrekt,
    'spacing_gesperrt', (v_korrekt and not coalesce(v_inc,true)),
    'punkte', v_punkte
  );
end $$;


-- ---------------------------------------------------------------------
-- Fortschritts-Sichten (korrigierter Denominator + Phase/Beruf)
-- security_invoker: RLS der Basistabellen gilt für den Aufrufer.
-- ---------------------------------------------------------------------
create or replace view v_fortschritt_thema
with (security_invoker = true) as
select
  p.id as user_id,
  f.thema_id,
  count(*) filter (where f.kern)                                as kern_gesamt,
  count(*) filter (where f.kern and m.status = 'abgeschlossen') as kern_fertig,
  count(*) filter (where m.status = 'falsch')                   as offen_falsch,
  count(m.frage_id)                                             as bearbeitet_gesamt,
  (
    count(*) filter (where f.kern) > 0
    and count(*) filter (where f.kern and m.status = 'abgeschlossen')
      = count(*) filter (where f.kern)
  ) as thema_fertig
from profiles p
cross join fragen f
left join fragen_mastery m on m.frage_id = f.id and m.user_id = p.id
where f.status = 'freigegeben'
  and p.rolle = 'teilnehmer'
group by p.id, f.thema_id;

create or replace view v_fortschritt_bereich
with (security_invoker = true) as
select
  ft.user_id,
  th.pruefungsbereich_id,
  sum(ft.kern_gesamt)::bigint  as kern_gesamt,
  sum(ft.kern_fertig)::bigint  as kern_fertig,
  bool_and(ft.thema_fertig)    as bereich_fertig
from v_fortschritt_thema ft
join themen th on th.id = ft.thema_id
group by ft.user_id, th.pruefungsbereich_id;

create or replace view v_fortschritt_phase
with (security_invoker = true) as
select
  fb.user_id,
  pb.phase_id,
  sum(fb.kern_gesamt)::bigint as kern_gesamt,
  sum(fb.kern_fertig)::bigint as kern_fertig,
  bool_and(fb.bereich_fertig) as bereiche_fertig,
  (
    select count(*)::int
      from pruefung_ergebnisse pe
     where pe.user_id = fb.user_id
       and pe.gesamtpunkte is not null
       and pe.gesamtpunkte >= 50
  ) as pruefungen_bestanden,
  ap.mindest_wochenpruefungen,
  (
    bool_and(fb.bereich_fertig)
    and (
      select count(*)::int
        from pruefung_ergebnisse pe
       where pe.user_id = fb.user_id
         and pe.gesamtpunkte is not null
         and pe.gesamtpunkte >= 50
    ) >= coalesce(ap.mindest_wochenpruefungen, 0)
  ) as phase_fertig
from v_fortschritt_bereich fb
join pruefungsbereiche pb on pb.id = fb.pruefungsbereich_id
join ausbildungsphasen ap on ap.id = pb.phase_id
where pb.phase_id is not null
group by fb.user_id, pb.phase_id, ap.mindest_wochenpruefungen;

create or replace view v_fortschritt_beruf
with (security_invoker = true) as
select
  fp.user_id,
  ap.beruf_id,
  sum(fp.kern_gesamt)::bigint as kern_gesamt,
  sum(fp.kern_fertig)::bigint as kern_fertig,
  case when sum(fp.kern_gesamt) > 0
       then round(100.0 * sum(fp.kern_fertig) / sum(fp.kern_gesamt))
       else 0 end             as fortschritt_prozent,
  bool_and(fp.phase_fertig)   as beruf_fertig
from v_fortschritt_phase fp
join ausbildungsphasen ap on ap.id = fp.phase_id
group by fp.user_id, ap.beruf_id;


-- ---------------------------------------------------------------------
-- Wochenaktivität (für AP-10 Score + AP-11 Cockpit)
-- ---------------------------------------------------------------------
create or replace view v_wochenaktivitaet_nutzer
with (security_invoker = true) as
select
  p.id as user_id,
  (
    select count(distinct (v.created_at at time zone 'Europe/Berlin')::date)
      from versuche v
     where v.user_id = p.id
       and v.created_at >= date_trunc('week', now() at time zone 'Europe/Berlin')
                            at time zone 'Europe/Berlin'
  )::int as aktive_lerntage_woche,
  (
    select count(*)::int from versuche v
     where v.user_id = p.id
       and v.created_at >= date_trunc('week', now() at time zone 'Europe/Berlin')
                            at time zone 'Europe/Berlin'
  ) as fragen_pro_woche,
  (
    select case when count(*) = 0 then null
                else round(100.0 * count(*) filter (where v.ist_korrekt) / count(*), 1)
           end
      from versuche v where v.user_id = p.id
  ) as richtig_falsch_quote,
  (
    select max(v.created_at) from versuche v where v.user_id = p.id
  ) as letzte_aktivitaet,
  (
    select coalesce(sum(lp.punkte), 0)::int from lernpunkte lp where lp.user_id = p.id
  ) as lernpunkte_summe,
  (
    select count(*)::int from pruefung_ergebnisse pe where pe.user_id = p.id and pe.abgegeben_am is not null
  ) as pruefungen_anzahl,
  (
    select pe.note from pruefung_ergebnisse pe
     where pe.user_id = p.id and pe.abgegeben_am is not null
     order by pe.abgegeben_am desc nulls last
     limit 1
  ) as letzte_note,
  (
    select pe.bestanden from pruefung_ergebnisse pe
     where pe.user_id = p.id and pe.abgegeben_am is not null
     order by pe.abgegeben_am desc nulls last
     limit 1
  ) as letzte_bestanden,
  (
    -- Zwei nicht bestandene Prüfungen in Folge (neueste zuerst)
    select count(*) = 2 and bool_and(not coalesce(x.bestanden, false))
      from (
        select pe.bestanden from pruefung_ergebnisse pe
         where pe.user_id = p.id and pe.abgegeben_am is not null
         order by pe.abgegeben_am desc
         limit 2
      ) x
  ) as risiko_pruefungen,
  (
    select count(distinct (v.created_at at time zone 'Europe/Berlin')::date) < 3
      from versuche v
     where v.user_id = p.id
       and v.created_at >= date_trunc('week', now() at time zone 'Europe/Berlin')
                            at time zone 'Europe/Berlin'
  ) as risiko_aktivitaet
from profiles p
where p.rolle = 'teilnehmer';


-- ---------------------------------------------------------------------
-- Kohortenübersicht (für AP-11)
-- ---------------------------------------------------------------------
create or replace view v_kohorten_uebersicht
with (security_invoker = true) as
select
  k.id as kohorte_id,
  k.bezeichnung,
  k.beruf_id,
  count(distinct km.user_id)::int as teilnehmer_anzahl,
  round(avg(coalesce(fb.fortschritt_prozent, 0)), 1) as fortschritt_avg,
  round(avg(coalesce(wa.lernpunkte_summe, 0)), 1) as lernpunkte_avg,
  round(avg(coalesce(wa.richtig_falsch_quote, 0)), 1) as quote_avg
from kohorten k
left join kohorten_mitglieder km on km.kohorte_id = k.id
left join v_fortschritt_beruf fb on fb.user_id = km.user_id and fb.beruf_id = k.beruf_id
left join v_wochenaktivitaet_nutzer wa on wa.user_id = km.user_id
group by k.id, k.bezeichnung, k.beruf_id;

grant select on
  v_fortschritt_thema,
  v_fortschritt_bereich,
  v_fortschritt_phase,
  v_fortschritt_beruf,
  v_wochenaktivitaet_nutzer,
  v_kohorten_uebersicht
to authenticated;

-- Erzeugt: Achievements-Seed, pruefe_achievements, pruefe_pruefungsreife,
-- Unique pruefungsreife(user,phase), verarbeite_versuch-Hooks, 6 Views.
