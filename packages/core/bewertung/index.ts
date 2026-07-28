export type PruefFrageTyp = 'mc' | 'freitext';

export interface PruefOption { id: string; text: string; reihenfolge: number }
export interface PruefFrage {
  id: string;
  typ: PruefFrageTyp;
  aufgabenstellung: string;
  position: number;
  punkte: number;
  optionen: PruefOption[];
}
/** Antwort im Prüfungsmodus (Freitext nur Deutsch, §8). */
export interface PruefAntwort { frage_id: string; option_id?: string | null; text?: string | null }

export interface AbgabeErgebnis {
  mc_erreicht: number; mc_max: number;
  freitext_ausstehend: number; freitext_max: number;
  gesamt: number | null; note: number | null; bestanden: boolean | null;
}

export interface NotenStufe { von: number; bis: number; note: number; bezeichnung: string }

/** Notenbezeichnung zu einem 0..100-Wert (Anzeige; DB berechnet die Note). */
export function noteBezeichnung(stufen: NotenStufe[], score: number): NotenStufe | null {
  return stufen.find((s) => score >= s.von && score <= s.bis) ?? null;
}

/** Verbleibende Sekunden aus Startzeitpunkt und Dauer. */
export function restSekunden(gestartetAm: string, dauerMinuten: number, jetzt: Date = new Date()): number {
  const ende = new Date(gestartetAm).getTime() + dauerMinuten * 60_000;
  return Math.max(0, Math.round((ende - jetzt.getTime()) / 1000));
}

export function formatMMSS(sek: number): string {
  const m = Math.floor(sek / 60), s = sek % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
