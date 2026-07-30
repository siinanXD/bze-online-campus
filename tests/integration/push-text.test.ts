/**
 * Integrationstest: von der Planung bis zum fertigen, übersetzten Push-Text.
 *
 * Domain (`planeBenachrichtigungen`, `baueNutzlast`) und Versender-Texte
 * (`texte.ts` der Edge Function) werden getrennt entwickelt und getrennt
 * deployt. Genau an dieser Grenze entstehen die typischen Fehler: ein Anlass
 * bekommt einen neuen Übersetzungsschlüssel, aber die Textkarte kennt ihn nicht;
 * oder ein Platzhalter heißt `{anzahl}`, die Domain liefert aber `{count}`.
 *
 * Dieser Test spielt die Kette für jeden Anlass in allen sechs Sprachen durch
 * und stellt sicher, dass am Ende ein echter Satz steht — kein Rohschlüssel und
 * kein übrig gebliebener Platzhalter.
 */

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { baueNutzlast, planeBenachrichtigungen } from '@bze/core/benachrichtigung';
import type { Anlass } from '@bze/core/benachrichtigung';
import {
  istRtl,
  loeseText,
  normalisiereSprache,
} from '../../supabase/functions/sende-erinnerungen/texte';
import { planungsEingabe } from '../helpers/fabriken';
import { ZEITPUNKTE } from '../helpers/zeit';

const SPRACHEN = ['de', 'en', 'fr', 'ar', 'uk', 'tr'] as const;

/** Eine Eingabe, die genau den gewünschten Anlass auslöst. */
function eingabeFuer(anlass: Anlass) {
  switch (anlass) {
    case 'faellige_wiederholung':
      return planungsEingabe({ faelligGesamt: 12, faelligFalsch: 4 });
    case 'serie_gefaehrdet':
      return planungsEingabe({ serienStatus: 'gefaehrdet', serienLaenge: 6 });
    case 'tagesziel_offen':
      return planungsEingabe({ serienStatus: 'aktiv', tageszielOffen: 3 });
    case 'wochenpruefung_offen':
      return planungsEingabe({ wochenpruefungOffen: true });
    case 'nachweis_luecke':
      return planungsEingabe({ nachweisLuecken: 2 });
    case 'nachweis_entschieden':
      return planungsEingabe({ offeneEntscheidungen: 1 });
    case 'wochenbericht_bereit':
      return planungsEingabe({ wochenberichtBereit: true });
  }
}

const ALLE_ANLAESSE: Anlass[] = [
  'faellige_wiederholung',
  'serie_gefaehrdet',
  'tagesziel_offen',
  'wochenpruefung_offen',
  'nachweis_luecke',
  'nachweis_entschieden',
  'wochenbericht_bereit',
];

describe('Planung erzeugt für jeden Anlass eine Nutzlast', () => {
  for (const anlass of ALLE_ANLAESSE) {
    it(`plant ${anlass} und baut die Nutzlast`, () => {
      // Abendfenster, damit auch die zeitfenster-gebundenen Anlässe greifen.
      const geplant = planeBenachrichtigungen(eingabeFuer(anlass), ZEITPUNKTE.winterAbend);
      const treffer = geplant.find((b) => b.anlass === anlass);
      assert.ok(treffer, `kein Plan für ${anlass}`);
      assert.match(treffer.titelKey, /^push\./);
      assert.match(treffer.textKey, /^push\./);
    });
  }
});

describe('Jeder Anlass wird in allen Sprachen zu einem echten Satz', () => {
  for (const anlass of ALLE_ANLAESSE) {
    const nutzlast = baueNutzlast(anlass, eingabeFuer(anlass));

    for (const sprache of SPRACHEN) {
      it(`${anlass} / ${sprache}`, () => {
        const titel = loeseText(nutzlast.titelKey, normalisiereSprache(sprache), nutzlast.werte);
        const text = loeseText(nutzlast.textKey, normalisiereSprache(sprache), nutzlast.werte);

        // Kein Rohschlüssel: die Textkarte kennt den Schlüssel aus der Domain.
        assert.doesNotMatch(titel, /^(push\.)?[a-z_]+\.(titel|text)$/, `Titel ist Rohschlüssel: ${titel}`);
        assert.doesNotMatch(text, /^(push\.)?[a-z_]+\.(titel|text)$/, `Text ist Rohschlüssel: ${text}`);

        // Kein übrig gebliebener Platzhalter.
        assert.doesNotMatch(titel, /\{\w+\}/, `Platzhalter im Titel: ${titel}`);
        assert.doesNotMatch(text, /\{\w+\}/, `Platzhalter im Text: ${text}`);

        assert.ok(titel.length > 0 && text.length > 0);
      });
    }
  }
});

describe('Platzhalterwerte kommen aus der Domain in den Text', () => {
  it('setzt die Fehlerzahl in den Titel ein', () => {
    const nutzlast = baueNutzlast('faellige_wiederholung', eingabeFuer('faellige_wiederholung'));
    // faelligFalsch = 4 → der Fehler-Titel nennt die 4.
    const titel = loeseText(nutzlast.titelKey, 'de', nutzlast.werte);
    assert.match(titel, /4/);
  });

  it('setzt die Serienlänge ein', () => {
    const nutzlast = baueNutzlast('serie_gefaehrdet', eingabeFuer('serie_gefaehrdet'));
    assert.match(loeseText(nutzlast.titelKey, 'de', nutzlast.werte), /6/);
  });
});

describe('Sprachbehandlung', () => {
  it('erkennt Arabisch als rechtsläufig, die übrigen als linksläufig', () => {
    assert.equal(istRtl('ar'), true);
    for (const sprache of ['de', 'en', 'fr', 'uk', 'tr']) {
      assert.equal(istRtl(sprache), false);
    }
  });

  it('fällt bei unbekannter Sprache auf Deutsch zurück', () => {
    assert.equal(normalisiereSprache('xx'), 'de');
    assert.equal(normalisiereSprache(null), 'de');
    assert.equal(normalisiereSprache('en-US'), 'en');
  });

  it('liefert bei unbekanntem Schlüssel wenigstens den Kurzschlüssel, nie leer', () => {
    const text = loeseText('push.gibt_es_nicht.titel', 'de', {});
    assert.ok(text.length > 0);
  });
});
