'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@bze/ui';
import { setzeKohorteAction } from '../actions';
import { fehlerSchluessel } from '../../_lib/fehler';

export function KohorteWechseln({
  teilnehmerId,
  aktuelleKohorteId,
  kohorten,
}: {
  teilnehmerId: string;
  aktuelleKohorteId: string;
  kohorten: { id: string; bezeichnung: string }[];
}) {
  const t = useTranslations('admin');
  const tc = useTranslations('common');
  const router = useRouter();
  const [ausgewaehlt, setAusgewaehlt] = useState(aktuelleKohorteId);
  const [istPending, startTransition] = useTransition();
  const [fehler, setFehler] = useState<string | null>(null);

  function speichern() {
    if (!ausgewaehlt || ausgewaehlt === aktuelleKohorteId) return;
    setFehler(null);
    startTransition(async () => {
      const antwort = await setzeKohorteAction(teilnehmerId, ausgewaehlt);
      if (!antwort.ok) {
        setFehler(antwort.fehler);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="kohorte-wechseln" className="mb-1 block text-xs font-semibold text-fg-muted">
          {t('nutzer.feld.kohorte')}
        </label>
        <select
          id="kohorte-wechseln"
          value={ausgewaehlt}
          onChange={(e) => setAusgewaehlt(e.currentTarget.value)}
          className="touchable w-full rounded-xl border border-border bg-surface px-3 py-2 text-[15px]"
        >
          <option value="">{t('nutzer.feld.kohorteWaehlen')}</option>
          {kohorten.map((k) => (
            <option key={k.id} value={k.id}>
              {k.bezeichnung}
            </option>
          ))}
        </select>
      </div>
      <Button variante="primary" disabled={!ausgewaehlt || ausgewaehlt === aktuelleKohorteId || istPending} onClick={speichern}>
        {tc('weiter')}
      </Button>
      {fehler && (
        <p role="alert" className="w-full text-sm text-status-falsch">
          {t(`fehler.${fehlerSchluessel(fehler)}`)}
        </p>
      )}
    </div>
  );
}
