import * as React from 'react';
import { cn } from '../cn';

export type SpinnerGroesse = 'sm' | 'md' | 'lg';

const groessen: Record<SpinnerGroesse, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
  lg: 'h-8 w-8 border-[3px]',
};

export interface SpinnerProps {
  groesse?: SpinnerGroesse;
  /** Wird nur fuer Screenreader ausgegeben. */
  label?: string;
  className?: string;
}

export function Spinner({ groesse = 'md', label = 'Wird geladen', className }: SpinnerProps) {
  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'inline-block animate-spin rounded-full border-current border-e-transparent align-[-0.125em]',
          groessen[groesse],
          className,
        )}
      />
      <span className="sr-only">{label}</span>
    </>
  );
}
