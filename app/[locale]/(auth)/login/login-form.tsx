'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@bze/ui';
import { createBrowserSupabase } from '@bze/db';
import type { Rolle } from '@bze/db';
import { loginSchema } from '../lib/schemas';
import { benutzernameZuEmail } from '../lib/benutzername';

/** Muss mit der Rollenweiche in middleware.ts synchron bleiben (Spec §6.2.1). */
const ROLLEN_STARTSEITE: Record<Rolle, string> = {
  teilnehmer: 'campus',
  ausbilder: 'ausbilder',
  verwaltung: 'admin',
  admin: 'admin',
};

export function LoginForm({ locale }: { locale: string }) {
  const t = useTranslations('auth.login');
  const tFehler = useTranslations('auth.fehler');
  const router = useRouter();

  const [benutzername, setBenutzername] = useState('');
  const [passwort, setPasswort] = useState('');
  const [fehler, setFehler] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function absenden(ereignis: FormEvent<HTMLFormElement>) {
    ereignis.preventDefault();
    setFehler(null);

    const ergebnis = loginSchema.safeParse({ benutzername, passwort });
    if (!ergebnis.success) {
      setFehler(tFehler('pflichtfeld'));
      return;
    }

    startTransition(async () => {
      const supabase = createBrowserSupabase();
      const { data: anmeldung, error: anmeldeFehler } = await supabase.auth.signInWithPassword({
        email: benutzernameZuEmail(ergebnis.data.benutzername),
        password: ergebnis.data.passwort,
      });

      if (anmeldeFehler || !anmeldung.user) {
        setFehler(tFehler('anmeldungFehlgeschlagen'));
        return;
      }

      const { data: profil, error: profilFehler } = await supabase
        .from('profiles')
        .select('rolle, muss_passwort_aendern')
        .eq('id', anmeldung.user.id)
        .maybeSingle();

      if (profilFehler || !profil) {
        setFehler(tFehler('serverfehler'));
        return;
      }

      if (profil.muss_passwort_aendern) {
        router.replace(`/${locale}/passwort-aendern`);
        return;
      }

      // Teilnehmer ohne Kohorte werden zur Sprachwahl/Kohortenbeitritt geleitet (Spec §6.2.2),
      // sind aber danach nicht gesperrt — jedes Topic bleibt offen (Grundregel 11).
      if (profil.rolle === 'teilnehmer') {
        const { count } = await supabase
          .from('kohorten_mitglieder')
          .select('kohorte_id', { count: 'exact', head: true })
          .eq('user_id', anmeldung.user.id);

        router.replace(`/${locale}/${!count ? 'sprachwahl' : ROLLEN_STARTSEITE.teilnehmer}`);
        return;
      }

      router.replace(`/${locale}/${ROLLEN_STARTSEITE[profil.rolle as Rolle] ?? 'campus'}`);
    });
  }

  return (
    <form onSubmit={absenden} className="space-y-4" noValidate>
      <div>
        <label htmlFor="benutzername" className="mb-1 block text-start text-sm font-semibold">
          {t('benutzername')}
        </label>
        <input
          id="benutzername"
          name="username"
          autoComplete="username"
          value={benutzername}
          onChange={(ereignis) => setBenutzername(ereignis.target.value)}
          className="touchable w-full rounded-xl border border-border bg-bg px-3 text-[15px] text-fg"
          required
        />
      </div>
      <div>
        <label htmlFor="passwort" className="mb-1 block text-start text-sm font-semibold">
          {t('passwort')}
        </label>
        <input
          id="passwort"
          name="password"
          type="password"
          autoComplete="current-password"
          value={passwort}
          onChange={(ereignis) => setPasswort(ereignis.target.value)}
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
        {pending ? t('ladeStatus') : t('anmelden')}
      </Button>
    </form>
  );
}
