/**
 * Struktureller DoD-/A11y-Check ueber Fachkunde-MDX und Visual-Komponenten.
 * Nutzung: node --import tsx scripts/fachkunde-struktur-audit.mjs
 *
 * Prueft Pflichtbausteine, Quellenstatus und ob SVG-Visuals role=img + aria-labelledby haben.
 * Kein Browser-Kontrastcheck (dafuer: pnpm design:kontrast gegen laufenden Server).
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  aggregiereFreigabeInventar,
  baueFreigabeInventarZeile,
} from '../packages/core/fachkunde/inventar.ts';

const root = process.cwd();
const mdxDir = path.join(root, 'content/fachkunde');
const uiPfad = path.join(root, 'packages/ui/src/fachkunde.tsx');

const dateien = readdirSync(mdxDir).filter((name) => name.endsWith('.mdx')).sort();
const zeilen = dateien.map((datei) => {
  const slug = datei.replace(/\.mdx$/, '');
  const quelltext = readFileSync(path.join(mdxDir, datei), 'utf8');
  return baueFreigabeInventarZeile(slug, quelltext);
});

const statistik = aggregiereFreigabeInventar(zeilen);
const ohneVisual = [];
const ohneTrainer = [];

for (const datei of dateien) {
  const quelltext = readFileSync(path.join(mdxDir, datei), 'utf8');
  const hatVisual =
    /<[A-Za-z0-9]*(Schema|Visual|Abbildung|Diagramm|Bild|Karte|Set|Ablauf|Rad)[\s/>]/.test(quelltext) ||
    /<(FachkundeVisual|VisualBlock|svg|Produktionskarte|Rollenrad|PsaCheckliste|GefahrenstellenBild|MeldewegAblauf)[\s/>]/i.test(
      quelltext,
    );
  const hatTrainer =
    /<[A-Za-z0-9]*(Trainer|Simulation|Interaktion)[\s/>]/.test(quelltext) ||
    /<MiniWissenscheck[\s>]/.test(quelltext);
  if (!hatVisual) ohneVisual.push(datei);
  if (!hatTrainer) ohneTrainer.push(datei);
}

const uiQuelltext = readFileSync(uiPfad, 'utf8');
const svgBloecke = [...uiQuelltext.matchAll(/<svg\b([^>]*)>/g)].map((m) => m[1] ?? '');
const svgOhneA11y = svgBloecke.filter(
  (attrs) => !(attrs.includes('role="img"') && attrs.includes('aria-labelledby')),
).length;

const report = {
  erzeugtAm: new Date().toISOString(),
  statistik,
  mdx: {
    gesamt: dateien.length,
    ohnePflichtbausteine: statistik.unvollstaendig,
    quellenOffen: statistik.quellenOffen,
    freigegeben: statistik.freigegeben,
    ohneErkanntenVisualBlock: ohneVisual.slice(0, 40),
    ohneTrainerOderQuiz: ohneTrainer.slice(0, 40),
  },
  visualsUi: {
    svgElemente: svgBloecke.length,
    svgOhneRoleImgUndAriaLabelledby: svgOhneA11y,
  },
  hinweise: [
    'Kontrastmessung im Browser: pnpm design:kontrast (Server muss laufen).',
    'Mobile-Viewport-Audit bleibt manuell bzw. design:shots.',
    'Illustrationen: Labels im Frontend/SVG-Text, nicht in Rasterexporten einbrennen.',
  ],
};

const outPath = path.join(root, 'docs/FACHKUNDE_STRUKTUR_AUDIT.json');
writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');

console.log(JSON.stringify({ statistik: report.statistik, visualsUi: report.visualsUi, mdxKurz: {
  gesamt: report.mdx.gesamt,
  ohnePflichtbausteine: report.mdx.ohnePflichtbausteine,
  ohneErkanntenVisualBlock: ohneVisual.length,
  ohneTrainerOderQuiz: ohneTrainer.length,
} }, null, 2));
console.log(`Report: ${outPath}`);

if (statistik.unvollstaendig > 0 || svgOhneA11y > 0) {
  process.exitCode = 1;
}
