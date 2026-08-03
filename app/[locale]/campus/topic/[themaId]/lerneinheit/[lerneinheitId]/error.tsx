'use client';

import { useTranslations } from 'next-intl';
import { Button, Card } from '@bze/ui';

export default function LerneinheitFehler({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('topic');
  return (
    <main className="mx-auto max-w-md p-4">
      <Card role="alert">
        <h1 className="mb-2 text-lg font-bold text-fg">{t('lerneinheit.fehlerTitel')}</h1>
        <p className="mb-4 text-sm text-fg-muted">{t('lerneinheit.fehlerBeschreibung')}</p>
        {process.env.NODE_ENV !== 'production' && error?.message ? (
          <pre className="mb-4 overflow-auto rounded-md border border-border bg-bg-subtle p-2 text-xs text-fg-muted">
            {error.message}
            {error.digest ? `\ndigest: ${error.digest}` : ''}
          </pre>
        ) : null}
        <Button type="button" variante="primary" onClick={reset}>
          {t('fehler.erneutVersuchen')}
        </Button>
      </Card>
    </main>
  );
}
