import type { ContentTyp, Schwierigkeitsgrad } from './types';

/**
 * Normalisiert Content zu einem vergleichbaren Text.
 */
export function normalisiereContentText(eingabe: {
  titel: string;
  beschreibung?: string | null;
  inhalt: unknown;
  contentTyp?: ContentTyp;
  schwierigkeitsgrad?: Schwierigkeitsgrad;
}): string {
  return [eingabe.titel, eingabe.beschreibung ?? '', textAusUnbekannt(eingabe.inhalt)]
    .join(' ')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9aeoeuess\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Erstellt einen stabilen nicht-kryptografischen Hash fuer Duplikatpruefung.
 */
export function einfacherHash(text: string): string {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * Berechnet eine einfache Jaccard-Aehnlichkeit auf Wortmengen.
 */
export function textAehnlichkeit(a: string, b: string): number {
  const aSet = wortSet(a);
  const bSet = wortSet(b);
  if (aSet.size === 0 || bSet.size === 0) return 0;
  let schnitt = 0;
  for (const wort of aSet) {
    if (bSet.has(wort)) schnitt += 1;
  }
  const vereinigung = new Set([...aSet, ...bSet]).size;
  const jaccard = vereinigung === 0 ? 0 : schnitt / vereinigung;
  const containment = schnitt / Math.min(aSet.size, bSet.size);
  return Math.max(jaccard, containment);
}

/**
 * Erstellt eine Wortmenge ohne sehr kurze Fuellwoerter.
 */
export function wortSet(text: string): Set<string> {
  return new Set(text.toLowerCase().split(/\s+/).filter((wort) => wort.length >= 4));
}

/**
 * Entfernt doppelte Texte in stabiler Reihenfolge.
 */
export function eindeutige(werte: string[]): string[] {
  return [...new Set(werte)];
}

/**
 * Extrahiert Text rekursiv aus unbekannten Strukturen.
 */
function textAusUnbekannt(wert: unknown): string {
  if (wert == null) return '';
  if (typeof wert === 'string' || typeof wert === 'number' || typeof wert === 'boolean') return String(wert);
  if (Array.isArray(wert)) return wert.map(textAusUnbekannt).join(' ');
  if (typeof wert === 'object') return Object.values(wert as Record<string, unknown>).map(textAusUnbekannt).join(' ');
  return '';
}
