import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';

export default async function LernenIndex() {
  const t = await getTranslations('lernen');
  return (
    <main className="mx-auto max-w-2xl p-4 space-y-4">
      <h1 className="pt-2 text-2xl font-extrabold">{t('titel')}</h1>
      <Card>
        <p className="text-muted">{t('einstiegHinweis')}</p>
      </Card>
    </main>
  );
}
