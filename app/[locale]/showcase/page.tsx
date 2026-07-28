import { useTranslations } from 'next-intl';
import { Button, Card, Chip, ProgressRing, StatusBadge, type FrageStatus } from '@bze/ui';

const STATI: FrageStatus[] = ['neu', 'einmal_richtig', 'falsch', 'abgeschlossen'];
const KEY: Record<FrageStatus, string> = {
  neu: 'neu', einmal_richtig: 'einmalRichtig', falsch: 'falsch', abgeschlossen: 'abgeschlossen',
};

export default function Start() {
  const t = useTranslations();
  return (
    <main className="mx-auto max-w-2xl p-4 space-y-4">
      <header className="pt-2">
        <p className="text-xs text-muted">{t('app.traeger')}</p>
        <h1 className="text-2xl font-extrabold">{t('start.titel')}</h1>
        <p className="text-muted">{t('start.hinweis')}</p>
      </header>

      <Card>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-accent">{t('showcase.aktionen')}</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">{t('common.weiter')}</Button>
          <Button variant="soft">{t('common.einloggen')}</Button>
          <Button variant="ghost">{t('common.abbrechen')}</Button>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-accent">{t('showcase.status')}</h2>
        <div className="flex flex-wrap gap-2">
          {STATI.map((s) => (
            <StatusBadge key={s} status={s} label={t(`status.${KEY[s]}`)} fehler={s === 'falsch' ? 2 : 0} />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">{t('showcase.hinweis')}</p>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-accent">{t('showcase.fortschritt')}</h2>
        <div className="flex items-center gap-4">
          <ProgressRing value={72} size={96} />
          <div className="flex flex-wrap gap-2">
            <Chip active>{t('nav.lernen')}</Chip>
            <Chip>{t('nav.pruefung')}</Chip>
            <Chip>{t('nav.bericht')}</Chip>
          </div>
        </div>
      </Card>
    </main>
  );
}
