-- =====================================================================
-- KI-Content-Plattform - Data-API-Rechte fuer neue Content-Tabellen
--
-- Supabase RLS steuert die Zeilen, benoetigt aber zusaetzlich normale
-- Tabellenrechte fuer die PostgREST/Data-API-Rolle. Ohne diese Grants greifen
-- die Policies nicht, weil authenticated bereits am Tabellenrecht scheitert.
-- =====================================================================

grant select, insert, update, delete on
  lernziele,
  content_elemente,
  content_element_lernziele,
  lernkarten,
  content_quellen,
  content_element_quellen,
  content_quizze,
  content_quiz_fragen
to authenticated;

grant select on
  berufe,
  pruefungsbereiche,
  themen,
  lerneinheiten,
  fragen,
  antwortoptionen,
  freitext_loesungen
to authenticated;
