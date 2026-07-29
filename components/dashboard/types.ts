// AP-13 — Gemeinsame Typen für die Startbildschirm-Dashboards (Wochenbericht,
// Merkkarte). Die Struktur entspricht dem, was die Edge Function
// `erzeuge-wochenbericht` in `wochenberichte` (jsonb) ablegt.

export type WochenberichtTrend = 'besser' | 'schlechter' | 'gleich' | 'neu';

export interface WochenberichtStatistik {
  bearbeitet: number;
  richtig: number;
  falsch: number;
  richtig_quote: number;
  vorwoche_bearbeitet: number;
  vorwoche_richtig_quote: number;
  trend: WochenberichtTrend;
  schwaechste_themen: string[];
}

export interface WochenberichtInhalt {
  zusammenfassung: string;
  verbesserungen: string;
  empfehlung: string;
  statistik: WochenberichtStatistik;
}

/** Ein Merksatz zu einer tatsächlich falsch beantworteten Frage. */
export interface Merksatz {
  text: string;
  thema?: string;
}

export interface Wochenbericht {
  id: string;
  jahr: number;
  kalenderwoche: number;
  inhalt: WochenberichtInhalt | null;
  merksaetze: Merksatz[] | null;
  gelesen: boolean;
}
