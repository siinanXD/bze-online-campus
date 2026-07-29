import * as React from 'react';
import { cn } from '../cn';

/* ---------------------------------------------------------------- Badge */

export type BadgeVariante =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

const badgeVarianten: Record<BadgeVariante, string> = {
  neutral: 'bg-bg-subtle text-fg-muted border-border',
  primary: 'bg-primary-subtle text-primary border-primary-border',
  success: 'bg-success-bg text-success border-success-border',
  warning: 'bg-warning-bg text-warning border-warning-border',
  danger: 'bg-danger-bg text-danger border-danger-border',
  info: 'bg-info-bg text-info border-info-border',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variante?: BadgeVariante;
  groesse?: 'sm' | 'md';
  symbol?: React.ReactNode;
}

export function Badge({
  variante = 'neutral',
  groesse = 'md',
  symbol,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border font-medium',
        groesse === 'sm' ? 'px-1.5 py-0.5 text-caption' : 'px-2 py-1 text-caption',
        badgeVarianten[variante],
        className,
      )}
      {...props}
    >
      {symbol && <span aria-hidden="true">{symbol}</span>}
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- Alert */

export type AlertVariante = 'info' | 'success' | 'warning' | 'danger';

const alertVarianten: Record<AlertVariante, { box: string; symbol: string }> = {
  info: { box: 'bg-info-bg border-info-border text-fg', symbol: 'i' },
  success: { box: 'bg-success-bg border-success-border text-fg', symbol: '✓' },
  warning: { box: 'bg-warning-bg border-warning-border text-fg', symbol: '!' },
  danger: { box: 'bg-danger-bg border-danger-border text-fg', symbol: '✕' },
};

const alertSymbolFarbe: Record<AlertVariante, string> = {
  info: 'bg-info text-white',
  success: 'bg-success text-white',
  warning: 'bg-warning text-white',
  danger: 'bg-danger text-white',
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variante?: AlertVariante;
  titel: React.ReactNode;
  aktion?: React.ReactNode;
}

/**
 * Warnung und Fehler erscheinen nie als gefuellte Flaeche — so bleiben sie
 * vom bernsteinfarbenen Primaerbutton unterscheidbar.
 * Die Bedeutung traegt immer Symbol + Titel, nicht die Farbe allein.
 */
export function Alert({
  variante = 'info',
  titel,
  aktion,
  className,
  children,
  ...props
}: AlertProps) {
  const v = alertVarianten[variante];
  const dringend = variante === 'warning' || variante === 'danger';

  return (
    <div
      role={dringend ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-lg border p-4', v.box, className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-caption font-bold',
          alertSymbolFarbe[variante],
        )}
      >
        {v.symbol}
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-label font-semibold">{titel}</p>
        {children && <div className="text-body-sm text-fg-muted">{children}</div>}
        {aktion && <div className="pt-1">{aktion}</div>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Progress */

export interface ProgressProps {
  /** 0 bis 100. */
  wert: number;
  label: string;
  /** Zeigt die Prozentzahl neben dem Balken. */
  zahlSichtbar?: boolean;
  className?: string;
}

export function Progress({ wert, label, zahlSichtbar = true, className }: ProgressProps) {
  const sicher = Math.max(0, Math.min(100, Math.round(wert)));

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        role="progressbar"
        aria-valuenow={sicher}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-2 flex-1 overflow-hidden rounded-full bg-border"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-DEFAULT"
          /* Breite ist berechnet, deshalb hier ausnahmsweise ein Inline-Wert. */
          style={{ width: `${sicher}%` }}
        />
      </div>
      {zahlSichtbar && (
        <span className="zahlen w-10 shrink-0 text-end text-caption text-fg-muted">
          {sicher}%
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- Skeleton */

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-sm bg-border', className)}
      {...props}
    />
  );
}

/* --------------------------------------------------------------- Avatar */

const avatarGroessen = {
  24: 'h-6 w-6 text-[10px]',
  32: 'h-8 w-8 text-caption',
  40: 'h-10 w-10 text-label',
  48: 'h-12 w-12 text-body',
} as const;

export interface AvatarProps {
  name: string;
  groesse?: keyof typeof avatarGroessen;
  className?: string;
}

/** Initialen mit deterministischer Neutralfarbe — nie Statusfarben. */
export function Avatar({ name, groesse = 40, className }: AvatarProps) {
  const initialen = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((teil) => teil[0]?.toUpperCase() ?? '')
    .join('');

  const toene = ['bg-border', 'bg-border-strong', 'bg-bg-subtle'];
  const summe = Array.from(name).reduce((s, z) => s + z.charCodeAt(0), 0);

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-fg-muted',
        avatarGroessen[groesse],
        toene[summe % toene.length],
        className,
      )}
      aria-hidden="true"
    >
      {initialen}
    </span>
  );
}
