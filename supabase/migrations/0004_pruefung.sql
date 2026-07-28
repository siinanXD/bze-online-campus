-- =====================================================================
-- BZE Online Campus — Migration 0004 (AP-08): Wochenprüfung
-- Additiv. Spec §4.3 (Auswahl/Punkte), §4.4 (Bewertungsschlüssel), §6.2.9/10.
-- generiere_pruefung: pro Kohorte/KW EIN Fragensatz (SECURITY DEFINER, nur
--   Ausbilder/Verwaltung/Admin dürfen erzeugen). pruefung_starten/-abgeben:
--   wirken auf auth.uid(). MC wird automatisch bewertet, Freitext bleibt
--   ausstehend (KI-Bewertung = AP-09).
-- =====================================================================

-- ---------------------------------------------------------------------
-- Prüfungserzeugung: wählt aus freigegebenen Fragen des Kohorten-Berufs.
-- Gewichtung (§4.3, pragmatisch mit Fallback): zuerst kohortenweit schwache
-- Fragen (Status einmal_richtig/falsch), dann neue, dann Auffüllen. Punkte:
-- MC gesamt 40, Freitext gesamt 60 (je nach tatsächlicher Anzahl skaliert).
-- ---------------------------------------------------------------------
create or replace function generiere_pruefung(
  p_kohorte_id uuid,
  p_jahr       int,
  p_woche      int,
  p_anzahl_mc  int default 30,
  p_anzahl_ft  int default 15
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_beruf   uuid;
  v_pruef   uuid;
  v_mc      int;
  v_ft      int;
  v_pos     int := 0;
  r         record;
begin
  if not (app_is_admin() or app_rolle() in ('ausbilder','verwaltung')) then
    raise exception 'keine_berechtigung';
  end if;

  select beruf_id into v_beruf from kohorten where id = p_kohorte_id;
  if v_beruf is null then raise exception 'kohorte_unbekannt'; end if;

  -- Bereits vorhanden? (idempotent je Kohorte/Jahr/KW)
  select id into v_pruef from pruefungen
   where kohorte_id = p_kohorte_id and jahr = p_jahr and kalenderwoche = p_woche;
  if v_pruef is not null then return v_pruef; end if;

  insert into pruefungen (kohorte_id, jahr, kalenderwoche, titel, status)
  values (p_kohorte_id, p_jahr, p_woche, 'Wochenprüfung KW ' || p_woche, 'geplant')
  returning id into v_pruef;

  -- Kandidatenpool: freigegebene Fragen des Berufs, priorisiert nach
  -- kohortenweiter Schwäche (Anzahl falsch/einmal_richtig unter Mitgliedern).
  create temporary table _pool on commit drop as
  select f.id, f.typ,
         coalesce((
           select count(*) from fragen_mastery m
           join kohorten_mitglieder km on km.user_id = m.user_id and km.kohorte_id = p_kohorte_id
           where m.frage_id = f.id and m.status in ('einmal_richtig','falsch')
         ),0) as schwaeche
  from fragen f
  join themen th on th.id = f.thema_id
  join pruefungsbereiche pb on pb.id = th.pruefungsbereich_id
  where pb.beruf_id = v_beruf and f.status = 'freigegeben';

  -- MC auswählen: erst schwache, dann Rest; innerhalb zufällig
  for r in
    select id from _pool where typ = 'mc'
     order by (schwaeche > 0) desc, schwaeche desc, md5(id::text || v_pruef::text)
     limit p_anzahl_mc
  loop
    v_pos := v_pos + 1;
    insert into pruefung_fragen (pruefung_id, frage_id, position, punkte)
    values (v_pruef, r.id, v_pos, 0);  -- Punkte unten normiert
  end loop;

  -- Freitext auswählen
  for r in
    select id from _pool where typ = 'freitext'
     order by (schwaeche > 0) desc, schwaeche desc, md5(id::text || v_pruef::text)
     limit p_anzahl_ft
  loop
    v_pos := v_pos + 1;
    insert into pruefung_fragen (pruefung_id, frage_id, position, punkte)
    values (v_pruef, r.id, v_pos, 0);
  end loop;

  -- Punkte normieren: MC gesamt 40, Freitext gesamt 60 (auf Ist-Anzahl)
  select count(*) into v_mc from pruefung_fragen pf join fragen f on f.id=pf.frage_id
    where pf.pruefung_id=v_pruef and f.typ='mc';
  select count(*) into v_ft from pruefung_fragen pf join fragen f on f.id=pf.frage_id
    where pf.pruefung_id=v_pruef and f.typ='freitext';

  if v_mc > 0 then
    update pruefung_fragen pf set punkte = round(40.0 / v_mc, 4)
      from fragen f where f.id=pf.frage_id and pf.pruefung_id=v_pruef and f.typ='mc';
  end if;
  if v_ft > 0 then
    update pruefung_fragen pf set punkte = round(60.0 / v_ft, 4)
      from fragen f where f.id=pf.frage_id and pf.pruefung_id=v_pruef and f.typ='freitext';
  end if;

  return v_pruef;
end $$;

revoke all on function generiere_pruefung(uuid,int,int,int,int) from public;
grant execute on function generiere_pruefung(uuid,int,int,int,int) to authenticated;


-- ---------------------------------------------------------------------
-- Prüfung starten: legt (oder liefert) das Ergebnis des Teilnehmers an.
-- ---------------------------------------------------------------------
create or replace function pruefung_starten(p_pruefung_id uuid)
returns uuid
language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); v_erg uuid;
begin
  if v_uid is null then raise exception 'nicht angemeldet'; end if;
  -- Nur Mitglieder der Kohorte dieser Prüfung
  if not exists (
    select 1 from pruefungen p join kohorten_mitglieder km on km.kohorte_id=p.kohorte_id
     where p.id = p_pruefung_id and km.user_id = v_uid
  ) then raise exception 'keine_berechtigung'; end if;

  select id into v_erg from pruefung_ergebnisse
   where pruefung_id = p_pruefung_id and user_id = v_uid and abgegeben_am is null
   order by created_at desc limit 1;
  if v_erg is not null then return v_erg; end if;

  insert into pruefung_ergebnisse (pruefung_id, user_id, gestartet_am)
  values (p_pruefung_id, v_uid, now())
  returning id into v_erg;
  return v_erg;
end $$;

revoke all on function pruefung_starten(uuid) from public;
grant execute on function pruefung_starten(uuid) to authenticated;


-- ---------------------------------------------------------------------
-- Prüfung abgeben: MC automatisch bewerten, Freitext protokollieren
-- (Bewertung offen = AP-09). Note aus Bewertungsschlüssel des Berufs (§4.4).
-- p_antworten: [{ "frage_id": uuid, "option_id": uuid|null, "text": string|null }]
-- ---------------------------------------------------------------------
create or replace function pruefung_abgeben(p_ergebnis_id uuid, p_antworten jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid   uuid := auth.uid();
  v_pruef uuid;
  v_beruf uuid;
  v_mc_erreicht numeric := 0;
  v_mc_max      numeric := 0;
  v_ft_offen    int := 0;
  v_ft_max      numeric := 0;
  v_norm  numeric;
  v_note  smallint;
  v_grenze numeric;
  v_stufen jsonb;
  a       jsonb;
  pf      record;
  v_opt   record;
  v_korrekt boolean;
  v_erreicht numeric;
begin
  if v_uid is null then raise exception 'nicht angemeldet'; end if;
  select pruefung_id into v_pruef from pruefung_ergebnisse
   where id = p_ergebnis_id and user_id = v_uid and abgegeben_am is null;
  if v_pruef is null then raise exception 'ergebnis_unbekannt_oder_abgegeben'; end if;

  for pf in
    select pf.frage_id, pf.punkte, f.typ from pruefung_fragen pf
    join fragen f on f.id = pf.frage_id where pf.pruefung_id = v_pruef
  loop
    a := null;
    select value into a from jsonb_array_elements(coalesce(p_antworten,'[]'::jsonb)) value
      where value->>'frage_id' = pf.frage_id::text limit 1;

    if pf.typ = 'mc' then
      v_mc_max := v_mc_max + pf.punkte;
      v_korrekt := false;
      if a is not null and (a->>'option_id') is not null then
        select ist_korrekt into v_opt from antwortoptionen
          where id = (a->>'option_id')::uuid and frage_id = pf.frage_id;
        v_korrekt := coalesce(v_opt.ist_korrekt, false);
      end if;
      v_erreicht := case when v_korrekt then pf.punkte else 0 end;
      v_mc_erreicht := v_mc_erreicht + v_erreicht;
      insert into versuche (user_id, frage_id, pruefung_ergebnis_id, antwort, antwort_sprache, ist_korrekt, erzielte_punkte)
      values (v_uid, pf.frage_id, p_ergebnis_id,
              jsonb_build_object('option_id', a->>'option_id'), 'de', v_korrekt, v_erreicht);
    else
      v_ft_max := v_ft_max + pf.punkte;
      v_ft_offen := v_ft_offen + 1;  -- Bewertung durch AP-09
      insert into versuche (user_id, frage_id, pruefung_ergebnis_id, antwort, antwort_sprache, ist_korrekt, erzielte_punkte)
      values (v_uid, pf.frage_id, p_ergebnis_id,
              jsonb_build_object('text', a->>'text'), 'de', null, null);
    end if;
  end loop;

  -- Note nur, wenn keine Freitext-Bewertung aussteht
  if v_ft_offen = 0 then
    select b.stufen, b.bestehensgrenze into v_stufen, v_grenze
      from berufe be join bewertungsschluessel b on b.id = be.bewertungsschluessel_id
      join kohorten k on k.beruf_id = be.id
      join pruefungen p on p.kohorte_id = k.id where p.id = v_pruef;
    v_norm := case when (v_mc_max + v_ft_max) > 0
                   then round(100.0 * v_mc_erreicht / (v_mc_max + v_ft_max), 1) else 0 end;
    if v_stufen is not null then
      select (s->>'note')::smallint into v_note from jsonb_array_elements(v_stufen) s
        where v_norm >= (s->>'von')::numeric and v_norm <= (s->>'bis')::numeric limit 1;
    end if;
    update pruefung_ergebnisse set
      mc_punkte = v_mc_erreicht, freitext_punkte = 0, gesamtpunkte = v_norm,
      note = v_note, bestanden = (v_norm >= coalesce(v_grenze,50)),
      abgegeben_am = now(), updated_at = now()
    where id = p_ergebnis_id;
  else
    update pruefung_ergebnisse set
      mc_punkte = v_mc_erreicht, freitext_punkte = null, gesamtpunkte = null,
      note = null, bestanden = null, abgegeben_am = now(), updated_at = now()
    where id = p_ergebnis_id;
  end if;

  return jsonb_build_object(
    'mc_erreicht', v_mc_erreicht, 'mc_max', v_mc_max,
    'freitext_ausstehend', v_ft_offen, 'freitext_max', v_ft_max,
    'gesamt', case when v_ft_offen=0 then v_norm else null end,
    'note', v_note, 'bestanden', case when v_ft_offen=0 then (v_norm >= coalesce(v_grenze,50)) else null end
  );
end $$;

revoke all on function pruefung_abgeben(uuid, jsonb) from public;
grant execute on function pruefung_abgeben(uuid, jsonb) to authenticated;

-- Erzeugt: generiere_pruefung(), pruefung_starten(), pruefung_abgeben().
