import { z } from 'zod';
import { einfacherHash } from './quality';

export const WISSENSQUELLE_TYPEN = ['pdf', 'docx', 'markdown', 'text', 'url', 'manueller_fachtext'] as const;
export const WISSENSDOKUMENT_STATUS = [
  'neu',
  'hochgeladen',
  'parsing',
  'geparst',
  'chunking',
  'indexiert',
  'fehler',
  'deaktiviert',
  'geloescht',
] as const;
export const WISSENS_INDEX_STATUS = ['nicht_noetig', 'ausstehend', 'mock_indexiert', 'indexiert', 'fehler'] as const;

export const WISSENS_BUCKET = 'wissensdatenbank';
export const WISSENS_MAX_DATEIGROESSE_BYTES = 10 * 1024 * 1024;
export const WISSENS_CHUNK_ZIEL_ZEICHEN = 900;
export const WISSENS_CHUNK_UEBERLAPPUNG_ZEICHEN = 120;
export const WISSENS_EMBEDDING_DIMENSION = 1536;

export const wissensquelleTypSchema = z.enum(WISSENSQUELLE_TYPEN);
export const wissensdokumentStatusSchema = z.enum(WISSENSDOKUMENT_STATUS);
export const wissensIndexStatusSchema = z.enum(WISSENS_INDEX_STATUS);

export type WissensquelleTyp = z.infer<typeof wissensquelleTypSchema>;
export type WissensdokumentStatus = z.infer<typeof wissensdokumentStatusSchema>;
export type WissensIndexStatus = z.infer<typeof wissensIndexStatusSchema>;

export type WissensDateiValidierung = {
  ok: true;
  quelleTyp: WissensquelleTyp;
  mimeType: string;
} | {
  ok: false;
  fehler: 'datei_fehlt' | 'datei_zu_gross' | 'dateityp_nicht_erlaubt';
};

export type WissensChunk = {
  chunkIndex: number;
  inhalt: string;
  tokenSchaetzung: number;
  textHash: string;
  quellenreferenz: {
    abschnitt: number;
    startZeichen: number;
    endZeichen: number;
  };
  embeddingMetadaten: {
    provider: 'mock';
    modell: 'mock-embedding-v1';
    dimension: number;
    textHash: string;
  };
};

const DATEITYPEN: Record<string, { quelleTyp: WissensquelleTyp; mimeType: string }> = {
  '.txt': { quelleTyp: 'text', mimeType: 'text/plain' },
  '.md': { quelleTyp: 'markdown', mimeType: 'text/markdown' },
  '.markdown': { quelleTyp: 'markdown', mimeType: 'text/markdown' },
  '.pdf': { quelleTyp: 'pdf', mimeType: 'application/pdf' },
  '.docx': {
    quelleTyp: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
};

/**
 * Bereinigt Dateinamen fuer Storage-Pfade ohne aktive Inhalte oder Pfadwechsel.
 */
export function bereinigeDateiname(dateiname: string): string {
  const basis = dateiname
    .normalize('NFKD')
    .replace(/[^\w.\- ]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/\.+/g, '.')
    .replace(/^[-.]+|[-.]+$/g, '')
    .toLowerCase();
  return basis.length > 0 ? basis.slice(0, 140) : 'wissensdokument.txt';
}

/**
 * Bestimmt den vorbereiteten Wissensquellentyp aus Dateiname und MIME-Type.
 */
export function erkenneWissensquelleTyp(dateiname: string, mimeType = ''): WissensquelleTyp | null {
  const name = dateiname.toLowerCase();
  const extension = Object.keys(DATEITYPEN).find((ende) => name.endsWith(ende));
  if (extension) return DATEITYPEN[extension]?.quelleTyp ?? null;
  if (mimeType === 'text/plain') return 'text';
  if (mimeType === 'text/markdown') return 'markdown';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
  return null;
}

/**
 * Validiert Upload-Dateien fuer die erste Wissensdatenbank-Stufe.
 */
export function validiereWissensdatei(input: {
  name: string;
  size: number;
  type?: string;
} | null | undefined): WissensDateiValidierung {
  if (!input || input.size <= 0) return { ok: false, fehler: 'datei_fehlt' };
  if (input.size > WISSENS_MAX_DATEIGROESSE_BYTES) return { ok: false, fehler: 'datei_zu_gross' };
  const quelleTyp = erkenneWissensquelleTyp(input.name, input.type ?? '');
  if (!quelleTyp) return { ok: false, fehler: 'dateityp_nicht_erlaubt' };
  const erwartung = Object.values(DATEITYPEN).find((wert) => wert.quelleTyp === quelleTyp);
  return { ok: true, quelleTyp, mimeType: input.type || erwartung?.mimeType || 'application/octet-stream' };
}

/**
 * Meldet, ob der Quellentyp in diesem ersten Stand direkt geparst wird.
 */
export function istDirektParsebarerWissensTyp(typ: WissensquelleTyp): boolean {
  return typ === 'text' || typ === 'markdown' || typ === 'manueller_fachtext';
}

/**
 * Entfernt gefaehrliche Steuerzeichen und normalisiert Abstand im Fachtext.
 */
export function bereinigeWissenstext(text: string): string {
  return text
    .replace(/\u0000/g, '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((zeile) => zeile.trimEnd())
    .join('\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();
}

/**
 * Erzeugt deterministische Chunks aus bereinigtem Text.
 */
export function erstelleWissensChunks(
  text: string,
  optionen: { zielZeichen?: number; ueberlappungZeichen?: number } = {},
): WissensChunk[] {
  const bereinigt = bereinigeWissenstext(text);
  if (!bereinigt) return [];
  const ziel = optionen.zielZeichen ?? WISSENS_CHUNK_ZIEL_ZEICHEN;
  const ueberlappung = Math.min(optionen.ueberlappungZeichen ?? WISSENS_CHUNK_UEBERLAPPUNG_ZEICHEN, Math.floor(ziel / 3));
  const abschnitte = bereinigt.split(/\n{2,}/).filter(Boolean);
  const chunks: WissensChunk[] = [];
  let puffer = '';
  let start = 0;
  let cursor = 0;

  for (const abschnitt of abschnitte) {
    const trennzeichen = puffer ? '\n\n' : '';
    if ((puffer + trennzeichen + abschnitt).length > ziel && puffer) {
      chunks.push(erstelleChunk(chunks.length, puffer, start, cursor));
      const rest = puffer.slice(Math.max(0, puffer.length - ueberlappung));
      start = Math.max(0, cursor - rest.length);
      puffer = rest ? `${rest}\n\n${abschnitt}` : abschnitt;
    } else {
      puffer = `${puffer}${trennzeichen}${abschnitt}`;
    }
    cursor += abschnitt.length + 2;
  }

  if (puffer.trim()) chunks.push(erstelleChunk(chunks.length, puffer, start, cursor));
  return chunks;
}

/**
 * Erstellt Mock-Embedding-Metadaten ohne externen Anbieter.
 */
export function mockEmbeddingMetadaten(textHash: string): WissensChunk['embeddingMetadaten'] {
  return {
    provider: 'mock',
    modell: 'mock-embedding-v1',
    dimension: WISSENS_EMBEDDING_DIMENSION,
    textHash,
  };
}

/**
 * Erzeugt einen stabilen Storage-Pfad mit Tenant-Prefix.
 */
export function wissensStoragePfad(input: { traegerId: string; dokumentId: string; dateiname: string }): string {
  return `${input.traegerId}/${input.dokumentId}/${bereinigeDateiname(input.dateiname)}`;
}

/**
 * Baut einen einzelnen Chunk-Datensatz aus Text und Zeichenbereich.
 */
function erstelleChunk(index: number, text: string, start: number, ende: number): WissensChunk {
  const inhalt = bereinigeWissenstext(text);
  const textHash = einfacherHash(inhalt);
  return {
    chunkIndex: index,
    inhalt,
    tokenSchaetzung: Math.max(1, Math.ceil(inhalt.length / 4)),
    textHash,
    quellenreferenz: {
      abschnitt: index + 1,
      startZeichen: start,
      endZeichen: Math.max(start, ende),
    },
    embeddingMetadaten: mockEmbeddingMetadaten(textHash),
  };
}
