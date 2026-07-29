'use client';

import * as React from 'react';
import { cn } from '../cn';
import { Input } from '../primitive/eingabe';

export interface SuchfeldProps {
  label: string;
  platzhalter?: string;
  wert?: string;
  onSuche: (wert: string) => void;
  /** Entprellung in Millisekunden. */
  verzoegerung?: number;
  /** Wird als aria-live angesagt, z. B. "12 Treffer". */
  ergebnisText?: string;
  loeschenLabel?: string;
  className?: string;
}

export function Suchfeld({
  label,
  platzhalter,
  wert,
  onSuche,
  verzoegerung = 300,
  ergebnisText,
  loeschenLabel = 'Suche loeschen',
  className,
}: SuchfeldProps) {
  const id = React.useId();
  const [intern, setIntern] = React.useState(wert ?? '');
  const onSucheRef = React.useRef(onSuche);

  React.useEffect(() => {
    onSucheRef.current = onSuche;
  }, [onSuche]);

  React.useEffect(() => {
    const t = setTimeout(() => onSucheRef.current(intern), verzoegerung);
    return () => clearTimeout(t);
  }, [intern, verzoegerung]);

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type="search"
          value={intern}
          placeholder={platzhalter ?? label}
          onChange={(e) => setIntern(e.target.value)}
          praefix={<span aria-hidden="true">⌕</span>}
          className={intern ? 'pe-11' : undefined}
        />
        {intern && (
          <button
            type="button"
            onClick={() => setIntern('')}
            aria-label={loeschenLabel}
            className="absolute inset-y-0 end-0 flex w-11 items-center justify-center text-fg-muted hover:text-fg"
          >
            <span aria-hidden="true">✕</span>
          </button>
        )}
      </div>
      {ergebnisText && (
        <p aria-live="polite" className="text-caption text-fg-muted">
          {ergebnisText}
        </p>
      )}
    </div>
  );
}
