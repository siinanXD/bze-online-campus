import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Card, Button, Chip, ProgressRing } from '@bze/ui';
import { Greeting } from '@/components/shell';
import { WochenberichtKarte, Merkkarte, FokusKarte } from '@/components/dashboard';
import type { Wochenbericht } from '@/components/dashboard';
import { ladeFortsetzenEmpfehlung } from './fortschritt/_lib/queries';
import { ladeFokusStand } from './_lib/push-queries';

export default async function CampusStart({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('campus');
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profil } = user
    ? await supabase.from('profiles').select('vorname').eq('id', user.id).maybeSingle()
    : { data: null };

  const empfehlung = user ? await ladeFortsetzenEmpfehlung(user.id) : null;
  const fokus = user ? await ladeFokusStand(user.id) : null;

  // Neuester Wochenbericht des Teilnehmers (RLS: nur eigener Bericht).
  const { data: berichtRow } = user
    ? await supabase
        .from('wochenberichte')
        .select('id, jahr, kalenderwoche, inhalt, merksaetze, gelesen')
        .eq('user_id', user.id)
        .order('jahr', { ascending: false })
        .order('kalenderwoche', { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null };
  const wochenbericht = (berichtRow as Wochenbericht | null) ?? null;

  const { data: fragen } = await supabase
    .from('fragen')
    .select('thema_id, themen!inner(id,bezeichnung)');
  const themenMap = new Map<string, string>();
  for (const f of (fragen ?? []) as any[]) {
    if (f.themen) themenMap.set(f.themen.id, f.themen.bezeichnung);
  }
  const themen = [...themenMap.entries()];

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <Greeting name={profil?.vorname ?? undefined} />

      {fokus && <FokusKarte stand={fokus} locale={locale} />}

      {empfehlung && (
        <Card className="flex items-center gap-3">
          <ProgressRing
            value={Math.round(empfehlung.anteil * 100)}
            size={56}
            label={`${Math.round(empfehlung.anteil * 100)} %`}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">{t('fortsetzenTitel')}</p>
            <p className="font-semibold">{t('fortsetzenAlsNaechstes', { thema: empfehlung.bezeichnung })}</p>
            <p className="text-sm text-fg-muted">
              {t('fortsetzenRest', {
                offen: empfehlung.kernOffen,
                prozent: Math.round(empfehlung.anteil * 100),
              })}
            </p>
          </div>
          <Link href={`/${locale}/campus/lernen/thema/${empfehlung.themaId}`}>
            <Button>{t('fortsetzenCta')}</Button>
          </Link>
        </Card>
      )}

      {wochenbericht && <WochenberichtKarte bericht={wochenbericht} />}
      <Merkkarte merksaetze={wochenbericht?.merksaetze ?? null} />

      <div className="grid grid-cols-2 gap-3">
        <Link href={`/${locale}/campus/lernen`} className="block">
          <Card className="h-full"><p className="font-semibold">{t('lernen')}</p><p className="text-sm text-fg-muted">{t('lernenInfo')}</p></Card>
        </Link>
        <Link href={`/${locale}/campus/pruefung`} className="block">
          <Card className="h-full"><p className="font-semibold">{t('pruefung')}</p><p className="text-sm text-fg-muted">{t('pruefungInfo')}</p></Card>
        </Link>
      </div>

      <Card>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">{t('themen')}</h2>
        {themen.length === 0 ? (
          <p className="text-sm text-fg-muted">{t('keineThemen')}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {themen.map(([id, name]) => (
              <Link key={id} href={`/${locale}/campus/lernen/thema/${id}`}>
                <Chip>{name}</Chip>
              </Link>
            ))}
          </div>
        )}
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{t('topics')}</p>
          <p className="text-sm text-fg-muted">{t('topicsInfo')}</p>
        </div>
        <Link href={`/${locale}/campus/topic`}><Button variante="sekundaer">{t('oeffnen')}</Button></Link>
      </Card>
    </main>
  );
}
