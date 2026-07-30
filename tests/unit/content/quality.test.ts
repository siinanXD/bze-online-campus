import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  erstelleVersionsSnapshot,
  findeDuplikate,
  pruefeContentQualitaet,
  qualitaetsBewertung,
  regeneriereContentVariante,
} from '@bze/core/content';

const BASIS_CONTENT = {
  id: 'content-1',
  titel: 'Stahl beim Bohren',
  beschreibung: 'Praxisnaher Demo-Inhalt fuer Maschinen- und Anlagenfuehrer.',
  contentTyp: 'single_choice' as const,
  schwierigkeitsgrad: 'mittel' as const,
  inhalt: {
    aufgabenstellung: 'Welche Aussage zum Bohren von Stahl ist fachlich am besten?',
    antwortoptionen: [
      {
        text: 'Auftrag, Werkstoff, Werkzeug und Sicherheitszustand werden vor dem Start geprueft.',
        ist_korrekt: true,
        erklaerung: 'Das ist richtig, weil Sicherheit und Qualitaet zusammen geprueft werden.',
      },
      {
        text: 'Drehzahl und Vorschub sind bei jedem Stahl gleich.',
        ist_korrekt: false,
        erklaerung: 'Das ist falsch, weil Werkstoff, Werkzeug und Maschine beruecksichtigt werden.',
      },
    ],
    mdx: 'In der Praxis prueft die Fachkraft Auftrag, Zeichnung, Werkzeug, Maschine und Pruefplan. Beispielwerte muessen fachlich geprueft werden.',
  },
  lernziele: ['Bohren von Stahl sicher vorbereiten'],
};

describe('Qualitaetsbewertung', () => {
  it('klassifiziert die Scorebereiche', () => {
    assert.equal(qualitaetsBewertung(0), 'problematisch');
    assert.equal(qualitaetsBewertung(59), 'problematisch');
    assert.equal(qualitaetsBewertung(60), 'pruefen');
    assert.equal(qualitaetsBewertung(79), 'pruefen');
    assert.equal(qualitaetsBewertung(80), 'gute_qualitaet');
    assert.equal(qualitaetsBewertung(100), 'gute_qualitaet');
  });

  it('bewertet guten Demo-Content informativ ohne fachliche Freigabe', () => {
    const ergebnis = pruefeContentQualitaet(BASIS_CONTENT);

    assert.ok(ergebnis.gesamtScore >= 80);
    assert.equal(ergebnis.bewertung, 'gute_qualitaet');
    assert.equal(ergebnis.istFachlicheFreigabe, false);
    assert.equal(ergebnis.pruefmethode, 'mock_regelpruefung');
    assert.ok(ergebnis.kriterien.some((kriterium) => kriterium.kriterium === 'fachliche_plausibilitaet'));
  });

  it('senkt den Score bei offizieller Pruefungsbehauptung und erfundenen Normwerten', () => {
    const ergebnis = pruefeContentQualitaet({
      ...BASIS_CONTENT,
      titel: 'Originale IHK-Pruefungsfrage DIN 12345',
      inhalt: {
        mdx: 'Dies ist eine originale IHK-Pruefungsfrage. Nach DIN 12345 gilt ein Toleranzwert von 7 mm.',
        aufgabenstellung: 'Was gilt nach DIN 12345?',
        antwortoptionen: [{ text: '7 mm', ist_korrekt: true, erklaerung: '' }],
      },
    });

    assert.ok(ergebnis.gesamtScore < 60);
    assert.equal(ergebnis.bewertung, 'problematisch');
    assert.ok(ergebnis.hinweise.some((hinweis) => hinweis.includes('offizielle')));
  });
});

describe('Duplikaterkennung', () => {
  it('findet identische Inhalte ueber Hash', () => {
    const treffer = findeDuplikate(BASIS_CONTENT, [
      { id: 'content-2', titel: BASIS_CONTENT.titel, beschreibung: BASIS_CONTENT.beschreibung, inhalt: BASIS_CONTENT.inhalt },
    ]);

    assert.equal(treffer.length, 1);
    assert.equal(treffer[0]?.methode, 'hash');
    assert.equal(treffer[0]?.contentId, 'content-2');
  });

  it('findet sehr aehnliche Inhalte ohne Embeddings', () => {
    const treffer = findeDuplikate(BASIS_CONTENT, [
      {
        id: 'content-3',
        titel: 'Stahl beim Bohren',
        beschreibung: 'Praxisnaher Demo-Inhalt fuer Maschinen- und Anlagenfuehrer.',
        inhalt: {
          mdx: 'In der Praxis prueft die Fachkraft Auftrag Zeichnung Werkzeug Maschine und Pruefplan Beispielwerte muessen fachlich geprueft werden',
        },
      },
    ]);

    assert.equal(treffer[0]?.methode, 'textaehnlichkeit');
    assert.ok((treffer[0]?.score ?? 0) >= 0.82);
  });
});

describe('Regenerierung und Historie', () => {
  it('erstellt eine praezisere Variante ohne die alte Version zu verlieren', () => {
    const snapshot = {
      titel: 'Bohren Stahl',
      beschreibung: 'Kurzer Inhalt',
      contentTyp: 'erklaerung' as const,
      inhalt: { mdx: 'Beim Bohren wird der Auftrag geprueft.' },
      schwierigkeitsgrad: 'mittel' as const,
      status: 'generiert' as const,
      qualitaetswert: 0.7,
    };
    const version = erstelleVersionsSnapshot(snapshot, 3, 'regenerierung_praeziser');
    const neu = regeneriereContentVariante(snapshot, 'praeziser');

    assert.equal(version.versionNr, 3);
    assert.equal(version.titel, snapshot.titel);
    assert.match(JSON.stringify(neu.inhalt), /Praezisierung/);
    assert.equal(neu.schwierigkeitsgrad, 'mittel');
  });

  it('passt die Schwierigkeit fuer einfacher und schwieriger an', () => {
    const snapshot = {
      titel: 'Drehzahl',
      beschreibung: null,
      contentTyp: 'erklaerung' as const,
      inhalt: { mdx: 'Drehzahl wird als Beispielwert betrachtet.' },
      schwierigkeitsgrad: 'mittel' as const,
      status: 'generiert' as const,
      qualitaetswert: null,
    };

    assert.equal(regeneriereContentVariante(snapshot, 'einfacher').schwierigkeitsgrad, 'einfach');
    assert.equal(regeneriereContentVariante(snapshot, 'schwieriger').schwierigkeitsgrad, 'schwer');
  });
});
