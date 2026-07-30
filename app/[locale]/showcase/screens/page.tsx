import Link from 'next/link';
import { Badge, Card } from '@bze/ui';
import { SCREENS } from './_lib/registry';

export default async function ScreenUebersicht({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const bereiche = ['Teilnehmende', 'Ausbilder', 'Admin'] as const;

  return (
    <main id="inhalt" className="mx-auto max-w-campus space-y-8 px-4 py-8 md:px-8">
      <header className="space-y-2">
        <p className="text-overline uppercase text-fg-subtle">BZE Online Campus</p>
        <h1 className="text-h1">Screen-Entwürfe</h1>
        <p className="max-w-lese text-body text-fg-muted">
          Diese Seiten benutzen dieselben Komponenten und dieselbe Shell wie die
          echte App, aber feste Beispieldaten statt Supabase. So lässt sich das
          Design ohne Datenbank und ohne Anmeldung begutachten.
        </p>
      </header>

      {bereiche.map((bereich) => (
        <section key={bereich} className="space-y-3">
          <h2 className="text-h2">{bereich}</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SCREENS.filter((s) => s.bereich === bereich).map((s) => (
              <li key={s.slug}>
                <Link href={`/${locale}/showcase/screens/${s.slug}`} className="block h-full">
                  <Card variante="interaktiv" className="h-full">
                    <p className="text-h4">{s.titel}</p>
                    <p className="mt-1 break-all text-caption text-fg-muted">{s.route}</p>
                    <div className="mt-3">
                      <Badge variante="neutral">{s.slug}</Badge>
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
