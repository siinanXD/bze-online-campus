import Link from 'next/link';
import { ZurueckIcon } from '@/components/shell/icons';

/** Gemeinsamer Kopf für Lernwerkzeuge (Figma 04.11 / 04.12 / 04.18). */
export function WerkzeugKopf({
  locale,
  titel,
  untertitel,
}: {
  locale: string;
  titel: string;
  untertitel: string;
}) {
  return (
    <>
      <Link
        href={`/${locale}/campus/lernen`}
        className="touchable inline-flex min-h-10 items-center gap-1 text-[16px] font-semibold text-primary"
      >
        <ZurueckIcon className="h-5 w-5" />
        <span>Lernwerkzeuge</span>
      </Link>
      <header>
        <h1 className="text-[22px] font-extrabold text-fg">{titel}</h1>
        <p className="mt-1 text-[14px] text-fg-muted">{untertitel}</p>
      </header>
    </>
  );
}
