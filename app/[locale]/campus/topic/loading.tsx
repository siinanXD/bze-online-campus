import { LadeZustand } from '@bze/ui';

/**
 * Ladezustand fuer den Fachkunde-Einstieg.
 */
export default function FachkundeIndexLaedt() {
  return (
    <main className="mx-auto max-w-md space-y-4 p-4 pb-8">
      <LadeZustand art="liste" label="Fachkunde wird geladen" />
    </main>
  );
}
