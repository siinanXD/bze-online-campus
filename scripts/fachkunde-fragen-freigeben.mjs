/**
 * Setzt fragen_status: freigegeben in allen Fachkunde-MDX-Dateien.
 * Nutzung: node scripts/fachkunde-fragen-freigeben.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'content/fachkunde');
const dateien = readdirSync(dir).filter((name) => name.endsWith('.mdx')).sort();
let aktualisiert = 0;
let unveraendert = 0;

for (const datei of dateien) {
  const pfad = path.join(dir, datei);
  const roh = readFileSync(pfad, 'utf8');
  if (!roh.startsWith('---')) {
    unveraendert += 1;
    continue;
  }
  const ende = roh.indexOf('\n---', 3);
  if (ende < 0) {
    unveraendert += 1;
    continue;
  }
  const fm = roh.slice(0, ende + 1);
  const rest = roh.slice(ende + 1); // begins with \n---

  let neuFm;
  if (/^fragen_status:\s*".*"$/m.test(fm)) {
    neuFm = fm.replace(/^fragen_status:\s*".*"$/m, 'fragen_status: "freigegeben"');
  } else if (/^review_status:\s*".*"$/m.test(fm)) {
    neuFm = fm.replace(
      /^(review_status:\s*".*")$/m,
      '$1\nfragen_status: "freigegeben"',
    );
  } else {
    unveraendert += 1;
    continue;
  }

  if (neuFm === fm && /fragen_status:\s*"freigegeben"/.test(fm)) {
    unveraendert += 1;
    continue;
  }

  writeFileSync(pfad, neuFm + rest, 'utf8');
  aktualisiert += 1;
}

console.log(JSON.stringify({ gesamt: dateien.length, aktualisiert, unveraendert }, null, 2));
