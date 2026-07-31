import type { WissensIndexStatus, WissensdokumentStatus, WissensquelleTyp } from '@bze/core/content';

export type WissensdokumentZeile = {
  id: string;
  traeger_id: string;
  titel: string;
  beschreibung: string | null;
  dateiname: string;
  storage_pfad: string | null;
  quelle_typ: WissensquelleTyp;
  dokument_status: WissensdokumentStatus;
  index_status: WissensIndexStatus;
  aktiv: boolean;
  mime_type: string | null;
  dateigroesse_bytes: number | null;
  chunk_anzahl: number;
  embedding_mock: boolean;
  verarbeitet_am: string | null;
  created_at: string;
  updated_at: string;
};

export type WissensChunkAnsicht = {
  id: string;
  quelldokument_id: string;
  chunk_index: number;
  inhalt: string;
  token_schaetzung: number;
  text_hash: string;
  embedding_metadaten: Record<string, unknown>;
  quellenreferenz: Record<string, unknown>;
  aktiv: boolean;
  created_at: string;
};

export type WissensFehlerAnsicht = {
  id: string;
  quelldokument_id: string | null;
  phase: string;
  fehlercode: string;
  meldung: string;
  details: Record<string, unknown>;
  created_at: string;
};

export type WissensdokumentDetail = WissensdokumentZeile & {
  rohtext: string | null;
  bereinigter_text: string | null;
  verarbeitungsmetadaten: Record<string, unknown>;
  chunks: WissensChunkAnsicht[];
  fehler: WissensFehlerAnsicht[];
};

export type PaginierteWissensdokumentListe = {
  eintraege: WissensdokumentZeile[];
  gesamt: number;
  seite: number;
  proSeite: number;
  seiten: number;
};
