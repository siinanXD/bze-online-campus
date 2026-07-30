import {
  CONTENT_SOURCE_MODES,
  normalisiereRagMinSimilarity,
  normalisiereRagTopK,
  type ContentSourceMode,
} from '@bze/core/content';

export type GeneratorKonfiguration = {
  aiMockMode: boolean;
  contentSourceMode: ContentSourceMode;
  ragEnabled: boolean;
  ragTopK: number;
  ragMinSimilarity: number;
  ragMockRetrieval: boolean;
  provider: 'mock_ai' | 'llm';
  llmConfigured: boolean;
  modell: string;
};

const DEFAULT_LLM_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_LLM_MODELL = 'gpt-4o-mini';

/**
 * Liest die bewusst kleine Generator-Konfiguration aus der Server-Umgebung.
 */
export function ladeGeneratorKonfiguration(): GeneratorKonfiguration {
  const aiMockMode = process.env.AI_MOCK_MODE === 'true';
  const rawSourceMode = process.env.CONTENT_SOURCE_MODE ?? 'generated';
  const contentSourceMode = CONTENT_SOURCE_MODES.includes(rawSourceMode as ContentSourceMode)
    ? rawSourceMode as ContentSourceMode
    : 'generated';
  const modell = aiMockMode
    ? 'mock-content-v1'
    : (process.env.LLM_MODELL?.trim() || DEFAULT_LLM_MODELL);
  return {
    aiMockMode,
    contentSourceMode,
    ragEnabled: process.env.RAG_ENABLED === 'true',
    ragTopK: normalisiereRagTopK(process.env.RAG_TOP_K),
    ragMinSimilarity: normalisiereRagMinSimilarity(process.env.RAG_MIN_SIMILARITY),
    ragMockRetrieval: process.env.RAG_MOCK_RETRIEVAL !== 'false',
    provider: aiMockMode ? 'mock_ai' : 'llm',
    llmConfigured: Boolean(process.env.LLM_API_KEY?.trim()),
    modell,
  };
}

/**
 * Liefert die serverseitigen LLM-Einstellungen fuer den echten Provider.
 */
export function ladeLLMProviderKonfiguration(): {
  apiKey: string;
  baseUrl: string;
  modell: string;
} {
  return {
    apiKey: process.env.LLM_API_KEY?.trim() ?? '',
    baseUrl: (process.env.LLM_BASE_URL?.trim() || DEFAULT_LLM_BASE_URL).replace(/\/$/, ''),
    modell: process.env.LLM_MODELL?.trim() || DEFAULT_LLM_MODELL,
  };
}

/**
 * Validiert die Generator-Konfiguration ohne stillen Wechsel des Providers.
 */
export function pruefeGeneratorKonfiguration(): string | null {
  const config = ladeGeneratorKonfiguration();
  if (!CONTENT_SOURCE_MODES.includes(config.contentSourceMode)) return 'CONTENT_SOURCE_MODE ist ungueltig.';
  if (config.contentSourceMode !== 'generated' && !config.ragEnabled) {
    return 'RAG_ENABLED muss fuer knowledge_base oder hybrid true sein.';
  }
  if (!config.aiMockMode && !config.llmConfigured) {
    return 'LLM_API_KEY fehlt. Setze AI_MOCK_MODE=true fuer den Mock-Modus oder konfiguriere einen LLM-Anbieter.';
  }
  return null;
}

/**
 * Rueckwaertskompatibler Alias fuer bestehende Tests und Aufrufer.
 */
export const pruefeMockKonfiguration = pruefeGeneratorKonfiguration;
