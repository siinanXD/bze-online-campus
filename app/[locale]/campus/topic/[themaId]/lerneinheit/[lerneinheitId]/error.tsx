'use client';

import { useTranslations } from 'next-intl';
import { Button, Card } from '@bze/ui';

export default function LerneinheitFehler({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('topic');
  return (
    <main className="mx-auto max-w-2xl p-4">
      <Card role="alert">
        <h1 className="mb-2 text-lg font-bold text-fg">{t('lerneinheit.fehlerTitel')}</h1>
        <p className="mb-4 text-sm text-fg-muted">{t('lerneinheit.fehlerBeschreibung')}</p>
        <Button type="button" variante="primary" onClick={reset}>
          {t('fehler.erneutVersuchen')}
        </Button>
      </Card>
    </main>
  );
}
