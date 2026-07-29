'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@bze/ui';
import type { NachweisStatus } from '@bze/core/nachweis';
import { reicheEin, signiereNachweis } from '../_lib/actions';

/**
 * Teilnehmer-Aktionen auf einem Nachweis: einreichen (entwurf/beanstandet) und
 * signieren (eingereicht). Signieren sperrt den Nachweis (Spec §3 Regel 15).
 */
export function NachweisAktionen({
  nachweisId,
  status,
  locale,
}: {
  nachweisId: string;
  status: NachweisStatus;
  locale: string;
}) {
  const t = useTranslations('berichtsheft');
  const router = useRouter();
  const [pending, start] = useTransition();
  const [fehler, setFehler] = useState<string | null>(null);
  const [signaturBestaetigt, setSignaturBestaetigt] = useState(false);

  const kannEinreichen = status === 'entwurf' || status === 'beanstandet';
  const kannSignieren = status === 'eingereicht';

  function fuehreAus(fn: () => Promise<{ ok: boolean; fehler?: string }>) {
    setFehler(null);
    start(async () => {
      const res = await fn();
      if (!res.ok) {
        setFehler(t('fehler.aktion'));
        return;
      }
      router.refresh();
    });
  }

  if (!kannEinreichen && !kannSignieren) return null;

  return (
    <div className="space-y-3">
      {kannEinreichen && (
        <Button
          type="button"
          className="min-h-12 w-full sm:w-auto"
          disabled={pending}
          onClick={() => fuehreAus(() => reicheEin({ id: nachweisId }))}
        >
          {pending ? t('aktion.laeuft') : t('aktion.einreichen')}
        </Button>
      )}

      {kannSignieren && (
        <div className="space-y-2 rounded-lg border border-border p-3">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={signaturBestaetigt}
              onChange={(e) => setSignaturBestaetigt(e.target.checked)}
              className="mt-1 h-5 w-5"
            />
            <span>{t('aktion.signaturBestaetigung')}</span>
          </label>
          <Button
            type="button"
            className="min-h-12 w-full sm:w-auto"
            disabled={pending || !signaturBestaetigt}
            onClick={() => fuehreAus(() => signiereNachweis({ id: nachweisId }))}
          >
            {pending ? t('aktion.laeuft') : t('aktion.signieren')}
          </Button>
        </div>
      )}

      {fehler && (
        <p className="text-sm text-status-falsch" role="alert">
          {fehler}
        </p>
      )}
    </div>
  );
}
