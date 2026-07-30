'use client';

import { useTranslations } from 'next-intl';
import { Button, FehlerZustand } from '@bze/ui';

/**
 * Fehlerzustand fuer Content-Admin-Seiten.
 */
export default function ContentAdminFehler({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('admin.content');
  return (
    <FehlerZustand
      titel={t('fehler.titel')}
      text={t('fehler.text')}
      details={error.message}
      aktion={<Button type="button" onClick={reset}>{t('fehler.erneutVersuchen')}</Button>}
    />
  );
}
