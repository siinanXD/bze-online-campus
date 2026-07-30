import type { MDXComponents } from 'mdx/types';
import type { Kapitel } from './headings';

/**
 * Komponenten-Mapping für next-mdx-remote/rsc auf @bze/ui-Stil/Tokens (SPEC §6.2.6).
 *
 * Tailwind-Hinweis: `packages/ui/mdx/` liegt außerhalb der `content`-Globs in
 * `tailwind.config.ts`. AP-05 darf diese Konfigurationsdatei nicht ändern (Datei-Hoheit).
 * Alle hier neu eingeführten Klassen (die nicht schon in `packages/ui/src/**` oder `app/**`
 * vorkommen) werden deshalb zusätzlich in
 * `app/[locale]/campus/topic/_lib/tailwind-safelist.ts` referenziert, damit der Tailwind-Scanner
 * sie in einem gescannten Verzeichnis sieht und nicht aus dem Produktions-Build entfernt
 * ("purged"). Folgeaufgabe für ein eigenes kleines Arbeitspaket: `packages/ui/mdx/**`
 * in den `content`-Glob aufnehmen, dann kann die Safelist-Datei wieder entfernt werden.
 *
 * H2-Überschriften erhalten ihre Anker-ID aus `kapitel` (siehe `extractKapitel`), in exakt der
 * Reihenfolge, in der next-mdx-remote sie server-seitig rendert — dieselbe Quelle, aus der die
 * Kapitel-Fortschrittsleiste (`_components/kapitelleiste.tsx`) ihre Liste bezieht, damit Anker
 * und Navigation nie auseinanderlaufen.
 */
export function erzeugeFachkundeMdxComponents(kapitel: readonly Kapitel[]): MDXComponents {
  let naechstesKapitel = 0;

  return {
    h1: ({ children }) => <h1 className="mb-3 text-2xl font-extrabold text-fg">{children}</h1>,
    h2: ({ children }) => {
      const eintrag = kapitel[naechstesKapitel];
      naechstesKapitel += 1;
      return (
        <h2 id={eintrag?.slug} className="mb-2 mt-6 scroll-mt-24 text-xl font-bold text-fg">
          {children}
        </h2>
      );
    },
    h3: ({ children }) => <h3 className="mb-2 mt-4 text-lg font-bold text-fg">{children}</h3>,
    p: ({ children }) => <p className="mb-3 leading-relaxed text-fg">{children}</p>,
    ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 ps-6 text-fg">{children}</ul>,
    ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 ps-6 text-fg">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }) => <strong className="font-bold text-fg">{children}</strong>,
    em: ({ children }) => <em className="italic text-fg">{children}</em>,
    a: ({ href, children }) => (
      <a href={href} className="font-semibold text-primary underline underline-offset-2">
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mb-3 border-s-4 border-primary bg-surface p-4 text-fg-muted">{children}</blockquote>
    ),
    hr: () => <hr className="my-6 border-border" />,
    code: ({ children }) => (
      <code className="rounded-xl bg-surface px-1.5 py-0.5 text-[15px] text-fg">{children}</code>
    ),
    pre: ({ children }) => (
      <pre className="mb-3 overflow-x-auto rounded-xl border border-border bg-surface p-4 text-[15px] text-fg">
        {children}
      </pre>
    ),
    table: ({ children }) => (
      // Abbildungen und Tabellen über die volle Breite (SPEC §6.2.6), waagerechtes Scrollen nur
      // hier erlaubt (SPEC §7), niemals für den restlichen Seiteninhalt.
      <div className="mb-3 overflow-x-auto">
        <table className="w-full border-collapse text-start text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="border-b border-border text-fg">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => <th className="p-2 text-start font-bold text-fg">{children}</th>,
    td: ({ children }) => <td className="p-2 text-start text-fg">{children}</td>,
    img: ({ src, alt }) => (
      // Abbildungen unmittelbar unter dem zugehörigen Schritt (SPEC §6.2.6). Alt-Text ist im
      // MDX-Quelltext Pflicht (WCAG 2.1 AA, AGENTS.md §7).
      // eslint-disable-next-line @next/next/no-img-element
      <img src={typeof src === 'string' ? src : undefined} alt={alt ?? ''} className="mb-3 w-full rounded-xl border border-border" />
    ),
  };
}
