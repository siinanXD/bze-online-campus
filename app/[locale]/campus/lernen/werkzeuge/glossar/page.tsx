import { InteraktiveBegriffListe } from '@bze/ui';
import { WerkzeugKopf } from '../_components/werkzeug-kopf';

/**
 * Figma 04.18 Glossar — Einstieg in die Begriffsliste.
 */
export default async function GlossarSeite({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-4 px-5 pb-6 pt-3">
      <WerkzeugKopf
        locale={locale}
        titel="Glossar"
        untertitel="Fachbegriffe mit einfacher und fachlicher Erklärung. Tippe einen Begriff an."
      />
      <InteraktiveBegriffListe
        begriffe={[
          'Messschieber',
          'Nonius',
          'Nennmass',
          'Toleranz',
          'Passung',
          'Istmass',
          'Hauptskala',
          'Tiefenstange',
        ]}
      />
    </main>
  );
}
