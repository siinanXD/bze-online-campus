import * as React from 'react';
import { cn } from '../cn';

export type CardVariante = 'flach' | 'erhoben' | 'interaktiv';

const varianten: Record<CardVariante, string> = {
  flach: 'border-border',
  erhoben: 'border-border shadow-sm',
  interaktiv:
    'border-border shadow-sm transition-shadow duration-DEFAULT ' +
    'hover:border-border-strong hover:shadow-md',
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variante?: CardVariante;
  /** Kompakt fuer Ausbilder/Admin, luftig fuer den Campus. */
  dichte?: 'luftig' | 'kompakt';
}

export function Card({
  variante = 'erhoben',
  dichte = 'luftig',
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-surface',
        dichte === 'luftig' ? 'p-5' : 'p-4',
        varianten[variante],
        className,
      )}
      {...props}
    />
  );
}

export function CardKopf({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mb-4 flex items-start justify-between gap-3', className)}
      {...props}
    />
  );
}

export function CardTitel({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-h3', className)} {...props} />;
}

export function CardFuss({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-4 flex items-center gap-3 border-t border-border pt-4', className)}
      {...props}
    />
  );
}
