import Link from 'next/link';
import { cn } from '@bze/ui';

export type LerneinheitKartenStatus = 'fertig' | 'aktuell' | 'offen';

const STATUS_STILE: Record<
  LerneinheitKartenStatus,
  { karte: string; label: string; text: string }
> = {
  fertig: {
    karte: 'border-success-border bg-success-bg',
    label: 'text-success',
    text: 'fertig',
  },
  aktuell: {
    karte: 'border-primary-border bg-primary-subtle',
    label: 'text-primary',
    text: 'aktuell',
  },
  offen: {
    karte: 'border-border bg-surface',
    label: 'text-fg-muted',
    text: 'offen',
  },
};

export interface LerneinheitKarteProps {
  href: string;
  nummer: number;
  titel: string;
  status: LerneinheitKartenStatus;
  meta?: string;
}

/**
 * Statuskarte wie Figma Mobile / Lernpfad (8:18): radius 14, Statusfarbe + Textlabel.
 */
export function LerneinheitKarte({ href, nummer, titel, status, meta }: LerneinheitKarteProps) {
  const stil = STATUS_STILE[status];
  const nummerText = String(nummer).padStart(2, '0');

  return (
    <Link
      href={href}
      className={cn(
        'touchable block rounded-[14px] border p-[14px] shadow-sm transition hover:brightness-[0.99]',
        stil.karte,
      )}
    >
      <p className="text-[14px] font-medium leading-5 text-fg">
        {nummerText} · {titel}
      </p>
      <p className={cn('mt-1.5 text-[12px] leading-[18px]', stil.label)}>
        {stil.text}
        {meta ? ` · ${meta}` : ''}
      </p>
    </Link>
  );
}

/**
 * Lernpfad-Status. Demo folgt Figma-Beispiel: 01 fertig, 02 aktuell, Rest offen.
 */
export function lerneinheitKartenStatus(
  zeilen: Array<{ kapitelGesamt: number; kapitelGelesen: number }>,
  index: number,
  demoModus: boolean,
): LerneinheitKartenStatus {
  if (demoModus) {
    if (index === 0) return 'fertig';
    if (index === 1) return 'aktuell';
    return 'offen';
  }

  const istFertig = (z: { kapitelGesamt: number; kapitelGelesen: number }) =>
    z.kapitelGesamt > 0 && z.kapitelGelesen >= z.kapitelGesamt;

  if (istFertig(zeilen[index]!)) return 'fertig';

  const ersteOffene = zeilen.findIndex((z) => !istFertig(z));
  if (index === ersteOffene) return 'aktuell';
  return 'offen';
}
