/**
 * Nutzlast: aus einem Anlass wird eine anzeigbare Benachrichtigung.
 *
 * Die Domain liefert **keine fertigen Sätze**, sondern Übersetzungsschlüssel und
 * Platzhalterwerte. Der Versender setzt sie in der Sprache der Person zusammen.
 * Das ist bei sechs Sprachen samt Arabisch (rechtsläufig) der einzige Weg, der
 * ohne doppelte Textpflege auskommt.
 */

import { ANLASS_DRINGLICHKEIT } from './anlaesse.ts';
import type { Anlass, GeplanteBenachrichtigung, PlanungsEingabe } from './types.ts';

/** Wohin die Benachrichtigung führt — Pfad ohne Sprachpräfix. */
const ZIELPFAD: Readonly<Record<Anlass, string>> = {
  faellige_wiederholung: '/campus/lernen',
  serie_gefaehrdet: '/campus/lernen',
  tagesziel_offen: '/campus/lernen',
  wochenpruefung_offen: '/campus/pruefung',
  nachweis_luecke: '/campus/berichtsheft',
  nachweis_entschieden: '/campus/berichtsheft',
  wochenbericht_bereit: '/campus',
};

/**
 * Platzhalterwerte je Anlass.
 *
 * Bei fälligen Wiederholungen wird zwischen „Fehler" und „Fragen" unterschieden:
 * frühere Fehler sind der stärkere Anlass und bekommen ihren eigenen Text.
 */
function werteFuer(anlass: Anlass, eingabe: PlanungsEingabe): Record<string, number | string> {
  switch (anlass) {
    case 'faellige_wiederholung':
      return { anzahl: eingabe.faelligGesamt, fehler: eingabe.faelligFalsch };
    case 'serie_gefaehrdet':
      return { tage: eingabe.serienLaenge };
    case 'tagesziel_offen':
      return { offen: eingabe.tageszielOffen };
    case 'nachweis_luecke':
      return { anzahl: eingabe.nachweisLuecken };
    case 'nachweis_entschieden':
      return { anzahl: eingabe.offeneEntscheidungen };
    default:
      return {};
  }
}

/**
 * Übersetzungsschlüssel-Stamm für einen Anlass.
 *
 * Fällige Wiederholungen haben zwei Varianten: mit früheren Fehlern („Vier
 * Fragen von letzter Woche warten") und ohne („Zwölf Fragen sind fällig").
 */
function schluesselStamm(anlass: Anlass, eingabe: PlanungsEingabe): string {
  if (anlass === 'faellige_wiederholung' && eingabe.faelligFalsch > 0) {
    return 'push.faellige_wiederholung_fehler';
  }
  return `push.${anlass}`;
}

/**
 * Baut die vollständige Benachrichtigung zu einem Anlass.
 *
 * Das `tag`-Feld entspricht dem Anlass, damit eine neue Meldung die alte auf dem
 * Gerät ersetzt statt sie zu stapeln.
 */
export function baueNutzlast(
  anlass: Anlass,
  eingabe: PlanungsEingabe,
): GeplanteBenachrichtigung {
  const stamm = schluesselStamm(anlass, eingabe);
  return {
    userId: eingabe.userId,
    anlass,
    dringlichkeit: ANLASS_DRINGLICHKEIT[anlass],
    titelKey: `${stamm}.titel`,
    textKey: `${stamm}.text`,
    werte: werteFuer(anlass, eingabe),
    pfad: ZIELPFAD[anlass],
    tag: `bze-${anlass}`,
  };
}
