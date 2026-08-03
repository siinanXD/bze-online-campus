-- AUTOGENERIERBARER RAG-Grundstock fuer MAF 4171.
-- Enthalten sind nur eigene Zusammenfassungen aus offiziellen Quellen,
-- keine Tabellenbuch-, PAL-Aufgaben- oder Verlagsinhalte.

begin;

insert into wissensquellen (
  id,
  traeger_id,
  titel,
  beschreibung,
  quelle_typ,
  url,
  aktiv
) values (
  '287a3ba7-6b90-54e6-8440-d12c993491cd',
  '4c89739f-2279-5917-9d6e-bc98fed1ffed',
  'MAF 4171 - offizielle Grundlagen und Pruefungsstruktur',
  'Kuratierter RAG-Grundstock fuer Maschinen- und Anlagenfuehrer/-in, Schwerpunkt Metall- und Kunststofftechnik. Quellen: BIBB/Gesetze im Internet, IHK Aachen, PAL IHK Region Stuttgart.',
  'manueller_fachtext',
  'https://www.bibb.de/dienst/berufesuche/de/index_berufesuche.php/regulation/maschinen_und_anlagenfuehrer.pdf',
  true
) on conflict (id) do update set
  titel = excluded.titel,
  beschreibung = excluded.beschreibung,
  url = excluded.url,
  aktiv = true;

insert into quelldokumente (
  id,
  traeger_id,
  wissensquelle_id,
  titel,
  beschreibung,
  dateiname,
  typ,
  quelle_typ,
  dokument_status,
  index_status,
  aktiv,
  ursprungs_url,
  original_dateiname,
  mime_type,
  text_hash,
  rohtext,
  bereinigter_text,
  chunk_anzahl,
  embedding_anbieter,
  embedding_modell,
  embedding_dimension,
  embedding_mock,
  verarbeitungsmetadaten,
  verarbeitet_am,
  rechte_bestaetigt,
  rechte_hinweis
) values (
  'c0696d26-5cd3-5269-b100-a7dd2566d8f1',
  '4c89739f-2279-5917-9d6e-bc98fed1ffed',
  '287a3ba7-6b90-54e6-8440-d12c993491cd',
  'MAF 4171 - offizieller Lernplan und Pruefungslogik',
  'Eigene, belegte Zusammenfassung fuer RAG. Keine Aufgabenuebernahmen und keine geschuetzten Tabellenbuchinhalte.',
  'maf-4171-offizielle-grundlagen.md',
  'manueller_fachtext',
  'manueller_fachtext',
  'indexiert',
  'mock_indexiert',
  true,
  'https://www.ihk.de/aachen/bildung/ausbildung/ausbildungsberufe/maschinen-anlagenfuehrer-6888522',
  'maf-4171-offizielle-grundlagen.md',
  'text/markdown',
  md5('maf-4171-offizielle-grundlagen-v1'),
  'Kuratierter RAG-Grundstock fuer MAF 4171. Quellen: Ausbildungsordnung/BIBB, IHK Aachen, PAL IHK Region Stuttgart.',
  'Kuratierter RAG-Grundstock fuer MAF 4171. Quellen: Ausbildungsordnung/BIBB, IHK Aachen, PAL IHK Region Stuttgart.',
  6,
  'mock',
  'mock-embedding-v1',
  1536,
  true,
  '{"pipeline":["seed","kuratiertes_markdown","chunking"],"rag_enabled":true,"copyright_hinweis":"Keine Tabellenbuchauszuege, keine Pruefungsaufgaben-Uebernahmen, keine PAL-Loesungen."}'::jsonb,
  now(),
  true,
  'Eigene Zusammenfassung aus frei erreichbaren offiziellen Quellen; keine geschuetzten Verlagsinhalte.'
) on conflict (id) do update set
  titel = excluded.titel,
  beschreibung = excluded.beschreibung,
  dokument_status = excluded.dokument_status,
  index_status = excluded.index_status,
  aktiv = true,
  ursprungs_url = excluded.ursprungs_url,
  text_hash = excluded.text_hash,
  rohtext = excluded.rohtext,
  bereinigter_text = excluded.bereinigter_text,
  chunk_anzahl = excluded.chunk_anzahl,
  embedding_anbieter = excluded.embedding_anbieter,
  embedding_modell = excluded.embedding_modell,
  embedding_dimension = excluded.embedding_dimension,
  embedding_mock = excluded.embedding_mock,
  verarbeitungsmetadaten = excluded.verarbeitungsmetadaten,
  verarbeitet_am = excluded.verarbeitet_am,
  rechte_bestaetigt = excluded.rechte_bestaetigt,
  rechte_hinweis = excluded.rechte_hinweis;

insert into wissens_chunks (
  id,
  quelldokument_id,
  traeger_id,
  chunk_index,
  inhalt,
  token_schaetzung,
  text_hash,
  embedding_metadaten,
  quellenreferenz,
  aktiv
) values
(
  'cb1e75da-6f69-5d8a-951c-a98c4b5aa33d',
  'c0696d26-5cd3-5269-b100-a7dd2566d8f1',
  '4c89739f-2279-5917-9d6e-bc98fed1ffed',
  0,
  'Maschinen- und Anlagenfuehrer/-innen werden im Schwerpunkt Metall- und Kunststofftechnik auf Grundlage der bundesweit geltenden Ausbildungsverordnung ausgebildet. Die Ausbildung dauert zwei Jahre. Der Beruf umfasst unter anderem Sicherheit und Gesundheitsschutz, Umweltschutz, Werk-, Betriebs- und Hilfsstoffe, betriebliche und technische Kommunikation, Arbeitsplanung, Pruefen, Fertigungstechniken, Steuerungs- und Regelungstechnik, Einrichten und Bedienen von Produktionsanlagen, Materialfluss, Warten und Inspizieren sowie Qualitaetssicherung. Diese Themen bilden den offiziellen Rahmen fuer Lernplan, Lernziele und Fragenpool.',
  145,
  md5('maf-4171-chunk-0'),
  '{"provider":"mock","modell":"mock-embedding-v1","dimension":1536,"textHash":"maf-4171-chunk-0"}'::jsonb,
  '{"quelle":"BIBB/Ausbildungsverordnung Maschinen- und Anlagenfuehrer/-in","url":"https://www.bibb.de/dienst/berufesuche/de/index_berufesuche.php/regulation/maschinen_und_anlagenfuehrer.pdf","fundstelle":"§§ 2, 4, 5 und Anlage Ausbildungsrahmenplan","beleg_stufe":2}'::jsonb,
  true
),
(
  'f4361878-2086-5d9e-84f6-bb08d3f2f1f8',
  'c0696d26-5cd3-5269-b100-a7dd2566d8f1',
  '4c89739f-2279-5917-9d6e-bc98fed1ffed',
  1,
  'Das erste Ausbildungsjahr ist als berufliche Grundbildung zu behandeln. Fuer die Lernplattform sind besonders relevant: sichere Arbeitsweise, technische Kommunikation, Arbeitsablaeufe planen, Werkstoffe und Hilfsstoffe handhaben, einfache Pruefungen und Messungen, branchenspezifische Fertigungstechniken, Grundverstaendnis von Steuerungs- und Regelungstechnik, Maschinen bedienen, Materialfluss ueberwachen, Wartung, Inspektion und Qualitaet. Diese Themen eignen sich als Phase bis zur Zwischenpruefung.',
  115,
  md5('maf-4171-chunk-1'),
  '{"provider":"mock","modell":"mock-embedding-v1","dimension":1536,"textHash":"maf-4171-chunk-1"}'::jsonb,
  '{"quelle":"BIBB/Ausbildungsverordnung Maschinen- und Anlagenfuehrer/-in","url":"https://www.bibb.de/dienst/berufesuche/de/index_berufesuche.php/regulation/maschinen_und_anlagenfuehrer.pdf","fundstelle":"Anlage Ausbildungsrahmenplan, 1. Ausbildungsjahr","beleg_stufe":2}'::jsonb,
  true
),
(
  'ccd93e07-e775-5b33-8a8a-09ffd86a1694',
  'c0696d26-5cd3-5269-b100-a7dd2566d8f1',
  '4c89739f-2279-5917-9d6e-bc98fed1ffed',
  2,
  'Im zweiten Ausbildungsjahr liegt der Schwerpunkt Metall- und Kunststofftechnik staerker auf Werkstoffauswahl, Arbeitsplanung, Fertigungstechnik, Ruesten und Umruesten von Produktionsmaschinen, Einstellen und Optimieren von Prozessdaten, Inbetriebnahme, Ueberwachung von Produktionsprozessen, Stoerungsbeseitigung, Sicherung des Materialflusses, vorbeugender Instandhaltung, Qualitaetssicherung und Dokumentation. Diese Inhalte tragen die Phase bis zur Abschlusspruefung.',
  112,
  md5('maf-4171-chunk-2'),
  '{"provider":"mock","modell":"mock-embedding-v1","dimension":1536,"textHash":"maf-4171-chunk-2"}'::jsonb,
  '{"quelle":"BIBB/Ausbildungsverordnung Maschinen- und Anlagenfuehrer/-in","url":"https://www.bibb.de/dienst/berufesuche/de/index_berufesuche.php/regulation/maschinen_und_anlagenfuehrer.pdf","fundstelle":"Anlage Ausbildungsrahmenplan, Schwerpunkt Metall- und Kunststofftechnik, 2. Ausbildungsjahr","beleg_stufe":2}'::jsonb,
  true
),
(
  '5eaaad71-66d8-5fd4-8d1a-5da47966bbe6',
  'c0696d26-5cd3-5269-b100-a7dd2566d8f1',
  '4c89739f-2279-5917-9d6e-bc98fed1ffed',
  3,
  'Die Zwischenpruefung soll zu Beginn des zweiten Ausbildungsjahres stattfinden. Sie bezieht sich auf die im ersten Ausbildungsjahr vermittelten Fertigkeiten und Kenntnisse sowie auf wesentlichen Berufsschulstoff. Der Pruefling fuehrt eine praktische Aufgabe in hoechstens drei Stunden durch und bearbeitet schriftliche Aufgaben im Zusammenhang mit der praktischen Aufgabe in hoechstens 60 Minuten. Fuer MAF 4171 kann die App daraus Zwischenpruefungsuebungen mit technischer Kommunikation, Sicherheit, Werkstoffen, Fertigungs- und Prueftechnik und einfachen Berechnungen ableiten.',
  135,
  md5('maf-4171-chunk-3'),
  '{"provider":"mock","modell":"mock-embedding-v1","dimension":1536,"textHash":"maf-4171-chunk-3"}'::jsonb,
  '{"quelle":"BIBB/Ausbildungsverordnung Maschinen- und Anlagenfuehrer/-in","url":"https://www.bibb.de/dienst/berufesuche/de/index_berufesuche.php/regulation/maschinen_und_anlagenfuehrer.pdf","fundstelle":"§ 8 Zwischenpruefung","beleg_stufe":2}'::jsonb,
  true
),
(
  '64646d30-4233-5fc1-b418-8d263e220ff7',
  'c0696d26-5cd3-5269-b100-a7dd2566d8f1',
  '4c89739f-2279-5917-9d6e-bc98fed1ffed',
  4,
  'Die Abschlusspruefung umfasst einen praktischen Teil und einen schriftlichen Teil. Praktisch kommen insbesondere Einrichten, Inbetriebnehmen und Bedienen einer Maschine oder Anlage, Umruesten mit Inbetriebnahme und Bedienung oder vorbeugende Instandsetzung einschliesslich Inbetriebnahme in Betracht. Schriftlich sind Produktionstechnik, Produktionsplanung und Wirtschafts- und Sozialkunde relevant. Im Schwerpunkt Metall- und Kunststofftechnik gehoeren zu Produktionstechnik technische Unterlagen, Werkstoffe, Werkzeuge, Maschinenfunktionen, Pruefverfahren, Pruefmittel und Fertigungstechniken; zu Produktionsplanung Arbeitsschritte, Qualitaetssicherung, vorbeugende Instandhaltung, Produktionsanlagen und Uebergabeprotokoll.',
  165,
  md5('maf-4171-chunk-4'),
  '{"provider":"mock","modell":"mock-embedding-v1","dimension":1536,"textHash":"maf-4171-chunk-4"}'::jsonb,
  '{"quelle":"BIBB/Ausbildungsverordnung Maschinen- und Anlagenfuehrer/-in","url":"https://www.bibb.de/dienst/berufesuche/de/index_berufesuche.php/regulation/maschinen_und_anlagenfuehrer.pdf","fundstelle":"§ 9 Abschlusspruefung","beleg_stufe":2}'::jsonb,
  true
),
(
  '94f075bc-802e-5863-b7c6-d87d1fac1817',
  'c0696d26-5cd3-5269-b100-a7dd2566d8f1',
  '4c89739f-2279-5917-9d6e-bc98fed1ffed',
  5,
  'Die IHK Aachen fuehrt Maschinen- und Anlagenfuehrer/-in mit Fachrichtung Metall- und Kunststofftechnik und verweist bei Rechtsgrundlagen auf das BIBB. Die schriftlichen Pruefungstermine werden nach IHK Aachen bundeseinheitlich festgelegt. PAL IHK Region Stuttgart stellt fuer Berufsnummer 4171 Metall- und Kunststofftechnik Pruefungsinformationen und Pruefungsuebersichten bereit. Fuer Sommer 2026 nennt die PAL-Uebersicht die schriftlichen Bereiche WISO mit 45 Minuten und 20 Prozent, Produktionstechnik mit 120 Minuten und 50 Prozent sowie Produktionsplanung mit 60 Minuten und 30 Prozent. Tabellenbuecher und Formelsammlungen duerfen als Hilfsmittel nur nach den jeweils geltenden Vorgaben verwendet werden; geschuetzte Tabellenbuchinhalte werden nicht in der RAG gespeichert.',
  170,
  md5('maf-4171-chunk-5'),
  '{"provider":"mock","modell":"mock-embedding-v1","dimension":1536,"textHash":"maf-4171-chunk-5"}'::jsonb,
  '{"quelle":"IHK Aachen und PAL IHK Region Stuttgart","urls":["https://www.ihk.de/aachen/bildung/ausbildung/ausbildungsberufe/maschinen-anlagenfuehrer-6888522","https://www.ihk.de/stuttgart/pal/maschinen-und-anlagenfuehrer-in-4171-4172-4173-4174--5150554","https://www.ihk.de/blueprint/servlet/resource/blob/6967174/bcefac230435bf7da600c8e636c3c971/s26-mamk-4171-masch-anlagenf-20260302-data.pdf"],"fundstelle":"IHK Aachen Struktur und PAL-Pruefungsuebersicht S26 4171","beleg_stufe":2}'::jsonb,
  true
)
on conflict (quelldokument_id, chunk_index) do update set
  id = excluded.id,
  inhalt = excluded.inhalt,
  token_schaetzung = excluded.token_schaetzung,
  text_hash = excluded.text_hash,
  embedding_metadaten = excluded.embedding_metadaten,
  quellenreferenz = excluded.quellenreferenz,
  aktiv = true;

commit;
