import * as React from 'react';

export function Abschnitt({
  titel,
  hinweis,
  children,
}: {
  titel: string;
  hinweis?: string;
  children: React.ReactNode;
}) {
  const id = titel.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <section id={id} className="scroll-mt-20 space-y-4 border-t border-border pt-8">
      <div className="space-y-1">
        <h2 className="text-h2">{titel}</h2>
        {hinweis && <p className="max-w-lese text-body-sm text-fg-muted">{hinweis}</p>}
      </div>
      {children}
    </section>
  );
}

export function Reihe({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-overline uppercase text-fg-subtle">{label}</p>
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4">
        {children}
      </div>
    </div>
  );
}
