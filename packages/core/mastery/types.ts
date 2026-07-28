export type FrageTyp = 'mc' | 'freitext';
export type MasteryStatus = 'neu' | 'einmal_richtig' | 'falsch' | 'abgeschlossen';

export interface McOption { id: string; text: string; reihenfolge: number }
export interface TabellenbuchFundstelle { verlag?: string; auflage?: string; seite?: number | string; tabelle?: string | null }

export interface LernFrage {
  id: string;
  typ: FrageTyp;
  aufgabenstellung: string;
  bild_url: string | null;
  schwierigkeit: number | null;
  kern: boolean;
  tabellenbuch_fundstelle: TabellenbuchFundstelle | null;
  optionen: McOption[];
}

export interface MasteryState {
  status: MasteryStatus;
  streak: number;
  fehler_gesamt: number;
  naechste_faelligkeit: string | null;
}

/** Ergebnis von verarbeite_versuch (Supabase RPC). */
export interface VersuchErgebnis {
  status: MasteryStatus;
  streak: number;
  ist_korrekt: boolean;
  spacing_gesperrt: boolean;
  punkte: number;
}
