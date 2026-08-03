import type { ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import type { Kapitel } from './headings';
import {
  BegriffListe,
  EinfachErklaert,
  FachlichErklaert,
  Formelkarte,
  InteraktivPlatzhalter,
  Merksatz,
  MessschieberSchema,
  Praxisbeispiel,
  SchemaPlatzhalter,
  SpritzgiesszyklusSchema,
  StoryEinstieg,
  TabellenbuchHinweis,
  ToleranzfeldSchema,
  WissensstufenLeiste,
} from '../src/fachkunde-mdx-kern';
import * as InteraktivKatalog from './katalog-client';
import { MDX_SCHEMA_TAGS, MDX_VISUAL_FALLBACK_TAGS } from './mdx-tag-listen';

/**
 * Baut die MDX-Komponentenmap fuer Campus-Lerneinheiten.
 *
 * - Kern-Bausteine + Figma-Schemas (Server)
 * - Alle Interaktiv-Trainer aus dem Client-Katalog
 * - Explizite Schema-/Visual-Fallbacks (kein Proxy: MDX kopiert die Map)
 */
export function erzeugeFachkundeMdxComponents(kapitel: readonly Kapitel[]): MDXComponents {
  let naechstesKapitel = 0;

  const basis: Record<string, unknown> = {
    h1: ({ children }: { children?: ReactNode }) => (
      <h1 className="mb-3 text-2xl font-extrabold text-fg">{children}</h1>
    ),
    h2: ({ children }: { children?: ReactNode }) => {
      const eintrag = kapitel[naechstesKapitel];
      naechstesKapitel += 1;
      return (
        <h2 id={eintrag?.slug} className="mb-2 mt-6 scroll-mt-24 text-xl font-bold text-fg">
          {children}
        </h2>
      );
    },
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="mb-2 mt-4 text-lg font-bold text-fg">{children}</h3>
    ),
    p: ({ children }: { children?: ReactNode }) => (
      <p className="mb-3 leading-relaxed text-fg">{children}</p>
    ),
    ul: ({ children }: { children?: ReactNode }) => (
      <ul className="mb-3 list-disc space-y-1 ps-6 text-fg">{children}</ul>
    ),
    ol: ({ children }: { children?: ReactNode }) => (
      <ol className="mb-3 list-decimal space-y-1 ps-6 text-fg">{children}</ol>
    ),
    li: ({ children }: { children?: ReactNode }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-bold text-fg">{children}</strong>
    ),
    em: ({ children }: { children?: ReactNode }) => <em className="italic text-fg">{children}</em>,
    a: ({ href, children }: { href?: string; children?: ReactNode }) => (
      <a href={href} className="font-semibold text-primary underline underline-offset-2">
        {children}
      </a>
    ),
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="mb-3 border-s-4 border-primary bg-surface p-4 text-fg-muted">{children}</blockquote>
    ),
    hr: () => <hr className="my-6 border-border" />,
    code: ({ children }: { children?: ReactNode }) => (
      <code className="rounded-xl bg-surface px-1.5 py-0.5 text-[15px] text-fg">{children}</code>
    ),
    pre: ({ children }: { children?: ReactNode }) => (
      <pre className="mb-3 overflow-x-auto rounded-xl border border-border bg-surface p-4 text-[15px] text-fg">
        {children}
      </pre>
    ),
    table: ({ children }: { children?: ReactNode }) => (
      <div className="mb-3 overflow-x-auto">
        <table className="w-full border-collapse text-start text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }: { children?: ReactNode }) => (
      <thead className="border-b border-border text-fg">{children}</thead>
    ),
    tbody: ({ children }: { children?: ReactNode }) => (
      <tbody className="divide-y divide-border">{children}</tbody>
    ),
    tr: ({ children }: { children?: ReactNode }) => <tr>{children}</tr>,
    th: ({ children }: { children?: ReactNode }) => (
      <th className="p-2 text-start font-bold text-fg">{children}</th>
    ),
    td: ({ children }: { children?: ReactNode }) => (
      <td className="p-2 text-start text-fg">{children}</td>
    ),
    img: ({ src, alt }: { src?: string | Blob; alt?: string }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={typeof src === 'string' ? src : undefined}
        alt={alt ?? ''}
        className="mb-3 w-full rounded-xl border border-border"
      />
    ),

    WissensstufenLeiste,
    StoryEinstieg,
    EinfachErklaert,
    FachlichErklaert,
    Praxisbeispiel,
    Merksatz,
    BegriffListe,
    TabellenbuchHinweis,
    Formelkarte,
    MessschieberSchema,
    ToleranzfeldSchema,
    SpritzgiesszyklusSchema,
    // Alias: Content nutzt teils GrenzmasseToleranzSchema fuer dasselbe Visual
    GrenzmasseToleranzSchema: ToleranzfeldSchema,
  };

  for (const [name, komponente] of Object.entries(InteraktivKatalog)) {
    if (typeof komponente === 'function' || (typeof komponente === 'object' && komponente !== null)) {
      basis[name] = komponente;
    }
  }

  for (const schemaName of MDX_SCHEMA_TAGS) {
    if (basis[schemaName] !== undefined) continue;
    const label = schemaName.replace(/Schema$/, '');
    basis[schemaName] = function SchemaFallback(props: { titel?: string; className?: string }) {
      return <SchemaPlatzhalter titel={props.titel ?? label} className={props.className} />;
    };
  }

  for (const visualName of MDX_VISUAL_FALLBACK_TAGS) {
    if (basis[visualName] !== undefined) continue;
    // Client-Trainer/Interaktionen haben Vorrang, falls unter gleichem Namen exportiert
    if (visualName in InteraktivKatalog) {
      basis[visualName] = InteraktivKatalog[visualName as keyof typeof InteraktivKatalog];
      continue;
    }
    basis[visualName] = function VisualFallback(props: { titel?: string; className?: string }) {
      return <SchemaPlatzhalter titel={props.titel ?? visualName} className={props.className} />;
    };
  }

  // Sicherheit: unbekannte Trainer-Namen aus Content, die nicht im Client-Katalog sind
  if (basis.MiniWissenscheck === undefined) {
    basis.MiniWissenscheck = InteraktivPlatzhalter;
  }

  return basis as MDXComponents;
}
