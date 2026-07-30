import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';

/**
 * Nicht-gefunden-Zustand fuer Content-Details.
 */
export default async function ContentDetailNichtGefunden() {
  const t = await getTranslations('admin.content');
  return (
    <Card>
      <h2 className="text-lg font-bold">{t('nichtGefunden.titel')}</h2>
      <p className="mt-2 text-sm text-fg-muted">{t('nichtGefunden.text')}</p>
    </Card>
  );
}
