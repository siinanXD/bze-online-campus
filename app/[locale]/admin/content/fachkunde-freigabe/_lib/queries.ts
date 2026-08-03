import 'server-only';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  aggregiereFreigabeInventar,
  baueFreigabeInventarZeile,
  type FachkundeFreigabeInventarZeile,
} from '@bze/core/fachkunde';

const INHALT_VERZEICHNIS = path.join(process.cwd(), 'content', 'fachkunde');

/**
 * Laedt das Freigabeinventar aller Demo-MDX-Lerneinheiten fuer die Admin-Ansicht.
 */
export async function ladeFachkundeFreigabeInventar(): Promise<{
  zeilen: FachkundeFreigabeInventarZeile[];
  statistik: ReturnType<typeof aggregiereFreigabeInventar>;
}> {
  let dateien: string[] = [];
  try {
    dateien = (await readdir(INHALT_VERZEICHNIS)).filter((name) => name.endsWith('.mdx'));
  } catch {
    dateien = [];
  }

  const zeilen: FachkundeFreigabeInventarZeile[] = [];
  for (const datei of dateien.sort()) {
    const slug = datei.replace(/\.mdx$/, '');
    const quelltext = await readFile(path.join(INHALT_VERZEICHNIS, datei), 'utf8');
    zeilen.push(baueFreigabeInventarZeile(slug, quelltext));
  }

  return {
    zeilen,
    statistik: aggregiereFreigabeInventar(zeilen),
  };
}
