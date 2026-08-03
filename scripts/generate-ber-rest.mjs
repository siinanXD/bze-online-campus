/**
 * Ergaenzt BER-004 bis BER-008 und aktualisiert die Verdrahtung analog zum Restgenerator.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const einheiten = [
  {
    id: 'FK-1-BER-004', slug: 'pt-ber-04-produktionsauftrag-lesen', titel: 'Produktionsauftrag lesen', thema: 'PT-BER', prefix: 'ProduktionsauftragLesen',
    stufen: ['anwenden'], zahlenwerte: 'keine_zahlenwerte',
    begriffe: ['Auftrag', 'Los', 'Termin', 'Zeichnung', 'Material'],
    storyTitel: 'Situation am Schichtstart',
    story: 'Am Arbeitsplatz liegt ein neuer Auftrag. Bevor du rustest, musst du Teil, Menge, Termin und Vorgaben sicher finden.',
    einfachTitel: 'Auftrag zuerst lesen',
    einfach: 'Der Auftrag sagt, was hergestellt werden soll. Ohne diese Angaben startest du nicht.',
    fachTitel: 'Auftrag als verbindliche Vorgabe',
    fach: 'Ein Produktionsauftrag buendelt Produkt, Menge, Termin, Material und Qualitaetsvorgaben. Fehlende oder unklare Daten werden vor dem Start geklaert. So vermeidest du Fehlfertigung und Terminrisiko.',
    praxisTitel: 'Praxisbeispiel fehlende Zeichnungsnummer',
    praxis: 'Die Menge steht im Auftrag, die Zeichnungsnummer fehlt. Du klaerst nach, statt mit einer vermuteten Unterlage zu starten.',
    merksatz: 'Erst Auftrag klaeren, dann starten.',
    quizFrage: 'Was machst du bei unklaren Auftragsdaten?',
    quizRichtig: 'Vor dem Start klaeren und nachfragen.', quizRichtigErk: 'Richtig. Unklare Daten duerfen nicht weggeraten werden.',
    quizFalsch: 'Einfach mit dem naechsten aehnlichen Auftrag weiterarbeiten.', quizFalschErk: 'Nein. Falsche Vorgaben fuehren zu Ausschuss.',
    schemaTitle: 'Produktionsauftrag mit Teil Menge Termin und Vorgabe lesen',
    schemaDesc: 'Teil, Menge, Termin, Zeichnung und offene Punkte strukturieren den Auftragscheck.',
    schemaCaption: 'Der Auftrag ist die Startquelle. Offene Punkte werden vor dem Ruesten geklaert.',
    schemaMerker: 'Auftrag vor Start klaeren',
    karten: [{ label: 'Teil', detail: 'was?' }, { label: 'Menge', detail: 'wie viel?' }, { label: 'Termin', detail: 'bis wann?' }, { label: 'Zeichn.', detail: 'Quelle' }, { label: 'Offen', detail: 'klaeren' }],
    trainerBadge: 'Auftrag', trainerSymbol: 'A', trainerDesc: 'Ordne Auftragsdaten und Klaerung.',
    optionen: ['Teil und Menge finden', 'Termin pruefen', 'Offene Punkte klaeren', 'Unklare Daten ignorieren'],
    aufgaben: [
      { frage: 'Was brauchst du zuerst aus dem Auftrag?', korrekt: 'Teil und Menge finden' },
      { frage: 'Was zeigt den Lieferdruck?', korrekt: 'Termin pruefen' },
      { frage: 'Was ist bei Luecken richtig?', korrekt: 'Offene Punkte klaeren' },
    ],
    fehlerName: 'ProduktionsauftragLesenTrainer', begruendung: 'Auftragsdaten werden gelesen und Luecken vor dem Start geklaert.',
    naechster: 'Naechste Auftragsfrage', distractor: 'Unklare Daten ignorieren',
    freigabeHinweis: 'Auftragsformulare und Pflichtfelder muessen fachlich freigegeben werden.',
    quellenTitel: 'Traegerskript Produktionsauftrag und betriebliche Formulare',
    quellenHinweis: 'Pflichtfelder und Beispiele nach Quelle ergaenzen.',
  },
  {
    id: 'FK-1-BER-005', slug: 'pt-ber-05-produktionsablauf-verstehen', titel: 'Produktionsablauf verstehen', thema: 'PT-BER', prefix: 'ProduktionsablaufVerstehen',
    stufen: ['verstehen'], zahlenwerte: 'keine_zahlenwerte',
    begriffe: ['Materialfluss', 'Arbeitsplatz', 'Auftrag', 'Pruefen', 'Freigabe'],
    storyTitel: 'Situation in der Halle',
    story: 'Material kommt von links, die Presse steht in der Mitte, Pruefung und Verpackung folgen. Du sollst den Ablauf in der richtigen Reihenfolge erklaeren.',
    einfachTitel: 'Von Station zu Station',
    einfach: 'Produktion laeuft in Schritten. Jede Station braucht Material, Information und oft eine Pruefung.',
    fachTitel: 'Ablauf als verbundenes System',
    fach: 'Ein Produktionsablauf verbindet Auftrag, Materialbereitstellung, Bearbeitung, Pruefung und Weitergabe. Stoerungen an einer Station wirken auf die naechsten. Deshalb denkst du in Ablaeufen, nicht nur in Einzelgriffen.',
    praxisTitel: 'Praxisbeispiel Engpass Pruefung',
    praxis: 'Wenn die Pruefung stockt, stauen sich Teile vor der Station. Der Ablauf zeigt, warum engpassnahe Stoerungen schnell gemeldet werden muessen.',
    merksatz: 'Ablauf denken: vorher, hier, nachher.',
    quizFrage: 'Warum ist der Produktionsablauf wichtig?',
    quizRichtig: 'Weil Stationen verbunden sind und Stoerungen weiterwirken.', quizRichtigErk: 'Richtig. Ablaufdenken verhindert isolierte Fehler.',
    quizFalsch: 'Weil nur die eigene Maschine zaehlt und der Rest egal ist.', quizFalschErk: 'Nein. Vorherige und folgende Stationen gehoeren dazu.',
    schemaTitle: 'Produktionsablauf als Stationenkette verstehen',
    schemaDesc: 'Auftrag, Material, Bearbeitung, Pruefung und Weitergabe bilden den Ablauf.',
    schemaCaption: 'Der Ablauf zeigt, wie Stationen voneinander abhaengen.',
    schemaMerker: 'vorher - hier - nachher',
    karten: [{ label: 'Auftrag', detail: 'start' }, { label: 'Material', detail: 'bereit' }, { label: 'Bearb.', detail: 'machen' }, { label: 'Pruef.', detail: 'sichern' }, { label: 'Weiter', detail: 'geben' }],
    trainerBadge: 'Ablauf', trainerSymbol: 'AB', trainerDesc: 'Ordne die Stationen im Ablauf.',
    optionen: ['Auftrag zuerst lesen', 'Material bereitstellen', 'Ergebnis pruefen', 'Pruefung einfach weglassen'],
    aufgaben: [
      { frage: 'Womit beginnt der Ablauf?', korrekt: 'Auftrag zuerst lesen' },
      { frage: 'Was braucht die Maschine vor dem Start?', korrekt: 'Material bereitstellen' },
      { frage: 'Was sichert Qualitaet im Ablauf?', korrekt: 'Ergebnis pruefen' },
    ],
    fehlerName: 'ProduktionsablaufVerstehenTrainer', begruendung: 'Produktionsablaeufe verbinden Auftrag, Material, Bearbeitung und Pruefung.',
    naechster: 'Naechste Ablaufsfrage', distractor: 'Pruefung einfach weglassen',
    freigabeHinweis: 'Betriebliche Ablaufbeispiele muessen fachlich freigegeben werden.',
    quellenTitel: 'Rahmenlehrplan und Traegerskript Produktionsablauf',
    quellenHinweis: 'Stationsbezeichnungen nach Betrieb ergaenzen.',
  },
  {
    id: 'FK-1-BER-006', slug: 'pt-ber-06-schichtbeginn-vorbereiten', titel: 'Schichtbeginn vorbereiten', thema: 'PT-BER', prefix: 'SchichtbeginnVorbereiten',
    stufen: ['anwenden'], zahlenwerte: 'keine_zahlenwerte',
    begriffe: ['Schicht', 'Uebergabe', 'Checkliste', 'Auftrag', 'Sicherheit'],
    storyTitel: 'Situation zum Schichtwechsel',
    story: 'Du uebernimmst die Linie. Bevor du startest, brauchst du Uebergabe, Auftragsstand und einen kurzen Sicherheitscheck.',
    einfachTitel: 'Check vor dem Start',
    einfach: 'Am Schichtbeginn pruefst du, was offen ist, was sicher ist und womit du starten darfst.',
    fachTitel: 'Schichtbeginn als geregelter Uebergang',
    fach: 'Schichtbeginn verbindet Uebergabe, Auftragsstatus, Material, Sicherheit und offene Stoerungen. Ein kurzer Check verhindert, dass unklare Zustaende in die naechste Schicht weiterlaufen.',
    praxisTitel: 'Praxisbeispiel offene Stoerung',
    praxis: 'In der Uebergabe steht "Temperatur schwankt". Du startest nicht blind, sondern klaerst Status und Freigabe.',
    merksatz: 'Schichtstart ohne Check ist Blindflug.',
    quizFrage: 'Was gehoert zum Schichtbeginn?',
    quizRichtig: 'Uebergabe, Sicherheitscheck und Auftragsstand pruefen.', quizRichtigErk: 'Richtig. Der Start braucht Klarheit.',
    quizFalsch: 'Sofort produzieren und Spaeteres spaeter klaeren.', quizFalschErk: 'Nein. Offene Risiken duerfen nicht mitlaufen.',
    schemaTitle: 'Schichtbeginn mit Checkliste und Uebergabe vorbereiten',
    schemaDesc: 'Uebergabe, Sicherheit, Auftrag, Material und offene Punkte bilden den Startcheck.',
    schemaCaption: 'Schichtbeginn ist ein geregelter Check, kein einfaches Weiterlaufenlassen.',
    schemaMerker: 'Check vor Start',
    karten: [{ label: 'Ueberg.', detail: 'lesen' }, { label: 'Sicher', detail: 'check' }, { label: 'Auftrag', detail: 'Stand' }, { label: 'Mat.', detail: 'bereit?' }, { label: 'Offen', detail: 'klaeren' }],
    trainerBadge: 'Schicht', trainerSymbol: 'S', trainerDesc: 'Ordne die Schritte am Schichtbeginn.',
    optionen: ['Uebergabe lesen', 'Sicherheitscheck machen', 'Offene Punkte klaeren', 'Hinweise ignorieren'],
    aufgaben: [
      { frage: 'Was machst du zuerst bei der Uebernahme?', korrekt: 'Uebergabe lesen' },
      { frage: 'Was kommt vor dem Produzieren?', korrekt: 'Sicherheitscheck machen' },
      { frage: 'Was darf nicht mitlaufen?', korrekt: 'Offene Punkte klaeren' },
    ],
    fehlerName: 'SchichtbeginnVorbereitenTrainer', begruendung: 'Schichtbeginn braucht Uebergabe, Sicherheit und Klaerung offener Punkte.',
    naechster: 'Naechste Schichtfrage', distractor: 'Hinweise ignorieren',
    freigabeHinweis: 'Schichtchecklisten und Uebergabeformulare muessen fachlich freigegeben werden.',
    quellenTitel: 'Traegerskript Schichtuebergabe und betriebliche Checklisten',
    quellenHinweis: 'Checkpunkte nach Betrieb ergaenzen.',
  },
  {
    id: 'FK-1-BER-007', slug: 'pt-ber-07-ordnung-am-arbeitsplatz', titel: 'Ordnung am Arbeitsplatz', thema: 'PT-BER', prefix: 'OrdnungAmArbeitsplatz',
    stufen: ['anwenden'], zahlenwerte: 'keine_zahlenwerte',
    begriffe: ['5S', 'Arbeitsplatz', 'Sicherheit', 'Standard', 'Verschwendung'],
    storyTitel: 'Situation am Platz',
    story: 'Schrauben, Lappen und ein Messschieber liegen wild durcheinander. Du brauchst laenger fuer den naechsten Auftrag und riskierst Verwechslung.',
    einfachTitel: 'Ordnung schuetzt',
    einfach: 'Ein ordentlicher Platz spart Suchzeit und macht Fehler und Gefahren frueher sichtbar.',
    fachTitel: 'Ordnung als Sicherheits- und Qualitaetsfaktor',
    fach: 'Ordnung am Arbeitsplatz reduziert Suchzeiten, Verwechslungen und Sicherheitsrisiken. Sie ist die praktische Grundlage fuer 5S und stabile Standards. Unordnung ist nicht nur unordentlich, sondern oft verschwenderisch und riskant.',
    praxisTitel: 'Praxisbeispiel vertauschtes Messmittel',
    praxis: 'Zwei aehnliche Messschieber liegen ohne Kennzeichnung. Ordnung und feste Plaetze verhindern, dass das falsche Mittel benutzt wird.',
    merksatz: 'Ordnung ist Sicherheit und Qualitaet.',
    quizFrage: 'Warum ist Ordnung am Arbeitsplatz wichtig?',
    quizRichtig: 'Weil sie Suchzeit, Fehler und Sicherheitsrisiken reduziert.', quizRichtigErk: 'Richtig. Ordnung wirkt auf Sicherheit und Qualitaet.',
    quizFalsch: 'Weil sie nur fuer Besucher gut aussieht.', quizFalschErk: 'Nein. Der Nutzen liegt im Arbeitsalltag.',
    schemaTitle: 'Ordnung am Arbeitsplatz als Sicherheits- und Qualitaetsfaktor',
    schemaDesc: 'Platz, Kennzeichnung, Werkzeug, Sauberkeit und Standard halten den Arbeitsplatz stabil.',
    schemaCaption: 'Ordnung ist Teil von Sicherheit, Qualitaet und Lean.',
    schemaMerker: 'Platz fuer jedes Werkzeug',
    karten: [{ label: 'Platz', detail: 'fest' }, { label: 'Kennz.', detail: 'klar' }, { label: 'Werkz.', detail: 'bereit' }, { label: 'Sauber', detail: 'halten' }, { label: 'Stand.', detail: 'pruefen' }],
    trainerBadge: 'Ordnung', trainerSymbol: 'OR', trainerDesc: 'Ordne Massnahmen fuer den Arbeitsplatz.',
    optionen: ['Feste Plaetze nutzen', 'Kennzeichnung beachten', 'Standard halten', 'Alles irgendwo ablegen'],
    aufgaben: [
      { frage: 'Was reduziert Suchzeiten?', korrekt: 'Feste Plaetze nutzen' },
      { frage: 'Was verhindert Verwechslung?', korrekt: 'Kennzeichnung beachten' },
      { frage: 'Was haelt Ordnung dauerhaft?', korrekt: 'Standard halten' },
    ],
    fehlerName: 'OrdnungAmArbeitsplatzTrainer', begruendung: 'Ordnung braucht feste Plaetze, Kennzeichnung und gehaltene Standards.',
    naechster: 'Naechste Ordnungsfrage', distractor: 'Alles irgendwo ablegen',
    freigabeHinweis: 'Arbeitsplatzstandards und Kennzeichnungsregeln muessen fachlich freigegeben werden.',
    quellenTitel: 'Traegerskript Ordnung/5S und betriebliche Standards',
    quellenHinweis: 'Platzregeln nach Betrieb ergaenzen.',
  },
  {
    id: 'FK-1-BER-008', slug: 'pt-ber-08-produktionsdaten-sauber-notieren', titel: 'Produktionsdaten sauber notieren', thema: 'PT-BER', prefix: 'ProduktionsdatenNotieren',
    stufen: ['anwenden'], zahlenwerte: 'quellenwert',
    begriffe: ['Protokoll', 'Charge', 'Menge', 'Ausschuss', 'Dokumentation'],
    storyTitel: 'Situation am Schichtende',
    story: 'Du sollst Menge, Ausschuss und Charge eintragen. Unklare Zahlen machen spaetere Qualitaets- und Terminauswertung unmoeglich.',
    einfachTitel: 'Sauber aufschreiben',
    einfach: 'Produktionsdaten muessen vollstaendig, lesbar und wahr sein. Schaetzen oder Schoenschoen hilft niemandem.',
    fachTitel: 'Daten als Nachweis und Steuerungsgrundlage',
    fach: 'Produktionsdaten verbinden Menge, Qualitaet, Charge und Zeit. Sie dienen Rueckverfolgung, Auswertung und Freigabe. Unvollstaendige oder geschoente Daten zerstoeren die Aussagekraft von OEE, QS und Planung.',
    praxisTitel: 'Praxisbeispiel fehlende Charge',
    praxis: 'Ausschuss wurde notiert, die Charge fehlt. Bei einem Reklamationsfall ist die Rueckverfolgung blockiert.',
    merksatz: 'Daten ehrlich, vollstaendig und lesbar.',
    quizFrage: 'Was ist bei Produktionsdaten zentral?',
    quizRichtig: 'Vollstaendig, lesbar und wahr dokumentieren.', quizRichtigErk: 'Richtig. Nur dann sind Auswertung und Rueckverfolgung moeglich.',
    quizFalsch: 'Ungefaehre Werte reichen, solange die Schicht fertig wird.', quizFalschErk: 'Nein. Ungenaue Daten sind spaeter wertlos oder gefaehrlich.',
    schemaTitle: 'Produktionsdaten vollstaendig und nachvollziehbar notieren',
    schemaDesc: 'Menge, Charge, Ausschuss, Zeit und Unterschrift bilden die Datensicherung.',
    schemaCaption: 'Produktionsdaten sind Nachweis und Steuerungsgrundlage zugleich.',
    schemaMerker: 'vollstaendig und wahr',
    karten: [{ label: 'Menge', detail: 'Ist' }, { label: 'Charge', detail: 'ID' }, { label: 'Aussch.', detail: 'zahl' }, { label: 'Zeit', detail: 'wann' }, { label: 'Doku', detail: 'klar' }],
    trainerBadge: 'Daten', trainerSymbol: 'D', trainerDesc: 'Ordne Pflichtangaben in der Dokumentation.',
    optionen: ['Menge eintragen', 'Charge dokumentieren', 'Ausschuss wahrheitsgemaess notieren', 'Werte schoenrechnen'],
    aufgaben: [
      { frage: 'Was gehoert zur Mengenrueckmeldung?', korrekt: 'Menge eintragen' },
      { frage: 'Was sichert Rueckverfolgung?', korrekt: 'Charge dokumentieren' },
      { frage: 'Was darf nicht geschoent werden?', korrekt: 'Ausschuss wahrheitsgemaess notieren' },
    ],
    fehlerName: 'ProduktionsdatenNotierenTrainer', begruendung: 'Produktionsdaten muessen vollstaendig, lesbar und wahr sein.',
    naechster: 'Naechste Datenfrage', distractor: 'Werte schoenrechnen',
    freigabeHinweis: 'Pflichtfelder und Protokollformulare muessen fachlich freigegeben werden.',
    quellenTitel: 'Traegerskript Dokumentation und betriebliche Rueckmeldeformulare',
    quellenHinweis: 'Pflichtfelder und Beispielwerte nach Quelle ergaenzen.',
  },
];

function mdxFor(e) {
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
  hinweis: "Entwurf fuer Kapitel 1. ${e.freigabeHinweis}"
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
  fragen={[{ id: "kern", masterySchluessel: "${e.id}::kern", aufgabenstellung: "${e.quizFrage}", optionen: [{ id: "richtig", text: "${e.quizRichtig}", istKorrekt: true, erklaerung: "${e.quizRichtigErk}" }, { id: "falsch", text: "${e.quizFalsch}", istKorrekt: false, erklaerung: "${e.quizFalschErk}" }] }]}
/>
`;
}

for (const e of einheiten) {
  writeFileSync(path.join(root, 'content/fachkunde', `${e.slug}.mdx`), mdxFor(e), 'utf8');
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
  const aufgaben = e.aufgaben.map((a) => `{ frage: '${a.frage.replace(/'/g, "\\'")}', korrekt: '${a.korrekt.replace(/'/g, "\\'")}' }`).join(', ');
  return `
export function ${e.prefix}Trainer({ titel = '${e.titel.replace(/'/g, "\\'")}', className }: ${e.prefix}TrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="${e.trainerDesc}" badgeText="${e.trainerBadge}" badgeSymbol="${e.trainerSymbol}" optionen={[${optionen}]} aufgaben={[${aufgaben}]} fehlerName="${e.fehlerName}" standardBegruendung="${e.begruendung}" naechsterButton="${e.naechster}" className={className} />;
}
`;
}

let fachkunde = readFileSync(path.join(root, 'packages/ui/src/fachkunde.tsx'), 'utf8');
if (!fachkunde.includes('ProduktionsauftragLesenSchema')) {
  const insertAt = fachkunde.indexOf('export interface ProduktionskarteProps');
  fachkunde = fachkunde.slice(0, insertAt) + einheiten.map(schemaTs).join('\n') + '\n' + fachkunde.slice(insertAt);
  writeFileSync(path.join(root, 'packages/ui/src/fachkunde.tsx'), fachkunde, 'utf8');
}

let interaktiv = readFileSync(path.join(root, 'packages/ui/src/fachkunde-interaktiv.tsx'), 'utf8');
if (!interaktiv.includes('ProduktionsauftragLesenTrainerProps')) {
  const ifaceAt = interaktiv.indexOf('interface FachbegriffInfo');
  interaktiv = interaktiv.slice(0, ifaceAt) + einheiten.map(trainerInterface).join('\n') + '\n' + interaktiv.slice(ifaceAt);
}
if (!interaktiv.includes('ProduktionsauftragLesenTrainer(')) {
  const trainerAt = interaktiv.indexOf('export function InteraktiverMessschieber');
  interaktiv = interaktiv.slice(0, trainerAt) + einheiten.map(trainerTs).join('\n') + '\n' + interaktiv.slice(trainerAt);
}

const glossar = {
  Los: ['Menge gleicher Teile, die als Auftrag oder Fertigungslos zusammengefasst wird.', 'Eine zusammengehoerende Menge gleicher Teile.', 'Los verbindet Auftrag, Termin und Materialbedarf.'],
  Termin: ['Festgelegter Zeitpunkt fuer Fertigstellung oder Lieferung.', 'Bis wann etwas fertig sein muss.', 'Termine werden gegen Kapazitaet und Material geprueft.'],
  Schicht: ['Zeitabschnitt der Betriebsarbeit mit Uebergabe an die naechste Besetzung.', 'Dein Arbeitsabschnitt im Betrieb.', 'Schichtbeginn braucht Check und Uebergabe.'],
  Uebergabe: ['Informationsweitergabe zwischen Schichten oder Personen zum aktuellen Stand.', 'Was die naechste Schicht wissen muss.', 'Uebergabe verhindert Blindstart.'],
  Checkliste: ['Strukturierte Liste von Pruefpunkten vor Start, Wechsel oder Abschluss.', 'Eine Abhakliste fuer wichtige Punkte.', 'Checklisten machen Vollstaendigkeit pruefbar.'],
  Protokoll: ['Schriftlicher Nachweis von Ereignissen, Mengen, Pruefungen oder Stoerungen.', 'Die Niederschrift wichtiger Daten.', 'Protokolle muessen vollstaendig und wahr sein.'],
  Zeichnung: ['Technische Unterlage mit Form, Mass und Vorgaben eines Bauteils.', 'Das Bild mit Massen und Regeln zum Teil.', 'Zeichnung und Auftrag muessen zusammenpassen.'],
  Material: ['Eingangsstoff oder Ausgangsteil fuer die Fertigung.', 'Das, woraus oder womit produziert wird.', 'Material wird gegen Auftrag und Charge geprueft.'],
};

for (const [term, [fach, einfach, bezug]] of Object.entries(glossar)) {
  if (!interaktiv.includes(`  ${term}: {`)) {
    interaktiv = interaktiv.replace(
      '  Einheit: {',
      `  ${term}: {\n    fachdefinition: '${fach}',\n    einfach: '${einfach}',\n    bezug: '${bezug}',\n  },\n  Einheit: {`,
    );
  }
}
writeFileSync(path.join(root, 'packages/ui/src/fachkunde-interaktiv.tsx'), interaktiv, 'utf8');

function insertAfter(haystack, marker, insertion) {
  if (haystack.includes(insertion.trim().split(/\r?\n/)[0])) return haystack;
  const soft = marker.replace(/\r?\n$/, '');
  const idx = haystack.indexOf(soft);
  if (idx < 0) throw new Error('marker missing ' + marker);
  const end = haystack.indexOf('\n', idx);
  const used = haystack.slice(idx, end + 1);
  return haystack.slice(0, idx + used.length) + insertion + haystack.slice(idx + used.length);
}

const prefixes = einheiten.map((e) => e.prefix);
const schemaExports = prefixes.map((p) => `  ${p}Schema,\n`).join('');
const schemaPropExports = prefixes.map((p) => `  ${p}SchemaProps,\n`).join('');
const trainerExports = prefixes.map((p) => `  ${p}Trainer,\n`).join('');
const trainerPropExports = prefixes.map((p) => `  ${p}TrainerProps,\n`).join('');

let index = readFileSync(path.join(root, 'packages/ui/src/index.ts'), 'utf8');
index = insertAfter(index, '  KvpImTeamSchema,', schemaExports);
index = insertAfter(index, '  KvpImTeamSchemaProps,', schemaPropExports);
index = insertAfter(index, '  KvpImTeamTrainer,', trainerExports);
index = insertAfter(index, '  KvpImTeamTrainerProps,', trainerPropExports);
writeFileSync(path.join(root, 'packages/ui/src/index.ts'), index, 'utf8');

let mdx = readFileSync(path.join(root, 'packages/ui/mdx/components.tsx'), 'utf8');
mdx = insertAfter(mdx, '  KvpImTeamSchema,', schemaExports);
mdx = insertAfter(mdx, '  KvpImTeamTrainer,', trainerExports);
mdx = insertAfter(mdx, '    KvpImTeamSchema,', prefixes.map((p) => `    ${p}Schema,\n`).join(''));
mdx = insertAfter(mdx, '    KvpImTeamTrainer,', prefixes.map((p) => `    ${p}Trainer,\n`).join(''));
writeFileSync(path.join(root, 'packages/ui/mdx/components.tsx'), mdx, 'utf8');

// Patch integration test KAPITEL_1 / BER list
let integ = readFileSync(path.join(root, 'tests/integration/fachkunde-kapitel1-content.test.ts'), 'utf8');
if (!integ.includes('pt-ber-04-produktionsauftrag-lesen.mdx')) {
  integ = integ.replace(
    `const KAPITEL_1_SLUGS = [
  'pt-ber-01-erster-tag-in-der-produktion.mdx',
  'pt-ber-02-aufgaben-des-maschinenfuehrers.mdx',
  'pt-ber-03-verantwortung-bei-stoerungen.mdx',
] as const;`,
    `const KAPITEL_1_SLUGS = [
  'pt-ber-01-erster-tag-in-der-produktion.mdx',
  'pt-ber-02-aufgaben-des-maschinenfuehrers.mdx',
  'pt-ber-03-verantwortung-bei-stoerungen.mdx',
  'pt-ber-04-produktionsauftrag-lesen.mdx',
  'pt-ber-05-produktionsablauf-verstehen.mdx',
  'pt-ber-06-schichtbeginn-vorbereiten.mdx',
  'pt-ber-07-ordnung-am-arbeitsplatz.mdx',
  'pt-ber-08-produktionsdaten-sauber-notieren.mdx',
] as const;`,
  );

  // Update visual/interaction tests that assumed only 3 BER units
  integ = integ.replace(
    `  it('nutzt fuer den ersten Block echte Lernvisuals statt reiner Textseiten', () => {
    const [einstiegSlug, aufgabenSlug, stoerungSlug] = KAPITEL_1_SLUGS;

    assert.match(liesContentDatei(einstiegSlug), /<Produktionskarte \\/>/);
    assert.match(liesContentDatei(aufgabenSlug), /<Rollenrad \\/>/);
    assert.match(liesContentDatei(stoerungSlug), /<MeldewegAblauf \\/>/);
  });

  it('bindet fuer jede Berufsrollen-Einheit eine passende Interaktion ein', () => {
    const [einstiegSlug, aufgabenSlug, stoerungSlug] = KAPITEL_1_SLUGS;

    assert.match(liesContentDatei(einstiegSlug), /<ProduktionsStartcheck titel="Trainiere den Startcheck" \\/>/);
    assert.match(liesContentDatei(aufgabenSlug), /<RollenEntscheider titel="Welche Aufgabe steht zuerst an\\?" \\/>/);
    assert.match(liesContentDatei(stoerungSlug), /<MeldewegTrainer titel="Meldeweg in Reihenfolge bringen" \\/>/);
  });`,
    `  it('nutzt fuer den ersten Block echte Lernvisuals statt reiner Textseiten', () => {
    const [einstiegSlug, aufgabenSlug, stoerungSlug] = KAPITEL_1_SLUGS;

    assert.match(liesContentDatei(einstiegSlug), /<Produktionskarte \\/>/);
    assert.match(liesContentDatei(aufgabenSlug), /<Rollenrad \\/>/);
    assert.match(liesContentDatei(stoerungSlug), /<MeldewegAblauf \\/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[3]), /<ProduktionsauftragLesenSchema \\/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[4]), /<ProduktionsablaufVerstehenSchema \\/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[5]), /<SchichtbeginnVorbereitenSchema \\/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[6]), /<OrdnungAmArbeitsplatzSchema \\/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[7]), /<ProduktionsdatenNotierenSchema \\/>/);
  });

  it('bindet fuer jede Berufsrollen-Einheit eine passende Interaktion ein', () => {
    const [einstiegSlug, aufgabenSlug, stoerungSlug] = KAPITEL_1_SLUGS;

    assert.match(liesContentDatei(einstiegSlug), /<ProduktionsStartcheck titel="Trainiere den Startcheck" \\/>/);
    assert.match(liesContentDatei(aufgabenSlug), /<RollenEntscheider titel="Welche Aufgabe steht zuerst an\\?" \\/>/);
    assert.match(liesContentDatei(stoerungSlug), /<MeldewegTrainer titel="Meldeweg in Reihenfolge bringen" \\/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[3]), /<ProduktionsauftragLesenTrainer titel="Produktionsauftrag lesen" \\/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[4]), /<ProduktionsablaufVerstehenTrainer titel="Produktionsablauf verstehen" \\/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[5]), /<SchichtbeginnVorbereitenTrainer titel="Schichtbeginn vorbereiten" \\/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[6]), /<OrdnungAmArbeitsplatzTrainer titel="Ordnung am Arbeitsplatz" \\/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[7]), /<ProduktionsdatenNotierenTrainer titel="Produktionsdaten sauber notieren" \\/>/);
  });`,
  );
  writeFileSync(path.join(root, 'tests/integration/fachkunde-kapitel1-content.test.ts'), integ, 'utf8');
}

let unit = readFileSync(path.join(root, 'tests/unit/content/messschieber-trainer.test.ts'), 'utf8');
if (!unit.includes('ProduktionsauftragLesenSchema')) {
  unit = insertAfter(unit, '  KvpImTeamSchema,', prefixes.map((p) => `  ${p}Schema,\n`).join(''));
  unit = insertAfter(unit, '  KvpImTeamTrainer,', prefixes.map((p) => `  ${p}Trainer,\n`).join(''));
  unit += `
describe('Fachkunde BER-Erweiterung-Visuals', () => {
  it('rendert BER-004 bis BER-008 Visuals zugaenglich', () => {
    assert.match(renderToStaticMarkup(React.createElement(ProduktionsauftragLesenSchema)), /Produktionsauftrag mit Teil Menge Termin und Vorgabe lesen/);
    assert.match(renderToStaticMarkup(React.createElement(ProduktionsablaufVerstehenSchema)), /Produktionsablauf als Stationenkette verstehen/);
    assert.match(renderToStaticMarkup(React.createElement(SchichtbeginnVorbereitenSchema)), /Schichtbeginn mit Checkliste und Uebergabe vorbereiten/);
    assert.match(renderToStaticMarkup(React.createElement(OrdnungAmArbeitsplatzSchema)), /Ordnung am Arbeitsplatz als Sicherheits- und Qualitaetsfaktor/);
    assert.match(renderToStaticMarkup(React.createElement(ProduktionsdatenNotierenSchema)), /Produktionsdaten vollstaendig und nachvollziehbar notieren/);
  });
});

describe('Fachkunde BER-Erweiterung-Interaktionen', () => {
  it('rendert BER-004 bis BER-008 Trainer mit Distraktoren', () => {
    assert.match(renderToStaticMarkup(React.createElement(ProduktionsauftragLesenTrainer)), /Unklare Daten ignorieren/);
    assert.match(renderToStaticMarkup(React.createElement(ProduktionsablaufVerstehenTrainer)), /Pruefung einfach weglassen/);
    assert.match(renderToStaticMarkup(React.createElement(SchichtbeginnVorbereitenTrainer)), /Hinweise ignorieren/);
    assert.match(renderToStaticMarkup(React.createElement(OrdnungAmArbeitsplatzTrainer)), /Alles irgendwo ablegen/);
    assert.match(renderToStaticMarkup(React.createElement(ProduktionsdatenNotierenTrainer)), /Werte schoenrechnen/);
  });
});
`;
  writeFileSync(path.join(root, 'tests/unit/content/messschieber-trainer.test.ts'), unit, 'utf8');
}

console.log('Added BER-004 to BER-008');
