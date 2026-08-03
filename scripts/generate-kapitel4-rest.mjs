/**
 * Generiert OEE-, MAT-, WISO- und PRF-Bloecke fuer Kapitel 4.
 * Einmalig ausfuehren: node scripts/generate-kapitel4-rest.mjs
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

/** @typedef {{
 *  id: string,
 *  slug: string,
 *  titel: string,
 *  thema: string,
 *  prefix: string,
 *  stufen: string[],
 *  zahlenwerte: 'keine_zahlenwerte' | 'quellenwert',
 *  begriffe: string[],
 *  storyTitel: string,
 *  story: string,
 *  einfachTitel: string,
 *  einfach: string,
 *  fachTitel: string,
 *  fach: string,
 *  praxisTitel: string,
 *  praxis: string,
 *  merksatz: string,
 *  quizFrage: string,
 *  quizRichtig: string,
 *  quizRichtigErk: string,
 *  quizFalsch: string,
 *  quizFalschErk: string,
 *  schemaTitle: string,
 *  schemaDesc: string,
 *  schemaCaption: string,
 *  schemaMerker?: string,
 *  karten: {label: string, detail: string}[],
 *  trainerBadge: string,
 *  trainerSymbol: string,
 *  trainerDesc: string,
 *  optionen: string[],
 *  aufgaben: {frage: string, korrekt: string}[],
 *  fehlerName: string,
 *  begruendung: string,
 *  naechster: string,
 *  distractor: string,
 *  freigabeHinweis: string,
 *  quellenTitel: string,
 *  quellenHinweis: string,
 * }} Einheit */

/** @type {Einheit[]} */
const einheiten = [
  // ---- OEE ----
  {
    id: 'FK-4-OEE-001', slug: 'pt-oee-01-oee-ueberblicken', titel: 'OEE ueberblicken', thema: 'PT-OEE', prefix: 'OeeUeberblicken',
    stufen: ['verstehen'], zahlenwerte: 'quellenwert',
    begriffe: ['OEE', 'Verfuegbarkeit', 'Leistungsgrad', 'Qualitaetsrate', 'Stillstandszeit'],
    storyTitel: 'Situation am Schichtende',
    story: 'Die Linie hat den ganzen Tag gelaufen. Trotzdem fragt der Ausbilder: Warum liegt die Gesamtanlageneffektivitaet unter dem Ziel? Du brauchst zuerst den Ueberblick.',
    einfachTitel: 'Drei Bausteine',
    einfach: 'OEE setzt sich aus Verfuegbarkeit, Leistungsgrad und Qualitaetsrate zusammen. Fehlt ein Baustein, sinkt der Gesamtwert.',
    fachTitel: 'OEE als Produkt der drei Faktoren',
    fach: 'OEE zeigt, wie wirksam eine Anlage produziert. Verfuegbarkeit bewertet Laufzeit gegen geplante Zeit, Leistungsgrad die Ausbringung gegen Sollleistung und Qualitaetsrate den Gutanteil. Zahlenwerte kommen immer aus freigegebenen Betriebsdaten.',
    praxisTitel: 'Praxisbeispiel Spritzgiesszelle',
    praxis: 'Eine Zelle laeuft lange, aber mit vielen kurzen Stopps und Nacharbeit. OEE hilft, die Verluste sichtbar zu trennen statt nur "zu langsam" zu sagen.',
    merksatz: 'OEE = Verfuegbarkeit mal Leistungsgrad mal Qualitaetsrate.',
    quizFrage: 'Woraus setzt sich OEE zusammen?',
    quizRichtig: 'Aus Verfuegbarkeit, Leistungsgrad und Qualitaetsrate.', quizRichtigErk: 'Richtig. Alle drei Faktoren gehoeren dazu.',
    quizFalsch: 'Nur aus der reinen Laufzeit der Maschine.', quizFalschErk: 'Nein. Leistung und Qualitaet fehlen dann.',
    schemaTitle: 'OEE als Kreis aus drei Faktoren ueberblicken',
    schemaDesc: 'Verfuegbarkeit, Leistungsgrad und Qualitaetsrate ergeben gemeinsam die OEE.',
    schemaCaption: 'OEE verbindet Laufzeit, Ausbringung und Gutanteil. Jeder Faktor braucht belastbare Betriebsdaten.',
    schemaMerker: 'drei Faktoren, ein Gesamtwert',
    karten: [{ label: 'Verf.', detail: 'Laufzeit' }, { label: 'Leist.', detail: 'Tempo' }, { label: 'Qual.', detail: 'Gutteil' }, { label: 'OEE', detail: 'Produkt' }, { label: 'Quelle', detail: 'Daten' }],
    trainerBadge: 'OEE', trainerSymbol: 'O', trainerDesc: 'Ordne die drei OEE-Faktoren.',
    optionen: ['Verfuegbarkeit einordnen', 'Leistungsgrad einordnen', 'Qualitaetsrate einordnen', 'Nur Ausschuss zaehlen'],
    aufgaben: [
      { frage: 'Welcher Faktor bewertet Laufzeit gegen Planzeit?', korrekt: 'Verfuegbarkeit einordnen' },
      { frage: 'Welcher Faktor bewertet Ausbringung gegen Soll?', korrekt: 'Leistungsgrad einordnen' },
      { frage: 'Welcher Faktor bewertet Gutmenge gegen Gesamtmenge?', korrekt: 'Qualitaetsrate einordnen' },
    ],
    fehlerName: 'OeeUeberblickenTrainer', begruendung: 'OEE verbindet Verfuegbarkeit, Leistungsgrad und Qualitaetsrate.',
    naechster: 'Naechste OEE-Frage', distractor: 'Nur Ausschuss zaehlen',
    freigabeHinweis: 'OEE-Definition, Zielwerte und Betriebsdatenfelder muessen fachlich freigegeben werden.',
    quellenTitel: 'Tabellenbuch, OEE-Unterlagen und Betriebsdatenerfassung',
    quellenHinweis: 'Formelvarianten und Betriebsdatenfelder nach Quelle ergaenzen.',
  },
  {
    id: 'FK-4-OEE-002', slug: 'pt-oee-02-verfuegbarkeit-berechnen', titel: 'Verfuegbarkeit berechnen', thema: 'PT-OEE', prefix: 'VerfuegbarkeitBerechnen',
    stufen: ['anwenden'], zahlenwerte: 'quellenwert',
    begriffe: ['Verfuegbarkeit', 'OEE', 'Stillstandszeit', 'Kapazitaet', 'Dokumentation'],
    storyTitel: 'Situation an der Linie',
    story: 'Geplant waren 480 Minuten. Davon stand die Anlage 60 Minuten. Du sollst die Verfuegbarkeit sauber berechnen.',
    einfachTitel: 'Laufzeit geteilt durch Planzeit',
    einfach: 'Verfuegbarkeit zeigt, welcher Anteil der geplanten Zeit wirklich gelaufen ist. Stillstand senkt den Wert.',
    fachTitel: 'Verfuegbarkeit als Laufzeitbezug',
    fach: 'Verfuegbarkeit = Laufzeit / geplante Zeit. Welche Zeiten als Plan, Lauf oder Stillstand zaehlen, steht in der Betriebsvorgabe. Uebungswerte sind Lernbeispiele und keine verbindlichen Betriebswerte.',
    praxisTitel: 'Praxisbeispiel ungeplanter Stopp',
    praxis: 'Wenn Material fehlt und die Maschine steht, sinkt die Verfuegbarkeit. Wird der Stopp nicht dokumentiert, wird die Kennzahl falsch.',
    merksatz: 'Verfuegbarkeit braucht klare Plan- und Laufzeiten.',
    quizFrage: 'Was beschreibt Verfuegbarkeit?',
    quizRichtig: 'Den Anteil der geplanten Zeit, in dem die Anlage gelaufen ist.', quizRichtigErk: 'Richtig. Laufzeit wird auf Planzeit bezogen.',
    quizFalsch: 'Nur die Anzahl der Gutteile am Tag.', quizFalschErk: 'Nein. Das gehoert eher zur Qualitaetsrate oder Leistung.',
    schemaTitle: 'Verfuegbarkeit aus Laufzeit und Planzeit berechnen',
    schemaDesc: 'Planzeit, Laufzeit, Stillstand, Quotient und Quelle bilden die Verfuegbarkeit.',
    schemaCaption: 'Verfuegbarkeit = Laufzeit geteilt durch geplante Zeit. Stillstandsarten muessen dokumentiert sein.',
    schemaMerker: 'V = Lauf / Plan',
    karten: [{ label: 'Plan', detail: 'Zeit' }, { label: 'Lauf', detail: 'Zeit' }, { label: 'Stop', detail: 'Stillst.' }, { label: 'V', detail: 'Quotient' }, { label: 'Quelle', detail: 'Daten' }],
    trainerBadge: 'Verf.', trainerSymbol: 'V', trainerDesc: 'Ordne Planzeit, Laufzeit und Stillstand.',
    optionen: ['Planzeit klaeren', 'Laufzeit bestimmen', 'Stillstand abziehen', 'Zeiten frei schaetzen'],
    aufgaben: [
      { frage: 'Was ist der Bezugswert der Verfuegbarkeit?', korrekt: 'Planzeit klaeren' },
      { frage: 'Was steht im Zaehler der Verfuegbarkeit?', korrekt: 'Laufzeit bestimmen' },
      { frage: 'Was senkt die Verfuegbarkeit?', korrekt: 'Stillstand abziehen' },
    ],
    fehlerName: 'VerfuegbarkeitBerechnenTrainer', begruendung: 'Verfuegbarkeit braucht Planzeit, Laufzeit und dokumentierten Stillstand.',
    naechster: 'Naechste Verfuegbarkeitsfrage', distractor: 'Zeiten frei schaetzen',
    freigabeHinweis: 'Zeitdefinitionen und Beispielrechnung muessen fachlich freigegeben werden.',
    quellenTitel: 'Tabellenbuch und Betriebsdatenerfassung',
    quellenHinweis: 'Zeitarten und Beispielwerte nach Quelle ergaenzen.',
  },
  {
    id: 'FK-4-OEE-003', slug: 'pt-oee-03-leistungsgrad-berechnen', titel: 'Leistungsgrad berechnen', thema: 'PT-OEE', prefix: 'LeistungsgradBerechnen',
    stufen: ['anwenden'], zahlenwerte: 'quellenwert',
    begriffe: ['Leistungsgrad', 'OEE', 'Sollleistung', 'Produktionsleistung', 'Taktzeit'],
    storyTitel: 'Situation am Monitor',
    story: 'Die Maschine laeuft ohne Stoerung, aber die Stueckzahl liegt unter dem Soll. Der Leistungsgrad erklaert diesen Verlust.',
    einfachTitel: 'Ist gegen Soll',
    einfach: 'Leistungsgrad vergleicht, was wirklich produziert wurde, mit dem, was in der Laufzeit moeglich gewesen waere.',
    fachTitel: 'Leistungsgrad als Ausbringungsvergleich',
    fach: 'Leistungsgrad = Istleistung / Sollleistung. Die Sollleistung kommt aus freigegebenen Takt-, Zyklus- oder Leistungsvorgaben. Ohne klare Sollbasis wird der Wert unvergleichbar.',
    praxisTitel: 'Praxisbeispiel langsame Takte',
    praxis: 'Eine Presse laeuft, aber mit laengerer Zykluszeit als freigegeben. Die Verfuegbarkeit kann gut sein, der Leistungsgrad sinkt trotzdem.',
    merksatz: 'Leistungsgrad braucht eine freigegebene Sollbasis.',
    quizFrage: 'Was vergleicht der Leistungsgrad?',
    quizRichtig: 'Istleistung mit der freigegebenen Sollleistung.', quizRichtigErk: 'Richtig. Ohne Sollbasis ist der Grad nicht belastbar.',
    quizFalsch: 'Nur Gutteile mit Ausschuss.', quizFalschErk: 'Nein. Das ist eher Qualitaetsrate.',
    schemaTitle: 'Leistungsgrad aus Istleistung und Sollleistung berechnen',
    schemaDesc: 'Soll, Ist, Laufzeit, Quotient und Quelle strukturieren den Leistungsgrad.',
    schemaCaption: 'Leistungsgrad = Istleistung / Sollleistung. Die Sollbasis muss freigegeben sein.',
    schemaMerker: 'L = Ist / Soll',
    karten: [{ label: 'Soll', detail: 'Vorgabe' }, { label: 'Ist', detail: 'Ausbr.' }, { label: 'Lauf', detail: 'Bezug' }, { label: 'L', detail: 'Quotient' }, { label: 'Quelle', detail: 'Takt' }],
    trainerBadge: 'Leist.', trainerSymbol: 'L', trainerDesc: 'Ordne Sollleistung und Istleistung.',
    optionen: ['Sollbasis lesen', 'Istleistung bestimmen', 'Leistungsgrad berechnen', 'Soll frei erhoehen'],
    aufgaben: [
      { frage: 'Woher kommt die Sollleistung?', korrekt: 'Sollbasis lesen' },
      { frage: 'Was wird mit dem Soll verglichen?', korrekt: 'Istleistung bestimmen' },
      { frage: 'Was ergibt der Vergleich?', korrekt: 'Leistungsgrad berechnen' },
    ],
    fehlerName: 'LeistungsgradBerechnenTrainer', begruendung: 'Leistungsgrad vergleicht Ist- und Sollleistung auf freigegebener Basis.',
    naechster: 'Naechste Leistungsfrage', distractor: 'Soll frei erhoehen',
    freigabeHinweis: 'Sollleistung, Taktwerte und Beispielrechnung muessen fachlich freigegeben werden.',
    quellenTitel: 'Tabellenbuch, Taktvorgaben und Betriebsdaten',
    quellenHinweis: 'Sollleistung und Uebungswerte nach Quelle ergaenzen.',
  },
  {
    id: 'FK-4-OEE-004', slug: 'pt-oee-04-qualitaetsrate-berechnen', titel: 'Qualitaetsrate berechnen', thema: 'PT-OEE', prefix: 'QualitaetsrateBerechnen',
    stufen: ['anwenden'], zahlenwerte: 'quellenwert',
    begriffe: ['Qualitaetsrate', 'Gutteil', 'Ausschuss', 'OEE', 'Nacharbeit'],
    storyTitel: 'Situation an der Pruefung',
    story: '100 Teile wurden gefertigt, 8 sind Ausschuss, 4 gehen in Nacharbeit. Du brauchst die Qualitaetsrate nach Vorgabe.',
    einfachTitel: 'Gutanteil an der Menge',
    einfach: 'Qualitaetsrate zeigt, wie gross der Anteil guter Teile an der produzierten Menge ist.',
    fachTitel: 'Qualitaetsrate als Gutmengenanteil',
    fach: 'Qualitaetsrate = Gutmenge / Gesamtmenge. Ob Nacharbeit als Gut, Ausschuss oder eigener Status zaehlt, steht in der Betriebsregel. Zahlen ohne Vorgabe nicht erfinden.',
    praxisTitel: 'Praxisbeispiel Nacharbeit',
    praxis: 'Wenn Nacharbeit faelschlich als Gutteil zaehlt, steigt die Qualitaetsrate kuenstlich. Die Regel muss vorher klar sein.',
    merksatz: 'Qualitaetsrate braucht klare Gut-/Ausschussregeln.',
    quizFrage: 'Was beschreibt die Qualitaetsrate?',
    quizRichtig: 'Den Anteil der Gutmenge an der Gesamtmenge nach Vorgabe.', quizRichtigErk: 'Richtig. Gutmenge und Gesamtmenge muessen definiert sein.',
    quizFalsch: 'Nur die Maschinenlaufzeit ohne Qualitaetsbezug.', quizFalschErk: 'Nein. Das ist Verfuegbarkeit.',
    schemaTitle: 'Qualitaetsrate aus Gutmenge und Gesamtmenge berechnen',
    schemaDesc: 'Gesamtmenge, Gutteil, Ausschuss, Nacharbeit und Quotient bilden die Qualitaetsrate.',
    schemaCaption: 'Qualitaetsrate = Gutmenge / Gesamtmenge. Nacharbeit wird nur nach Regel bewertet.',
    schemaMerker: 'Q = Gut / Gesamt',
    karten: [{ label: 'Gesamt', detail: 'Menge' }, { label: 'Gut', detail: 'Anteil' }, { label: 'Aussch.', detail: 'Verlust' }, { label: 'Nacharb.', detail: 'Regel' }, { label: 'Q', detail: 'Quotient' }],
    trainerBadge: 'Qual.', trainerSymbol: 'Q', trainerDesc: 'Ordne Gutmenge, Ausschuss und Regel.',
    optionen: ['Gesamtmenge klaeren', 'Gutmenge bestimmen', 'Nacharbeit nach Regel bewerten', 'Ausschuss als Gut zaehlen'],
    aufgaben: [
      { frage: 'Was steht im Nenner der Qualitaetsrate?', korrekt: 'Gesamtmenge klaeren' },
      { frage: 'Was steht typisch im Zaehler?', korrekt: 'Gutmenge bestimmen' },
      { frage: 'Was darf nicht willkuerlich umgebucht werden?', korrekt: 'Nacharbeit nach Regel bewerten' },
    ],
    fehlerName: 'QualitaetsrateBerechnenTrainer', begruendung: 'Qualitaetsrate braucht klare Gut-, Ausschuss- und Nacharbeitsregeln.',
    naechster: 'Naechste Qualitaetsratenfrage', distractor: 'Ausschuss als Gut zaehlen',
    freigabeHinweis: 'Gut-/Ausschussregeln und Beispielrechnung muessen fachlich freigegeben werden.',
    quellenTitel: 'QS-Unterlagen, OEE-Standard und Betriebsdaten',
    quellenHinweis: 'Statusregeln und Uebungswerte nach Quelle ergaenzen.',
  },
  {
    id: 'FK-4-OEE-005', slug: 'pt-oee-05-oee-verbessern', titel: 'OEE verbessern', thema: 'PT-OEE', prefix: 'OeeVerbessern',
    stufen: ['anwenden'], zahlenwerte: 'quellenwert',
    begriffe: ['OEE', 'Verlust', 'Massnahme', 'Stillstandszeit', 'KVP'],
    storyTitel: 'Situation in der Verbesserungsrunde',
    story: 'Die OEE ist zu niedrig. Jetzt darf nicht geraten werden. Erst wird der groesste Verlust gefunden, dann die Massnahme.',
    einfachTitel: 'Verlust zuerst finden',
    einfach: 'OEE verbessert man, indem man den groessten Verlust angeht: Stopps, zu langsame Takte oder Ausschuss.',
    fachTitel: 'Verbesserung ueber Verlustursachen',
    fach: 'OEE-Verbesserung startet mit der Zerlegung in Verfuegbarkeit, Leistungsgrad und Qualitaetsrate. Danach werden Ursachen priorisiert und Massnahmen auf Wirksamkeit geprueft. Kennzahlen allein aendern nichts.',
    praxisTitel: 'Praxisbeispiel kurze Stopps',
    praxis: 'Viele Mikrostopps senken die Verfuegbarkeit. Das Team verbessert Materialbereitstellung und 5S am Platz, danach wird die OEE erneut ausgewertet.',
    merksatz: 'Erst Verlust finden, dann Massnahme pruefen.',
    quizFrage: 'Was ist der sinnvolle erste Schritt zur OEE-Verbesserung?',
    quizRichtig: 'Den groessten Verlustfaktor und seine Ursache finden.', quizRichtigErk: 'Richtig. Ohne Verlustbild bleibt Verbesserung Zufall.',
    quizFalsch: 'Sofort alle Parameter ohne Daten aendern.', quizFalschErk: 'Nein. Ohne Analyse entsteht neues Risiko.',
    schemaTitle: 'OEE ueber Verlustursache und Massnahme verbessern',
    schemaDesc: 'Faktor, Verlust, Ursache, Massnahme und Wirksamkeitspruefung bilden den Verbesserungskreis.',
    schemaCaption: 'OEE steigt nur nachhaltig, wenn Verluste erkannt, Massnahmen geprueft und Standards gesetzt werden.',
    schemaMerker: 'Verlust vor Aktion',
    karten: [{ label: 'Faktor', detail: 'finden' }, { label: 'Verlust', detail: 'groesster' }, { label: 'Urs.', detail: 'klaeren' }, { label: 'Massn.', detail: 'planen' }, { label: 'Wirk.', detail: 'pruefen' }],
    trainerBadge: 'Verb.', trainerSymbol: 'VB', trainerDesc: 'Ordne Verlust, Ursache und Massnahme.',
    optionen: ['Groessten Verlust finden', 'Ursache klaeren', 'Wirksamkeit pruefen', 'Blind Parameter drehen'],
    aufgaben: [
      { frage: 'Womit beginnt die Verbesserung?', korrekt: 'Groessten Verlust finden' },
      { frage: 'Was folgt auf den Verlust?', korrekt: 'Ursache klaeren' },
      { frage: 'Was zeigt, ob die Massnahme hilft?', korrekt: 'Wirksamkeit pruefen' },
    ],
    fehlerName: 'OeeVerbessernTrainer', begruendung: 'OEE-Verbesserung braucht Verlustbild, Ursache und Wirksamkeitspruefung.',
    naechster: 'Naechste Verbesserungsfrage', distractor: 'Blind Parameter drehen',
    freigabeHinweis: 'Verlustkategorien und Massnahmenkatalog muessen fachlich freigegeben werden.',
    quellenTitel: 'OEE-Standard, KVP-Unterlagen und Betriebsdaten',
    quellenHinweis: 'Verlustarten und Beispielmassnahmen nach Quelle ergaenzen.',
  },
];

// Generate MAT, WISO, PRF programmatically with compact definitions
const matDefs = [
  ['01', 'RechenwegInPruefungen', 'Rechenweg in Pruefungen', ['gegeben', 'gesucht', 'Formel', 'Einheit', 'Plausibilitaet'], 'Gegeben und gesucht markieren', 'Strukturiert rechnen statt raten', 'anwenden', 'keine_zahlenwerte'],
  ['02', 'GrundrechenartenSicher', 'Grundrechenarten sicher', ['Summe', 'Produkt', 'gegeben', 'gesucht', 'Plausibilitaet'], 'Rechenfehler vermeiden', 'Grundrechenarten sicher anwenden', 'anwenden', 'keine_zahlenwerte'],
  ['03', 'Dreisatz', 'Dreisatz', ['Dreisatz', 'gegeben', 'gesucht', 'Einheit', 'Plausibilitaet'], 'Proportional rechnen', 'Dreisatz strukturiert loesen', 'anwenden', 'quellenwert'],
  ['04', 'Prozentrechnung', 'Prozentrechnung', ['Prozent', 'Grundwert', 'Anteil', 'Ausschuss', 'Plausibilitaet'], 'Anteile berechnen', 'Prozentrechnung pruefungsnah anwenden', 'anwenden', 'quellenwert'],
  ['05', 'EinheitenInAufgaben', 'Einheiten in Aufgaben umrechnen', ['Einheit', 'Faktor', 'Umrechnung', 'gegeben', 'gesucht'], 'Einheit vor Formel pruefen', 'Einheiten sicher umrechnen', 'anwenden', 'quellenwert'],
  ['06', 'UmfangFlaecheRechteck', 'Umfang und Flaeche Rechteck', ['Umfang', 'Flaeche', 'Laenge', 'Einheit', 'Formel'], 'Rechteck berechnen', 'Umfang und Flaeche am Rechteck', 'anwenden', 'quellenwert'],
  ['07', 'KreisumfangKreisflaeche', 'Kreisumfang und Kreisflaeche', ['Radius', 'Durchmesser', 'Flaeche', 'Umfang', 'Formel'], 'Kreiswerte berechnen', 'Kreisumfang und Kreisflaeche', 'anwenden', 'quellenwert'],
  ['08', 'VolumenQuaderZylinder', 'Volumen Quader und Zylinder', ['Volumen', 'Quader', 'Zylinder', 'Einheit', 'Formel'], 'Volumen berechnen', 'Volumen von Quader und Zylinder', 'anwenden', 'quellenwert'],
  ['09', 'MasseAusDichte', 'Masse aus Dichte', ['Masse', 'Dichte', 'Volumen', 'Formel', 'Einheit'], 'Masse berechnen', 'Masse aus Dichte und Volumen', 'anwenden', 'quellenwert'],
  ['10', 'GeschwindigkeitUndZeit', 'Geschwindigkeit und Zeit', ['Geschwindigkeit', 'Zeit', 'Laenge', 'Formel', 'Einheit'], 'Bewegungsaufgaben loesen', 'Geschwindigkeit und Zeit berechnen', 'anwenden', 'quellenwert'],
  ['11', 'DrehzahlSchnittgeschwindigkeit', 'Drehzahl und Schnittgeschwindigkeit', ['Drehzahl', 'Schnittgeschwindigkeit', 'Durchmesser', 'Formel', 'Umstellen'], 'Formeln umstellen', 'Drehzahl und Schnittgeschwindigkeit', 'anwenden', 'quellenwert'],
  ['12', 'VorschubBerechnen', 'Vorschub berechnen', ['Vorschub', 'Drehzahl', 'Formel', 'Einheit', 'Plausibilitaet'], 'Vorschubaufgaben loesen', 'Vorschub berechnen', 'anwenden', 'quellenwert'],
  ['13', 'KraftUndDruck', 'Kraft und Druck', ['Kraft', 'Druck', 'Flaeche', 'Formel', 'Einheit'], 'Druckaufgaben loesen', 'Kraft und Druck berechnen', 'anwenden', 'quellenwert'],
  ['14', 'HydraulischerDruck', 'Hydraulischer Druck', ['Hydraulik', 'Druck', 'Kraft', 'Flaeche', 'Formel'], 'Kraftuebersetzung verstehen', 'Hydraulischen Druck und Kraft', 'anwenden', 'quellenwert'],
  ['15', 'LeistungArbeitWirkungsgrad', 'Leistung, Arbeit, Wirkungsgrad', ['Leistung', 'Arbeit', 'Wirkungsgrad', 'Zeit', 'Formel'], 'Energiebegriffe anwenden', 'Leistung Arbeit Wirkungsgrad', 'anwenden', 'quellenwert'],
  ['16', 'Uebersetzungsverhaeltnis', 'Uebersetzungsverhaeltnis', ['Uebersetzung', 'Drehzahl', 'Zahnrad', 'Formel', 'Plausibilitaet'], 'Getriebe rechnen', 'Uebersetzungsverhaeltnis berechnen', 'anwenden', 'quellenwert'],
  ['17', 'Drehmoment', 'Drehmoment', ['Drehmoment', 'Kraft', 'Hebelarm', 'Formel', 'Einheit'], 'Hebelarm nutzen', 'Drehmoment berechnen', 'anwenden', 'quellenwert'],
  ['18', 'GutmengeAusschussquote', 'Gutmenge und Ausschussquote', ['Gutmenge', 'Ausschuss', 'Prozent', 'Qualitaetsrate', 'Formel'], 'Produktionsmenge bewerten', 'Gutmenge und Ausschussquote', 'anwenden', 'quellenwert'],
  ['19', 'Produktionsleistung', 'Produktionsleistung', ['Leistung', 'Stueckzahl', 'Zeit', 'Taktzeit', 'Formel'], 'Leistung je Zeit berechnen', 'Produktionsleistung berechnen', 'anwenden', 'quellenwert'],
  ['20', 'ProzentualeAbweichung', 'Prozentuale Abweichung', ['Abweichung', 'Prozent', 'Sollwert', 'Istwert', 'Formel'], 'Abweichung bewerten', 'Prozentuale Abweichung berechnen', 'anwenden', 'quellenwert'],
  ['21', 'WaermeausdehnungPruefungsnah', 'Waermeausdehnung pruefungsnah', ['Waermeausdehnung', 'Temperatur', 'Laenge', 'Formel', 'Einheit'], 'Delta-L berechnen', 'Waermeausdehnung pruefungsnah', 'anwenden', 'quellenwert'],
  ['22', 'Toleranzberechnung', 'Toleranzberechnung', ['Toleranz', 'Nennmass', 'Grenzmass', 'Abweichung', 'Formel'], 'Grenzmasse berechnen', 'Toleranz und Grenzmasse berechnen', 'anwenden', 'quellenwert'],
  ['23', 'FormelUmstellen', 'Formel umstellen', ['Formel', 'Umstellen', 'gesucht', 'gegeben', 'Einheit'], 'Zielgroesse isolieren', 'Formeln sicher umstellen', 'anwenden', 'quellenwert'],
  ['24', 'PlausibilitaetVonErgebnissen', 'Plausibilitaet von Ergebnissen', ['Plausibilitaet', 'Einheit', 'Ergebnis', 'gegeben', 'gesucht'], 'Ergebnis pruefen', 'Ergebnisse auf Plausibilitaet pruefen', 'anwenden', 'keine_zahlenwerte'],
];

for (const [nr, prefix, titel, begriffe, ziel, kurz, stufe, zahlen] of matDefs) {
  const id = `FK-4-MAT-${nr}`;
  const slug = `pt-mat-${nr}-${slugify(titel)}`;
  einheiten.push({
    id, slug, titel, thema: 'PT-MAT', prefix,
    stufen: [stufe], zahlenwerte: /** @type {'keine_zahlenwerte'|'quellenwert'} */ (zahlen),
    begriffe,
    storyTitel: `Situation in der Pruefungsaufgabe`,
    story: `Du liest eine Aufgabe zu "${titel}". Bevor du rechnest, markierst du gegebene Werte, gesuchte Groesse und Einheiten.`,
    einfachTitel: kurz,
    einfach: `${titel}: ${ziel}. Erst verstehen, dann rechnen, dann Ergebnis pruefen.`,
    fachTitel: `${titel} fachlich einordnen`,
    fach: `Bei "${titel}" arbeitest du mit klaren Groessen, Einheiten und einem nachvollziehbaren Rechenweg. Zahlenwerte kommen aus Aufgabe, Zeichnung oder Tabellenbuch. Das Ergebnis wird auf Einheit und Plausibilitaet geprueft.`,
    praxisTitel: `Praxisbeispiel ${titel}`,
    praxis: `In der Produktion oder Pruefung brauchst du "${titel}", um Werte sicher zu berechnen oder zu kontrollieren. Ohne Struktur entstehen Einheitenfehler und falsche Freigaben.`,
    merksatz: `${ziel} - dann Ergebnis pruefen.`,
    quizFrage: `Was ist bei "${titel}" zuerst wichtig?`,
    quizRichtig: `${ziel} und Einheiten klaeren.`, quizRichtigErk: 'Richtig. Struktur vor Blindrechnen.',
    quizFalsch: 'Zahlen beliebig kombinieren und auf das Ergebnis hoffen.', quizFalschErk: 'Nein. Ohne Struktur entstehen Fehler.',
    schemaTitle: `${titel} als Rechenweg strukturieren`,
    schemaDesc: `Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren ${titel}.`,
    schemaCaption: `${titel} wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren.`,
    schemaMerker: ziel,
    karten: [{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }],
    trainerBadge: 'MAT', trainerSymbol: nr.replace(/^0/, ''), trainerDesc: `Trainiere ${titel}.`,
    optionen: [ziel, 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen'],
    aufgaben: [
      { frage: `Was ist das Lernziel bei ${titel}?`, korrekt: ziel },
      { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' },
      { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' },
    ],
    fehlerName: `${prefix}Trainer`, begruendung: `${titel} braucht strukturierten Rechenweg und Einheitenkontrolle.`,
    naechster: 'Naechste Mathefrage', distractor: 'Blind rechnen',
    freigabeHinweis: `Formeln, Uebungswerte und Tabellenbuchbezug fuer ${titel} muessen fachlich freigegeben werden.`,
    quellenTitel: 'Tabellenbuch, Formelsammlung und Traegerskript Mathematik',
    quellenHinweis: 'Formeln und Uebungswerte nach Quelle ergaenzen.',
  });
}

const wisoDefs = [
  ['01', 'Ausbildungsvertrag', 'Ausbildungsvertrag', ['Ausbildungsvertrag', 'Rechte', 'Pflichten', 'Probezeit', 'Arbeitszeit'], 'Vertragsinhalte kennen', 'auswendig'],
  ['02', 'RechteUndPflichten', 'Rechte und Pflichten', ['Rechte', 'Pflichten', 'Sorgfalt', 'Weisung', 'Ausbildungsvertrag'], 'Pflichten zuordnen', 'auswendig'],
  ['03', 'ProbezeitUndKuendigung', 'Probezeit und Kuendigung', ['Probezeit', 'Kuendigung', 'Ausbildungsvertrag', 'Frist', 'Rechte'], 'Fristen nicht raten', 'verstehen'],
  ['04', 'ArbeitsvertragTarifvertrag', 'Arbeitsvertrag und Tarifvertrag', ['Arbeitsvertrag', 'Tarifvertrag', 'Rechte', 'Pflichten', 'Entgelt'], 'Vertragstypen trennen', 'verstehen'],
  ['05', 'TarifautonomieBetriebsrat', 'Tarifautonomie und Betriebsrat', ['Tarifautonomie', 'Betriebsrat', 'Tarifvertrag', 'Mitbestimmung', 'Rechte'], 'Mitbestimmung einordnen', 'verstehen'],
  ['06', 'JugendAuszubildendenvertretung', 'Jugend- und Auszubildendenvertretung', ['JAV', 'Betriebsrat', 'Wahl', 'Rechte', 'Auszubildende'], 'Vertretung kennen', 'auswendig'],
  ['07', 'Sozialversicherung', 'Sozialversicherung', ['Sozialversicherung', 'Krankenversicherung', 'Rentenversicherung', 'Arbeitslosenversicherung', 'Unfallversicherung'], 'Zweige nennen', 'auswendig'],
  ['08', 'ArbeitszeitUndUrlaub', 'Arbeitszeit und Urlaub', ['Arbeitszeit', 'Urlaub', 'Rechte', 'Pflichten', 'Tarifvertrag'], 'Regelungen finden', 'tabellenbuch'],
  ['09', 'Entgeltabrechnung', 'Entgeltabrechnung', ['Brutto', 'Netto', 'Abzug', 'Sozialversicherung', 'Entgelt'], 'Brutto/Netto verstehen', 'anwenden'],
  ['10', 'NachhaltigkeitUmweltschutz', 'Nachhaltigkeit und Umweltschutz', ['Nachhaltigkeit', 'Umweltschutz', 'Ressourcen', 'Wirtschaftlichkeit', 'Abfall'], 'Nachhaltigkeit betrieblich sehen', 'verstehen'],
  ['11', 'WirtschaftlichkeitProduktivitaet', 'Wirtschaftlichkeit und Produktivitaet', ['Wirtschaftlichkeit', 'Produktivitaet', 'Kosten', 'Leistung', 'OEE'], 'Kennzahlen deuten', 'anwenden'],
  ['12', 'OekonomischesPrinzip', 'Oekonomisches Prinzip', ['Minimalprinzip', 'Maximalprinzip', 'Wirtschaftlichkeit', 'Ressourcen', 'Produktivitaet'], 'Minimal/Maximalprinzip erkennen', 'verstehen'],
];

for (const [nr, prefix, titel, begriffe, ziel, stufe] of wisoDefs) {
  einheiten.push({
    id: `FK-4-WISO-${nr}`, slug: `pt-wiso-${nr}-${slugify(titel)}`, titel, thema: 'PT-WISO', prefix,
    stufen: [stufe], zahlenwerte: 'keine_zahlenwerte',
    begriffe,
    storyTitel: 'Situation im WiSo-Unterricht',
    story: `Im Unterricht geht es um "${titel}". Du sollst die Begriffe nicht auswendig raten, sondern dem Ausbildungsalltag zuordnen.`,
    einfachTitel: kurzZiel(ziel),
    einfach: `${titel}: ${ziel}. Die Regeln findest du in Vertrag, Gesetz oder betrieblichem Hinweis - nicht durch Raten.`,
    fachTitel: `${titel} einordnen`,
    fach: `"${titel}" gehoert zur Wirtschafts- und Sozialkunde der Ausbildung. Du lernst Begriffe, Rechte, Pflichten und Zusammenhaenge so, dass du sie in Aufgaben und im Betrieb korrekt zuordnen kannst. Konkrete Fristen und Betraege brauchen eine aktuelle Quelle.`,
    praxisTitel: `Praxisbeispiel ${titel}`,
    praxis: `Als Auszubildende oder Umschueler begegnest du "${titel}" in Vertrag, Abrechnung, Vertretung oder Betriebsalltag. Unklare Punkte klaerst du mit Ausbilder oder zustaendiger Stelle.`,
    merksatz: `${ziel}.`,
    quizFrage: `Was ist bei "${titel}" zentral?`,
    quizRichtig: `${ziel}.`, quizRichtigErk: 'Richtig.',
    quizFalsch: 'Alles nach Gefuehl entscheiden und Quellen ignorieren.', quizFalschErk: 'Nein. WiSo braucht belastbare Regeln.',
    schemaTitle: `${titel} als WiSo-Lernbild einordnen`,
    schemaDesc: `Begriff, Regel, Quelle, Beispiel und Pruefung strukturieren ${titel}.`,
    schemaCaption: `${titel} wird mit klaren Begriffen und Quellen gelernt, nicht durch Raten.`,
    schemaMerker: ziel,
    karten: [{ label: 'Begriff', detail: 'kennen' }, { label: 'Regel', detail: 'zuordnen' }, { label: 'Quelle', detail: 'finden' }, { label: 'Beispiel', detail: 'Betrieb' }, { label: 'Pruef.', detail: 'ueben' }],
    trainerBadge: 'WiSo', trainerSymbol: nr.replace(/^0/, ''), trainerDesc: `Trainiere ${titel}.`,
    optionen: [ziel, 'Quelle beachten', 'Begriffe korrekt zuordnen', 'Fristen frei erfinden'],
    aufgaben: [
      { frage: `Was ist das Lernziel bei ${titel}?`, korrekt: ziel },
      { frage: 'Worauf stuetzt du konkrete Angaben?', korrekt: 'Quelle beachten' },
      { frage: 'Was ist in der Pruefung wichtig?', korrekt: 'Begriffe korrekt zuordnen' },
    ],
    fehlerName: `${prefix}Trainer`, begruendung: `${titel} braucht klare Begriffe und Quellenbezug.`,
    naechster: 'Naechste WiSo-Frage', distractor: 'Fristen frei erfinden',
    freigabeHinweis: `WiSo-Inhalte und aktuelle Regelungen fuer ${titel} muessen fachlich freigegeben werden.`,
    quellenTitel: 'WiSo-Skript, Vertragstexte und aktuelle Rechtsgrundlagen',
    quellenHinweis: 'Fristen, Betraege und Paragraphenangaben nach aktueller Quelle ergaenzen.',
  });
}

const prfDefs = [
  ['01', 'AufgabenstellungRichtigLesen', 'Aufgabenstellung richtig lesen', ['Operator', 'Aufgabe', 'gegeben', 'gesucht', 'Plausibilitaet'], 'Operatoren markieren'],
  ['02', 'GegebenUndGesucht', 'Gegeben und gesucht finden', ['gegeben', 'gesucht', 'Einheit', 'Formel', 'Aufgabe'], 'Werte strukturieren'],
  ['03', 'PassendeFormelFinden', 'Passende Formel finden', ['Formel', 'Formelzeichen', 'gesucht', 'gegeben', 'Tabellenbuch'], 'Formel auswaehlen'],
  ['04', 'EinheitenKontrollieren', 'Einheiten kontrollieren', ['Einheit', 'Umrechnung', 'Formel', 'Plausibilitaet', 'Fehler'], 'Einheitenfehler finden'],
  ['05', 'TabellenbuchNutzen', 'Tabellenbuch nutzen', ['Tabellenbuch', 'Register', 'Formel', 'Einheit', 'Fundstelle'], 'Fundstellen finden'],
  ['06', 'MultipleChoiceAusschluss', 'Multiple-Choice-Ausschlussverfahren', ['Distraktor', 'Ausschluss', 'Aufgabe', 'Plausibilitaet', 'Operator'], 'Distraktoren pruefen'],
  ['07', 'UnbekannteBegriffe', 'Unbekannte Begriffe bearbeiten', ['Fachbegriff', 'Kontext', 'Tabellenbuch', 'Aufgabe', 'Operator'], 'Kontext nutzen'],
  ['08', 'Zeitmanagement', 'Zeitmanagement', ['Zeitbudget', 'Markierung', 'Aufgabe', 'Prioritaet', 'Plausibilitaet'], 'Zeit einteilen'],
  ['09', 'PruefungsangstReduzieren', 'Pruefungsangst reduzieren', ['Stress', 'Atemtechnik', 'Routine', 'Zeitbudget', 'Aufgabe'], 'Routine nutzen'],
  ['10', 'TypischePruefungsfallen', 'Typische Pruefungsfallen', ['Falle', 'Plausibilitaet', 'Einheit', 'Operator', 'Distraktor'], 'Fallen erkennen'],
  ['11', 'MiniPruefungProduktionstechnik', 'Mini-Pruefung Produktionstechnik', ['Produktionstechnik', 'Formel', 'Qualitaet', 'Fertigung', 'Mastery'], 'gemischt ueben'],
  ['12', 'MiniPruefungProduktionsplanung', 'Mini-Pruefung Produktionsplanung', ['Produktionsplanung', 'Kapazitaet', 'OEE', 'Losgroesse', 'Mastery'], 'Planung ueben'],
  ['13', 'MiniPruefungWiso', 'Mini-Pruefung WiSo', ['WiSo', 'Ausbildungsvertrag', 'Sozialversicherung', 'Rechte', 'Mastery'], 'WiSo ueben'],
  ['14', 'Wiederholungsmodus', 'Wiederholungsmodus nach Fehlern', ['Wiederholung', 'Mastery', 'Schwachstelle', 'Fehler', 'Aufgabe'], 'Schwachstellen nutzen'],
  ['15', 'PersoenlicheSchwachstellen', 'Persoenliche Schwachstellen erkennen', ['Schwachstelle', 'Trend', 'Mastery', 'Lernplan', 'Wiederholung'], 'Lernplan ableiten'],
  ['16', 'PruefungssimulationAbschluss', 'Pruefungssimulation Abschluss', ['Simulation', 'Ergebnis', 'Zeitbudget', 'Mastery', 'Plausibilitaet'], 'realistisch trainieren'],
];

for (const [nr, prefix, titel, begriffe, ziel] of prfDefs) {
  einheiten.push({
    id: `FK-4-PRF-${nr}`, slug: `pt-prf-${nr}-${slugify(titel)}`, titel, thema: 'PT-PRF', prefix,
    stufen: ['anwenden'], zahlenwerte: 'keine_zahlenwerte',
    begriffe,
    storyTitel: 'Situation in der Pruefungsvorbereitung',
    story: `Du uebst "${titel}". Ziel ist nicht Auswendiglernen einzelner Antworten, sondern ein sicherer Bearbeitungsweg.`,
    einfachTitel: kurzZiel(ziel),
    einfach: `${titel}: ${ziel}. So bleibst du in der Pruefung ruhig und strukturiert.`,
    fachTitel: `${titel} als Pruefungsstrategie`,
    fach: `"${titel}" trainiert einen Teil der Pruefungsstrategie. Du lernst, Aufgaben zu lesen, Werte zu ordnen, Formeln und Einheiten zu kontrollieren und Fehlerquellen zu vermeiden. Die Uebungsfragen sind neu formuliert und keine Originalpruefung.`,
    praxisTitel: `Uebungsbeispiel ${titel}`,
    praxis: `In Mini-Pruefungen wendest du "${titel}" auf gemischte Aufgaben an. Danach markierst du Schwachstellen fuer die Wiederholung.`,
    merksatz: `${ziel}.`,
    quizFrage: `Was ist bei "${titel}" zentral?`,
    quizRichtig: `${ziel}.`, quizRichtigErk: 'Richtig.',
    quizFalsch: 'Aufgaben ohne Strategie einfach durchraten.', quizFalschErk: 'Nein. Strategie reduziert typische Fehler.',
    schemaTitle: `${titel} als Pruefungsstrategie trainieren`,
    schemaDesc: `Lesen, Struktur, Kontrolle, Zeit und Wiederholung tragen ${titel}.`,
    schemaCaption: `${titel} wird als wiederholbarer Pruefungsschritt geuebt.`,
    schemaMerker: ziel,
    karten: [{ label: 'Lesen', detail: 'klar' }, { label: 'Struktur', detail: 'ordnen' }, { label: 'Kontroll.', detail: 'Einheit' }, { label: 'Zeit', detail: 'teilen' }, { label: 'Wiederh.', detail: 'ueben' }],
    trainerBadge: 'PRF', trainerSymbol: nr.replace(/^0/, ''), trainerDesc: `Trainiere ${titel}.`,
    optionen: [ziel, 'Rechenweg strukturieren', 'Ergebnis pruefen', 'Antworten nur raten'],
    aufgaben: [
      { frage: `Was ist das Ziel bei ${titel}?`, korrekt: ziel },
      { frage: 'Was hilft gegen typische Fehler?', korrekt: 'Rechenweg strukturieren' },
      { frage: 'Was machst du vor dem Abgeben?', korrekt: 'Ergebnis pruefen' },
    ],
    fehlerName: `${prefix}Trainer`, begruendung: `${titel} braucht eine klare Pruefungsstrategie.`,
    naechster: 'Naechste Pruefungsfrage', distractor: 'Antworten nur raten',
    freigabeHinweis: `Pruefungsstrategie und Uebungsfragen fuer ${titel} muessen fachlich freigegeben werden.`,
    quellenTitel: 'Traegerskript Pruefungsvorbereitung und eigene Uebungsfragen',
    quellenHinweis: 'Keine IHK/PAL-Originalaufgaben verwenden; Uebungssets freigeben.',
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function kurzZiel(ziel) {
  return ziel.charAt(0).toUpperCase() + ziel.slice(1);
}

function mdxFor(e) {
  const quizId = e.id.split('-').pop().toLowerCase();
  return `---
titel: "${e.titel}"
thema_code: "${e.thema}"
lesedauer_minuten: 8
review_status: "entwurf"
zahlenwerte_status: "${e.zahlenwerte}"
fachliche_freigabe:
  erforderlich: true
  freigegeben_von: null
  freigegeben_am: null
  hinweis: "Entwurf fuer Kapitel 4. ${e.freigabeHinweis}"
quellen:
  - titel: "${e.quellenTitel}"
    seite: "Abschnitt [vom Ausbilder einzutragen]"
    status: "offen"
    hinweis: "${e.quellenHinweis}"
---

<WissensstufenLeiste stufen={${JSON.stringify(e.stufen)}} />

<StoryEinstieg titel="${e.storyTitel}">
${e.story}
</StoryEinstieg>

<BegriffListe begriffe={${JSON.stringify(e.begriffe)}} />

## Sehr einfach erklaert

<EinfachErklaert titel="${e.einfachTitel}">
${e.einfach}
</EinfachErklaert>

<${e.prefix}Schema />

<${e.prefix}Trainer titel="${e.titel}" />

## Fachlich richtig erklaert

<FachlichErklaert titel="${e.fachTitel}">
${e.fach}
</FachlichErklaert>

<Praxisbeispiel titel="${e.praxisTitel}">
${e.praxis}
</Praxisbeispiel>

<Merksatz titel="Merksatz">
${e.merksatz}
</Merksatz>

## Mini-Wissenscheck

<MiniWissenscheck
  id="${e.id}::check"
  fragen={[{ id: "${quizId}", masterySchluessel: "${e.id}::kern", aufgabenstellung: "${e.quizFrage}", optionen: [{ id: "richtig", text: "${e.quizRichtig}", istKorrekt: true, erklaerung: "${e.quizRichtigErk}" }, { id: "falsch", text: "${e.quizFalsch}", istKorrekt: false, erklaerung: "${e.quizFalschErk}" }] }]}
/>
`;
}

function schemaTs(e) {
  const merker = e.schemaMerker ? ` merker="${e.schemaMerker}"` : '';
  const karten = e.karten.map((k) => `{ label: '${k.label}', detail: '${k.detail}' }`).join(', ');
  return `
export interface ${e.prefix}SchemaProps {
  className?: string;
}

export function ${e.prefix}Schema({ className }: ${e.prefix}SchemaProps) {
  return <QualitaetSchemaBase className={className} title="${e.schemaTitle}" desc="${e.schemaDesc}" caption="${e.schemaCaption}"${merker} karten={[${karten}]} />;
}
`;
}

function trainerInterface(e) {
  return `
export interface ${e.prefix}TrainerProps {
  titel?: string;
  className?: string;
}
`;
}

function trainerTs(e) {
  const optionen = e.optionen.map((o) => `'${o.replace(/'/g, "\\'")}'`).join(', ');
  const aufgaben = e.aufgaben
    .map((a) => `{ frage: '${a.frage.replace(/'/g, "\\'")}', korrekt: '${a.korrekt.replace(/'/g, "\\'")}' }`)
    .join(', ');
  return `
export function ${e.prefix}Trainer({ titel = '${e.titel.replace(/'/g, "\\'")}', className }: ${e.prefix}TrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="${e.trainerDesc}" badgeText="${e.trainerBadge}" badgeSymbol="${e.trainerSymbol}" optionen={[${optionen}]} aufgaben={[${aufgaben}]} fehlerName="${e.fehlerName}" standardBegruendung="${e.begruendung}" naechsterButton="${e.naechster}" className={className} />;
}
`;
}

const glossarExtras = {
  OEE: ['Gesamtanlageneffektivitaet aus Verfuegbarkeit, Leistungsgrad und Qualitaetsrate.', 'Eine Kennzahl, wie wirksam eine Anlage insgesamt arbeitet.', 'OEE zerlegt Verluste in Laufzeit, Leistung und Qualitaet.'],
  Verfuegbarkeit: ['Anteil der geplanten Zeit, in dem eine Anlage tatsaechlich laeuft.', 'Wie viel der geplanten Zeit wirklich produziert wurde.', 'Verfuegbarkeit = Laufzeit / Planzeit nach Betriebsregel.'],
  Leistungsgrad: ['Verhaeltnis von Istleistung zu freigegebener Sollleistung.', 'Ob die Anlage so schnell liefert wie geplant.', 'Leistungsgrad braucht eine klare Sollbasis.'],
  Qualitaetsrate: ['Anteil der Gutmenge an der produzierten Gesamtmenge.', 'Wie gross der Anteil guter Teile ist.', 'Nacharbeit wird nur nach Regel bewertet.'],
  Verlust: ['Abweichung, die Verfuegbarkeit, Leistung oder Qualitaet mindert.', 'Etwas, das Kennzahlen und Nutzen verschlechtert.', 'OEE-Verbesserung startet beim groessten Verlust.'],
  Sollleistung: ['Freigegebene Zielausbringung je Zeit oder Zyklus.', 'Das Leistungssoll der Anlage.', 'Ohne Sollbasis ist der Leistungsgrad nicht belastbar.'],
  Produktionsleistung: ['Ausbringung einer Anlage oder Linie bezogen auf die Zeit.', 'Wie viele Teile in einer Zeit entstehen.', 'Produktionsleistung verbindet Menge und Zeit.'],
  gegeben: ['In der Aufgabe genannte Ausgangswerte.', 'Die Zahlen und Angaben, die du schon hast.', 'Gegebene Werte werden vor dem Rechnen markiert.'],
  gesucht: ['Die Groesse, die in der Aufgabe ermittelt werden soll.', 'Das, was du herausfinden sollst.', 'Gesucht bestimmt Formelwahl und Umstellung.'],
  Summe: ['Ergebnis einer Addition.', 'Das Ergebnis beim Zusammenzaehlen.', 'Summenfehler entstehen oft durch falsche Vorzeichen oder Einheiten.'],
  Produkt: ['Ergebnis einer Multiplikation.', 'Das Ergebnis beim Malnehmen.', 'Produkte brauchen passende Einheiten.'],
  Dreisatz: ['Rechenverfahren fuer proportionale Beziehungen.', 'Wenn sich etwas im gleichen Verhaeltnis aendert.', 'Dreisatz braucht klare Zuordnung der Groessen.'],
  Prozent: ['Anteil bezogen auf Hundert.', 'Wie gross ein Anteil von etwas ist.', 'Prozentrechnung braucht Grundwert und Anteil.'],
  Grundwert: ['Bezugsmenge, auf die ein Prozentanteil bezogen wird.', 'Die Ausgangsmenge bei Prozentrechnung.', 'Ohne Grundwert ist Prozentrechnung nicht moeglich.'],
  Anteil: ['Teil einer Gesamtmenge.', 'Ein Stueck vom Ganzen.', 'Anteile werden oft als Prozent angegeben.'],
  Umfang: ['Laenge der Begrenzung einer Flaeche.', 'Der Randweg um eine Form.', 'Beim Rechteck: zwei mal Laenge plus Breite.'],
  Radius: ['Abstand vom Kreismittelpunkt zum Kreisrand.', 'Die halbe Strecke durch den Kreis.', 'Radius = Durchmesser / 2.'],
  Durchmesser: ['Strecke durch den Kreismittelpunkt von Rand zu Rand.', 'Die volle Breite eines Kreises.', 'Durchmesser = 2 mal Radius.'],
  Quader: ['Koerper mit sechs rechteckigen Seitenflaechen.', 'Ein kastenförmiger Koerper.', 'Volumen Quader = Laenge mal Breite mal Hoehe.'],
  Zylinder: ['Koerper mit kreisfoermiger Grundflaeche und Hoehe.', 'Wie eine Dose oder Rolle.', 'Volumen Zylinder braucht Kreisflaeche mal Hoehe.'],
  Wirkungsgrad: ['Verhaeltnis von Nutzleistung zu zugefuehrter Leistung.', 'Wie viel von der eingesetzten Energie wirklich nuetzt.', 'Wirkungsgrad liegt unter 1 bzw. unter 100 Prozent.'],
  Arbeit: ['Energieumsatz als Kraft mal Weg oder Leistung mal Zeit.', 'Was ueber eine Strecke oder Zeit verrichtet wird.', 'Arbeit und Leistung muessen in der Formel getrennt bleiben.'],
  Uebersetzung: ['Verhaeltnis der Drehzahlen oder Zaehnezahlen in einem Getriebe.', 'Wie stark Drehzahl und Drehmoment gewandelt werden.', 'Uebersetzung verbindet Antrieb und Abtrieb.'],
  Hebelarm: ['Senkrechter Abstand zwischen Kraftwirkungslinie und Drehpunkt.', 'Der Abstand, mit dem eine Kraft dreht.', 'Drehmoment = Kraft mal Hebelarm.'],
  Gutmenge: ['Menge der Teile, die die Qualitaetsanforderung erfuellen.', 'Die guten Teile.', 'Gutmenge fliesst in Qualitaetsrate und Ausschussquote.'],
  Ausdehnungskoeffizient: ['Werkstoffkennwert fuer die relative Laengenaenderung je Temperaturdifferenz.', 'Wie stark sich Material bei Temperatur aendert.', 'Werte nur aus Tabellenbuch oder Datenblatt.'],
  Grenzmass: ['Zulaessiges oberes oder unteres Mass aus Nennmass und Abmass.', 'Die Grenze, bis zu der ein Mass noch passt.', 'OG und UG begrenzen das Toleranzfeld.'],
  Umstellen: ['Umformen einer Formel, sodass die gesuchte Groesse isoliert steht.', 'Die Formel so drehen, dass das Gesuchte allein steht.', 'Umstellen braucht gleiche Operationen auf beiden Seiten.'],
  Plausibilitaet: ['Pruefung, ob ein Ergebnis groessenordnung und Einheit nach sinnvollen ist.', 'Ob das Ergebnis ueberhaupt passen kann.', 'Plausibilitaet faengt grobe Rechenfehler ab.'],
  Ausbildungsvertrag: ['Vertrag ueber Inhalt, Dauer und Bedingungen einer Ausbildung.', 'Der Vertrag fuer deine Ausbildung.', 'Rechte und Pflichten stehen im Ausbildungsvertrag.'],
  Rechte: ['Rechtlich geschuetzte Ansprueche einer Person.', 'Was dir zusteht.', 'Rechte stehen oft neben Pflichten.'],
  Pflichten: ['Rechtlich oder vertraglich geschuldete Handlungen.', 'Was du tun musst.', 'Pflichten gelten fuer Azubi und Ausbildungsbetrieb.'],
  Sorgfalt: ['Pflicht, Aufgaben gewissenhaft und aufmerksam zu erledigen.', 'Sorgfaeltig und verantwortungsvoll arbeiten.', 'Sorgfalt schuetzt Qualitaet und Sicherheit.'],
  Weisung: ['Anordnung berechtigter Personen im Betrieb im Rahmen der Vorschriften.', 'Eine Anweisung, wie etwas zu tun ist.', 'Weisungen muessen rechtmaessig und zumutbar sein.'],
  Probezeit: ['Anfangszeitraum eines Vertrags mit besonderen Kuendigungsregeln.', 'Die Zeit zum gegenseitigen Kennenlernen.', 'Fristen nicht raten, Quelle lesen.'],
  Kuendigung: ['Einseitige Beendigung eines Vertragsverhaeltnisses.', 'Wenn ein Vertrag beendet wird.', 'Form und Frist sind entscheidend.'],
  Frist: ['Zeitraum, in dem etwas erklaert oder erledigt sein muss.', 'Bis wann etwas gelten oder passieren muss.', 'Fristen kommen aus Vertrag oder Gesetz.'],
  Arbeitsvertrag: ['Vertrag ueber Arbeitsleistung gegen Entgelt.', 'Der Vertrag fuer die Arbeit.', 'Arbeitsvertrag und Ausbildungsvertrag sind zu unterscheiden.'],
  Tarifvertrag: ['Schriftliche Vereinbarung zwischen Tarifparteien zu Arbeitsbedingungen.', 'Regeln, die Gewerkschaft und Arbeitgeberseite aushandeln.', 'Tarifvertrag kann Entgelt und Arbeitszeit regeln.'],
  Tarifautonomie: ['Recht der Tarifparteien, Arbeitsbedingungen unabhaengig vom Staat zu vereinbaren.', 'Dass Tarifpartner selbst verhandeln duerfen.', 'Tarifautonomie gehoert zur Mitbestimmungslandschaft.'],
  Betriebsrat: ['Gewaehlte Interessenvertretung der Beschaeftigten im Betrieb.', 'Die Vertretung der Belegschaft.', 'Betriebsrat wirkt bei vielen betrieblichen Themen mit.'],
  Mitbestimmung: ['Rechtliche Beteiligung von Beschaeftigtenvertretungen an Entscheidungen.', 'Mitreden bei betrieblichen Themen.', 'Mitbestimmung hat klare gesetzliche Grenzen und Rechte.'],
  JAV: ['Jugend- und Auszubildendenvertretung.', 'Die Vertretung junger Beschaeftigter und Azubis.', 'JAV arbeitet mit dem Betriebsrat zusammen.'],
  Wahl: ['Demokratische Bestimmung von Vertretungen.', 'Abstimmung ueber Vertreter.', 'Wahlrechte und -pflichten stehen in den Regeln.'],
  Auszubildende: ['Personen in einer anerkannten Berufsausbildung.', 'Azubis im Betrieb.', 'Ihre Rechte und Pflichten stehen im Ausbildungsvertrag.'],
  Sozialversicherung: ['Gesetzliches Sicherungssystem mit mehreren Versicherungszweigen.', 'Die Pflichtversicherungen fuer soziale Risiken.', 'Typisch: KV, PV, RV, AV und UV.'],
  Krankenversicherung: ['Zweig der Sozialversicherung fuer Krankheitskosten und Absicherung.', 'Versicherung bei Krankheit.', 'Teil der Sozialversicherung.'],
  Rentenversicherung: ['Zweig der Sozialversicherung fuer Alter und Erwerbsminderung.', 'Versicherung fuer die Rente.', 'Teil der Sozialversicherung.'],
  Arbeitslosenversicherung: ['Zweig der Sozialversicherung bei Arbeitslosigkeit.', 'Versicherung bei Verlust des Arbeitsplatzes.', 'Teil der Sozialversicherung.'],
  Unfallversicherung: ['Zweig der Sozialversicherung fuer Arbeits- und Wegeunfaelle.', 'Versicherung bei Arbeitsunfall.', 'Teil der Sozialversicherung.'],
  Pflegeversicherung: ['Zweig der Sozialversicherung fuer Pflegebeduerftigkeit.', 'Versicherung fuer Pflege.', 'Teil der Sozialversicherung.'],
  Urlaub: ['Bezahlte Freistellung von der Arbeit nach Gesetz oder Tarif.', 'Freie Tage zum Erholen.', 'Anspruch und Dauer nicht raten.'],
  Entgelt: ['Verguetung fuer geleistete Arbeit oder Ausbildung.', 'Das Geld fuer die Arbeit.', 'Brutto und Netto unterscheiden.'],
  Brutto: ['Entgelt vor Abzuegen.', 'Das Geld vor Steuern und Sozialabgaben.', 'Brutto steht oft oben auf der Abrechnung.'],
  Netto: ['Entgelt nach Abzuegen.', 'Das Geld, das ausgezahlt wird.', 'Netto = Brutto minus Abzuege.'],
  Abzug: ['Abgesetzter Betrag vom Bruttoentgelt.', 'Was vom Brutto abgezogen wird.', 'Typisch Steuern und Sozialversicherung.'],
  Nachhaltigkeit: ['Wirtschaften so, dass oekonomische, oekologische und soziale Ziele dauerhaft tragfaehig bleiben.', 'Heute so handeln, dass morgen noch geht.', 'Im Betrieb betrifft das Ressourcen, Abfall und Prozesse.'],
  Ressourcen: ['Eingesetzt Mittel wie Material, Energie, Zeit und Personal.', 'Das, was verbraucht oder genutzt wird.', 'Ressourcen sparsam und zielgerichtet einsetzen.'],
  Kosten: ['Bewerteter Ressourcenverbrauch fuer Leistungserstellung.', 'Was etwas kostet.', 'Kosten beeinflussen Wirtschaftlichkeit.'],
  Wirtschaftlichkeit: ['Verhaeltnis von Leistung zu Kosten bzw. Mitteleinsatz.', 'Ob Aufwand und Nutzen gut zusammenpassen.', 'Wirtschaftlichkeit wird mit Kennzahlen bewertet.'],
  Produktivitaet: ['Verhaeltnis von Ausbringung zu eingesetzten Faktoren.', 'Wie viel mit dem Einsatz entsteht.', 'Produktivitaet ist von OEE verwandt, aber nicht identisch.'],
  Minimalprinzip: ['Mit moeglichst geringem Einsatz ein festes Ziel erreichen.', 'Weniger Aufwand fuer dasselbe Ziel.', 'Teil des oekonomischen Prinzips.'],
  Maximalprinzip: ['Mit gegebenem Einsatz den groesstmoeglichen Erfolg erreichen.', 'Mehr Ergebnis aus demselben Einsatz.', 'Teil des oekonomischen Prinzips.'],
  Operator: ['Aufforderungswort in einer Aufgabe, zum Beispiel berechnen, erklaeren, vergleichen.', 'Das Wort, das sagt, was du tun sollst.', 'Operatoren steuern den Loesungsweg.'],
  Aufgabe: ['Gestellte Anforderung mit gegebenen Informationen und gesuchtem Ergebnis.', 'Das, was du loesen sollst.', 'Aufgabe zuerst lesen, dann rechnen.'],
  Distraktor: ['Plausible falsche Antwortoption in Multiple-Choice-Aufgaben.', 'Eine Antwort, die falsch ist, aber verlockend wirkt.', 'Distraktoren werden systematisch ausgeschlossen.'],
  Ausschluss: ['Verfahren, unpassende Optionen schrittweise zu verwerfen.', 'Falsche Antworten streichen.', 'Ausschlussverfahren hilft bei MC-Aufgaben.'],
  Kontext: ['Umgebende Informationen, die einen Begriff oder eine Aufgabe verstaendlich machen.', 'Der Zusammenhang drumherum.', 'Unbekannte Begriffe zuerst aus dem Kontext lesen.'],
  Register: ['Inhalts- oder Stichwortverzeichnis eines Nachschlagewerks.', 'Das Verzeichnis zum Finden von Seiten.', 'Im Tabellenbuch fuehrt das Register zur Fundstelle.'],
  Fundstelle: ['Stelle in einem Nachschlagewerk, an der eine Angabe steht.', 'Wo du die Information findest.', 'Fundstellen nicht aus dem Gedaechtnis erfinden.'],
  Zeitbudget: ['Verfuegbare Zeit fuer Aufgabe, Teil oder gesamte Pruefung.', 'Wie viel Zeit du hast.', 'Zeitbudget steuert die Bearbeitungsreihenfolge.'],
  Markierung: ['Kennzeichnung wichtiger Stellen in Aufgabe oder Unterlage.', 'Etwas sichtbar anstreichen.', 'Markierungen helfen gegen Lesefehler.'],
  Prioritaet: ['Reihenfolge nach Wichtigkeit oder Nutzen.', 'Was zuerst kommt.', 'In der Pruefung zuerst sichere Punkte sichern.'],
  Stress: ['Belastungszustand mit koerperlicher und mentaler Anspannung.', 'Innere Anspannung vor oder in der Pruefung.', 'Routine und Atmung helfen gegen Pruefungsstress.'],
  Atemtechnik: ['Bewusste Atemuebung zur Beruhigung und Konzentration.', 'Ruhig und bewusst atmen.', 'Kurze Atemtechnik vor schwierigen Aufgaben.'],
  Routine: ['Eingeuebter Ablauf, der Sicherheit gibt.', 'Ein gewohnter sicherer Weg.', 'Pruefungsroutine reduziert Angst und Fehler.'],
  Falle: ['Typische Fehlerquelle in Pruefungsaufgaben.', 'Ein Trick oder haeufiger Stolperstein.', 'Fallen erkennst du mit Plausibilitaet und Einheitenkontrolle.'],
  Produktionstechnik: ['Fachlicher Pruefungsbereich zu Fertigung, Maschinen und Prozessen.', 'Der technische Teil der Pruefung.', 'Mini-Pruefungen trainieren gemischte Produktionstechnik.',],
  Produktionsplanung: ['Planung von Mengen, Zeiten, Ressourcen und Terminen.', 'Wie Produktion vorbereitet und gesteuert wird.', 'Mini-Pruefungen verbinden Planung, Lager und OEE.'],
  WiSo: ['Wirtschafts- und Sozialkunde.', 'Der gesellschaftliche und rechtliche Pruefungsteil.', 'WiSo braucht Begriffe und aktuelle Regeln.'],
  Wiederholung: ['Erneutes Ueben von Inhalten nach Fehlern oder Abstand.', 'Nochmal gezielt ueben.', 'Wiederholung folgt Schwachstellen, nicht Zufall.'],
  Mastery: ['Lernstandssystem, das Koennen und Wiederholungsbedarf abbildet.', 'Dein Lernstand je Thema.', 'Mastery steuert Wiederholung und Fortschritt.'],
  Schwachstelle: ['Thema oder Aufgabentyp mit erhoehtem Fehleranteil.', 'Das, was dir noch schwerfaellt.', 'Schwachstellen werden im Lernplan priorisiert.'],
  Trend: ['Richtung einer Entwicklung ueber mehrere Versuche.', 'Ob es besser oder schlechter wird.', 'Trends helfen, Lernplan und Wiederholung zu steuern.'],
  Lernplan: ['Geplante Reihenfolge von Themen, Uebungen und Wiederholungen.', 'Dein Plan, was du als Naechstes uebst.', 'Lernplan folgt Schwachstellen und Pruefungsterminen.'],
  Simulation: ['Realitaetsnahe Uebung unter pruefungsnahen Bedingungen.', 'Wie eine echte Pruefung ueben.', 'Simulation trainiert Zeit, Strategie und Ausdauer.'],
  Ergebnis: ['Resultierende Groesse einer Berechnung oder Pruefung.', 'Das, was herauskommt.', 'Ergebnis immer mit Einheit und Plausibilitaet pruefen.'],
  Formelzeichen: ['Buchstabe oder Symbol fuer eine physikalische oder technische Groesse.', 'Das Zeichen in der Formel.', 'Formelzeichen muessen zur Einheit passen.'],
  Fehler: ['Abweichung vom Soll oder falsche Bearbeitung.', 'Etwas stimmt nicht.', 'Fehler werden analysiert und wiederholt geuebt.'],
};

// Write MDX files
for (const e of einheiten) {
  const file = path.join(root, 'content/fachkunde', `${e.slug}.mdx`);
  writeFileSync(file, mdxFor(e), 'utf8');
}

// Append schemas after Kanban/Lean block marker
const fachkundePath = path.join(root, 'packages/ui/src/fachkunde.tsx');
let fachkunde = readFileSync(fachkundePath, 'utf8');
if (!fachkunde.includes('OeeUeberblickenSchema')) {
  const insertAt = fachkunde.indexOf('export interface ProduktionskarteProps');
  if (insertAt < 0) throw new Error('Insert marker ProduktionskarteProps not found');
  const schemas = einheiten.map(schemaTs).join('\n');
  fachkunde = fachkunde.slice(0, insertAt) + schemas + '\n' + fachkunde.slice(insertAt);
  writeFileSync(fachkundePath, fachkunde, 'utf8');
}

const interaktivPath = path.join(root, 'packages/ui/src/fachkunde-interaktiv.tsx');
let interaktiv = readFileSync(interaktivPath, 'utf8');

if (!interaktiv.includes('OeeUeberblickenTrainerProps')) {
  const ifaceAt = interaktiv.indexOf('interface FachbegriffInfo');
  if (ifaceAt < 0) throw new Error('FachbegriffInfo marker missing');
  interaktiv = interaktiv.slice(0, ifaceAt) + einheiten.map(trainerInterface).join('\n') + '\n' + interaktiv.slice(ifaceAt);
}

if (!interaktiv.includes('OeeUeberblickenTrainer(')) {
  const trainerAt = interaktiv.indexOf('export function InteraktiverMessschieber');
  if (trainerAt < 0) throw new Error('InteraktiverMessschieber marker missing');
  interaktiv = interaktiv.slice(0, trainerAt) + einheiten.map(trainerTs).join('\n') + '\n' + interaktiv.slice(trainerAt);
}

// Add glossar terms before Einheit: if missing
for (const [term, [fach, einfach, bezug]] of Object.entries(glossarExtras)) {
  const key = term.match(/^[A-Za-z_]/) ? `${term}:` : `'${term}':`;
  if (!interaktiv.includes(`  ${key}`) && !interaktiv.includes(`  '${term}':`)) {
    const insert = `  ${term.match(/^[A-Za-z_]/) ? term : `'${term}'`}: {\n    fachdefinition: '${fach.replace(/'/g, "\\'")}',\n    einfach: '${einfach.replace(/'/g, "\\'")}',\n    bezug: '${bezug.replace(/'/g, "\\'")}',\n  },\n`;
    const marker = '  Einheit: {';
    if (!interaktiv.includes(marker)) throw new Error('Einheit glossar marker missing');
    interaktiv = interaktiv.replace(marker, insert + marker);
  }
}

writeFileSync(interaktivPath, interaktiv, 'utf8');

// Write meta for wiring
writeFileSync(
  path.join(root, 'scripts/.kapitel4-rest-meta.json'),
  JSON.stringify(
    {
      themen: {
        'PT-OEE': 'OEE',
        'PT-MAT': 'Technische Mathematik',
        'PT-WISO': 'Wirtschafts- und Sozialkunde',
        'PT-PRF': 'Pruefungsvorbereitung',
      },
      einheiten: einheiten.map((e) => ({
        id: e.id,
        slug: e.slug,
        thema: e.thema,
        prefix: e.prefix,
        titel: e.titel,
        distractor: e.distractor,
        schemaTitle: e.schemaTitle,
      })),
    },
    null,
    2,
  ),
  'utf8',
);

console.log(`Generated ${einheiten.length} units.`);
