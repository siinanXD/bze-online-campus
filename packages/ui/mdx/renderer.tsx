import type { ComponentType, ReactNode } from 'react';
import * as jsxRuntimeProd from 'react/jsx-runtime';
import * as jsxRuntimeDev from 'react/jsx-dev-runtime';
import { serialize } from 'next-mdx-remote/serialize';
import { erzeugeFachkundeMdxComponents } from './components';
import { extractKapitel, type Kapitel } from './headings';
import { fachkundeFrontmatterSchema, type FachkundeFrontmatter } from './frontmatter';

export type FachkundeMdxErgebnis = {
  inhalt: ReactNode;
  frontmatter: FachkundeFrontmatter;
  kapitel: Kapitel[];
};

type MdxContentProps = {
  components?: Record<string, unknown>;
};

const mdxJsxRuntime = process.env.NODE_ENV === 'production' ? jsxRuntimeProd : jsxRuntimeDev;

/**
 * Rendert eine Fachkunde-Lerneinheit serverseitig.
 *
 * Wichtig (Next 15.5 / React 19 Dev): `compileMDX` aus next-mdx-remote/rsc wrappt mit
 * `React.createElement`, wodurch Elemente ohne Dev-Properties entstehen und Flight mit
 * "Attempted to render MDXContent without development properties" (HTTP 500) abbricht.
 * Deshalb serialisieren wir selbst und mounten mit JSX aus diesem Modul (jsxDEV).
 */
export async function renderFachkundeMdx(source: string): Promise<FachkundeMdxErgebnis> {
  const kapitel = extractKapitel(source);
  const components = erzeugeFachkundeMdxComponents(kapitel);

  const { compiledSource, frontmatter, scope } = await serialize(
    source,
    { parseFrontmatter: true },
    // RSC: kein providerImportSource / useMDXComponents
    true,
  );

  const fullScope = Object.assign(
    {
      opts: mdxJsxRuntime,
    },
    { frontmatter },
    scope,
  );
  const keys = Object.keys(fullScope);
  const values = Object.values(fullScope);
  const hydrateFn = Reflect.construct(Function, keys.concat([compiledSource]));
  const Content = hydrateFn.apply(hydrateFn, values).default as ComponentType<MdxContentProps>;

  const geprueft = fachkundeFrontmatterSchema.safeParse(frontmatter);
  if (!geprueft.success) {
    throw new Error(
      `Lerneinheit hat eine ungültige Frontmatter (titel, thema_code, lesedauer_minuten, quellen erforderlich): ${geprueft.error.message}`,
    );
  }

  // JSX hier (nicht createElement): liefert die von React 19 Flight erwarteten Dev-Properties.
  const inhalt = <Content components={components} />;

  return { inhalt, frontmatter: geprueft.data, kapitel };
}
