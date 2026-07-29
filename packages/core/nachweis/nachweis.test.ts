import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  findeWochenLuecken,
  inhaltIstLeer,
  isoKalenderwoche,
  istGesperrtFuerTeilnehmer,
  pruefeTransition,
  signaturKlartext,
  teilnehmerKannBearbeiten,
  verfuegbareAktionen,
  wochenBereich,
} from './index';

describe('pruefeTransition', () => {
  it('Teilnehmer reicht Entwurf und Beanstandung ein', () => {
    assert.equal(pruefeTransition('einreichen', 'entwurf', 'teilnehmer').nach, 'eingereicht');
    assert.equal(pruefeTransition('einreichen', 'beanstandet', 'teilnehmer').nach, 'eingereicht');
  });

  it('Teilnehmer signiert nur nach dem Einreichen', () => {
    assert.equal(pruefeTransition('signieren_teilnehmer', 'eingereicht', 'teilnehmer').nach, 'signiert_teilnehmer');
    assert.equal(pruefeTransition('signieren_teilnehmer', 'entwurf', 'teilnehmer').erlaubt, false);
  });

  it('Ausbilder gegenzeichnet erst nach Teilnehmer-Signatur', () => {
    assert.equal(pruefeTransition('signieren_ausbilder', 'signiert_teilnehmer', 'ausbilder').nach, 'signiert_ausbilder');
    assert.equal(pruefeTransition('signieren_ausbilder', 'eingereicht', 'ausbilder').erlaubt, false);
  });

  it('lehnt falsche Rolle ab', () => {
    const r = pruefeTransition('signieren_ausbilder', 'signiert_teilnehmer', 'teilnehmer');
    assert.equal(r.erlaubt, false);
    assert.equal(r.grund, 'falsche_rolle');
  });

  it('Ausbilder beanstandet eingereichte und teilnehmersignierte Blätter', () => {
    assert.equal(pruefeTransition('beanstanden', 'eingereicht', 'ausbilder').nach, 'beanstandet');
    assert.equal(pruefeTransition('beanstanden', 'signiert_teilnehmer', 'ausbilder').nach, 'beanstandet');
    assert.equal(pruefeTransition('beanstanden', 'entwurf', 'ausbilder').erlaubt, false);
  });

  it('Korrektur eines signierten Blatts behält den Status', () => {
    const r = pruefeTransition('korrektur', 'signiert_ausbilder', 'ausbilder');
    assert.equal(r.erlaubt, true);
    assert.equal(r.nach, 'signiert_ausbilder');
    assert.equal(pruefeTransition('korrektur', 'entwurf', 'ausbilder').erlaubt, false);
  });
});

describe('Sperr- und Bearbeitungslogik', () => {
  it('signierte Nachweise sind für den Teilnehmer gesperrt', () => {
    assert.equal(istGesperrtFuerTeilnehmer('signiert_teilnehmer'), true);
    assert.equal(istGesperrtFuerTeilnehmer('signiert_ausbilder'), true);
    assert.equal(istGesperrtFuerTeilnehmer('entwurf'), false);
    assert.equal(istGesperrtFuerTeilnehmer('beanstandet'), false);
  });

  it('Teilnehmer bearbeitet nur Entwurf und Beanstandung', () => {
    assert.equal(teilnehmerKannBearbeiten('entwurf'), true);
    assert.equal(teilnehmerKannBearbeiten('beanstandet'), true);
    assert.equal(teilnehmerKannBearbeiten('eingereicht'), false);
    assert.equal(teilnehmerKannBearbeiten('signiert_teilnehmer'), false);
  });

  it('verfuegbareAktionen filtert nach Rolle und Status', () => {
    assert.deepEqual(verfuegbareAktionen('entwurf', 'teilnehmer'), ['einreichen']);
    assert.deepEqual(verfuegbareAktionen('eingereicht', 'teilnehmer'), ['signieren_teilnehmer']);
    assert.deepEqual(
      verfuegbareAktionen('signiert_teilnehmer', 'ausbilder').sort(),
      ['beanstanden', 'korrektur', 'signieren_ausbilder'].sort(),
    );
    assert.deepEqual(verfuegbareAktionen('signiert_ausbilder', 'ausbilder'), ['korrektur']);
  });
});

describe('ISO-Kalenderwochen', () => {
  it('bestimmt bekannte Wochen korrekt', () => {
    // 2026-01-01 ist ein Donnerstag → KW 1 (ISO-Jahr 2026).
    assert.deepEqual(isoKalenderwoche(new Date(Date.UTC(2026, 0, 1))), { jahr: 2026, woche: 1 });
    // 2021-01-01 (Freitag) gehört noch zur KW 53/2020.
    assert.deepEqual(isoKalenderwoche(new Date(Date.UTC(2021, 0, 1))), { jahr: 2020, woche: 53 });
  });

  it('wochenBereich liefert Montag bis Sonntag', () => {
    const b = wochenBereich(2026, 1);
    assert.equal(b.von, '2025-12-29'); // Montag der KW 1/2026
    assert.equal(b.bis, '2026-01-04'); // Sonntag
  });
});

describe('findeWochenLuecken', () => {
  it('meldet fehlende Wochen im Zeitraum', () => {
    // Zeitraum KW1..KW3 2026, vorhanden nur eine Woche mitten in KW2.
    const luecken = findeWochenLuecken(
      [{ von: '2026-01-06' }], // liegt in KW 2/2026
      '2025-12-29',
      '2026-01-18',
    );
    const kws = luecken.map((l) => l.kalenderwoche);
    assert.ok(kws.includes(1));
    assert.ok(kws.includes(3));
    assert.ok(!kws.includes(2));
  });

  it('keine Lücken, wenn alle Wochen abgedeckt sind', () => {
    const luecken = findeWochenLuecken(
      [{ von: '2025-12-29' }, { von: '2026-01-05' }],
      '2025-12-29',
      '2026-01-11',
    );
    assert.equal(luecken.length, 0);
  });

  it('überspannt Jahreswechsel', () => {
    const luecken = findeWochenLuecken([], '2025-12-22', '2026-01-04');
    // KW52/2025, KW1/2026 (2025 hat 52 Wochen)
    assert.ok(luecken.length >= 2);
    assert.ok(luecken.some((l) => l.jahr === 2025));
    assert.ok(luecken.some((l) => l.jahr === 2026));
  });
});

describe('Inhalt und Signatur', () => {
  it('erkennt leeren Inhalt', () => {
    assert.equal(inhaltIstLeer(null), true);
    assert.equal(inhaltIstLeer({}), true);
    assert.equal(inhaltIstLeer({ taetigkeiten: '   ' }), true);
    assert.equal(inhaltIstLeer({ taetigkeiten: 'Drehen geübt' }), false);
  });

  it('signaturKlartext ist stabil und trimmt', () => {
    const a = signaturKlartext({ nachweisId: 'x', status: 'eingereicht', inhalt: { taetigkeiten: ' A ' } });
    const b = signaturKlartext({ nachweisId: 'x', status: 'eingereicht', inhalt: { taetigkeiten: 'A' } });
    assert.equal(a, b);
  });
});
