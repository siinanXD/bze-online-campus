/**
 * Smoke: MDX-Renderer mit verdrahteten Trainern/Schemas.
 * Aufruf: node --import tsx scripts/fachkunde-mdx-smoke.mjs
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { renderFachkundeMdx } from '../packages/ui/mdx/renderer.tsx';

// next-mdx-remote Compiled-Output erwartet in manchen Pfaden globales React.
globalThis.React = React;

const ROOT = path.resolve(import.meta.dirname, '..');
const DATEIEN = [
  'content/fachkunde/pt-mes-02-messschieber-aufbauen.mdx',
  'content/fachkunde/pt-mes-01-messschieber-sicher-verwenden.mdx',
  'content/fachkunde/pt-kst-18-kompletter-spritzgiesszyklus.mdx',
  'content/fachkunde/pt-mel-06-zahnradgetriebe.mdx',
];

let fehler = 0;

for (const relativ of DATEIEN) {
  const datei = path.join(ROOT, relativ);
  const quelltext = await readFile(datei, 'utf8');
  try {
    const { inhalt, frontmatter } = await renderFachkundeMdx(quelltext);
    const html = renderToStaticMarkup(inhalt);
    const platzhalterTreffer = (html.match(/Interaktiver Baustein folgt/g) ?? []).length;
    const checks = [];

    if (relativ.includes('mes-02')) {
      if (!html.includes('Messschieber')) checks.push('MessschieberSchema fehlt');
      if (!html.includes('fester Messschenkel') && !html.includes('Aufbau')) {
        checks.push('Messschieber Hotspots fehlen');
      }
    }
    if (relativ.includes('mes-01')) {
      if (!html.includes('Grenzmass') && !html.includes('Formel')) {
        checks.push('Formelkarte Vollform fehlt');
      }
    }
    if (relativ.includes('kst-18')) {
      if (!html.includes('Zykluszeit') && !html.includes('Spritzgiesszyklus')) {
        checks.push('SpritzgiesszyklusSchema fehlt');
      }
    }
    if (relativ.includes('mel-06')) {
      if (!html.includes('i = n1 / n2') && !html.includes('Formel')) {
        checks.push('Formelkarte Kurzform fehlt');
      }
    }

    if (checks.length) {
      fehler += 1;
      console.error(`FAIL ${relativ}: ${checks.join('; ')}`);
      console.error(`  html-snippet: ${html.slice(0, 280).replace(/\s+/g, ' ')}`);
    } else {
      console.log(
        `OK  ${relativ}  (${frontmatter.titel})  html=${html.length}c  platzhalter=${platzhalterTreffer}`,
      );
    }
  } catch (err) {
    fehler += 1;
    console.error(`FAIL ${relativ}:`, err instanceof Error ? err.message : err);
  }
}

if (fehler > 0) {
  process.exitCode = 1;
  console.error(`Smoke fehlgeschlagen: ${fehler} Fehler`);
} else {
  console.log(`Smoke fertig: ${DATEIEN.length}/${DATEIEN.length} ok`);
}
