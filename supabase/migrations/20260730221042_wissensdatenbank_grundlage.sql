-- =====================================================================
-- KI-Content-Plattform - optionale Wissensdatenbank-Grundlage
--
-- Additiv und optional: Der Campus und die Content-Generierung bleiben
-- ohne Wissensdatenbank funktionsfaehig. RAG wird hier nicht aktiviert.
-- =====================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'wissensquelle_typ_t') then
    create type wissensquelle_typ_t as enum (
      'pdf',
      'docx',
      'markdown',
      'text',
      'url',
      'manueller_fachtext'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'wissensdokument_status_t') then
    create type wissensdokument_status_t as enum (
      'neu',
      'hochgeladen',
      'parsing',
      'geparst',
      'chunking',
      'indexiert',
      'fehler',
      'deaktiviert',
      'geloescht'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'wissens_index_status_t') then
    create type wissens_index_status_t as enum (
      'nicht_noetig',
      'ausstehend',
      'mock_indexiert',
      'indexiert',
      'fehler'
    );
  end if;
end $$;

create table if not exists wissensquellen (
  id uuid primary key default gen_random_uuid(),
  traeger_id uuid not null references traeger(id) on delete cascade,
  titel text not null,
  beschreibung text,
  quelle_typ wissensquelle_typ_t not null,
  url text,
  aktiv boolean not null default true,
  erstellt_von uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table quelldokumente
  add column if not exists wissensquelle_id uuid references wissensquellen(id) on delete set null,
  add column if not exists titel text,
  add column if not exists beschreibung text,
  add column if not exists quelle_typ wissensquelle_typ_t,
  add column if not exists dokument_status wissensdokument_status_t not null default 'neu',
  add column if not exists index_status wissens_index_status_t not null default 'ausstehend',
  add column if not exists aktiv boolean not null default true,
  add column if not exists ursprungs_url text,
  add column if not exists original_dateiname text,
  add column if not exists mime_type text,
  add column if not exists dateigroesse_bytes bigint check (dateigroesse_bytes is null or dateigroesse_bytes >= 0),
  add column if not exists text_hash text,
  add column if not exists rohtext text,
  add column if not exists bereinigter_text text,
  add column if not exists chunk_anzahl int not null default 0 check (chunk_anzahl >= 0),
  add column if not exists embedding_anbieter text,
  add column if not exists embedding_modell text,
  add column if not exists embedding_dimension int,
  add column if not exists embedding_mock boolean not null default false,
  add column if not exists verarbeitungsmetadaten jsonb not null default '{}'::jsonb,
  add column if not exists verarbeitet_am timestamptz,
  add column if not exists updated_at timestamptz not null default now();

update quelldokumente
   set titel = coalesce(titel, dateiname),
       original_dateiname = coalesce(original_dateiname, dateiname),
       quelle_typ = coalesce(quelle_typ, case
         when lower(coalesce(typ, dateiname)) like '%.pdf' then 'pdf'::wissensquelle_typ_t
         when lower(coalesce(typ, dateiname)) like '%.docx' then 'docx'::wissensquelle_typ_t
         when lower(coalesce(typ, dateiname)) like '%.md' then 'markdown'::wissensquelle_typ_t
         else 'text'::wissensquelle_typ_t
       end)
 where titel is null or original_dateiname is null or quelle_typ is null;

alter table quelldokumente
  alter column titel set not null,
  alter column quelle_typ set not null;

create table if not exists wissens_chunks (
  id uuid primary key default gen_random_uuid(),
  quelldokument_id uuid not null references quelldokumente(id) on delete cascade,
  traeger_id uuid not null references traeger(id) on delete cascade,
  chunk_index int not null check (chunk_index >= 0),
  inhalt text not null,
  token_schaetzung int not null default 0 check (token_schaetzung >= 0),
  text_hash text not null,
  embedding vector(1536),
  embedding_metadaten jsonb not null default '{}'::jsonb,
  quellenreferenz jsonb not null default '{}'::jsonb,
  aktiv boolean not null default true,
  created_at timestamptz not null default now(),
  unique (quelldokument_id, chunk_index)
);

create table if not exists wissens_verarbeitungsfehler (
  id uuid primary key default gen_random_uuid(),
  quelldokument_id uuid references quelldokumente(id) on delete cascade,
  traeger_id uuid not null references traeger(id) on delete cascade,
  phase text not null,
  fehlercode text not null,
  meldung text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

drop trigger if exists trg_wissensquellen_updated on wissensquellen;
create trigger trg_wissensquellen_updated before update on wissensquellen
  for each row execute function set_updated_at();

drop trigger if exists trg_quelldokumente_updated on quelldokumente;
create trigger trg_quelldokumente_updated before update on quelldokumente
  for each row execute function set_updated_at();

alter table wissensquellen enable row level security;
alter table wissens_chunks enable row level security;
alter table wissens_verarbeitungsfehler enable row level security;

drop policy if exists wissensquellen_read on wissensquellen;
create policy wissensquellen_read on wissensquellen for select using (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
);

drop policy if exists wissensquellen_manage on wissensquellen;
create policy wissensquellen_manage on wissensquellen for all using (
  app_is_admin() or (app_rolle() = 'verwaltung' and traeger_id = app_traeger())
) with check (
  app_is_admin() or (app_rolle() = 'verwaltung' and traeger_id = app_traeger())
);

drop policy if exists quelldokumente_read on quelldokumente;
create policy quelldokumente_read on quelldokumente for select using (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
);

drop policy if exists quelldokumente_manage on quelldokumente;
create policy quelldokumente_manage on quelldokumente for all using (
  app_is_admin() or (app_rolle() = 'verwaltung' and traeger_id = app_traeger())
) with check (
  app_is_admin() or (app_rolle() = 'verwaltung' and traeger_id = app_traeger())
);

drop policy if exists wissens_chunks_read on wissens_chunks;
create policy wissens_chunks_read on wissens_chunks for select using (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
);

drop policy if exists wissens_chunks_manage on wissens_chunks;
create policy wissens_chunks_manage on wissens_chunks for all using (
  app_is_admin() or (app_rolle() = 'verwaltung' and traeger_id = app_traeger())
) with check (
  app_is_admin() or (app_rolle() = 'verwaltung' and traeger_id = app_traeger())
);

drop policy if exists wissens_verarbeitungsfehler_read on wissens_verarbeitungsfehler;
create policy wissens_verarbeitungsfehler_read on wissens_verarbeitungsfehler for select using (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
);

drop policy if exists wissens_verarbeitungsfehler_manage on wissens_verarbeitungsfehler;
create policy wissens_verarbeitungsfehler_manage on wissens_verarbeitungsfehler for all using (
  app_is_admin() or (app_rolle() = 'verwaltung' and traeger_id = app_traeger())
) with check (
  app_is_admin() or (app_rolle() = 'verwaltung' and traeger_id = app_traeger())
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wissensdatenbank',
  'wissensdatenbank',
  false,
  10485760,
  array[
    'text/plain',
    'text/markdown',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
  set public = false,
      file_size_limit = 10485760,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists storage_wissensdatenbank_read on storage.objects;
create policy storage_wissensdatenbank_read on storage.objects for select to authenticated using (
  bucket_id = 'wissensdatenbank'
  and (
    app_is_admin()
    or (
      app_rolle() in ('ausbilder','verwaltung')
      and (storage.foldername(name))[1] = app_traeger()::text
    )
  )
);

drop policy if exists storage_wissensdatenbank_insert on storage.objects;
create policy storage_wissensdatenbank_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'wissensdatenbank'
  and (
    app_is_admin()
    or (
      app_rolle() = 'verwaltung'
      and (storage.foldername(name))[1] = app_traeger()::text
    )
  )
);

drop policy if exists storage_wissensdatenbank_update on storage.objects;
create policy storage_wissensdatenbank_update on storage.objects for update to authenticated using (
  bucket_id = 'wissensdatenbank'
  and (
    app_is_admin()
    or (
      app_rolle() = 'verwaltung'
      and (storage.foldername(name))[1] = app_traeger()::text
    )
  )
) with check (
  bucket_id = 'wissensdatenbank'
  and (
    app_is_admin()
    or (
      app_rolle() = 'verwaltung'
      and (storage.foldername(name))[1] = app_traeger()::text
    )
  )
);

drop policy if exists storage_wissensdatenbank_delete on storage.objects;
create policy storage_wissensdatenbank_delete on storage.objects for delete to authenticated using (
  bucket_id = 'wissensdatenbank'
  and (
    app_is_admin()
    or (
      app_rolle() = 'verwaltung'
      and (storage.foldername(name))[1] = app_traeger()::text
    )
  )
);

create index if not exists wissensquellen_traeger_typ_idx on wissensquellen (traeger_id, quelle_typ, aktiv);
create index if not exists quelldokumente_wissen_traeger_status_idx on quelldokumente (traeger_id, dokument_status, aktiv, created_at desc);
create index if not exists quelldokumente_wissen_quelle_idx on quelldokumente (wissensquelle_id);
create index if not exists wissens_chunks_dokument_idx on wissens_chunks (quelldokument_id, chunk_index);
create index if not exists wissens_chunks_traeger_hash_idx on wissens_chunks (traeger_id, text_hash);
create index if not exists wissens_chunks_embedding_idx on wissens_chunks using ivfflat (embedding vector_cosine_ops) where embedding is not null;
create index if not exists wissens_fehler_dokument_idx on wissens_verarbeitungsfehler (quelldokument_id, created_at desc);

grant select, insert, update, delete on wissensquellen to authenticated;
grant select, insert, update, delete on quelldokumente to authenticated;
grant select, insert, update, delete on wissens_chunks to authenticated;
grant select, insert, update, delete on wissens_verarbeitungsfehler to authenticated;

comment on table wissensquellen is
  'Optionale Wissensdatenbank-Quellen. Nicht Voraussetzung fuer Content-Generierung; RAG bleibt per Env deaktiviert.';
comment on table wissens_chunks is
  'Bereinigte Textabschnitte fuer optionale spaetere Suche/RAG. Embeddings koennen mock oder echt sein.';
comment on column quelldokumente.dokument_status is
  'Parsing-/Verarbeitungsstatus fuer die optionale Wissensdatenbank.';
comment on column quelldokumente.embedding_mock is
  'Kennzeichnet deterministische Mock-Embeddings, wenn kein echter Anbieter konfiguriert ist.';
