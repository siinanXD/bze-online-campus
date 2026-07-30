'use client';

import { useMemo, useState, useTransition } from 'react';
import type * as React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Alert, Badge, Button, Card, Input, Select, Textarea } from '@bze/ui';
import {
  contentArchivierenAction,
  contentBearbeitenAction,
  contentLoeschenAction,
  contentStatusAendernAction,
} from '../../actions';
import {
  contentMitHistorieRegenerierenAction,
  qualitaetsPruefungStartenAction,
} from '../../qualitaetspruefung/actions';
import { contentKonstanten } from '../../_lib/schemas';
import type { ContentDetail } from '../../_lib/types';

/**
 * Bearbeitungsformular und Aktionen fuer ein Content-Element.
 */
export function ContentDetailClient({ content }: { content: ContentDetail }) {
  const t = useTranslations('admin.content');
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [meldung, setMeldung] = useState<string | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [form, setForm] = useState({
    titel: content.titel,
    beschreibung: content.beschreibung ?? '',
    schwierigkeitsgrad: content.schwierigkeitsgrad,
    status: content.status,
    ist_demo: content.ist_demo,
    demo_sichtbar: content.demo_sichtbar,
    demo_label: content.demo_label ?? '',
    fachlich_verifiziert: content.fachlich_verifiziert,
    quellenart: content.quellenart,
    ki_anbieter: content.ki_anbieter ?? '',
    ki_modell: content.ki_modell ?? '',
    qualitaetswert: content.qualitaetswert == null ? '' : String(content.qualitaetswert),
    inhalt: JSON.stringify(content.inhalt, null, 2),
  });

  const qualitaetText = useMemo(
    () => content.qualitaetswert == null ? '-' : `${Math.round(content.qualitaetswert * 100)} %`,
    [content.qualitaetswert],
  );

  function aktualisiere<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((alt) => ({ ...alt, [key]: value }));
  }

  function fuehreAus(fn: () => Promise<{ ok: true } | { ok: false; fehler: string }>, erfolg: string) {
    setMeldung(null);
    setFehler(null);
    startTransition(async () => {
      const ergebnis = await fn();
      if (!ergebnis.ok) {
        setFehler(t('fehler.aktion', { fehler: ergebnis.fehler }));
        return;
      }
      setMeldung(erfolg);
      router.refresh();
    });
  }

  function speichern() {
    fuehreAus(
      () =>
        contentBearbeitenAction({
          id: content.id,
          ...form,
          qualitaetswert: form.qualitaetswert.trim() ? Number(form.qualitaetswert) : null,
        }),
      t('detail.gespeichert'),
    );
  }

  function statusSetzen(status: string) {
    fuehreAus(() => contentStatusAendernAction({ ids: [content.id], status }), t('detail.statusGespeichert'));
  }

  function archivieren() {
    fuehreAus(() => contentArchivierenAction(content.id), t('detail.archiviert'));
  }

  function loeschen() {
    if (!window.confirm(t('detail.loeschenBestaetigung'))) return;
    fuehreAus(async () => {
      const ergebnis = await contentLoeschenAction({ id: content.id });
      if (ergebnis.ok) router.push(`/${locale}/admin/content/inhalte`);
      return ergebnis;
    }, t('detail.geloescht'));
  }

  function qualitaetPruefen() {
    fuehreAus(async () => {
      const ergebnis = await qualitaetsPruefungStartenAction({ contentId: content.id });
      return ergebnis.ok ? { ok: true } : ergebnis;
    }, 'Qualitaetspruefung abgeschlossen.');
  }

  function regenerieren(variante: 'einfacher' | 'schwieriger' | 'praxisnaeher' | 'kuerzer' | 'ausfuehrlicher' | 'praeziser') {
    fuehreAus(async () => {
      const ergebnis = await contentMitHistorieRegenerierenAction({ contentId: content.id, variante });
      return ergebnis.ok ? { ok: true } : ergebnis;
    }, 'Content wurde regeneriert; die vorherige Version wurde gesichert.');
  }

  return (
    <div className="space-y-4">
      {meldung && <p role="status" className="rounded-xl border border-status-fertig/40 bg-surface px-3 py-2 text-sm font-semibold text-status-fertig">{meldung}</p>}
      {fehler && <p role="alert" className="rounded-xl border border-status-falsch/40 bg-surface px-3 py-2 text-sm font-semibold text-status-falsch">{fehler}</p>}

      {content.ist_demo && (
        <Alert variante="warning" titel={t('hinweise.demoTitel')}>
          {content.demo_label ?? t('hinweise.demoText')}
        </Alert>
      )}

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">{content.titel}</h3>
            <p className="text-sm text-fg-muted">
              {content.fachbereich ?? '-'} / {content.thema ?? '-'} / {content.unterthema ?? '-'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variante="primary">{t(`typen.${content.content_typ}`)}</Badge>
            <Badge variante={content.ist_demo ? 'warning' : 'neutral'} symbol={content.ist_demo ? '!' : undefined}>
              {content.ist_demo ? t('badges.demo') : t('badges.produktion')}
            </Badge>
          </div>
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <Meta label={t('spalten.status')} wert={t(`status.${content.status}`)} />
          <Meta label={t('spalten.quelle')} wert={t(`quellen.${content.quellenart}`)} />
          <Meta label={t('spalten.schwierigkeit')} wert={t(`schwierigkeit.${content.schwierigkeitsgrad}`)} />
          <Meta label={t('spalten.qualitaet')} wert={qualitaetText} />
          <Meta label={t('detail.kiAnbieter')} wert={content.ki_anbieter ?? '-'} />
          <Meta label={t('detail.kiModell')} wert={content.ki_modell ?? '-'} />
          <Meta label="Quellenmodus" wert={content.source_mode ?? 'generated'} />
          <Meta label="Generierungsdatum" wert={content.created_at} />
        </dl>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-primary">Quellen und RAG</h3>
            <p className="mt-1 text-sm text-fg-muted">
              Angezeigt werden nur gespeicherte Quellenreferenzen und verwendete Chunks. Der Quellenmodus ersetzt keine fachliche Freigabe.
            </p>
          </div>
          <Badge variante={content.source_mode === 'generated' || !content.source_mode ? 'neutral' : 'info'}>
            {content.source_mode ?? 'generated'}
          </Badge>
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <Meta label="Verwendete Chunk-IDs" wert={String(content.rag_chunk_ids?.length ?? 0)} />
          <Meta label="KI-Anbieter" wert={content.ki_anbieter ?? '-'} />
          <Meta label="Qualitaetsstatus" wert={content.qualitaetspruefungen[0]?.bewertung ?? (content.qualitaetswert == null ? '-' : qualitaetText)} />
        </dl>
        {content.quellen.length === 0 ? (
          <p className="mt-3 text-sm text-fg-muted">Keine gespeicherten Quellenreferenzen vorhanden.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {content.quellen.map((quelle) => (
              <div key={`${quelle.quelle_id}-${quelle.quelldokument_id ?? 'generator'}`} className="rounded-lg border border-border bg-bg p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{quelle.titel}</p>
                  <Badge variante="neutral">{quelle.quellenart}</Badge>
                </div>
                {quelle.chunks.length > 0 && (
                  <ol className="mt-3 space-y-2">
                    {quelle.chunks.map((chunk) => (
                      <li key={chunk.id} className="rounded-md border border-border bg-surface p-2 text-sm">
                        <p className="font-semibold">Chunk {chunk.chunk_index + 1}</p>
                        <p className="mt-1 line-clamp-3 text-fg-muted">{chunk.inhalt}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-primary">Qualitaetspruefung</h3>
            <p className="mt-1 text-sm text-fg-muted">Der Score ist keine fachliche Freigabe und blockiert Demo-Sichtbarkeit nicht.</p>
          </div>
          <Button type="button" variante="sekundaer" disabled={pending} onClick={qualitaetPruefen}>Jetzt pruefen</Button>
        </div>
        {content.qualitaetspruefungen.length === 0 ? (
          <p className="mt-3 text-sm text-fg-muted">Noch keine Qualitaetspruefung vorhanden.</p>
        ) : (
          <div className="mt-3 space-y-3">
            <div className="rounded-lg border border-border bg-bg p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variante={scoreVariante(content.qualitaetspruefungen[0]?.gesamt_score ?? 0)}>
                  {content.qualitaetspruefungen[0]?.gesamt_score ?? 0} Punkte
                </Badge>
                <Badge variante="neutral">{content.qualitaetspruefungen[0]?.pruefmethode}</Badge>
                <span className="text-sm text-fg-muted">{content.qualitaetspruefungen[0]?.geprueft_am}</span>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <HinweisListe titel="Hinweise" werte={content.qualitaetspruefungen[0]?.hinweise ?? []} />
                <HinweisListe titel="Verbesserungsvorschlaege" werte={content.qualitaetspruefungen[0]?.verbesserungsvorschlaege ?? []} />
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {(content.qualitaetspruefungen[0]?.kriterien ?? []).map((kriterium) => (
                  <div key={kriterium.kriterium} className="rounded-lg border border-border p-2 text-sm">
                    <p className="font-semibold">{kriterium.kriterium}</p>
                    <p className="text-fg-muted">{kriterium.status} / {kriterium.score}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold">Regenerieren mit Historie</p>
          <div className="flex flex-wrap gap-2">
            {(['einfacher', 'schwieriger', 'praxisnaeher', 'kuerzer', 'ausfuehrlicher', 'praeziser'] as const).map((variante) => (
              <Button key={variante} type="button" variante="leise" groesse="sm" disabled={pending} onClick={() => regenerieren(variante)}>
                {variante}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">Versionshistorie</h3>
        {content.versionen.length === 0 ? (
          <p className="text-sm text-fg-muted">Noch keine vorherige Version gespeichert.</p>
        ) : (
          <ol className="space-y-2">
            {content.versionen.map((version) => (
              <li key={version.id} className="rounded-lg border border-border bg-bg p-3">
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-semibold">Version {version.version_nr}: {version.titel}</p>
                  <span className="text-sm text-fg-muted">{version.created_at}</span>
                </div>
                <p className="text-sm text-fg-muted">{version.aenderungsart} / {version.schwierigkeitsgrad}</p>
              </li>
            ))}
          </ol>
        )}
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">{t('detail.lernziele')}</h3>
        {content.lernziele.length === 0 ? (
          <p className="text-sm text-fg-muted">{t('detail.keineLernziele')}</p>
        ) : (
          <ul className="space-y-2">
            {content.lernziele.map((ziel) => (
              <li key={ziel.id} className="rounded-lg border border-border bg-bg p-3">
                <p className="font-semibold">{ziel.titel}</p>
                {ziel.beschreibung && <p className="text-sm text-fg-muted">{ziel.beschreibung}</p>}
              </li>
            ))}
          </ul>
        )}
      </Card>

      {content.frage && (
        <Card>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">{t('detail.verknuepfteFrage')}</h3>
          <p className="font-semibold">{content.frage.aufgabenstellung}</p>
          <p className="mt-1 text-sm text-fg-muted">{content.frage.typ} / {content.frage.status}</p>
          <p className="mt-2 text-xs text-fg-muted">{t('detail.fragenHinweis')}</p>
        </Card>
      )}

      <Card>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">{t('detail.bearbeiten')}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 sm:col-span-2">
            <span className="text-xs font-semibold text-fg-muted">{t('felder.titel')}</span>
            <Input value={form.titel} onChange={(event) => aktualisiere('titel', event.currentTarget.value)} />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-xs font-semibold text-fg-muted">{t('felder.beschreibung')}</span>
            <Textarea rows={3} value={form.beschreibung} onChange={(event) => aktualisiere('beschreibung', event.currentTarget.value)} />
          </label>
          <SelectFeld label={t('filter.schwierigkeit')} value={form.schwierigkeitsgrad} onChange={(wert) => aktualisiere('schwierigkeitsgrad', wert as typeof form.schwierigkeitsgrad)}>
            {contentKonstanten.schwierigkeitsgrade.map((grad) => <option key={grad} value={grad}>{t(`schwierigkeit.${grad}`)}</option>)}
          </SelectFeld>
          <SelectFeld label={t('filter.status')} value={form.status} onChange={(wert) => aktualisiere('status', wert as typeof form.status)}>
            {contentKonstanten.status.map((status) => <option key={status} value={status}>{t(`status.${status}`)}</option>)}
          </SelectFeld>
          <SelectFeld label={t('filter.quelle')} value={form.quellenart} onChange={(wert) => aktualisiere('quellenart', wert as typeof form.quellenart)}>
            {contentKonstanten.quellenarten.map((quelle) => <option key={quelle} value={quelle}>{t(`quellen.${quelle}`)}</option>)}
          </SelectFeld>
          <label className="space-y-1">
            <span className="text-xs font-semibold text-fg-muted">{t('spalten.qualitaet')}</span>
            <Input type="number" min={0} max={1} step={0.01} value={form.qualitaetswert} onChange={(event) => aktualisiere('qualitaetswert', event.currentTarget.value)} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold text-fg-muted">{t('detail.kiAnbieter')}</span>
            <Input value={form.ki_anbieter} onChange={(event) => aktualisiere('ki_anbieter', event.currentTarget.value)} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold text-fg-muted">{t('detail.kiModell')}</span>
            <Input value={form.ki_modell} onChange={(event) => aktualisiere('ki_modell', event.currentTarget.value)} />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.ist_demo}
              onChange={(event) => aktualisiere('ist_demo', event.currentTarget.checked)}
              className="h-5 w-5"
            />
            {t('felder.istDemo')}
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.demo_sichtbar}
              onChange={(event) => aktualisiere('demo_sichtbar', event.currentTarget.checked)}
              className="h-5 w-5"
            />
            {t('felder.demoSichtbar')}
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.fachlich_verifiziert}
              onChange={(event) => aktualisiere('fachlich_verifiziert', event.currentTarget.checked)}
              className="h-5 w-5"
            />
            {t('felder.fachlichVerifiziert')}
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-xs font-semibold text-fg-muted">{t('felder.demoLabel')}</span>
            <Input value={form.demo_label} onChange={(event) => aktualisiere('demo_label', event.currentTarget.value)} />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-xs font-semibold text-fg-muted">{t('felder.inhaltJson')}</span>
            <Textarea rows={14} value={form.inhalt} onChange={(event) => aktualisiere('inhalt', event.currentTarget.value)} className="font-mono text-sm" />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" disabled={pending} onClick={speichern}>{t('aktionen.speichern')}</Button>
          <Button type="button" variante="leise" disabled={pending} onClick={() => statusSetzen(form.status)}>{t('aktionen.statusAendern')}</Button>
          <Button type="button" variante="leise" disabled={pending} onClick={archivieren}>{t('aktionen.archivieren')}</Button>
          <Button type="button" variante="leise" disabled={pending} onClick={loeschen}>{t('aktionen.loeschen')}</Button>
        </div>
      </Card>
    </div>
  );
}

/**
 * Zeigt ein Metadatum im Detailkopf.
 */
function Meta({ label, wert }: { label: string; wert: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-fg-muted">{label}</dt>
      <dd className="font-semibold">{wert}</dd>
    </div>
  );
}

/**
 * Zeigt Hinweise oder einen Leerzustand.
 */
function HinweisListe({ titel, werte }: { titel: string; werte: string[] }) {
  return (
    <div>
      <p className="text-sm font-semibold">{titel}</p>
      {werte.length === 0 ? (
        <p className="text-sm text-fg-muted">-</p>
      ) : (
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-fg-muted">
          {werte.slice(0, 5).map((wert) => <li key={wert}>{wert}</li>)}
        </ul>
      )}
    </div>
  );
}

/**
 * Mappt Score-Schwellen auf Badge-Varianten.
 */
function scoreVariante(score: number): 'danger' | 'warning' | 'success' {
  if (score < 60) return 'danger';
  if (score < 80) return 'warning';
  return 'success';
}

/**
 * Einheitliches Select-Feld.
 */
function SelectFeld({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (wert: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-semibold text-fg-muted">{label}</span>
      <Select value={value} onChange={(event) => onChange(event.currentTarget.value)}>
        {children}
      </Select>
    </label>
  );
}
