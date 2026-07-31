import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  baueRagKontext,
  mockRetrieveChunks,
  normalisiereRagMinSimilarity,
  normalisiereRagTopK,
  ragSollRetrievalNutzen,
  type RagChunkReferenz,
} from '@bze/core/content';

const CHUNK: RagChunkReferenz = {
  chunkId: '11111111-1111-4111-8111-111111111111',
  quelldokumentId: '22222222-2222-4222-8222-222222222222',
  dokumentTitel: 'Werkstoffkunde Skript',
  quelleTyp: 'markdown',
  chunkIndex: 0,
  inhalt:
    'Stahl ist ein Eisenwerkstoff, der in der Fertigung haeufig fuer belastete Bauteile eingesetzt wird. ' +
    'Fuer die Ausbildung sind Auftrag, Werkstoffangabe, Bearbeitung, Schutz vor Korrosion und die passende Werkzeugwahl wichtig. ' +
    'Beispielwerte in Lernaufgaben muessen als Beispielwerte gekennzeichnet werden und duerfen keine Normangaben ersetzen.',
  similarity: 0.82,
  quellenreferenz: { abschnitt: 1 },
};

describe('RAG-Konfiguration', () => {
  it('nutzt Retrieval nur bei aktivem RAG und nicht im Generated-Modus', () => {
    assert.equal(ragSollRetrievalNutzen({ ragEnabled: false, sourceMode: 'knowledge_base' }), false);
    assert.equal(ragSollRetrievalNutzen({ ragEnabled: true, sourceMode: 'generated' }), false);
    assert.equal(ragSollRetrievalNutzen({ ragEnabled: true, sourceMode: 'knowledge_base' }), true);
    assert.equal(ragSollRetrievalNutzen({ ragEnabled: true, sourceMode: 'hybrid' }), true);
  });

  it('begrenzt Top-K und Mindest-Aehnlichkeit', () => {
    assert.equal(normalisiereRagTopK(99), 12);
    assert.equal(normalisiereRagTopK('3'), 3);
    assert.equal(normalisiereRagMinSimilarity(2), 1);
    assert.equal(normalisiereRagMinSimilarity('-1'), 0);
  });
});

describe('RAG-Kontext', () => {
  it('baut Quellenreferenzen und verwendete Chunk-IDs', () => {
    const kontext = baueRagKontext({
      sourceMode: 'knowledge_base',
      ragEnabled: true,
      topK: 6,
      minSimilarity: 0.7,
      chunks: [CHUNK],
    });
    assert.equal(kontext.verwendeteChunkIds[0], CHUNK.chunkId);
    assert.equal(kontext.dokumente[0]?.titel, 'Werkstoffkunde Skript');
    assert.match(kontext.kontextText, /Quelle 1/);
    assert.equal(kontext.ausreichend, true);
  });

  it('warnt bei keinen Treffern und unzureichendem Knowledge-Base-Kontext', () => {
    const kontext = baueRagKontext({
      sourceMode: 'knowledge_base',
      ragEnabled: true,
      topK: 6,
      minSimilarity: 0.7,
      chunks: [],
    });
    assert.equal(kontext.ausreichend, false);
    assert.ok(kontext.warnungen.some((warnung) => warnung.includes('Keine passenden')));
    assert.ok(kontext.warnungen.some((warnung) => warnung.includes('unbelegte')));
  });

  it('bewertet Mock-Retrieval deterministisch', () => {
    const treffer = mockRetrieveChunks({
      query: 'Stahl Werkstoff Bearbeitung',
      chunks: [CHUNK, { ...CHUNK, chunkId: '33333333-3333-4333-8333-333333333333', inhalt: 'Brandschutz und Evakuierung', similarity: 0.01 }],
      topK: 1,
      minSimilarity: 0.1,
    });
    assert.equal(treffer.length, 1);
    assert.equal(treffer[0]?.chunkId, CHUNK.chunkId);
  });
});
