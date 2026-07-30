import type { ContentTyp } from '@bze/core/content';

export type ContentElementView = {
  id: string;
  titel: string;
  content_typ: ContentTyp;
  inhalt: unknown;
  lerneinheit_id: string | null;
  frage_id: string | null;
  ist_demo: boolean;
  demo_label: string | null;
  fachlich_verifiziert: boolean;
};

export type ContentGruppen = {
  einfuehrungen: ContentElementView[];
  erklaerungen: ContentElementView[];
  lernkarten: ContentElementView[];
  uebungen: ContentElementView[];
  praxisfaelle: ContentElementView[];
  rechenaufgaben: ContentElementView[];
  zusammenfassungen: ContentElementView[];
  sonstige: ContentElementView[];
};

export type RechenaufgabeView = {
  aufgabe: string;
  gegebeneWerte: string[];
  gesuchteGroesse: string;
  formel: string;
  loesungsweg: string;
  ergebnis: string;
  erklaerung: string;
};

export type Lernschritt = {
  href: string;
  titel: string;
  beschreibung: string;
};

type ReihenfolgeThema = {
  id: string;
  bezeichnung: string;
  reihenfolge: number;
};

const CONTENT_REIHENFOLGE: Record<ContentTyp, number> = {
  erklaerung: 10,
  lernkarte: 20,
  single_choice: 30,
  multiple_choice: 31,
  freitext: 32,
  rechenaufgabe: 40,
  praxisfall: 50,
  pruefungsnahe_uebungsfrage: 60,
  zusammenfassung: 70,
};

/**
 * Sortiert Modulelemente fachlich stabil, weil `content_elemente` selbst noch keine Reihenfolge
 * besitzt.
 */
export function sortiereContentElemente<T extends ContentElementView>(elemente: T[]): T[] {
  return [...elemente].sort((a, b) => {
    const typVergleich = CONTENT_REIHENFOLGE[a.content_typ] - CONTENT_REIHENFOLGE[b.content_typ];
    if (typVergleich !== 0) return typVergleich;
    return a.titel.localeCompare(b.titel, 'de');
  });
}

/**
 * Legt fest, welche Content-Typen in welchen Abschnitt der Lernmodul-Seite gehoeren.
 */
export function gruppiereContentElemente(elemente: ContentElementView[]): ContentGruppen {
  const sortiert = sortiereContentElemente(elemente);
  const erklaerungen = sortiert.filter((element) => element.content_typ === 'erklaerung');
  return {
    einfuehrungen: erklaerungen.slice(0, 1),
    erklaerungen: erklaerungen.slice(1),
    lernkarten: sortiert.filter((element) => element.content_typ === 'lernkarte'),
    uebungen: sortiert.filter((element) =>
      ['single_choice', 'multiple_choice', 'freitext', 'pruefungsnahe_uebungsfrage'].includes(element.content_typ),
    ),
    praxisfaelle: sortiert.filter((element) => element.content_typ === 'praxisfall'),
    rechenaufgaben: sortiert.filter((element) => element.content_typ === 'rechenaufgabe'),
    zusammenfassungen: sortiert.filter((element) => element.content_typ === 'zusammenfassung'),
    sonstige: sortiert.filter((element) => !CONTENT_REIHENFOLGE[element.content_typ]),
  };
}

/**
 * Prueft, ob ein Element den verpflichtenden Demo-Warnhinweis braucht.
 */
export function istUngepruefterDemoInhalt(element: Pick<ContentElementView, 'ist_demo' | 'fachlich_verifiziert'>): boolean {
  return element.ist_demo && !element.fachlich_verifiziert;
}

/**
 * Extrahiert MDX- oder Textinhalt aus dem generischen `content_elemente.inhalt`.
 */
export function extrahiereTextinhalt(inhalt: unknown): string {
  if (!istRecord(inhalt)) return '';
  const wert = inhalt.mdx ?? inhalt.text ?? inhalt.erklaerung ?? inhalt.zusammenfassung;
  return typeof wert === 'string' ? wert.trim() : '';
}

/**
 * Baut Merkpunkte aus einer Markdown-Aufzaehlung oder liefert eine knappe Fallback-Liste.
 */
export function extrahiereMerkpunkte(inhalt: unknown): string[] {
  const text = extrahiereTextinhalt(inhalt);
  const punkte = text
    .split(/\r?\n/)
    .map((zeile) => zeile.trim())
    .filter((zeile) => zeile.startsWith('- '))
    .map((zeile) => zeile.slice(2).trim())
    .filter(Boolean);
  return punkte;
}

/**
 * Normalisiert Rechenaufgaben aus alten und neuen Seed-Strukturen fuer die UI.
 */
export function extrahiereRechenaufgabe(inhalt: unknown): RechenaufgabeView {
  const record = istRecord(inhalt) ? inhalt : {};
  const loesung = text(record.loesung);
  const ergebnisAusLoesung = loesung.includes('=') ? loesung.split('=').at(-1)?.trim() ?? '' : '';
  return {
    aufgabe: text(record.aufgabe, 'Keine Aufgabe hinterlegt.'),
    gegebeneWerte: liste(record.gegebene_werte ?? record.gegebeneWerte),
    gesuchteGroesse: text(record.gesuchte_groesse ?? record.gesuchteGroesse, 'Gesuchter Wert'),
    formel: text(record.formel, loesung.includes('=') ? loesung.split('=').slice(0, 2).join('=').trim() : 'Passende Formel auswaehlen'),
    loesungsweg: text(record.loesungsweg ?? record.loesungsweg_text, loesung || 'Rechenweg noch nicht hinterlegt.'),
    ergebnis: text(record.ergebnis, ergebnisAusLoesung || 'Ergebnis im Loesungsweg angegeben.'),
    erklaerung: text(record.erklaerung ?? record.hinweis, 'Beispielwerte ersetzen keine freigegebene Quelle.'),
  };
}

/**
 * Ermittelt den naechsten sinnvollen Lernschritt ohne eigene Fortschrittslogik aufzubauen.
 */
export function ermittleNaechstenLernschritt(
  locale: string,
  aktuellesUnterthemaId: string,
  geschwister: ReihenfolgeThema[],
): Lernschritt {
  const sortiert = [...geschwister].sort((a, b) => a.reihenfolge - b.reihenfolge || a.bezeichnung.localeCompare(b.bezeichnung, 'de'));
  const index = sortiert.findIndex((thema) => thema.id === aktuellesUnterthemaId);
  const naechstes = index >= 0 ? sortiert[index + 1] : null;
  if (naechstes) {
    return {
      href: `/${locale}/campus/topic/${naechstes.id}/modul`,
      titel: naechstes.bezeichnung,
      beschreibung: 'Naechstes Unterthema im gleichen Themenbereich',
    };
  }
  return {
    href: `/${locale}/campus/lernen/thema/${aktuellesUnterthemaId}`,
    titel: 'Quiz starten',
    beschreibung: 'Fragen mit der bestehenden Mastery-Logik ueben',
  };
}

/**
 * Erkennt einfache Objektwerte.
 */
function istRecord(wert: unknown): wert is Record<string, unknown> {
  return typeof wert === 'object' && wert !== null && !Array.isArray(wert);
}

/**
 * Normalisiert unbekannte Werte zu Text.
 */
function text(wert: unknown, fallback = ''): string {
  return typeof wert === 'string' && wert.trim().length > 0 ? wert.trim() : fallback;
}

/**
 * Normalisiert unbekannte Werte zu einer Textliste.
 */
function liste(wert: unknown): string[] {
  if (Array.isArray(wert)) {
    return wert.filter((eintrag): eintrag is string => typeof eintrag === 'string' && eintrag.trim().length > 0);
  }
  return typeof wert === 'string' && wert.trim().length > 0 ? [wert.trim()] : [];
}
