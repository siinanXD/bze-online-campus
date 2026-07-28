'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@bze/ui';
import { bestaetigePruefungsreife } from '../../_lib/actions';

export function PruefungsreifeForm({
  pruefungsreifeId,
  teilnehmerId,
  locale,
}: {
  pruefungsreifeId: string;
  teilnehmerId: string;
  locale: string;
}) {
  const t = useTranslations('ausbilder.detail');
  const [kommentar, setKommentar] = useState('');
  const [fehler, setFehler] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        setFehler(null);
        start(async () => {
          const res = await bestaetigePruefungsreife({
            pruefungsreifeId,
            teilnehmerId,
            kommentar,
            locale,
          });
          if (!res.ok) setFehler(t('bestaetigenFehler'));
        });
      }}
    >
      <label className="block text-sm">
        <span className="mb-1 block font-medium">{t('kommentarLabel')}</span>
        <textarea
          value={kommentar}
          onChange={(e) => setKommentar(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          maxLength={2000}
        />
      </label>
      <p className="text-xs text-muted">{t('bestaetigenHinweis')}</p>
      {fehler && <p className="text-sm text-status-falsch" role="alert">{fehler}</p>}
      <Button type="submit" disabled={pending} className="min-h-12">
        {pending ? t('bestaetigenLaeuft') : t('bestaetigen')}
      </Button>
    </form>
  );
}
