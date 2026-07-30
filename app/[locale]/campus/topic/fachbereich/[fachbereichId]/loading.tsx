import { LadeZustand } from '@bze/ui';

/**
 * Ladezustand fuer die Fachbereichseite.
 */
export default function FachbereichLaedt() {
  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4 pb-8">
      <LadeZustand art="liste" label="Themen werden geladen" />
    </main>
  );
}
