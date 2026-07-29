'use client';
import * as React from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, Button, Chip } from '@bze/ui';
import { markiereWochenberichtGelesen } from './actions';
import type { Wochenbericht, WochenberichtTrend } from './types';

const TREND_SYMBOL: Record<WochenberichtTrend, string> = {
  besser: '↑',
  schlechter: '↓',
  gleich: '→',
  neu: '•',
};

export interface WochenberichtKarteProps {
  bericht: Wochenbericht | null;
  className?: string;
}

/**
 * Startbildschirm-Karte „Wochenbericht" (Spec §6.1). Zeigt den neuesten Bericht
 * mit Zusammenfassung, Verbesserungen und Empfehlung und lässt ihn als gelesen
 * markieren. Der Bericht ist automatisches Lernfeedback (Spec §10) — der Hinweis
 * ist sichtbar. Farbe ist nie alleiniger Träger: Trend hat Symbol + Textlabel.
 */
export function WochenberichtKarte({ bericht, className }: WochenberichtKarteProps) {
  const t = useTranslations('campus.wochenbericht');
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const [pending, startTransition] = React.useTransition();
  const [fehler, setFehler] = React.useState(false);

  if (!bericht || !bericht.inhalt) {
    return (
      <Card className={className}>
        <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-accent">{t('titel')}</h2>
        <p className="text-sm text-muted">{t('keinBericht')}</p>
      </Card>
    );
  }

  const { inhalt } = bericht;
  const statistik = inhalt.statistik;
  const trend = statistik?.trend ?? 'neu';

  function markieren() {
    setFehler(false);
    startTransition(async () => {
      try {
        await markiereWochenberichtGelesen({ berichtId: bericht!.id, locale });
        router.refresh();
      } catch {
        setFehler(true);
      }
    });
  }

  return (
    <Card className={className}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-accent">{t('titel')}</h2>
        <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-muted">
          {t('kw', { kw: bericht.kalenderwoche, jahr: bericht.jahr })}
        </span>
      </div>

      {statistik && (
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold">
            {t('quote', { quote: statistik.richtig_quote, bearbeitet: statistik.bearbeitet })}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-semibold text-muted"
            role="status"
          >
            <span aria-hidden="true">{TREND_SYMBOL[trend]}</span>
            <span>{t(`trend.${trend}`)}</span>
          </span>
        </div>
      )}

      <div className="space-y-2 text-sm">
        <p>{inhalt.zusammenfassung}</p>
        {inhalt.verbesserungen && (
          <p>
            <span className="font-semibold">{t('verbesserungen')}: </span>
            {inhalt.verbesserungen}
          </p>
        )}
        {inhalt.empfehlung && (
          <p>
            <span className="font-semibold">{t('empfehlung')}: </span>
            {inhalt.empfehlung}
          </p>
        )}
      </div>

      {statistik?.schwaechste_themen?.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
            {t('schwaechsteThemen')}
          </p>
          <div className="flex flex-wrap gap-2">
            {statistik.schwaechste_themen.map((thema) => (
              <Chip key={thema}>{thema}</Chip>
            ))}
          </div>
        </div>
      )}

      <p className="mt-3 text-xs text-muted">{t('lernfeedbackHinweis')}</p>

      {fehler && (
        <p className="mt-2 text-sm text-status-falsch" role="alert">
          {t('fehler')}
        </p>
      )}

      <div className="mt-3 flex items-center gap-2">
        {bericht.gelesen ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-status-fertig" role="status">
            <span aria-hidden="true">✓</span>
            {t('gelesen')}
          </span>
        ) : (
          <Button onClick={markieren} disabled={pending}>
            {pending ? t('markiereLaeuft') : t('markiereGelesen')}
          </Button>
        )}
      </div>
    </Card>
  );
}
