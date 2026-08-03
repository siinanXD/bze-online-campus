/**
 * Figma Page `04 Teilnehmer — Lernen` ↔ Campus-Routen.
 *
 * | Figma | Route / Ort |
 * |---|---|
 * | 04.1 Lernen Hub | /campus/lernen |
 * | 04.2 Themenliste | /campus/lernen/fragen (ohne Session) |
 * | 04.3/04.4 Fragenliste | Filter-Chips + Runner-Queue |
 * | 04.5–04.8 Frage/Feedback | FragenRunner (thema/[id]/fragen-runner) |
 * | 04.9/04.10 Overlays | spaeter |
 * | 04.11 Formeltrainer | /campus/lernen/werkzeuge/formeltrainer |
 * | 04.12 Fehlerdiagnose | /campus/lernen/werkzeuge/fehlerdiagnose |
 * | 04.13 Video | topic leaf flag_video / spaeter |
 * | 04.14 Lern-Detail | /campus/topic/.../lerneinheit/... |
 * | 04.15 Hub Tablet | responsive Hub |
 * | 04.16 Lernpfad Map | /campus/topic/[themaId] |
 * | 04.17 Lerneinheit | /campus/topic/.../lerneinheit/... |
 * | 04.18 Glossar | /campus/lernen/werkzeuge/glossar |
 * | 04.19 Formel Flashcard | Formeltrainer-Seite |
 */
export const FIGMA_LERNEN_ROUTEN = {
  hub: '04.1',
  themenliste: '04.2',
  lernpfad: '04.16',
  lerneinheit: '04.17',
  glossar: '04.18',
  formeltrainer: '04.11',
  fehlerdiagnose: '04.12',
} as const;
