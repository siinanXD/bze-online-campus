export type Rolle = 'teilnehmer' | 'ausbilder' | 'verwaltung' | 'admin';

export type ContentTyp =
  | 'erklaerung'
  | 'lernkarte'
  | 'single_choice'
  | 'multiple_choice'
  | 'freitext'
  | 'rechenaufgabe'
  | 'praxisfall'
  | 'pruefungsnahe_uebungsfrage'
  | 'zusammenfassung';

export type ContentStatus =
  | 'entwurf'
  | 'generiert'
  | 'in_pruefung'
  | 'freigegeben'
  | 'abgelehnt'
  | 'archiviert';

export type Schwierigkeitsgrad = 'einfach' | 'mittel' | 'schwer';

export type ContentQuellenart =
  | 'tabellenbuch'
  | 'rahmenlehrplan'
  | 'traegerskript'
  | 'web'
  | 'ki'
  | 'demo'
  | 'manuell'
  | 'unbekannt';
