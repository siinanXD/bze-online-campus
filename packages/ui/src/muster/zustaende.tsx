import * as React from 'react';
import { cn } from '../cn';
import { Skeleton } from '../primitive/anzeige';

/* ---------------------------------------------------------- LeerZustand */

export interface LeerZustandProps {
  symbol?: React.ReactNode;
  titel: React.ReactNode;
  /** Ein Satz, der erklaert, warum hier nichts steht. */
  text: React.ReactNode;
  /** Genau eine Handlungsaufforderung. */
  aktion?: React.ReactNode;
  className?: string;
}

export function LeerZustand({
  symbol = '◔',
  titel,
  text,
  aktion,
  className,
}: LeerZustandProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg',
        'border border-dashed border-border-strong bg-surface px-6 py-12 text-center',
        className,
      )}
    >
      <span aria-hidden="true" className="text-h1 text-fg-subtle">
        {symbol}
      </span>
      <p className="text-h4">{titel}</p>
      <p className="max-w-lese text-body-sm text-fg-muted">{text}</p>
      {aktion && <div className="pt-2">{aktion}</div>}
    </div>
  );
}

/* --------------------------------------------------------- FehlerZustand */

export interface FehlerZustandProps {
  titel?: React.ReactNode;
  /** Verstaendlicher Grund in einfacher Sprache, keine Codes. */
  text: React.ReactNode;
  aktion?: React.ReactNode;
  /** Technische Details, standardmaessig zugeklappt. */
  details?: string;
  className?: string;
}

export function FehlerZustand({
  titel = 'Das hat nicht geklappt',
  text,
  aktion,
  details,
  className,
}: FehlerZustandProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg',
        'border border-danger-border bg-danger-bg px-6 py-12 text-center',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-danger text-h4 font-bold text-white"
      >
        !
      </span>
      <p className="text-h4">{titel}</p>
      <p className="max-w-lese text-body-sm text-fg-muted">{text}</p>
      {aktion && <div className="pt-2">{aktion}</div>}
      {details && (
        <details className="mt-2 w-full max-w-lese text-start">
          <summary className="cursor-pointer text-caption text-fg-muted">
            Technische Details
          </summary>
          <pre className="mt-2 overflow-x-auto rounded-sm bg-surface p-3 text-caption text-fg-muted">
            {details}
          </pre>
        </details>
      )}
    </div>
  );
}

/* ----------------------------------------------------------- LadeZustand */

export interface LadeZustandProps {
  art?: 'liste' | 'detail' | 'formular' | 'tabelle';
  /** Wird Screenreadern angesagt. */
  label?: string;
  className?: string;
}

/**
 * Skeletons in der Form des spaeteren Inhalts — kein zentrierter Spinner
 * fuer ganze Seiten, sonst springt das Layout beim Nachladen.
 */
export function LadeZustand({
  art = 'liste',
  label = 'Inhalte werden geladen',
  className,
}: LadeZustandProps) {
  return (
    <div aria-busy="true" aria-live="polite" className={cn('space-y-4', className)}>
      <span className="sr-only">{label}</span>

      {art === 'liste' &&
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-surface p-5">
            <Skeleton className="mb-3 h-5 w-1/2" />
            <Skeleton className="mb-2 h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}

      {art === 'detail' && (
        <>
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </>
      )}

      {art === 'formular' && (
        <div className="max-w-formular space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          ))}
          <Skeleton className="h-11 w-32 rounded-md" />
        </div>
      )}

      {art === 'tabelle' && (
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="border-b border-border bg-bg-subtle p-3">
            <Skeleton className="h-4 w-1/3" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 border-b border-border p-3 last:border-0">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-1/6" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
