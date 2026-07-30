-- =====================================================================
-- KI-Content-Plattform - Qualitaetspruefung und Versionierung
--
-- Additiv: getrennte pruefbare Ergebnisse und nachvollziehbare
-- Content-Snapshots fuer Regenerierungen. Sichtbarkeit bleibt unveraendert.
-- =====================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'content_qualitaetsbewertung_t') then
    create type content_qualitaetsbewertung_t as enum (
      'problematisch',
      'pruefen',
      'gute_qualitaet'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'content_qualitaetsmethode_t') then
    create type content_qualitaetsmethode_t as enum (
      'mock_regelpruefung',
      'ki_validator'
    );
  end if;
end $$;

create table if not exists content_qualitaetspruefungen (
  id uuid primary key default gen_random_uuid(),
  content_element_id uuid not null references content_elemente(id) on delete cascade,
  traeger_id uuid not null references traeger(id) on delete cascade,
  gesamt_score int not null check (gesamt_score >= 0 and gesamt_score <= 100),
  bewertung content_qualitaetsbewertung_t not null,
  kriterien jsonb not null default '[]'::jsonb,
  hinweise text[] not null default '{}'::text[],
  verbesserungsvorschlaege text[] not null default '{}'::text[],
  duplikate jsonb not null default '[]'::jsonb,
  text_hash text not null,
  pruefmethode content_qualitaetsmethode_t not null default 'mock_regelpruefung',
  modell text,
  ist_fachliche_freigabe boolean not null default false,
  geprueft_von uuid references profiles(id) on delete set null,
  geprueft_am timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists content_versionen (
  id uuid primary key default gen_random_uuid(),
  content_element_id uuid not null references content_elemente(id) on delete cascade,
  traeger_id uuid not null references traeger(id) on delete cascade,
  version_nr int not null,
  titel text not null,
  beschreibung text,
  inhalt jsonb not null default '{}'::jsonb,
  schwierigkeitsgrad schwierigkeitsgrad_t not null,
  status content_status_t not null,
  qualitaetswert numeric check (qualitaetswert is null or (qualitaetswert >= 0 and qualitaetswert <= 1)),
  aenderungsart text not null,
  begruendung text,
  erstellt_von uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (content_element_id, version_nr)
);

alter table content_qualitaetspruefungen enable row level security;
alter table content_versionen enable row level security;

drop policy if exists content_qualitaetspruefungen_read on content_qualitaetspruefungen;
create policy content_qualitaetspruefungen_read on content_qualitaetspruefungen for select using (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
);

drop policy if exists content_qualitaetspruefungen_manage on content_qualitaetspruefungen;
create policy content_qualitaetspruefungen_manage on content_qualitaetspruefungen for all using (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
) with check (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
);

drop policy if exists content_versionen_read on content_versionen;
create policy content_versionen_read on content_versionen for select using (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
);

drop policy if exists content_versionen_manage on content_versionen;
create policy content_versionen_manage on content_versionen for all using (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
) with check (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
);

create index if not exists content_qualitaetspruefungen_content_created_idx
  on content_qualitaetspruefungen (content_element_id, geprueft_am desc);
create index if not exists content_qualitaetspruefungen_traeger_score_idx
  on content_qualitaetspruefungen (traeger_id, gesamt_score, geprueft_am desc);
create index if not exists content_qualitaetspruefungen_hash_idx
  on content_qualitaetspruefungen (traeger_id, text_hash);
create index if not exists content_versionen_content_version_idx
  on content_versionen (content_element_id, version_nr desc);

grant select, insert, update, delete on content_qualitaetspruefungen to authenticated;
grant select, insert, update, delete on content_versionen to authenticated;

comment on table content_qualitaetspruefungen is
  'Informative Qualitaetspruefung fuer generierte Inhalte; kein fachlicher Freigabeentscheid.';
comment on column content_qualitaetspruefungen.ist_fachliche_freigabe is
  'Muss false bleiben: Score ist keine fachliche Freigabe und blockiert Demo-Sichtbarkeit nicht.';
comment on table content_versionen is
  'Nachvollziehbare Snapshots vor Regenerierungen oder groesseren Content-Aenderungen.';
