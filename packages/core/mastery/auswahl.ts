import type { LernFrage, MasteryState } from './types';

export interface FrageMitStand { frage: LernFrage; mastery: MasteryState | null }

/**
 * Reihenfolge im Lernmodus (Spec §4.1 Priorität):
 *   1. zuletzt falsch beantwortete Fragen (sofort fällig)
 *   2. neue Fragen (noch nie beantwortet)
 *   3. `einmal_richtig`, deren nächste Fälligkeit erreicht ist (Spacing)
 * `abgeschlossen` sowie noch nicht fällige `einmal_richtig` werden nicht gezeigt.
 * Nur MC (Freitext wird KI-bewertet in der Wochenprüfung geübt).
 */
export function lernqueue(items: FrageMitStand[], jetzt: Date = new Date()): LernFrage[] {
  const prio = (it: FrageMitStand): number => {
    const m = it.mastery;
    if (it.frage.typ !== 'mc') return -1;
    if (!m || m.status === 'neu') return 2;
    if (m.status === 'falsch') return 1;
    if (m.status === 'einmal_richtig') {
      const faellig = !m.naechste_faelligkeit || new Date(m.naechste_faelligkeit) <= jetzt;
      return faellig ? 3 : -1;
    }
    return -1; // abgeschlossen
  };
  return items
    .map((it) => ({ it, p: prio(it) }))
    .filter((x) => x.p > 0)
    .sort((a, b) => a.p - b.p)
    .map((x) => x.it.frage);
}

/** Kern-Fortschritt eines Themas (0..1) für die Anzeige. */
export function themaFortschritt(items: FrageMitStand[]): { fertig: number; gesamt: number; anteil: number } {
  const kern = items.filter((i) => i.frage.kern);
  const fertig = kern.filter((i) => i.mastery?.status === 'abgeschlossen').length;
  const gesamt = kern.length;
  return { fertig, gesamt, anteil: gesamt ? fertig / gesamt : 0 };
}
