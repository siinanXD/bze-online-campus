/**
 * Erzeugt packages/ui/mdx/mdx-tag-listen.ts aus content/fachkunde.
 * Aufruf: node --import tsx scripts/fachkunde-mdx-tags-generieren.mjs
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content/fachkunde');
const OUT = path.join(ROOT, 'packages/ui/mdx/mdx-tag-listen.ts');

const KERN_TAGS = new Set([
  'BegriffListe',
  'EinfachErklaert',
  'FachlichErklaert',
  'Formelkarte',
  'Merksatz',
  'Praxisbeispiel',
  'StoryEinstieg',
  'TabellenbuchHinweis',
  'WissensstufenLeiste',
  'MessschieberSchema',
  'ToleranzfeldSchema',
  'SpritzgiesszyklusSchema',
  'GrenzmasseToleranzSchema',
]);

const names = new Set();
for (const f of await readdir(DIR)) {
  if (!f.endsWith('.mdx')) continue;
  const text = await readFile(path.join(DIR, f), 'utf8');
  for (const m of text.matchAll(/<([A-Z][A-Za-z0-9]+)/g)) {
    names.add(m[1]);
  }
}

const schemas = [...names].filter((n) => n.endsWith('Schema')).sort();
const visuals = [...names]
  .filter(
    (n) =>
      !n.endsWith('Schema') &&
      !n.endsWith('Trainer') &&
      n !== 'MiniWissenscheck' &&
      !n.startsWith('Interaktiv') &&
      !KERN_TAGS.has(n),
  )
  .sort();

const inhalt = `/**
 * Auto-generierte MDX-Tag-Listen aus content/fachkunde.
 * Neu erzeugen: node --import tsx scripts/fachkunde-mdx-tags-generieren.mjs
 */
export const MDX_SCHEMA_TAGS = ${JSON.stringify(schemas, null, 2)} as const;

export const MDX_VISUAL_FALLBACK_TAGS = ${JSON.stringify(visuals, null, 2)} as const;
`;

await writeFile(OUT, inhalt, 'utf8');
console.log(`geschrieben: ${OUT}`);
console.log(`schemas=${schemas.length} visuals=${visuals.length}`);
