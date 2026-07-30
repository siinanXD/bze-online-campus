import * as React from 'react';
import { cn } from './cn';

export function Chip({
  active,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'touchable whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition',
        active
          ? 'border-primary bg-primary text-fg-onPrimary'
          : 'border-border-strong bg-surface text-fg hover:border-primary',
        className,
      )}
      aria-pressed={active}
      {...props}
    >
      {children}
    </button>
  );
}
