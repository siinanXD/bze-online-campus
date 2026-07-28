import 'server-only';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
// Relative Import statt Alias: `packages/ui/mdx/` ist kein eigenes pnpm-Workspace-Paket und AP-05
// darf `tsconfig.json` (Pfad-Aliase) nicht ändern (Datei-Hoheit).
import { renderFachkundeMdx, type FachkundeFrontmatter } from '../../../../../packages/ui/mdx';

/**
 * Demo-/Vorschau-Fallback: solange AP-01/AP-07 noch keine `lerneinheiten`-Zeilen für ein Thema
 * angelegt haben, zeigt die Topic-Seite ersatzweise die Beispiel-Lerneinheiten aus
 * `content/fachkunde/` an (gematcht über `frontmatter.thema_code`). Sobald echte Datensätze in
 * der Datenbank stehen, liefert `holeLerneinheitenFuerThema` diese vor, der Fallback greift dann
 * nicht mehr. Fortschritt wird im Demo-Modus NICHT persistiert (siehe `_lib/actions.ts`).
 */

const INHALT_VERZEICHNIS = path.join(process.cwd(), 'content', 'fachkunde');

export type DemoLerneinheit = {
  /** Dateiname ohne `.mdx` — dient im Demo-Modus als Ersatz für die Lerneinheit-ID in der URL. */
  slug: string;
  frontmatter: FachkundeFrontmatter;
};

async function alleDateinamen(): Promise<string[]> {
  try {
    const dateien = await readdir(INHALT_VERZEICHNIS);
    return dateien.filter((datei) => datei.endsWith('.mdx'));
  } catch {
    return [];
  }
}

export async function leseDemoQuelltext(slug: string): Promise<string | null> {
  const dateien = await alleDateinamen();
  const treffer = dateien.find((datei) => datei === `${slug}.mdx`);
  if (!treffer) return null;
  try {
    return await readFile(path.join(INHALT_VERZEICHNIS, treffer), 'utf8');
  } catch {
    return null;
  }
}

export async function listeDemoLerneinheiten(themaCode: string): Promise<DemoLerneinheit[]> {
  const dateien = await alleDateinamen();
  const ergebnisse: DemoLerneinheit[] = [];
  for (const datei of dateien) {
    const slug = datei.replace(/\.mdx$/, '');
    const quelltext = await readFile(path.join(INHALT_VERZEICHNIS, datei), 'utf8');
    try {
      const { frontmatter } = await renderFachkundeMdx(quelltext);
      if (frontmatter.thema_code === themaCode) {
        ergebnisse.push({ slug, frontmatter });
      }
    } catch {
      // Ungültige Beispiel-Datei wird im Demo-Modus übersprungen statt die ganze Liste zu brechen.
      continue;
    }
  }
  return ergebnisse.sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Grobe Anzeige-Bezeichnung für Demo-Themen, solange kein echter `themen`-Datensatz existiert. */
const DEMO_THEMA_BEZEICHNUNG: Record<string, string> = {
  'PT-WS': 'Werkstoffe',
};

export function demoThemaBezeichnung(themaCode: string): string {
  return DEMO_THEMA_BEZEICHNUNG[themaCode] ?? themaCode;
}
