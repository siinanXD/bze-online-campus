/** Eingaben und Ergebnisse der Kaskade Spec §4.2 (AP-10). */

export interface KernStand {
  themaId: string;
  kernGesamt: number;
  kernFertig: number;
}

export interface LerneinheitStand {
  themaId: string;
  lerneinheitId: string;
  abschnitteGesamt: number;
  abschnitteGelesen: number;
  /** Lesezeit unter Soll — Hinweis, keine Sperre (Spec §4.2). */
  lesezeitUnterschritten?: boolean;
}

export interface ThemaMeta {
  id: string;
  bezeichnung: string;
  bereichId: string;
  reihenfolge: number;
}

export interface BereichMeta {
  id: string;
  bezeichnung: string;
  phaseId: string | null;
  reihenfolge: number;
}

export interface PhaseMeta {
  id: string;
  bezeichnung: string;
  berufId: string;
  reihenfolge: number;
  mindestWochenpruefungen: number;
}

export interface PruefungStand {
  gesamtpunkte: number | null;
  bestanden: boolean | null;
}

export interface PruefungsreifeStand {
  phaseId: string;
  kriterienErfuelltAm: string | null;
  ausbilderBestaetigtAm: string | null;
}

export type GateStatus = 'offen' | 'erreicht' | 'empfohlen' | 'bestaetigt';

export interface Gate {
  ebene: 'lerneinheit' | 'topic' | 'fachgebiet' | 'phase' | 'pruefungsreife';
  id: string;
  bezeichnung: string;
  status: GateStatus;
  anteil: number; // 0..1
  /** Absolute Zähler für die Anzeige (Kernfragen bzw. aggregiert). */
  fertig?: number;
  gesamt?: number;
  hinweis?: 'lesezeit';
}

export interface FortsetzenEmpfehlung {
  themaId: string;
  bezeichnung: string;
  grund: 'fachkunde' | 'kernfragen' | 'naechstes';
  kernOffen: number;
  anteil: number;
}

export interface KaskadeErgebnis {
  gates: Gate[];
  fortschrittBeruf: number; // 0..100
  empfehlung: FortsetzenEmpfehlung | null;
  lernpunkte: number;
}
