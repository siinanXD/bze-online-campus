import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Badge, Card, LeerZustand } from '@bze/ui';
import { ladeFachbereiche } from './_lib/content-queries';

/**
 * Einstieg in die Fachkunde-Navigation: Fachbereich -> Thema -> Unterthema -> Lernmodul.
 */
export default async function FachkundeIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('topic.content');
  const supabase = await createServerSupabase();
  const fachbereiche = await ladeFachbereiche(supabase);

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4 pb-8">
      <header className="space-y-1 pt-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t('navigation.fachkunde')}</p>
        <h1 className="text-2xl font-extrabold text-fg">{t('index.titel')}</h1>
        <p className="text-sm text-fg-muted">{t('index.beschreibung')}</p>
      </header>

      {fachbereiche.length === 0 ? (
        <LeerZustand titel={t('leer.fachbereicheTitel')} text={t('leer.fachbereicheText')} />
      ) : (
        <ul className="space-y-3">
          {fachbereiche.map((fachbereich) => (
            <li key={fachbereich.id}>
              <Link href={`/${locale}/campus/topic/fachbereich/${fachbereich.id}`} className="block">
                <Card variante="interaktiv" className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-fg">{fachbereich.bezeichnung}</h2>
                      {fachbereich.beschreibung && (
                        <p className="mt-1 text-sm text-fg-muted">{fachbereich.beschreibung}</p>
                      )}
                    </div>
                    <Badge variante="info" symbol="i">
                      {t('index.themenAnzahl', { anzahl: fachbereich.themenAnzahl })}
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
