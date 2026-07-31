import { getTranslations } from 'next-intl/server';
import { Card, LeerZustand } from '@bze/ui';
import { ladeAdminSitzung } from '../../_lib/auth';
import { ContentNav } from '../_components/content-nav';

const BEREICHE = new Set(['themen', 'lernziele', 'quizze', 'ki-generator', 'qualitaetspruefung', 'wissensdatenbank']);

/**
 * Platzhalter fuer Content-Unterbereiche, die erst in spaeteren Phasen echte Funktionen erhalten.
 */
export default async function ContentBereichPlatzhalter({
  params,
}: {
  params: Promise<{ locale: string; bereich: string }>;
}) {
  const { locale, bereich } = await params;
  const t = await getTranslations('admin.content');
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return null;
  const key = BEREICHE.has(bereich) ? bereich.replace('-', '') : 'unbekannt';

  return (
    <div className="space-y-4">
      <ContentNav locale={locale} />
      <Card>
        <LeerZustand
          titel={t(`platzhalter.${key}.titel`)}
          text={t(`platzhalter.${key}.text`)}
        />
      </Card>
    </div>
  );
}
