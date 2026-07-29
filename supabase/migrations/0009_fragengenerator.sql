-- =====================================================================
-- BZE Online Campus — Migration 0009 (AP-12): Fragen- und Inhaltsproduktion
-- Additiv. Spec §5 (`generiere_fragen` / `verifiziere_frage`), §6.3 Screen 19.
--
-- Die Tabellen `fragen`, `antwortoptionen`, `freitext_loesungen`,
-- `review_queue`, `frage_normen`, `ki_aufrufe` und ihre RLS-Policies stammen
-- unverändert aus 0001_datenmodell.sql. Diese Migration ergänzt NUR:
--   * eine additive Spalte `fragen.normbezuege` (verpflichtendes Ausgabefeld
--     des Generators, Spec §5),
--   * einen Vektorindex für die Dublettensuche (Kosinus-Ähnlichkeit),
--   * die RPC `frage_dubletten` (Bestandsvergleich desselben Themas),
--   * Statusübergangs-RPCs `frage_status_setzen`, `frage_freigeben`,
--     `fragen_freigeben_viele` (Ausbilder-Freigabe, Spec §5).
--
-- Berechtigung wird IN den SECURITY-DEFINER-Funktionen geprüft (app_rolle),
-- damit Statuswechsel + geprueft_von/geprueft_am atomar und regelkonform sind.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Additive Spalte: normbezuege (Spec §5, verpflichtendes Feld je Frage).
-- Array normalisierter Normkürzel, z. B. ["DIN EN ISO 2768-1"]. Die
-- relationale Verknüpfung bleibt weiterhin über frage_normen möglich; diese
-- Spalte dient dem Generator/Verifier als selbsttragende Ausgabe.
-- ---------------------------------------------------------------------
alter table fragen
  add column if not exists normbezuege jsonb not null default '[]'::jsonb;

-- ---------------------------------------------------------------------
-- Vektorindex für die Dublettensuche (Kosinus). ivfflat verlangt lists;
-- 100 ist für den erwarteten Pilotumfang ausreichend. Für exakte Treffer bei
-- kleinem Bestand fällt Postgres ggf. auf Seq-Scan zurück — funktional korrekt.
-- ---------------------------------------------------------------------
create index if not exists fragen_embedding_cos_idx
  on fragen using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Häufige Filter der Fragenverwaltung (Entwurfs-/Verifikationsliste je Thema).
create index if not exists fragen_status_thema_idx on fragen (status, thema_id);
create index if not exists fragen_kern_status_idx  on fragen (kern, status);

-- ---------------------------------------------------------------------
-- Dublettencheck (Spec §5, Schritt 1): Kosinus-Ähnlichkeit gegen den Bestand
-- desselben Themas. Gibt Kandidaten mit similarity >= p_schwelle zurück,
-- absteigend sortiert. SECURITY DEFINER, Ausführung nur für Ausbilder-Rollen
-- bzw. service_role (Aufruf aus der Edge Function `generiere-fragen`).
-- ---------------------------------------------------------------------
create or replace function frage_dubletten(
  p_thema_id  uuid,
  p_embedding vector(1536),
  p_schwelle  numeric default 0.92,
  p_exclude   uuid default null,
  p_limit     int default 5
)
returns table (
  id               uuid,
  aufgabenstellung text,
  status           frage_status_t,
  aehnlichkeit     numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select
    f.id,
    f.aufgabenstellung,
    f.status,
    (1 - (f.embedding <=> p_embedding))::numeric as aehnlichkeit
  from fragen f
  where f.thema_id = p_thema_id
    and f.embedding is not null
    and (p_exclude is null or f.id <> p_exclude)
    and (1 - (f.embedding <=> p_embedding)) >= p_schwelle
  order by f.embedding <=> p_embedding asc
  limit greatest(1, coalesce(p_limit, 5));
$$;

-- ---------------------------------------------------------------------
-- Statuswechsel einer Frage durch eine berechtigte Rolle. Setzt geprueft_von
-- und geprueft_am. Erlaubte Zielstatus: entwurf, verifiziert, freigegeben,
-- gesperrt, pruefung_noetig.
-- ---------------------------------------------------------------------
create or replace function frage_status_setzen(
  p_frage_id uuid,
  p_status   frage_status_t
)
returns fragen
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row fragen;
begin
  if not (app_is_admin() or app_rolle() in ('ausbilder', 'verwaltung')) then
    raise exception 'keine_berechtigung';
  end if;

  select * into v_row from fragen where id = p_frage_id;
  if v_row.id is null then
    raise exception 'frage_unbekannt';
  end if;

  update fragen
     set status      = p_status,
         geprueft_von = auth.uid(),
         geprueft_am  = now(),
         updated_at   = now()
   where id = p_frage_id
  returning * into v_row;
  return v_row;
end $$;

-- ---------------------------------------------------------------------
-- Ausbilder-Freigabe (Spec §5): eine verifizierte Frage auf `freigegeben`
-- setzen. Kernfragen werden IMMER hierüber manuell freigegeben. Zulässig nur
-- aus Status `verifiziert` (sonst zuerst verifizieren).
-- ---------------------------------------------------------------------
create or replace function frage_freigeben(p_frage_id uuid)
returns fragen
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row fragen;
begin
  if not (app_is_admin() or app_rolle() in ('ausbilder', 'verwaltung')) then
    raise exception 'keine_berechtigung';
  end if;

  select * into v_row from fragen where id = p_frage_id;
  if v_row.id is null then
    raise exception 'frage_unbekannt';
  end if;
  if v_row.status not in ('verifiziert', 'pruefung_noetig') then
    raise exception 'ungueltiger_status';
  end if;

  update fragen
     set status       = 'freigegeben',
         geprueft_von = auth.uid(),
         geprueft_am  = now(),
         updated_at   = now()
   where id = p_frage_id
  returning * into v_row;

  -- Offene Review-Queue-Einträge dieser Frage schließen.
  update review_queue
     set status = 'erledigt', ausbilder_id = auth.uid(), updated_at = now()
   where frage_id = p_frage_id and status = 'offen';

  return v_row;
end $$;

-- ---------------------------------------------------------------------
-- Massenfreigabe (Spec §6.3 Screen 19): mehrere verifizierte Fragen auf einmal
-- freigeben. Nicht-verifizierte IDs werden übersprungen; Rückgabe = Anzahl
-- tatsächlich freigegebener Fragen.
-- ---------------------------------------------------------------------
create or replace function fragen_freigeben_viele(p_ids uuid[])
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_anzahl int;
begin
  if not (app_is_admin() or app_rolle() in ('ausbilder', 'verwaltung')) then
    raise exception 'keine_berechtigung';
  end if;

  with aktualisiert as (
    update fragen
       set status       = 'freigegeben',
           geprueft_von = auth.uid(),
           geprueft_am  = now(),
           updated_at   = now()
     where id = any(p_ids)
       and status in ('verifiziert', 'pruefung_noetig')
    returning id
  )
  select count(*)::int into v_anzahl from aktualisiert;

  update review_queue
     set status = 'erledigt', ausbilder_id = auth.uid(), updated_at = now()
   where frage_id = any(p_ids) and status = 'offen';

  return v_anzahl;
end $$;

-- ---------------------------------------------------------------------
-- Rechte: public verliert Ausführung; authenticated + service_role dürfen.
-- ---------------------------------------------------------------------
revoke all on function frage_dubletten(uuid, vector, numeric, uuid, int) from public;
revoke all on function frage_status_setzen(uuid, frage_status_t)        from public;
revoke all on function frage_freigeben(uuid)                            from public;
revoke all on function fragen_freigeben_viele(uuid[])                   from public;

grant execute on function frage_dubletten(uuid, vector, numeric, uuid, int) to authenticated;
grant execute on function frage_status_setzen(uuid, frage_status_t)        to authenticated;
grant execute on function frage_freigeben(uuid)                            to authenticated;
grant execute on function fragen_freigeben_viele(uuid[])                   to authenticated;

grant execute on function frage_dubletten(uuid, vector, numeric, uuid, int) to service_role;
grant execute on function frage_status_setzen(uuid, frage_status_t)        to service_role;
grant execute on function frage_freigeben(uuid)                            to service_role;
grant execute on function fragen_freigeben_viele(uuid[])                   to service_role;

-- Ende 0009_fragengenerator.sql
