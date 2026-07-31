import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  WISSENS_BUCKET,
  bereinigeDateiname,
  bereinigeWissenstext,
  erkenneWissensquelleTyp,
  erstelleWissensChunks,
  istDirektParsebarerWissensTyp,
  validiereWissensdatei,
  wissensStoragePfad,
} from '@bze/core/content';

describe('Wissensdatenbank Dateivalidierung', () => {
  it('erkennt vorbereitete Quellentypen', () => {
    assert.equal(erkenneWissensquelleTyp('skript.md'), 'markdown');
    assert.equal(erkenneWissensquelleTyp('hinweis.txt'), 'text');
    assert.equal(erkenneWissensquelleTyp('unterlage.pdf'), 'pdf');
    assert.equal(erkenneWissensquelleTyp('unterlage.docx'), 'docx');
  });

  it('validiert Text- und Markdown-Dateien und lehnt unsichere Typen ab', () => {
    assert.deepEqual(validiereWissensdatei({ name: 'a.md', size: 100, type: 'text/markdown' }), {
      ok: true,
      quelleTyp: 'markdown',
      mimeType: 'text/markdown',
    });
    assert.deepEqual(validiereWissensdatei({ name: 'a.exe', size: 100, type: 'application/octet-stream' }), {
      ok: false,
      fehler: 'dateityp_nicht_erlaubt',
    });
    assert.deepEqual(validiereWissensdatei({ name: 'a.txt', size: 11 * 1024 * 1024, type: 'text/plain' }), {
      ok: false,
      fehler: 'datei_zu_gross',
    });
  });

  it('bereinigt Dateinamen und erzeugt Tenant-Storage-Pfade', () => {
    assert.equal(bereinigeDateiname('../Meine Datei!!.MD'), 'meine-datei.md');
    assert.equal(WISSENS_BUCKET, 'wissensdatenbank');
    assert.equal(
      wissensStoragePfad({
        traegerId: '11111111-1111-4111-8111-111111111111',
        dokumentId: '22222222-2222-4222-8222-222222222222',
        dateiname: '../Meine Datei!!.MD',
      }),
      '11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222/meine-datei.md',
    );
  });
});

describe('Wissensdatenbank Chunking', () => {
  it('bereinigt Text deterministisch', () => {
    assert.equal(bereinigeWissenstext('Zeile 1\r\nZeile 2\n\n\n\nZeile 3\u0000'), 'Zeile 1\nZeile 2\n\n\nZeile 3');
  });

  it('erzeugt Chunks mit Hash, Quellenreferenz und Mock-Embedding-Metadaten', () => {
    const text = [
      'Werkstoffkunde beschreibt Metalle und Kunststoffe in der Fertigung.',
      'In der Praxis pruefst du Arbeitsauftrag, Zeichnung und Sicherheitsvorgaben.',
      'Beispielwerte ersetzen keine freigegebene Quelle.',
    ].join('\n\n');
    const chunks = erstelleWissensChunks(text, { zielZeichen: 90, ueberlappungZeichen: 20 });
    assert.ok(chunks.length >= 2);
    assert.equal(chunks[0]?.chunkIndex, 0);
    assert.equal(chunks[0]?.embeddingMetadaten.provider, 'mock');
    assert.equal(chunks[0]?.embeddingMetadaten.dimension, 1536);
    assert.ok(chunks[0]?.textHash);
    assert.equal(chunks[0]?.quellenreferenz.abschnitt, 1);
  });

  it('markiert nur Text, Markdown und manuellen Fachtext als direkt parsebar', () => {
    assert.equal(istDirektParsebarerWissensTyp('text'), true);
    assert.equal(istDirektParsebarerWissensTyp('markdown'), true);
    assert.equal(istDirektParsebarerWissensTyp('manueller_fachtext'), true);
    assert.equal(istDirektParsebarerWissensTyp('pdf'), false);
    assert.equal(istDirektParsebarerWissensTyp('docx'), false);
  });
});
