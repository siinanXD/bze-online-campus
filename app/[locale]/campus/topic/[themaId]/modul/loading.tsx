import { LadeZustand } from '@bze/ui';

/**
 * Ladezustand fuer die Lernmodul-Seite.
 */
export default function LernmodulLaedt() {
  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4 pb-8">
      <LadeZustand art="detail" label="Lernmodul wird geladen" />
    </main>
  );
}
