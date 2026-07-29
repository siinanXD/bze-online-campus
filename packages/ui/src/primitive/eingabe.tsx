import * as React from 'react';
import { cn } from '../cn';

const basis =
  'w-full rounded-md border bg-surface text-body text-fg ' +
  'placeholder:text-fg-subtle transition-colors duration-DEFAULT ' +
  'hover:border-border-strong ' +
  'disabled:cursor-not-allowed disabled:bg-bg-subtle disabled:text-fg-subtle ' +
  'read-only:bg-bg-subtle';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Faerbt den Rand und setzt aria-invalid. Der Fehlertext gehoert ins Formularfeld. */
  fehler?: boolean;
  praefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { fehler, praefix, suffix, className, ...props },
  ref,
) {
  const feld = (
    <input
      ref={ref}
      aria-invalid={fehler || undefined}
      className={cn(
        basis,
        'h-11 px-3',
        fehler ? 'border-danger' : 'border-border',
        praefix && 'ps-9',
        suffix && 'pe-9',
        className,
      )}
      {...props}
    />
  );

  if (!praefix && !suffix) return feld;

  return (
    <div className="relative">
      {praefix && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-fg-subtle"
        >
          {praefix}
        </span>
      )}
      {feld}
      {suffix && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-fg-subtle"
        >
          {suffix}
        </span>
      )}
    </div>
  );
});

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  fehler?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ fehler, className, rows = 4, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={fehler || undefined}
        className={cn(
          basis,
          'min-h-[6rem] resize-y px-3 py-2.5',
          fehler ? 'border-danger' : 'border-border',
          className,
        )}
        {...props}
      />
    );
  },
);

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  fehler?: boolean;
}

/**
 * Bewusst das native select: auf aelteren Android-Geraeten ist es das
 * einzige Auswahlelement, das zuverlaessig und bedienbar bleibt.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { fehler, className, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      aria-invalid={fehler || undefined}
      className={cn(
        basis,
        'h-11 px-3 pe-8',
        fehler ? 'border-danger' : 'border-border',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  hinweis?: React.ReactNode;
  fehler?: boolean;
  /** Optischer Zwischenzustand fuer "teilweise ausgewaehlt". */
  unbestimmt?: boolean;
}

export function Checkbox({
  label,
  hinweis,
  fehler,
  unbestimmt,
  className,
  id,
  disabled,
  ...props
}: CheckboxProps) {
  const eigeneId = React.useId();
  const feldId = id ?? eigeneId;
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(unbestimmt);
  }, [unbestimmt]);

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <input
        ref={ref}
        id={feldId}
        type="checkbox"
        disabled={disabled}
        aria-invalid={fehler || undefined}
        className={cn(
          'mt-0.5 h-5 w-5 shrink-0 rounded-sm border-2 accent-primary',
          fehler ? 'border-danger' : 'border-border-strong',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        {...props}
      />
      <label
        htmlFor={feldId}
        className={cn(
          'flex min-h-touch cursor-pointer flex-col justify-center text-body',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <span>{label}</span>
        {hinweis && <span className="text-caption text-fg-muted">{hinweis}</span>}
      </label>
    </div>
  );
}

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  hinweis?: React.ReactNode;
  fehler?: boolean;
}

export function Radio({
  label,
  hinweis,
  fehler,
  className,
  id,
  disabled,
  ...props
}: RadioProps) {
  const eigeneId = React.useId();
  const feldId = id ?? eigeneId;

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <input
        id={feldId}
        type="radio"
        disabled={disabled}
        aria-invalid={fehler || undefined}
        className={cn(
          'mt-0.5 h-5 w-5 shrink-0 border-2 accent-primary',
          fehler ? 'border-danger' : 'border-border-strong',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        {...props}
      />
      <label
        htmlFor={feldId}
        className={cn(
          'flex min-h-touch cursor-pointer flex-col justify-center text-body',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <span>{label}</span>
        {hinweis && <span className="text-caption text-fg-muted">{hinweis}</span>}
      </label>
    </div>
  );
}
