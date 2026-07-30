import type { ReactNode } from 'react';
import { compileMDX } from 'next-mdx-remote/rsc';
import { erzeugeFachkundeMdxComponents } from './components';
import { extractKapitel, type Kapitel } from './headings';
import { fachkundeFrontmatterSchema, type FachkundeFrontmatter } from './frontmatter';

export type FachkundeMdxErgebnis = {
  inhalt: ReactNode;
  frontmatter: FachkundeFrontmatter;
  kapitel: Kapitel[];
};

/**
 * Rendert eine Fachkunde-Lerneinheit serverseitig (Server Component, kein Client-JS für den
 * MDX-Inhalt selbst — SPEC §1 "Server Components als Default").
 *
 * Wirft bei ungültiger Frontmatter (z. B. fehlende Quellenangabe) einen Fehler, damit die
 * aufrufende Route-`error.tsx` einen verständlichen Fehlerzustand zeigen kann, statt eine
 * Lerneinheit ohne Fundstelle stillschweigend anzuzeigen (CONTRIBUTING.md §2 "Keine Zahlenwerte ohne
 * Fundstelle").
 */
export async function renderFachkundeMdx(source: string): Promise<FachkundeMdxErgebnis> {
  const kapitel = extractKapitel(source);

  const { content, frontmatter } = await compileMDX<Record<string, unknown>>({
    source,
    options: { parseFrontmatter: true },
    components: erzeugeFachkundeMdxComponents(kapitel),
  });

  const geprueft = fachkundeFrontmatterSchema.safeParse(frontmatter);
  if (!geprueft.success) {
    throw new Error(
      `Lerneinheit hat eine ungültige Frontmatter (titel, thema_code, lesedauer_minuten, quellen erforderlich): ${geprueft.error.message}`,
    );
  }

  return { inhalt: content, frontmatter: geprueft.data, kapitel };
}
