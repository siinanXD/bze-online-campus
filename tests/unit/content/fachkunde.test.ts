import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  FACHKUNDE_KAPITEL,
  FACHKUNDE_WISSENSSTUFEN,
  aggregiereFreigabeInventar,
  baueFreigabeInventarZeile,
  fachkundeFormelSchema,
  fachkundeGlossarBegriffSchema,
  fachkundeLernereignisSchema,
  fachkundeMatrixEinheitSchema,
  fachkundeMiniWissenscheckSchema,
  hatBelastbareZahlenquelle,
  istFormelImportfaehig,
  istGlossarbegriffImportfaehig,
  istMiniWissenscheckMasteryFaehig,
  istFachkundeEinheitFreigabefaehig,
  istFachkundeEinheitVollstaendig,
  istFachkundeStatuswechselErlaubt,
  type FachkundeMatrixEinheit,
} from '@bze/core/fachkunde';

const BASIS_EINHEIT: FachkundeMatrixEinheit = {
  id: 'FK-1-MESS-001',
  kapitel: 'welt_der_maschinen',
  themenbereich: 'Messen und Pruefen',
  titel: 'Messschieber sicher verwenden',
  kurzbeschreibung: 'Grundlagen der Aussen-, Innen- und Tiefenmessung mit dem Messschieber.',
  voraussetzungen: ['SI-Einheiten Laenge'],
  lernziele: ['Messarten unterscheiden', 'Messwert plausibel ablesen'],
  fachbegriffe: ['Messschieber', 'Nonius', 'Aussenmessung'],
  formeln: [],
  visuals: [
    {
      typ: 'messsituation',
      beschreibung: 'Beschrifteter Messschieber mit Werkstueck.',
      figmaArtefakt: 'Technical Illustrations / Messschieber',
    },
  ],
  interaktionen: [
    {
      typ: 'messsimulation',
      beschreibung: 'Schenkel bewegen und Messwert eingeben.',
    },
  ],
  geschaetzteLesedauerMinuten: 8,
  schwierigkeitsgrad: 'grundlagen',
  pruefungsrelevanz: 'sehr_hoch',
  wissensstufen: ['anwenden', 'tabellenbuch_finden'],
  quellen: [
    {
      quellenart: 'tabellenbuch',
      beschreibung: 'Tabellenbuch Metall, Kapitel Prueftechnik.',
      fundstelle: null,
      belastbarFuerZahlenwerte: true,
    },
  ],
  status: 'freigegeben',
  fachlicheFreigabe: {
    erforderlich: true,
    freigegebenVon: 'Ausbilder',
    freigegebenAm: '2026-07-31T10:00:00.000Z',
  },
};

describe('Fachkunde-Matrix', () => {
  it('definiert die vier Ausbildungs-Kapitel und Wissensstufen', () => {
    assert.deepEqual([...FACHKUNDE_KAPITEL], [
      'welt_der_maschinen',
      'material_wird_produkt',
      'qualitaet_maschinen_beherrschen',
      'pruefungsprofi',
    ]);
    assert.deepEqual([...FACHKUNDE_WISSENSSTUFEN], [
      'auswendig_wissen',
      'verstehen',
      'anwenden',
      'tabellenbuch_finden',
      'zusatzwissen',
    ]);
  });

  it('validiert eine geplante Lerneinheit mit Pflichtbausteinen', () => {
    const ergebnis = fachkundeMatrixEinheitSchema.parse(BASIS_EINHEIT);
    assert.equal(ergebnis.id, 'FK-1-MESS-001');
    assert.equal(istFachkundeEinheitVollstaendig(ergebnis), true);
  });

  it('lehnt Einheiten ohne didaktisches Visual ab', () => {
    assert.equal(
      fachkundeMatrixEinheitSchema.safeParse({
        ...BASIS_EINHEIT,
        visuals: [],
      }).success,
      false,
    );
  });

  it('erkennt belastbare Quellen fuer technische Zahlenwerte', () => {
    assert.equal(hatBelastbareZahlenquelle(BASIS_EINHEIT.quellen), true);
    assert.equal(
      hatBelastbareZahlenquelle([
        {
          quellenart: 'web',
          beschreibung: 'Allgemeiner Webartikel.',
          belastbarFuerZahlenwerte: false,
        },
      ]),
      false,
    );
  });

  it('macht Freigabefaehigkeit vom Reviewstatus abhaengig', () => {
    assert.equal(istFachkundeEinheitFreigabefaehig(BASIS_EINHEIT), true);
    assert.equal(
      istFachkundeEinheitFreigabefaehig({
        ...BASIS_EINHEIT,
        status: 'fachlich_geprueft',
        fachlicheFreigabe: { erforderlich: true },
      }),
      false,
    );
  });

  it('erlaubt nur monotone Reviewstatus bis zur Freigabe', () => {
    assert.equal(istFachkundeStatuswechselErlaubt('entwurf', 'fachlich_geprueft'), true);
    assert.equal(istFachkundeStatuswechselErlaubt('fachlich_geprueft', 'freigegeben'), true);
    assert.equal(istFachkundeStatuswechselErlaubt('freigegeben', 'entwurf'), false);
  });

  it('validiert Mini-Wissenschecks als spaeter importierbare Mastery-Fragen', () => {
    const check = fachkundeMiniWissenscheckSchema.parse({
      id: 'FK-1-MES-005::check',
      fragen: [
        {
          id: 'messart-aussen',
          masterySchluessel: 'FK-1-MES-005::messart-aussen',
          aufgabenstellung: 'Welche Messart nutzt du fuer den Aussendurchmesser eines Bolzens?',
          optionen: [
            {
              id: 'aussenmessung',
              text: 'Aussenmessung',
              istKorrekt: true,
              erklaerung: 'Die grossen Messschenkel liegen aussen an.',
            },
            {
              id: 'innenmessung',
              text: 'Innenmessung',
              istKorrekt: false,
              erklaerung: 'Innenmessung ist fuer Bohrungen gedacht.',
            },
          ],
        },
      ],
    });

    assert.equal(istMiniWissenscheckMasteryFaehig(check), true);
  });

  it('lehnt Mini-Wissenschecks ohne genau eine richtige Antwort ab', () => {
    assert.equal(
      fachkundeMiniWissenscheckSchema.safeParse({
        id: 'FK-1-MES-005::check',
        fragen: [
          {
            id: 'messart-aussen',
            masterySchluessel: 'FK-1-MES-005::messart-aussen',
            aufgabenstellung: 'Welche Messart nutzt du fuer den Aussendurchmesser eines Bolzens?',
            optionen: [
              { id: 'a', text: 'A', istKorrekt: true, erklaerung: 'A' },
              { id: 'b', text: 'B', istKorrekt: true, erklaerung: 'B' },
            ],
          },
        ],
      }).success,
      false,
    );
  });
});

describe('Fachkunde Glossar Formel Inventar', () => {
  it('validiert Glossar- und Formel-Schemas', () => {
    const begriff = fachkundeGlossarBegriffSchema.parse({
      id: 'oee',
      begriff: 'OEE',
      einfacheErklaerung: 'Kennzahl fuer die Gesamtanlageneffektivitaet.',
      fachdefinition: 'Produkt aus Verfuegbarkeit, Leistungsgrad und Qualitaetsrate.',
      pruefungsrelevanz: 'hoch',
      wissensstufe: 'verstehen',
    });
    const formel = fachkundeFormelSchema.parse({
      id: 'verfuegbarkeit',
      bezeichnung: 'Verfuegbarkeit',
      formel: 'V = Laufzeit / Planzeit',
      formelzeichen: [
        { zeichen: 'V', bedeutung: 'Verfuegbarkeit', einheit: null },
        { zeichen: 'Laufzeit', bedeutung: 'tatsaechliche Laufzeit', einheit: 'min' },
      ],
      einfacheErklaerung: 'Laufzeit geteilt durch geplante Zeit.',
      fachlicheErklaerung: 'Die Verfuegbarkeit bewertet den nutzbaren Zeitanteil.',
    });

    assert.equal(begriff.begriff, 'OEE');
    assert.equal(istGlossarbegriffImportfaehig(begriff), false);
    assert.equal(formel.bezeichnung, 'Verfuegbarkeit');
    assert.equal(istFormelImportfaehig(formel), false);
  });

  it('baut Freigabeinventar aus MDX-Quelltext', () => {
    const mdx = `---
titel: "Testeinheit"
thema_code: "PT-OEE"
lesedauer_minuten: 8
review_status: "entwurf"
fragen_status: "freigegeben"
zahlenwerte_status: "quellenwert"
fachliche_freigabe:
  erforderlich: true
  freigegeben_von: null
quellen:
  - titel: "Tabellenbuch"
    seite: "Abschnitt offen"
    status: "offen"
---

<WissensstufenLeiste stufen={["verstehen"]} />
<StoryEinstieg titel="S">Text</StoryEinstieg>
<BegriffListe begriffe={["OEE"]} />
<EinfachErklaert titel="E">Text</EinfachErklaert>
<FachlichErklaert titel="F">Text</FachlichErklaert>
<Merksatz titel="M">Text</Merksatz>
<MiniWissenscheck id="FK-4-OEE-001::check" fragen={[]} />
`;
    const zeile = baueFreigabeInventarZeile('pt-oee-01-test', mdx);
    assert.equal(zeile.themaCode, 'PT-OEE');
    assert.equal(zeile.quellenOffen, true);
    assert.equal(zeile.fragenStatus, 'freigegeben');
    assert.equal(zeile.hatStory, true);
    assert.equal(zeile.bereitFuerFachpruefung, true);

    const statistik = aggregiereFreigabeInventar([zeile]);
    assert.equal(statistik.gesamt, 1);
    assert.equal(statistik.entwurf, 1);
    assert.equal(statistik.fragenFreigegeben, 1);
    assert.equal(statistik.bereitFuerFachpruefung, 1);
  });

  it('validiert Lernwirksamkeits-Ereignisse ohne PII', () => {
    const ereignis = fachkundeLernereignisSchema.parse({
      id: '11111111-1111-4111-8111-111111111111',
      typ: 'mini_check_antwort',
      lerneinheitId: 'FK-1-MES-005',
      masterySchluessel: 'FK-1-MES-005::messart-aussen',
      erfolgreich: true,
      dauerMs: 4200,
      locale: 'de',
      entstandenAm: '2026-08-01T12:00:00.000Z',
    });
    assert.equal(ereignis.typ, 'mini_check_antwort');
    assert.equal(ereignis.erfolgreich, true);
  });
});
