-- =====================================================================
-- BZE Online Campus — Migration 0002 (AP-06): Mastery-Engine + Fortschritt
-- Additiv. Spec §4.1 (verarbeite_versuch), §4.2 (Fortschritt), §6.2.1 (Kohortenbeitritt).
-- Alle Funktionen SECURITY DEFINER, aber wirken ausschliesslich auf auth.uid().
-- =====================================================================

-- ---------------------------------------------------------------------
-- Kohortenbeitritt per Code (Teilnehmer-Selbstbeitritt; RLS lässt den
-- direkten Insert in kohorten_mitglieder nicht zu -> definierte Funktion).
-- ---------------------------------------------------------------------
create or replace function kohorte_beitreten(p_code text)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_uid     uuid := auth.uid();
  v_traeger uuid;
  v_kohorte uuid;
begin
  if v_uid is null then raise exception 'nicht angemeldet'; end if;
  select traeger_id into v_traeger from profiles where id = v_uid;

  select k.id into v_kohorte
    from kohorten k
   where k.beitrittscode = p_code
     and k.traeger_id = v_traeger;      -- nur eigene Trägerkohorte

  if v_kohorte is null then
    raise exception 'ungueltiger_code';
  end if;

  insert into kohorten_mitglieder (kohorte_id, user_id)
  values (v_kohorte, v_uid)
  on conflict (kohorte_id, user_id) do nothing;

  return v_kohorte;
end $$;

revoke all on function kohorte_beitreten(text) from public;
grant execute on function kohorte_beitreten(text) to authenticated;


-- ---------------------------------------------------------------------
-- Mastery-Engine: verarbeitet genau EINEN Versuch des angemeldeten Nutzers.
-- MC: p_ist_korrekt ist maßgeblich.
-- Freitext: wird aus erzielte_punkte / max_punkte >= freitext_schwellwert
--           bestimmt (p_ist_korrekt wird dann ignoriert).
-- Spacing (Spec §4.1): bei korrekter Antwort erhöht sich streak nur, wenn
--   seit letzter_versuch >= spacing_stunden vergangen sind ODER der Nutzer
--   seither >= 20 andere Fragen bearbeitet hat. Sonst: Versuch protokolliert,
--   streak unverändert (spacing_gesperrt = true).
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

  -- Konfiguration des eigenen Trägers
  select t.einstellungen into v_cfg
    from traeger t join profiles p on p.traeger_id = t.id
   where p.id = v_uid;
  v_streak_ziel := coalesce((v_cfg->>'mastery_streak')::int, 2);
  v_spacing     := coalesce((v_cfg->>'spacing_stunden')::int, 12);
  v_schwelle    := coalesce((v_cfg->>'freitext_schwellwert')::numeric, 0.75);

  -- Korrektheit bestimmen
  if v_typ = 'freitext' and p_erzielte_punkte is not null then
    v_korrekt := (p_erzielte_punkte / nullif(v_maxp,0)) >= v_schwelle;
  else
    v_korrekt := coalesce(p_ist_korrekt, false);
  end if;

  -- Versuch protokollieren
  insert into versuche (user_id, frage_id, antwort, antwort_sprache, ist_korrekt, erzielte_punkte, dauer_sekunden)
  values (v_uid, p_frage_id, p_antwort, p_antwort_sprache, v_korrekt, p_erzielte_punkte, p_dauer_sekunden);

  -- Mastery-Zeile laden oder anlegen
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
    -- Spacing-Sperre prüfen
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

    update fragen_mastery set
      status = v_status,
      streak = v_streak,
      richtig_gesamt = m.richtig_gesamt + 1,
      letzter_versuch = now(),
      naechste_faelligkeit = case when v_status = 'abgeschlossen' then null
                                  else now() + make_interval(hours => v_spacing) end,
      updated_at = now()
    where user_id = v_uid and frage_id = p_frage_id;

    if v_neu then
      insert into fragen_mastery (user_id, frage_id, status, streak, richtig_gesamt, letzter_versuch, naechste_faelligkeit)
      values (v_uid, p_frage_id, v_status, v_streak, 1, now(),
              case when v_status='abgeschlossen' then null else now() + make_interval(hours => v_spacing) end);
    end if;

    -- Lernpunkte: korrekt +10, erstmals abgeschlossen +20 Bonus
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

  return jsonb_build_object(
    'status', v_status,
    'streak', v_streak,
    'ist_korrekt', v_korrekt,
    'spacing_gesperrt', (v_korrekt and not coalesce(v_inc,true)),
    'punkte', v_punkte
  );
end $$;

revoke all on function verarbeite_versuch(uuid, boolean, jsonb, numeric, int, text) from public;
grant execute on function verarbeite_versuch(uuid, boolean, jsonb, numeric, int, text) to authenticated;


-- ---------------------------------------------------------------------
-- Fortschritts-Sichten (Spec §4.1). RLS der Basistabellen greift, da die
-- Views mit security_invoker laufen -> jeder Nutzer sieht nur eigene Zeilen.
-- Grundlage: freigegebene KERNfragen je Thema (Topic-Abschluss = alle Kern
-- abgeschlossen, Spec §4.2).
-- ---------------------------------------------------------------------
create or replace view v_fortschritt_thema
with (security_invoker = true) as
select
  m.user_id,
  f.thema_id,
  count(*) filter (where f.kern)                                             as kern_gesamt,
  count(*) filter (where f.kern and m.status = 'abgeschlossen')              as kern_fertig,
  count(*) filter (where m.status = 'falsch')                               as offen_falsch,
  count(*)                                                                   as bearbeitet_gesamt,
  bool_and(f.kern is not true or m.status = 'abgeschlossen')                 as thema_fertig
from fragen f
join fragen_mastery m on m.frage_id = f.id
where f.status = 'freigegeben'
group by m.user_id, f.thema_id;

create or replace view v_fortschritt_bereich
with (security_invoker = true) as
select
  ft.user_id,
  th.pruefungsbereich_id,
  sum(ft.kern_gesamt)  as kern_gesamt,
  sum(ft.kern_fertig)  as kern_fertig,
  bool_and(ft.thema_fertig) as bereich_fertig
from v_fortschritt_thema ft
join themen th on th.id = ft.thema_id
group by ft.user_id, th.pruefungsbereich_id;

grant select on v_fortschritt_thema, v_fortschritt_bereich to authenticated;

-- Erzeugt: kohorte_beitreten(), verarbeite_versuch(), 2 Fortschritts-Sichten.
