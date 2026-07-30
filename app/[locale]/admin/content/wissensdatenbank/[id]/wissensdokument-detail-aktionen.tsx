'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { Button } from '@bze/ui';
import { wissensdokumentDeaktivierenAction, wissensdokumentLoeschenAction } from '../actions';

/**
 * Mutationen fuer ein einzelnes Wissensdokument.
 */
export function WissensdokumentDetailAktionen({
  dokumentId,
  aktiv,
}: {
  dokumentId: string;
  aktiv: boolean;
}) {
  const t = useTranslations('admin.content.wissensdatenbank');
  const locale = useLocale();
  const router = useRouter();
  const [fehler, setFehler] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function deaktivieren() {
    setFehler(null);
    startTransition(async () => {
      const ergebnis = await wissensdokumentDeaktivierenAction(dokumentId);
      if (!ergebnis.ok) {
        setFehler(ergebnis.fehler);
        return;
      }
      router.refresh();
    });
  }

  function loeschen() {
    setFehler(null);
    startTransition(async () => {
      const ergebnis = await wissensdokumentLoeschenAction(dokumentId);
      if (!ergebnis.ok) {
        setFehler(ergebnis.fehler);
        return;
      }
      router.push(`/${locale}/admin/content/wissensdatenbank`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variante="leise" disabled={pending || !aktiv} onClick={deaktivieren}>
          {t('aktionen.deaktivieren')}
        </Button>
        <Button type="button" variante="gefahr" disabled={pending} onClick={loeschen}>
          {t('aktionen.loeschen')}
        </Button>
      </div>
      {fehler && <p role="alert" className="text-sm font-semibold text-status-falsch">{t('meldungen.fehler', { fehler })}</p>}
    </div>
  );
}
