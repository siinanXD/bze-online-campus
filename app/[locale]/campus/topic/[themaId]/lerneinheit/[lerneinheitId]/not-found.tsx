import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';

export default async function LerneinheitNichtGefunden() {
  const t = await getTranslations('topic');
  return (
    <main className="mx-auto max-w-md p-4">
      <Card>
        <h1 className="mb-2 text-lg font-bold text-fg">{t('lerneinheit.nichtGefundenTitel')}</h1>
        <p className="text-sm text-fg-muted">{t('lerneinheit.nichtGefundenBeschreibung')}</p>
      </Card>
    </main>
  );
}
