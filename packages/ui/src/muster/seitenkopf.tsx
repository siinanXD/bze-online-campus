import * as React from 'react';
import { cn } from '../cn';

export interface SeitenkopfProps {
  titel: React.ReactNode;
  beschreibung?: React.ReactNode;
  aktionen?: React.ReactNode;
  /** Wird links vor dem Titel gerendert, z. B. ein Zurueck-Link. */
  zurueck?: React.ReactNode;
  /** Auf Mobil ausgeblendet. */
  brotkrumen?: React.ReactNode;
  /** Genau ein h1 pro Seite — Unterseiten setzen hier h2. */
  ebene?: 'h1' | 'h2';
  className?: string;
}

export function Seitenkopf({
  titel,
  beschreibung,
  aktionen,
  zurueck,
  brotkrumen,
  ebene = 'h1',
  className,
}: SeitenkopfProps) {
  const Ueberschrift = ebene;

  return (
    <header className={cn('mb-6 space-y-2 md:mb-8', className)}>
      {brotkrumen && <div className="hidden md:block">{brotkrumen}</div>}

      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            {zurueck}
            <Ueberschrift className="text-h2 md:text-h1">{titel}</Ueberschrift>
          </div>
          {beschreibung && (
            <p className="max-w-lese text-body-sm text-fg-muted">{beschreibung}</p>
          )}
        </div>

        {aktionen && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{aktionen}</div>
        )}
      </div>
    </header>
  );
}
