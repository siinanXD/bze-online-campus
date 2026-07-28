import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Card } from '@bze/ui';
import { LogoutButton } from '../_components/logout-button';

export default async function Profil() {
  const t = await getTranslations('campus');
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profil } = user
    ? await supabase.from('profiles').select('benutzername,vorname,nachname,rolle,sprache').eq('id', user.id).maybeSingle()
    : { data: null };

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <h1 className="pt-2 text-2xl font-extrabold">{t('profil')}</h1>
      <Card className="space-y-1.5">
        <p><span className="text-muted">{t('benutzername')}:</span> <b>{profil?.benutzername ?? '—'}</b></p>
        <p><span className="text-muted">{t('name')}:</span> {profil?.vorname} {profil?.nachname}</p>
        <p><span className="text-muted">{t('rolle')}:</span> {profil?.rolle ?? '—'}</p>
        <p><span className="text-muted">{t('sprache')}:</span> {profil?.sprache ?? 'de'}</p>
      </Card>
      <Card>
        <p className="mb-3 text-sm text-muted">{t('profilPlatzhalter')}</p>
        <LogoutButton />
      </Card>
    </main>
  );
}
