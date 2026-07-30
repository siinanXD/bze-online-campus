import { LadeZustand } from '@bze/ui';

/**
 * Ladezustand fuer Content-Admin-Seiten.
 */
export default function ContentAdminLaedt() {
  return <LadeZustand art="liste" label="Content-Verwaltung wird geladen" />;
}
