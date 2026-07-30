import * as React from 'react';
import { cn } from '../cn';
import { Spinner } from './spinner';

export type ButtonVariante = 'primary' | 'sekundaer' | 'leise' | 'gefahr' | 'link';
export type ButtonGroesse = 'sm' | 'md' | 'lg';

const varianten: Record<ButtonVariante, string> = {
  primary:
    'bg-primary text-fg-onPrimary border border-transparent ' +
    'hover:bg-primary-hover active:bg-primary-active',
  sekundaer:
    'bg-surface text-fg border border-border-strong ' +
    'hover:bg-bg-subtle hover:border-fg-subtle active:bg-border',
  leise:
    'bg-transparent text-fg border border-transparent ' +
    'hover:bg-bg-subtle active:bg-border',
  gefahr:
    'bg-danger text-white border border-transparent ' +
    'hover:brightness-90 active:brightness-75',
  link:
    'bg-transparent text-primary underline underline-offset-4 border-0 ' +
    'hover:text-primary-hover p-0 h-auto min-h-0',
};

const groessen: Record<ButtonGroesse, string> = {
  sm: 'h-9 px-3 text-label gap-1.5',
  md: 'h-11 px-4 text-label gap-2',
  lg: 'h-12 px-6 text-body gap-2',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: ButtonVariante;
  groesse?: ButtonGroesse;
  /** Zeigt einen Spinner, sperrt den Button und setzt aria-busy. */
  laedt?: boolean;
  iconLinks?: React.ReactNode;
  iconRechts?: React.ReactNode;
  volleBreite?: boolean;
}

export function Button({
  variante = 'primary',
  groesse = 'md',
  laedt = false,
  iconLinks,
  iconRechts,
  volleBreite = false,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const gesperrt = disabled || laedt;

  return (
    <button
      type={type}
      disabled={gesperrt}
      aria-busy={laedt || undefined}
      aria-disabled={gesperrt || undefined}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium',
        'transition-colors duration-DEFAULT',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none',
        varianten[variante],
        variante !== 'link' && groessen[groesse],
        volleBreite && 'w-full',
        className,
      )}
      {...props}
    >
      {/* Der Spinner ersetzt das linke Icon, damit die Breite konstant bleibt. */}
      {laedt ? <Spinner groesse="sm" label="" /> : iconLinks}
      {children}
      {!laedt && iconRechts}
    </button>
  );
}

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'volleBreite'> {
  /** Pflicht: ohne sichtbaren Text braucht der Button einen Namen. */
  'aria-label': string;
  icon: React.ReactNode;
}

export function IconButton({
  icon,
  groesse = 'md',
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button
      groesse={groesse}
      className={cn(
        'p-0',
        groesse === 'lg' ? 'w-12' : groesse === 'md' ? 'w-11' : 'w-9',
        className,
      )}
      {...props}
    >
      {icon}
    </Button>
  );
}
