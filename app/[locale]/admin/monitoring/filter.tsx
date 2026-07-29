'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

type Zeitraum = 'tag' | 'woche' | 'monat';

const ZEITRAEUME: Zeitraum[] = ['tag', 'woche', 'monat'];

export function MonitoringFilter({
  zeitraum,
  funktion,
  funktionen,
}: {
  zeitraum: Zeitraum;
  funktion: string;
  funktionen: string[];
}) {
  const t = useTranslations('admin.monitoring');
  const router = useRouter();
  const pfad = usePathname();
  const params = useSearchParams();

  function setze(feld: string, wert: string) {
    const neu = new URLSearchParams(params.toString());
    if (wert) neu.set(feld, wert);
    else neu.delete(feld);
    router.push(`${pfad}?${neu.toString()}`);
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <span id="mon-zeitraum-label" className="mb-1.5 block text-xs font-semibold text-muted">
          {t('zeitraum.beschriftung')}
        </span>
        <div
          role="group"
          aria-labelledby="mon-zeitraum-label"
          className="flex flex-wrap gap-2"
        >
          {ZEITRAEUME.map((z) => {
            const aktiv = z === zeitraum;
            return (
              <button
                key={z}
                type="button"
                onClick={() => setze('zeitraum', z)}
                aria-pressed={aktiv}
                className={
                  aktiv
                    ? 'touchable inline-flex items-center rounded-xl border border-accent bg-accent px-3.5 py-2 text-sm font-semibold text-accent-fg'
                    : 'touchable inline-flex items-center rounded-xl border border-border bg-surface px-3.5 py-2 text-sm font-semibold text-fg hover:bg-bg'
                }
              >
                {t(`zeitraum.${z}`)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="mon-funktion" className="mb-1.5 block text-xs font-semibold text-muted">
          {t('funktion.beschriftung')}
        </label>
        <select
          id="mon-funktion"
          value={funktion}
          onChange={(e) => setze('funktion', e.target.value)}
          className="touchable w-full rounded-xl border border-border bg-surface px-3 py-2 text-[15px]"
        >
          <option value="">{t('funktion.alle')}</option>
          {funktionen.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
