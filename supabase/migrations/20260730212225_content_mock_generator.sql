-- =====================================================================
-- KI-Content-Plattform - Mock-Generator
--
-- Additiv: protokolliert Generator-Jobs serverseitig und ergaenzt eine
-- konkrete Quellenart fuer lokal erzeugte Mock-KI-Inhalte.
-- =====================================================================

alter type content_quellenart_t add value if not exists 'mock_ai';

do $$
begin
  if not exists (select 1 from pg_type where typname = 'content_generation_job_status_t') then
    create type content_generation_job_status_t as enum (
      'entwurf',
      'laeuft',
      'abgeschlossen',
      'teilweise_gespeichert',
      'gespeichert',
      'fehlgeschlagen',
      'verworfen'
    );
  end if;
end $$;

create table if not exists content_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  traeger_id uuid not null references traeger(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  provider text not null,
  modell text,
  status content_generation_job_status_t not null default 'entwurf',
  request_json jsonb not null default '{}'::jsonb,
  preview_json jsonb not null default '{}'::jsonb,
  gespeicherte_content_ids uuid[] not null default '{}'::uuid[],
  fehlertext text,
  latenz_ms int,
  input_tokens int,
  output_tokens int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_content_generation_jobs_updated on content_generation_jobs;
create trigger trg_content_generation_jobs_updated before update on content_generation_jobs
  for each row execute function set_updated_at();

alter table content_generation_jobs enable row level security;

drop policy if exists content_generation_jobs_read on content_generation_jobs;
create policy content_generation_jobs_read on content_generation_jobs for select using (
  app_is_admin() or (app_rolle() = 'verwaltung' and traeger_id = app_traeger())
);

drop policy if exists content_generation_jobs_manage on content_generation_jobs;
create policy content_generation_jobs_manage on content_generation_jobs for all using (
  app_is_admin() or (app_rolle() = 'verwaltung' and traeger_id = app_traeger())
) with check (
  app_is_admin() or (app_rolle() = 'verwaltung' and traeger_id = app_traeger())
);

create index if not exists content_generation_jobs_traeger_status_idx
  on content_generation_jobs (traeger_id, status, created_at desc);
create index if not exists content_generation_jobs_user_created_idx
  on content_generation_jobs (user_id, created_at desc);

grant select, insert, update, delete on content_generation_jobs to authenticated;

comment on table content_generation_jobs is
  'Serverseitige Job- und Preview-Ablage fuer KI-/Mock-Content-Generierung ohne Client-Secrets.';
comment on column content_generation_jobs.preview_json is
  'Validierte strukturierte Vorschau; wird erst nach explizitem Speichern in Content-Tabellen uebernommen.';
