'use server';

import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ContentTyp, Schwierigkeitsgrad } from '@bze/core/content';
import { ladeAdminSitzung } from '../../_lib/auth';
import { protokolliere } from '../../_lib/audit';
import { ladeGeneratorKonfiguration, pruefeGeneratorKonfiguration } from './_lib/config';
import { erstelleAIContentProvider } from './_lib/provider';
import { ladeRagKontext } from './_lib/retrieval';
import {
  GENERATOR_MAX_INHALTE,
  generatorPreviewSchema,
  generatorRegenerierenSchema,
  generatorRequestSchema,
  generatorSpeichernSchema,
  lernzieleGenerierenSchema,
  zaehleAngeforderteInhalte,
  type GeneratorContentItem,
  type GeneratorPreview,
  type GeneratorProvider,
  type GeneratorRequest,
  type LernzielVorschlag,
} from './_lib/schemas';

type AktionsErgebnis<T> = { ok: true; daten: T } | { ok: false; fehler: string };

const DEMO_LABEL = 'KI-generierter Beispielinhalt - nicht fachlich verifiziert';

/**
 * Generiert und speichert Demo-Lernziele fuer die gewaehlte Taxonomie.
 */
export async function lernzieleAutomatischGenerierenAction(input: unknown): Promise<AktionsErgebnis<{ lernziele: LernzielVorschlag[] }>> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  const configFehler = pruefeGeneratorKonfiguration();
  if (configFehler) return { ok: false, fehler: configFehler };
  const geprueft = lernzieleGenerierenSchema.safeParse(input);
  if (!geprueft.success) return { ok: false, fehler: 'ungueltige_eingabe' };

  const provider = erstelleAIContentProvider();
  const start = performance.now();
  let vorschlaege: LernzielVorschlag[];
  try {
    vorschlaege = await provider.generiereLernziele(geprueft.data);
  } catch (error) {
    const fehler = error instanceof Error ? error.message : 'lernziele_generierung_fehlgeschlagen';
    await protokolliereKiAufruf(sitzung.supabase, {
      traegerId: sitzung.profil.traeger_id,
      userId: sitzung.profil.id,
      funktion: `content_lernziele_${provider.anbieter}`,
      modell: provider.modell,
      erfolg: false,
      requestId: `lernziele-${Date.now()}`,
      inputTokens: schaetzeTokens(JSON.stringify(input)),
      latenzMs: Math.max(1, Math.round(performance.now() - start)),
      fehlertext: fehler,
    });
    return { ok: false, fehler };
  }
  const rows = vorschlaege.map((ziel) => ({
    traeger_id: sitzung.profil.traeger_id,
    pruefungsbereich_id: geprueft.data.fachbereichId,
    thema_id: geprueft.data.themaId,
    unterthema_id: geprueft.data.unterthemaId,
    titel: ziel.titel,
    beschreibung: ziel.beschreibung,
    schwierigkeitsgrad: ziel.schwierigkeitsgrad,
    status: 'generiert',
    ist_demo: true,
    demo_sichtbar: true,
    demo_label: DEMO_LABEL,
    fachlich_verifiziert: false,
    quellenart: provider.quelle,
    ki_anbieter: provider.anbieter,
    ki_modell: provider.modell,
    ki_metadaten: { provider: provider.anbieter, quelle: 'generator' },
    qualitaetswert: 0.72,
    qualitaetsmetadaten: { fachlich_verifiziert: false, hinweis: DEMO_LABEL },
  }));
  const { data, error } = await sitzung.supabase
    .from('lernziele')
    .insert(rows)
    .select('id, titel, beschreibung, schwierigkeitsgrad');
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };

  await protokolliere(sitzung.supabase, {
    akteurId: sitzung.profil.id,
    aktion: `content_lernziele_${provider.anbieter}_generiert`,
    zielTyp: 'lernziele',
    details: { anzahl: rows.length, unterthemaId: geprueft.data.unterthemaId },
  });
  await protokolliereKiAufruf(sitzung.supabase, {
    traegerId: sitzung.profil.traeger_id,
    userId: sitzung.profil.id,
    funktion: `content_lernziele_${provider.anbieter}`,
    modell: provider.modell,
    erfolg: true,
    requestId: `lernziele-${Date.now()}`,
    inputTokens: schaetzeTokens(JSON.stringify(input)),
    outputTokens: schaetzeTokens(JSON.stringify(data ?? [])),
    latenzMs: 1,
  });

  return {
    ok: true,
    daten: {
      lernziele: ((data ?? []) as Array<{ id: string; titel: string; beschreibung: string; schwierigkeitsgrad: Schwierigkeitsgrad }>).map((ziel) => ({
        clientId: ziel.id,
        titel: ziel.titel,
        beschreibung: ziel.beschreibung,
        schwierigkeitsgrad: ziel.schwierigkeitsgrad,
      })),
    },
  };
}

/**
 * Startet einen Generation-Job und speichert die validierte Preview serverseitig.
 */
export async function contentPreviewGenerierenAction(input: unknown): Promise<AktionsErgebnis<{ jobId: string; preview: GeneratorPreview }>> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  const configFehler = pruefeGeneratorKonfiguration();
  if (configFehler) return { ok: false, fehler: configFehler };
  const geprueft = generatorRequestSchema.safeParse(input);
  if (!geprueft.success) return { ok: false, fehler: 'ungueltige_eingabe' };
  const request = geprueft.data;
  const anzahl = zaehleAngeforderteInhalte(request);
  if (anzahl < 1) return { ok: false, fehler: 'mindestens_ein_inhalt_noetig' };
  if (anzahl > GENERATOR_MAX_INHALTE) return { ok: false, fehler: 'zu_viele_inhalte' };

  const rateLimitFehler = await pruefeRateLimit(sitzung.supabase, sitzung.profil.id);
  if (rateLimitFehler) return { ok: false, fehler: rateLimitFehler };

  const provider = erstelleAIContentProvider();
  const config = ladeGeneratorKonfiguration();
  const ragContext = await ladeRagKontext(sitzung.supabase, request, {
    ragEnabled: config.ragEnabled,
    sourceMode: config.contentSourceMode,
    topK: config.ragTopK,
    minSimilarity: config.ragMinSimilarity,
    mockRetrieval: config.ragMockRetrieval,
  });
  if (config.contentSourceMode === 'knowledge_base' && !ragContext.ausreichend) {
    return { ok: false, fehler: 'rag_kontext_unzureichend' };
  }
  const job = await erstelleJob(
    sitzung.supabase,
    sitzung.profil.traeger_id,
    sitzung.profil.id,
    request,
    provider.anbieter,
    provider.modell,
    config.contentSourceMode,
    ragContext.ragEnabled,
    ragContext,
  );
  if (!job.ok) return job;

  const start = performance.now();
  try {
    const preview = await provider.generiereContent(request, ragContext);
    const previewMitJob = generatorPreviewSchema.parse({ ...preview, jobId: job.daten.jobId });
    const latenzMs = Math.max(1, Math.round(performance.now() - start));
    const inputTokens = previewMitJob.usage?.inputTokens ?? schaetzeTokens(JSON.stringify(request));
    const outputTokens = previewMitJob.usage?.outputTokens ?? schaetzeTokens(JSON.stringify(previewMitJob));
    const { error } = await sitzung.supabase
      .from('content_generation_jobs')
      .update({
        status: 'abgeschlossen',
        preview_json: previewMitJob,
        rag_context_json: ragContext,
        rag_warnungen: ragContext.warnungen,
        latenz_ms: latenzMs,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
      })
      .eq('id', job.daten.jobId);
    if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };
    await protokolliereKiAufruf(sitzung.supabase, {
      traegerId: sitzung.profil.traeger_id,
      userId: sitzung.profil.id,
      funktion: `content_generator_${provider.anbieter}`,
      modell: provider.modell,
      erfolg: true,
      requestId: previewMitJob.usage?.requestId ?? job.daten.jobId,
      inputTokens,
      outputTokens,
      latenzMs,
    });
    await protokolliere(sitzung.supabase, {
      akteurId: sitzung.profil.id,
      aktion: `content_${provider.anbieter}_generiert`,
      zielTyp: 'content_generation_jobs',
      zielId: job.daten.jobId,
      details: { anzahl, unterthemaId: request.unterthemaId },
    });
    return { ok: true, daten: { jobId: job.daten.jobId, preview: previewMitJob } };
  } catch (error) {
    const fehler = error instanceof Error ? error.message : 'generation_fehlgeschlagen';
    await sitzung.supabase.from('content_generation_jobs').update({ status: 'fehlgeschlagen', fehlertext: fehler }).eq('id', job.daten.jobId);
    await protokolliereKiAufruf(sitzung.supabase, {
      traegerId: sitzung.profil.traeger_id,
      userId: sitzung.profil.id,
      funktion: `content_generator_${provider.anbieter}`,
      modell: provider.modell,
      erfolg: false,
      requestId: job.daten.jobId,
      fehlertext: fehler,
      latenzMs: Math.max(1, Math.round(performance.now() - start)),
    });
    return { ok: false, fehler };
  }
}

/**
 * Regeneriert ein einzelnes Preview-Element und aktualisiert den Job.
 */
export async function contentPreviewRegenerierenAction(input: unknown): Promise<AktionsErgebnis<{ preview: GeneratorPreview }>> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  const geprueft = generatorRegenerierenSchema.safeParse(input);
  if (!geprueft.success) return { ok: false, fehler: 'ungueltige_eingabe' };

  const geladen = await ladeJob(sitzung.supabase, geprueft.data.jobId);
  if (!geladen.ok) return geladen;
  const index = geladen.daten.preview.items.findIndex((item) => item.clientId === geprueft.data.clientId);
  if (index < 0) return { ok: false, fehler: 'content_nicht_gefunden' };
  const item = geladen.daten.preview.items[index];
  if (!item) return { ok: false, fehler: 'content_nicht_gefunden' };

  let provider: ReturnType<typeof erstelleAIContentProvider>;
  try {
    provider = erstelleAIContentProvider(geladen.daten.preview.provider);
  } catch (error) {
    return { ok: false, fehler: error instanceof Error ? error.message : 'provider_nicht_konfiguriert' };
  }
  const start = performance.now();
  let neu: GeneratorContentItem;
  try {
    neu = await provider.regeneriereContent(geladen.daten.request, item, geprueft.data.variante);
  } catch (error) {
    const fehler = error instanceof Error ? error.message : 'regenerierung_fehlgeschlagen';
    await protokolliereKiAufruf(sitzung.supabase, {
      traegerId: sitzung.profil.traeger_id,
      userId: sitzung.profil.id,
      funktion: `content_${provider.anbieter}_regenerieren_${geprueft.data.variante}`,
      modell: provider.modell,
      erfolg: false,
      requestId: geprueft.data.jobId,
      inputTokens: schaetzeTokens(JSON.stringify(item)),
      latenzMs: Math.max(1, Math.round(performance.now() - start)),
      fehlertext: fehler,
    });
    return { ok: false, fehler };
  }
  const preview = generatorPreviewSchema.parse({
    ...geladen.daten.preview,
    items: geladen.daten.preview.items.map((item, itemIndex) => (itemIndex === index ? neu : item)),
    erstelltAm: new Date().toISOString(),
  });
  const { error } = await sitzung.supabase
    .from('content_generation_jobs')
    .update({ preview_json: preview, status: 'abgeschlossen' })
    .eq('id', geprueft.data.jobId);
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };

  await protokolliereKiAufruf(sitzung.supabase, {
    traegerId: sitzung.profil.traeger_id,
    userId: sitzung.profil.id,
    funktion: `content_${provider.anbieter}_regenerieren_${geprueft.data.variante}`,
    modell: provider.modell,
    erfolg: true,
    requestId: geprueft.data.jobId,
    inputTokens: schaetzeTokens(JSON.stringify(item)),
    outputTokens: schaetzeTokens(JSON.stringify(neu)),
    latenzMs: 1,
  });

  return { ok: true, daten: { preview } };
}

/**
 * Speichert ausgewaehlte Preview-Elemente in die bestehenden Content-Tabellen.
 */
export async function contentPreviewSpeichernAction(input: unknown): Promise<AktionsErgebnis<{ contentIds: string[] }>> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  const geprueft = generatorSpeichernSchema.safeParse(input);
  if (!geprueft.success) return { ok: false, fehler: 'ungueltige_eingabe' };
  const geladen = await ladeJob(sitzung.supabase, geprueft.data.jobId);
  if (!geladen.ok) return geladen;

  const basisItems = geprueft.data.items ?? geladen.daten.preview.items;
  const auswahl = basisItems.filter((item) => geprueft.data.clientIds.includes(item.clientId));
  if (auswahl.length === 0) return { ok: false, fehler: 'keine_inhalte_ausgewaehlt' };

  const quelle = await erstelleQuelle(sitzung.supabase, sitzung.profil.traeger_id, geprueft.data.jobId, geladen.daten.preview);
  if (!quelle.ok) return quelle;

  const contentIds: string[] = [];
  for (const item of auswahl) {
    const gespeichert = await speichereContentItem(
      sitzung.supabase,
      sitzung.profil.traeger_id,
      sitzung.profil.id,
      geladen.daten.request,
      item,
      geprueft.data.jobId,
      quelle.daten.quelleId,
      geladen.daten.preview,
    );
    if (!gespeichert.ok) return gespeichert;
    contentIds.push(gespeichert.daten.contentId);
  }

  const status = contentIds.length === geladen.daten.preview.items.length ? 'gespeichert' : 'teilweise_gespeichert';
  await sitzung.supabase
    .from('content_generation_jobs')
    .update({ status, gespeicherte_content_ids: contentIds })
    .eq('id', geprueft.data.jobId);
  await protokolliere(sitzung.supabase, {
    akteurId: sitzung.profil.id,
    aktion: `content_${geladen.daten.preview.provider}_gespeichert`,
    zielTyp: 'content_generation_jobs',
    zielId: geprueft.data.jobId,
    details: { contentIds },
  });
  revalidatePath('/admin/content');
  revalidatePath('/campus/topic');
  return { ok: true, daten: { contentIds } };
}

/**
 * Verwirft einen Preview-Job ohne Content zu speichern.
 */
export async function contentGenerationJobVerwerfenAction(jobId: unknown): Promise<AktionsErgebnis<{ jobId: string }>> {
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return { ok: false, fehler: 'kein_zugriff' };
  const geprueft = typeof jobId === 'string' ? jobId : '';
  if (!/^[0-9a-f-]{36}$/i.test(geprueft)) return { ok: false, fehler: 'ungueltige_id' };
  const { error } = await sitzung.supabase.from('content_generation_jobs').update({ status: 'verworfen' }).eq('id', geprueft);
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };
  return { ok: true, daten: { jobId: geprueft } };
}

/**
 * Legt einen Generator-Job als laufend an.
 */
async function erstelleJob(
  supabase: SupabaseClient,
  traegerId: string,
  userId: string,
  request: GeneratorRequest,
  provider: GeneratorProvider,
  modell: string,
  sourceMode: string,
  ragEnabled: boolean,
  ragContext: GeneratorPreview['ragContext'],
): Promise<AktionsErgebnis<{ jobId: string }>> {
  const { data, error } = await supabase
    .from('content_generation_jobs')
    .insert({
      traeger_id: traegerId,
      user_id: userId,
      provider,
      modell,
      source_mode: sourceMode,
      rag_enabled: ragEnabled,
      rag_context_json: ragContext ?? {},
      rag_warnungen: ragContext?.warnungen ?? [],
      status: 'laeuft',
      request_json: request,
    })
    .select('id')
    .single();
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };
  return { ok: true, daten: { jobId: (data as { id: string }).id } };
}

/**
 * Laedt und validiert einen gespeicherten Generator-Job.
 */
async function ladeJob(
  supabase: SupabaseClient,
  jobId: string,
): Promise<AktionsErgebnis<{ request: GeneratorRequest; preview: GeneratorPreview }>> {
  const { data, error } = await supabase
    .from('content_generation_jobs')
    .select('request_json, preview_json')
    .eq('id', jobId)
    .maybeSingle();
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };
  if (!data) return { ok: false, fehler: 'job_nicht_gefunden' };
  return {
    ok: true,
    daten: {
      request: generatorRequestSchema.parse((data as { request_json: unknown }).request_json),
      preview: generatorPreviewSchema.parse((data as { preview_json: unknown }).preview_json),
    },
  };
}

/**
 * Prueft einfache Rate-Limits pro Admin-Nutzer.
 */
async function pruefeRateLimit(supabase: SupabaseClient, userId: string): Promise<string | null> {
  const seit = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from('content_generation_jobs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', seit);
  if (error) return deuteFehler(error.code, error.message);
  return (count ?? 0) >= 5 ? 'rate_limit_erreicht' : null;
}

/**
 * Legt die Content-Quelle passend zum Preview-Provider an.
 */
async function erstelleQuelle(
  supabase: SupabaseClient,
  traegerId: string,
  jobId: string,
  preview: GeneratorPreview,
): Promise<AktionsErgebnis<{ quelleId: string }>> {
  const { data, error } = await supabase
    .from('content_quellen')
    .insert({
      traeger_id: traegerId,
      titel: preview.provider === 'mock_ai' ? 'Mock-Content-Generator' : 'KI-Content-Generator',
      beschreibung: DEMO_LABEL,
      quellenart: preview.quelle,
      referenz: jobId,
      ist_demo: true,
      demo_sichtbar: true,
      fachlich_verifiziert: false,
    })
    .select('id')
    .single();
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };
  return { ok: true, daten: { quelleId: (data as { id: string }).id } };
}

/**
 * Speichert ein validiertes Preview-Element in die vorhandene Fachkunde-/Fragenstruktur.
 */
async function speichereContentItem(
  supabase: SupabaseClient,
  traegerId: string,
  userId: string,
  request: GeneratorRequest,
  item: GeneratorContentItem,
  jobId: string,
  quelleId: string,
  preview: GeneratorPreview,
): Promise<AktionsErgebnis<{ contentId: string }>> {
  let frageId: string | null = null;
  try {
    frageId = istFragetyp(item.content_typ)
      ? await speichereFrage(supabase, userId, request.unterthemaId, item, jobId, preview)
      : null;
  } catch (error) {
    return { ok: false, fehler: error instanceof Error ? error.message : 'frage_speichern_fehlgeschlagen' };
  }
  const common = {
    traeger_id: traegerId,
    titel: item.titel,
    beschreibung: item.beschreibung,
    content_typ: item.content_typ,
    pruefungsbereich_id: request.fachbereichId,
    thema_id: request.themaId,
    unterthema_id: request.unterthemaId,
    frage_id: frageId,
    inhalt: item.inhalt,
    schwierigkeitsgrad: item.schwierigkeitsgrad,
    status: 'generiert',
    ist_demo: true,
    demo_sichtbar: true,
    demo_label: DEMO_LABEL,
    fachlich_verifiziert: false,
      quellenart: preview.quelle,
      ki_anbieter: preview.provider,
      ki_modell: preview.modell,
      ki_metadaten: {
        job_id: jobId,
        client_id: item.clientId,
        provider: preview.provider,
        source_mode: preview.sourceMode,
        rag_enabled: preview.ragEnabled,
        rag_warnungen: preview.ragContext?.warnungen ?? [],
        verwendete_chunk_ids: preview.ragContext?.verwendeteChunkIds ?? [],
      },
      qualitaetswert: item.qualitaetswert,
      qualitaetsmetadaten: {
        fachlich_verifiziert: false,
        hinweise: item.hinweise,
        qualitaetsstatus: item.qualitaetswert >= 0.8 ? 'gute_qualitaet' : item.qualitaetswert >= 0.6 ? 'pruefen' : 'problematisch',
      },
      source_mode: preview.sourceMode,
      rag_chunk_ids: preview.ragContext?.verwendeteChunkIds ?? [],
      rag_context_metadaten: preview.ragContext ?? {},
      erstellt_von: userId,
  };
  const { data, error } = await supabase.from('content_elemente').insert(common).select('id').single();
  if (error) return { ok: false, fehler: deuteFehler(error.code, error.message) };
  const contentId = (data as { id: string }).id;

  if (item.content_typ === 'lernkarte') {
    const { error: kartenFehler } = await supabase.from('lernkarten').insert({
      content_element_id: contentId,
      vorderseite: textAus(item.inhalt.vorderseite),
      rueckseite: textAus(item.inhalt.rueckseite),
      merksatz: textAus(item.inhalt.merksatz) || null,
    });
    if (kartenFehler) return { ok: false, fehler: deuteFehler(kartenFehler.code, kartenFehler.message) };
  }

  await verknuepfeLernziele(supabase, contentId, item.lernzielIds);
  await supabase.from('content_element_quellen').insert({
    content_element_id: contentId,
    quelle_id: quelleId,
    fundstelle: {
      art: 'content-generator',
      provider: preview.provider,
      job_id: jobId,
      client_id: item.clientId,
      source_mode: preview.sourceMode,
      rag_chunk_ids: preview.ragContext?.verwendeteChunkIds ?? [],
      dokumente: preview.ragContext?.dokumente ?? [],
      warnungen: preview.ragContext?.warnungen ?? [],
    },
  });
  await verknuepfeRagQuellen(supabase, traegerId, contentId, preview);
  return { ok: true, daten: { contentId } };
}

/**
 * Speichert ein Frage-Preview-Element in der bestehenden Fragenlogik.
 */
async function speichereFrage(
  supabase: SupabaseClient,
  userId: string,
  themaId: string,
  item: GeneratorContentItem,
  jobId: string,
  preview: GeneratorPreview,
): Promise<string | null> {
  const { data, error } = await supabase
    .from('fragen')
    .insert({
      thema_id: themaId,
      typ: item.content_typ === 'freitext' ? 'freitext' : 'mc',
      aufgabenstellung: textAus(item.inhalt.aufgabenstellung, item.titel),
      schwierigkeit: schwierigkeitZahl(item.schwierigkeitsgrad),
      status: 'entwurf',
      kern: item.content_typ === 'pruefungsnahe_uebungsfrage',
      ki_generiert: true,
      enthaelt_zahlenwert: item.content_typ === 'rechenaufgabe',
      erstellt_von: userId,
      beschreibung: item.beschreibung,
      content_typ: item.content_typ,
      schwierigkeitsgrad: item.schwierigkeitsgrad,
      content_status: 'generiert',
      ist_demo: true,
      demo_sichtbar: true,
      demo_label: DEMO_LABEL,
      fachlich_verifiziert: false,
      quellenart: preview.quelle,
      ki_anbieter: preview.provider,
      ki_modell: preview.modell,
      ki_metadaten: {
        job_id: jobId,
        client_id: item.clientId,
        provider: preview.provider,
        source_mode: preview.sourceMode,
        rag_enabled: preview.ragEnabled,
        rag_warnungen: preview.ragContext?.warnungen ?? [],
        verwendete_chunk_ids: preview.ragContext?.verwendeteChunkIds ?? [],
      },
      qualitaetswert: item.qualitaetswert,
      qualitaetsmetadaten: { fachlich_verifiziert: false, hinweise: item.hinweise },
      source_mode: preview.sourceMode,
      rag_chunk_ids: preview.ragContext?.verwendeteChunkIds ?? [],
      rag_context_metadaten: preview.ragContext ?? {},
    })
    .select('id')
    .single();
  if (error) throw new Error(deuteFehler(error.code, error.message));
  const frageId = (data as { id: string }).id;

  if (item.content_typ === 'freitext') {
    const { error: freitextFehler } = await supabase.from('freitext_loesungen').insert({
      frage_id: frageId,
      musterloesung: item.musterloesung ?? 'Musterloesung fachlich pruefen.',
      bewertungsraster: item.bewertungsraster,
      max_punkte: 4,
    });
    if (freitextFehler) throw new Error(deuteFehler(freitextFehler.code, freitextFehler.message));
    return frageId;
  }

  const optionen = item.antwortoptionen.map((option, index) => ({
    frage_id: frageId,
    text: option.text,
    ist_korrekt: option.ist_korrekt,
    erklaerung: option.erklaerung,
    reihenfolge: index + 1,
  }));
  const { error: optionenFehler } = await supabase.from('antwortoptionen').insert(optionen);
  if (optionenFehler) throw new Error(deuteFehler(optionenFehler.code, optionenFehler.message));
  return frageId;
}

/**
 * Verknuepft Content mit vorhandenen Lernzielen.
 */
async function verknuepfeLernziele(supabase: SupabaseClient, contentId: string, lernzielIds: string[]): Promise<void> {
  if (lernzielIds.length === 0) return;
  await supabase.from('content_element_lernziele').insert(
    [...new Set(lernzielIds)].map((lernzielId) => ({
      content_element_id: contentId,
      lernziel_id: lernzielId,
    })),
  );
}

/**
 * Verknuepft die tatsaechlich verwendeten Wissensdatenbank-Dokumente mit dem Content.
 */
async function verknuepfeRagQuellen(
  supabase: SupabaseClient,
  traegerId: string,
  contentId: string,
  preview: GeneratorPreview,
): Promise<void> {
  const ragContext = preview.ragContext;
  if (!ragContext?.ragEnabled || ragContext.chunks.length === 0) return;
  for (const dokument of ragContext.dokumente) {
    const dokumentChunks = ragContext.chunks.filter((chunk) => chunk.quelldokumentId === dokument.id);
    const { data, error } = await supabase
      .from('content_quellen')
      .insert({
        traeger_id: traegerId,
        titel: dokument.titel,
        beschreibung: `Wissensdatenbank-Quelle fuer ${preview.sourceMode}.`,
        quellenart: quellenartFuerWissensTyp(dokument.quelleTyp),
        quelldokument_id: dokument.id,
        referenz: dokument.id,
        ist_demo: true,
        demo_sichtbar: false,
        fachlich_verifiziert: false,
      })
      .select('id')
      .single();
    if (error) throw new Error(deuteFehler(error.code, error.message));
    await supabase.from('content_element_quellen').insert({
      content_element_id: contentId,
      quelle_id: (data as { id: string }).id,
      fundstelle: {
        art: 'wissensdatenbank',
        source_mode: preview.sourceMode,
        chunks: dokumentChunks.map((chunk) => ({
          chunk_id: chunk.chunkId,
          chunk_index: chunk.chunkIndex,
          similarity: chunk.similarity,
          quellenreferenz: chunk.quellenreferenz,
        })),
      },
    });
  }
}

/**
 * Mappt Wissensquellentypen auf bestehende Content-Quellenarten.
 */
function quellenartFuerWissensTyp(typ: string): 'traegerskript' | 'web' | 'unbekannt' {
  if (typ === 'url') return 'web';
  if (['pdf', 'docx', 'markdown', 'text', 'manueller_fachtext'].includes(typ)) return 'traegerskript';
  return 'unbekannt';
}

/**
 * Protokolliert Generator-KI-Aufrufe in der bestehenden Tabelle.
 */
async function protokolliereKiAufruf(
  supabase: SupabaseClient,
  eintrag: {
    traegerId: string;
    userId: string;
    funktion: string;
    modell: string;
    erfolg: boolean;
    requestId: string;
    inputTokens?: number;
    outputTokens?: number;
    latenzMs?: number;
    fehlertext?: string;
  },
): Promise<void> {
  await supabase.from('ki_aufrufe').insert({
    traeger_id: eintrag.traegerId,
    user_id: eintrag.userId,
    funktion: eintrag.funktion,
    modell: eintrag.modell,
    input_tokens: eintrag.inputTokens ?? 0,
    output_tokens: eintrag.outputTokens ?? 0,
    kosten_eur: 0,
    latenz_ms: eintrag.latenzMs ?? 0,
    erfolg: eintrag.erfolg,
    fehlertext: eintrag.fehlertext ?? null,
    request_id: eintrag.requestId,
  });
}

/**
 * Schaetzt Token grob, wenn der Provider keine Usage liefert.
 */
function schaetzeTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

/**
 * Mappt Content-Schwierigkeit auf die bestehende Fragen-Skala.
 */
function schwierigkeitZahl(schwierigkeit: Schwierigkeitsgrad): number {
  if (schwierigkeit === 'einfach') return 1;
  if (schwierigkeit === 'schwer') return 3;
  return 2;
}

/**
 * Erkennt Frage-Content-Typen.
 */
function istFragetyp(typ: ContentTyp): boolean {
  return ['single_choice', 'multiple_choice', 'freitext', 'pruefungsnahe_uebungsfrage'].includes(typ);
}

/**
 * Normalisiert unbekannte Inhalte zu Text.
 */
function textAus(wert: unknown, fallback = ''): string {
  return typeof wert === 'string' && wert.trim().length > 0 ? wert.trim() : fallback;
}

/**
 * Uebersetzt Datenbankfehler in UI-nahe Codes.
 */
function deuteFehler(code: string | undefined, meldung: string): string {
  if (code === '42501') return 'kein_zugriff';
  return meldung || 'fehler';
}
