import type { FachkundeFrontmatter } from '../../../../../packages/ui/mdx';

function reviewStatusText(status: FachkundeFrontmatter['review_status']): string {
  if (status === 'freigegeben') return 'Fachlich freigegeben';
  if (status === 'fachlich_geprueft') return 'Fachlich geprueft';
  return 'Entwurf';
}

/**
 * Kompakter Freigabe-Hinweis unter dem Titel (nicht dominant gegenueber Figma-Inhalt).
 */
export function FreigabeHinweis({ frontmatter }: { frontmatter: FachkundeFrontmatter }) {
  const freigabe = frontmatter.fachliche_freigabe;
  const freigabeOffen = freigabe.erforderlich && frontmatter.review_status !== 'freigegeben';
  if (!freigabeOffen && frontmatter.review_status === 'freigegeben') return null;

  return (
    <details className="mb-3 rounded-[10px] border border-warning-border bg-warning-bg/70">
      <summary className="cursor-pointer list-none px-3 py-2 text-[12px] font-medium text-fg [&::-webkit-details-marker]:hidden">
        {reviewStatusText(frontmatter.review_status)}
        {frontmatter.fragen_status === 'freigegeben' ? ' · Fragen freigegeben' : ''} · Details
      </summary>
      <div className="border-t border-warning-border/50 px-3 py-2">
        <p className="text-[12px] leading-[18px] text-fg-muted">
          {freigabe.hinweis ?? 'Entwurf bis zur Ausbilderfreigabe.'}
        </p>
      </div>
    </details>
  );
}
