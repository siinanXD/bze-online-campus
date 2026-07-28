import * as React from 'react';
import { cn } from './cn';
export function Chip({ active, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn('touchable whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition',
        active ? 'border-accent bg-accent text-accent-fg' : 'border-border bg-surface text-fg hover:border-accent')}
      aria-pressed={active}
      {...props}
    />
  );
}
