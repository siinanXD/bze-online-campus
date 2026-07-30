-- =====================================================================
-- KI-Content-Plattform - optionales RAG fuer Content-Generierung
--
-- Additiv und deaktiviert per Default. Generated-Modus bleibt ohne
-- Retrieval nutzbar; Knowledge-Base/Hybrid nutzen RLS-sichtbare Chunks.
-- =====================================================================

alter table content_generation_jobs
  add column if not exists source_mode text not null default 'generated'
    check (source_mode in ('generated', 'knowledge_base', 'hybrid')),
  add column if not exists rag_enabled boolean not null default false,
  add column if not exists rag_context_json jsonb not null default '{}'::jsonb,
  add column if not exists rag_warnungen text[] not null default '{}'::text[];

alter table content_elemente
  add column if not exists source_mode text not null default 'generated'
    check (source_mode in ('generated', 'knowledge_base', 'hybrid')),
  add column if not exists rag_chunk_ids uuid[] not null default '{}'::uuid[],
  add column if not exists rag_context_metadaten jsonb not null default '{}'::jsonb;

alter table fragen
  add column if not exists source_mode text not null default 'generated'
    check (source_mode in ('generated', 'knowledge_base', 'hybrid')),
  add column if not exists rag_chunk_ids uuid[] not null default '{}'::uuid[],
  add column if not exists rag_context_metadaten jsonb not null default '{}'::jsonb;

-- Keyword-Index fuer Mock-/Fallback-Retrieval ohne externen Embedding-Anbieter.
alter table wissens_chunks
  add column if not exists suche_de tsvector generated always as (to_tsvector('german', coalesce(inhalt, ''))) stored;

create index if not exists wissens_chunks_suche_de_idx on wissens_chunks using gin (suche_de);

-- RLS-bewusste Vektorsuche. SECURITY INVOKER stellt sicher, dass Policies
-- auf wissens_chunks und quelldokumente nicht umgangen werden.
create or replace function match_wissens_chunks(
  query_embedding vector(1536),
  match_count int default 6,
  match_threshold double precision default 0.72
)
returns table (
  chunk_id uuid,
  quelldokument_id uuid,
  traeger_id uuid,
  chunk_index int,
  inhalt text,
  similarity double precision,
  dokument_titel text,
  quelle_typ wissensquelle_typ_t,
  quellenreferenz jsonb
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    c.id as chunk_id,
    c.quelldokument_id,
    c.traeger_id,
    c.chunk_index,
    c.inhalt,
    1 - (c.embedding <=> query_embedding) as similarity,
    d.titel as dokument_titel,
    d.quelle_typ,
    c.quellenreferenz
  from wissens_chunks c
  join quelldokumente d on d.id = c.quelldokument_id
  where c.aktiv
    and d.aktiv
    and d.dokument_status = 'indexiert'
    and c.embedding is not null
    and 1 - (c.embedding <=> query_embedding) >= match_threshold
  order by c.embedding <=> query_embedding
  limit least(greatest(match_count, 1), 12)
$$;

-- RLS-bewusster Fallback fuer Mock-Retrieval und lokale Tests.
create or replace function search_wissens_chunks_text(
  query_text text,
  match_count int default 6
)
returns table (
  chunk_id uuid,
  quelldokument_id uuid,
  traeger_id uuid,
  chunk_index int,
  inhalt text,
  similarity double precision,
  dokument_titel text,
  quelle_typ wissensquelle_typ_t,
  quellenreferenz jsonb
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    c.id as chunk_id,
    c.quelldokument_id,
    c.traeger_id,
    c.chunk_index,
    c.inhalt,
    ts_rank_cd(c.suche_de, websearch_to_tsquery('german', query_text))::double precision as similarity,
    d.titel as dokument_titel,
    d.quelle_typ,
    c.quellenreferenz
  from wissens_chunks c
  join quelldokumente d on d.id = c.quelldokument_id
  where c.aktiv
    and d.aktiv
    and d.dokument_status = 'indexiert'
    and c.suche_de @@ websearch_to_tsquery('german', query_text)
  order by ts_rank_cd(c.suche_de, websearch_to_tsquery('german', query_text)) desc, c.created_at desc
  limit least(greatest(match_count, 1), 12)
$$;

grant execute on function match_wissens_chunks(vector(1536), int, double precision) to authenticated;
grant execute on function search_wissens_chunks_text(text, int) to authenticated;

create index if not exists content_generation_jobs_source_mode_idx
  on content_generation_jobs (traeger_id, source_mode, rag_enabled, created_at desc);
create index if not exists content_elemente_rag_chunks_idx
  on content_elemente using gin (rag_chunk_ids);
create index if not exists fragen_rag_chunks_idx
  on fragen using gin (rag_chunk_ids);

comment on function match_wissens_chunks(vector(1536), int, double precision) is
  'RLS-bewusste pgvector-Suche fuer optionales RAG. Liefert nur sichtbare aktive Wissenschunks.';
comment on function search_wissens_chunks_text(text, int) is
  'RLS-bewusster Text-Fallback fuer Mock-Retrieval und Tests ohne echte Embeddings.';
comment on column content_elemente.source_mode is
  'generated, knowledge_base oder hybrid; RAG bleibt optional und wird nicht fuer den Campus vorausgesetzt.';
comment on column content_elemente.rag_chunk_ids is
  'Tatsaechlich verwendete Wissensdatenbank-Chunks fuer nachvollziehbare Quellenanzeige.';
