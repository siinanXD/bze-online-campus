/**
 * Tailwind-Safelist für `packages/ui/mdx/components.tsx`.
 *
 * `tailwind.config.ts` scannt nur `app/**`, `packages/ui/src/**` und `components/**` nach
 * genutzten Klassen (Datei-Hoheit von AP-05 verbietet das Ändern dieser Konfigurationsdatei).
 * `packages/ui/mdx/` liegt außerhalb dieser Globs. Tailwinds Scanner arbeitet rein textbasiert —
 * es reicht, dass der exakte Klassenname irgendwo in einer gescannten Datei als Text vorkommt,
 * damit die zugehörige CSS-Regel erzeugt wird und global verfügbar ist. Diese Datei referenziert
 * deshalb alle Klassen aus dem MDX-Komponenten-Mapping, die noch nirgends sonst im Repository
 * vorkommen, damit sie im Produktions-Build nicht entfernt ("purged") werden.
 *
 * Folgeaufgabe (außerhalb der Datei-Hoheit von AP-05): `packages/ui/mdx/**` in den
 * `content`-Glob von `tailwind.config.ts` aufnehmen, danach kann diese Datei entfallen.
 */
export const MDX_TAILWIND_SAFELIST = [
  'mb-2', 'mt-6', 'mt-4', 'scroll-mt-24',
  'text-xl', 'text-lg', 'leading-relaxed', 'italic', 'underline', 'underline-offset-2',
  'list-disc', 'list-decimal', 'space-y-1', 'ps-6',
  'border-s-4', 'my-6', 'py-0.5', 'overflow-x-auto', 'border-collapse',
  'text-start', 'divide-y', 'divide-border', 'p-2', 'w-full',
].join(' ');
