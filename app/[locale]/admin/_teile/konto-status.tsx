/**
 * Konto-Status (aktiv/inaktiv) ist KEIN Lernstatus — Grün/Rot bleiben laut
 * Spec §7 ausschließlich dem Lernstatus vorbehalten. Daher ein eigenes,
 * neutrales Badge statt `StatusBadge` aus @bze/ui, weiterhin mit
 * Symbol + Textlabel, Farbe nie alleiniger Träger.
 */
export function KontoStatusBadge({ aktiv, label }: { aktiv: boolean; label: string }) {
  return (
    <span
      className={
        aktiv
          ? 'inline-flex items-center gap-1.5 rounded-full border border-primary bg-surface px-2.5 py-1 text-xs font-semibold text-primary'
          : 'inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-fg-muted'
      }
      role="status"
    >
      <span aria-hidden="true">{aktiv ? '●' : '○'}</span>
      <span>{label}</span>
    </span>
  );
}
