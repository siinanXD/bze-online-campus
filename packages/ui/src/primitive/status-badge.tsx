import * as React from 'react';
import { cn } from '../cn';

export type FrageStatus = 'neu' | 'einmal_richtig' | 'falsch' | 'abgeschlossen';

const MAP: Record<FrageStatus, { symbol: string; token: string; key: string }> = {
  neu: { symbol: '○', token: 'text-status-neu border-status-neu', key: 'neu' },
  einmal_richtig: {
    symbol: '◐',
    token: 'text-status-teil border-status-teil',
    key: 'einmalRichtig',
  },
  falsch: {
    symbol: '✕',
    token: 'text-status-falsch border-status-falsch',
    key: 'falsch',
  },
  abgeschlossen: {
    symbol: '✓',
    token: 'text-status-fertig border-status-fertig',
    key: 'abgeschlossen',
  },
};

export interface StatusBadgeProps {
  status: FrageStatus;
  /** Kommt aus next-intl, nie fest verdrahtet. */
  label: string;
  fehler?: number;
  /** Versteckt das Label optisch — es bleibt aber im DOM fuer Screenreader. */
  labelVersteckt?: boolean;
  className?: string;
}

/**
 * Farbe ist NIE alleiniger Traeger: Symbol und Textlabel sind immer dabei.
 * Siehe AGENTS.md, Abschnitt 2.
 */
export function StatusBadge({
  status,
  label,
  fehler = 0,
  labelVersteckt = false,
  className,
}: StatusBadgeProps) {
  const m = MAP[status];

  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border bg-surface px-2.5 py-1',
        'text-caption font-semibold',
        m.token,
        className,
      )}
    >
      <span aria-hidden="true">{m.symbol}</span>
      <span className={labelVersteckt ? 'sr-only' : undefined}>{label}</span>
      {fehler > 0 && (
        <span
          className="zahlen ms-1 rounded-full bg-status-falsch px-1.5 text-[10px] font-bold text-white"
          aria-label={`${fehler} Fehler`}
        >
          {fehler}
        </span>
      )}
    </span>
  );
}
