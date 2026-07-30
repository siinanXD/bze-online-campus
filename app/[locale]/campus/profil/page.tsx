import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Card } from '@bze/ui';
import { LogoutButton } from '../_components/logout-button';
import { PushOptIn } from '../_components/push-opt-in';
import { ladePushEinstellungen } from '../_lib/push-queries';

export default async function Profil() {
  const t = await getTranslations('campus');
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profil } = user
    ? await supabase.from('profiles').select('benutzername,vorname,nachname,rolle,sprache').eq('id', user.id).maybeSingle()
    : { data: null };

  // Der öffentliche VAPID-Schlüssel darf im Client stehen; der private bleibt
  // ausschließlich in der Edge Function. Fehlt der Schlüssel, meldet die
  // Opt-in-Karte kein Abo an (leerer String → Knopf ohne Wirkung, deshalb
  // wird die Karte in diesem Fall gar nicht erst gerendert).
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';
  const push = user ? await ladePushEinstellungen(user.id) : null;

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <h1 className="pt-2 text-2xl font-extrabold">{t('profil')}</h1>
      <Card className="space-y-1.5">
        <p><span className="text-fg-muted">{t('benutzername')}:</span> <b>{profil?.benutzername ?? '—'}</b></p>
        <p><span className="text-fg-muted">{t('name')}:</span> {profil?.vorname} {profil?.nachname}</p>
        <p><span className="text-fg-muted">{t('rolle')}:</span> {profil?.rolle ?? '—'}</p>
        <p><span className="text-fg-muted">{t('sprache')}:</span> {profil?.sprache ?? 'de'}</p>
      </Card>

      {push && vapidPublicKey && (
        <PushOptIn
          vapidPublicKey={vapidPublicKey}
          einstellungen={push.einstellungen}
          tagesziel={push.tagesziel}
          geraete={push.geraete}
        />
      )}

      <Card>
        <p className="mb-3 text-sm text-fg-muted">{t('profilPlatzhalter')}</p>
        <LogoutButton />
      </Card>
    </main>
  );
}
