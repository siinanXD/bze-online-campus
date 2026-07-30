import { z } from 'zod';
import { einfacherHash, textAehnlichkeit } from './quality';

export const CONTENT_SOURCE_MODES = ['generated', 'knowledge_base', 'hybrid'] as const;
export const RAG_DEFAULT_TOP_K = 6;
export const RAG_MAX_TOP_K = 12;
export const RAG_DEFAULT_MIN_SIMILARITY = 0.72;
export const RAG_MIN_KONTEXT_ZEICHEN = 240;

export const contentSourceModeSchema = z.enum(CONTENT_SOURCE_MODES);
export type ContentSourceMode = z.infer<typeof contentSourceModeSchema>;

export type RagChunkReferenz = {
  chunkId: string;
  quelldokumentId: string;
  dokumentTitel: string;
  quelleTyp: string;
  chunkIndex: number;
  inhalt: string;
  similarity: number;
  quellenreferenz: Record<string, unknown>;
};

export type RagKontext = {
  sourceMode: ContentSourceMode;
  ragEnabled: boolean;
  topK: number;
  minSimilarity: number;
  chunks: RagChunkReferenz[];
  verwendeteChunkIds: string[];
  dokumente: Array<{
    id: string;
    titel: string;
    quelleTyp: string;
  }>;
  kontextText: string;
  ausreichend: boolean;
  warnungen: string[];
};

export const ragChunkReferenzSchema: z.ZodType<RagChunkReferenz> = z.object({
  chunkId: z.string().uuid(),
  quelldokumentId: z.string().uuid(),
  dokumentTitel: z.string().trim().min(1),
  quelleTyp: z.string().trim().min(1),
  chunkIndex: z.number().int().min(0),
  inhalt: z.string().trim().min(1),
  similarity: z.number().min(0).max(1),
  quellenreferenz: z.record(z.unknown()),
});

export const ragKontextSchema: z.ZodType<RagKontext> = z.object({
  sourceMode: contentSourceModeSchema,
  ragEnabled: z.boolean(),
  topK: z.number().int().min(1).max(RAG_MAX_TOP_K),
  minSimilarity: z.number().min(0).max(1),
  chunks: z.array(ragChunkReferenzSchema).max(RAG_MAX_TOP_K),
  verwendeteChunkIds: z.array(z.string().uuid()).max(RAG_MAX_TOP_K),
  dokumente: z.array(z.object({
    id: z.string().uuid(),
    titel: z.string().trim().min(1),
    quelleTyp: z.string().trim().min(1),
  })).max(RAG_MAX_TOP_K),
  kontextText: z.string(),
  ausreichend: z.boolean(),
  warnungen: z.array(z.string()),
});

/**
 * Entscheidet, ob fuer den Modus Retrieval ausgefuehrt werden soll.
 */
export function ragSollRetrievalNutzen(input: { ragEnabled: boolean; sourceMode: ContentSourceMode }): boolean {
  return input.ragEnabled && input.sourceMode !== 'generated';
}

/**
 * Normalisiert Top-K auf eine kleine, kontrollierte Ergebnismenge.
 */
export function normalisiereRagTopK(wert: unknown): number {
  const zahl = typeof wert === 'number' ? wert : Number(wert);
  if (!Number.isFinite(zahl)) return RAG_DEFAULT_TOP_K;
  return Math.max(1, Math.min(RAG_MAX_TOP_K, Math.trunc(zahl)));
}

/**
 * Normalisiert die Mindest-Aehnlichkeit fuer Retrieval.
 */
export function normalisiereRagMinSimilarity(wert: unknown): number {
  const zahl = typeof wert === 'number' ? wert : Number(wert);
  if (!Number.isFinite(zahl)) return RAG_DEFAULT_MIN_SIMILARITY;
  return Math.max(0, Math.min(1, zahl));
}

/**
 * Baut aus Treffern einen kompakten Kontext mit Quellenreferenzen.
 */
export function baueRagKontext(input: {
  sourceMode: ContentSourceMode;
  ragEnabled: boolean;
  topK: number;
  minSimilarity: number;
  chunks: RagChunkReferenz[];
}): RagKontext {
  const chunks = input.chunks
    .filter((chunk) => chunk.similarity >= input.minSimilarity)
    .slice(0, input.topK);
  const dokumente = new Map<string, { id: string; titel: string; quelleTyp: string }>();
  for (const chunk of chunks) {
    dokumente.set(chunk.quelldokumentId, {
      id: chunk.quelldokumentId,
      titel: chunk.dokumentTitel,
      quelleTyp: chunk.quelleTyp,
    });
  }
  const kontextText = chunks
    .map((chunk, index) => [
      `[Quelle ${index + 1}] ${chunk.dokumentTitel}, Chunk ${chunk.chunkIndex + 1}, ID ${chunk.chunkId}`,
      chunk.inhalt,
    ].join('\n'))
    .join('\n\n---\n\n');
  const warnungen = bestimmeRagWarnungen(input.sourceMode, chunks, kontextText);
  return ragKontextSchema.parse({
    sourceMode: input.sourceMode,
    ragEnabled: input.ragEnabled,
    topK: input.topK,
    minSimilarity: input.minSimilarity,
    chunks,
    verwendeteChunkIds: chunks.map((chunk) => chunk.chunkId),
    dokumente: [...dokumente.values()],
    kontextText,
    ausreichend: warnungen.length === 0,
    warnungen,
  });
}

/**
 * Fuehrt deterministisches Mock-Retrieval ueber Text-Aehnlichkeit aus.
 */
export function mockRetrieveChunks(input: {
  query: string;
  chunks: RagChunkReferenz[];
  topK?: number;
  minSimilarity?: number;
}): RagChunkReferenz[] {
  const topK = normalisiereRagTopK(input.topK ?? RAG_DEFAULT_TOP_K);
  const minSimilarity = normalisiereRagMinSimilarity(input.minSimilarity ?? 0.15);
  return input.chunks
    .map((chunk) => ({
      ...chunk,
      similarity: Math.max(chunk.similarity, textAehnlichkeit(input.query, chunk.inhalt)),
    }))
    .filter((chunk) => chunk.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity || a.chunkIndex - b.chunkIndex)
    .slice(0, topK);
}

/**
 * Erzeugt eine stabile Query-Signatur fuer Retrieval-Metadaten.
 */
export function ragQueryHash(query: string): string {
  return einfacherHash(query);
}

/**
 * Liefert Warnungen fuer fehlenden oder schwachen RAG-Kontext.
 */
function bestimmeRagWarnungen(sourceMode: ContentSourceMode, chunks: RagChunkReferenz[], kontextText: string): string[] {
  const warnungen: string[] = [];
  if (chunks.length === 0) {
    warnungen.push('Keine passenden Wissensdatenbank-Treffer gefunden.');
  }
  if (kontextText.length > 0 && kontextText.length < RAG_MIN_KONTEXT_ZEICHEN) {
    warnungen.push('Der gefundene Kontext ist wahrscheinlich zu kurz fuer belastbare Fachbehauptungen.');
  }
  if (sourceMode === 'knowledge_base' && warnungen.length > 0) {
    warnungen.push('Knowledge-Base-Modus: unbelegte fachliche Ergaenzungen sind nicht erlaubt.');
  }
  if (sourceMode === 'hybrid' && warnungen.length > 0) {
    warnungen.push('Hybrid-Modus: KI darf nur klar als Ergaenzung formulieren, nicht als belegte Quelle.');
  }
  return warnungen;
}
