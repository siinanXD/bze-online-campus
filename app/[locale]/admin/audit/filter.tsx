'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@bze/ui';

export function AuditFilter() {
  const t = useTranslations('admin');
  const router = useRouter();
  const pfad = usePathname();
  const params = useSearchParams();

  function absenden(formData: FormData) {
    const neu = new URLSearchParams();
    for (const feld of ['aktion', 'zielTyp', 'von', 'bis']) {
      const wert = String(formData.get(feld) ?? '').trim();
      if (wert) neu.set(feld, wert);
    }
    router.push(`${pfad}?${neu.toString()}`);
  }

  return (
    <form action={absenden} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label htmlFor="audit-aktion" className="mb-1 block text-xs font-semibold text-muted">
          {t('audit.feld.aktion')}
        </label>
        <input
          id="audit-aktion"
          name="aktion"
          defaultValue={params.get('aktion') ?? ''}
          className="touchable w-full rounded-xl border border-border bg-surface px-3 py-2 text-[15px]"
        />
      </div>
      <div>
        <label htmlFor="audit-zieltyp" className="mb-1 block text-xs font-semibold text-muted">
          {t('audit.feld.zielTyp')}
        </label>
        <input
          id="audit-zieltyp"
          name="zielTyp"
          defaultValue={params.get('zielTyp') ?? ''}
          className="touchable w-full rounded-xl border border-border bg-surface px-3 py-2 text-[15px]"
        />
      </div>
      <div>
        <label htmlFor="audit-von" className="mb-1 block text-xs font-semibold text-muted">
          {t('audit.feld.von')}
        </label>
        <input
          id="audit-von"
          type="date"
          name="von"
          defaultValue={params.get('von') ?? ''}
          className="touchable w-full rounded-xl border border-border bg-surface px-3 py-2 text-[15px]"
        />
      </div>
      <div>
        <label htmlFor="audit-bis" className="mb-1 block text-xs font-semibold text-muted">
          {t('audit.feld.bis')}
        </label>
        <input
          id="audit-bis"
          type="date"
          name="bis"
          defaultValue={params.get('bis') ?? ''}
          className="touchable w-full rounded-xl border border-border bg-surface px-3 py-2 text-[15px]"
        />
      </div>
      <div className="sm:col-span-2 lg:col-span-4">
        <Button type="submit" variant="primary">
          {t('audit.filtern')}
        </Button>
      </div>
    </form>
  );
}
