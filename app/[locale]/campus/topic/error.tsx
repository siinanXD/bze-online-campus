'use client';

import { useTranslations } from 'next-intl';
import { Button, FehlerZustand } from '@bze/ui';

/**
 * Fehlerzustand fuer den Fachkunde-Einstieg.
 */
export default function FachkundeIndexFehler({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('topic.content');
  return (
    <main className="mx-auto max-w-2xl p-4">
      <FehlerZustand
        titel={t('fehler.titel')}
        text={t('fehler.text')}
        details={error.message}
        aktion={<Button type="button" onClick={reset}>{t('fehler.erneutVersuchen')}</Button>}
      />
    </main>
  );
}
