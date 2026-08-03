'use client';

import { useTranslations } from 'next-intl';
import { Button, FehlerZustand } from '@bze/ui';

/**
 * Fehlerzustand fuer die Fachbereichseite.
 */
export default function FachbereichFehler({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('topic.content');
  return (
    <main className="mx-auto max-w-md p-4">
      <FehlerZustand
        titel={t('fehler.titel')}
        text={t('fehler.text')}
        details={error.message}
        aktion={<Button type="button" onClick={reset}>{t('fehler.erneutVersuchen')}</Button>}
      />
    </main>
  );
}
