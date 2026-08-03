'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@bze/ui';
import { useLesesitzung } from './lesesitzung';

/**
 * Feste Fußleiste (SPEC §6.2.6): Daumen hoch, Daumen runter, grüner Knopf "Weiter".
 * Grün ist hier bewusst über den Status-Token `status-fertig` umgesetzt, nicht über die
 * Button-`primary`-Variante (Akzentfarbe Indigo) — konsistent mit "kräftiges Grün = abgeschlossen"
 * aus SPEC §7. Die Button-Grundklassen werden hier direkt nachgebildet statt über die
 * `variant`-Prop von `@bze/ui`-`Button`, weil das Repo kein `tailwind-merge` einsetzt und ein
 * Überschreiben von `bg-primary` per zusätzlicher `className` sonst von der Klassenreihenfolge im
 * kompilierten CSS abhinge (Datei-Hoheit erlaubt kein Ändern von `packages/ui/src/button.tsx`).
 */
export function Fussleiste() {
  const t = useTranslations();
  const tTopic = useTranslations('topic');
  const { bewertung, sendeBewertung, pruefeLesezeit, navigiereWeiter, demoModus } = useLesesitzung();
  const [zeigeLesezeitHinweis, setZeigeLesezeitHinweis] = React.useState(false);

  function weiterKlick() {
    if (!zeigeLesezeitHinweis && pruefeLesezeit()) {
      // Hinweis statt Sperre (SPEC §4.2) — ein zweiter Tipp auf "Weiter" geht sofort weiter.
      setZeigeLesezeitHinweis(true);
      return;
    }
    navigiereWeiter();
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface">
      {zeigeLesezeitHinweis && (
        <p role="status" className="border-b border-border bg-bg px-4 py-2 text-xs text-fg-muted">
          {tTopic('lerneinheit.lesezeitHinweis')}
        </p>
      )}
      {demoModus && (
        <p className="border-b border-border bg-bg px-4 py-2 text-xs text-fg-muted">
          {tTopic('lerneinheit.demoHinweis')}
        </p>
      )}
      <div className="mx-auto flex max-w-md items-center justify-between gap-3 p-4">
        <div className="flex gap-2">
          <Button
            type="button"
            variante={bewertung === 1 ? 'primary' : 'sekundaer'}
            aria-pressed={bewertung === 1}
            aria-label={tTopic('lerneinheit.daumenHoch')}
            onClick={() => sendeBewertung(1)}
          >
            <span aria-hidden="true">👍</span>
          </Button>
          <Button
            type="button"
            variante={bewertung === -1 ? 'primary' : 'sekundaer'}
            aria-pressed={bewertung === -1}
            aria-label={tTopic('lerneinheit.daumenRunter')}
            onClick={() => sendeBewertung(-1)}
          >
            <span aria-hidden="true">👎</span>
          </Button>
        </div>
        <button
          type="button"
          onClick={weiterKlick}
          className="touchable inline-flex items-center justify-center gap-2 rounded-xl bg-status-fertig px-4 py-3 text-[15px] font-semibold text-white transition hover:brightness-110"
        >
          {t('common.weiter')}
          <span aria-hidden="true" className="inline-block rtl:-scale-x-100">→</span>
        </button>
      </div>
    </div>
  );
}
