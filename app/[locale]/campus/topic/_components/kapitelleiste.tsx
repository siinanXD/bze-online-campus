'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Chip } from '@bze/ui';
import { useLesesitzung } from './lesesitzung';

/**
 * Kapitel-Fortschrittsleiste unter der Kopfzeile (SPEC §6.2.6): ein Balken mit dem Gesamtanteil
 * gelesener Abschnitte plus eine antippbare, waagerecht scrollbare Auswahlliste (einziger Ort mit
 * waagerechtem Scrollen außer Filter-Chips, SPEC §7). Abschnitte werden zusätzlich automatisch als
 * gelesen markiert, sobald ihre Überschrift in den sichtbaren Bereich scrollt.
 */
export function Kapitelleiste() {
  const t = useTranslations('topic');
  const { kapitel, gelesen, aktivIndex, setAktivIndex, markiereGelesen } = useLesesitzung();

  React.useEffect(() => {
    if (kapitel.length === 0) return;
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        for (const eintrag of eintraege) {
          if (!eintrag.isIntersecting) continue;
          const index = kapitel.findIndex((k) => k.slug === eintrag.target.id);
          if (index === -1) continue;
          setAktivIndex(index);
          markiereGelesen(index);
        }
      },
      { rootMargin: '-96px 0px -55% 0px', threshold: 0 },
    );
    for (const k of kapitel) {
      const element = document.getElementById(k.slug);
      if (element) beobachter.observe(element);
    }
    return () => beobachter.disconnect();
  }, [kapitel, setAktivIndex, markiereGelesen]);

  if (kapitel.length === 0) return null;
  const prozent = Math.round((gelesen.size / kapitel.length) * 100);

  function springeZu(slug: string, index: number) {
    setAktivIndex(index);
    document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="sticky top-0 z-10 border-b border-border bg-bg px-4 pb-3 pt-3">
      <div
        className="mb-2 h-2 w-full overflow-hidden rounded-full bg-surface"
        role="progressbar"
        aria-valuenow={prozent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t('kapitel.fortschritt', { prozent })}
      >
        <div className="h-full rounded-full bg-status-fertig transition-all" style={{ width: `${prozent}%` }} />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1" aria-label={t('kapitel.liste')}>
        {kapitel.map((k) => (
          <Chip key={k.slug} active={k.index === aktivIndex} onClick={() => springeZu(k.slug, k.index)}>
            <span aria-hidden="true" className="me-1">{gelesen.has(k.index) ? '✓' : '○'}</span>
            <span>{k.titel}</span>
          </Chip>
        ))}
      </div>
    </div>
  );
}
