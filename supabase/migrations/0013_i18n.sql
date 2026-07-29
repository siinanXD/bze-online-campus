-- =====================================================================
-- 0013_i18n.sql — AP-14 Mehrsprachigkeit Vollausbau
--
-- ADDITIV. Bestehende Migrationen (insb. 0001_datenmodell.sql) werden nie
-- geaendert. Diese Migration ergaenzt ausschliesslich:
--   1. Tabelle `lerneinheiten_uebersetzungen` (Pendant zu `fragen_uebersetzungen`
--      aus 0001, dort existiert kein Uebersetzungsziel fuer Lerneinheiten).
--   2. RLS-Policies + updated_at-Trigger fuer die neue Tabelle.
--   3. SECURITY-DEFINER-RPCs zur Ausbilderfreigabe von Uebersetzungen
--      (Spec §5: „unfreigegeben bis Ausbilderbestaetigung").
--
-- `fragen_uebersetzungen` stammt bereits vollstaendig aus 0001 (inkl. RLS) und
-- wird von der Edge Function `uebersetze-frage` befuellt.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Uebersetzungen fuer Lerneinheiten (Fachkunde)
--    Prüfungsinhalte/Fachkunde bleiben Deutsch (Quelle in `lerneinheiten`);
--    Uebersetzungen erscheinen ausschliesslich ZUSAETZLICH und dauerhaft
--    gecacht, unfreigegeben bis Ausbilderbestaetigung.
-- ---------------------------------------------------------------------
create table if not exists lerneinheiten_uebersetzungen (
  lerneinheit_id uuid not null references lerneinheiten(id) on delete cascade,
  sprache        text not null,
  titel          text,
  abschnitte     jsonb,        -- [{titel,inhalt,minuten}] analog lerneinheiten.abschnitte
  freigegeben    boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  primary key (lerneinheit_id, sprache)
);

comment on table lerneinheiten_uebersetzungen is
  'AP-14: Zusatz-Uebersetzungen zu freigegebenen Lerneinheiten. Deutsch bleibt Quelle. Erst nach Ausbilderfreigabe (freigegeben=true) fuer Teilnehmer sichtbar.';

alter table lerneinheiten_uebersetzungen enable row level security;

-- updated_at pflegen (set_updated_at stammt aus 0001).
drop trigger if exists trg_lerneinheiten_uebersetzungen_updated on lerneinheiten_uebersetzungen;
create trigger trg_lerneinheiten_uebersetzungen_updated
  before update on lerneinheiten_uebersetzungen
  for each row execute function set_updated_at();

-- Lesen: freigegebene Uebersetzung fuer alle; sonst nur Ausbilder/Verwaltung/Admin
-- (Muster wie fue_read fuer fragen_uebersetzungen in 0001).
drop policy if exists leu_read on lerneinheiten_uebersetzungen;
create policy leu_read on lerneinheiten_uebersetzungen for select using (
  freigegeben or app_is_admin() or app_rolle() in ('ausbilder','verwaltung')
);

-- Verwalten: nur Ausbilder/Verwaltung/Admin (Edge Function nutzt service_role und
-- umgeht RLS; diese Policy schuetzt Client-Zugriffe).
drop policy if exists leu_manage on lerneinheiten_uebersetzungen;
create policy leu_manage on lerneinheiten_uebersetzungen for all using (
  app_is_admin() or app_rolle() in ('ausbilder','verwaltung')
) with check (
  app_is_admin() or app_rolle() in ('ausbilder','verwaltung')
);

-- ---------------------------------------------------------------------
-- 2) Ausbilderfreigabe von Uebersetzungen (Spec §5)
--    SECURITY DEFINER, Rollenpruefung intern ueber app_rolle/app_is_admin.
--    Setzt `freigegeben` und gibt die betroffene Zeilenzahl zurueck.
-- ---------------------------------------------------------------------
create or replace function frage_uebersetzung_freigeben(
  p_frage_id uuid,
  p_sprache  text default null   -- NULL = alle Sprachen dieser Frage
) returns int
language plpgsql security definer set search_path = public as $$
declare
  v_count int;
begin
  if not (app_is_admin() or app_rolle() in ('ausbilder','verwaltung')) then
    raise exception 'nicht_berechtigt' using errcode = '42501';
  end if;

  update fragen_uebersetzungen
     set freigegeben = true
   where frage_id = p_frage_id
     and (p_sprache is null or sprache = p_sprache)
     and freigegeben = false;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

create or replace function lerneinheit_uebersetzung_freigeben(
  p_lerneinheit_id uuid,
  p_sprache        text default null  -- NULL = alle Sprachen dieser Lerneinheit
) returns int
language plpgsql security definer set search_path = public as $$
declare
  v_count int;
begin
  if not (app_is_admin() or app_rolle() in ('ausbilder','verwaltung')) then
    raise exception 'nicht_berechtigt' using errcode = '42501';
  end if;

  update lerneinheiten_uebersetzungen
     set freigegeben = true
   where lerneinheit_id = p_lerneinheit_id
     and (p_sprache is null or sprache = p_sprache)
     and freigegeben = false;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function frage_uebersetzung_freigeben(uuid, text) from public;
revoke all on function lerneinheit_uebersetzung_freigeben(uuid, text) from public;
grant execute on function frage_uebersetzung_freigeben(uuid, text) to authenticated;
grant execute on function lerneinheit_uebersetzung_freigeben(uuid, text) to authenticated;
