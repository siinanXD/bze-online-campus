'use client';

import type * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button, Input, Select } from '@bze/ui';
import { contentKonstanten } from '../_lib/schemas';
import type { FachbereichOption, TaxonomieOption } from '../_lib/types';

/**
 * Filterleiste fuer die Content-Liste.
 */
export function ContentFilter({
  fachbereiche,
  themen,
}: {
  fachbereiche: FachbereichOption[];
  themen: TaxonomieOption[];
}) {
  const t = useTranslations('admin.content');
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setze(feld: string, wert: string) {
    const neu = new URLSearchParams(params.toString());
    if (wert) neu.set(feld, wert);
    else neu.delete(feld);
    neu.delete('seite');
    router.push(`${pathname}?${neu.toString()}`);
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <label className="space-y-1 md:col-span-3">
        <span className="text-xs font-semibold text-fg-muted">{t('filter.suche')}</span>
        <Input
          type="search"
          defaultValue={params.get('q') ?? ''}
          placeholder={t('filter.suchePlaceholder')}
          onChange={(event) => setze('q', event.currentTarget.value)}
        />
      </label>

      <Feld label={t('filter.typ')} value={params.get('typ') ?? ''} onChange={(wert) => setze('typ', wert)}>
        {contentKonstanten.typen.map((typ) => <option key={typ} value={typ}>{t(`typen.${typ}`)}</option>)}
      </Feld>
      <Feld label={t('filter.fachbereich')} value={params.get('fachbereich') ?? ''} onChange={(wert) => setze('fachbereich', wert)}>
        {fachbereiche.map((fachbereich) => <option key={fachbereich.id} value={fachbereich.id}>{fachbereich.bezeichnung}</option>)}
      </Feld>
      <Feld label={t('filter.thema')} value={params.get('thema') ?? ''} onChange={(wert) => setze('thema', wert)}>
        {themen.map((thema) => <option key={thema.id} value={thema.id}>{thema.bezeichnung}</option>)}
      </Feld>
      <Feld label={t('filter.schwierigkeit')} value={params.get('schwierigkeit') ?? ''} onChange={(wert) => setze('schwierigkeit', wert)}>
        {contentKonstanten.schwierigkeitsgrade.map((grad) => <option key={grad} value={grad}>{t(`schwierigkeit.${grad}`)}</option>)}
      </Feld>
      <Feld label={t('filter.status')} value={params.get('status') ?? ''} onChange={(wert) => setze('status', wert)}>
        {contentKonstanten.status.map((status) => <option key={status} value={status}>{t(`status.${status}`)}</option>)}
      </Feld>
      <Feld label={t('filter.quelle')} value={params.get('quelle') ?? ''} onChange={(wert) => setze('quelle', wert)}>
        {contentKonstanten.quellenarten.map((quelle) => <option key={quelle} value={quelle}>{t(`quellen.${quelle}`)}</option>)}
      </Feld>
      <Feld label={t('filter.demo')} value={params.get('demo') ?? ''} onChange={(wert) => setze('demo', wert)}>
        <option value="ja">{t('filter.demoJa')}</option>
        <option value="nein">{t('filter.demoNein')}</option>
      </Feld>
      <Feld label={t('filter.qualitaet')} value={params.get('qualitaet') ?? ''} onChange={(wert) => setze('qualitaet', wert)}>
        <option value="niedrig">{t('filter.qualitaetNiedrig')}</option>
        <option value="mittel">{t('filter.qualitaetMittel')}</option>
        <option value="hoch">{t('filter.qualitaetHoch')}</option>
        <option value="ohne">{t('filter.qualitaetOhne')}</option>
      </Feld>
      <label className="space-y-1">
        <span className="text-xs font-semibold text-fg-muted">{t('filter.von')}</span>
        <Input type="date" defaultValue={params.get('von') ?? ''} onChange={(event) => setze('von', event.currentTarget.value)} />
      </label>
      <label className="space-y-1">
        <span className="text-xs font-semibold text-fg-muted">{t('filter.bis')}</span>
        <Input type="date" defaultValue={params.get('bis') ?? ''} onChange={(event) => setze('bis', event.currentTarget.value)} />
      </label>
      <div className="flex items-end">
        <Button type="button" variante="leise" onClick={() => router.push(pathname)}>
          {t('filter.zuruecksetzen')}
        </Button>
      </div>
    </div>
  );
}

/**
 * Select-Feld mit leerer Alle-Option.
 */
function Feld({
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
  const t = useTranslations('admin.content');
  return (
    <label className="space-y-1">
      <span className="text-xs font-semibold text-fg-muted">{label}</span>
      <Select value={value} onChange={(event) => onChange(event.currentTarget.value)}>
        <option value="">{t('filter.alle')}</option>
        {children}
      </Select>
    </label>
  );
}
