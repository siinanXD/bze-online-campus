import type { ContentStatus, ContentTyp, Schwierigkeitsgrad } from './types';

export const REGENERIERUNGS_VARIANTEN = [
  'einfacher',
  'schwieriger',
  'praxisnaeher',
  'kuerzer',
  'ausfuehrlicher',
  'praeziser',
] as const;

export type RegenerierungsVariante = (typeof REGENERIERUNGS_VARIANTEN)[number];

export type ContentSnapshot = {
  titel: string;
  beschreibung: string | null;
  contentTyp: ContentTyp;
  inhalt: unknown;
  schwierigkeitsgrad: Schwierigkeitsgrad;
  status: ContentStatus;
  qualitaetswert: number | null;
};

export type RegeneriertesContentErgebnis = {
  titel: string;
  beschreibung: string | null;
  inhalt: unknown;
  schwierigkeitsgrad: Schwierigkeitsgrad;
  begruendung: string;
};

/**
 * Baut eine einfache deterministische Variante eines Content-Elements.
 */
export function regeneriereContentVariante(snapshot: ContentSnapshot, variante: RegenerierungsVariante): RegeneriertesContentErgebnis {
  const schwierigkeitsgrad = passeSchwierigkeitAn(snapshot.schwierigkeitsgrad, variante);
  const inhalt = passeInhaltAn(snapshot.inhalt, variante);
  return {
    titel: titelMitVariante(snapshot.titel, variante),
    beschreibung: beschreibungMitVariante(snapshot.beschreibung, variante),
    inhalt,
    schwierigkeitsgrad,
    begruendung: `Regenerierung: ${variante}`,
  };
}

/**
 * Baut den naechsten Versions-Snapshot aus dem aktuellen Content.
 */
export function erstelleVersionsSnapshot(snapshot: ContentSnapshot, versionNr: number, aenderungsart: string): {
  versionNr: number;
  titel: string;
  beschreibung: string | null;
  inhalt: unknown;
  schwierigkeitsgrad: Schwierigkeitsgrad;
  status: ContentStatus;
  qualitaetswert: number | null;
  aenderungsart: string;
} {
  return {
    versionNr,
    titel: snapshot.titel,
    beschreibung: snapshot.beschreibung,
    inhalt: snapshot.inhalt,
    schwierigkeitsgrad: snapshot.schwierigkeitsgrad,
    status: snapshot.status,
    qualitaetswert: snapshot.qualitaetswert,
    aenderungsart,
  };
}

/**
 * Passt die Schwierigkeit fuer einfache Varianten an.
 */
function passeSchwierigkeitAn(aktuell: Schwierigkeitsgrad, variante: RegenerierungsVariante): Schwierigkeitsgrad {
  if (variante === 'einfacher') return 'einfach';
  if (variante === 'schwieriger') return 'schwer';
  return aktuell;
}

/**
 * Passt strukturierte Inhalte rekursiv textuell an.
 */
function passeInhaltAn(inhalt: unknown, variante: RegenerierungsVariante): unknown {
  if (typeof inhalt === 'string') return passeTextAn(inhalt, variante);
  if (Array.isArray(inhalt)) return inhalt.map((wert) => passeInhaltAn(wert, variante));
  if (typeof inhalt === 'object' && inhalt !== null) {
    return Object.fromEntries(
      Object.entries(inhalt as Record<string, unknown>).map(([key, value]) => [
        key,
        typeof value === 'string' && istTextfeld(key) ? passeTextAn(value, variante) : passeInhaltAn(value, variante),
      ]),
    );
  }
  return inhalt;
}

/**
 * Erkennt Textfelder, die bei Regenerierung angepasst werden duerfen.
 */
function istTextfeld(key: string): boolean {
  return ['mdx', 'text', 'aufgabe', 'erklaerung', 'situation', 'aufgabenstellung', 'rueckseite', 'musterloesung'].includes(key);
}

/**
 * Erzeugt eine textuelle Variante.
 */
function passeTextAn(text: string, variante: RegenerierungsVariante): string {
  const trimmed = text.trim();
  if (!trimmed) return text;
  if (variante === 'kuerzer') return trimmed.split(/\n\n+/).slice(0, 2).join('\n\n');
  if (variante === 'ausfuehrlicher') return `${trimmed}\n\nErgaenzung: Nenne einen konkreten Arbeitsschritt, eine Kontrolle und einen moeglichen Fehler aus der betrieblichen Praxis.`;
  if (variante === 'praxisnaeher') return `${trimmed}\n\nPraxisbezug: Beziehe dich auf Auftrag, Maschine, Werkstoff, Werkzeug oder Pruefplan.`;
  if (variante === 'praeziser') return `${trimmed}\n\nPraezisierung: Vermeide pauschale Aussagen und benenne Bedingungen, Beispielwerte oder Grenzen klar.`;
  if (variante === 'einfacher') return `${trimmed}\n\nEinfacher formuliert: kurze Saetze, ein Beispiel, ein zentraler Fachbegriff.`;
  return `${trimmed}\n\nVertiefung: Begruende die Entscheidung und nenne eine typische Fehlerursache.`;
}

/**
 * Ergaenzt ein Variantenlabel im Titel ohne bestehende Titel zu zerstoeren.
 */
function titelMitVariante(titel: string, variante: RegenerierungsVariante): string {
  return `${titel.replace(/\s+\((einfacher|schwieriger|praxisnaeher|kuerzer|ausfuehrlicher|praeziser)\)$/i, '')} (${variante})`;
}

/**
 * Ergaenzt eine kurze Beschreibung der Variante.
 */
function beschreibungMitVariante(beschreibung: string | null, variante: RegenerierungsVariante): string | null {
  const basis = beschreibung?.trim() || 'Generierter Content wurde angepasst.';
  return `${basis} Variante: ${variante}.`;
}
