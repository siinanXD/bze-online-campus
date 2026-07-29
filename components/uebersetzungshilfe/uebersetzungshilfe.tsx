'use client';
import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@bze/ui';

export interface UebersetzungshilfeProps {
  /** Deutscher Originaltext (Prüfungsinhalt/Fachkunde). Immer sichtbar. */
  original: string;
  /**
   * Freigegebene Übersetzung in der aktiven Nutzersprache. Wird ZUSÄTZLICH unter
   * dem Original eingeblendet. `null`/leer = keine freigegebene Übersetzung
   * vorhanden (dann erscheint ein dezenter Hinweis statt der Übersetzung).
   */
  uebersetzung?: string | null;
  /** Übersetzung von Anfang an eingeblendet (Standard: false → einblendbar). */
  defaultOffen?: boolean;
  /** HTML-Tag für den Originaltext (Standard: p). */
  as?: 'p' | 'span' | 'div';
  className?: string;
  /** Zusätzliche Klassen für den Originaltext. */
  textClassName?: string;
}

const RTL_LOCALES = new Set(['ar']);

/**
 * Übersetzungshilfe (AP-14, Spec §6 / §5).
 *
 * Nicht verhandelbar: **Prüfungsinhalte bleiben Deutsch.** Diese Komponente zeigt
 * das deutsche Original unverändert und blendet die Übersetzung ausschließlich
 * ZUSÄTZLICH darunter ein — nie an dessen Stelle. In der deutschen Oberfläche
 * (locale = de) wird nur das Original gerendert; eine Übersetzung wäre redundant.
 *
 * Reine Anzeigekomponente ohne Datenzugriff: Der aufrufende Kontext lädt die
 * freigegebene Übersetzung (z. B. aus `fragen_uebersetzungen` /
 * `lerneinheiten_uebersetzungen`) und übergibt sie als Prop. So bleibt die
 * Komponente in Lernkarte, Fachkunde und Wochenbericht gleichermaßen einsetzbar,
 * ohne die Ownership anderer Arbeitspakete (z. B. AP-06 Lernmodus) zu berühren.
 *
 * Barrierefreiheit: Umschalter mit `aria-expanded`/`aria-controls`; die
 * Übersetzung erhält `lang` und (für Arabisch) `dir="rtl"`. Der Hinweis
 * „Lernhilfe" ist sichtbar. Farbe ist nie alleiniger Informationsträger — der
 * Zustand trägt Symbol und Textlabel.
 */
export function Uebersetzungshilfe({
  original,
  uebersetzung,
  defaultOffen = false,
  as = 'p',
  className,
  textClassName,
}: UebersetzungshilfeProps) {
  const locale = useLocale();
  const t = useTranslations('uebersetzungshilfe');
  const reactId = React.useId();
  const regionId = `uebersetzung-${reactId}`;
  const [offen, setOffen] = React.useState(defaultOffen);

  const OriginalTag = as;
  const original_element = (
    <OriginalTag lang="de" className={cn('text-base leading-relaxed', textClassName)}>
      {original}
    </OriginalTag>
  );

  // Deutsche Oberfläche: nur das Original, keine Zusatzübersetzung nötig.
  if (locale === 'de') {
    return <div className={className}>{original_element}</div>;
  }

  const dir = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';
  const hatUebersetzung = typeof uebersetzung === 'string' && uebersetzung.trim().length > 0;

  return (
    <div className={className}>
      {original_element}

      <button
        type="button"
        onClick={() => setOffen((v) => !v)}
        aria-expanded={offen}
        aria-controls={regionId}
        className={cn(
          'touchable mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-2',
          'text-sm font-semibold text-accent underline-offset-2 hover:underline',
        )}
      >
        <span aria-hidden="true">{offen ? '▾' : '▸'}</span>
        <span aria-hidden="true">🌐</span>
        {offen ? t('ausblenden') : t('einblenden')}
      </button>

      {offen && (
        <div
          id={regionId}
          dir={dir}
          lang={locale}
          className="mt-2 rounded-xl border-s-2 border-border bg-surface/60 px-3 py-2"
        >
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">
            {t('uebersetzungLabel')}
          </p>
          {hatUebersetzung ? (
            <p className="text-base leading-relaxed">{uebersetzung}</p>
          ) : (
            <p className="text-sm italic text-muted">{t('nichtVerfuegbar')}</p>
          )}
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted">
            <span aria-hidden="true">ℹ</span>
            {t('hinweis')}
          </p>
        </div>
      )}
    </div>
  );
}
