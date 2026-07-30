import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { baueRagKontext, mockRetrieveChunks, ragSollRetrievalNutzen, type ContentSourceMode, type RagChunkReferenz, type RagKontext } from '@bze/core/content';
import type { GeneratorRequest } from './schemas';

export type RetrievalKonfiguration = {
  ragEnabled: boolean;
  sourceMode: ContentSourceMode;
  topK: number;
  minSimilarity: number;
  mockRetrieval: boolean;
};

/**
 * Laedt RAG-Kontext fuer eine Generatoranfrage. Bei deaktiviertem RAG bleibt
 * der Kontext leer und der Generated-Modus unveraendert.
 */
export async function ladeRagKontext(
  supabase: SupabaseClient,
  request: GeneratorRequest,
  config: RetrievalKonfiguration,
): Promise<RagKontext> {
  if (!ragSollRetrievalNutzen({ ragEnabled: config.ragEnabled, sourceMode: config.sourceMode })) {
    return baueRagKontext({
      sourceMode: 'generated',
      ragEnabled: false,
      topK: config.topK,
      minSimilarity: config.minSimilarity,
      chunks: [],
    });
  }

  const query = baueRetrievalQuery(request);
  const chunks = config.mockRetrieval
    ? await ladeMockTreffer(supabase, query, config.topK, config.minSimilarity)
    : await ladeVektorTreffer(supabase, query, config.topK, config.minSimilarity);
  return baueRagKontext({
    sourceMode: config.sourceMode,
    ragEnabled: true,
    topK: config.topK,
    minSimilarity: config.minSimilarity,
    chunks,
  });
}

/**
 * Baut einen kompakten Query-Text aus Taxonomie, Lernzielen und Content-Typen.
 */
export function baueRetrievalQuery(request: GeneratorRequest): string {
  return [
    request.fachbereichName,
    request.themaName,
    request.unterthemaName,
    ...request.lernziele,
    ...request.contentTypen,
    ...request.schwierigkeitsgrade,
  ].join(' ');
}

/**
 * Laedt RLS-sichtbare Chunks per Textsuche und bewertet sie deterministisch nach.
 */
async function ladeMockTreffer(
  supabase: SupabaseClient,
  query: string,
  topK: number,
  minSimilarity: number,
): Promise<RagChunkReferenz[]> {
  const { data, error } = await supabase.rpc('search_wissens_chunks_text', {
    query_text: query,
    match_count: topK,
  });
  if (error) throw new Error(`rag_retrieval_fehlgeschlagen:${error.message}`);
  const chunks = mappeRpcTreffer(data ?? []);
  return mockRetrieveChunks({ query, chunks, topK, minSimilarity: Math.min(minSimilarity, 0.2) });
}

/**
 * Laedt RLS-sichtbare Chunks ueber pgvector, sofern Query-Embeddings verfuegbar sind.
 */
async function ladeVektorTreffer(
  supabase: SupabaseClient,
  query: string,
  topK: number,
  minSimilarity: number,
): Promise<RagChunkReferenz[]> {
  const embedding = erzeugeMockQueryEmbedding(query);
  const { data, error } = await supabase.rpc('match_wissens_chunks', {
    query_embedding: embedding,
    match_count: topK,
    match_threshold: minSimilarity,
  });
  if (error) throw new Error(`rag_vector_retrieval_fehlgeschlagen:${error.message}`);
  return mappeRpcTreffer(data ?? []);
}

/**
 * Mappt RPC-Zeilen in stabile RAG-Referenzen.
 */
function mappeRpcTreffer(rows: unknown[]): RagChunkReferenz[] {
  return rows.map((row) => {
    const eintrag = row as {
      chunk_id: string;
      quelldokument_id: string;
      chunk_index: number;
      inhalt: string;
      similarity: number;
      dokument_titel: string;
      quelle_typ: string;
      quellenreferenz: Record<string, unknown> | null;
    };
    return {
      chunkId: eintrag.chunk_id,
      quelldokumentId: eintrag.quelldokument_id,
      dokumentTitel: eintrag.dokument_titel,
      quelleTyp: eintrag.quelle_typ,
      chunkIndex: eintrag.chunk_index,
      inhalt: eintrag.inhalt,
      similarity: Math.max(0, Math.min(1, Number(eintrag.similarity) || 0)),
      quellenreferenz: eintrag.quellenreferenz ?? {},
    };
  });
}

/**
 * Erzeugt ein deterministisches Query-Embedding fuer lokale Mock-Daten.
 */
function erzeugeMockQueryEmbedding(query: string): number[] {
  const vector = new Array(1536).fill(0);
  for (let index = 0; index < query.length; index += 1) {
    const pos = index % vector.length;
    vector[pos] += query.charCodeAt(index) / 255;
  }
  const norm = Math.sqrt(vector.reduce((summe, wert) => summe + wert * wert, 0)) || 1;
  return vector.map((wert) => Number((wert / norm).toFixed(6)));
}
