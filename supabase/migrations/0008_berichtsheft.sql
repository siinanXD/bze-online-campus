-- =====================================================================
-- BZE Online Campus — Migration 0008 (AP-18): Ausbildungsnachweis (Berichtsheft)
-- Additiv. Spec §3 (nachweise/nachweis_signaturen/nachweis_korrekturen),
-- §3 Regel 15 (signierte Nachweise gesperrt), §6.2.14 / §6.3.23.
--
-- Tabellen und RLS existieren bereits aus 0001_datenmodell.sql. Diese Migration
-- ergänzt NUR Helfer-RPCs für die Statusübergänge und den Korrektureintrag, damit
-- Signatur + Statuswechsel atomar und regelkonform ablaufen. SECURITY DEFINER,
-- Berechtigung wird IN der Funktion geprüft (auth.uid(), app_betreut, app_rolle).
-- =====================================================================

-- Zusätzlicher Index für die Kalender-/Lückenansicht und Ausbilderlisten.
create index if not exists nachweise_user_zeitraum_idx
  on nachweise (user_id, zeitraum_von);
create index if not exists nachweis_signaturen_nachweis_idx
  on nachweis_signaturen (nachweis_id);
create index if not exists nachweis_korrekturen_nachweis_idx
  on nachweis_korrekturen (nachweis_id);

-- ---------------------------------------------------------------------
-- Interne Berechtigungshelfer
-- ---------------------------------------------------------------------
-- Darf der Aufrufer als Betreuer (Ausbilder/Verwaltung/Admin) auf den Nachweis
-- des Teilnehmers p_teilnehmer wirken?
create or replace function nachweis_ist_betreuer(p_teilnehmer uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select app_is_admin()
      or app_rolle() = 'verwaltung'
      or (app_rolle() = 'ausbilder' and app_betreut(p_teilnehmer));
$$;

-- ---------------------------------------------------------------------
-- Teilnehmer: Nachweis einreichen (entwurf|beanstandet -> eingereicht)
-- ---------------------------------------------------------------------
create or replace function nachweis_einreichen(p_nachweis_id uuid)
returns nachweise
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row nachweise;
begin
  select * into v_row from nachweise where id = p_nachweis_id;
  if v_row.id is null then
    raise exception 'nachweis_unbekannt';
  end if;
  if v_row.user_id <> auth.uid() then
    raise exception 'keine_berechtigung';
  end if;
  if v_row.status not in ('entwurf', 'beanstandet') then
    raise exception 'ungueltiger_status';
  end if;

  update nachweise
     set status = 'eingereicht', updated_at = now()
   where id = p_nachweis_id
  returning * into v_row;
  return v_row;
end $$;

-- ---------------------------------------------------------------------
-- Teilnehmer: Nachweis signieren (eingereicht -> signiert_teilnehmer)
-- Legt eine Signaturzeile mit Hash an (Manipulationsnachweis).
-- ---------------------------------------------------------------------
create or replace function nachweis_signieren_teilnehmer(p_nachweis_id uuid, p_hash text)
returns nachweise
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row nachweise;
begin
  select * into v_row from nachweise where id = p_nachweis_id;
  if v_row.id is null then
    raise exception 'nachweis_unbekannt';
  end if;
  if v_row.user_id <> auth.uid() then
    raise exception 'keine_berechtigung';
  end if;
  if v_row.status <> 'eingereicht' then
    raise exception 'ungueltiger_status';
  end if;

  update nachweise
     set status = 'signiert_teilnehmer', updated_at = now()
   where id = p_nachweis_id
  returning * into v_row;

  insert into nachweis_signaturen (nachweis_id, user_id, rolle, hash)
  values (p_nachweis_id, auth.uid(), 'teilnehmer', p_hash);

  return v_row;
end $$;

-- ---------------------------------------------------------------------
-- Ausbilder: Nachweis gegenzeichnen (signiert_teilnehmer -> signiert_ausbilder)
-- ---------------------------------------------------------------------
create or replace function nachweis_signieren_ausbilder(p_nachweis_id uuid, p_hash text)
returns nachweise
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row nachweise;
begin
  select * into v_row from nachweise where id = p_nachweis_id;
  if v_row.id is null then
    raise exception 'nachweis_unbekannt';
  end if;
  if not nachweis_ist_betreuer(v_row.user_id) then
    raise exception 'keine_berechtigung';
  end if;
  if v_row.status <> 'signiert_teilnehmer' then
    raise exception 'ungueltiger_status';
  end if;

  update nachweise
     set status = 'signiert_ausbilder', updated_at = now()
   where id = p_nachweis_id
  returning * into v_row;

  insert into nachweis_signaturen (nachweis_id, user_id, rolle, hash)
  values (p_nachweis_id, auth.uid(), 'ausbilder', p_hash);

  return v_row;
end $$;

-- ---------------------------------------------------------------------
-- Ausbilder: Nachweis beanstanden (eingereicht|signiert_teilnehmer -> beanstandet)
-- Begründung wird als Korrektureintrag dokumentiert (ohne Inhaltsänderung).
-- ---------------------------------------------------------------------
create or replace function nachweis_beanstanden(p_nachweis_id uuid, p_begruendung text)
returns nachweise
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row nachweise;
begin
  if p_begruendung is null or length(btrim(p_begruendung)) = 0 then
    raise exception 'begruendung_fehlt';
  end if;

  select * into v_row from nachweise where id = p_nachweis_id;
  if v_row.id is null then
    raise exception 'nachweis_unbekannt';
  end if;
  if not nachweis_ist_betreuer(v_row.user_id) then
    raise exception 'keine_berechtigung';
  end if;
  if v_row.status not in ('eingereicht', 'signiert_teilnehmer') then
    raise exception 'ungueltiger_status';
  end if;

  insert into nachweis_korrekturen (nachweis_id, geaendert_von, vorher, nachher, begruendung)
  values (p_nachweis_id, auth.uid(), v_row.inhalt, v_row.inhalt, p_begruendung);

  update nachweise
     set status = 'beanstandet', updated_at = now()
   where id = p_nachweis_id
  returning * into v_row;
  return v_row;
end $$;

-- ---------------------------------------------------------------------
-- Ausbilder: Korrektur eines signierten Nachweises (Spec §3 Regel 15).
-- Signierte Blätter sind gesperrt; Änderung nur mit dokumentierter Begründung.
-- Status bleibt unverändert.
-- ---------------------------------------------------------------------
create or replace function nachweis_korrektur(
  p_nachweis_id uuid,
  p_nachher jsonb,
  p_begruendung text
)
returns nachweise
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row nachweise;
begin
  if p_begruendung is null or length(btrim(p_begruendung)) = 0 then
    raise exception 'begruendung_fehlt';
  end if;

  select * into v_row from nachweise where id = p_nachweis_id;
  if v_row.id is null then
    raise exception 'nachweis_unbekannt';
  end if;
  if not nachweis_ist_betreuer(v_row.user_id) then
    raise exception 'keine_berechtigung';
  end if;
  if v_row.status not in ('signiert_teilnehmer', 'signiert_ausbilder') then
    raise exception 'ungueltiger_status';
  end if;

  insert into nachweis_korrekturen (nachweis_id, geaendert_von, vorher, nachher, begruendung)
  values (p_nachweis_id, auth.uid(), v_row.inhalt, p_nachher, p_begruendung);

  update nachweise
     set inhalt = p_nachher, updated_at = now()
   where id = p_nachweis_id
  returning * into v_row;
  return v_row;
end $$;

-- ---------------------------------------------------------------------
-- Rechte: nur angemeldete Nutzer + Service-Role. public verliert Ausführung.
-- ---------------------------------------------------------------------
revoke all on function nachweis_ist_betreuer(uuid) from public;
revoke all on function nachweis_einreichen(uuid) from public;
revoke all on function nachweis_signieren_teilnehmer(uuid, text) from public;
revoke all on function nachweis_signieren_ausbilder(uuid, text) from public;
revoke all on function nachweis_beanstanden(uuid, text) from public;
revoke all on function nachweis_korrektur(uuid, jsonb, text) from public;

grant execute on function nachweis_einreichen(uuid) to authenticated;
grant execute on function nachweis_signieren_teilnehmer(uuid, text) to authenticated;
grant execute on function nachweis_signieren_ausbilder(uuid, text) to authenticated;
grant execute on function nachweis_beanstanden(uuid, text) to authenticated;
grant execute on function nachweis_korrektur(uuid, jsonb, text) to authenticated;

grant execute on function nachweis_einreichen(uuid) to service_role;
grant execute on function nachweis_signieren_teilnehmer(uuid, text) to service_role;
grant execute on function nachweis_signieren_ausbilder(uuid, text) to service_role;
grant execute on function nachweis_beanstanden(uuid, text) to service_role;
grant execute on function nachweis_korrektur(uuid, jsonb, text) to service_role;
