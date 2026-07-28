'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@bze/ui';
import { createBrowserSupabase } from '@bze/db';
import type { Rolle } from '@bze/db';
import { passwortSchema } from '../lib/schemas';

/** Muss mit der Rollenweiche in middleware.ts synchron bleiben (Spec §6.2.1). */
const ROLLEN_STARTSEITE: Record<Rolle, string> = {
  teilnehmer: 'campus',
  ausbilder: 'ausbilder',
  verwaltung: 'admin',
  admin: 'admin',
};

export function PasswortForm({ locale }: { locale: string }) {
  const t = useTranslations('auth.passwortAendern');
  const tFehler = useTranslations('auth.fehler');
  const router = useRouter();

  const [neuesPasswort, setNeuesPasswort] = useState('');
  const [passwortWiederholen, setPasswortWiederholen] = useState('');
  const [fehler, setFehler] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function absenden(ereignis: FormEvent<HTMLFormElement>) {
    ereignis.preventDefault();
    setFehler(null);

    const ergebnis = passwortSchema.safeParse({ neuesPasswort, passwortWiederholen });
    if (!ergebnis.success) {
      const grund = ergebnis.error.issues[0]?.message;
      setFehler(tFehler(grund === 'stimmtNichtUeberein' ? 'stimmtNichtUeberein' : 'minLaenge'));
      return;
    }

    startTransition(async () => {
      const supabase = createBrowserSupabase();
      const { data: sitzung } = await supabase.auth.getUser();
      if (!sitzung.user) {
        setFehler(tFehler('anmeldungFehlgeschlagen'));
        return;
      }

      const { error: updateFehler } = await supabase.auth.updateUser({ password: ergebnis.data.neuesPasswort });
      if (updateFehler) {
        setFehler(tFehler('serverfehler'));
        return;
      }

      const { data: profil, error: profilFehler } = await supabase
        .from('profiles')
        .update({ muss_passwort_aendern: false })
        .eq('id', sitzung.user.id)
        .select('rolle')
        .single();

      if (profilFehler || !profil) {
        setFehler(tFehler('serverfehler'));
        return;
      }

      router.replace(`/${locale}/${ROLLEN_STARTSEITE[profil.rolle as Rolle] ?? 'campus'}`);
    });
  }

  return (
    <form onSubmit={absenden} className="space-y-4" noValidate>
      <div>
        <label htmlFor="neuesPasswort" className="mb-1 block text-start text-sm font-semibold">
          {t('neuesPasswort')}
        </label>
        <input
          id="neuesPasswort"
          name="new-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={neuesPasswort}
          onChange={(ereignis) => setNeuesPasswort(ereignis.target.value)}
          className="touchable w-full rounded-xl border border-border bg-bg px-3 text-[15px] text-fg"
          required
        />
      </div>
      <div>
        <label htmlFor="passwortWiederholen" className="mb-1 block text-start text-sm font-semibold">
          {t('passwortWiederholen')}
        </label>
        <input
          id="passwortWiederholen"
          name="new-password-repeat"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={passwortWiederholen}
          onChange={(ereignis) => setPasswortWiederholen(ereignis.target.value)}
          className="touchable w-full rounded-xl border border-border bg-bg px-3 text-[15px] text-fg"
          required
        />
      </div>
      {fehler && (
        <p role="alert" className="flex items-start gap-2 text-sm font-semibold text-status-falsch">
          <span aria-hidden="true">✕</span>
          <span>{fehler}</span>
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full" aria-busy={pending}>
        {pending ? t('ladeStatus') : t('speichern')}
      </Button>
    </form>
  );
}
