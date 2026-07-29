'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Button, type ButtonVariante } from '@bze/ui';
import { holeBerichtsheftHtml } from '../_lib/actions';

/**
 * Öffnet den druckfertigen Export (Edge Function `berichtsheft-pdf`) in einem
 * neuen Tab. Von dort speichert der Nutzer über „Drucken → Als PDF" (Spec §5).
 */
export function PdfExportButton({
  nachweisId,
  variante = 'sekundaer',
}: {
  nachweisId?: string;
  variante?: ButtonVariante;
}) {
  const t = useTranslations('berichtsheft');
  const [fehler, setFehler] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <Button
        type="button"
        variante={variante}
        className="min-h-12"
        disabled={pending}
        onClick={() => {
          setFehler(null);
          start(async () => {
            const res = await holeBerichtsheftHtml(nachweisId ? { nachweisId } : {});
            if (!res.ok) {
              setFehler(t('export.fehler'));
              return;
            }
            const blob = new Blob([res.html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank', 'noopener');
            setTimeout(() => URL.revokeObjectURL(url), 60_000);
          });
        }}
      >
        {pending ? t('export.laeuft') : t('export.knopf')}
      </Button>
      {fehler && (
        <span className="text-xs text-status-falsch" role="alert">
          {fehler}
        </span>
      )}
    </span>
  );
}
