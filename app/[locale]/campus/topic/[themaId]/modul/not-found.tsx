import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';

/**
 * Nicht-gefunden-Zustand fuer Lernmodule.
 */
export default async function LernmodulNichtGefunden() {
  const t = await getTranslations('topic.content');
  return (
    <main className="mx-auto max-w-md p-4">
      <Card>
        <h1 className="mb-2 text-lg font-bold text-fg">{t('nichtGefunden.titel')}</h1>
        <p className="text-sm text-fg-muted">{t('nichtGefunden.text')}</p>
      </Card>
    </main>
  );
}
