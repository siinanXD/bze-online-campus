/**
 * Bekannte Fehlercodes aus den Server Actions / der Edge-Function-Antwort
 * auf feste Übersetzungsschlüssel unter `admin.fehler.*` abbilden.
 * Unbekannte/dynamische Codes (z. B. `edge_status_500`) fallen auf
 * `admin.fehler.allgemein` zurück, statt next-intl mit einem fehlenden
 * Schlüssel abstürzen zu lassen.
 */
const BEKANNTE_CODES = new Set([
  'kein_zugriff',
  'ungueltige_eingabe',
  'ungueltige_id',
  'rolle_nicht_erlaubt',
  'unerwartete_antwort',
  'edge_konfiguration_fehlt',
  'edge_nicht_erreichbar',
  'nur_admin',
  'zu_kurz',
  'zu_lang',
  'ungueltiges_format',
  'pflichtfeld',
  'laden',
  'nicht_gefunden',
]);

export function fehlerSchluessel(code: string): string {
  return BEKANNTE_CODES.has(code) ? code : 'allgemein';
}
