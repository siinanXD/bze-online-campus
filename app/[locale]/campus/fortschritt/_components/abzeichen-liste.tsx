import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';
import type { AchievementAnzeige } from '../_lib/queries';

export async function AbzeichenListe({ items }: { items: AchievementAnzeige[] }) {
  const t = await getTranslations();
  if (items.length === 0) {
    return (
      <Card>
        <p className="text-sm text-fg-muted">{t('fortschritt.keineAbzeichen')}</p>
      </Card>
    );
  }
  return (
    <ul className="space-y-2">
      {items.map((a) => {
        const frei = Boolean(a.freigeschaltetAm);
        return (
          <li key={a.code}>
            <Card className={frei ? '' : 'opacity-60'}>
              <p className="flex items-center gap-2 font-semibold" role="status">
                <span aria-hidden="true">{frei ? '◆' : '◇'}</span>
                <span>{t(a.titelKey)}</span>
                <span className="text-xs font-medium text-fg-muted">
                  {frei ? t('fortschritt.abzeichenFrei') : t('fortschritt.abzeichenGesperrt')}
                </span>
              </p>
              {a.beschreibungKey && (
                <p className="mt-1 text-sm text-fg-muted">{t(a.beschreibungKey)}</p>
              )}
              <p className="mt-1 text-xs text-fg-muted">+{a.punkte} {t('fortschritt.punkte')}</p>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
