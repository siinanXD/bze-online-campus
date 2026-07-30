'use client';

import * as React from 'react';
import { cn } from '@bze/ui';

/**
 * Nur fuer die Showcase: schaltet Darstellung und Textrichtung um, damit
 * jede Komponente in Hell, Dunkel, LTR und RTL geprueft werden kann.
 */
export function VorschauSchalter() {
  const [dunkel, setDunkel] = React.useState(false);
  const [rtl, setRtl] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dunkel);
  }, [dunkel]);

  React.useEffect(() => {
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
  }, [rtl]);

  const schalter = (an: boolean, aus: string, ein: string, um: () => void) => (
    <button
      type="button"
      onClick={um}
      aria-pressed={an}
      className={cn(
        'inline-flex min-h-[40px] items-center gap-2 rounded-md border px-3 text-label transition-colors',
        an
          ? 'border-primary bg-primary text-fg-onPrimary'
          : 'border-border bg-surface text-fg hover:bg-bg-subtle',
      )}
    >
      {an ? ein : aus}
    </button>
  );

  return (
    <div className="sticky top-0 z-40 -mx-4 mb-6 flex flex-wrap gap-2 border-b border-border bg-bg/95 px-4 py-3 backdrop-blur">
      {schalter(dunkel, '☀ Hell', '☾ Dunkel', () => setDunkel((v) => !v))}
      {schalter(rtl, 'LTR', 'RTL (Arabisch)', () => setRtl((v) => !v))}
    </div>
  );
}
