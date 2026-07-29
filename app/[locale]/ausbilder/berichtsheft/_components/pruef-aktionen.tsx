'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button, Card } from '@bze/ui';
import type { NachweisInhalt, NachweisStatus } from '@bze/core/nachweis';
import { beanstandeNachweis, korrigiereNachweis, signiereAlsAusbilder } from '../_lib/actions';

export function PruefAktionen({
  nachweisId,
  status,
  inhalt,
  locale,
}: {
  nachweisId: string;
  status: NachweisStatus;
  inhalt: NachweisInhalt;
  locale: string;
}) {
  const t = useTranslations('berichtsheft.pruefung');
  const router = useRouter();
  const [pending, start] = useTransition();
  const [fehler, setFehler] = useState<string | null>(null);
  const [beanstandungOffen, setBeanstandungOffen] = useState(false);
  const [begruendung, setBegruendung] = useState('');
  const [korrekturOffen, setKorrekturOffen] = useState(false);
  const [korrInhalt, setKorrInhalt] = useState<NachweisInhalt>(inhalt);
  const [korrBegruendung, setKorrBegruendung] = useState('');

  const kannSignieren = status === 'signiert_teilnehmer';
  const kannBeanstanden = status === 'eingereicht' || status === 'signiert_teilnehmer';
  const kannKorrigieren = status === 'signiert_teilnehmer' || status === 'signiert_ausbilder';

  function fuehreAus(fn: () => Promise<{ ok: boolean }>) {
    setFehler(null);
    start(async () => {
      const res = await fn();
      if (!res.ok) {
        setFehler(t('fehler'));
        return;
      }
      setBeanstandungOffen(false);
      setKorrekturOffen(false);
      router.refresh();
    });
  }

  const inputCls = 'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm';

  return (
    <Card className="space-y-3">
      <h2 className="text-lg font-bold">{t('titel')}</h2>

      <div className="flex flex-wrap gap-3">
        {kannSignieren && (
          <Button
            type="button"
            className="min-h-12"
            disabled={pending}
            onClick={() => fuehreAus(() => signiereAlsAusbilder({ id: nachweisId }))}
          >
            {t('signieren')}
          </Button>
        )}
        {kannBeanstanden && (
          <Button
            type="button"
            variant="soft"
            className="min-h-12"
            disabled={pending}
            onClick={() => setBeanstandungOffen((o) => !o)}
          >
            {t('beanstanden')}
          </Button>
        )}
        {kannKorrigieren && (
          <Button
            type="button"
            variant="ghost"
            className="min-h-12"
            disabled={pending}
            onClick={() => setKorrekturOffen((o) => !o)}
          >
            {t('korrigieren')}
          </Button>
        )}
      </div>

      {kannSignieren && <p className="text-xs text-muted">{t('signierenHinweis')}</p>}

      {beanstandungOffen && (
        <div className="space-y-2 rounded-lg border border-status-falsch/40 p-3">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">{t('begruendungLabel')}</span>
            <textarea
              value={begruendung}
              onChange={(e) => setBegruendung(e.target.value)}
              rows={3}
              maxLength={2000}
              className={inputCls}
            />
          </label>
          <Button
            type="button"
            className="min-h-12"
            disabled={pending || begruendung.trim().length < 3}
            onClick={() => fuehreAus(() => beanstandeNachweis({ id: nachweisId, begruendung }))}
          >
            {t('beanstandenSenden')}
          </Button>
        </div>
      )}

      {korrekturOffen && (
        <div className="space-y-2 rounded-lg border border-border p-3">
          <p className="text-xs text-muted">{t('korrigierenHinweis')}</p>
          {(['taetigkeiten', 'unterweisungen', 'berufsschulthemen'] as const).map((feld) => (
            <label key={feld} className="block text-sm">
              <span className="mb-1 block font-medium">{t(`feld.${feld}`)}</span>
              <textarea
                value={korrInhalt[feld] ?? ''}
                onChange={(e) => setKorrInhalt((v) => ({ ...v, [feld]: e.target.value }))}
                rows={3}
                maxLength={4000}
                className={inputCls}
              />
            </label>
          ))}
          <label className="block text-sm">
            <span className="mb-1 block font-medium">{t('begruendungLabel')}</span>
            <textarea
              value={korrBegruendung}
              onChange={(e) => setKorrBegruendung(e.target.value)}
              rows={2}
              maxLength={2000}
              className={inputCls}
            />
          </label>
          <Button
            type="button"
            className="min-h-12"
            disabled={pending || korrBegruendung.trim().length < 3}
            onClick={() =>
              fuehreAus(() =>
                korrigiereNachweis({ id: nachweisId, inhalt: korrInhalt, begruendung: korrBegruendung }),
              )
            }
          >
            {t('korrigierenSenden')}
          </Button>
        </div>
      )}

      {fehler && (
        <p className="text-sm text-status-falsch" role="alert">
          {fehler}
        </p>
      )}
    </Card>
  );
}
