'use client';

import * as React from 'react';
import { cn } from '../cn';

export interface FormularfeldProps {
  label: React.ReactNode;
  /** Wird als Wort "Pflicht" gekennzeichnet, nicht nur als Sternchen. */
  pflicht?: boolean;
  pflichtLabel?: string;
  hinweis?: React.ReactNode;
  fehler?: React.ReactNode;
  className?: string;
  /** Bekommt id, aria-describedby und aria-invalid automatisch gesetzt. */
  children: (props: {
    id: string;
    'aria-describedby': string | undefined;
    fehler: boolean;
    required: boolean;
  }) => React.ReactNode;
}

export function Formularfeld({
  label,
  pflicht = false,
  pflichtLabel = 'Pflicht',
  hinweis,
  fehler,
  className,
  children,
}: FormularfeldProps) {
  const id = React.useId();
  const hinweisId = `${id}-hinweis`;
  const fehlerId = `${id}-fehler`;

  const beschriebenVon =
    [hinweis ? hinweisId : null, fehler ? fehlerId : null].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="flex items-center gap-2 text-label">
        <span>{label}</span>
        {pflicht && (
          <span className="text-caption font-normal text-fg-muted">({pflichtLabel})</span>
        )}
      </label>

      {hinweis && (
        <p id={hinweisId} className="text-caption text-fg-muted">
          {hinweis}
        </p>
      )}

      {children({
        id,
        'aria-describedby': beschriebenVon,
        fehler: Boolean(fehler),
        required: pflicht,
      })}

      {fehler && (
        <p id={fehlerId} className="flex items-start gap-1.5 text-caption text-danger">
          <span aria-hidden="true">✕</span>
          <span>{fehler}</span>
        </p>
      )}
    </div>
  );
}
