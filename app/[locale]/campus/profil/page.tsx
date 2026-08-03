import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { LogoutButton } from '../_components/logout-button';
import { PushOptIn } from '../_components/push-opt-in';
import { ladePushEinstellungen } from '../_lib/push-queries';

/**
 * Profil im Figma-Mobile-Look.
 */
export default async function Profil() {
  const t = await getTranslations('campus');
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profil } = user
    ? await supabase
        .from('profiles')
        .select('benutzername,vorname,nachname,rolle,sprache')
        .eq('id', user.id)
        .maybeSingle()
    : { data: null };

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';
  const push = user ? await ladePushEinstellungen(user.id) : null;

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-4 px-5 pb-6 pt-3">
      <h1 className="text-[22px] font-extrabold leading-7 text-fg">{t('profil')}</h1>

      <section className="space-y-2 rounded-[16px] border border-border bg-surface p-4 text-[14px]">
        <p>
          <span className="text-fg-muted">{t('benutzername')}:</span>{' '}
          <b className="text-fg">{profil?.benutzername ?? '—'}</b>
        </p>
        <p>
          <span className="text-fg-muted">{t('name')}:</span> {profil?.vorname} {profil?.nachname}
        </p>
        <p>
          <span className="text-fg-muted">{t('rolle')}:</span> {profil?.rolle ?? '—'}
        </p>
        <p>
          <span className="text-fg-muted">{t('sprache')}:</span> {profil?.sprache ?? 'de'}
        </p>
      </section>

      {push && vapidPublicKey ? (
        <PushOptIn
          vapidPublicKey={vapidPublicKey}
          einstellungen={push.einstellungen}
          tagesziel={push.tagesziel}
          geraete={push.geraete}
        />
      ) : null}

      <section className="rounded-[16px] border border-border bg-surface p-4">
        <p className="mb-3 text-[13px] text-fg-muted">{t('profilPlatzhalter')}</p>
        <LogoutButton />
      </section>
    </main>
  );
}
