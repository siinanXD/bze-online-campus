import Link from 'next/link';

/**
 * Figma Mobile / Lerneinheit Topbar: Zurueck + Lesedauer auf Surface-Leiste.
 */
export function LerneinheitKopfzeile({
  zurueckHref,
  zurueckLabel,
  lesedauerLabel,
}: {
  zurueckHref: string;
  zurueckLabel: string;
  lesedauerLabel: string;
}) {
  return (
    <div className="-mx-4 mb-3 flex items-center justify-between bg-surface px-4 pb-3 pt-4">
      <Link href={zurueckHref} className="touchable text-[14px] leading-[22px] text-primary">
        {zurueckLabel}
      </Link>
      <p className="text-[12px] leading-[18px] text-fg-muted">{lesedauerLabel}</p>
    </div>
  );
}
