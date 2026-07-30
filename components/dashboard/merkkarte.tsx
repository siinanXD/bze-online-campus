'use client';
import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Card, Button } from '@bze/ui';
import type { Merksatz } from './types';

export interface MerkkarteProps {
  merksaetze: Merksatz[] | null;
  className?: string;
}

/**
 * Startbildschirm-Karte „Merkkarte" (Spec §6.1): zeigt genau EINEN Merksatz aus
 * dem Wochenbericht mit Symbol + Textlabel (Farbe nie alleiniger Träger). Bei
 * mehreren Merksätzen kann der Teilnehmer durchblättern. Die Merksätze werden
 * von der Edge Function zu tatsächlich falsch beantworteten Fragen erzeugt.
 */
export function Merkkarte({ merksaetze, className }: MerkkarteProps) {
  const t = useTranslations('campus.merkkarte');
  const [index, setIndex] = React.useState(0);

  const liste = (merksaetze ?? []).filter((m) => m && m.text && m.text.trim().length > 0);
  if (liste.length === 0) return null;

  const sicher = index % liste.length;
  const aktuell = liste[sicher];
  if (!aktuell) return null;

  return (
    <Card className={className}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-primary">
          <span aria-hidden="true">✦</span>
          {t('titel')}
        </h2>
        {liste.length > 1 && (
          <span className="text-xs font-semibold text-fg-muted">
            {t('zaehler', { position: sicher + 1, gesamt: liste.length })}
          </span>
        )}
      </div>

      <p className="text-base">{aktuell.text}</p>
      {aktuell.thema && <p className="mt-1 text-xs text-fg-muted">{aktuell.thema}</p>}

      {liste.length > 1 && (
        <div className="mt-3">
          <Button variante="sekundaer" onClick={() => setIndex((i) => i + 1)}>
            {t('naechster')}
          </Button>
        </div>
      )}
    </Card>
  );
}
