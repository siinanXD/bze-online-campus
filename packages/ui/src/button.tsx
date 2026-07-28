import * as React from 'react';
import { cn } from './cn';

type Variant = 'primary' | 'ghost' | 'soft';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}
const styles: Record<Variant, string> = {
  primary: 'bg-accent text-accent-fg hover:brightness-110',
  soft: 'bg-surface text-fg border border-border hover:bg-bg',
  ghost: 'bg-transparent text-fg hover:bg-surface',
};
export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'touchable inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[15px] font-semibold transition',
        'disabled:opacity-50 disabled:pointer-events-none',
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
