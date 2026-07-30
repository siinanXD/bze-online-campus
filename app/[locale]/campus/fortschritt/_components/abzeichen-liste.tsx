import { getTranslations } from 'next-intl/server';
import { Card, Progress } from '@bze/ui';
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
        const ziel = a.ziel ?? 0;
        const ist = Math.min(a.stand ?? 0, ziel || a.stand || 0);
        const prozent = ziel > 0 ? Math.min(100, Math.round((ist / ziel) * 100)) : frei ? 100 : 0;
        return (
          <li key={a.code}>
            <Card className={frei ? 'border-primary-border bg-primary-subtle/30' : ''}>
              <p className="flex flex-wrap items-center gap-2 font-semibold" role="status">
                <span aria-hidden="true">{frei ? '◆' : '◇'}</span>
                <span>{t(a.titelKey)}</span>
                <span className="text-xs font-medium text-fg-muted">
                  {frei ? t('fortschritt.abzeichenFrei') : t('fortschritt.abzeichenGesperrt')}
                </span>
              </p>
              {a.beschreibungKey && (
                <p className="mt-1 text-sm text-fg-muted">{t(a.beschreibungKey)}</p>
              )}
              {!frei && ziel > 0 && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-fg-muted">
                    {t('fortschritt.abzeichenStand', { ist, ziel })}
                  </p>
                  <Progress wert={prozent} label={t(a.titelKey)} />
                </div>
              )}
              <p className="mt-1 text-xs text-fg-muted">
                +{a.punkte} {t('fortschritt.punkte')}
              </p>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
