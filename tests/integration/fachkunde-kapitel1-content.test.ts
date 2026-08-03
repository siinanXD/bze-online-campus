import { readFileSync, readdirSync } from 'node:fs';
import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';

const CONTENT_DIR = 'content/fachkunde';
const FALLBACK_SOURCE = readFileSync('app/[locale]/campus/topic/_lib/content-fallback.ts', 'utf8');
const KAPITEL_1_SLUGS = [
  'pt-ber-01-erster-tag-in-der-produktion.mdx',
  'pt-ber-02-aufgaben-des-maschinenfuehrers.mdx',
  'pt-ber-03-verantwortung-bei-stoerungen.mdx',
  'pt-ber-04-produktionsauftrag-lesen.mdx',
  'pt-ber-05-produktionsablauf-verstehen.mdx',
  'pt-ber-06-schichtbeginn-vorbereiten.mdx',
  'pt-ber-07-ordnung-am-arbeitsplatz.mdx',
  'pt-ber-08-produktionsdaten-sauber-notieren.mdx',
] as const;
const SICHERHEIT_SLUGS = [
  'pt-sic-01-gefahren-in-der-werkhalle-erkennen.mdx',
  'pt-sic-02-persoenliche-schutzausruestung.mdx',
  'pt-sic-03-sicherheitszeichen-lesen.mdx',
] as const;
const SICHERHEIT_VERTIEFUNG_SLUGS = [
  'pt-sic-04-not-halt-richtig-nutzen.mdx',
  'pt-sic-05-schutzeinrichtungen-verstehen.mdx',
  'pt-sic-06-einzugsstellen-und-quetschstellen.mdx',
] as const;
const SICHERHEIT_ABSCHLUSS_SLUGS = [
  'pt-sic-07-sicher-gegen-wiedereinschalten.mdx',
  'pt-sic-08-fuenf-sicherheitsregeln.mdx',
  'pt-sic-09-sicherer-werkzeugwechsel.mdx',
  'pt-sic-10-verhalten-bei-unfall-und-beinaheunfall.mdx',
] as const;
const UMWELT_SLUGS = [
  'pt-umw-01-umweltschutz-im-betrieb.mdx',
  'pt-umw-02-betriebsstoffe-unterscheiden.mdx',
  'pt-umw-03-gefahrstoffe-erkennen.mdx',
  'pt-umw-04-sicherheitsdatenblatt-nutzen.mdx',
  'pt-umw-05-kuehlschmierstoff-sicher-handhaben.mdx',
  'pt-umw-06-kunststoffabfaelle-trennen.mdx',
] as const;
const ZEICHNUNG_SLUGS = [
  'pt-zei-01-warum-technische-zeichnungen-wichtig-sind.mdx',
  'pt-zei-02-schriftfeld-lesen.mdx',
  'pt-zei-03-ansichten-verstehen.mdx',
  'pt-zei-04-linienarten-erkennen.mdx',
  'pt-zei-05-massstab-nutzen.mdx',
  'pt-zei-06-bemassung-lesen.mdx',
] as const;
const ZEICHNUNG_VERTIEFUNG_SLUGS = [
  'pt-zei-07-toleranzangaben-verstehen.mdx',
  'pt-zei-08-passungen-einordnen.mdx',
  'pt-zei-09-schnittdarstellungen-verstehen.mdx',
  'pt-zei-10-oberflaechenangaben-erkennen.mdx',
  'pt-zei-11-stuecklisten-verwenden.mdx',
  'pt-zei-12-arbeitsplan-lesen.mdx',
] as const;
const EINHEITEN_SLUGS = [
  'pt-ein-01-si-basiseinheiten-im-betrieb.mdx',
  'pt-ein-02-laengen-umrechnen.mdx',
  'pt-ein-03-flaechen-berechnen.mdx',
  'pt-ein-04-volumen-berechnen.mdx',
  'pt-ein-05-masse-und-dichte.mdx',
  'pt-ein-06-zeit-und-geschwindigkeit.mdx',
  'pt-ein-07-temperatur-im-prozess.mdx',
] as const;
const MESSEN_SLUGS = [
  'pt-mes-01-pruefen-messen-und-lehren-unterscheiden.mdx',
  'pt-mes-02-messschieber-aufbauen.mdx',
  'pt-mes-03-aussenmessung-mit-messschieber.mdx',
  'pt-mes-04-innen-und-tiefenmessung.mdx',
  'pt-mes-05-messwert-richtig-ablesen.mdx',
  'pt-mes-06-buegelmessschraube-verwenden.mdx',
] as const;
const MESSEN_VERTIEFUNG_SLUGS = [
  'pt-mes-07-messuhr-einsetzen.mdx',
  'pt-mes-08-lehren-benutzen.mdx',
  'pt-mes-09-pruefmittel-schonend-behandeln.mdx',
  'pt-mes-10-kalibrieren-justieren-eichen.mdx',
  'pt-mes-11-messunsicherheit-einfach-verstehen.mdx',
  'pt-mes-12-temperatur-beim-messen-beachten.mdx',
] as const;
const WERKSTOFF_SLUGS = [
  'pt-wst-01-werkstoffgruppen-ueberblicken.mdx',
  'pt-wst-02-eisenwerkstoffe-und-stahl.mdx',
  'pt-wst-03-gusseisen-verstehen.mdx',
  'pt-wst-04-nichteisenmetalle.mdx',
  'pt-wst-05-aluminium-in-der-produktion.mdx',
  'pt-wst-06-kupfer-und-leitfaehigkeit.mdx',
] as const;
const WERKSTOFF_KUNSTSTOFF_SLUGS = [
  'pt-wst-07-thermoplaste.mdx',
  'pt-wst-08-duroplaste.mdx',
  'pt-wst-09-elastomere.mdx',
  'pt-wst-10-additive-und-masterbatch.mdx',
  'pt-wst-11-granulat-charge-und-rezyklat.mdx',
] as const;
const WERKSTOFF_EIGENSCHAFT_SLUGS = [
  'pt-wse-01-haerte-verstehen.mdx',
  'pt-wse-02-festigkeit-verstehen.mdx',
  'pt-wse-03-zaehigkeit-und-sproedigkeit.mdx',
  'pt-wse-04-elastizitaet-und-plastische-verformung.mdx',
  'pt-wse-05-dichte-im-werkstoffvergleich.mdx',
  'pt-wse-06-waermeausdehnung-einfach.mdx',
  'pt-wse-07-korrosion-erkennen.mdx',
  'pt-wse-08-werkstoffauswahl-nach-aufgabe.mdx',
] as const;
const MASCHINENELEMENTE_SLUGS = [
  'pt-mel-01-wellen-und-achsen-unterscheiden.mdx',
  'pt-mel-02-lagerarten-ueberblicken.mdx',
  'pt-mel-03-gleitlager-verstehen.mdx',
  'pt-mel-04-waelzlager-verstehen.mdx',
  'pt-mel-05-kupplungen.mdx',
  'pt-mel-06-zahnradgetriebe.mdx',
  'pt-mel-07-riemenantrieb.mdx',
  'pt-mel-08-kettenantrieb.mdx',
  'pt-mel-09-schrauben-und-muttern.mdx',
  'pt-mel-10-federn-und-daempfer.mdx',
] as const;
const FERTIGUNGSGRUNDLAGEN_SLUGS = [
  'pt-fer-01-sechs-hauptgruppen-der-fertigung.mdx',
  'pt-fer-02-spanend-und-spanlos-unterscheiden.mdx',
  'pt-fer-03-schnittbewegung-und-vorschub.mdx',
  'pt-fer-04-schnittgeschwindigkeit.mdx',
  'pt-fer-05-drehzahl-berechnen.mdx',
  'pt-fer-06-vorschub-und-zustellung.mdx',
  'pt-fer-07-standzeit-und-werkzeugverschleiss.mdx',
  'pt-fer-08-kuehlschmierstoffe.mdx',
  'pt-fer-09-werkzeugdaten-sicher-uebernehmen.mdx',
  'pt-fer-10-bearbeitungszeit-grob-planen.mdx',
] as const;
const METALLBEARBEITUNG_SLUGS = [
  'pt-met-01-saegen.mdx',
  'pt-met-02-bohren.mdx',
  'pt-met-03-senken-und-reiben.mdx',
  'pt-met-04-gewindeschneiden.mdx',
  'pt-met-05-drehen-grundlagen.mdx',
  'pt-met-06-laengs-und-plandrehen.mdx',
  'pt-met-07-fraesen-grundlagen.mdx',
  'pt-met-08-umfangs-und-stirnfraesen.mdx',
  'pt-met-09-schleifen.mdx',
  'pt-met-10-stanzen-und-schneiden.mdx',
  'pt-met-11-biegen.mdx',
  'pt-met-12-walzen.mdx',
  'pt-met-13-tiefziehen.mdx',
  'pt-met-14-pressen.mdx',
  'pt-met-15-schmieden.mdx',
  'pt-met-16-giessen.mdx',
  'pt-met-17-schweissen.mdx',
  'pt-met-18-loeten.mdx',
  'pt-met-19-kleben.mdx',
  'pt-met-20-schrauben-und-nieten.mdx',
] as const;
const KUNSTSTOFFVERFAHREN_SLUGS = [
  'pt-kst-01-spritzgiessmaschine-ueberblicken.mdx',
  'pt-kst-02-materialtrichter-und-trocknung.mdx',
  'pt-kst-03-schnecke-und-zylinder.mdx',
  'pt-kst-04-einzugszone.mdx',
  'pt-kst-05-kompressionszone.mdx',
  'pt-kst-06-meteringzone.mdx',
  'pt-kst-07-rueckstromsperre-und-duese.mdx',
  'pt-kst-08-werkzeug-und-kavitaet.mdx',
  'pt-kst-09-anguss-und-entlueftung.mdx',
  'pt-kst-10-auswerfer-und-entformen.mdx',
  'pt-kst-11-werkzeugtemperierung.mdx',
  'pt-kst-12-plastifizieren-und-dosieren.mdx',
  'pt-kst-13-einspritzen-und-umschaltpunkt.mdx',
  'pt-kst-14-nachdruck.mdx',
  'pt-kst-15-kuehlzeit-und-restkuehlzeit.mdx',
  'pt-kst-16-schliesskraft.mdx',
  'pt-kst-17-einspritzdruck-staudruck-temperaturen.mdx',
  'pt-kst-18-kompletter-spritzgiesszyklus.mdx',
  'pt-kst-19-extruder-aufbauen.mdx',
  'pt-kst-20-profile-rohre-und-folien-extrudieren.mdx',
  'pt-kst-21-blasformen.mdx',
  'pt-kst-22-thermoformen.mdx',
  'pt-kst-23-schwindung-und-verzug.mdx',
  'pt-kst-24-molekuelorientierung-einfach.mdx',
  'pt-kst-25-farbwechsel-und-materialwechsel.mdx',
] as const;
const PRODUKTIONSVORBEREITUNG_SLUGS = [
  'pt-pro-01-auftrag-und-zeichnung-abgleichen.mdx',
  'pt-pro-02-material-und-charge-pruefen.mdx',
  'pt-pro-03-werkzeug-vorbereiten.mdx',
  'pt-pro-04-maschine-ruesten.mdx',
  'pt-pro-05-parameter-uebernehmen.mdx',
  'pt-pro-06-erstteil-herstellen.mdx',
  'pt-pro-07-erstteil-pruefen.mdx',
  'pt-pro-08-produktionsfreigabe.mdx',
  'pt-pro-09-werkzeugwechsel.mdx',
  'pt-pro-10-anfahren-und-abfahren.mdx',
  'pt-pro-11-schichtuebergabe.mdx',
  'pt-pro-12-produktionsdaten-fuer-qualitaet-sichern.mdx',
] as const;
const QUALITAET_SLUGS = [
  'pt-qs-01-qualitaet-im-betrieb.mdx',
  'pt-qs-02-sollwert-istwert-und-nennmass.mdx',
  'pt-qs-03-grenzmasse-und-toleranz.mdx',
  'pt-qs-04-pruefplan-lesen.mdx',
  'pt-qs-05-pruefhaeufigkeit.mdx',
  'pt-qs-06-erst-zwischen-und-endpruefung.mdx',
  'pt-qs-07-sicht-mass-und-funktionspruefung.mdx',
  'pt-qs-08-stichprobe-und-vollpruefung.mdx',
  'pt-qs-09-gutteil-nacharbeit-ausschuss.mdx',
  'pt-qs-10-fehlerquote-berechnen.mdx',
  'pt-qs-11-mittelwert-und-spannweite.mdx',
  'pt-qs-12-trend-und-prozessstreuung.mdx',
  'pt-qs-13-normalverteilung-einfach.mdx',
  'pt-qs-14-regelkarte-einfach-lesen.mdx',
  'pt-qs-15-prozessfaehigkeit-cp-und-cpk.mdx',
  'pt-qs-16-messunsicherheit-in-der-qs.mdx',
  'pt-qs-17-rueckverfolgbarkeit-und-charge.mdx',
  'pt-qs-18-pruefprotokoll-schreiben.mdx',
  'pt-qs-19-sperrung-und-freigabe.mdx',
] as const;
const METALLFEHLER_SLUGS = [
  'pt-fem-01-grat-an-metallteilen.mdx',
  'pt-fem-02-massabweichung-metall.mdx',
  'pt-fem-03-rattermarken.mdx',
  'pt-fem-04-schlechter-rundlauf.mdx',
  'pt-fem-05-werkzeugbruch.mdx',
  'pt-fem-06-werkzeugverschleiss.mdx',
  'pt-fem-07-verformung-und-riss.mdx',
  'pt-fem-08-schlechte-oberflaeche.mdx',
  'pt-fem-09-haertefehler.mdx',
  'pt-fem-10-korrosion-am-bauteil.mdx',
] as const;
const KUNSTSTOFFFEHLER_SLUGS = [
  'pt-fek-01-einfallstellen.mdx',
  'pt-fek-02-lunker.mdx',
  'pt-fek-03-grat-und-ueberspritzung.mdx',
  'pt-fek-04-unterfuellung.mdx',
  'pt-fek-05-fliessnaehte-und-bindenaehte.mdx',
  'pt-fek-06-schlieren-und-feuchtigkeitsschlieren.mdx',
  'pt-fek-07-verbrennungen-und-dieseleffekt.mdx',
  'pt-fek-08-verzug.mdx',
  'pt-fek-09-delamination.mdx',
  'pt-fek-10-schwarze-punkte.mdx',
  'pt-fek-11-farbabweichungen.mdx',
  'pt-fek-12-anguss-und-auswerfermarken.mdx',
  'pt-fek-13-massabweichungen-kunststoff.mdx',
  'pt-fek-14-fehlerdiagnose-mit-5m.mdx',
] as const;
const STEUERUNG_SLUGS = [
  'pt-str-01-sensor-aktor-steuerung.mdx',
  'pt-str-02-steuerung-und-regelung.mdx',
  'pt-str-03-sollwert-istwert-stellgroesse.mdx',
  'pt-str-04-sps-grundlagen.mdx',
  'pt-str-05-eingang-und-ausgang.mdx',
  'pt-str-06-und-oder-und-verriegelung.mdx',
  'pt-str-07-endschalter-und-lichtschranke.mdx',
  'pt-str-08-induktive-und-kapazitive-sensoren.mdx',
  'pt-str-09-temperatur-und-drucksensoren.mdx',
  'pt-str-10-elektromotor-und-frequenzumrichter.mdx',
] as const;
const PNEUMATIK_HYDRAULIK_SLUGS = [
  'pt-pnh-01-druckluftanlage-ueberblicken.mdx',
  'pt-pnh-02-wartungseinheit.mdx',
  'pt-pnh-03-ventile-und-drosseln.mdx',
  'pt-pnh-04-einfachwirkender-zylinder.mdx',
  'pt-pnh-05-doppeltwirkender-zylinder.mdx',
  'pt-pnh-06-hydraulik-grundlagen.mdx',
] as const;
const INSTANDHALTUNG_SLUGS = [
  'pt-ih-01-wartung-inspektion-instandsetzung.mdx',
  'pt-ih-02-vorbeugende-instandhaltung.mdx',
  'pt-ih-03-schmierung-und-schmierplan.mdx',
  'pt-ih-04-verschleiss-und-reibung.mdx',
  'pt-ih-05-temperatur-schwingung-geraeusch.mdx',
  'pt-ih-06-leckage-erkennen.mdx',
  'pt-ih-07-lagerfehler.mdx',
  'pt-ih-08-unwucht-und-fehlausrichtung.mdx',
  'pt-ih-09-stoerung-fehler-ursache-wirkung.mdx',
  'pt-ih-10-5-why.mdx',
  'pt-ih-11-ishikawa-diagramm.mdx',
  'pt-ih-12-stoerung-dokumentieren.mdx',
  'pt-ih-13-sichere-fehlersuche.mdx',
  'pt-ih-14-verbesserung-nach-stoerung.mdx',
] as const;
const PLANUNG_SLUGS = [
  'pt-pla-01-fertigungsauftrag-verstehen.mdx',
  'pt-pla-02-arbeitsfolge-planen.mdx',
  'pt-pla-03-stueckliste-und-materialbedarf.mdx',
  'pt-pla-04-personal-und-maschinenbedarf.mdx',
  'pt-pla-05-maschinenbelegung-und-kapazitaet.mdx',
  'pt-pla-06-taktzeit-und-zykluszeit.mdx',
  'pt-pla-07-durchlaufzeit.mdx',
  'pt-pla-08-ruestzeit-und-bearbeitungszeit.mdx',
  'pt-pla-09-stillstandszeit.mdx',
  'pt-pla-10-liefertermin-und-losgroesse.mdx',
] as const;
const LAGER_SLUGS = [
  'pt-lag-01-bestand-und-mindestbestand.mdx',
  'pt-lag-02-meldebestand-und-sicherheitsbestand.mdx',
  'pt-lag-03-fifo.mdx',
  'pt-lag-04-kanban-grundprinzip.mdx',
] as const;
const LEAN_SLUGS = [
  'pt-lean-01-wertschoepfung-und-verschwendung.mdx',
  'pt-lean-02-5s-wiederholen.mdx',
  'pt-lean-03-kvp-im-team.mdx',
] as const;
const OEE_SLUGS = [
  'pt-oee-01-oee-ueberblicken.mdx',
  'pt-oee-02-verfuegbarkeit-berechnen.mdx',
  'pt-oee-03-leistungsgrad-berechnen.mdx',
  'pt-oee-04-qualitaetsrate-berechnen.mdx',
  'pt-oee-05-oee-verbessern.mdx',
] as const;
const MAT_SLUGS = [
  'pt-mat-01-rechenweg-in-pruefungen.mdx',
  'pt-mat-02-grundrechenarten-sicher.mdx',
  'pt-mat-03-dreisatz.mdx',
  'pt-mat-04-prozentrechnung.mdx',
  'pt-mat-05-einheiten-in-aufgaben-umrechnen.mdx',
  'pt-mat-06-umfang-und-flaeche-rechteck.mdx',
  'pt-mat-07-kreisumfang-und-kreisflaeche.mdx',
  'pt-mat-08-volumen-quader-und-zylinder.mdx',
  'pt-mat-09-masse-aus-dichte.mdx',
  'pt-mat-10-geschwindigkeit-und-zeit.mdx',
  'pt-mat-11-drehzahl-und-schnittgeschwindigkeit.mdx',
  'pt-mat-12-vorschub-berechnen.mdx',
  'pt-mat-13-kraft-und-druck.mdx',
  'pt-mat-14-hydraulischer-druck.mdx',
  'pt-mat-15-leistung-arbeit-wirkungsgrad.mdx',
  'pt-mat-16-uebersetzungsverhaeltnis.mdx',
  'pt-mat-17-drehmoment.mdx',
  'pt-mat-18-gutmenge-und-ausschussquote.mdx',
  'pt-mat-19-produktionsleistung.mdx',
  'pt-mat-20-prozentuale-abweichung.mdx',
  'pt-mat-21-waermeausdehnung-pruefungsnah.mdx',
  'pt-mat-22-toleranzberechnung.mdx',
  'pt-mat-23-formel-umstellen.mdx',
  'pt-mat-24-plausibilitaet-von-ergebnissen.mdx',
] as const;
const WISO_SLUGS = [
  'pt-wiso-01-ausbildungsvertrag.mdx',
  'pt-wiso-02-rechte-und-pflichten.mdx',
  'pt-wiso-03-probezeit-und-kuendigung.mdx',
  'pt-wiso-04-arbeitsvertrag-und-tarifvertrag.mdx',
  'pt-wiso-05-tarifautonomie-und-betriebsrat.mdx',
  'pt-wiso-06-jugend-und-auszubildendenvertretung.mdx',
  'pt-wiso-07-sozialversicherung.mdx',
  'pt-wiso-08-arbeitszeit-und-urlaub.mdx',
  'pt-wiso-09-entgeltabrechnung.mdx',
  'pt-wiso-10-nachhaltigkeit-und-umweltschutz.mdx',
  'pt-wiso-11-wirtschaftlichkeit-und-produktivitaet.mdx',
  'pt-wiso-12-oekonomisches-prinzip.mdx',
] as const;
const PRF_SLUGS = [
  'pt-prf-01-aufgabenstellung-richtig-lesen.mdx',
  'pt-prf-02-gegeben-und-gesucht-finden.mdx',
  'pt-prf-03-passende-formel-finden.mdx',
  'pt-prf-04-einheiten-kontrollieren.mdx',
  'pt-prf-05-tabellenbuch-nutzen.mdx',
  'pt-prf-06-multiple-choice-ausschlussverfahren.mdx',
  'pt-prf-07-unbekannte-begriffe-bearbeiten.mdx',
  'pt-prf-08-zeitmanagement.mdx',
  'pt-prf-09-pruefungsangst-reduzieren.mdx',
  'pt-prf-10-typische-pruefungsfallen.mdx',
  'pt-prf-11-mini-pruefung-produktionstechnik.mdx',
  'pt-prf-12-mini-pruefung-produktionsplanung.mdx',
  'pt-prf-13-mini-pruefung-wiso.mdx',
  'pt-prf-14-wiederholungsmodus-nach-fehlern.mdx',
  'pt-prf-15-persoenliche-schwachstellen-erkennen.mdx',
  'pt-prf-16-pruefungssimulation-abschluss.mdx',
] as const;

/**
 * Liest eine Fachkunde-MDX-Datei aus dem Demo-Content.
 */
function liesContentDatei(dateiname: string): string {
  return readFileSync(`${CONTENT_DIR}/${dateiname}`, 'utf8');
}

describe('Fachkunde Kapitel 1 Content', () => {
  it('enthaelt den ersten Berufsrollen-Block als PT-BER-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of KAPITEL_1_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-BER"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-1-BER-/);
    }
  });

  it('macht das Berufsrollen-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-BER': 'Berufsrolle und Sicherheit'/);
  });

  it('enthaelt den ersten Sicherheitsblock als PT-SIC-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of SICHERHEIT_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-SIC"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-1-SIC-/);
    }
  });

  it('enthaelt den vertiefenden Sicherheitsblock als PT-SIC-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of SICHERHEIT_VERTIEFUNG_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-SIC"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-1-SIC-/);
    }
  });

  it('enthaelt den abschliessenden Sicherheitsblock als PT-SIC-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of SICHERHEIT_ABSCHLUSS_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-SIC"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-1-SIC-/);
    }
  });

  it('enthaelt den Umweltblock als PT-UMW-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of UMWELT_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-UMW"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-1-UMW-/);
    }
  });

  it('enthaelt den Zeichnungsblock als PT-ZEI-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of ZEICHNUNG_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-ZEI"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-1-ZEI-/);
    }
  });

  it('enthaelt den vertiefenden Zeichnungsblock als PT-ZEI-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of ZEICHNUNG_VERTIEFUNG_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-ZEI"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-1-ZEI-/);
    }
  });

  it('enthaelt den Einheitenblock als PT-EIN-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of EINHEITEN_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-EIN"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-1-EIN-/);
    }
  });

  it('enthaelt den Messblock Grundlagen als PT-MES-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of MESSEN_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-MES"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-1-MES-/);
    }
  });

  it('enthaelt den Messblock Vertiefung als PT-MES-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of MESSEN_VERTIEFUNG_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-MES"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-1-MES-/);
    }
  });

  it('enthaelt den Werkstoffblock Grundlagen als PT-WST-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of WERKSTOFF_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-WST"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-1-WST-/);
    }
  });

  it('enthaelt den Werkstoffblock Kunststoffe und Materialverfolgung als PT-WST-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of WERKSTOFF_KUNSTSTOFF_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-WST"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-1-WST-/);
    }
  });

  it('enthaelt den Werkstoffeigenschaftsblock als PT-WSE-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of WERKSTOFF_EIGENSCHAFT_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-WSE"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-1-WSE-/);
    }
  });

  it('enthaelt den Maschinenelemente-Block als PT-MEL-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of MASCHINENELEMENTE_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-MEL"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-1-MEL-/);
    }
  });

  it('enthaelt den Fertigungsgrundlagen-Block als PT-FER-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of FERTIGUNGSGRUNDLAGEN_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-FER"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-2-FER-/);
    }
  });

  it('enthaelt den Metallbearbeitungs-Block als PT-MET-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of METALLBEARBEITUNG_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-MET"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-2-MET-/);
    }
  });

  it('enthaelt den Kunststoffverfahren-Block als PT-KST-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of KUNSTSTOFFVERFAHREN_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-KST"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-2-KST-/);
    }
  });

  it('enthaelt den Produktionsvorbereitungs-Block als PT-PRO-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of PRODUKTIONSVORBEREITUNG_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-PRO"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-2-PRO-/);
    }
  });

  it('enthaelt den Qualitaets-Block als PT-QS-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of QUALITAET_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-QS"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-3-QS-/);
    }
  });

  it('enthaelt den Metallfehler-Block als PT-FEM-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of METALLFEHLER_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-FEM"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-3-FEM-/);
    }
  });

  it('enthaelt den Kunststofffehler-Block als PT-FEK-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of KUNSTSTOFFFEHLER_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-FEK"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-3-FEK-/);
    }
  });

  it('enthaelt den Steuerungs-Block als PT-STR-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of STEUERUNG_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-STR"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-3-STR-/);
    }
  });

  it('enthaelt den Pneumatik-Hydraulik-Block als PT-PNH-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of PNEUMATIK_HYDRAULIK_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-PNH"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-3-PNH-/);
    }
  });

  it('enthaelt den Instandhaltungs-Block als PT-IH-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of INSTANDHALTUNG_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-IH"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-3-IH-/);
    }
  });

  it('enthaelt den Planungs-Block als PT-PLA-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of PLANUNG_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-PLA"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-4-PLA-/);
    }
  });

  it('enthaelt den Lager-Block als PT-LAG-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of LAGER_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-LAG"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-4-LAG-/);
    }
  });

  it('enthaelt den Lean-Block als PT-LEAN-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of LEAN_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-LEAN"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-4-LEAN-/);
    }
  });

  it('enthaelt den OEE-Block als PT-OEE-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of OEE_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-OEE"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-4-OEE-/);
    }
  });

  it('enthaelt den Mathematik-Block als PT-MAT-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of MAT_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-MAT"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-4-MAT-/);
    }
  });

  it('enthaelt den WiSo-Block als PT-WISO-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of WISO_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-WISO"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-4-WISO-/);
    }
  });

  it('enthaelt den Pruefungsvorbereitungs-Block als PT-PRF-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of PRF_SLUGS) {
      assert.ok(dateien.includes(slug), `${slug} fehlt`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-PRF"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-4-PRF-/);
    }
  });

  it('macht das Sicherheitsthema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-SIC': 'Sicherheit in der Werkhalle'/);
  });

  it('macht das Umweltthema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-UMW': 'Umwelt und Betriebsstoffe'/);
  });

  it('macht das Zeichnungsthema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-ZEI': 'Technische Zeichnung'/);
  });

  it('macht das Einheitenthema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-EIN': 'Einheiten und Groessen'/);
  });

  it('macht das Messthema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-MES': 'Messen und Pruefen'/);
  });

  it('macht das Werkstoffthema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-WST': 'Werkstoffe'/);
  });

  it('macht das Werkstoffeigenschaftsthema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-WSE': 'Werkstoffeigenschaften'/);
  });

  it('macht das Maschinenelemente-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-MEL': 'Maschinenelemente'/);
  });

  it('macht das Fertigungsgrundlagen-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-FER': 'Fertigungsgrundlagen'/);
  });

  it('macht das Metallbearbeitungs-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-MET': 'Metallbearbeitung'/);
  });

  it('macht das Kunststoffverfahren-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-KST': 'Kunststoffverfahren'/);
  });

  it('macht das Produktionsvorbereitungs-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-PRO': 'Produktionsvorbereitung'/);
  });

  it('macht das Qualitaetsthema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-QS': 'Qualitaet und Pruefung'/);
  });

  it('macht das Metallfehler-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-FEM': 'Metallfehler'/);
  });

  it('macht das Kunststofffehler-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-FEK': 'Kunststofffehler'/);
  });

  it('macht das Steuerungs-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-STR': 'Steuerung'/);
  });

  it('macht das Pneumatik-Hydraulik-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-PNH': 'Pneumatik und Hydraulik'/);
  });

  it('macht das Instandhaltungs-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-IH': 'Instandhaltung'/);
  });

  it('macht das Planungs-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-PLA': 'Planung'/);
  });

  it('macht das Lager-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-LAG': 'Lager'/);
  });

  it('macht das Lean-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-LEAN': 'Lean'/);
  });

  it('macht das OEE-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-OEE': 'OEE'/);
  });

  it('macht das Mathematik-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-MAT': 'Technische Mathematik'/);
  });

  it('macht das WiSo-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-WISO': 'Wirtschafts- und Sozialkunde'/);
  });

  it('macht das Pruefungsvorbereitungs-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-PRF': 'Pruefungsvorbereitung'/);
  });


  it('nutzt fuer den ersten Block echte Lernvisuals statt reiner Textseiten', () => {
    const [einstiegSlug, aufgabenSlug, stoerungSlug] = KAPITEL_1_SLUGS;

    assert.match(liesContentDatei(einstiegSlug), /<Produktionskarte \/>/);
    assert.match(liesContentDatei(aufgabenSlug), /<Rollenrad \/>/);
    assert.match(liesContentDatei(stoerungSlug), /<MeldewegAblauf \/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[3]), /<ProduktionsauftragLesenSchema \/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[4]), /<ProduktionsablaufVerstehenSchema \/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[5]), /<SchichtbeginnVorbereitenSchema \/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[6]), /<OrdnungAmArbeitsplatzSchema \/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[7]), /<ProduktionsdatenNotierenSchema \/>/);
  });

  it('bindet fuer jede Berufsrollen-Einheit eine passende Interaktion ein', () => {
    const [einstiegSlug, aufgabenSlug, stoerungSlug] = KAPITEL_1_SLUGS;

    assert.match(liesContentDatei(einstiegSlug), /<ProduktionsStartcheck titel="Trainiere den Startcheck" \/>/);
    assert.match(liesContentDatei(aufgabenSlug), /<RollenEntscheider titel="Welche Aufgabe steht zuerst an\?" \/>/);
    assert.match(liesContentDatei(stoerungSlug), /<MeldewegTrainer titel="Meldeweg in Reihenfolge bringen" \/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[3]), /<ProduktionsauftragLesenTrainer titel="Produktionsauftrag lesen" \/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[4]), /<ProduktionsablaufVerstehenTrainer titel="Produktionsablauf verstehen" \/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[5]), /<SchichtbeginnVorbereitenTrainer titel="Schichtbeginn vorbereiten" \/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[6]), /<OrdnungAmArbeitsplatzTrainer titel="Ordnung am Arbeitsplatz" \/>/);
    assert.match(liesContentDatei(KAPITEL_1_SLUGS[7]), /<ProduktionsdatenNotierenTrainer titel="Produktionsdaten sauber notieren" \/>/);
  });

  it('bindet fuer jede Sicherheits-Einheit Visual und Interaktion ein', () => {
    const [gefahrenSlug, psaSlug, zeichenSlug] = SICHERHEIT_SLUGS;

    assert.match(liesContentDatei(gefahrenSlug), /<GefahrenstellenBild \/>/);
    assert.match(liesContentDatei(gefahrenSlug), /<GefahrstellenTrainer titel="Gefahrstellen im Kopf markieren" \/>/);
    assert.match(liesContentDatei(psaSlug), /<PsaSet \/>/);
    assert.match(liesContentDatei(psaSlug), /<PsaZuordnung titel="Welche PSA passt zur Situation\?" \/>/);
    assert.match(liesContentDatei(zeichenSlug), /<SicherheitszeichenSet \/>/);
    assert.match(liesContentDatei(zeichenSlug), /<SicherheitszeichenTrainer titel="Zeichenart trainieren" \/>/);
  });

  it('bindet fuer jede Sicherheitsvertiefung Visual und Interaktion ein', () => {
    const [notHaltSlug, schutzSlug, einzugSlug] = SICHERHEIT_VERTIEFUNG_SLUGS;

    assert.match(liesContentDatei(notHaltSlug), /<NotHaltSchema \/>/);
    assert.match(liesContentDatei(notHaltSlug), /<NotHaltSzenarioTrainer titel="Was ist sicher\?" \/>/);
    assert.match(liesContentDatei(schutzSlug), /<SchutzeinrichtungSchema \/>/);
    assert.match(liesContentDatei(schutzSlug), /<SchutzeinrichtungTrainer titel="Schutzlogik trainieren" \/>/);
    assert.match(liesContentDatei(einzugSlug), /<EinzugQuetschstellenSchema \/>/);
    assert.match(liesContentDatei(einzugSlug), /<GefahrbereichTrainer titel="Sichere Reaktion waehlen" \/>/);
  });

  it('bindet fuer jede Sicherheitsabschluss-Einheit Visual und Interaktion ein', () => {
    const [wiedereinSlug, regelnSlug, werkzeugSlug, unfallSlug] = SICHERHEIT_ABSCHLUSS_SLUGS;

    assert.match(liesContentDatei(wiedereinSlug), /<WiedereinschaltenSchema \/>/);
    assert.match(liesContentDatei(wiedereinSlug), /<WiedereinschaltenTrainer titel="Sicherungsfolge trainieren" \/>/);
    assert.match(liesContentDatei(regelnSlug), /<SicherheitsregelnSchema \/>/);
    assert.match(liesContentDatei(regelnSlug), /<SicherheitsregelnTrainer titel="Regeln in Reihenfolge bringen" \/>/);
    assert.match(liesContentDatei(werkzeugSlug), /<WerkzeugwechselSchema \/>/);
    assert.match(liesContentDatei(werkzeugSlug), /<WerkzeugwechselTrainer titel="Sichere Wechselentscheidung" \/>/);
    assert.match(liesContentDatei(unfallSlug), /<UnfallMeldeketteSchema \/>/);
    assert.match(liesContentDatei(unfallSlug), /<UnfallMeldeTrainer titel="Unfall und Beinaheunfall einordnen" \/>/);
  });

  it('bindet fuer jede Umwelt-Einheit Visual und Interaktion ein', () => {
    const [umweltSlug, betriebsstoffSlug, gefahrstoffSlug, sdbSlug, kssSlug, kunststoffSlug] = UMWELT_SLUGS;

    assert.match(liesContentDatei(umweltSlug), /<UmweltStoffstromSchema \/>/);
    assert.match(liesContentDatei(umweltSlug), /<AbfallwegTrainer titel="Abfallweg in Reihenfolge bringen" \/>/);
    assert.match(liesContentDatei(betriebsstoffSlug), /<BetriebsstoffeSchema \/>/);
    assert.match(liesContentDatei(betriebsstoffSlug), /<BetriebsstoffZuordnungTrainer titel="Betriebsstoff zur Situation waehlen" \/>/);
    assert.match(liesContentDatei(gefahrstoffSlug), /<GefahrstoffEtikettSchema \/>/);
    assert.match(liesContentDatei(gefahrstoffSlug), /<GefahrstoffEtikettTrainer titel="Etikettbereich finden" \/>/);
    assert.match(liesContentDatei(sdbSlug), /<SicherheitsdatenblattSchema \/>/);
    assert.match(liesContentDatei(sdbSlug), /<SicherheitsdatenblattTrainer titel="Passenden SDB-Abschnitt finden" \/>/);
    assert.match(liesContentDatei(kssSlug), /<KuehlschmierstoffSchema \/>/);
    assert.match(liesContentDatei(kssSlug), /<KuehlschmierstoffTrainer titel="KSS-Situation sicher entscheiden" \/>/);
    assert.match(liesContentDatei(kunststoffSlug), /<KunststoffAbfallSchema \/>/);
    assert.match(liesContentDatei(kunststoffSlug), /<KunststoffAbfallTrainer titel="Kunststoffrest richtig behandeln" \/>/);
  });

  it('bindet fuer jede Zeichnungs-Einheit Visual und Interaktion ein', () => {
    const [zeichnungSlug, schriftfeldSlug, ansichtenSlug, linienSlug, massstabSlug, bemassungSlug] = ZEICHNUNG_SLUGS;

    assert.match(liesContentDatei(zeichnungSlug), /<ZeichnungGrundlagenSchema \/>/);
    assert.match(liesContentDatei(zeichnungSlug), /<ZeichnungZweckTrainer titel="Zeichnung sicher nutzen" \/>/);
    assert.match(liesContentDatei(schriftfeldSlug), /<SchriftfeldSchema \/>/);
    assert.match(liesContentDatei(schriftfeldSlug), /<SchriftfeldTrainer titel="Schriftfeld-Information finden" \/>/);
    assert.match(liesContentDatei(ansichtenSlug), /<AnsichtenSchema \/>/);
    assert.match(liesContentDatei(ansichtenSlug), /<AnsichtenTrainer titel="Ansicht richtig zuordnen" \/>/);
    assert.match(liesContentDatei(linienSlug), /<LinienartenSchema \/>/);
    assert.match(liesContentDatei(linienSlug), /<LinienartenTrainer titel="Linienart erkennen" \/>/);
    assert.match(liesContentDatei(massstabSlug), /<MassstabSchema \/>/);
    assert.match(liesContentDatei(massstabSlug), /<MassstabTrainer titel="Massstab einordnen" \/>/);
    assert.match(liesContentDatei(bemassungSlug), /<BemassungSchema \/>/);
    assert.match(liesContentDatei(bemassungSlug), /<BemassungTrainer titel="Bemassungsteile zuordnen" \/>/);
  });

  it('bindet fuer jede Zeichnungsvertiefung Visual und Interaktion ein', () => {
    const [toleranzSlug, passungSlug, schnittSlug, oberflaecheSlug, stuecklisteSlug, arbeitsplanSlug] = ZEICHNUNG_VERTIEFUNG_SLUGS;

    assert.match(liesContentDatei(toleranzSlug), /<ToleranzangabenSchema \/>/);
    assert.match(liesContentDatei(toleranzSlug), /<ToleranzangabenTrainer titel="Toleranzangaben lesen" \/>/);
    assert.match(liesContentDatei(passungSlug), /<PassungSchema \/>/);
    assert.match(liesContentDatei(passungSlug), /<PassungTrainer titel="Passung einordnen" \/>/);
    assert.match(liesContentDatei(schnittSlug), /<SchnittdarstellungSchema \/>/);
    assert.match(liesContentDatei(schnittSlug), /<SchnittdarstellungTrainer titel="Schnittdarstellung deuten" \/>/);
    assert.match(liesContentDatei(oberflaecheSlug), /<OberflaechenangabenSchema \/>/);
    assert.match(liesContentDatei(oberflaecheSlug), /<OberflaechenangabenTrainer titel="Oberflaechenangaben erkennen" \/>/);
    assert.match(liesContentDatei(stuecklisteSlug), /<StuecklisteSchema \/>/);
    assert.match(liesContentDatei(stuecklisteSlug), /<StuecklisteTrainer titel="Stueckliste lesen" \/>/);
    assert.match(liesContentDatei(arbeitsplanSlug), /<ArbeitsplanSchema \/>/);
    assert.match(liesContentDatei(arbeitsplanSlug), /<ArbeitsplanTrainer titel="Arbeitsplan richtig nutzen" \/>/);
  });

  it('bindet fuer jede Einheiten-Einheit Visual und Interaktion ein', () => {
    const [siSlug, laengeSlug, flaecheSlug, volumenSlug, dichteSlug, geschwindigkeitSlug, temperaturSlug] = EINHEITEN_SLUGS;

    assert.match(liesContentDatei(siSlug), /<SiEinheitenSchema \/>/);
    assert.match(liesContentDatei(siSlug), /<SiEinheitenTrainer titel="SI-Einheiten zuordnen" \/>/);
    assert.match(liesContentDatei(laengeSlug), /<LaengenUmrechnungSchema \/>/);
    assert.match(liesContentDatei(laengeSlug), /<LaengenUmrechnungTrainer titel="Laengen umrechnen" \/>/);
    assert.match(liesContentDatei(flaecheSlug), /<FlaechenSchema \/>/);
    assert.match(liesContentDatei(flaecheSlug), /<FlaechenTrainer titel="Flaeche berechnen" \/>/);
    assert.match(liesContentDatei(volumenSlug), /<VolumenSchema \/>/);
    assert.match(liesContentDatei(volumenSlug), /<VolumenTrainer titel="Volumen einordnen" \/>/);
    assert.match(liesContentDatei(dichteSlug), /<DichteSchema \/>/);
    assert.match(liesContentDatei(dichteSlug), /<DichteTrainer titel="Masse und Dichte verstehen" \/>/);
    assert.match(liesContentDatei(geschwindigkeitSlug), /<GeschwindigkeitSchema \/>/);
    assert.match(liesContentDatei(geschwindigkeitSlug), /<GeschwindigkeitTrainer titel="Zeit und Geschwindigkeit" \/>/);
    assert.match(liesContentDatei(temperaturSlug), /<TemperaturSchema \/>/);
    assert.match(liesContentDatei(temperaturSlug), /<TemperaturTrainer titel="Temperatur im Prozess" \/>/);
  });

  it('bindet fuer jede Messgrundlagen-Einheit Visual und Interaktion ein', () => {
    const [grundlagenSlug, teileSlug, aussenSlug, innenTiefeSlug, ablesenSlug, buegelmessSlug] = MESSEN_SLUGS;

    assert.match(liesContentDatei(grundlagenSlug), /<PruefenMessenLehrenSchema \/>/);
    assert.match(liesContentDatei(grundlagenSlug), /<PruefenMessenLehrenTrainer titel="Pruefen, Messen, Lehren unterscheiden" \/>/);
    assert.match(liesContentDatei(teileSlug), /<MessschieberSchema \/>/);
    assert.match(liesContentDatei(teileSlug), /<MessschieberTeileTrainer titel="Messschieberteile benennen" \/>/);
    assert.match(liesContentDatei(aussenSlug), /<AussenmessungSchema \/>/);
    assert.match(liesContentDatei(aussenSlug), /<AussenmessungTrainer titel="Aussenmessung sicher ausfuehren" \/>/);
    assert.match(liesContentDatei(innenTiefeSlug), /<InnenTiefenmessungSchema \/>/);
    assert.match(liesContentDatei(innenTiefeSlug), /<InnenTiefenmessungTrainer titel="Innen- und Tiefenmessung waehlen" \/>/);
    assert.match(liesContentDatei(ablesenSlug), /<MesswertAblesenSchema \/>/);
    assert.match(liesContentDatei(ablesenSlug), /<MesswertAblesenTrainer titel="Messwert richtig ablesen" \/>/);
    assert.match(liesContentDatei(ablesenSlug), /<InteraktiverMessschieber/);
    assert.match(liesContentDatei(buegelmessSlug), /<BuegelmessschraubeSchema \/>/);
    assert.match(liesContentDatei(buegelmessSlug), /<BuegelmessschraubeTrainer titel="Buegelmessschraube verwenden" \/>/);
  });

  it('bindet fuer jede Messvertiefungs-Einheit Visual und Interaktion ein', () => {
    const [messuhrSlug, lehrenSlug, pflegeSlug, kjeSlug, unsicherheitSlug, temperaturSlug] = MESSEN_VERTIEFUNG_SLUGS;

    assert.match(liesContentDatei(messuhrSlug), /<MessuhrSchema \/>/);
    assert.match(liesContentDatei(messuhrSlug), /<MessuhrTrainer titel="Messuhr einsetzen" \/>/);
    assert.match(liesContentDatei(lehrenSlug), /<LehrenSchema \/>/);
    assert.match(liesContentDatei(lehrenSlug), /<LehrenTrainer titel="Lehren benutzen" \/>/);
    assert.match(liesContentDatei(pflegeSlug), /<PruefmittelpflegeSchema \/>/);
    assert.match(liesContentDatei(pflegeSlug), /<PruefmittelpflegeTrainer titel="Pruefmittel schonend behandeln" \/>/);
    assert.match(liesContentDatei(kjeSlug), /<KalibrierenJustierenEichenSchema \/>/);
    assert.match(liesContentDatei(kjeSlug), /<KalibrierenJustierenEichenTrainer titel="Kalibrieren, Justieren, Eichen unterscheiden" \/>/);
    assert.match(liesContentDatei(unsicherheitSlug), /<MessunsicherheitSchema \/>/);
    assert.match(liesContentDatei(unsicherheitSlug), /<MessunsicherheitTrainer titel="Messunsicherheit einfach verstehen" \/>/);
    assert.match(liesContentDatei(temperaturSlug), /<TemperaturMessenSchema \/>/);
    assert.match(liesContentDatei(temperaturSlug), /<TemperaturBeimMessenTrainer titel="Temperatur beim Messen beachten" \/>/);
  });

  it('bindet fuer jede Werkstoffgrundlagen-Einheit Visual und Interaktion ein', () => {
    const [gruppenSlug, stahlSlug, gussSlug, neSlug, aluSlug, kupferSlug] = WERKSTOFF_SLUGS;

    assert.match(liesContentDatei(gruppenSlug), /<WerkstoffgruppenSchema \/>/);
    assert.match(liesContentDatei(gruppenSlug), /<WerkstoffgruppenTrainer titel="Werkstoffgruppen ueberblicken" \/>/);
    assert.match(liesContentDatei(stahlSlug), /<EisenStahlSchema \/>/);
    assert.match(liesContentDatei(stahlSlug), /<EisenStahlTrainer titel="Eisenwerkstoffe und Stahl" \/>/);
    assert.match(liesContentDatei(gussSlug), /<GusseisenSchema \/>/);
    assert.match(liesContentDatei(gussSlug), /<GusseisenTrainer titel="Gusseisen verstehen" \/>/);
    assert.match(liesContentDatei(neSlug), /<NichteisenmetalleSchema \/>/);
    assert.match(liesContentDatei(neSlug), /<NichteisenmetalleTrainer titel="Nichteisenmetalle einordnen" \/>/);
    assert.match(liesContentDatei(aluSlug), /<AluminiumSchema \/>/);
    assert.match(liesContentDatei(aluSlug), /<AluminiumTrainer titel="Aluminium in der Produktion" \/>/);
    assert.match(liesContentDatei(kupferSlug), /<KupferSchema \/>/);
    assert.match(liesContentDatei(kupferSlug), /<KupferTrainer titel="Kupfer und Leitfaehigkeit" \/>/);
  });

  it('bindet fuer jede Werkstoff-Kunststoff-Einheit Visual und Interaktion ein', () => {
    const [thermoplastSlug, duroplastSlug, elastomerSlug, additiveSlug, granulatSlug] = WERKSTOFF_KUNSTSTOFF_SLUGS;

    assert.match(liesContentDatei(thermoplastSlug), /<ThermoplastSchema \/>/);
    assert.match(liesContentDatei(thermoplastSlug), /<ThermoplastTrainer titel="Thermoplaste verstehen" \/>/);
    assert.match(liesContentDatei(duroplastSlug), /<DuroplastSchema \/>/);
    assert.match(liesContentDatei(duroplastSlug), /<DuroplastTrainer titel="Duroplaste abgrenzen" \/>/);
    assert.match(liesContentDatei(elastomerSlug), /<ElastomerSchema \/>/);
    assert.match(liesContentDatei(elastomerSlug), /<ElastomerTrainer titel="Elastomere verstehen" \/>/);
    assert.match(liesContentDatei(additiveSlug), /<AdditiveMasterbatchSchema \/>/);
    assert.match(liesContentDatei(additiveSlug), /<AdditiveMasterbatchTrainer titel="Additive und Masterbatch einordnen" \/>/);
    assert.match(liesContentDatei(granulatSlug), /<GranulatChargeRezyklatSchema \/>/);
    assert.match(liesContentDatei(granulatSlug), /<GranulatChargeRezyklatTrainer titel="Granulat, Charge und Rezyklat verfolgen" \/>/);
  });

  it('bindet fuer jede Werkstoffeigenschafts-Einheit Visual und Interaktion ein', () => {
    const [haerteSlug, festigkeitSlug, zaehigkeitSlug, verformungSlug, dichteSlug, waermeSlug, korrosionSlug, auswahlSlug] = WERKSTOFF_EIGENSCHAFT_SLUGS;

    assert.match(liesContentDatei(haerteSlug), /<HaerteSchema \/>/);
    assert.match(liesContentDatei(haerteSlug), /<HaerteTrainer titel="Haerte verstehen" \/>/);
    assert.match(liesContentDatei(festigkeitSlug), /<FestigkeitSchema \/>/);
    assert.match(liesContentDatei(festigkeitSlug), /<FestigkeitTrainer titel="Festigkeit verstehen" \/>/);
    assert.match(liesContentDatei(zaehigkeitSlug), /<ZaehigkeitSproedigkeitSchema \/>/);
    assert.match(liesContentDatei(zaehigkeitSlug), /<ZaehigkeitSproedigkeitTrainer titel="Zaehigkeit und Sproedigkeit" \/>/);
    assert.match(liesContentDatei(verformungSlug), /<ElastischPlastischSchema \/>/);
    assert.match(liesContentDatei(verformungSlug), /<ElastischPlastischTrainer titel="Elastizitaet und plastische Verformung" \/>/);
    assert.match(liesContentDatei(dichteSlug), /<DichteVergleichSchema \/>/);
    assert.match(liesContentDatei(dichteSlug), /<DichteVergleichTrainer titel="Dichte im Werkstoffvergleich" \/>/);
    assert.match(liesContentDatei(waermeSlug), /<WaermeausdehnungSchema \/>/);
    assert.match(liesContentDatei(waermeSlug), /<WaermeausdehnungTrainer titel="Waermeausdehnung einfach" \/>/);
    assert.match(liesContentDatei(korrosionSlug), /<KorrosionSchema \/>/);
    assert.match(liesContentDatei(korrosionSlug), /<KorrosionTrainer titel="Korrosion erkennen" \/>/);
    assert.match(liesContentDatei(auswahlSlug), /<WerkstoffauswahlSchema \/>/);
    assert.match(liesContentDatei(auswahlSlug), /<WerkstoffauswahlTrainer titel="Werkstoffauswahl nach Aufgabe" \/>/);
  });

  it('bindet fuer jede Maschinenelemente-Einheit Visual und Interaktion ein', () => {
    const [welleSlug, lagerSlug, gleitlagerSlug, waelzlagerSlug, kupplungSlug, zahnradSlug, riemenSlug, ketteSlug, schraubenSlug, federnSlug] = MASCHINENELEMENTE_SLUGS;

    assert.match(liesContentDatei(welleSlug), /<WelleAchseSchema \/>/);
    assert.match(liesContentDatei(welleSlug), /<WelleAchseTrainer titel="Wellen und Achsen unterscheiden" \/>/);
    assert.match(liesContentDatei(lagerSlug), /<LagerartenSchema \/>/);
    assert.match(liesContentDatei(lagerSlug), /<LagerartenTrainer titel="Lagerarten ueberblicken" \/>/);
    assert.match(liesContentDatei(gleitlagerSlug), /<GleitlagerSchema \/>/);
    assert.match(liesContentDatei(gleitlagerSlug), /<GleitlagerTrainer titel="Gleitlager verstehen" \/>/);
    assert.match(liesContentDatei(waelzlagerSlug), /<WaelzlagerSchema \/>/);
    assert.match(liesContentDatei(waelzlagerSlug), /<WaelzlagerTrainer titel="Waelzlager verstehen" \/>/);
    assert.match(liesContentDatei(kupplungSlug), /<KupplungSchema \/>/);
    assert.match(liesContentDatei(kupplungSlug), /<KupplungTrainer titel="Kupplungen" \/>/);
    assert.match(liesContentDatei(zahnradSlug), /<ZahnradgetriebeSchema \/>/);
    assert.match(liesContentDatei(zahnradSlug), /<ZahnradgetriebeTrainer titel="Zahnradgetriebe" \/>/);
    assert.match(liesContentDatei(riemenSlug), /<RiemenantriebSchema \/>/);
    assert.match(liesContentDatei(riemenSlug), /<RiemenantriebTrainer titel="Riemenantrieb" \/>/);
    assert.match(liesContentDatei(ketteSlug), /<KettenantriebSchema \/>/);
    assert.match(liesContentDatei(ketteSlug), /<KettenantriebTrainer titel="Kettenantrieb" \/>/);
    assert.match(liesContentDatei(schraubenSlug), /<SchraubenMutternSchema \/>/);
    assert.match(liesContentDatei(schraubenSlug), /<SchraubenMutternTrainer titel="Schrauben und Muttern" \/>/);
    assert.match(liesContentDatei(federnSlug), /<FedernDaempferSchema \/>/);
    assert.match(liesContentDatei(federnSlug), /<FedernDaempferTrainer titel="Federn und Daempfer" \/>/);
  });

  it('bindet fuer jede Fertigungsgrundlagen-Einheit Visual und Interaktion ein', () => {
    const [hauptSlug, spanSlug, bewegungSlug, vcSlug, nSlug, vfSlug, verschleissSlug, kssSlug, datenSlug, zeitSlug] = FERTIGUNGSGRUNDLAGEN_SLUGS;

    assert.match(liesContentDatei(hauptSlug), /<FertigungHauptgruppenSchema \/>/);
    assert.match(liesContentDatei(hauptSlug), /<FertigungHauptgruppenTrainer titel="Fertigungshauptgruppen" \/>/);
    assert.match(liesContentDatei(spanSlug), /<SpanendSpanlosSchema \/>/);
    assert.match(liesContentDatei(spanSlug), /<SpanendSpanlosTrainer titel="Spanend und spanlos unterscheiden" \/>/);
    assert.match(liesContentDatei(bewegungSlug), /<SchnittVorschubSchema \/>/);
    assert.match(liesContentDatei(bewegungSlug), /<SchnittVorschubTrainer titel="Schnittbewegung und Vorschub" \/>/);
    assert.match(liesContentDatei(vcSlug), /<SchnittgeschwindigkeitSchema \/>/);
    assert.match(liesContentDatei(vcSlug), /<SchnittgeschwindigkeitTrainer titel="Schnittgeschwindigkeit" \/>/);
    assert.match(liesContentDatei(nSlug), /<DrehzahlBerechnenSchema \/>/);
    assert.match(liesContentDatei(nSlug), /<DrehzahlBerechnenTrainer titel="Drehzahl berechnen" \/>/);
    assert.match(liesContentDatei(vfSlug), /<VorschubZustellungSchema \/>/);
    assert.match(liesContentDatei(vfSlug), /<VorschubZustellungTrainer titel="Vorschub und Zustellung" \/>/);
    assert.match(liesContentDatei(verschleissSlug), /<WerkzeugverschleissSchema \/>/);
    assert.match(liesContentDatei(verschleissSlug), /<WerkzeugverschleissTrainer titel="Standzeit und Werkzeugverschleiss" \/>/);
    assert.match(liesContentDatei(kssSlug), /<KuehlschmierstoffFertigungSchema \/>/);
    assert.match(liesContentDatei(kssSlug), /<KuehlschmierstoffFertigungTrainer titel="Kuehlschmierstoffe" \/>/);
    assert.match(liesContentDatei(datenSlug), /<WerkzeugdatenSchema \/>/);
    assert.match(liesContentDatei(datenSlug), /<WerkzeugdatenTrainer titel="Werkzeugdaten sicher uebernehmen" \/>/);
    assert.match(liesContentDatei(zeitSlug), /<BearbeitungszeitSchema \/>/);
    assert.match(liesContentDatei(zeitSlug), /<BearbeitungszeitTrainer titel="Bearbeitungszeit grob planen" \/>/);
  });

  it('bindet fuer jede Metallbearbeitungs-Einheit Visual und Interaktion ein', () => {
    const [
      saegeSlug,
      bohrenSlug,
      senkenSlug,
      gewindeSlug,
      drehenSlug,
      drehartenSlug,
      fraesenSlug,
      fraesartenSlug,
      schleifenSlug,
      stanzenSlug,
      biegenSlug,
      walzenSlug,
      tiefziehenSlug,
      pressenSlug,
      schmiedenSlug,
      giessenSlug,
      schweissenSlug,
      loetenSlug,
      klebenSlug,
      schraubenSlug,
    ] = METALLBEARBEITUNG_SLUGS;

    assert.match(liesContentDatei(saegeSlug), /<SaegeSchema \/>/);
    assert.match(liesContentDatei(saegeSlug), /<SaegeTrainer titel="Saegen" \/>/);
    assert.match(liesContentDatei(bohrenSlug), /<BohrenSchema \/>/);
    assert.match(liesContentDatei(bohrenSlug), /<BohrenTrainer titel="Bohren" \/>/);
    assert.match(liesContentDatei(senkenSlug), /<SenkenReibenSchema \/>/);
    assert.match(liesContentDatei(senkenSlug), /<SenkenReibenTrainer titel="Senken und Reiben" \/>/);
    assert.match(liesContentDatei(gewindeSlug), /<GewindeschneidenSchema \/>/);
    assert.match(liesContentDatei(gewindeSlug), /<GewindeschneidenTrainer titel="Gewindeschneiden" \/>/);
    assert.match(liesContentDatei(drehenSlug), /<DrehenGrundlagenSchema \/>/);
    assert.match(liesContentDatei(drehenSlug), /<DrehenGrundlagenTrainer titel="Drehen Grundlagen" \/>/);
    assert.match(liesContentDatei(drehartenSlug), /<LaengsPlanDrehenSchema \/>/);
    assert.match(liesContentDatei(drehartenSlug), /<LaengsPlanDrehenTrainer titel="Laengs- und Plandrehen" \/>/);
    assert.match(liesContentDatei(fraesenSlug), /<FraesenGrundlagenSchema \/>/);
    assert.match(liesContentDatei(fraesenSlug), /<FraesenGrundlagenTrainer titel="Fraesen Grundlagen" \/>/);
    assert.match(liesContentDatei(fraesartenSlug), /<UmfangStirnFraesenSchema \/>/);
    assert.match(liesContentDatei(fraesartenSlug), /<UmfangStirnFraesenTrainer titel="Umfangs- und Stirnfraesen" \/>/);
    assert.match(liesContentDatei(schleifenSlug), /<SchleifenSchema \/>/);
    assert.match(liesContentDatei(schleifenSlug), /<SchleifenTrainer titel="Schleifen" \/>/);
    assert.match(liesContentDatei(stanzenSlug), /<StanzenSchneidenSchema \/>/);
    assert.match(liesContentDatei(stanzenSlug), /<StanzenSchneidenTrainer titel="Stanzen und Schneiden" \/>/);
    assert.match(liesContentDatei(biegenSlug), /<BiegenSchema \/>/);
    assert.match(liesContentDatei(biegenSlug), /<BiegenTrainer titel="Biegen" \/>/);
    assert.match(liesContentDatei(walzenSlug), /<WalzenSchema \/>/);
    assert.match(liesContentDatei(walzenSlug), /<WalzenTrainer titel="Walzen" \/>/);
    assert.match(liesContentDatei(tiefziehenSlug), /<TiefziehenSchema \/>/);
    assert.match(liesContentDatei(tiefziehenSlug), /<TiefziehenTrainer titel="Tiefziehen" \/>/);
    assert.match(liesContentDatei(pressenSlug), /<PressenSchema \/>/);
    assert.match(liesContentDatei(pressenSlug), /<PressenTrainer titel="Pressen" \/>/);
    assert.match(liesContentDatei(schmiedenSlug), /<SchmiedenSchema \/>/);
    assert.match(liesContentDatei(schmiedenSlug), /<SchmiedenTrainer titel="Schmieden" \/>/);
    assert.match(liesContentDatei(giessenSlug), /<GiessenSchema \/>/);
    assert.match(liesContentDatei(giessenSlug), /<GiessenTrainer titel="Giessen" \/>/);
    assert.match(liesContentDatei(schweissenSlug), /<SchweissenSchema \/>/);
    assert.match(liesContentDatei(schweissenSlug), /<SchweissenTrainer titel="Schweissen" \/>/);
    assert.match(liesContentDatei(loetenSlug), /<LoetenSchema \/>/);
    assert.match(liesContentDatei(loetenSlug), /<LoetenTrainer titel="Loeten" \/>/);
    assert.match(liesContentDatei(klebenSlug), /<KlebenSchema \/>/);
    assert.match(liesContentDatei(klebenSlug), /<KlebenTrainer titel="Kleben" \/>/);
    assert.match(liesContentDatei(schraubenSlug), /<SchraubenNietenSchema \/>/);
    assert.match(liesContentDatei(schraubenSlug), /<SchraubenNietenTrainer titel="Schrauben und Nieten" \/>/);
  });

  it('bindet fuer jede Kunststoffverfahren-Einheit Visual und Interaktion ein', () => {
    const [
      maschineSlug,
      materialSlug,
      schneckeSlug,
      einzugSlug,
      kompressionSlug,
      meteringSlug,
      dueseSlug,
      werkzeugSlug,
      angussSlug,
      auswerferSlug,
      temperierungSlug,
      dosierenSlug,
      einspritzenSlug,
      nachdruckSlug,
      kuehlungSlug,
      schliesskraftSlug,
      parameterSlug,
      zyklusSlug,
      extruderSlug,
      produkteSlug,
      blasformenSlug,
      thermoformenSlug,
      verzugSlug,
      orientierungSlug,
      wechselSlug,
    ] = KUNSTSTOFFVERFAHREN_SLUGS;

    assert.match(liesContentDatei(maschineSlug), /<SpritzgiessmaschineSchema \/>/);
    assert.match(liesContentDatei(maschineSlug), /<SpritzgiessmaschineTrainer titel="Spritzgiessmaschine ueberblicken" \/>/);
    assert.match(liesContentDatei(materialSlug), /<MaterialtrichterTrocknungSchema \/>/);
    assert.match(liesContentDatei(materialSlug), /<MaterialtrichterTrocknungTrainer titel="Materialtrichter und Trocknung" \/>/);
    assert.match(liesContentDatei(schneckeSlug), /<SchneckeZylinderSchema \/>/);
    assert.match(liesContentDatei(schneckeSlug), /<SchneckeZylinderTrainer titel="Schnecke und Zylinder" \/>/);
    assert.match(liesContentDatei(einzugSlug), /<EinzugszoneSchema \/>/);
    assert.match(liesContentDatei(einzugSlug), /<EinzugszoneTrainer titel="Einzugszone" \/>/);
    assert.match(liesContentDatei(kompressionSlug), /<KompressionszoneSchema \/>/);
    assert.match(liesContentDatei(kompressionSlug), /<KompressionszoneTrainer titel="Kompressionszone" \/>/);
    assert.match(liesContentDatei(meteringSlug), /<MeteringzoneSchema \/>/);
    assert.match(liesContentDatei(meteringSlug), /<MeteringzoneTrainer titel="Meteringzone" \/>/);
    assert.match(liesContentDatei(dueseSlug), /<RueckstromsperreDueseSchema \/>/);
    assert.match(liesContentDatei(dueseSlug), /<RueckstromsperreDueseTrainer titel="Rueckstromsperre und Duese" \/>/);
    assert.match(liesContentDatei(werkzeugSlug), /<WerkzeugKavitaetSchema \/>/);
    assert.match(liesContentDatei(werkzeugSlug), /<WerkzeugKavitaetTrainer titel="Werkzeug und Kavitaet" \/>/);
    assert.match(liesContentDatei(angussSlug), /<AngussEntlueftungSchema \/>/);
    assert.match(liesContentDatei(angussSlug), /<AngussEntlueftungTrainer titel="Anguss und Entlueftung" \/>/);
    assert.match(liesContentDatei(auswerferSlug), /<AuswerferEntformenSchema \/>/);
    assert.match(liesContentDatei(auswerferSlug), /<AuswerferEntformenTrainer titel="Auswerfer und Entformen" \/>/);
    assert.match(liesContentDatei(temperierungSlug), /<WerkzeugtemperierungSchema \/>/);
    assert.match(liesContentDatei(temperierungSlug), /<WerkzeugtemperierungTrainer titel="Werkzeugtemperierung" \/>/);
    assert.match(liesContentDatei(dosierenSlug), /<PlastifizierenDosierenSchema \/>/);
    assert.match(liesContentDatei(dosierenSlug), /<PlastifizierenDosierenTrainer titel="Plastifizieren und Dosieren" \/>/);
    assert.match(liesContentDatei(einspritzenSlug), /<EinspritzenUmschaltpunktSchema \/>/);
    assert.match(liesContentDatei(einspritzenSlug), /<EinspritzenUmschaltpunktTrainer titel="Einspritzen und Umschaltpunkt" \/>/);
    assert.match(liesContentDatei(nachdruckSlug), /<NachdruckSchema \/>/);
    assert.match(liesContentDatei(nachdruckSlug), /<NachdruckTrainer titel="Nachdruck" \/>/);
    assert.match(liesContentDatei(kuehlungSlug), /<KuehlzeitRestkuehlzeitSchema \/>/);
    assert.match(liesContentDatei(kuehlungSlug), /<KuehlzeitRestkuehlzeitTrainer titel="Kuehlzeit und Restkuehlzeit" \/>/);
    assert.match(liesContentDatei(schliesskraftSlug), /<SchliesskraftSchema \/>/);
    assert.match(liesContentDatei(schliesskraftSlug), /<SchliesskraftTrainer titel="Schliesskraft" \/>/);
    assert.match(liesContentDatei(parameterSlug), /<SpritzgiessParameterSchema \/>/);
    assert.match(liesContentDatei(parameterSlug), /<SpritzgiessParameterTrainer titel="Einspritzdruck, Staudruck, Temperaturen" \/>/);
    assert.match(liesContentDatei(zyklusSlug), /<SpritzgiesszyklusSchema \/>/);
    assert.match(liesContentDatei(zyklusSlug), /<SpritzgiesszyklusTrainer titel="Kompletter Spritzgiesszyklus" \/>/);
    assert.match(liesContentDatei(extruderSlug), /<ExtruderAufbauSchema \/>/);
    assert.match(liesContentDatei(extruderSlug), /<ExtruderAufbauTrainer titel="Extruder aufbauen" \/>/);
    assert.match(liesContentDatei(produkteSlug), /<ExtrusionsprodukteSchema \/>/);
    assert.match(liesContentDatei(produkteSlug), /<ExtrusionsprodukteTrainer titel="Profile, Rohre und Folien extrudieren" \/>/);
    assert.match(liesContentDatei(blasformenSlug), /<BlasformenSchema \/>/);
    assert.match(liesContentDatei(blasformenSlug), /<BlasformenTrainer titel="Blasformen" \/>/);
    assert.match(liesContentDatei(thermoformenSlug), /<ThermoformenSchema \/>/);
    assert.match(liesContentDatei(thermoformenSlug), /<ThermoformenTrainer titel="Thermoformen" \/>/);
    assert.match(liesContentDatei(verzugSlug), /<SchwindungVerzugSchema \/>/);
    assert.match(liesContentDatei(verzugSlug), /<SchwindungVerzugTrainer titel="Schwindung und Verzug" \/>/);
    assert.match(liesContentDatei(orientierungSlug), /<MolekuelorientierungSchema \/>/);
    assert.match(liesContentDatei(orientierungSlug), /<MolekuelorientierungTrainer titel="Molekuelorientierung einfach" \/>/);
    assert.match(liesContentDatei(wechselSlug), /<FarbMaterialwechselSchema \/>/);
    assert.match(liesContentDatei(wechselSlug), /<FarbMaterialwechselTrainer titel="Farbwechsel und Materialwechsel" \/>/);
  });

  it('bindet fuer jede Produktionsvorbereitungs-Einheit Visual und Interaktion ein', () => {
    const [
      abgleichSlug,
      materialSlug,
      werkzeugSlug,
      ruestenSlug,
      parameterSlug,
      erstteilSlug,
      pruefenSlug,
      freigabeSlug,
      wechselSlug,
      anfahrenSlug,
      uebergabeSlug,
      datenSlug,
    ] = PRODUKTIONSVORBEREITUNG_SLUGS;

    assert.match(liesContentDatei(abgleichSlug), /<AuftragZeichnungAbgleichSchema \/>/);
    assert.match(liesContentDatei(abgleichSlug), /<AuftragZeichnungAbgleichTrainer titel="Auftrag und Zeichnung abgleichen" \/>/);
    assert.match(liesContentDatei(materialSlug), /<MaterialChargePruefenSchema \/>/);
    assert.match(liesContentDatei(materialSlug), /<MaterialChargePruefenTrainer titel="Material und Charge pruefen" \/>/);
    assert.match(liesContentDatei(werkzeugSlug), /<WerkzeugVorbereitenSchema \/>/);
    assert.match(liesContentDatei(werkzeugSlug), /<WerkzeugVorbereitenTrainer titel="Werkzeug vorbereiten" \/>/);
    assert.match(liesContentDatei(ruestenSlug), /<MaschineRuestenSchema \/>/);
    assert.match(liesContentDatei(ruestenSlug), /<MaschineRuestenTrainer titel="Maschine ruesten" \/>/);
    assert.match(liesContentDatei(parameterSlug), /<ParameterUebernehmenSchema \/>/);
    assert.match(liesContentDatei(parameterSlug), /<ParameterUebernehmenTrainer titel="Parameter uebernehmen" \/>/);
    assert.match(liesContentDatei(erstteilSlug), /<ErstteilHerstellenSchema \/>/);
    assert.match(liesContentDatei(erstteilSlug), /<ErstteilHerstellenTrainer titel="Erstteil herstellen" \/>/);
    assert.match(liesContentDatei(pruefenSlug), /<ErstteilPruefenSchema \/>/);
    assert.match(liesContentDatei(pruefenSlug), /<ErstteilPruefenTrainer titel="Erstteil pruefen" \/>/);
    assert.match(liesContentDatei(freigabeSlug), /<ProduktionsfreigabeSchema \/>/);
    assert.match(liesContentDatei(freigabeSlug), /<ProduktionsfreigabeTrainer titel="Produktionsfreigabe" \/>/);
    assert.match(liesContentDatei(wechselSlug), /<WerkzeugwechselVorbereitungSchema \/>/);
    assert.match(liesContentDatei(wechselSlug), /<WerkzeugwechselVorbereitungTrainer titel="Werkzeugwechsel" \/>/);
    assert.match(liesContentDatei(anfahrenSlug), /<AnfahrenAbfahrenSchema \/>/);
    assert.match(liesContentDatei(anfahrenSlug), /<AnfahrenAbfahrenTrainer titel="Anfahren und Abfahren" \/>/);
    assert.match(liesContentDatei(uebergabeSlug), /<SchichtuebergabeSchema \/>/);
    assert.match(liesContentDatei(uebergabeSlug), /<SchichtuebergabeTrainer titel="Schichtuebergabe" \/>/);
    assert.match(liesContentDatei(datenSlug), /<ProduktionsdatenQualitaetSchema \/>/);
    assert.match(liesContentDatei(datenSlug), /<ProduktionsdatenQualitaetTrainer titel="Produktionsdaten fuer Qualitaet sichern" \/>/);
  });

  it('bindet fuer jede Qualitaets-Einheit Visual und Interaktion ein', () => {
    const [
      qualitaetSlug,
      sollIstSlug,
      toleranzSlug,
      pruefplanSlug,
      haeufigkeitSlug,
      pruefartenSlug,
      pruefmethodenSlug,
      stichprobeSlug,
      teileSlug,
      fehlerquoteSlug,
      mittelwertSlug,
      trendSlug,
      normalSlug,
      regelkarteSlug,
      faehigkeitSlug,
      unsicherheitSlug,
      traceSlug,
      protokollSlug,
      sperrungSlug,
    ] = QUALITAET_SLUGS;

    assert.match(liesContentDatei(qualitaetSlug), /<QualitaetBetriebSchema \/>/);
    assert.match(liesContentDatei(qualitaetSlug), /<QualitaetBetriebTrainer titel="Qualitaet im Betrieb" \/>/);
    assert.match(liesContentDatei(sollIstSlug), /<SollIstNennmassSchema \/>/);
    assert.match(liesContentDatei(sollIstSlug), /<SollIstNennmassTrainer titel="Sollwert Istwert und Nennmass" \/>/);
    assert.match(liesContentDatei(toleranzSlug), /<GrenzmasseToleranzSchema \/>/);
    assert.match(liesContentDatei(toleranzSlug), /<GrenzmasseToleranzTrainer titel="Grenzmasse und Toleranz" \/>/);
    assert.match(liesContentDatei(pruefplanSlug), /<PruefplanLesenSchema \/>/);
    assert.match(liesContentDatei(pruefplanSlug), /<PruefplanLesenTrainer titel="Pruefplan lesen" \/>/);
    assert.match(liesContentDatei(haeufigkeitSlug), /<PruefhaeufigkeitSchema \/>/);
    assert.match(liesContentDatei(haeufigkeitSlug), /<PruefhaeufigkeitTrainer titel="Pruefhaeufigkeit" \/>/);
    assert.match(liesContentDatei(pruefartenSlug), /<PruefartenSchema \/>/);
    assert.match(liesContentDatei(pruefartenSlug), /<PruefartenTrainer titel="Erst Zwischen und Endpruefung" \/>/);
    assert.match(liesContentDatei(pruefmethodenSlug), /<SichtMassFunktionspruefungSchema \/>/);
    assert.match(liesContentDatei(pruefmethodenSlug), /<SichtMassFunktionspruefungTrainer titel="Sicht Mass und Funktionspruefung" \/>/);
    assert.match(liesContentDatei(stichprobeSlug), /<StichprobeVollpruefungSchema \/>/);
    assert.match(liesContentDatei(stichprobeSlug), /<StichprobeVollpruefungTrainer titel="Stichprobe und Vollpruefung" \/>/);
    assert.match(liesContentDatei(teileSlug), /<GutteilNacharbeitAusschussSchema \/>/);
    assert.match(liesContentDatei(teileSlug), /<GutteilNacharbeitAusschussTrainer titel="Gutteil Nacharbeit Ausschuss" \/>/);
    assert.match(liesContentDatei(fehlerquoteSlug), /<FehlerquoteBerechnenSchema \/>/);
    assert.match(liesContentDatei(fehlerquoteSlug), /<FehlerquoteBerechnenTrainer titel="Fehlerquote berechnen" \/>/);
    assert.match(liesContentDatei(mittelwertSlug), /<MittelwertSpannweiteSchema \/>/);
    assert.match(liesContentDatei(mittelwertSlug), /<MittelwertSpannweiteTrainer titel="Mittelwert und Spannweite" \/>/);
    assert.match(liesContentDatei(trendSlug), /<TrendProzessstreuungSchema \/>/);
    assert.match(liesContentDatei(trendSlug), /<TrendProzessstreuungTrainer titel="Trend und Prozessstreuung" \/>/);
    assert.match(liesContentDatei(normalSlug), /<NormalverteilungSchema \/>/);
    assert.match(liesContentDatei(normalSlug), /<NormalverteilungTrainer titel="Normalverteilung einfach" \/>/);
    assert.match(liesContentDatei(regelkarteSlug), /<RegelkarteLesenSchema \/>/);
    assert.match(liesContentDatei(regelkarteSlug), /<RegelkarteLesenTrainer titel="Regelkarte einfach lesen" \/>/);
    assert.match(liesContentDatei(faehigkeitSlug), /<ProzessfaehigkeitSchema \/>/);
    assert.match(liesContentDatei(faehigkeitSlug), /<ProzessfaehigkeitTrainer titel="Prozessfaehigkeit Cp und Cpk" \/>/);
    assert.match(liesContentDatei(unsicherheitSlug), /<MessunsicherheitQsSchema \/>/);
    assert.match(liesContentDatei(unsicherheitSlug), /<MessunsicherheitQsTrainer titel="Messunsicherheit in der QS" \/>/);
    assert.match(liesContentDatei(traceSlug), /<RueckverfolgbarkeitChargeSchema \/>/);
    assert.match(liesContentDatei(traceSlug), /<RueckverfolgbarkeitChargeTrainer titel="Rueckverfolgbarkeit und Charge" \/>/);
    assert.match(liesContentDatei(protokollSlug), /<PruefprotokollSchreibenSchema \/>/);
    assert.match(liesContentDatei(protokollSlug), /<PruefprotokollSchreibenTrainer titel="Pruefprotokoll schreiben" \/>/);
    assert.match(liesContentDatei(sperrungSlug), /<SperrungFreigabeSchema \/>/);
    assert.match(liesContentDatei(sperrungSlug), /<SperrungFreigabeTrainer titel="Sperrung und Freigabe" \/>/);
  });

  it('bindet fuer jede Metallfehler-Einheit Visual und Interaktion ein', () => {
    const [
      gratSlug,
      massSlug,
      ratternSlug,
      rundlaufSlug,
      bruchSlug,
      verschleissSlug,
      rissSlug,
      oberflaecheSlug,
      haerteSlug,
      korrosionSlug,
    ] = METALLFEHLER_SLUGS;

    assert.match(liesContentDatei(gratSlug), /<GratMetallSchema \/>/);
    assert.match(liesContentDatei(gratSlug), /<GratMetallTrainer titel="Grat an Metallteilen" \/>/);
    assert.match(liesContentDatei(massSlug), /<MassabweichungMetallSchema \/>/);
    assert.match(liesContentDatei(massSlug), /<MassabweichungMetallTrainer titel="Massabweichung Metall" \/>/);
    assert.match(liesContentDatei(ratternSlug), /<RattermarkenSchema \/>/);
    assert.match(liesContentDatei(ratternSlug), /<RattermarkenTrainer titel="Rattermarken" \/>/);
    assert.match(liesContentDatei(rundlaufSlug), /<SchlechterRundlaufSchema \/>/);
    assert.match(liesContentDatei(rundlaufSlug), /<SchlechterRundlaufTrainer titel="Schlechter Rundlauf" \/>/);
    assert.match(liesContentDatei(bruchSlug), /<WerkzeugbruchSchema \/>/);
    assert.match(liesContentDatei(bruchSlug), /<WerkzeugbruchTrainer titel="Werkzeugbruch" \/>/);
    assert.match(liesContentDatei(verschleissSlug), /<WerkzeugverschleissMetallSchema \/>/);
    assert.match(liesContentDatei(verschleissSlug), /<WerkzeugverschleissMetallTrainer titel="Werkzeugverschleiss" \/>/);
    assert.match(liesContentDatei(rissSlug), /<VerformungRissSchema \/>/);
    assert.match(liesContentDatei(rissSlug), /<VerformungRissTrainer titel="Verformung und Riss" \/>/);
    assert.match(liesContentDatei(oberflaecheSlug), /<SchlechteOberflaecheSchema \/>/);
    assert.match(liesContentDatei(oberflaecheSlug), /<SchlechteOberflaecheTrainer titel="Schlechte Oberflaeche" \/>/);
    assert.match(liesContentDatei(haerteSlug), /<HaertefehlerSchema \/>/);
    assert.match(liesContentDatei(haerteSlug), /<HaertefehlerTrainer titel="Haertefehler" \/>/);
    assert.match(liesContentDatei(korrosionSlug), /<KorrosionBauteilSchema \/>/);
    assert.match(liesContentDatei(korrosionSlug), /<KorrosionBauteilTrainer titel="Korrosion am Bauteil" \/>/);
  });

  it('bindet fuer jede Kunststofffehler-Einheit Visual und Interaktion ein', () => {
    const [
      einfallSlug,
      lunkerSlug,
      gratSlug,
      unterfuellungSlug,
      naehteSlug,
      schlierenSlug,
      brandSlug,
      verzugSlug,
      delaminationSlug,
      punkteSlug,
      farbeSlug,
      angussSlug,
      massSlug,
      diagnoseSlug,
    ] = KUNSTSTOFFFEHLER_SLUGS;

    assert.match(liesContentDatei(einfallSlug), /<EinfallstellenSchema \/>/);
    assert.match(liesContentDatei(einfallSlug), /<EinfallstellenTrainer titel="Einfallstellen" \/>/);
    assert.match(liesContentDatei(lunkerSlug), /<LunkerSchema \/>/);
    assert.match(liesContentDatei(lunkerSlug), /<LunkerTrainer titel="Lunker" \/>/);
    assert.match(liesContentDatei(gratSlug), /<GratUeberspritzungSchema \/>/);
    assert.match(liesContentDatei(gratSlug), /<GratUeberspritzungTrainer titel="Grat und Ueberspritzung" \/>/);
    assert.match(liesContentDatei(unterfuellungSlug), /<UnterfuellungSchema \/>/);
    assert.match(liesContentDatei(unterfuellungSlug), /<UnterfuellungTrainer titel="Unterfuellung" \/>/);
    assert.match(liesContentDatei(naehteSlug), /<FliessnaehteBindenaehteSchema \/>/);
    assert.match(liesContentDatei(naehteSlug), /<FliessnaehteBindenaehteTrainer titel="Fliessnaehte und Bindenaehte" \/>/);
    assert.match(liesContentDatei(schlierenSlug), /<SchlierenFeuchtigkeitSchema \/>/);
    assert.match(liesContentDatei(schlierenSlug), /<SchlierenFeuchtigkeitTrainer titel="Schlieren und Feuchtigkeitsschlieren" \/>/);
    assert.match(liesContentDatei(brandSlug), /<VerbrennungDieseleffektSchema \/>/);
    assert.match(liesContentDatei(brandSlug), /<VerbrennungDieseleffektTrainer titel="Verbrennungen und Dieseleffekt" \/>/);
    assert.match(liesContentDatei(verzugSlug), /<VerzugKunststoffSchema \/>/);
    assert.match(liesContentDatei(verzugSlug), /<VerzugKunststoffTrainer titel="Verzug Kunststoff" \/>/);
    assert.match(liesContentDatei(delaminationSlug), /<DelaminationSchema \/>/);
    assert.match(liesContentDatei(delaminationSlug), /<DelaminationTrainer titel="Delamination" \/>/);
    assert.match(liesContentDatei(punkteSlug), /<SchwarzePunkteSchema \/>/);
    assert.match(liesContentDatei(punkteSlug), /<SchwarzePunkteTrainer titel="Schwarze Punkte" \/>/);
    assert.match(liesContentDatei(farbeSlug), /<FarbabweichungSchema \/>/);
    assert.match(liesContentDatei(farbeSlug), /<FarbabweichungTrainer titel="Farbabweichungen" \/>/);
    assert.match(liesContentDatei(angussSlug), /<AngussAuswerfermarkenSchema \/>/);
    assert.match(liesContentDatei(angussSlug), /<AngussAuswerfermarkenTrainer titel="Anguss und Auswerfermarken" \/>/);
    assert.match(liesContentDatei(massSlug), /<MassabweichungKunststoffSchema \/>/);
    assert.match(liesContentDatei(massSlug), /<MassabweichungKunststoffTrainer titel="Massabweichungen Kunststoff" \/>/);
    assert.match(liesContentDatei(diagnoseSlug), /<Fehlerdiagnose5MSchema \/>/);
    assert.match(liesContentDatei(diagnoseSlug), /<Fehlerdiagnose5MTrainer titel="Fehlerdiagnose mit 5M" \/>/);
  });

  it('bindet fuer jede Steuerungs-Einheit Visual und Interaktion ein', () => {
    const [
      signalwegSlug,
      regelungSlug,
      regelkreisSlug,
      spsSlug,
      ioSlug,
      logikSlug,
      sensorSlug,
      materialsensorSlug,
      prozesswertSlug,
      antriebSlug,
    ] = STEUERUNG_SLUGS;

    assert.match(liesContentDatei(signalwegSlug), /<SensorAktorSteuerungSchema \/>/);
    assert.match(liesContentDatei(signalwegSlug), /<SensorAktorSteuerungTrainer titel="Sensor Aktor Steuerung" \/>/);
    assert.match(liesContentDatei(regelungSlug), /<SteuerungRegelungSchema \/>/);
    assert.match(liesContentDatei(regelungSlug), /<SteuerungRegelungTrainer titel="Steuerung und Regelung" \/>/);
    assert.match(liesContentDatei(regelkreisSlug), /<SollIstStellgroesseSchema \/>/);
    assert.match(liesContentDatei(regelkreisSlug), /<SollIstStellgroesseTrainer titel="Sollwert Istwert Stellgroesse" \/>/);
    assert.match(liesContentDatei(spsSlug), /<SpsGrundlagenSchema \/>/);
    assert.match(liesContentDatei(spsSlug), /<SpsGrundlagenTrainer titel="SPS-Grundlagen" \/>/);
    assert.match(liesContentDatei(ioSlug), /<EingangAusgangSchema \/>/);
    assert.match(liesContentDatei(ioSlug), /<EingangAusgangTrainer titel="Eingang und Ausgang" \/>/);
    assert.match(liesContentDatei(logikSlug), /<UndOderVerriegelungSchema \/>/);
    assert.match(liesContentDatei(logikSlug), /<UndOderVerriegelungTrainer titel="UND ODER Verriegelung" \/>/);
    assert.match(liesContentDatei(sensorSlug), /<EndschalterLichtschrankeSchema \/>/);
    assert.match(liesContentDatei(sensorSlug), /<EndschalterLichtschrankeTrainer titel="Endschalter und Lichtschranke" \/>/);
    assert.match(liesContentDatei(materialsensorSlug), /<InduktivKapazitivSensorSchema \/>/);
    assert.match(liesContentDatei(materialsensorSlug), /<InduktivKapazitivSensorTrainer titel="Induktive und kapazitive Sensoren" \/>/);
    assert.match(liesContentDatei(prozesswertSlug), /<TemperaturDrucksensorenSchema \/>/);
    assert.match(liesContentDatei(prozesswertSlug), /<TemperaturDrucksensorenTrainer titel="Temperatur- und Drucksensoren" \/>/);
    assert.match(liesContentDatei(antriebSlug), /<ElektromotorFrequenzumrichterSchema \/>/);
    assert.match(liesContentDatei(antriebSlug), /<ElektromotorFrequenzumrichterTrainer titel="Elektromotor und Frequenzumrichter" \/>/);
  });

  it('bindet fuer jede Pneumatik-Hydraulik-Einheit Visual und Interaktion ein', () => {
    const [
      druckluftSlug,
      wartungSlug,
      ventileSlug,
      einfachSlug,
      doppeltSlug,
      hydraulikSlug,
    ] = PNEUMATIK_HYDRAULIK_SLUGS;

    assert.match(liesContentDatei(druckluftSlug), /<DruckluftanlageSchema \/>/);
    assert.match(liesContentDatei(druckluftSlug), /<DruckluftanlageTrainer titel="Druckluftanlage" \/>/);
    assert.match(liesContentDatei(wartungSlug), /<WartungseinheitSchema \/>/);
    assert.match(liesContentDatei(wartungSlug), /<WartungseinheitTrainer titel="Wartungseinheit" \/>/);
    assert.match(liesContentDatei(ventileSlug), /<VentileDrosselnSchema \/>/);
    assert.match(liesContentDatei(ventileSlug), /<VentileDrosselnTrainer titel="Ventile und Drosseln" \/>/);
    assert.match(liesContentDatei(einfachSlug), /<EinfachwirkenderZylinderSchema \/>/);
    assert.match(liesContentDatei(einfachSlug), /<EinfachwirkenderZylinderTrainer titel="Einfachwirkender Zylinder" \/>/);
    assert.match(liesContentDatei(doppeltSlug), /<DoppeltwirkenderZylinderSchema \/>/);
    assert.match(liesContentDatei(doppeltSlug), /<DoppeltwirkenderZylinderTrainer titel="Doppeltwirkender Zylinder" \/>/);
    assert.match(liesContentDatei(hydraulikSlug), /<HydraulikGrundlagenSchema \/>/);
    assert.match(liesContentDatei(hydraulikSlug), /<HydraulikGrundlagenTrainer titel="Hydraulik-Grundlagen" \/>/);
  });

  it('bindet fuer jede Instandhaltungs-Einheit Visual und Interaktion ein', () => {
    const [
      begriffeSlug,
      vorbeugendSlug,
      schmierungSlug,
      verschleissSlug,
      symptomeSlug,
      leckageSlug,
      lagerSlug,
      laufSlug,
      analyseSlug,
      fiveWhySlug,
      ishikawaSlug,
      dokuSlug,
      sicherSlug,
      kvpSlug,
    ] = INSTANDHALTUNG_SLUGS;

    assert.match(liesContentDatei(begriffeSlug), /<WartungInspektionInstandsetzungSchema \/>/);
    assert.match(liesContentDatei(begriffeSlug), /<WartungInspektionInstandsetzungTrainer titel="Wartung Inspektion Instandsetzung" \/>/);
    assert.match(liesContentDatei(vorbeugendSlug), /<VorbeugendeInstandhaltungSchema \/>/);
    assert.match(liesContentDatei(vorbeugendSlug), /<VorbeugendeInstandhaltungTrainer titel="Vorbeugende Instandhaltung" \/>/);
    assert.match(liesContentDatei(schmierungSlug), /<SchmierungSchmierplanSchema \/>/);
    assert.match(liesContentDatei(schmierungSlug), /<SchmierungSchmierplanTrainer titel="Schmierung und Schmierplan" \/>/);
    assert.match(liesContentDatei(verschleissSlug), /<VerschleissReibungSchema \/>/);
    assert.match(liesContentDatei(verschleissSlug), /<VerschleissReibungTrainer titel="Verschleiss und Reibung" \/>/);
    assert.match(liesContentDatei(symptomeSlug), /<TemperaturSchwingungGeraeuschSchema \/>/);
    assert.match(liesContentDatei(symptomeSlug), /<TemperaturSchwingungGeraeuschTrainer titel="Temperatur Schwingung Geraeusch" \/>/);
    assert.match(liesContentDatei(leckageSlug), /<LeckageErkennenSchema \/>/);
    assert.match(liesContentDatei(leckageSlug), /<LeckageErkennenTrainer titel="Leckage erkennen" \/>/);
    assert.match(liesContentDatei(lagerSlug), /<LagerfehlerSchema \/>/);
    assert.match(liesContentDatei(lagerSlug), /<LagerfehlerTrainer titel="Lagerfehler" \/>/);
    assert.match(liesContentDatei(laufSlug), /<UnwuchtFehlausrichtungSchema \/>/);
    assert.match(liesContentDatei(laufSlug), /<UnwuchtFehlausrichtungTrainer titel="Unwucht und Fehlausrichtung" \/>/);
    assert.match(liesContentDatei(analyseSlug), /<StoerungFehlerUrsacheWirkungSchema \/>/);
    assert.match(liesContentDatei(analyseSlug), /<StoerungFehlerUrsacheWirkungTrainer titel="Stoerung Fehler Ursache Wirkung" \/>/);
    assert.match(liesContentDatei(fiveWhySlug), /<FiveWhySchema \/>/);
    assert.match(liesContentDatei(fiveWhySlug), /<FiveWhyTrainer titel="5-Why" \/>/);
    assert.match(liesContentDatei(ishikawaSlug), /<IshikawaDiagrammSchema \/>/);
    assert.match(liesContentDatei(ishikawaSlug), /<IshikawaDiagrammTrainer titel="Ishikawa-Diagramm" \/>/);
    assert.match(liesContentDatei(dokuSlug), /<StoerungDokumentierenSchema \/>/);
    assert.match(liesContentDatei(dokuSlug), /<StoerungDokumentierenTrainer titel="Stoerung dokumentieren" \/>/);
    assert.match(liesContentDatei(sicherSlug), /<SichereFehlersucheSchema \/>/);
    assert.match(liesContentDatei(sicherSlug), /<SichereFehlersucheTrainer titel="Sichere Fehlersuche" \/>/);
    assert.match(liesContentDatei(kvpSlug), /<VerbesserungNachStoerungSchema \/>/);
    assert.match(liesContentDatei(kvpSlug), /<VerbesserungNachStoerungTrainer titel="Verbesserung nach Stoerung" \/>/);
  });

  it('bindet fuer jede Planungs-Einheit Visual und Interaktion ein', () => {
    const [
      auftragSlug,
      folgeSlug,
      materialSlug,
      ressourcenSlug,
      kapazitaetSlug,
      taktSlug,
      durchlaufSlug,
      gesamtzeitSlug,
      stillstandSlug,
      terminSlug,
    ] = PLANUNG_SLUGS;

    assert.match(liesContentDatei(auftragSlug), /<FertigungsauftragSchema \/>/);
    assert.match(liesContentDatei(auftragSlug), /<FertigungsauftragTrainer titel="Fertigungsauftrag verstehen" \/>/);
    assert.match(liesContentDatei(folgeSlug), /<ArbeitsfolgePlanenSchema \/>/);
    assert.match(liesContentDatei(folgeSlug), /<ArbeitsfolgePlanenTrainer titel="Arbeitsfolge planen" \/>/);
    assert.match(liesContentDatei(materialSlug), /<StuecklisteMaterialbedarfSchema \/>/);
    assert.match(liesContentDatei(materialSlug), /<StuecklisteMaterialbedarfTrainer titel="Stueckliste und Materialbedarf" \/>/);
    assert.match(liesContentDatei(ressourcenSlug), /<PersonalMaschinenbedarfSchema \/>/);
    assert.match(liesContentDatei(ressourcenSlug), /<PersonalMaschinenbedarfTrainer titel="Personal- und Maschinenbedarf" \/>/);
    assert.match(liesContentDatei(kapazitaetSlug), /<MaschinenbelegungKapazitaetSchema \/>/);
    assert.match(liesContentDatei(kapazitaetSlug), /<MaschinenbelegungKapazitaetTrainer titel="Maschinenbelegung und Kapazitaet" \/>/);
    assert.match(liesContentDatei(taktSlug), /<TaktzeitZykluszeitSchema \/>/);
    assert.match(liesContentDatei(taktSlug), /<TaktzeitZykluszeitTrainer titel="Taktzeit und Zykluszeit" \/>/);
    assert.match(liesContentDatei(durchlaufSlug), /<DurchlaufzeitSchema \/>/);
    assert.match(liesContentDatei(durchlaufSlug), /<DurchlaufzeitTrainer titel="Durchlaufzeit" \/>/);
    assert.match(liesContentDatei(gesamtzeitSlug), /<RuestzeitBearbeitungszeitSchema \/>/);
    assert.match(liesContentDatei(gesamtzeitSlug), /<RuestzeitBearbeitungszeitTrainer titel="Ruestzeit und Bearbeitungszeit" \/>/);
    assert.match(liesContentDatei(stillstandSlug), /<StillstandszeitSchema \/>/);
    assert.match(liesContentDatei(stillstandSlug), /<StillstandszeitTrainer titel="Stillstandszeit" \/>/);
    assert.match(liesContentDatei(terminSlug), /<LieferterminLosgroesseSchema \/>/);
    assert.match(liesContentDatei(terminSlug), /<LieferterminLosgroesseTrainer titel="Liefertermin und Losgroesse" \/>/);
  });

  it('bindet fuer jede Lager-Einheit Visual und Interaktion ein', () => {
    const [
      bestandSlug,
      meldebestandSlug,
      fifoSlug,
      kanbanSlug,
    ] = LAGER_SLUGS;

    assert.match(liesContentDatei(bestandSlug), /<BestandMindestbestandSchema \/>/);
    assert.match(liesContentDatei(bestandSlug), /<BestandMindestbestandTrainer titel="Bestand und Mindestbestand" \/>/);
    assert.match(liesContentDatei(meldebestandSlug), /<MeldebestandSicherheitsbestandSchema \/>/);
    assert.match(liesContentDatei(meldebestandSlug), /<MeldebestandSicherheitsbestandTrainer titel="Meldebestand und Sicherheitsbestand" \/>/);
    assert.match(liesContentDatei(fifoSlug), /<FifoSchema \/>/);
    assert.match(liesContentDatei(fifoSlug), /<FifoTrainer titel="FIFO" \/>/);
    assert.match(liesContentDatei(kanbanSlug), /<KanbanGrundprinzipSchema \/>/);
    assert.match(liesContentDatei(kanbanSlug), /<KanbanGrundprinzipTrainer titel="Kanban-Grundprinzip" \/>/);
  });

  it('bindet fuer jede Lean-Einheit Visual und Interaktion ein', () => {
    const [wertSlug, fuenfsSlug, kvpSlug] = LEAN_SLUGS;

    assert.match(liesContentDatei(wertSlug), /<WertschoepfungVerschwendungSchema \/>/);
    assert.match(liesContentDatei(wertSlug), /<WertschoepfungVerschwendungTrainer titel="Wertschoepfung und Verschwendung" \/>/);
    assert.match(liesContentDatei(fuenfsSlug), /<FuenfSWiederholenSchema \/>/);
    assert.match(liesContentDatei(fuenfsSlug), /<FuenfSWiederholenTrainer titel="5S wiederholen" \/>/);
    assert.match(liesContentDatei(kvpSlug), /<KvpImTeamSchema \/>/);
    assert.match(liesContentDatei(kvpSlug), /<KvpImTeamTrainer titel="KVP im Team" \/>/);
  });

  it('bindet fuer jede OEE-Einheit Visual und Interaktion ein', () => {
    assert.match(liesContentDatei(OEE_SLUGS[0]), /<OeeUeberblickenSchema \/>/);
    assert.match(liesContentDatei(OEE_SLUGS[0]), /<OeeUeberblickenTrainer titel="OEE ueberblicken" \/>/);
    assert.match(liesContentDatei(OEE_SLUGS[1]), /<VerfuegbarkeitBerechnenSchema \/>/);
    assert.match(liesContentDatei(OEE_SLUGS[1]), /<VerfuegbarkeitBerechnenTrainer titel="Verfuegbarkeit berechnen" \/>/);
    assert.match(liesContentDatei(OEE_SLUGS[2]), /<LeistungsgradBerechnenSchema \/>/);
    assert.match(liesContentDatei(OEE_SLUGS[2]), /<LeistungsgradBerechnenTrainer titel="Leistungsgrad berechnen" \/>/);
    assert.match(liesContentDatei(OEE_SLUGS[3]), /<QualitaetsrateBerechnenSchema \/>/);
    assert.match(liesContentDatei(OEE_SLUGS[3]), /<QualitaetsrateBerechnenTrainer titel="Qualitaetsrate berechnen" \/>/);
    assert.match(liesContentDatei(OEE_SLUGS[4]), /<OeeVerbessernSchema \/>/);
    assert.match(liesContentDatei(OEE_SLUGS[4]), /<OeeVerbessernTrainer titel="OEE verbessern" \/>/);
  });

  it('bindet fuer jede Mathematik-Einheit Visual und Interaktion ein', () => {
    assert.match(liesContentDatei(MAT_SLUGS[0]), /<RechenwegInPruefungenSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[0]), /<RechenwegInPruefungenTrainer titel="Rechenweg in Pruefungen" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[1]), /<GrundrechenartenSicherSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[1]), /<GrundrechenartenSicherTrainer titel="Grundrechenarten sicher" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[2]), /<DreisatzSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[2]), /<DreisatzTrainer titel="Dreisatz" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[3]), /<ProzentrechnungSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[3]), /<ProzentrechnungTrainer titel="Prozentrechnung" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[4]), /<EinheitenInAufgabenSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[4]), /<EinheitenInAufgabenTrainer titel="Einheiten in Aufgaben umrechnen" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[5]), /<UmfangFlaecheRechteckSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[5]), /<UmfangFlaecheRechteckTrainer titel="Umfang und Flaeche Rechteck" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[6]), /<KreisumfangKreisflaecheSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[6]), /<KreisumfangKreisflaecheTrainer titel="Kreisumfang und Kreisflaeche" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[7]), /<VolumenQuaderZylinderSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[7]), /<VolumenQuaderZylinderTrainer titel="Volumen Quader und Zylinder" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[8]), /<MasseAusDichteSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[8]), /<MasseAusDichteTrainer titel="Masse aus Dichte" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[9]), /<GeschwindigkeitUndZeitSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[9]), /<GeschwindigkeitUndZeitTrainer titel="Geschwindigkeit und Zeit" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[10]), /<DrehzahlSchnittgeschwindigkeitSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[10]), /<DrehzahlSchnittgeschwindigkeitTrainer titel="Drehzahl und Schnittgeschwindigkeit" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[11]), /<VorschubBerechnenSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[11]), /<VorschubBerechnenTrainer titel="Vorschub berechnen" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[12]), /<KraftUndDruckSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[12]), /<KraftUndDruckTrainer titel="Kraft und Druck" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[13]), /<HydraulischerDruckSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[13]), /<HydraulischerDruckTrainer titel="Hydraulischer Druck" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[14]), /<LeistungArbeitWirkungsgradSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[14]), /<LeistungArbeitWirkungsgradTrainer titel="Leistung, Arbeit, Wirkungsgrad" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[15]), /<UebersetzungsverhaeltnisSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[15]), /<UebersetzungsverhaeltnisTrainer titel="Uebersetzungsverhaeltnis" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[16]), /<DrehmomentSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[16]), /<DrehmomentTrainer titel="Drehmoment" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[17]), /<GutmengeAusschussquoteSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[17]), /<GutmengeAusschussquoteTrainer titel="Gutmenge und Ausschussquote" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[18]), /<ProduktionsleistungSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[18]), /<ProduktionsleistungTrainer titel="Produktionsleistung" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[19]), /<ProzentualeAbweichungSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[19]), /<ProzentualeAbweichungTrainer titel="Prozentuale Abweichung" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[20]), /<WaermeausdehnungPruefungsnahSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[20]), /<WaermeausdehnungPruefungsnahTrainer titel="Waermeausdehnung pruefungsnah" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[21]), /<ToleranzberechnungSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[21]), /<ToleranzberechnungTrainer titel="Toleranzberechnung" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[22]), /<FormelUmstellenSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[22]), /<FormelUmstellenTrainer titel="Formel umstellen" \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[23]), /<PlausibilitaetVonErgebnissenSchema \/>/);
    assert.match(liesContentDatei(MAT_SLUGS[23]), /<PlausibilitaetVonErgebnissenTrainer titel="Plausibilitaet von Ergebnissen" \/>/);
  });

  it('bindet fuer jede WiSo-Einheit Visual und Interaktion ein', () => {
    assert.match(liesContentDatei(WISO_SLUGS[0]), /<AusbildungsvertragSchema \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[0]), /<AusbildungsvertragTrainer titel="Ausbildungsvertrag" \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[1]), /<RechteUndPflichtenSchema \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[1]), /<RechteUndPflichtenTrainer titel="Rechte und Pflichten" \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[2]), /<ProbezeitUndKuendigungSchema \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[2]), /<ProbezeitUndKuendigungTrainer titel="Probezeit und Kuendigung" \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[3]), /<ArbeitsvertragTarifvertragSchema \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[3]), /<ArbeitsvertragTarifvertragTrainer titel="Arbeitsvertrag und Tarifvertrag" \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[4]), /<TarifautonomieBetriebsratSchema \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[4]), /<TarifautonomieBetriebsratTrainer titel="Tarifautonomie und Betriebsrat" \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[5]), /<JugendAuszubildendenvertretungSchema \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[5]), /<JugendAuszubildendenvertretungTrainer titel="Jugend- und Auszubildendenvertretung" \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[6]), /<SozialversicherungSchema \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[6]), /<SozialversicherungTrainer titel="Sozialversicherung" \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[7]), /<ArbeitszeitUndUrlaubSchema \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[7]), /<ArbeitszeitUndUrlaubTrainer titel="Arbeitszeit und Urlaub" \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[8]), /<EntgeltabrechnungSchema \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[8]), /<EntgeltabrechnungTrainer titel="Entgeltabrechnung" \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[9]), /<NachhaltigkeitUmweltschutzSchema \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[9]), /<NachhaltigkeitUmweltschutzTrainer titel="Nachhaltigkeit und Umweltschutz" \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[10]), /<WirtschaftlichkeitProduktivitaetSchema \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[10]), /<WirtschaftlichkeitProduktivitaetTrainer titel="Wirtschaftlichkeit und Produktivitaet" \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[11]), /<OekonomischesPrinzipSchema \/>/);
    assert.match(liesContentDatei(WISO_SLUGS[11]), /<OekonomischesPrinzipTrainer titel="Oekonomisches Prinzip" \/>/);
  });

  it('bindet fuer jede Pruefungsvorbereitungs-Einheit Visual und Interaktion ein', () => {
    assert.match(liesContentDatei(PRF_SLUGS[0]), /<AufgabenstellungRichtigLesenSchema \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[0]), /<AufgabenstellungRichtigLesenTrainer titel="Aufgabenstellung richtig lesen" \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[1]), /<GegebenUndGesuchtSchema \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[1]), /<GegebenUndGesuchtTrainer titel="Gegeben und gesucht finden" \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[2]), /<PassendeFormelFindenSchema \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[2]), /<PassendeFormelFindenTrainer titel="Passende Formel finden" \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[3]), /<EinheitenKontrollierenSchema \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[3]), /<EinheitenKontrollierenTrainer titel="Einheiten kontrollieren" \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[4]), /<TabellenbuchNutzenSchema \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[4]), /<TabellenbuchNutzenTrainer titel="Tabellenbuch nutzen" \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[5]), /<MultipleChoiceAusschlussSchema \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[5]), /<MultipleChoiceAusschlussTrainer titel="Multiple-Choice-Ausschlussverfahren" \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[6]), /<UnbekannteBegriffeSchema \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[6]), /<UnbekannteBegriffeTrainer titel="Unbekannte Begriffe bearbeiten" \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[7]), /<ZeitmanagementSchema \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[7]), /<ZeitmanagementTrainer titel="Zeitmanagement" \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[8]), /<PruefungsangstReduzierenSchema \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[8]), /<PruefungsangstReduzierenTrainer titel="Pruefungsangst reduzieren" \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[9]), /<TypischePruefungsfallenSchema \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[9]), /<TypischePruefungsfallenTrainer titel="Typische Pruefungsfallen" \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[10]), /<MiniPruefungProduktionstechnikSchema \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[10]), /<MiniPruefungProduktionstechnikTrainer titel="Mini-Pruefung Produktionstechnik" \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[11]), /<MiniPruefungProduktionsplanungSchema \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[11]), /<MiniPruefungProduktionsplanungTrainer titel="Mini-Pruefung Produktionsplanung" \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[12]), /<MiniPruefungWisoSchema \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[12]), /<MiniPruefungWisoTrainer titel="Mini-Pruefung WiSo" \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[13]), /<WiederholungsmodusSchema \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[13]), /<WiederholungsmodusTrainer titel="Wiederholungsmodus nach Fehlern" \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[14]), /<PersoenlicheSchwachstellenSchema \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[14]), /<PersoenlicheSchwachstellenTrainer titel="Persoenliche Schwachstellen erkennen" \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[15]), /<PruefungssimulationAbschlussSchema \/>/);
    assert.match(liesContentDatei(PRF_SLUGS[15]), /<PruefungssimulationAbschlussTrainer titel="Pruefungssimulation Abschluss" \/>/);
  });
});
