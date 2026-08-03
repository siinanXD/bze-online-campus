'use client';

import { useTranslations } from 'next-intl';
import { Button, Card } from '@bze/ui';

export default function TopicFehler({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('topic');
  return (
    <main className="mx-auto max-w-md p-4">
      <Card role="alert">
        <h1 className="mb-2 text-lg font-bold text-fg">{t('fehler.titel')}</h1>
        <p className="mb-4 text-sm text-fg-muted">{t('fehler.beschreibung')}</p>
        <Button type="button" variante="primary" onClick={reset}>
          {t('fehler.erneutVersuchen')}
        </Button>
      </Card>
    </main>
  );
}
