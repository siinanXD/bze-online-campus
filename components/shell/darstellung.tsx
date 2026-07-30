'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@bze/ui';

export type Darstellung = 'system' | 'hell' | 'dunkel';

const SPEICHER_SCHLUESSEL = 'bze-darstellung';

/**
 * Laeuft als Inline-Skript im <head>, bevor der Body gerendert wird.
 * Ohne diesen Schritt blitzt beim Laden kurz die helle Variante auf,
 * obwohl der Nutzer die dunkle gewaehlt hat.
 */
export const darstellungSkript = `
(function () {
  try {
    var w = localStorage.getItem('${SPEICHER_SCHLUESSEL}') || 'system';
    var dunkel = w === 'dunkel' ||
      (w === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dunkel);
  } catch (e) {}
})();
`;

function anwenden(wahl: Darstellung) {
  const dunkel =
    wahl === 'dunkel' ||
    (wahl === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dunkel);
}

export function DarstellungUmschalter({ className }: { className?: string }) {
  const t = useTranslations('shell.darstellung');
  const [wahl, setWahl] = React.useState<Darstellung>('system');

  React.useEffect(() => {
    const gespeichert = (localStorage.getItem(SPEICHER_SCHLUESSEL) ??
      'system') as Darstellung;
    setWahl(gespeichert);

    // Bei "System" muss die App auf Aenderungen der Systemeinstellung reagieren.
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const beiWechsel = () => {
      if ((localStorage.getItem(SPEICHER_SCHLUESSEL) ?? 'system') === 'system') {
        anwenden('system');
      }
    };
    mq.addEventListener('change', beiWechsel);
    return () => mq.removeEventListener('change', beiWechsel);
  }, []);

  const waehlen = (neu: Darstellung) => {
    setWahl(neu);
    localStorage.setItem(SPEICHER_SCHLUESSEL, neu);
    anwenden(neu);
  };

  const optionen: { wert: Darstellung; symbol: string }[] = [
    { wert: 'system', symbol: '◐' },
    { wert: 'hell', symbol: '☀' },
    { wert: 'dunkel', symbol: '☾' },
  ];

  return (
    <fieldset className={cn('space-y-2', className)}>
      <legend className="text-label">{t('titel')}</legend>
      <div
        role="radiogroup"
        aria-label={t('titel')}
        className="inline-flex rounded-md border border-border bg-surface p-1"
      >
        {optionen.map(({ wert, symbol }) => {
          const aktiv = wahl === wert;
          return (
            <button
              key={wert}
              type="button"
              role="radio"
              aria-checked={aktiv}
              onClick={() => waehlen(wert)}
              className={cn(
                'inline-flex min-h-[40px] items-center gap-1.5 rounded-sm px-3 text-label transition-colors',
                aktiv
                  ? 'bg-primary text-fg-onPrimary'
                  : 'text-fg-muted hover:bg-bg-subtle hover:text-fg',
              )}
            >
              <span aria-hidden="true">{symbol}</span>
              <span>{t(wert)}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
