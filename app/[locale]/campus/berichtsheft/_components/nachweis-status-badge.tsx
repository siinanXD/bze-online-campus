import { cn } from '@bze/ui';
import type { NachweisStatus } from '@bze/core/nachweis';

/**
 * Status eines Nachweises als Badge. Farbe ist NIE alleiniger Träger:
 * Symbol + Textlabel sind immer dabei (Spec §7 / AGENTS.md DoD).
 * Das Label kommt aus next-intl und wird als Prop übergeben.
 */
const MAP: Record<NachweisStatus, { symbol: string; token: string }> = {
  entwurf: { symbol: '○', token: 'text-status-neu border-status-neu' },
  eingereicht: { symbol: '➤', token: 'text-primary border-primary' },
  signiert_teilnehmer: { symbol: '✍', token: 'text-status-teil border-status-teil' },
  signiert_ausbilder: { symbol: '✓', token: 'text-status-fertig border-status-fertig' },
  beanstandet: { symbol: '✕', token: 'text-status-falsch border-status-falsch' },
};

export function NachweisStatusBadge({
  status,
  label,
}: {
  status: NachweisStatus;
  label: string;
}) {
  const m = MAP[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border bg-surface px-2.5 py-1 text-xs font-semibold',
        m.token,
      )}
      role="status"
    >
      <span aria-hidden="true">{m.symbol}</span>
      <span>{label}</span>
    </span>
  );
}
