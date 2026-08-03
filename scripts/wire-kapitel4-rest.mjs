/**
 * Verdrahtet generierte Kapitel-4-Komponenten in Exports, MDX und Tests.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const meta = JSON.parse(readFileSync(path.join(root, 'scripts/.kapitel4-rest-meta.json'), 'utf8'));
const prefixes = meta.einheiten.map((e) => e.prefix);
const byThema = {
  OEE: meta.einheiten.filter((e) => e.thema === 'PT-OEE'),
  MAT: meta.einheiten.filter((e) => e.thema === 'PT-MAT'),
  WISO: meta.einheiten.filter((e) => e.thema === 'PT-WISO'),
  PRF: meta.einheiten.filter((e) => e.thema === 'PT-PRF'),
};

function insertAfter(haystack, marker, insertion) {
  const firstLine = insertion.trim().split(/\r?\n/)[0];
  if (haystack.includes(firstLine)) return haystack;
  const normalizedMarker = marker.replace(/\n/g, '\r\n');
  let idx = haystack.indexOf(marker);
  let used = marker;
  if (idx < 0) {
    idx = haystack.indexOf(normalizedMarker);
    used = normalizedMarker;
  }
  if (idx < 0) {
    // Fallback: marker without assuming newline style
    const soft = marker.replace(/\r?\n$/, '');
    idx = haystack.indexOf(soft);
    if (idx < 0) throw new Error(`Marker not found: ${JSON.stringify(marker)}`);
    const end = haystack.indexOf('\n', idx);
    used = haystack.slice(idx, end + 1);
  }
  return haystack.slice(0, idx + used.length) + insertion + haystack.slice(idx + used.length);
}

// --- index.ts ---
let index = readFileSync(path.join(root, 'packages/ui/src/index.ts'), 'utf8');
const schemaExports = prefixes.map((p) => `  ${p}Schema,`).join('\n');
const schemaPropExports = prefixes.map((p) => `  ${p}SchemaProps,`).join('\n');
const trainerExports = prefixes.map((p) => `  ${p}Trainer,`).join('\n');
const trainerPropExports = prefixes.map((p) => `  ${p}TrainerProps,`).join('\n');

if (!index.includes('OeeUeberblickenSchema,')) {
  index = insertAfter(index, '  KvpImTeamSchema,\n', schemaExports + '\n');
  index = insertAfter(index, '  KvpImTeamSchemaProps,\n', schemaPropExports + '\n');
  index = insertAfter(index, '  KvpImTeamTrainer,\n', trainerExports + '\n');
  index = insertAfter(index, '  KvpImTeamTrainerProps,\n', trainerPropExports + '\n');
  writeFileSync(path.join(root, 'packages/ui/src/index.ts'), index, 'utf8');
}

// --- mdx/components.tsx ---
let mdx = readFileSync(path.join(root, 'packages/ui/mdx/components.tsx'), 'utf8');
if (!mdx.includes('OeeUeberblickenSchema,')) {
  mdx = insertAfter(mdx, '  KvpImTeamSchema,\n', schemaExports + '\n');
  mdx = insertAfter(mdx, '  KvpImTeamTrainer,\n', trainerExports + '\n');

  const mapSchema = prefixes.map((p) => `    ${p}Schema,`).join('\n');
  const mapTrainer = prefixes.map((p) => `    ${p}Trainer,`).join('\n');
  mdx = insertAfter(mdx, '    KvpImTeamSchema,\n', mapSchema + '\n');
  mdx = insertAfter(mdx, '    KvpImTeamTrainer,\n', mapTrainer + '\n');
  writeFileSync(path.join(root, 'packages/ui/mdx/components.tsx'), mdx, 'utf8');
}

// --- content-fallback ---
let fallback = readFileSync(path.join(root, 'app/[locale]/campus/topic/_lib/content-fallback.ts'), 'utf8');
if (!fallback.includes("'PT-OEE'")) {
  fallback = fallback.replace(
    "  'PT-LEAN': 'Lean',\n",
    `  'PT-LEAN': 'Lean',\n  'PT-OEE': 'OEE',\n  'PT-MAT': 'Technische Mathematik',\n  'PT-WISO': 'Wirtschafts- und Sozialkunde',\n  'PT-PRF': 'Pruefungsvorbereitung',\n`,
  );
  writeFileSync(path.join(root, 'app/[locale]/campus/topic/_lib/content-fallback.ts'), fallback, 'utf8');
}

// --- integration test ---
let integ = readFileSync(path.join(root, 'tests/integration/fachkunde-kapitel1-content.test.ts'), 'utf8');
if (!integ.includes('OEE_SLUGS')) {
  const slugConsts = Object.entries(byThema)
    .map(([name, list]) => {
      const arr = list.map((e) => `  '${e.slug}.mdx',`).join('\n');
      return `const ${name}_SLUGS = [\n${arr}\n] as const;`;
    })
    .join('\n');
  integ = integ.replace(
    `const LEAN_SLUGS = [
  'pt-lean-01-wertschoepfung-und-verschwendung.mdx',
  'pt-lean-02-5s-wiederholen.mdx',
  'pt-lean-03-kvp-im-team.mdx',
] as const;`,
    `const LEAN_SLUGS = [
  'pt-lean-01-wertschoepfung-und-verschwendung.mdx',
  'pt-lean-02-5s-wiederholen.mdx',
  'pt-lean-03-kvp-im-team.mdx',
] as const;
${slugConsts}`,
  );

  const blockTests = Object.entries(byThema)
    .map(([name, list]) => {
      const code = list[0].thema;
      const label =
        name === 'OEE'
          ? 'OEE'
          : name === 'MAT'
            ? 'Mathematik'
            : name === 'WISO'
              ? 'WiSo'
              : 'Pruefungsvorbereitungs';
      const mastery = code.replace('PT-', 'FK-4-');
      return `
  it('enthaelt den ${label}-Block als ${code}-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of ${name}_SLUGS) {
      assert.ok(dateien.includes(slug), \`\${slug} fehlt\`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "${code}"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "${mastery}-/);
    }
  });`;
    })
    .join('\n');

  integ = integ.replace(
    `  it('enthaelt den Lean-Block als PT-LEAN-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of LEAN_SLUGS) {
      assert.ok(dateien.includes(slug), \`\${slug} fehlt\`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-LEAN"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-4-LEAN-/);
    }
  });`,
    `  it('enthaelt den Lean-Block als PT-LEAN-Demo-Lerneinheiten', () => {
    const dateien = readdirSync(CONTENT_DIR);

    for (const slug of LEAN_SLUGS) {
      assert.ok(dateien.includes(slug), \`\${slug} fehlt\`);
      const inhalt = liesContentDatei(slug);
      assert.match(inhalt, /thema_code: "PT-LEAN"/);
      assert.match(inhalt, /review_status: "entwurf"/);
      assert.match(inhalt, /fachliche_freigabe:/);
      assert.match(inhalt, /status: "offen"/);
      assert.match(inhalt, /<MiniWissenscheck/);
      assert.match(inhalt, /masterySchluessel: "FK-4-LEAN-/);
    }
  });
${blockTests}`,
  );

  const fallbackTests = `
  it('macht das OEE-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-OEE': 'OEE'/);
  });

  it('macht das Mathematik-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-MAT': 'Technische Mathematik'/);
  });

  it('macht das WiSo-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-WISO': 'Wirtschafts- und Sozialkunde'/);
  });

  it('macht das Pruefungsvorbereitungs-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-PRF': 'Pruefungsvorbereitung'/);
  });
`;
  integ = integ.replace(
    `  it('macht das Lean-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-LEAN': 'Lean'/);
  });`,
    `  it('macht das Lean-Thema im Demo-Fallback sichtbar', () => {
    assert.match(FALLBACK_SOURCE, /'PT-LEAN': 'Lean'/);
  });
${fallbackTests}`,
  );

  const bindTests = Object.entries(byThema)
    .map(([name, list]) => {
      const label =
        name === 'OEE'
          ? 'OEE'
          : name === 'MAT'
            ? 'Mathematik'
            : name === 'WISO'
              ? 'WiSo'
              : 'Pruefungsvorbereitungs';
      const asserts = list
        .map(
          (e, i) => `    assert.match(liesContentDatei(${name}_SLUGS[${i}]), /<${e.prefix}Schema \\/>/);
    assert.match(liesContentDatei(${name}_SLUGS[${i}]), /<${e.prefix}Trainer titel="${e.titel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" \\/>/);`,
        )
        .join('\n');
      return `
  it('bindet fuer jede ${label}-Einheit Visual und Interaktion ein', () => {
${asserts}
  });`;
    })
    .join('\n');

  integ = integ.replace(
    `  it('bindet fuer jede Lean-Einheit Visual und Interaktion ein', () => {
    const [wertSlug, fuenfsSlug, kvpSlug] = LEAN_SLUGS;

    assert.match(liesContentDatei(wertSlug), /<WertschoepfungVerschwendungSchema \\/>/);
    assert.match(liesContentDatei(wertSlug), /<WertschoepfungVerschwendungTrainer titel="Wertschoepfung und Verschwendung" \\/>/);
    assert.match(liesContentDatei(fuenfsSlug), /<FuenfSWiederholenSchema \\/>/);
    assert.match(liesContentDatei(fuenfsSlug), /<FuenfSWiederholenTrainer titel="5S wiederholen" \\/>/);
    assert.match(liesContentDatei(kvpSlug), /<KvpImTeamSchema \\/>/);
    assert.match(liesContentDatei(kvpSlug), /<KvpImTeamTrainer titel="KVP im Team" \\/>/);
  });
});`,
    `  it('bindet fuer jede Lean-Einheit Visual und Interaktion ein', () => {
    const [wertSlug, fuenfsSlug, kvpSlug] = LEAN_SLUGS;

    assert.match(liesContentDatei(wertSlug), /<WertschoepfungVerschwendungSchema \\/>/);
    assert.match(liesContentDatei(wertSlug), /<WertschoepfungVerschwendungTrainer titel="Wertschoepfung und Verschwendung" \\/>/);
    assert.match(liesContentDatei(fuenfsSlug), /<FuenfSWiederholenSchema \\/>/);
    assert.match(liesContentDatei(fuenfsSlug), /<FuenfSWiederholenTrainer titel="5S wiederholen" \\/>/);
    assert.match(liesContentDatei(kvpSlug), /<KvpImTeamSchema \\/>/);
    assert.match(liesContentDatei(kvpSlug), /<KvpImTeamTrainer titel="KVP im Team" \\/>/);
  });
${bindTests}
});`,
  );

  writeFileSync(path.join(root, 'tests/integration/fachkunde-kapitel1-content.test.ts'), integ, 'utf8');
}

// --- unit test ---
let unit = readFileSync(path.join(root, 'tests/unit/content/messschieber-trainer.test.ts'), 'utf8');
if (!unit.includes('OeeUeberblickenSchema')) {
  const schemaImports = prefixes.map((p) => `  ${p}Schema,`).join('\n');
  const trainerImports = prefixes.map((p) => `  ${p}Trainer,`).join('\n');
  unit = insertAfter(unit, '  KvpImTeamSchema,\n', schemaImports + '\n');
  unit = insertAfter(unit, '  KvpImTeamTrainer,\n', trainerImports + '\n');

  const unitBlocks = Object.entries(byThema)
    .map(([name, list]) => {
      const label =
        name === 'OEE'
          ? 'OEE'
          : name === 'MAT'
            ? 'Mathematik'
            : name === 'WISO'
              ? 'WiSo'
              : 'Pruefungsvorbereitung';
      const renders = list
        .map((e, i) => `    const c${i} = renderToStaticMarkup(React.createElement(${e.prefix}Schema));`)
        .join('\n');
      const asserts = list
        .map((e, i) => `    assert.match(c${i}, /${e.schemaTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/);`)
        .join('\n');
      const tRenders = list
        .map((e, i) => `    const t${i} = renderToStaticMarkup(React.createElement(${e.prefix}Trainer));`)
        .join('\n');
      const tAsserts = list
        .map((e, i) => `    assert.match(t${i}, /${e.distractor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/);`)
        .join('\n');
      return `
describe('Fachkunde ${label}-Visuals', () => {
  it('rendert ${label}-Visuals zugaenglich', () => {
${renders}
${asserts}
  });
});

describe('Fachkunde ${label}-Interaktionen', () => {
  it('rendert ${label}-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
${tRenders}
${tAsserts}
    assert.match(t0, /aria-pressed/);
  });
});
`;
    })
    .join('\n');

  unit += unitBlocks;
  writeFileSync(path.join(root, 'tests/unit/content/messschieber-trainer.test.ts'), unit, 'utf8');
}

console.log('Wired exports, fallback and tests for', prefixes.length, 'components.');
