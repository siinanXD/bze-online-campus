'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Alert, Badge, Button, Checkbox, Input, Progress, Select, Textarea } from '@bze/ui';
import type { ContentTyp, Schwierigkeitsgrad } from '@bze/core/content';
import { contentKonstanten } from '../_lib/schemas';
import type { FachbereichOption, LernzielOption, TaxonomieOption } from '../_lib/types';
import {
  contentGenerationJobVerwerfenAction,
  contentPreviewGenerierenAction,
  contentPreviewRegenerierenAction,
  contentPreviewSpeichernAction,
  lernzieleAutomatischGenerierenAction,
} from './actions';
import type { GeneratorContentItem, GeneratorPreview } from './_lib/schemas';
import type { GeneratorKonfiguration } from './_lib/config';

type GeneratorOptionen = {
  fachbereiche: FachbereichOption[];
  themen: TaxonomieOption[];
  lernziele: LernzielOption[];
};

type Phase = 'idle' | 'ziele' | 'generieren' | 'preview' | 'speichern' | 'fertig';

/**
 * Interaktive Generator-UI fuer den vollstaendigen Mock-Ablauf.
 */
export function MockGeneratorClient({
  optionen,
  config,
}: {
  optionen: GeneratorOptionen;
  config: GeneratorKonfiguration;
}) {
  const t = useTranslations('admin.content');
  const locale = useLocale();
  const [pending, startTransition] = useTransition();
  const [phase, setPhase] = useState<Phase>('idle');
  const [meldung, setMeldung] = useState<string | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [fachbereichId, setFachbereichId] = useState(optionen.fachbereiche[0]?.id ?? '');
  const [themaId, setThemaId] = useState('');
  const [unterthemaId, setUnterthemaId] = useState('');
  const [lernziele, setLernziele] = useState<LernzielOption[]>(optionen.lernziele);
  const [lernzielIds, setLernzielIds] = useState<Set<string>>(new Set());
  const [contentTypen, setContentTypen] = useState<Set<ContentTyp>>(new Set(['erklaerung', 'lernkarte', 'single_choice']));
  const [schwierigkeiten, setSchwierigkeiten] = useState<Set<Schwierigkeitsgrad>>(new Set(['einfach', 'mittel']));
  const [anzahlProTyp, setAnzahlProTyp] = useState<Record<ContentTyp, number>>(
    Object.fromEntries(contentKonstanten.typen.map((typ) => [typ, typ === 'erklaerung' ? 1 : 0])) as Record<ContentTyp, number>,
  );
  const [fehlerSimulation, setFehlerSimulation] = useState('keine');
  const [preview, setPreview] = useState<GeneratorPreview | null>(null);
  const [auswahl, setAuswahl] = useState<Set<string>>(new Set());
  const [gespeicherteIds, setGespeicherteIds] = useState<string[]>([]);

  const themen = useMemo(
    () => optionen.themen.filter((thema) => thema.pruefungsbereich_id === fachbereichId && thema.parent_id === null),
    [fachbereichId, optionen.themen],
  );
  const unterthemen = useMemo(
    () => optionen.themen.filter((thema) => thema.parent_id === themaId),
    [optionen.themen, themaId],
  );
  const sichtbareLernziele = useMemo(
    () => lernziele.filter((ziel) => ziel.unterthema_id === unterthemaId || (!ziel.unterthema_id && ziel.thema_id === themaId)),
    [lernziele, themaId, unterthemaId],
  );
  const fachbereich = optionen.fachbereiche.find((eintrag) => eintrag.id === fachbereichId);
  const thema = optionen.themen.find((eintrag) => eintrag.id === themaId);
  const unterthema = optionen.themen.find((eintrag) => eintrag.id === unterthemaId);
  const progress = phase === 'idle' ? 10 : phase === 'ziele' ? 25 : phase === 'generieren' ? 55 : phase === 'preview' ? 75 : phase === 'speichern' ? 90 : 100;
  const providerBereit = config.provider === 'mock_ai' || config.llmConfigured;

  function setzeThema(id: string) {
    setThemaId(id);
    setUnterthemaId('');
    setLernzielIds(new Set());
  }

  function toggleSet<T>(set: Set<T>, value: T, update: (neu: Set<T>) => void) {
    const neu = new Set(set);
    if (neu.has(value)) neu.delete(value);
    else neu.add(value);
    update(neu);
  }

  function generiereLernziele() {
    if (!fachbereich || !thema || !unterthema) {
      setFehler(t('generator.fehler.taxonomie'));
      return;
    }
    setPhase('ziele');
    setFehler(null);
    setMeldung(null);
    startTransition(async () => {
      const ergebnis = await lernzieleAutomatischGenerierenAction({
        fachbereichId,
        fachbereichName: fachbereich.bezeichnung,
        themaId,
        themaName: thema.bezeichnung,
        unterthemaId,
        unterthemaName: unterthema.bezeichnung,
        schwierigkeit: 'mittel',
      });
      if (!ergebnis.ok) {
        setFehler(t('fehler.aktion', { fehler: ergebnis.fehler }));
        setPhase('idle');
        return;
      }
      const neue = ergebnis.daten.lernziele.map((ziel) => ({
        id: ziel.clientId,
        titel: ziel.titel,
        beschreibung: ziel.beschreibung,
        pruefungsbereich_id: fachbereichId,
        thema_id: themaId,
        unterthema_id: unterthemaId,
        schwierigkeitsgrad: ziel.schwierigkeitsgrad,
      }));
      setLernziele((alt) => [...neue, ...alt]);
      setLernzielIds(new Set(neue.map((ziel) => ziel.id)));
      setMeldung(t('generator.meldungen.lernziele'));
      setPhase('idle');
    });
  }

  function generieren() {
    if (!fachbereich || !thema || !unterthema) {
      setFehler(t('generator.fehler.taxonomie'));
      return;
    }
    setPhase('generieren');
    setFehler(null);
    setMeldung(null);
    startTransition(async () => {
      const ergebnis = await contentPreviewGenerierenAction({
        fachbereichId,
        fachbereichName: fachbereich.bezeichnung,
        themaId,
        themaName: thema.bezeichnung,
        unterthemaId,
        unterthemaName: unterthema.bezeichnung,
        lernzielIds: [...lernzielIds],
        lernziele: sichtbareLernziele.filter((ziel) => lernzielIds.has(ziel.id)).map((ziel) => ziel.titel),
        contentTypen: [...contentTypen],
        schwierigkeitsgrade: [...schwierigkeiten],
        anzahlProTyp,
        fehlerSimulation,
      });
      if (!ergebnis.ok) {
        setFehler(t('fehler.aktion', { fehler: ergebnis.fehler }));
        setPhase('idle');
        return;
      }
      setPreview(ergebnis.daten.preview);
      setAuswahl(new Set(ergebnis.daten.preview.items.map((item) => item.clientId)));
      setGespeicherteIds([]);
      setPhase('preview');
    });
  }

  function speichern() {
    if (!preview) return;
    setPhase('speichern');
    setFehler(null);
    setMeldung(null);
    startTransition(async () => {
      const ergebnis = await contentPreviewSpeichernAction({
        jobId: preview.jobId,
        clientIds: [...auswahl],
        items: preview.items,
      });
      if (!ergebnis.ok) {
        setFehler(t('fehler.aktion', { fehler: ergebnis.fehler }));
        setPhase('preview');
        return;
      }
      setGespeicherteIds(ergebnis.daten.contentIds);
      setMeldung(t('generator.meldungen.gespeichert', { anzahl: ergebnis.daten.contentIds.length }));
      setPhase('fertig');
    });
  }

  function verwerfen() {
    if (!preview?.jobId) return;
    startTransition(async () => {
      await contentGenerationJobVerwerfenAction(preview.jobId);
      setPreview(null);
      setAuswahl(new Set());
      setMeldung(t('generator.meldungen.verworfen'));
      setPhase('idle');
    });
  }

  function regenerieren(clientId: string, variante: 'neu' | 'einfacher' | 'schwieriger' | 'praxisnaeher' | 'kuerzer' | 'ausfuehrlicher') {
    if (!preview?.jobId) return;
    setFehler(null);
    startTransition(async () => {
      const ergebnis = await contentPreviewRegenerierenAction({ jobId: preview.jobId, clientId, variante });
      if (!ergebnis.ok) {
        setFehler(t('fehler.aktion', { fehler: ergebnis.fehler }));
        return;
      }
      setPreview(ergebnis.daten.preview);
    });
  }

  function aktualisiereItem(clientId: string, update: Partial<GeneratorContentItem>) {
    if (!preview) return;
    setPreview({
      ...preview,
      items: preview.items.map((item) => (item.clientId === clientId ? { ...item, ...update } : item)),
    });
  }

  function aktualisiereInhalt(clientId: string, json: string) {
    try {
      aktualisiereItem(clientId, { inhalt: JSON.parse(json) });
      setFehler(null);
    } catch {
      setFehler(t('generator.fehler.json'));
    }
  }

  return (
    <div className="space-y-5" data-testid="mock-generator">
      {meldung && <p role="status" className="rounded-lg border border-status-fertig/40 px-3 py-2 text-sm font-semibold text-status-fertig">{meldung}</p>}
      {fehler && <p role="alert" className="rounded-lg border border-status-falsch/40 px-3 py-2 text-sm font-semibold text-status-falsch">{fehler}</p>}

      <Alert variante={providerBereit ? 'success' : 'warning'} titel={t('generator.konfiguration.titel')}>
        {t('generator.konfiguration.text', {
          aiMockMode: String(config.aiMockMode),
          sourceMode: config.contentSourceMode,
          ragEnabled: String(config.ragEnabled),
          provider: config.provider,
          modell: config.modell,
          llmConfigured: String(config.llmConfigured),
        })}
      </Alert>

      <Progress wert={progress} label={t('generator.progress.label')} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
        <section className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Feld label={t('generator.felder.fachbereich')}>
              <Select value={fachbereichId} onChange={(event) => setFachbereichId(event.currentTarget.value)}>
                {optionen.fachbereiche.map((eintrag) => <option key={eintrag.id} value={eintrag.id}>{eintrag.bezeichnung}</option>)}
              </Select>
            </Feld>
            <Feld label={t('generator.felder.thema')}>
              <Select value={themaId} onChange={(event) => setzeThema(event.currentTarget.value)}>
                <option value="">{t('filter.alle')}</option>
                {themen.map((eintrag) => <option key={eintrag.id} value={eintrag.id}>{eintrag.bezeichnung}</option>)}
              </Select>
            </Feld>
            <Feld label={t('generator.felder.unterthema')}>
              <Select value={unterthemaId} onChange={(event) => setUnterthemaId(event.currentTarget.value)}>
                <option value="">{t('filter.alle')}</option>
                {unterthemen.map((eintrag) => <option key={eintrag.id} value={eintrag.id}>{eintrag.bezeichnung}</option>)}
              </Select>
            </Feld>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AuswahlGruppe titel={t('generator.felder.lernziele')} hinweis={t('generator.hinweise.lernziele')}>
              <div className="max-h-72 space-y-2 overflow-auto pr-1">
                {sichtbareLernziele.length === 0 ? (
                  <p className="text-sm text-fg-muted">{t('generator.leer.lernziele')}</p>
                ) : sichtbareLernziele.map((ziel) => (
                  <Checkbox
                    key={ziel.id}
                    label={ziel.titel}
                    hinweis={ziel.beschreibung ?? undefined}
                    checked={lernzielIds.has(ziel.id)}
                    onChange={() => toggleSet(lernzielIds, ziel.id, setLernzielIds)}
                  />
                ))}
              </div>
              <Button type="button" variante="sekundaer" disabled={pending || !unterthemaId} onClick={generiereLernziele}>
                {t('generator.aktionen.lernzieleGenerieren')}
              </Button>
            </AuswahlGruppe>

            <AuswahlGruppe titel={t('generator.felder.contentTypen')} hinweis={t('generator.hinweise.contentTypen')}>
              <div className="grid gap-2 sm:grid-cols-2">
                {contentKonstanten.typen.map((typ) => (
                  <Checkbox
                    key={typ}
                    label={t(`typen.${typ}`)}
                    checked={contentTypen.has(typ)}
                    onChange={() => toggleSet(contentTypen, typ, setContentTypen)}
                  />
                ))}
              </div>
            </AuswahlGruppe>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AuswahlGruppe titel={t('generator.felder.schwierigkeiten')} hinweis={t('generator.hinweise.schwierigkeiten')}>
              {contentKonstanten.schwierigkeitsgrade.map((grad) => (
                <Checkbox
                  key={grad}
                  label={t(`schwierigkeit.${grad}`)}
                  checked={schwierigkeiten.has(grad)}
                  onChange={() => toggleSet(schwierigkeiten, grad, setSchwierigkeiten)}
                />
              ))}
            </AuswahlGruppe>
            <AuswahlGruppe titel={t('generator.felder.anzahl')} hinweis={t('generator.hinweise.anzahl')}>
              <div className="grid gap-2 sm:grid-cols-2">
                {[...contentTypen].map((typ) => (
                  <label key={typ} className="space-y-1">
                    <span className="text-xs font-semibold text-fg-muted">{t(`typen.${typ}`)}</span>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      value={anzahlProTyp[typ] ?? 0}
                      onChange={(event) => setAnzahlProTyp((alt) => ({ ...alt, [typ]: Number(event.currentTarget.value) }))}
                    />
                  </label>
                ))}
              </div>
            </AuswahlGruppe>
          </div>
        </section>

        <aside className="space-y-3">
          <div className="rounded-lg border border-border bg-bg p-3">
            <h3 className="text-sm font-bold">{t('generator.quelle.titel')}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variante="info">{config.provider === 'mock_ai' ? 'mock_ai' : 'ki'}</Badge>
              <Badge variante={config.provider === 'mock_ai' || config.llmConfigured ? 'neutral' : 'warning'}>{config.modell}</Badge>
              <Badge variante="warning">{t('badges.demo')}</Badge>
              <Badge variante={config.ragEnabled ? 'info' : 'neutral'}>RAG={String(config.ragEnabled)}</Badge>
              <Badge variante="neutral">{config.contentSourceMode}</Badge>
            </div>
            {config.ragEnabled && (
              <p className="mt-2 text-xs text-fg-muted">
                Retrieval: Top {config.ragTopK}, Mindest-Aehnlichkeit {Math.round(config.ragMinSimilarity * 100)} %, Mock={String(config.ragMockRetrieval)}
              </p>
            )}
            <p className="mt-2 text-sm text-fg-muted">{t('generator.quelle.text')}</p>
          </div>
          <Feld label={t('generator.felder.fehlerSimulation')}>
            <Select value={fehlerSimulation} onChange={(event) => setFehlerSimulation(event.currentTarget.value)}>
              <option value="keine">{t('generator.fehlerSimulation.keine')}</option>
              <option value="provider_fehler">{t('generator.fehlerSimulation.provider')}</option>
              <option value="validierung_fehler">{t('generator.fehlerSimulation.validierung')}</option>
            </Select>
          </Feld>
          <Button type="button" volleBreite laedt={pending && phase === 'generieren'} disabled={pending || !providerBereit} onClick={generieren}>
            {t('generator.aktionen.generieren')}
          </Button>
        </aside>
      </div>

      {preview && (
        <section className="space-y-3" data-testid="generator-preview">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold">{t('generator.preview.titel')}</h3>
              <p className="text-sm text-fg-muted">{t('generator.preview.hinweis')}</p>
              {preview.ragContext && (
                <div className="mt-2 space-y-1 text-sm text-fg-muted">
                  <p>
                    Quellenmodus: <span className="font-semibold text-fg">{preview.sourceMode}</span>
                    {' '}· Chunks: {preview.ragContext.verwendeteChunkIds.length}
                    {' '}· Dokumente: {preview.ragContext.dokumente.length}
                  </p>
                  {preview.ragContext.warnungen.length > 0 && (
                    <ul className="list-disc pl-5">
                      {preview.ragContext.warnungen.map((warnung) => <li key={warnung}>{warnung}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variante="sekundaer" disabled={pending || auswahl.size === 0} onClick={speichern}>
                {t('generator.aktionen.speichern')}
              </Button>
              <Button type="button" variante="leise" disabled={pending} onClick={verwerfen}>
                {t('generator.aktionen.verwerfen')}
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            {preview.items.map((item) => (
              <article key={item.clientId} className="rounded-lg border border-border bg-bg p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <Checkbox
                    label={item.titel}
                    hinweis={`${t(`typen.${item.content_typ}`)} / ${t(`schwierigkeit.${item.schwierigkeitsgrad}`)}`}
                    checked={auswahl.has(item.clientId)}
                    onChange={() => toggleSet(auswahl, item.clientId, setAuswahl)}
                  />
                  <div className="flex flex-wrap gap-1">
                    <Badge variante="warning">{preview.quelle}</Badge>
                    <Badge variante="neutral">{Math.round(item.qualitaetswert * 100)} %</Badge>
                  </div>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-fg-muted">{t('felder.titel')}</span>
                    <Input value={item.titel} onChange={(event) => aktualisiereItem(item.clientId, { titel: event.currentTarget.value })} />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-fg-muted">{t('filter.schwierigkeit')}</span>
                    <Select
                      value={item.schwierigkeitsgrad}
                      onChange={(event) => aktualisiereItem(item.clientId, { schwierigkeitsgrad: event.currentTarget.value as Schwierigkeitsgrad })}
                    >
                      {contentKonstanten.schwierigkeitsgrade.map((grad) => <option key={grad} value={grad}>{t(`schwierigkeit.${grad}`)}</option>)}
                    </Select>
                  </label>
                  <label className="space-y-1 md:col-span-2">
                    <span className="text-xs font-semibold text-fg-muted">{t('felder.inhaltJson')}</span>
                    <Textarea
                      rows={8}
                      className="font-mono text-sm"
                      value={JSON.stringify(item.inhalt, null, 2)}
                      onChange={(event) => aktualisiereInhalt(item.clientId, event.currentTarget.value)}
                    />
                  </label>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(['neu', 'einfacher', 'schwieriger', 'praxisnaeher', 'kuerzer', 'ausfuehrlicher'] as const).map((variante) => (
                    <Button key={variante} type="button" variante="leise" groesse="sm" disabled={pending} onClick={() => regenerieren(item.clientId, variante)}>
                      {t(`generator.aktionen.${variante}`)}
                    </Button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {phase === 'fertig' && unterthemaId && (
        <Alert
          variante="success"
          titel={t('generator.fertig.titel')}
          aktion={<Link className="font-semibold text-primary underline" href={`/${locale}/campus/topic/${unterthemaId}/modul`}>{t('generator.fertig.lernendenansicht')}</Link>}
        >
          {t('generator.fertig.text', { anzahl: gespeicherteIds.length })}
        </Alert>
      )}
    </div>
  );
}

/**
 * Kleines Formularfeld ohne eigenes Designsystem-Pattern zu umgehen.
 */
function Feld({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-semibold text-fg-muted">{label}</span>
      {children}
    </label>
  );
}

/**
 * Gruppiert zusammengehoerige Generator-Controls.
 */
function AuswahlGruppe({ titel, hinweis, children }: { titel: string; hinweis: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-bg p-3">
      <h3 className="text-sm font-bold">{titel}</h3>
      <p className="mb-3 text-sm text-fg-muted">{hinweis}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
