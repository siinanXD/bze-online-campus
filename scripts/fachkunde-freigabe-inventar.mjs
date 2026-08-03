/**
 * Erzeugt ein Freigabe-/Qualitaetsinventar aller Fachkunde-MDX-Dateien.
 * Nutzung: node --import tsx scripts/fachkunde-freigabe-inventar.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  aggregiereFreigabeInventar,
  baueFreigabeInventarZeile,
} from '../packages/core/fachkunde/inventar.ts';

const root = process.cwd();
const dir = path.join(root, 'content/fachkunde');
const dateien = readdirSync(dir).filter((name) => name.endsWith('.mdx')).sort();
const zeilen = dateien.map((datei) => {
  const slug = datei.replace(/\.mdx$/, '');
  const quelltext = readFileSync(path.join(dir, datei), 'utf8');
  return baueFreigabeInventarZeile(slug, quelltext);
});

const statistik = aggregiereFreigabeInventar(zeilen);
const report = {
  erzeugtAm: new Date().toISOString(),
  statistik,
  unvollstaendig: zeilen.filter(
    (z) => !(z.hatStory && z.hatEinfach && z.hatFachlich && z.hatMerksatz && z.hatQuiz && z.hatBegriffe),
  ),
  freigegeben: zeilen.filter((z) => z.reviewStatus === 'freigegeben'),
  bereitFuerFachpruefungBeispiel: zeilen.filter((z) => z.bereitFuerFachpruefung).slice(0, 20),
};

const outPath = path.join(root, 'docs/FACHKUNDE_FREIGABE_INVENTAR.json');
writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');

console.log(JSON.stringify(statistik, null, 2));
console.log(`Report: ${outPath}`);
if (statistik.unvollstaendig > 0) {
  console.error(`Warnung: ${statistik.unvollstaendig} Einheiten ohne komplette Pflichtbausteine.`);
  process.exitCode = 1;
}
