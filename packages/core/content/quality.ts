import { pruefeKriterium } from './quality-criteria';
import {
  QUALITAETS_KRITERIEN,
  type DuplikatTreffer,
  type QualitaetsBewertung,
  type QualitaetsPruefungEingabe,
  type QualitaetsPruefungErgebnis,
} from './quality-types';
import { einfacherHash, eindeutige, normalisiereContentText, textAehnlichkeit } from './quality-text';

export {
  QUALITAETS_KRITERIEN,
  type DuplikatTreffer,
  type QualitaetsBewertung,
  type QualitaetsKriterium,
  type QualitaetsKriteriumErgebnis,
  type QualitaetsMethode,
  type QualitaetsPruefungEingabe,
  type QualitaetsPruefungErgebnis,
  type QualitaetsStatus,
} from './quality-types';
export { einfacherHash, normalisiereContentText, textAehnlichkeit } from './quality-text';

/**
 * Bewertet einen Score nach den Plattform-Schwellen.
 */
export function qualitaetsBewertung(score: number): QualitaetsBewertung {
  if (score < 60) return 'problematisch';
  if (score < 80) return 'pruefen';
  return 'gute_qualitaet';
}

/**
 * Fuehrt eine deterministische informative Qualitaetspruefung aus.
 */
export function pruefeContentQualitaet(eingabe: QualitaetsPruefungEingabe): QualitaetsPruefungErgebnis {
  const text = normalisiereContentText(eingabe);
  const duplikate = findeDuplikate(eingabe, eingabe.bestehendeInhalte ?? []);
  const kriterien = QUALITAETS_KRITERIEN.map((kriterium) => pruefeKriterium(kriterium, eingabe, text, duplikate));
  const problemAbzug = kriterien.filter((kriterium) => kriterium.status === 'problem').length * 8;
  const mittelwert = kriterien.reduce((summe, kriterium) => summe + kriterium.score, 0) / kriterien.length;
  const gesamtScore = Math.max(0, Math.min(100, Math.round(mittelwert) - problemAbzug));

  return {
    gesamtScore,
    bewertung: qualitaetsBewertung(gesamtScore),
    kriterien,
    hinweise: eindeutige(kriterien.flatMap((kriterium) => kriterium.hinweise)),
    verbesserungsvorschlaege: eindeutige(kriterien.flatMap((kriterium) => kriterium.verbesserungsvorschlaege)),
    duplikate,
    textHash: einfacherHash(text),
    geprueftAm: eingabe.geprueftAm ?? new Date().toISOString(),
    pruefmethode: eingabe.pruefmethode ?? 'mock_regelpruefung',
    modell: eingabe.modell ?? null,
    istFachlicheFreigabe: false,
  };
}

/**
 * Findet Duplikate ueber Hash und einfache Textaehnlichkeit.
 */
export function findeDuplikate(
  eingabe: Omit<QualitaetsPruefungEingabe, 'bestehendeInhalte'>,
  bestehendeInhalte: Array<{ id: string; titel: string; beschreibung?: string | null; inhalt: unknown }>,
): DuplikatTreffer[] {
  const text = normalisiereContentText(eingabe);
  const hash = einfacherHash(text);
  return bestehendeInhalte
    .filter((bestand) => bestand.id !== eingabe.id)
    .map((bestand) => {
      const bestandText = normalisiereContentText({
        titel: bestand.titel,
        beschreibung: bestand.beschreibung,
        contentTyp: eingabe.contentTyp,
        schwierigkeitsgrad: eingabe.schwierigkeitsgrad,
        inhalt: bestand.inhalt,
      });
      const bestandHash = einfacherHash(bestandText);
      if (bestandHash === hash) return { contentId: bestand.id, titel: bestand.titel, score: 1, methode: 'hash' as const };

      const score = textAehnlichkeit(text, bestandText);
      return score >= 0.68 ? { contentId: bestand.id, titel: bestand.titel, score, methode: 'textaehnlichkeit' as const } : null;
    })
    .filter((treffer): treffer is DuplikatTreffer => treffer !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
