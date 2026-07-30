/**
 * Abzeichen: sichtbare Meilensteine ohne Wettbewerb.
 *
 * Bewusst kein Ranking und keine Bestenliste. Die Gruppen sind klein und
 * sprachlich gemischt; ein öffentlicher Vergleich würde vor allem die
 * demotivieren, die ihn am wenigsten brauchen. Abzeichen messen deshalb nur
 * gegen die eigene Vergangenheit.
 */

import type { AbzeichenRegel, AbzeichenStand, Kennzahlen } from './types.ts';

/**
 * Regelwerk des Erstpiloten.
 *
 * Die Codes sind Übersetzungsschlüssel-Stämme; Titel und Beschreibung liegen in
 * `messages/*.json` unter `fortschritt.abzeichen.<code>`. So bleibt die Domain
 * sprachfrei und die 6 Sprachen bleiben pflegbar.
 */
export const ABZEICHEN_REGELN: readonly AbzeichenRegel[] = [
  { code: 'serie3', kennzahl: 'serie', schwelle: 3, punkte: 10 },
  { code: 'serie7', kennzahl: 'serie', schwelle: 7, punkte: 25 },
  { code: 'serie30', kennzahl: 'serie', schwelle: 30, punkte: 100 },
  { code: 'kern50', kennzahl: 'kernfragen', schwelle: 50, punkte: 20 },
  { code: 'kern250', kennzahl: 'kernfragen', schwelle: 250, punkte: 60 },
  { code: 'thema1', kennzahl: 'themen', schwelle: 1, punkte: 15 },
  { code: 'thema5', kennzahl: 'themen', schwelle: 5, punkte: 50 },
  { code: 'pruefung1', kennzahl: 'wochenpruefungen', schwelle: 1, punkte: 15 },
  { code: 'pruefung4', kennzahl: 'wochenpruefungen', schwelle: 4, punkte: 40 },
  { code: 'nachweis4', kennzahl: 'nachweise', schwelle: 4, punkte: 30 },
];

const LEERE_KENNZAHLEN: Kennzahlen = {
  serie: 0,
  kernfragen: 0,
  wochenpruefungen: 0,
  nachweise: 0,
  themen: 0,
};

/** Liest eine Kennzahl und fängt fehlende oder unsinnige Werte ab. */
function kennzahlWert(kennzahlen: Partial<Kennzahlen>, name: AbzeichenRegel['kennzahl']): number {
  const wert = kennzahlen[name];
  if (typeof wert !== 'number' || !Number.isFinite(wert)) return 0;
  return Math.max(0, wert);
}

/** Bewertet eine einzelne Regel gegen die Kennzahlen. */
export function bewerteAbzeichen(
  regel: AbzeichenRegel,
  kennzahlen: Partial<Kennzahlen>,
): AbzeichenStand {
  const wert = kennzahlWert(kennzahlen, regel.kennzahl);
  // Schwelle 0 oder negativ wäre immer erfüllt und damit sinnlos — als 1 lesen.
  const schwelle = Math.max(1, regel.schwelle);
  const erreicht = wert >= schwelle;
  return {
    code: regel.code,
    punkte: regel.punkte,
    erreicht,
    anteil: Math.min(1, wert / schwelle),
    rest: erreicht ? 0 : schwelle - wert,
  };
}

/**
 * Bewertet alle Regeln und sortiert für die Anzeige.
 *
 * Erreichte zuerst (als Bestätigung), danach die noch offenen nach Nähe zum
 * Ziel — was fast geschafft ist, gehört nach oben.
 */
export function bewerteAlleAbzeichen(
  kennzahlen: Partial<Kennzahlen>,
  regeln: readonly AbzeichenRegel[] = ABZEICHEN_REGELN,
): AbzeichenStand[] {
  return regeln
    .map((regel) => bewerteAbzeichen(regel, kennzahlen))
    .sort((a, b) => {
      if (a.erreicht !== b.erreicht) return a.erreicht ? -1 : 1;
      return b.anteil - a.anteil;
    });
}

/** Summe der Punkte aus erreichten Abzeichen. */
export function abzeichenPunkte(staende: readonly AbzeichenStand[]): number {
  return staende.filter((s) => s.erreicht).reduce((summe, s) => summe + s.punkte, 0);
}

/**
 * Welche Abzeichen sind durch den letzten Schritt neu dazugekommen?
 *
 * Grundlage für die Feier direkt im Fragen-Runner: der Aufrufer vergleicht die
 * Kennzahlen vor und nach dem Versuch und bekommt nur die Codes, die gekippt
 * sind. Eine Liste aller erreichten Abzeichen wäre dafür unbrauchbar.
 */
export function neueAbzeichen(
  vorher: Partial<Kennzahlen>,
  nachher: Partial<Kennzahlen>,
  regeln: readonly AbzeichenRegel[] = ABZEICHEN_REGELN,
): AbzeichenStand[] {
  const vorherErreicht = new Set(
    bewerteAlleAbzeichen(vorher, regeln).filter((s) => s.erreicht).map((s) => s.code),
  );
  return bewerteAlleAbzeichen(nachher, regeln).filter(
    (s) => s.erreicht && !vorherErreicht.has(s.code),
  );
}

/** Kennzahlen mit allen Feldern, für Aufrufer die einen vollständigen Satz brauchen. */
export function vollstaendigeKennzahlen(teil: Partial<Kennzahlen>): Kennzahlen {
  return { ...LEERE_KENNZAHLEN, ...teil };
}
