/**
 * Kanonische Fachquellen (Spec §2 Regel 8: keine Zahlenwerte ohne Fundstelle).
 * Das Tabellenbuch ist Maßstab, NICHT der Normvolltext (Spec §2 Regel 9).
 * Konkrete Seitenzahlen je Frage werden vom Ausbilder ergänzt und nie geraten.
 */
export const TABELLENBUCH = {
  titel: 'Tabellenbuch Metall mit Formelsammlung',
  verlag: 'Europa-Lehrmittel',
  europaNr: '10609',
  auflage: '50. Auflage',
  jahr: 2025,
} as const;

/** Baustein für das Feld `fragen.tabellenbuch_fundstelle` (jsonb). */
export function tabellenbuchFundstelle(seite: number, tabelle?: string) {
  return {
    verlag: TABELLENBUCH.verlag,
    auflage: TABELLENBUCH.auflage,
    seite,
    tabelle: tabelle ?? null,
  };
}
