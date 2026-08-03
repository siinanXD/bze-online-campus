import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

const LINKS = [
  ['uebersicht', ''],
  ['themen', 'themen'],
  ['lernziele', 'lernziele'],
  ['inhalte', 'inhalte'],
  ['fragen', 'inhalte?typ=single_choice'],
  ['lernkarten', 'inhalte?typ=lernkarte'],
  ['praxisfaelle', 'inhalte?typ=praxisfall'],
  ['rechenaufgaben', 'inhalte?typ=rechenaufgabe'],
  ['quizze', 'quizze'],
  ['kiGenerator', 'ki-generator'],
  ['qualitaetspruefung', 'qualitaetspruefung'],
  ['fachkundeFreigabe', 'fachkunde-freigabe'],
  ['wissensdatenbank', 'wissensdatenbank'],
] as const;

/**
 * Untermenue fuer die Content-Verwaltung.
 */
export async function ContentNav({ locale }: { locale: string }) {
  const t = await getTranslations('admin.content.nav');
  return (
    <nav aria-label={t('label')} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {LINKS.map(([key, href]) => (
        <Link
          key={key}
          href={`/${locale}/admin/content${href ? `/${href}` : ''}`}
          className="touchable inline-flex whitespace-nowrap rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-fg hover:bg-bg"
        >
          {t(key)}
        </Link>
      ))}
    </nav>
  );
}
