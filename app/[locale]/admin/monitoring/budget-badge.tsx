import { cn } from '@bze/ui';

export type BudgetStatus = 'ok' | 'warnung' | 'ueberschritten' | 'keinBudget';

/**
 * Budget-Status als Farbe + Symbol + Textlabel (AGENTS.md §2: Farbe nie
 * alleiniger Träger). Bewusst ohne Grün/Rot — diese sind laut Design-Regel
 * dem Lernstatus vorbehalten. Unterschieden wird über Symbol, Label und
 * Akzentflächen (neutral → Umriss → gefüllt).
 */
const MAP: Record<BudgetStatus, { symbol: string; klasse: string }> = {
  ok: { symbol: '✓', klasse: 'border-border bg-surface text-fg-muted' },
  warnung: { symbol: '!', klasse: 'border-primary bg-surface text-primary' },
  ueberschritten: { symbol: '‼', klasse: 'border-primary bg-primary text-fg-onPrimary' },
  keinBudget: { symbol: '–', klasse: 'border-border bg-surface text-fg-muted' },
};

export function BudgetBadge({ status, label }: { status: BudgetStatus; label: string }) {
  const m = MAP[status];
  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
        m.klasse,
      )}
    >
      <span aria-hidden="true">{m.symbol}</span>
      <span>{label}</span>
    </span>
  );
}
