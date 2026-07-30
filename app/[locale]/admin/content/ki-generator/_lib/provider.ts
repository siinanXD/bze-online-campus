import { z } from 'zod';
import type { ContentTyp, RagKontext, Schwierigkeitsgrad } from '@bze/core/content';
import { ladeGeneratorKonfiguration, ladeLLMProviderKonfiguration } from './config';
import {
  GENERATOR_MAX_INHALTE,
  generatorContentItemSchema,
  generatorPreviewSchema,
  lernzielVorschlagSchema,
  type GeneratorContentItem,
  type GeneratorPreview,
  type GeneratorProvider,
  type GeneratorRequest,
  type GeneratorUsage,
  type LernzielVorschlag,
  zaehleAngeforderteInhalte,
} from './schemas';

type RegenerierenVariante = 'neu' | 'einfacher' | 'schwieriger' | 'praxisnaeher' | 'kuerzer' | 'ausfuehrlicher';
type ProviderQuelle = 'mock_ai' | 'ki';
type FetchLike = (input: string, init: RequestInit) => Promise<Response>;

export interface AIContentProvider {
  readonly anbieter: GeneratorProvider;
  readonly quelle: ProviderQuelle;
  readonly modell: string;
  generiereLernziele(request: LernzielProviderRequest): Promise<LernzielVorschlag[]>;
  generiereContent(request: GeneratorRequest, ragContext?: RagKontext): Promise<GeneratorPreview>;
  regeneriereContent(request: GeneratorRequest, item: GeneratorContentItem, variante: RegenerierenVariante): Promise<GeneratorContentItem>;
}

export type LernzielProviderRequest = {
  fachbereichName: string;
  themaName: string;
  unterthemaName: string;
  schwierigkeit: Schwierigkeitsgrad;
};

const DEMO_LABEL = 'KI-generierter Beispielinhalt - nicht fachlich verifiziert';
const LLM_TIMEOUT_MS = 25_000;
const LLM_MAX_RETRIES = 1;

const llmLernzielAntwortSchema = z.object({
  lernziele: z.array(lernzielVorschlagSchema).min(3).max(5),
});

const llmContentAntwortSchema = z.object({
  items: z.array(generatorContentItemSchema).max(GENERATOR_MAX_INHALTE),
});

const llmItemAntwortSchema = z.object({
  item: generatorContentItemSchema,
});

/**
 * Liefert den konfigurierten Provider. Mock-Modus hat immer Vorrang.
 */
export function erstelleAIContentProvider(erzwungenerProvider?: GeneratorProvider): AIContentProvider {
  const config = ladeGeneratorKonfiguration();
  if (config.aiMockMode || erzwungenerProvider === 'mock_ai') {
    return new MockAIContentProvider();
  }
  const llmConfig = ladeLLMProviderKonfiguration();
  if (!llmConfig.apiKey) {
    throw new Error('LLM_API_KEY fehlt. Setze AI_MOCK_MODE=true fuer den Mock-Modus oder konfiguriere einen LLM-Anbieter.');
  }
  if (erzwungenerProvider && erzwungenerProvider !== 'llm') {
    throw new Error(`unbekannter_provider:${erzwungenerProvider}`);
  }
  return new LLMContentProvider(llmConfig);
}

export type LLMContentProviderOptionen = {
  apiKey: string;
  baseUrl: string;
  modell: string;
  fetcher?: FetchLike;
  timeoutMs?: number;
  maxRetries?: number;
};

type ChatAufruf = {
  system: string;
  user: string;
  temperatur?: number;
};

type ChatJsonAntwort = {
  json: unknown;
  usage: GeneratorUsage;
};

class LLMProviderFehler extends Error {
  readonly retryable: boolean;

  /**
   * Markiert kontrolliert wiederholbare Provider-Fehler.
   */
  constructor(message: string, retryable = false) {
    super(message);
    this.retryable = retryable;
  }
}

export class LLMContentProvider implements AIContentProvider {
  readonly anbieter = 'llm' as const;
  readonly quelle = 'ki' as const;
  readonly modell: string;
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetcher: FetchLike;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;

  /**
   * Erstellt einen OpenAI-kompatiblen serverseitigen LLM-Provider.
   */
  constructor(optionen: LLMContentProviderOptionen) {
    pruefeServerRuntime();
    if (!optionen.apiKey.trim()) throw new Error('LLM_API_KEY fehlt');
    this.apiKey = optionen.apiKey;
    this.baseUrl = optionen.baseUrl.replace(/\/$/, '');
    this.modell = optionen.modell.trim() || 'gpt-4o-mini';
    this.fetcher = optionen.fetcher ?? fetch;
    this.timeoutMs = optionen.timeoutMs ?? LLM_TIMEOUT_MS;
    this.maxRetries = optionen.maxRetries ?? LLM_MAX_RETRIES;
  }

  /**
   * Generiert Lernziele ueber den echten Provider und validiert die Ausgabe.
   */
  async generiereLernziele(request: LernzielProviderRequest): Promise<LernzielVorschlag[]> {
    const antwort = await this.rufeChatJson({
      temperatur: 0.25,
      system: baueSystemPrompt('lernziele'),
      user: JSON.stringify({
        aufgabe: 'Generiere 3 bis 5 Lernziele im vorgegebenen Schema.',
        schema: '{"lernziele":[{"clientId":"ziel-kurz-1","titel":"...","beschreibung":"...","schwierigkeitsgrad":"einfach|mittel|schwer"}]}',
        fachbereich: request.fachbereichName,
        thema: request.themaName,
        unterthema: request.unterthemaName,
        schwierigkeit: request.schwierigkeit,
      }),
    });
    return llmLernzielAntwortSchema.parse(antwort.json).lernziele;
  }

  /**
   * Generiert eine Content-Preview ueber den echten Provider.
   */
  async generiereContent(request: GeneratorRequest, ragContext?: RagKontext): Promise<GeneratorPreview> {
    if (request.fehlerSimulation === 'provider_fehler') {
      throw new Error('Simulierter LLM-Provider-Fehler');
    }
    const antwort = await this.rufeChatJson({
      temperatur: 0.35,
      system: baueSystemPrompt('content'),
      user: JSON.stringify({
        aufgabe: 'Generiere Content-Elemente ausschliesslich im Schema {"items":[...]}',
        schema: beschreibeItemSchema(),
        maximal_inhalte: zaehleAngeforderteInhalte(request),
        request,
        rag: ragContext ? baueRagPromptDaten(ragContext) : null,
      }),
    });
    const items = llmContentAntwortSchema.parse(antwort.json).items.slice(0, zaehleAngeforderteInhalte(request));
    if (request.fehlerSimulation === 'validierung_fehler' && items[0]) {
      items[0] = { ...items[0], titel: '' };
    }
    pruefeEindeutigeItems(items);
    return generatorPreviewSchema.parse({
      provider: this.anbieter,
      modell: this.modell,
      quelle: this.quelle,
      sourceMode: ragContext?.sourceMode ?? 'generated',
      ragEnabled: ragContext?.ragEnabled ?? false,
      ragContext,
      demoLabel: DEMO_LABEL,
      items,
      erstelltAm: new Date().toISOString(),
      usage: antwort.usage,
    });
  }

  /**
   * Regeneriert ein einzelnes Content-Element mit einer kontrollierten Variante.
   */
  async regeneriereContent(
    request: GeneratorRequest,
    item: GeneratorContentItem,
    variante: RegenerierenVariante,
  ): Promise<GeneratorContentItem> {
    const antwort = await this.rufeChatJson({
      temperatur: 0.35,
      system: baueSystemPrompt('regenerierung'),
      user: JSON.stringify({
        aufgabe: `Regeneriere genau ein Element. Variante: ${variante}.`,
        schema: '{"item": <GeneratorContentItem>}',
        request,
        bisheriges_element: item,
      }),
    });
    const neu = llmItemAntwortSchema.parse(antwort.json).item;
    return generatorContentItemSchema.parse({
      ...neu,
      clientId: item.clientId,
      schwierigkeitsgrad: variante === 'einfacher'
        ? 'einfach'
        : variante === 'schwieriger'
          ? 'schwer'
          : neu.schwierigkeitsgrad,
    });
  }

  /**
   * Ruft das OpenAI-kompatible Chat-Completion-API mit Timeout und kontrolliertem Retry auf.
   */
  private async rufeChatJson(aufruf: ChatAufruf): Promise<ChatJsonAntwort> {
    let letzterFehler: unknown = null;
    for (let versuch = 0; versuch <= this.maxRetries; versuch += 1) {
      try {
        return await this.rufeChatJsonEinmal(aufruf);
      } catch (error) {
        letzterFehler = error;
        const retryable = error instanceof LLMProviderFehler && error.retryable;
        if (!retryable || versuch >= this.maxRetries) break;
      }
    }
    throw letzterFehler instanceof Error ? letzterFehler : new Error('llm_aufruf_fehlgeschlagen');
  }

  /**
   * Fuehrt genau einen Provider-Aufruf aus.
   */
  private async rufeChatJsonEinmal(aufruf: ChatAufruf): Promise<ChatJsonAntwort> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    let response: Response;
    try {
      response = await this.fetcher(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modell,
          temperature: aufruf.temperatur ?? 0.3,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: aufruf.system },
            { role: 'user', content: aufruf.user },
          ],
        }),
      });
    } catch (error) {
      const istTimeout = error instanceof Error && error.name === 'AbortError';
      throw new LLMProviderFehler(istTimeout ? 'llm_timeout' : 'llm_netzwerkfehler', true);
    } finally {
      clearTimeout(timeout);
    }

    const requestId = response.headers.get('x-request-id') ?? response.headers.get('x-openai-request-id') ?? undefined;
    if (!response.ok) {
      const text = await response.text();
      const retryable = response.status === 429 || response.status >= 500;
      throw new LLMProviderFehler(`llm_fehler_${response.status}:${text.slice(0, 200)}`, retryable);
    }

    const daten = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number; input_tokens?: number; output_tokens?: number };
    };
    const content = daten.choices?.[0]?.message?.content;
    if (!content) throw new Error('llm_leere_antwort');
    let json: unknown;
    try {
      json = JSON.parse(entferneMarkdownFence(content));
    } catch {
      throw new Error('llm_ungueltiges_json');
    }
    return {
      json,
      usage: {
        inputTokens: daten.usage?.prompt_tokens ?? daten.usage?.input_tokens ?? null,
        outputTokens: daten.usage?.completion_tokens ?? daten.usage?.output_tokens ?? null,
        requestId,
      },
    };
  }
}

/**
 * Baut den gemeinsamen Sicherheits- und Qualitaetsprompt fuer Content.
 */
function baueSystemPrompt(modus: 'lernziele' | 'content' | 'regenerierung'): string {
  return [
    `Du bist ein Content-Assistent fuer die Zielgruppe Maschinen- und Anlagenfuehrer/-innen (MAF), Schwerpunkt Metall- und Kunststofftechnik. Modus: ${modus}.`,
    'Schreibe verstaendliches Deutsch auf Ausbildungsniveau.',
    'Nutze praxisnahe Beispiele aus Betrieb, Maschine, Werkstoff, Qualitaet und Arbeitssicherheit.',
    'Arbeite lernzielorientiert und erzeuge keine nahezu identischen Inhalte.',
    'Fragen muessen eindeutig sein; richtige Antworten und Erklaerungen muessen eindeutig gekennzeichnet sein.',
    'Erfinde keine Normen, Grenzwerte oder Tabellenwerte.',
    'Behaupte niemals, eine Aufgabe sei eine originale IHK-Frage.',
    'Reproduziere keine geschuetzten Pruefungsaufgaben.',
    'Kennzeichne Rechenwerte ausdruecklich als Beispielwerte.',
    'Wenn RAG-Kontext vorhanden ist: Verwende nur die gelieferten Quellenreferenzen.',
    'Erfinde keine Quellen, Dokumente, Normen oder Chunk-Referenzen.',
    'Im Knowledge-Base-Modus darfst du keine unbelegten Fachbehauptungen ausserhalb des Kontexts ergaenzen.',
    'Im Hybrid-Modus darfst du nur dort frei ergaenzen, wo der Kontext keine fachliche Behauptung vorgibt; markiere Unsicherheiten als Hinweis.',
    'Bei unzureichendem Kontext liefere eine klare Warnung im Feld hinweise.',
    `Jeder Inhalt ist Demo-Content: "${DEMO_LABEL}".`,
    'Antworte ausschliesslich mit JSON im vorgegebenen Schema, ohne Markdown und ohne Zusatztext.',
  ].join('\n');
}

/**
 * Reduziert RAG-Kontext auf promptfaehige Daten ohne Client-Secrets.
 */
function baueRagPromptDaten(ragContext: RagKontext): Record<string, unknown> {
  return {
    sourceMode: ragContext.sourceMode,
    ausreichend: ragContext.ausreichend,
    warnungen: ragContext.warnungen,
    dokumente: ragContext.dokumente,
    verwendeteChunkIds: ragContext.verwendeteChunkIds,
    kontext: ragContext.kontextText,
    regeln: ragContext.sourceMode === 'knowledge_base'
      ? [
          'Nutze ausschliesslich belegte Aussagen aus dem Kontext.',
          'Keine fachlichen Ergaenzungen ohne Quelle.',
          'Wenn Kontext fehlt, Warnung ausgeben und keine erfundene Antwort erzeugen.',
        ]
      : [
          'Nutze Kontext bevorzugt als Quelle.',
          'Ergaenzungen duerfen nur allgemein-didaktisch sein und keine unbelegten Fachwerte enthalten.',
        ],
  };
}

/**
 * Beschreibt das erwartete Item-Schema kompakt fuer den Provider.
 */
function beschreibeItemSchema(): string {
  return JSON.stringify({
    items: [{
      clientId: 'typ-unterthema-1',
      titel: 'string',
      beschreibung: 'string',
      content_typ: 'erklaerung|lernkarte|single_choice|multiple_choice|freitext|rechenaufgabe|praxisfall|pruefungsnahe_uebungsfrage|zusammenfassung',
      schwierigkeitsgrad: 'einfach|mittel|schwer',
      lernzielIds: ['uuid'],
      inhalt: {},
      antwortoptionen: [{ text: 'string', ist_korrekt: true, erklaerung: 'string' }],
      musterloesung: 'string oder null',
      bewertungsraster: ['string'],
      qualitaetswert: 0.75,
      hinweise: [DEMO_LABEL, 'nicht fachlich verifiziert'],
    }],
  });
}

/**
 * Verhindert doppelte oder nahezu leere LLM-Items.
 */
function pruefeEindeutigeItems(items: GeneratorContentItem[]): void {
  const ids = new Set(items.map((item) => item.clientId));
  const titel = new Set(items.map((item) => item.titel.trim().toLowerCase()));
  if (ids.size !== items.length || titel.size !== items.length) {
    throw new Error('llm_ungueltige_ausgabe_doppelte_inhalte');
  }
}

/**
 * Entfernt haeufige Markdown-Zaune um JSON.
 */
function entferneMarkdownFence(text: string): string {
  return text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
}

/**
 * Verhindert versehentliche Ausfuehrung des echten Providers im Browser.
 */
function pruefeServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('llm_provider_nur_serverseitig');
  }
}

export class MockAIContentProvider implements AIContentProvider {
  readonly anbieter = 'mock_ai' as const;
  readonly quelle = 'mock_ai' as const;
  readonly modell = 'mock-content-v1' as const;

  /**
   * Erzeugt drei bis fuenf praxisnahe Lernzielvorschlaege.
   */
  async generiereLernziele(request: LernzielProviderRequest): Promise<LernzielVorschlag[]> {
    const basis = [
      `${request.unterthemaName} mit eigenen Worten erklaeren`,
      `Typische Anwendungen von ${request.unterthemaName} im Betrieb erkennen`,
      `Sicherheits- und Qualitaetsrisiken bei ${request.unterthemaName} benennen`,
      `Einfache Entscheidungen zu ${request.unterthemaName} begruenden`,
    ];
    return lernzielVorschlagSchema.array().parse(
      basis.map((titel, index) => ({
        clientId: `ziel-${slug(request.unterthemaName)}-${index + 1}`,
        titel,
        beschreibung: `Die lernende Person kann ${request.unterthemaName} im Bereich ${request.fachbereichName} praxisnah einordnen und im Arbeitsauftrag anwenden.`,
        schwierigkeitsgrad: index === 2 ? 'schwer' : request.schwierigkeit,
      })),
    );
  }

  /**
   * Erzeugt eine validierte Content-Preview fuer den Admin.
   */
  async generiereContent(request: GeneratorRequest, ragContext?: RagKontext): Promise<GeneratorPreview> {
    if (request.fehlerSimulation === 'provider_fehler') {
      throw new Error('Simulierter Mock-Provider-Fehler');
    }
    const items: GeneratorContentItem[] = [];
    let index = 0;
    for (const typ of request.contentTypen) {
      const anzahl = request.anzahlProTyp[typ] ?? 0;
      for (let lauf = 0; lauf < anzahl; lauf += 1) {
        const schwierigkeitsgrad = request.schwierigkeitsgrade[(index + lauf) % request.schwierigkeitsgrade.length] ?? 'mittel';
        const item = baueItem(request, typ, schwierigkeitsgrad, index, ragContext);
        items.push(item);
        index += 1;
      }
    }
    if (request.fehlerSimulation === 'validierung_fehler' && items[0]) {
      items[0] = { ...items[0], titel: '' };
    }
    return generatorPreviewSchema.parse({
      provider: this.anbieter,
      modell: this.modell,
      quelle: this.quelle,
      sourceMode: ragContext?.sourceMode ?? 'generated',
      ragEnabled: ragContext?.ragEnabled ?? false,
      ragContext,
      demoLabel: DEMO_LABEL,
      items: items.slice(0, zaehleAngeforderteInhalte(request)),
      erstelltAm: new Date().toISOString(),
      usage: {
        inputTokens: schaetzeProviderTokens(JSON.stringify(request)),
        outputTokens: schaetzeProviderTokens(JSON.stringify(items)),
        latenzMs: 1,
      },
    });
  }

  /**
   * Erzeugt eine Variante fuer ein einzelnes Preview-Element.
   */
  async regeneriereContent(
    request: GeneratorRequest,
    item: GeneratorContentItem,
    variante: RegenerierenVariante,
  ): Promise<GeneratorContentItem> {
    const schwierigkeit = variante === 'einfacher'
      ? 'einfach'
      : variante === 'schwieriger'
        ? 'schwer'
        : item.schwierigkeitsgrad;
    const basis = baueItem(request, item.content_typ, schwierigkeit, variationSeed(item.clientId, variante)) as GeneratorContentItem;
    const titelZusatz = variante === 'neu' ? 'Alternative' : variantenLabel(variante);
    return generatorContentItemSchema.parse({
      ...basis,
      clientId: item.clientId,
      titel: `${basis.titel} (${titelZusatz})`,
      inhalt: passeInhaltAn(basis.inhalt, variante),
      qualitaetswert: Math.min(0.88, basis.qualitaetswert + 0.02),
    });
  }
}

/**
 * Schaetzt Tokens fuer lokale Provider-Metadaten.
 */
function schaetzeProviderTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

/*
 * Historischer Mock-Provider-Code folgt als Hilfsfunktionen.
 */
/**
 * Baut ein einzelnes Mock-Content-Element.
 */
function baueItem(
  request: GeneratorRequest,
  typ: ContentTyp,
  schwierigkeitsgrad: Schwierigkeitsgrad,
  index: number,
  ragContext?: RagKontext,
): GeneratorContentItem {
  const kontext = kontextFuer(request.unterthemaName);
  const clientId = `${typ}-${slug(request.unterthemaName)}-${index + 1}`;
  const zielIds = request.lernzielIds.length > 0 ? request.lernzielIds.slice(0, 4) : [];
  const basis = {
    clientId,
    titel: titelFuer(typ, request.unterthemaName, index),
    beschreibung: `${DEMO_LABEL}. Erstellt fuer ${request.fachbereichName} / ${request.themaName}.`,
    content_typ: typ,
    schwierigkeitsgrad,
    lernzielIds: zielIds,
    qualitaetswert: 0.7 + ((index % 5) * 0.03),
    hinweise: [
      DEMO_LABEL,
      'Beispielwerte fachlich pruefen.',
      ...ragHinweise(ragContext),
    ],
  };

  if (typ === 'lernkarte') {
    return generatorContentItemSchema.parse({
      ...basis,
      inhalt: {
        vorderseite: `Was ist bei ${request.unterthemaName} im Arbeitsalltag besonders wichtig?`,
        rueckseite: `${kontext.kern}. Entscheidend sind Unterlagenpruefung, sichere Bedienung und eine einfache Sicht- oder Masskontrolle.`,
        merksatz: `${request.unterthemaName}: erst Auftrag und Sicherheit klaeren, dann Maschine einstellen.${ragKurzQuelle(ragContext)}`,
      },
    });
  }
  if (typ === 'rechenaufgabe') {
    const drehzahl = 800 + index * 40;
    const durchmesser = 20 + (index % 4) * 5;
    return generatorContentItemSchema.parse({
      ...basis,
      inhalt: {
        aufgabe: `Beispielrechnung: Bei ${request.unterthemaName} wird ein Werkstueck mit d = ${durchmesser} mm und n = ${drehzahl} 1/min betrachtet. Berechne die Schnittgeschwindigkeit als Beispielwert.`,
        gegebene_werte: [`d = ${durchmesser} mm`, `n = ${drehzahl} 1/min`, 'pi = 3,14'],
        gesuchte_groesse: 'Schnittgeschwindigkeit vc in m/min',
        formel: 'vc = pi * d * n / 1000',
        loesungsweg: `vc = 3,14 * ${durchmesser} * ${drehzahl} / 1000`,
        ergebnis: `${((3.14 * durchmesser * drehzahl) / 1000).toFixed(1)} m/min`,
        erklaerung: `Die Werte sind Beispielwerte und ersetzen keine freigegebene Tabellenbuch- oder Maschinenvorgabe.${ragKurzQuelle(ragContext)}`,
      },
    });
  }
  if (typ === 'praxisfall') {
    return generatorContentItemSchema.parse({
      ...basis,
      inhalt: {
        situation: `Du uebernimmst eine Anlage, bei der ${request.unterthemaName} fuer den naechsten Auftrag relevant ist. Die Schichtuebergabe nennt eine Auffaelligkeit an Material oder Werkzeug.`,
        aufgabe: 'Beschreibe, welche Unterlagen du pruefst, welche Rueckfrage du stellst und welche Kontrolle du vor dem Start durchfuehrst.',
        erwartungshorizont: [
          'Arbeitsauftrag, Zeichnung oder Pruefplan nennen.',
          'Sicherheitszustand der Maschine pruefen.',
          'Unsichere Werte nicht schaetzen.',
          'Bezug zu Qualitaet und Ausschuss herstellen.',
          ...ragErwartung(ragContext),
        ],
      },
    });
  }
  if (istFragetyp(typ)) {
    return baueFrageItem(request, typ, schwierigkeitsgrad, index, basis, kontext);
  }
  return generatorContentItemSchema.parse({
    ...basis,
    inhalt: {
      mdx: textFuer(typ, request, kontext, schwierigkeitsgrad, index, ragContext),
      lesedauer_minuten: typ === 'zusammenfassung' ? 2 : schwierigkeitsgrad === 'schwer' ? 7 : 4,
    },
  });
}

/**
 * Baut ein Frage-Preview-Element mit bestehender Fragenstruktur im Blick.
 */
function baueFrageItem(
  request: GeneratorRequest,
  typ: ContentTyp,
  schwierigkeitsgrad: Schwierigkeitsgrad,
  index: number,
  basis: Omit<GeneratorContentItem, 'inhalt' | 'antwortoptionen' | 'musterloesung' | 'bewertungsraster'>,
  kontext: { kern: string; falscheOptionen: string[] },
): GeneratorContentItem {
  const aufgabenstellung = typ === 'freitext'
    ? `Erklaere kurz, wie du bei ${request.unterthemaName} vorgehst, wenn eine Einstellung unklar ist.`
    : `Welche Aussage zu ${request.unterthemaName} ist fachlich am besten?`;
  const optionen = [
    {
      text: `${kontext.kern} Unterlagen und Sicherheitszustand werden vor dem Start geprueft.`,
      ist_korrekt: true,
      erklaerung: 'Das ist richtig, weil Maschinenbedienung, Sicherheit und Qualitaet zusammen betrachtet werden.',
    },
    ...kontext.falscheOptionen.slice(0, typ === 'multiple_choice' ? 3 : 2).map((text, optionIndex) => ({
      text,
      ist_korrekt: typ === 'multiple_choice' && optionIndex === 2,
      erklaerung: optionIndex === 2 ? 'Dieser Teilaspekt kann richtig sein, reicht allein aber nicht aus.' : 'Diese Aussage ist zu pauschal oder unsicher.',
    })),
  ];
  return generatorContentItemSchema.parse({
    ...basis,
    titel: titelFuer(typ, request.unterthemaName, index),
    inhalt: {
      aufgabenstellung,
      typ: typ === 'freitext' ? 'freitext' : 'mc',
      kern: typ === 'pruefungsnahe_uebungsfrage',
      hinweis: 'Keine originale Pruefungsfrage; frei erzeugter Beispielinhalt.',
    },
    antwortoptionen: typ === 'freitext' ? [] : optionen,
    musterloesung: typ === 'freitext' ? `Eine gute Antwort nennt Unterlagenpruefung, sichere Rueckfrage und eine einfache Qualitaetskontrolle bei ${request.unterthemaName}.` : null,
    bewertungsraster: typ === 'freitext' ? ['Unterlagen genannt', 'Sicherheit beachtet', 'Qualitaetskontrolle beschrieben'] : [],
    schwierigkeitsgrad,
  });
}

/**
 * Liefert MAF-Kontextbausteine fuer verschiedene Themenfelder.
 */
function kontextFuer(unterthema: string): { kern: string; falscheOptionen: string[] } {
  const klein = unterthema.toLowerCase();
  if (/(stahl|metall|aluminium|kupfer|messing|guss)/.test(klein)) {
    return {
      kern: 'Werkstoffe werden nach Aufgabe, Bearbeitung und geforderter Eigenschaft ausgewaehlt.',
      falscheOptionen: ['Alle Metalle verhalten sich bei der Bearbeitung gleich.', 'Werkstoffangaben koennen ohne Zeichnung frei gewaehlt werden.', 'Korrosion und Oberflaeche spielen nie eine Rolle.'],
    };
  }
  if (/(drehen|fraesen|bohren|schleifen|saegen|stanzen|biegen)/.test(klein)) {
    return {
      kern: 'Fertigungsprozesse brauchen passende Werkzeuge, sichere Einstellungen und eine Kontrolle des Ergebnisses.',
      falscheOptionen: ['Die Maschine korrigiert falsche Spannungen automatisch.', 'Vorschub und Drehzahl sind fuer jedes Material gleich.', 'Spanbildung und Geraeusch koennen Hinweise auf Fehler geben.'],
    };
  }
  if (/(drehzahl|schnittgeschwindigkeit|dichte|leistung|kraft|volumen|flaeche)/.test(klein)) {
    return {
      kern: 'Technische Mathematik wird mit Einheiten, Formel, Einsetzen und Ergebnispruefung bearbeitet.',
      falscheOptionen: ['Einheiten muessen erst am Ende geraten werden.', 'Beispielwerte sind automatisch Maschinenfreigaben.', 'Ein Ergebnis wird immer auf Plausibilitaet geprueft.'],
    };
  }
  return {
    kern: 'Sicheres Arbeiten entsteht durch Auftrag, Unterlagen, Maschine, Material und Kontrolle als zusammenhaengende Schritte.',
    falscheOptionen: ['Warnhinweise duerfen bei Zeitdruck uebersprungen werden.', 'Unklare Angaben werden ohne Rueckfrage geschaetzt.', 'Schutzvorrichtungen und PSA gehoeren zur Vorbereitung.'],
  };
}

/**
 * Erstellt einen lesbaren Titel.
 */
function titelFuer(typ: ContentTyp, unterthema: string, index: number): string {
  const label: Record<ContentTyp, string> = {
    erklaerung: 'Erklaerung',
    lernkarte: 'Lernkarte',
    single_choice: 'Single Choice',
    multiple_choice: 'Multiple Choice',
    freitext: 'Freitextfrage',
    rechenaufgabe: 'Rechenaufgabe',
    praxisfall: 'Praxisfall',
    pruefungsnahe_uebungsfrage: 'Pruefungsnahe Uebung',
    zusammenfassung: 'Zusammenfassung',
  };
  return `${unterthema} - ${label[typ]} ${index + 1}`;
}

/**
 * Baut Erklaerungs- und Zusammenfassungstexte.
 */
function textFuer(
  typ: ContentTyp,
  request: GeneratorRequest,
  kontext: { kern: string },
  schwierigkeitsgrad: Schwierigkeitsgrad,
  index: number,
  ragContext?: RagKontext,
): string {
  if (typ === 'zusammenfassung') {
    return [
      `- ${request.unterthemaName} gehoert zu ${request.fachbereichName}.`,
      '- Wichtig sind Auftrag, Sicherheit, Maschinenzustand und Qualitaetskontrolle.',
      '- Beispielwerte muessen vor Produktion fachlich geprueft werden.',
      ...ragZusammenfassung(ragContext),
      `- ${DEMO_LABEL}.`,
    ].join('\n');
  }
  const detail = schwierigkeitsgrad === 'schwer'
    ? 'Zusaetzlich werden Ursachen fuer Fehler betrachtet: falsche Einstellung, ungeeigneter Werkstoff, Verschleiss oder unklare Unterlagen.'
    : 'Im ersten Schritt reichen sichere Begriffe, typische Anwendungen und eine saubere Kontrolle.';
  return [
    `## ${request.unterthemaName}`,
    '',
    `${kontext.kern} Fuer Maschinen- und Anlagenfuehrer/-innen ist wichtig, den Bezug zu Auftrag, Maschine und Pruefmerkmal herzustellen.`,
    '',
    `${detail} In der Praxis werden Zeichnung, Arbeitsplan, Betriebsanweisung und Pruefplan genutzt. Wenn Zahlenwerte noetig sind, gelten sie hier nur als Beispielwerte.`,
    '',
    index % 2 === 0
      ? 'Ein guter Ablauf ist: Unterlagen lesen, Maschine sichern, Material pruefen, Einstellung nachvollziehen und Ergebnis dokumentieren.'
      : 'Typische Fehler entstehen, wenn Angaben uebertragen werden, ohne Werkstoff, Werkzeug oder Maschinenzustand zu pruefen.',
    ragMdxBlock(ragContext),
  ].join('\n');
}

/**
 * Liefert RAG-Hinweise fuer generierte Mock-Items.
 */
function ragHinweise(ragContext?: RagKontext): string[] {
  if (!ragContext?.ragEnabled) return [];
  return [
    `Quellenmodus: ${ragContext.sourceMode}`,
    ...ragContext.warnungen,
    ...ragContext.dokumente.map((dokument) => `Quelle: ${dokument.titel}`),
  ].slice(0, 6);
}

/**
 * Liefert einen kurzen Quellenhinweis.
 */
function ragKurzQuelle(ragContext?: RagKontext): string {
  const erstesDokument = ragContext?.dokumente[0];
  return erstesDokument ? ` Quelle: ${erstesDokument.titel}.` : '';
}

/**
 * Liefert Praxisfall-Erwartungen aus RAG-Referenzen.
 */
function ragErwartung(ragContext?: RagKontext): string[] {
  if (!ragContext?.dokumente.length) return [];
  return [`Verwendete Quelle nennen: ${ragContext.dokumente[0]?.titel}.`];
}

/**
 * Liefert Zusammenfassungszeilen fuer Quellen.
 */
function ragZusammenfassung(ragContext?: RagKontext): string[] {
  if (!ragContext?.ragEnabled) return [];
  if (ragContext.dokumente.length === 0) return ['- Keine ausreichenden Wissensdatenbank-Quellen gefunden.'];
  return ragContext.dokumente.slice(0, 3).map((dokument) => `- Quelle genutzt: ${dokument.titel}.`);
}

/**
 * Liefert einen MDX-Block fuer Quellen und Kontextwarnungen.
 */
function ragMdxBlock(ragContext?: RagKontext): string {
  if (!ragContext?.ragEnabled) return '';
  const quellen = ragContext.dokumente.map((dokument) => `- ${dokument.titel} (${dokument.quelleTyp})`).join('\n');
  const warnungen = ragContext.warnungen.map((warnung) => `- ${warnung}`).join('\n');
  return [
    '',
    '### Quellenmodus',
    `Modus: ${ragContext.sourceMode}`,
    quellen ? `Verwendete Dokumente:\n${quellen}` : 'Keine passenden Dokumente gefunden.',
    warnungen ? `Hinweise:\n${warnungen}` : '',
  ].filter(Boolean).join('\n');
}

/**
 * Erkennt Content-Typen, die in der bestehenden Fragenstruktur gespeichert werden.
 */
function istFragetyp(typ: ContentTyp): boolean {
  return ['single_choice', 'multiple_choice', 'freitext', 'pruefungsnahe_uebungsfrage'].includes(typ);
}

/**
 * Passt die Textlaenge oder Praxisnaehe einer Regenerierung an.
 */
function passeInhaltAn(inhalt: Record<string, unknown>, variante: RegenerierenVariante): Record<string, unknown> {
  if (typeof inhalt.mdx !== 'string') return inhalt;
  if (variante === 'kuerzer') return { ...inhalt, mdx: inhalt.mdx.split('\n\n').slice(0, 2).join('\n\n') };
  if (variante === 'ausfuehrlicher') return { ...inhalt, mdx: `${inhalt.mdx}\n\nPraxischeck: Welche Kontrolle zeigt dir vor dem Start, ob der naechste Arbeitsschritt sicher ist?` };
  if (variante === 'praxisnaeher') return { ...inhalt, mdx: `${inhalt.mdx}\n\nPraxisbezug: Pruefe ein reales Teil, eine Zeichnung oder den aktuellen Maschinenzustand und notiere die Abweichung.` };
  return inhalt;
}

/**
 * Liefert ein kurzes Label fuer Regenerierungsvarianten.
 */
function variantenLabel(variante: RegenerierenVariante): string {
  const labels: Record<RegenerierenVariante, string> = {
    neu: 'neu',
    einfacher: 'einfacher',
    schwieriger: 'schwieriger',
    praxisnaeher: 'praxisnaeher',
    kuerzer: 'kuerzer',
    ausfuehrlicher: 'ausfuehrlicher',
  };
  return labels[variante];
}

/**
 * Erzeugt einen stabilen numerischen Seed aus Text.
 */
function variationSeed(clientId: string, variante: string): number {
  return [...`${clientId}-${variante}`].reduce((summe, zeichen) => summe + zeichen.charCodeAt(0), 0) % 97;
}

/**
 * Normalisiert Text fuer technische IDs.
 */
function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'content';
}
