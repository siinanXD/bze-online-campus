import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { CONTENT_TYPEN } from '@bze/core/content';
import { LLMContentProvider, MockAIContentProvider, erstelleAIContentProvider } from '../../../app/[locale]/admin/content/ki-generator/_lib/provider';
import { generatorPreviewSchema, generatorRequestSchema, zaehleAngeforderteInhalte } from '../../../app/[locale]/admin/content/ki-generator/_lib/schemas';

const ID = '11111111-1111-4111-8111-111111111111';
const THEMA_ID = '22222222-2222-4222-8222-222222222222';
const UNTERTHEMA_ID = '33333333-3333-4333-8333-333333333333';
const LERNZIEL_ID = '44444444-4444-4444-8444-444444444444';

/**
 * Baut einen minimalen validen Generator-Request.
 */
function baueRequest() {
  return generatorRequestSchema.parse({
    fachbereichId: ID,
    fachbereichName: 'Werkstoffkunde',
    themaId: THEMA_ID,
    themaName: 'Metalle',
    unterthemaId: UNTERTHEMA_ID,
    unterthemaName: 'Stahl',
    lernzielIds: [LERNZIEL_ID],
    lernziele: ['Stahl erklaeren'],
    contentTypen: ['erklaerung'],
    schwierigkeitsgrade: ['mittel'],
    anzahlProTyp: { erklaerung: 1 },
    fehlerSimulation: 'keine',
  });
}

/**
 * Baut ein valides strukturiertes LLM-Content-Item.
 */
function baueLLMItem() {
  return {
    clientId: 'erklaerung-stahl-1',
    titel: 'Stahl - Erklaerung',
    beschreibung: 'KI-generierter Beispielinhalt - nicht fachlich verifiziert.',
    content_typ: 'erklaerung',
    schwierigkeitsgrad: 'mittel',
    lernzielIds: [LERNZIEL_ID],
    inhalt: {
      mdx: 'Stahl ist ein Beispielwerkstoff. Beispielwerte muessen fachlich geprueft werden.',
      lesedauer_minuten: 4,
    },
    antwortoptionen: [],
    musterloesung: null,
    bewertungsraster: [],
    qualitaetswert: 0.78,
    hinweise: ['KI-generierter Beispielinhalt - nicht fachlich verifiziert'],
  };
}

/**
 * Baut eine OpenAI-kompatible Chat-Completion-Antwort.
 */
function baueChatAntwort(json: unknown): Response {
  return new Response(JSON.stringify({
    choices: [{ message: { content: JSON.stringify(json) } }],
    usage: { prompt_tokens: 42, completion_tokens: 21 },
  }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'x-request-id': 'req-test-1' },
  });
}

describe('MockAIContentProvider', () => {
  it('erzeugt validierte strukturierte Inhalte fuer alle Content-Typen', async () => {
    const provider = new MockAIContentProvider();
    const request = generatorRequestSchema.parse({
      fachbereichId: ID,
      fachbereichName: 'Werkstoffkunde',
      themaId: THEMA_ID,
      themaName: 'Metalle',
      unterthemaId: UNTERTHEMA_ID,
      unterthemaName: 'Stahl',
      lernzielIds: [LERNZIEL_ID],
      lernziele: ['Stahl erklaeren'],
      contentTypen: CONTENT_TYPEN,
      schwierigkeitsgrade: ['einfach', 'mittel', 'schwer'],
      anzahlProTyp: Object.fromEntries(CONTENT_TYPEN.map((typ) => [typ, 1])),
      fehlerSimulation: 'keine',
    });

    const preview = generatorPreviewSchema.parse(await provider.generiereContent(request));

    assert.equal(preview.provider, 'mock_ai');
    assert.equal(preview.quelle, 'mock_ai');
    assert.equal(preview.items.length, CONTENT_TYPEN.length);
    assert.deepEqual(new Set(preview.items.map((item) => item.content_typ)), new Set(CONTENT_TYPEN));
    assert.equal(new Set(preview.items.map((item) => item.titel)).size, preview.items.length);
    assert.ok(preview.items.every((item) => item.hinweise.includes('KI-generierter Beispielinhalt - nicht fachlich verifiziert')));
  });

  it('generiert Lernziele und beruecksichtigt das Thema', async () => {
    const provider = new MockAIContentProvider();
    const lernziele = await provider.generiereLernziele({
      fachbereichName: 'Fertigungstechnik',
      themaName: 'Bohren',
      unterthemaName: 'Drehzahl',
      schwierigkeit: 'mittel',
    });

    assert.ok(lernziele.length >= 3);
    assert.ok(lernziele.every((ziel) => ziel.titel.includes('Drehzahl') || ziel.beschreibung.includes('Drehzahl')));
  });

  it('begrenzt und zaehlt angeforderte Inhalte ueber das Request-Schema', () => {
    const request = generatorRequestSchema.parse({
      fachbereichId: ID,
      fachbereichName: 'Technische Mathematik',
      themaId: THEMA_ID,
      themaName: 'Drehzahl',
      unterthemaId: UNTERTHEMA_ID,
      unterthemaName: 'Schnittgeschwindigkeit',
      contentTypen: ['erklaerung', 'rechenaufgabe'],
      schwierigkeitsgrade: ['mittel'],
      anzahlProTyp: { erklaerung: 2, rechenaufgabe: 3 },
    });

    assert.equal(zaehleAngeforderteInhalte(request), 5);
    assert.equal(generatorRequestSchema.safeParse({ ...request, anzahlProTyp: { erklaerung: 8 } }).success, false);
  });

  it('simuliert Provider- und Validierungsfehler', async () => {
    const provider = new MockAIContentProvider();
    const basis = {
      fachbereichId: ID,
      fachbereichName: 'Arbeitssicherheit',
      themaId: THEMA_ID,
      themaName: 'Schutzvorrichtungen',
      unterthemaId: UNTERTHEMA_ID,
      unterthemaName: 'Gefahrenstellen',
      contentTypen: ['erklaerung'],
      schwierigkeitsgrade: ['mittel'],
      anzahlProTyp: { erklaerung: 1 },
    };

    await assert.rejects(
      () => provider.generiereContent(generatorRequestSchema.parse({ ...basis, fehlerSimulation: 'provider_fehler' })),
      /Simulierter Mock-Provider-Fehler/,
    );
    await assert.rejects(
      () => provider.generiereContent(generatorRequestSchema.parse({ ...basis, fehlerSimulation: 'validierung_fehler' })),
      /titel/,
    );
  });
});

describe('LLMContentProvider', () => {
  it('validiert strukturierte LLM-Ausgabe und uebernimmt Usage-Metadaten', async () => {
    const provider = new LLMContentProvider({
      apiKey: 'test-key',
      baseUrl: 'https://llm.example/v1',
      modell: 'test-model',
      fetcher: async (input, init) => {
        assert.equal(input, 'https://llm.example/v1/chat/completions');
        assert.equal((init.headers as Record<string, string>).Authorization, 'Bearer test-key');
        const body = JSON.parse(String(init.body)) as { model: string; messages: Array<{ content: string }> };
        assert.equal(body.model, 'test-model');
        assert.match(body.messages[0]?.content ?? '', /Maschinen- und Anlagenfuehrer\/-innen/);
        assert.match(body.messages[0]?.content ?? '', /keine Normen/);
        assert.match(body.messages[0]?.content ?? '', /originale IHK-Frage/);
        return baueChatAntwort({ items: [baueLLMItem()] });
      },
    });

    const preview = await provider.generiereContent(baueRequest());

    assert.equal(preview.provider, 'llm');
    assert.equal(preview.quelle, 'ki');
    assert.equal(preview.modell, 'test-model');
    assert.equal(preview.usage?.inputTokens, 42);
    assert.equal(preview.usage?.outputTokens, 21);
    assert.equal(preview.usage?.requestId, 'req-test-1');
    assert.equal(preview.items.length, 1);
  });

  it('speichert ungueltige LLM-Ausgabe nicht ungeprueft', async () => {
    const provider = new LLMContentProvider({
      apiKey: 'test-key',
      baseUrl: 'https://llm.example/v1',
      modell: 'test-model',
      fetcher: async () => baueChatAntwort({ items: [{ ...baueLLMItem(), titel: '' }] }),
    });

    await assert.rejects(() => provider.generiereContent(baueRequest()), /titel/);
  });

  it('erzwingt bei AI_MOCK_MODE immer den Mock-Provider', () => {
    const altMock = process.env.AI_MOCK_MODE;
    const altKey = process.env.LLM_API_KEY;
    process.env.AI_MOCK_MODE = 'true';
    process.env.LLM_API_KEY = 'test-key';
    try {
      const provider = erstelleAIContentProvider();
      assert.equal(provider.anbieter, 'mock_ai');
      assert.equal(provider.quelle, 'mock_ai');
    } finally {
      process.env.AI_MOCK_MODE = altMock;
      process.env.LLM_API_KEY = altKey;
    }
  });
});
