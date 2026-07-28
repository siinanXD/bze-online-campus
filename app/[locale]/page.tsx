import { useTranslations } from 'next-intl';
export default function Start() {
  const t = useTranslations('start');
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>{t('titel')}</h1>
      <p>{t('hinweis')}</p>
    </main>
  );
}
