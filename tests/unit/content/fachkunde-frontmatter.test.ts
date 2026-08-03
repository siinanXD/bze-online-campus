import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { fachkundeFrontmatterSchema } from '../../../packages/ui/mdx/frontmatter';

const MESSCHIEBER_MDX_URL = new URL('../../../content/fachkunde/pt-mes-01-messschieber-sicher-verwenden.mdx', import.meta.url);

/**
 * Extrahiert den YAML-Frontmatter-Block einer MDX-Datei fuer statische Inhaltspruefungen.
 */
function extrahiereFrontmatter(source: string): string {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  if (!match?.[1]) throw new Error('MDX-Datei enthaelt keine Frontmatter.');
  return match[1];
}

describe('Fachkunde-Frontmatter', () => {
  it('setzt sichere Entwurfs-Defaults fuer bestehende Lerneinheiten', () => {
    const frontmatter = fachkundeFrontmatterSchema.parse({
      titel: 'Messschieber sicher verwenden',
      thema_code: 'PT-MES',
      lesedauer_minuten: 9,
      quellen: [
        {
          titel: 'Tabellenbuch Metall mit Formelsammlung',
          seite: 'S. [vom Ausbilder]',
        },
      ],
    });

    assert.equal(frontmatter.review_status, 'entwurf');
    assert.equal(frontmatter.zahlenwerte_status, 'uebungswerte');
    assert.equal(frontmatter.fachliche_freigabe.erforderlich, true);
    const ersteQuelle = frontmatter.quellen[0];
    assert.ok(ersteQuelle);
    assert.equal(ersteQuelle.status, 'offen');
  });

  it('markiert die Messschieber-Demo als Entwurf mit offenen Fundstellen', () => {
    const quelltext = readFileSync(MESSCHIEBER_MDX_URL, 'utf8');
    const frontmatter = extrahiereFrontmatter(quelltext);

    assert.match(frontmatter, /review_status: "entwurf"/);
    assert.match(frontmatter, /zahlenwerte_status: "uebungswerte"/);
    assert.match(frontmatter, /erforderlich: true/);
    assert.match(frontmatter, /Ausbilder muss fachliche Aussagen/);
    assert.equal((frontmatter.match(/status: "offen"/g) ?? []).length, 2);
    assert.match(frontmatter, /Konkrete Tabellenbuchseite\/Fundstelle/);
  });
});
