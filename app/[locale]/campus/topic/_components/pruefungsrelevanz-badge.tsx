/**
 * Kennzeichnet pruefungsnahe Inhalte; Farbe nie alleiniger Traeger (Figma 8:16).
 */
export function PruefungsrelevanzBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-start rounded-[6px] border border-danger-border bg-danger-bg px-2.5 py-1 text-[12px] leading-[18px] text-danger">
      {label}
    </span>
  );
}
