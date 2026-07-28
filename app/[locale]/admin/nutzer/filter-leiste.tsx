'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Chip } from '@bze/ui';
import type { Rolle } from '../_lib/types';

const ROLLEN: Rolle[] = ['teilnehmer', 'ausbilder', 'verwaltung', 'admin'];

export function FilterLeiste({ kohorten }: { kohorten: { id: string; bezeichnung: string }[] }) {
  const t = useTranslations('admin');
  const router = useRouter();
  const pfad = usePathname();
  const params = useSearchParams();

  function aktualisiere(schluessel: string, wert: string | null) {
    const neu = new URLSearchParams(params.toString());
    if (wert === null || wert === neu.get(schluessel)) {
      neu.delete(schluessel);
    } else {
      neu.set(schluessel, wert);
    }
    router.push(`${pfad}?${neu.toString()}`);
  }

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="nutzer-suche" className="mb-1 block text-xs font-semibold text-muted">
          {t('nutzer.suche')}
        </label>
        <input
          id="nutzer-suche"
          type="search"
          defaultValue={params.get('q') ?? ''}
          placeholder={t('nutzer.suchePlatzhalter')}
          onChange={(e) => aktualisiere('q', e.currentTarget.value || null)}
          className="touchable w-full rounded-xl border border-border bg-surface px-3 py-2 text-[15px] text-fg placeholder:text-muted"
        />
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label={t('nutzer.rolleFilter')}>
        {ROLLEN.map((r) => (
          <Chip key={r} active={params.get('rolle') === r} onClick={() => aktualisiere('rolle', r)}>
            {t(`rollen.${r}`)}
          </Chip>
        ))}
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label={t('nutzer.statusFilter')}>
        <Chip active={params.get('status') === 'aktiv'} onClick={() => aktualisiere('status', 'aktiv')}>
          {t('nutzer.aktiv')}
        </Chip>
        <Chip active={params.get('status') === 'inaktiv'} onClick={() => aktualisiere('status', 'inaktiv')}>
          {t('nutzer.inaktiv')}
        </Chip>
      </div>

      {kohorten.length > 0 && (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label={t('nutzer.kohorteFilter')}>
          {kohorten.map((k) => (
            <Chip key={k.id} active={params.get('kohorte') === k.id} onClick={() => aktualisiere('kohorte', k.id)}>
              {k.bezeichnung}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
