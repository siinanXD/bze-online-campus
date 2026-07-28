import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Card } from '@bze/ui';
import { LogoutButton } from '../campus/_components/logout-button';

export default async function AusbilderCockpit() {
  const t = await getTranslations('ausbilder');
  const supabase = await createServerSupabase();
  const { data: zuw } = await supabase
    .from('ausbilder_zuweisungen')
    .select('profiles!ausbilder_zuweisungen_teilnehmer_id_fkey(benutzername,vorname,nachname)');

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-extrabold">{t('cockpit')}</h1>
        <LogoutButton />
      </div>
      <p className="text-muted">{t('hinweis')}</p>
      <Card>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-accent">{t('teilnehmer')}</h2>
        {!zuw || zuw.length === 0 ? (
          <p className="text-sm text-muted">{t('keineTeilnehmer')}</p>
        ) : (
          <ul className="divide-y divide-border">
            {(zuw as any[]).map((z, i) => (
              <li key={i} className="py-2 text-sm">
                {z.profiles?.vorname} {z.profiles?.nachname} <span className="text-muted">({z.profiles?.benutzername})</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </main>
  );
}
