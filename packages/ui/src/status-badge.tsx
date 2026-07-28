import * as React from 'react';
import { cn } from './cn';

export type FrageStatus = 'neu' | 'einmal_richtig' | 'falsch' | 'abgeschlossen';

const MAP: Record<FrageStatus, { symbol: string; token: string; key: string }> = {
  neu:            { symbol: '○', token: 'text-status-neu border-status-neu',       key: 'neu' },
  einmal_richtig: { symbol: '◐', token: 'text-status-teil border-status-teil',     key: 'einmalRichtig' },
  falsch:         { symbol: '✕', token: 'text-status-falsch border-status-falsch', key: 'falsch' },
  abgeschlossen:  { symbol: '✓', token: 'text-status-fertig border-status-fertig', key: 'abgeschlossen' },
};

/**
 * label kommt aus next-intl (t(`status.${MAP[status].key}`)) — nie fest verdrahtet.
 * Farbe ist NIE alleiniger Träger: Symbol + Textlabel sind immer dabei.
 */
export function StatusBadge({ status, label, fehler = 0 }: { status: FrageStatus; label: string; fehler?: number }) {
  const m = MAP[status];
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full border bg-surface px-2.5 py-1 text-xs font-semibold', m.token)}
      role="status"
    >
      <span aria-hidden="true">{m.symbol}</span>
      <span>{label}</span>
      {fehler > 0 && (
        <span className="ms-1 rounded-full bg-status-falsch px-1.5 text-[10px] font-bold text-white" aria-label={`${fehler} Fehler`}>
          {fehler}
        </span>
      )}
    </span>
  );
}
