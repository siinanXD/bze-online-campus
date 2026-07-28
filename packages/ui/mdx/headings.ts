/**
 * Kapitel-Erkennung für Lerneinheiten (SPEC §3 `lerneinheit_fortschritt.abschnitt_index`,
 * §6.2.6 "Kapitel-Fortschrittsleiste ... antippbare Auswahlliste").
 *
 * Ein Abschnitt/Kapitel einer Lerneinheit entspricht einer H2-Überschrift (`## `) im MDX-Quelltext.
 * Der 0-basierte Index in der zurückgegebenen Liste ist identisch mit `abschnitt_index` in der
 * Tabelle `lerneinheit_fortschritt` — beide Seiten (Renderer und Fortschrittspersistenz) leiten
 * ihn aus derselben Funktion ab, damit sie nie auseinanderlaufen.
 */
export type Kapitel = {
  index: number;
  slug: string;
  titel: string;
};

const H2_ZEILE = /^##[ \t]+(.+?)[ \t]*$/gm;

/** Einfache, robuste Slug-Erzeugung (deutsche Umlaute inklusive), auch für RTL-Titel nutzbar. */
export function slugify(text: string): string {
  const ersetzt = text
    .trim()
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');
  const normalisiert = ersetzt.normalize('NFKD').replace(/[̀-ͯ]/g, '');
  const slug = normalisiert.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug || 'abschnitt';
}

/** Entfernt YAML-Frontmatter (zwischen den ersten beiden `---`-Zeilen) vor der Kapitel-Suche. */
function ohneFrontmatter(source: string): string {
  if (!source.startsWith('---')) return source;
  const ende = source.indexOf('\n---', 3);
  return ende === -1 ? source : source.slice(ende + 4);
}

/**
 * Liest alle H2-Überschriften aus dem MDX-Rohtext einer Lerneinheit und liefert sie in
 * Dokumentreihenfolge als Kapitelliste (0-basiert). Doppelte Titel erhalten einen fortlaufenden
 * Slug-Suffix, damit Anker-Links eindeutig bleiben.
 */
export function extractKapitel(source: string): Kapitel[] {
  const body = ohneFrontmatter(source);
  const gesehen = new Map<string, number>();
  const treffer = [...body.matchAll(H2_ZEILE)];
  return treffer.map((match, index) => {
    const titel = (match[1] ?? '').trim();
    const basisSlug = slugify(titel);
    const anzahl = gesehen.get(basisSlug) ?? 0;
    gesehen.set(basisSlug, anzahl + 1);
    const slug = anzahl === 0 ? basisSlug : `${basisSlug}-${anzahl}`;
    return { index, slug, titel };
  });
}
