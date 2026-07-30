import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Badge, Card, LeerZustand } from '@bze/ui';
import { ladeFachbereich, ladeThemenFuerFachbereich } from '../../_lib/content-queries';

/**
 * Zeigt die Themen eines Fachbereichs.
 */
export default async function FachbereichSeite({
  params,
}: {
  params: Promise<{ locale: string; fachbereichId: string }>;
}) {
  const { locale, fachbereichId } = await params;
  const t = await getTranslations('topic.content');
  const supabase = await createServerSupabase();
  const [fachbereich, themen] = await Promise.all([
    ladeFachbereich(supabase, fachbereichId),
    ladeThemenFuerFachbereich(supabase, fachbereichId),
  ]);
  if (!fachbereich) notFound();

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4 pb-8">
      <header className="space-y-1 pt-2">
        <Link href={`/${locale}/campus/topic`} className="text-xs font-semibold uppercase tracking-wide text-primary">
          {t('navigation.zurFachkunde')}
        </Link>
        <h1 className="text-2xl font-extrabold text-fg">{fachbereich.bezeichnung}</h1>
        {fachbereich.beschreibung && <p className="text-sm text-fg-muted">{fachbereich.beschreibung}</p>}
      </header>

      {themen.length === 0 ? (
        <LeerZustand titel={t('leer.themenTitel')} text={t('leer.themenText')} />
      ) : (
        <ul className="space-y-3">
          {themen.map((thema) => (
            <li key={thema.id}>
              <Link href={`/${locale}/campus/topic/${thema.id}`} className="block">
                <Card variante="interaktiv" className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-fg">{thema.bezeichnung}</h2>
                      {thema.beschreibung && <p className="mt-1 text-sm text-fg-muted">{thema.beschreibung}</p>}
                    </div>
                    <Badge variante="neutral" symbol=">">
                      {t('navigation.thema')}
                    </Badge>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
