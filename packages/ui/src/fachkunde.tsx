import * as React from 'react';
import { Badge, type BadgeVariante } from './primitive/anzeige';
import { Card } from './primitive/card';
import { cn } from './cn';

export type Wissensstufe =
  | 'auswendig_wissen'
  | 'verstehen'
  | 'anwenden'
  | 'tabellenbuch_finden'
  | 'zusatzwissen';

const wissensstufen: Record<Wissensstufe, { label: string; symbol: string; variante: BadgeVariante }> = {
  auswendig_wissen: { label: 'Muss ich auswendig wissen', symbol: '!', variante: 'danger' },
  verstehen: { label: 'Muss ich verstehen', symbol: 'i', variante: 'info' },
  anwenden: { label: 'Muss ich anwenden koennen', symbol: '>', variante: 'primary' },
  tabellenbuch_finden: { label: 'Sollte ich im Tabellenbuch finden koennen', symbol: '#', variante: 'warning' },
  zusatzwissen: { label: 'Zusatzwissen', symbol: '+', variante: 'neutral' },
};

/** Vier Kernstufen fuer die nummerierte Leiste (Figma Wissensstufen). */
const WISSENSSTUFEN_LEISTE = [
  {
    stufe: 'auswendig_wissen' as const,
    nummer: '1',
    kurz: 'Auswendig',
    aktiv: 'border-success bg-success-bg text-success',
  },
  {
    stufe: 'verstehen' as const,
    nummer: '2',
    kurz: 'Verstehen',
    aktiv: 'border-primary bg-primary-subtle text-primary',
  },
  {
    stufe: 'anwenden' as const,
    nummer: '3',
    kurz: 'Anwenden',
    aktiv: 'border-info bg-info-bg text-info',
  },
  {
    stufe: 'tabellenbuch_finden' as const,
    nummer: '4',
    kurz: 'Tabellenbuch',
    aktiv: 'border-border-strong bg-bg-subtle text-fg-subtle',
  },
] as const;

const kastenStile = {
  story: 'border-info-border bg-info-bg',
  einfach: 'border-success-border bg-success-bg',
  fachlich: 'border-border bg-surface',
  praxis: 'border-primary-border bg-primary-subtle',
  merksatz: 'border-warning-border bg-warning-bg',
} as const;

const kastenLabels: Record<keyof typeof kastenStile, string> = {
  story: 'Story',
  einfach: 'Einfach',
  fachlich: 'Fachlich',
  praxis: 'Praxis',
  merksatz: 'Merksatz',
};

export interface FachkundeKastenProps extends React.HTMLAttributes<HTMLDivElement> {
  titel: string;
  variante: keyof typeof kastenStile;
  symbol: string;
}

/**
 * Rendert einen didaktischen Fachkunde-Block mit Label-Pill, Titel und Inhalt (Figma Lernbausteine).
 */
export function FachkundeKasten({
  titel,
  variante,
  symbol,
  className,
  children,
  ...props
}: FachkundeKastenProps) {
  return (
    <section className={cn('mb-4 rounded-lg border p-5', kastenStile[variante], className)} {...props}>
      <div className="mb-3 inline-flex items-center gap-2 rounded-sm border border-current/30 bg-surface px-2 py-1 text-caption font-semibold text-fg">
        <span aria-hidden="true">{symbol}</span>
        <span>{kastenLabels[variante]}</span>
      </div>
      <h3 className="mb-2 text-[18px] font-semibold leading-7 text-fg">{titel}</h3>
      <div className="space-y-2 text-body-sm leading-relaxed text-fg-muted">{children}</div>
    </section>
  );
}

/**
 * Einstiegssituation aus dem Arbeitsalltag.
 */
export function StoryEinstieg(props: Omit<FachkundeKastenProps, 'variante' | 'symbol'>) {
  return <FachkundeKasten variante="story" symbol="S" {...props} />;
}

/**
 * Sehr einfache Erklaerung mit Alltagssprache.
 */
export function EinfachErklaert(props: Omit<FachkundeKastenProps, 'variante' | 'symbol'>) {
  return <FachkundeKasten variante="einfach" symbol="E" {...props} />;
}

/**
 * Fachlich korrekte Erklaerung mit Produktionsbezug.
 */
export function FachlichErklaert(props: Omit<FachkundeKastenProps, 'variante' | 'symbol'>) {
  return <FachkundeKasten variante="fachlich" symbol="F" {...props} />;
}

/**
 * Praxisbeispiel aus Metall- oder Kunststoffbetrieb.
 */
export function Praxisbeispiel(props: Omit<FachkundeKastenProps, 'variante' | 'symbol'>) {
  return <FachkundeKasten variante="praxis" symbol="P" {...props} />;
}

/**
 * Praegnanten Merksatz anzeigen.
 */
export function Merksatz(props: Omit<FachkundeKastenProps, 'variante' | 'symbol'>) {
  return <FachkundeKasten variante="merksatz" symbol="M" {...props} />;
}

export interface WissensstufeBadgeProps {
  stufe: Wissensstufe;
  className?: string;
}

/**
 * Zeigt eine Wissensanforderung mit Text, Symbol und Farbe.
 */
export function WissensstufeBadge({ stufe, className }: WissensstufeBadgeProps) {
  const daten = wissensstufen[stufe];
  return (
    <Badge variante={daten.variante} symbol={daten.symbol} className={className}>
      {daten.label}
    </Badge>
  );
}

export interface WissensstufenLeisteProps {
  stufen: Wissensstufe[];
  className?: string;
}

/**
 * Gruppiert Wissensstufen als nummerierte Boxen mit Kurzlegende (Figma Wissensstufen Leiste).
 * Farbe ist nie alleiniger Traeger — Nummer und Kurzlabel bleiben sichtbar.
 */
export function WissensstufenLeiste({ stufen, className }: WissensstufenLeisteProps) {
  const aktiv = new Set(Array.isArray(stufen) ? stufen : []);

  return (
    <section
      className={cn('mb-4 rounded-lg border border-border bg-surface p-5', className)}
      aria-label="Wissensstufen"
    >
      <h3 className="mb-4 text-[18px] font-semibold leading-7 text-fg">Wissensstufen</h3>
      <div className="flex flex-wrap gap-2">
        {WISSENSSTUFEN_LEISTE.map((eintrag) => {
          const istAktiv = aktiv.has(eintrag.stufe);
          return (
            <div
              key={eintrag.stufe}
              className={cn(
                'flex h-12 min-w-[2.75rem] flex-col items-center justify-center rounded-[10px] border px-2',
                istAktiv ? eintrag.aktiv : 'border-border bg-bg-subtle text-fg-subtle opacity-55',
              )}
              title={wissensstufen[eintrag.stufe].label}
              aria-label={`${eintrag.nummer}: ${wissensstufen[eintrag.stufe].label}${istAktiv ? '' : ' (nicht markiert)'}`}
            >
              <span className="text-base font-bold leading-6">{eintrag.nummer}</span>
              <span className="sr-only">{eintrag.kurz}</span>
            </div>
          );
        })}
      </div>
      {aktiv.has('zusatzwissen') ? (
        <div className="mt-3">
          <WissensstufeBadge stufe="zusatzwissen" />
        </div>
      ) : null}
      <p className="mt-4 text-body-sm text-fg-muted">
        Auswendig → verstehen → anwenden → Tabellenbuch.
      </p>
    </section>
  );
}

export interface BegriffChipProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  begriff: string;
}

/**
 * Rendert einen verlinkbaren Fachbegriff-Chip.
 */
export function BegriffChip({ begriff, className, href, ...props }: BegriffChipProps) {
  return (
    <a
      href={href ?? `#begriff-${slug(begriff)}`}
      className={cn(
        'inline-flex min-h-touch items-center rounded-full border border-border-strong bg-surface px-3 py-2 text-sm font-semibold text-fg underline-offset-2 hover:border-primary hover:text-primary focus:outline-none focus:ring-3 focus:ring-primary/35',
        className,
      )}
      {...props}
    >
      {begriff}
    </a>
  );
}

export interface BegriffListeProps {
  begriffe: string[];
  className?: string;
}

/**
 * Zeigt die wichtigsten Fachbegriffe einer Einheit als Chips.
 */
export function BegriffListe({ begriffe, className }: BegriffListeProps) {
  return (
    <section className={cn('mb-4', className)} aria-label="Fachbegriffe">
      <h3 className="mb-2 text-label font-bold text-fg">Fachbegriffe</h3>
      <div className="flex flex-wrap gap-2">
        {begriffe.map((begriff) => (
          <BegriffChip key={begriff} begriff={begriff} />
        ))}
      </div>
    </section>
  );
}

export interface FormelkarteProps {
  name: string;
  formel: string;
  einheiten: string;
  verwendung: string;
  beispiel: string;
  typischerFehler: string;
  tabellenbuchHinweis: string;
  className?: string;
}

/**
 * Stellt eine Formel ohne zusaetzliche Rendering-Abhaengigkeit dar.
 */
export function Formelkarte({
  name,
  formel,
  einheiten,
  verwendung,
  beispiel,
  typischerFehler,
  tabellenbuchHinweis,
  className,
}: FormelkarteProps) {
  return (
    <Card variante="flach" className={cn('mb-4 border-info-border bg-info-bg/35', className)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-label font-bold text-fg">{name}</h3>
        <Badge variante="info" symbol="f">
          Formel
        </Badge>
      </div>
      <p className="mb-3 rounded-lg border border-border bg-surface p-3 text-center font-mono text-body-lg text-fg">
        {formel}
      </p>
      <dl className="space-y-2 text-body-sm text-fg">
        <div>
          <dt className="font-semibold">Einheiten</dt>
          <dd className="text-fg-muted">{einheiten}</dd>
        </div>
        <div>
          <dt className="font-semibold">Wann verwenden?</dt>
          <dd className="text-fg-muted">{verwendung}</dd>
        </div>
        <div>
          <dt className="font-semibold">Beispiel</dt>
          <dd className="text-fg-muted">{beispiel}</dd>
        </div>
        <div>
          <dt className="font-semibold">Typischer Fehler</dt>
          <dd className="text-fg-muted">{typischerFehler}</dd>
        </div>
        <div>
          <dt className="font-semibold">Tabellenbuch</dt>
          <dd className="text-fg-muted">{tabellenbuchHinweis}</dd>
        </div>
      </dl>
    </Card>
  );
}

export interface TabellenbuchHinweisProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Markiert Inhalte, die nicht auswendig geraten werden duerfen.
 */
export function TabellenbuchHinweis({ children, className }: TabellenbuchHinweisProps) {
  return (
    <div className={cn('mb-4 rounded-lg border border-warning-border bg-warning-bg/45 p-4 text-body-sm text-fg', className)}>
      <p className="mb-1 font-bold">Tabellenbuch-Hinweis</p>
      <div className="leading-relaxed text-fg-muted">{children}</div>
    </div>
  );
}

export interface MessschieberSchemaProps {
  className?: string;
}

/**
 * Vereinfachte, beschriftete Messschieber-Illustration fuer den ersten Slice.
 */
export function MessschieberSchema({ className }: MessschieberSchemaProps) {
  const labels = [
    { x: 46, y: 36, text: 'fester Messschenkel' },
    { x: 184, y: 36, text: 'beweglicher Messschenkel' },
    { x: 235, y: 104, text: 'Nonius' },
    { x: 95, y: 142, text: 'Hauptskala' },
    { x: 345, y: 142, text: 'Tiefenmass' },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 420 190" role="img" aria-labelledby="messschieber-title messschieber-desc" className="h-auto w-full">
        <title id="messschieber-title">Vereinfachter Messschieber mit beschrifteten Teilen</title>
        <desc id="messschieber-desc">
          Schema mit festem Messschenkel, beweglichem Messschenkel, Hauptskala, Nonius und Tiefenmass.
        </desc>
        <rect x="28" y="84" width="350" height="22" rx="4" className="fill-bg-subtle stroke-border-strong" />
        <rect x="170" y="74" width="82" height="44" rx="5" className="fill-primary-subtle stroke-primary-border" />
        <path d="M40 84 L40 26 L74 84 Z" className="fill-surface-raised stroke-border-strong" />
        <path d="M184 84 L184 30 L220 84 Z" className="fill-surface-raised stroke-border-strong" />
        <path d="M378 95 L410 95" className="stroke-border-strong" strokeWidth="4" strokeLinecap="round" />
        {Array.from({ length: 15 }).map((_, index) => (
          <path
            key={index}
            d={`M${58 + index * 20} 84 L${58 + index * 20} ${index % 5 === 0 ? 65 : 72}`}
            className="stroke-fg-muted"
            strokeWidth="2"
          />
        ))}
        {Array.from({ length: 6 }).map((_, index) => (
          <path
            key={index}
            d={`M${184 + index * 11} 118 L${184 + index * 11} ${index % 2 === 0 ? 132 : 126}`}
            className="stroke-primary"
            strokeWidth="2"
          />
        ))}
        {labels.map((label) => (
          <g key={label.text}>
            <circle cx={label.x} cy={label.y} r="3" className="fill-primary" />
            <text x={label.x + 8} y={label.y + 4} className="fill-fg text-[10px] font-semibold">
              {label.text}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Die Beschriftungen zeigen nur die wichtigsten Teile. Fuer echte Messwerte zaehlt immer die Skala am Pruefmittel.
      </figcaption>
    </figure>
  );
}

export interface PruefenMessenLehrenSchemaProps {
  className?: string;
}

/**
 * Stellt Pruefen, Messen und Lehren als drei Vergleichskarten dar.
 */
export function PruefenMessenLehrenSchema({ className }: PruefenMessenLehrenSchemaProps) {
  const karten = [
    { titel: 'Pruefen', text: 'Anforderung erfuellt?' },
    { titel: 'Messen', text: 'Zahlenwert bestimmen' },
    { titel: 'Lehren', text: 'Gut oder Ausschuss' },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="pml-title pml-desc" className="h-auto w-full">
        <title id="pml-title">Pruefen Messen und Lehren unterscheiden</title>
        <desc id="pml-desc">Drei Vergleichskarten zeigen Pruefen, Messen und Lehren mit kurzer Bedeutung.</desc>
        <rect x="36" y="34" width="388" height="152" rx="10" className="fill-bg-subtle stroke-border" />
        {karten.map((karte, index) => {
          const x = 68 + index * 112;
          return (
            <g key={karte.titel}>
              <rect x={x} y="70" width="92" height="78" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
              <text x={x + 46} y="100" textAnchor="middle" className="fill-fg text-[12px] font-bold">{karte.titel}</text>
              <text x={x + 46} y="124" textAnchor="middle" className="fill-fg-muted text-[8px] font-semibold">{karte.text}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Pruefen ist der Oberbegriff. Messen liefert Zahlenwerte, Lehren liefert meist eine Gut/Ausschuss-Entscheidung.
      </figcaption>
    </figure>
  );
}

export interface AussenmessungSchemaProps {
  className?: string;
}

/**
 * Visualisiert eine Aussenmessung mit den grossen Messschenkeln.
 */
export function AussenmessungSchema({ className }: AussenmessungSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="aussen-title aussen-desc" className="h-auto w-full">
        <title id="aussen-title">Aussenmessung mit Messschieber</title>
        <desc id="aussen-desc">Messschieber umfasst ein Werkstueck von aussen mit den grossen Messschenkeln.</desc>
        <rect x="44" y="36" width="372" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="186" y="86" width="88" height="52" rx="8" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <path d="M122 70 L122 154 L164 154 L164 138 L140 138 L140 86 L164 86 L164 70 Z" className="fill-surface-raised stroke-border-strong" />
        <path d="M338 70 L338 154 L296 154 L296 138 L320 138 L320 86 L296 86 L296 70 Z" className="fill-surface-raised stroke-border-strong" />
        <path d="M140 112 L186 112 M274 112 L320 112" className="stroke-primary" strokeWidth="3" strokeLinecap="round" />
        <text x="230" y="164" textAnchor="middle" className="fill-fg text-[11px] font-bold">Aussenmass</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Bei der Aussenmessung liegen die grossen Messschenkel sauber und gerade am Werkstueck an.
      </figcaption>
    </figure>
  );
}

export interface InnenTiefenmessungSchemaProps {
  className?: string;
}

/**
 * Zeigt Innenmessung und Tiefenmessung als zwei Messarten mit dem Messschieber.
 */
export function InnenTiefenmessungSchema({ className }: InnenTiefenmessungSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 240" role="img" aria-labelledby="innen-tiefe-title innen-tiefe-desc" className="h-auto w-full">
        <title id="innen-tiefe-title">Innen- und Tiefenmessung mit Messschieber</title>
        <desc id="innen-tiefe-desc">Links wird eine Bohrung innen gemessen, rechts eine Nut mit Tiefenmass.</desc>
        <rect x="38" y="34" width="384" height="160" rx="10" className="fill-bg-subtle stroke-border" />
        <g>
          <rect x="78" y="82" width="116" height="72" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
          <circle cx="136" cy="118" r="24" className="fill-bg-subtle stroke-primary" strokeWidth="3" />
          <path d="M118 118 L154 118" className="stroke-fg-muted" strokeWidth="3" strokeLinecap="round" />
          <text x="136" y="174" textAnchor="middle" className="fill-fg text-[10px] font-bold">Innenmessung</text>
        </g>
        <g>
          <rect x="264" y="72" width="92" height="86" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
          <rect x="294" y="72" width="32" height="56" className="fill-bg-subtle stroke-primary" strokeWidth="2" />
          <path d="M310 50 L310 128" className="stroke-fg-muted" strokeWidth="4" strokeLinecap="round" />
          <text x="310" y="174" textAnchor="middle" className="fill-fg text-[10px] font-bold">Tiefenmessung</text>
        </g>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Innenmessung nutzt die kleinen Messschenkel, Tiefenmessung die Tiefenstange und eine plane Auflage.
      </figcaption>
    </figure>
  );
}

export interface MesswertAblesenSchemaProps {
  className?: string;
}

/**
 * Zeigt Hauptskala und Nonius als vereinfachtes Ableseschema.
 */
export function MesswertAblesenSchema({ className }: MesswertAblesenSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 220" role="img" aria-labelledby="ablesen-title ablesen-desc" className="h-auto w-full">
        <title id="ablesen-title">Messwert am Nonius ablesen</title>
        <desc id="ablesen-desc">Hauptskala und Nonius zeigen ganze Millimeter und Feinablesung.</desc>
        <rect x="42" y="36" width="376" height="136" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="82" y="82" width="292" height="28" rx="4" className="fill-surface-raised stroke-border-strong" />
        {Array.from({ length: 13 }).map((_, index) => (
          <path key={index} d={`M${98 + index * 22} 82 L${98 + index * 22} ${index % 5 === 0 ? 62 : 70}`} className="stroke-fg-muted" strokeWidth="2" />
        ))}
        <rect x="178" y="110" width="110" height="34" rx="5" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        {Array.from({ length: 7 }).map((_, index) => (
          <path key={index} d={`M${192 + index * 13} 144 L${192 + index * 13} ${index === 3 ? 126 : 132}`} className="stroke-primary" strokeWidth="2" />
        ))}
        <text x="128" y="58" className="fill-fg text-[10px] font-bold">Hauptskala</text>
        <text x="220" y="160" className="fill-fg text-[10px] font-bold">Nonius</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Erst die Hauptskala lesen, dann den passenden Noniusstrich fuer den Nachkommanteil suchen.
      </figcaption>
    </figure>
  );
}

export interface BuegelmessschraubeSchemaProps {
  className?: string;
}

/**
 * Visualisiert eine Buegelmessschraube mit Amboss, Spindel und Ratsche.
 */
export function BuegelmessschraubeSchema({ className }: BuegelmessschraubeSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="mikro-title mikro-desc" className="h-auto w-full">
        <title id="mikro-title">Buegelmessschraube mit Spindel und Ratsche</title>
        <desc id="mikro-desc">Schema einer Buegelmessschraube mit Buegel, Amboss, Spindel, Trommel und Ratsche.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M112 78 C76 78 76 152 112 152 L178 152 L178 132 L118 132 C104 132 104 98 118 98 L178 98 L178 78 Z" className="fill-surface-raised stroke-border-strong" />
        <rect x="178" y="106" width="48" height="18" rx="4" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <rect x="226" y="96" width="84" height="38" rx="6" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <rect x="310" y="90" width="46" height="50" rx="8" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <rect x="356" y="104" width="34" height="22" rx="6" className="fill-surface-raised stroke-border-strong" />
        <text x="132" y="174" textAnchor="middle" className="fill-fg-muted text-[9px] font-semibold">Buegel</text>
        <text x="250" y="154" textAnchor="middle" className="fill-fg-muted text-[9px] font-semibold">Spindel</text>
        <text x="333" y="154" textAnchor="middle" className="fill-fg-muted text-[9px] font-semibold">Trommel</text>
        <text x="374" y="144" textAnchor="middle" className="fill-fg-muted text-[9px] font-semibold">Ratsche</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Die Buegelmessschraube eignet sich fuer feine Aussenmessungen; die Ratsche hilft beim gleichmaessigen Messdruck.
      </figcaption>
    </figure>
  );
}

export interface MessuhrSchemaProps {
  className?: string;
}

/**
 * Visualisiert eine Messuhr an einem Rundlauf-Pruefaufbau.
 */
export function MessuhrSchema({ className }: MessuhrSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 240" role="img" aria-labelledby="messuhr-title messuhr-desc" className="h-auto w-full">
        <title id="messuhr-title">Messuhr fuer Rundlauf und Abweichung</title>
        <desc id="messuhr-desc">Eine Messuhr tastet ein rundes Werkstueck ab und zeigt Abweichungen am Zeiger.</desc>
        <rect x="42" y="34" width="376" height="164" rx="10" className="fill-bg-subtle stroke-border" />
        <circle cx="158" cy="132" r="38" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <path d="M120 132 H196" className="stroke-primary" strokeWidth="3" strokeLinecap="round" />
        <path d="M158 94 V170" className="stroke-primary" strokeWidth="3" strokeLinecap="round" />
        <path d="M246 72 V156" className="stroke-border-strong" strokeWidth="8" strokeLinecap="round" />
        <circle cx="246" cy="70" r="42" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        {Array.from({ length: 9 }).map((_, index) => {
          const angle = -120 + index * 30;
          const rad = (angle * Math.PI) / 180;
          const x1 = 246 + Math.cos(rad) * 30;
          const y1 = 70 + Math.sin(rad) * 30;
          const x2 = 246 + Math.cos(rad) * 36;
          const y2 = 70 + Math.sin(rad) * 36;
          return <path key={index} d={`M${x1} ${y1} L${x2} ${y2}`} className="stroke-fg-muted" strokeWidth="2" />;
        })}
        <path d="M246 70 L270 54" className="stroke-danger" strokeWidth="4" strokeLinecap="round" />
        <path d="M246 156 C246 178 214 180 196 150" className="stroke-fg-muted" strokeWidth="4" strokeLinecap="round" fill="none" />
        <text x="158" y="190" textAnchor="middle" className="fill-fg text-[10px] font-bold">Werkstueck drehen</text>
        <text x="246" y="126" textAnchor="middle" className="fill-fg text-[10px] font-bold">Messuhr</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Die Messuhr zeigt Veraenderungen beim Drehen oder Verschieben. Entscheidend sind sauberer Aufbau, ruhiges Ablesen und Vorgabe.
      </figcaption>
    </figure>
  );
}

export interface LehrenSchemaProps {
  className?: string;
}

/**
 * Stellt Grenzlehrdorn und Rachenlehre fuer Gut-/Ausschuss-Pruefungen dar.
 */
export function LehrenSchema({ className }: LehrenSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="lehren-title lehren-desc" className="h-auto w-full">
        <title id="lehren-title">Grenzlehrdorn und Rachenlehre fuer Gut Ausschuss</title>
        <desc id="lehren-desc">Zwei Lehren zeigen Gutseite und Ausschussseite fuer eine schnelle Pruefentscheidung.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <g>
          <rect x="78" y="92" width="130" height="28" rx="14" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
          <circle cx="98" cy="106" r="18" className="fill-success-bg stroke-success-border" strokeWidth="3" />
          <circle cx="188" cy="106" r="18" className="fill-danger-bg stroke-danger-border" strokeWidth="3" />
          <text x="98" y="148" textAnchor="middle" className="fill-fg text-[10px] font-bold">Gut</text>
          <text x="188" y="148" textAnchor="middle" className="fill-fg text-[10px] font-bold">Ausschuss</text>
        </g>
        <g>
          <path d="M284 72 H366 V96 H318 V124 H366 V148 H284 Z" className="fill-surface-raised stroke-primary" strokeWidth="3" />
          <rect x="304" y="100" width="34" height="20" rx="3" className="fill-primary-subtle stroke-primary" strokeWidth="2" />
          <text x="326" y="170" textAnchor="middle" className="fill-fg text-[10px] font-bold">Rachenlehre</text>
        </g>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Lehren liefern keine Messzahl, sondern eine Entscheidung nach Vorgabe: passt, passt nicht oder Pruefung wiederholen.
      </figcaption>
    </figure>
  );
}

export interface PruefmittelpflegeSchemaProps {
  className?: string;
}

/**
 * Zeigt die wichtigsten Pflegeschritte fuer Pruefmittel als Karten.
 */
export function PruefmittelpflegeSchema({ className }: PruefmittelpflegeSchemaProps) {
  const schritte = [
    { titel: 'Reinigen', text: 'Spaene entfernen' },
    { titel: 'Schuetzen', text: 'nicht fallen lassen' },
    { titel: 'Lagern', text: 'trocken und sicher' },
    { titel: 'Melden', text: 'auffaelliges Pruefmittel' },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="pflege-title pflege-desc" className="h-auto w-full">
        <title id="pflege-title">Pruefmittel schonend behandeln</title>
        <desc id="pflege-desc">Vier Karten zeigen Reinigen, Schuetzen, Lagern und Melden.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        {schritte.map((schritt, index) => {
          const x = 68 + index * 84;
          return (
            <g key={schritt.titel}>
              <rect x={x} y="76" width="68" height="76" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
              <circle cx={x + 34} cy="98" r="12" className="fill-primary-subtle stroke-primary" strokeWidth="2" />
              <text x={x + 34} y="122" textAnchor="middle" className="fill-fg text-[9px] font-bold">{schritt.titel}</text>
              <text x={x + 34} y="140" textAnchor="middle" className="fill-fg-muted text-[7px] font-semibold">{schritt.text}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Pruefmittel sind Arbeitsmittel fuer verlaessliche Entscheidungen. Pflege und Meldung auffaelliger Mittel gehoeren zur Messaufgabe.
      </figcaption>
    </figure>
  );
}

export interface KalibrierenJustierenEichenSchemaProps {
  className?: string;
}

/**
 * Vergleicht Kalibrieren, Justieren und Eichen als drei Begriffskarten.
 */
export function KalibrierenJustierenEichenSchema({ className }: KalibrierenJustierenEichenSchemaProps) {
  const karten = [
    { titel: 'Kalibrieren', text: 'Abweichung feststellen' },
    { titel: 'Justieren', text: 'Messmittel einstellen' },
    { titel: 'Eichen', text: 'amtlich bestaetigen' },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="kje-title kje-desc" className="h-auto w-full">
        <title id="kje-title">Kalibrieren Justieren und Eichen unterscheiden</title>
        <desc id="kje-desc">Drei Karten vergleichen Kalibrieren, Justieren und Eichen.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        {karten.map((karte, index) => {
          const x = 72 + index * 108;
          return (
            <g key={karte.titel}>
              <rect x={x} y="72" width="92" height="84" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
              <path d={`M${x + 28} 100 H${x + 64} M${x + 46} 82 V118`} className="stroke-primary" strokeWidth="3" strokeLinecap="round" />
              <text x={x + 46} y="132" textAnchor="middle" className="fill-fg text-[9px] font-bold">{karte.titel}</text>
              <text x={x + 46} y="148" textAnchor="middle" className="fill-fg-muted text-[7px] font-semibold">{karte.text}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Diese Begriffe sind nicht austauschbar. Welche Handlung erlaubt ist, steht in Betriebsvorgabe, Pruefmittelplan oder Unterweisung.
      </figcaption>
    </figure>
  );
}

export interface MessunsicherheitSchemaProps {
  className?: string;
}

/**
 * Visualisiert Streuung und Messunsicherheit ohne verbindliche Zahlenwerte.
 */
export function MessunsicherheitSchema({ className }: MessunsicherheitSchemaProps) {
  const punkte = [
    [138, 116],
    [156, 108],
    [174, 122],
    [194, 112],
    [214, 118],
    [236, 106],
    [258, 124],
    [280, 114],
    [302, 120],
  ] as const;

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="unsicherheit-title unsicherheit-desc" className="h-auto w-full">
        <title id="unsicherheit-title">Messunsicherheit als Streubereich</title>
        <desc id="unsicherheit-desc">Mehrere Messpunkte liegen in einem Streubereich um eine Soll-Linie.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M96 116 H364" className="stroke-primary" strokeWidth="3" strokeLinecap="round" />
        <rect x="126" y="86" width="196" height="60" rx="10" className="fill-info-bg/60 stroke-info-border" strokeWidth="2" />
        {punkte.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="5" className="fill-danger stroke-danger-border" />)}
        <text x="230" y="166" textAnchor="middle" className="fill-fg text-[10px] font-bold">Streuung beachten</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Ein Messwert ist kein Zauberpunkt. Wiederholungen, Messmittel, Mensch und Umgebung koennen zu Streuung fuehren.
      </figcaption>
    </figure>
  );
}

export interface TemperaturMessenSchemaProps {
  className?: string;
}

/**
 * Zeigt warmes und kaltes Werkstueck als Vergleich beim Messen.
 */
export function TemperaturMessenSchema({ className }: TemperaturMessenSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="temp-messen-title temp-messen-desc" className="h-auto w-full">
        <title id="temp-messen-title">Temperatur beim Messen beachten</title>
        <desc id="temp-messen-desc">Ein kaltes und ein warmes Werkstueck werden mit Referenztemperatur verglichen.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <g>
          <rect x="88" y="96" width="110" height="34" rx="8" className="fill-info-bg stroke-info-border" strokeWidth="3" />
          <text x="143" y="152" textAnchor="middle" className="fill-fg text-[10px] font-bold">kalt</text>
        </g>
        <g>
          <rect x="262" y="88" width="126" height="50" rx="8" className="fill-warning-bg stroke-warning-border" strokeWidth="3" />
          <path d="M282 78 C274 66 294 62 286 50 M316 78 C308 66 328 62 320 50 M350 78 C342 66 362 62 354 50" className="stroke-warning" strokeWidth="3" strokeLinecap="round" fill="none" />
          <text x="325" y="152" textAnchor="middle" className="fill-fg text-[10px] font-bold">warm</text>
        </g>
        <path d="M214 114 H246" className="stroke-fg-muted" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 5" />
        <text x="230" y="172" textAnchor="middle" className="fill-fg-muted text-[9px] font-semibold">Referenztemperatur beachten</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Temperatur kann Masse beeinflussen. Kritische Messungen werden nach Vorgabe und erst unter geeigneten Bedingungen beurteilt.
      </figcaption>
    </figure>
  );
}

export interface WerkstoffgruppenSchemaProps {
  className?: string;
}

/**
 * Zeigt Werkstoffgruppen als einfachen Materialbaum.
 */
export function WerkstoffgruppenSchema({ className }: WerkstoffgruppenSchemaProps) {
  const gruppen = [
    { titel: 'Metalle', beispiel: 'Stahl, Alu, Kupfer' },
    { titel: 'Kunststoffe', beispiel: 'Thermo-, Duro-, Elastomer' },
    { titel: 'Hilfsstoffe', beispiel: 'KSS, Oel, Reiniger' },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="wst-title wst-desc" className="h-auto w-full">
        <title id="wst-title">Werkstoffgruppen als Materialbaum</title>
        <desc id="wst-desc">Ein Materialbaum zeigt Metalle, Kunststoffe und Hilfsstoffe als Grundgruppen.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="176" y="56" width="108" height="34" rx="8" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <text x="230" y="78" textAnchor="middle" className="fill-fg text-[11px] font-bold">Werkstoffe</text>
        {gruppen.map((gruppe, index) => {
          const x = 70 + index * 110;
          return (
            <g key={gruppe.titel}>
              <path d={`M230 90 L${x + 48} 112`} className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
              <rect x={x} y="112" width="96" height="52" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
              <text x={x + 48} y="134" textAnchor="middle" className="fill-fg text-[9px] font-bold">{gruppe.titel}</text>
              <text x={x + 48} y="150" textAnchor="middle" className="fill-fg-muted text-[7px] font-semibold">{gruppe.beispiel}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Werkstoffgruppen helfen, Materialangaben, Eigenschaften und Verarbeitungsschritte zuerst grob einzuordnen.
      </figcaption>
    </figure>
  );
}

export interface EisenStahlSchemaProps {
  className?: string;
}

/**
 * Stellt Eisen, Stahl und Legierung als vereinfachte Beziehung dar.
 */
export function EisenStahlSchema({ className }: EisenStahlSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="stahl-title stahl-desc" className="h-auto w-full">
        <title id="stahl-title">Eisenwerkstoffe und Stahl als Legierung</title>
        <desc id="stahl-desc">Eisen, Kohlenstoff und weitere Elemente bilden vereinfacht Stahl als Eisenwerkstoff.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <circle cx="122" cy="104" r="38" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <circle cx="230" cy="104" r="26" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <circle cx="338" cy="104" r="38" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <path d="M160 104 H204 M256 104 H300" className="stroke-primary" strokeWidth="4" strokeLinecap="round" />
        <text x="122" y="108" textAnchor="middle" className="fill-fg text-[11px] font-bold">Eisen</text>
        <text x="230" y="108" textAnchor="middle" className="fill-fg text-[10px] font-bold">C +</text>
        <text x="338" y="108" textAnchor="middle" className="fill-fg text-[11px] font-bold">Stahl</text>
        <text x="230" y="156" textAnchor="middle" className="fill-fg-muted text-[9px] font-semibold">Legieren veraendert Eigenschaften</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Stahl ist ein Eisenwerkstoff. Zusammensetzung und Behandlung bestimmen die Eigenschaften; konkrete Sorten brauchen Datenblatt oder Tabellenbuch.
      </figcaption>
    </figure>
  );
}

export interface GusseisenSchemaProps {
  className?: string;
}

/**
 * Visualisiert Gusseisen mit Graphitstruktur und Bruchhinweis.
 */
export function GusseisenSchema({ className }: GusseisenSchemaProps) {
  const graphit = [
    [126, 88],
    [158, 118],
    [204, 94],
    [244, 126],
    [300, 96],
    [332, 126],
  ] as const;

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="guss-title guss-desc" className="h-auto w-full">
        <title id="guss-title">Gusseisen mit Graphit und Bruchbild</title>
        <desc id="guss-desc">Ein Werkstofffeld zeigt Graphitanteile und eine Bruchkante als vereinfachtes Gusseisenbild.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M92 76 H360 L334 152 H118 Z" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <path d="M112 150 C138 128 162 170 188 146 C216 120 238 168 268 144 C298 120 316 162 342 142" className="stroke-danger" strokeWidth="3" strokeLinecap="round" fill="none" />
        {graphit.map(([x, y], index) => (
          <ellipse key={index} cx={x} cy={y} rx="17" ry="6" transform={`rotate(${index % 2 === 0 ? -24 : 28} ${x} ${y})`} className="fill-fg-muted" />
        ))}
        <text x="230" y="174" textAnchor="middle" className="fill-fg text-[10px] font-bold">Graphit beeinflusst das Verhalten</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Gusseisen ist ein gegossener Eisenwerkstoff. Aufbau, Graphitform und Sorte entscheiden ueber Eigenschaften und Einsatz.
      </figcaption>
    </figure>
  );
}

export interface NichteisenmetalleSchemaProps {
  className?: string;
}

/**
 * Zeigt typische Nichteisenmetalle als Materialkarten.
 */
export function NichteisenmetalleSchema({ className }: NichteisenmetalleSchemaProps) {
  const karten = [
    { titel: 'Aluminium', hinweis: 'leicht' },
    { titel: 'Kupfer', hinweis: 'leitfaehig' },
    { titel: 'Messing', hinweis: 'Kupferlegierung' },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="ne-title ne-desc" className="h-auto w-full">
        <title id="ne-title">Nichteisenmetalle als Materialkarten</title>
        <desc id="ne-desc">Drei Karten zeigen Aluminium, Kupfer und Messing als Beispiele fuer Nichteisenmetalle.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        {karten.map((karte, index) => {
          const x = 78 + index * 108;
          return (
            <g key={karte.titel}>
              <rect x={x} y="74" width="88" height="78" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
              <circle cx={x + 44} cy="98" r="16" className="fill-primary-subtle stroke-primary" strokeWidth="2" />
              <text x={x + 44} y="126" textAnchor="middle" className="fill-fg text-[9px] font-bold">{karte.titel}</text>
              <text x={x + 44} y="144" textAnchor="middle" className="fill-fg-muted text-[8px] font-semibold">{karte.hinweis}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Nichteisenmetalle enthalten Eisen nicht als Hauptbestandteil. Sie werden nach Eigenschaft, Sorte und Einsatzvorgabe gewaehlt.
      </figcaption>
    </figure>
  );
}

export interface AluminiumSchemaProps {
  className?: string;
}

/**
 * Visualisiert Aluminium mit Oxidschicht und Bauteilbezug.
 */
export function AluminiumSchema({ className }: AluminiumSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="alu-title alu-desc" className="h-auto w-full">
        <title id="alu-title">Aluminium in der Produktion mit Oxidschicht</title>
        <desc id="alu-desc">Ein Aluminiumbauteil zeigt eine Oberflaechenschicht und typische Bearbeitungshinweise.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="116" y="82" width="228" height="68" rx="10" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <rect x="116" y="82" width="228" height="14" rx="7" className="fill-info-bg stroke-info-border" strokeWidth="2" />
        <circle cx="164" cy="116" r="18" className="fill-bg-subtle stroke-primary" strokeWidth="3" />
        <circle cx="296" cy="116" r="18" className="fill-bg-subtle stroke-primary" strokeWidth="3" />
        <text x="230" y="174" textAnchor="middle" className="fill-fg text-[10px] font-bold">leicht, gut bearbeitbar, Oberflaeche beachten</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Aluminium ist ein wichtiges Leichtmetall. Legierung, Oberflaeche und Prozessvorgabe entscheiden ueber Bearbeitung und Einsatz.
      </figcaption>
    </figure>
  );
}

export interface KupferSchemaProps {
  className?: string;
}

/**
 * Zeigt Kupfer als leitfaehiges Material in einer einfachen Leitung.
 */
export function KupferSchema({ className }: KupferSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="kupfer-title kupfer-desc" className="h-auto w-full">
        <title id="kupfer-title">Kupfer und Leitfaehigkeit</title>
        <desc id="kupfer-desc">Eine Kupferleitung verbindet zwei Kontakte und zeigt Leitfaehigkeit als Funktionshinweis.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <circle cx="118" cy="112" r="30" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <circle cx="342" cy="112" r="30" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <path d="M148 112 C196 72 264 152 312 112" className="stroke-warning" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M194 98 L210 112 L194 126 M250 98 L266 112 L250 126" className="stroke-fg" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="230" y="166" textAnchor="middle" className="fill-fg text-[10px] font-bold">leitet Waerme und Strom gut</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Kupfer wird wegen seiner Leitfaehigkeit genutzt. Welche Sorte und Verarbeitung passt, steht in Zeichnung, Datenblatt oder Vorgabe.
      </figcaption>
    </figure>
  );
}

export interface ThermoplastSchemaProps {
  className?: string;
}

/**
 * Zeigt das Waermeverhalten von Thermoplasten als einfache Kurve.
 */
export function ThermoplastSchema({ className }: ThermoplastSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="thermo-title thermo-desc" className="h-auto w-full">
        <title id="thermo-title">Thermoplast Verhalten bei Waerme</title>
        <desc id="thermo-desc">Eine Kurve zeigt fest, weich und Schmelze als vereinfachtes Thermoplast-Verhalten.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M92 154 H368 M92 154 V66" className="stroke-fg-muted" strokeWidth="3" strokeLinecap="round" />
        <path d="M104 146 C158 142 190 130 222 104 C254 78 302 72 352 72" className="stroke-primary" strokeWidth="5" strokeLinecap="round" fill="none" />
        <rect x="104" y="120" width="62" height="24" rx="6" className="fill-surface-raised stroke-primary" />
        <path d="M204 118 C226 100 248 132 270 112 C292 94 314 122 336 104" className="stroke-warning" strokeWidth="4" strokeLinecap="round" fill="none" />
        <text x="130" y="168" textAnchor="middle" className="fill-fg text-[9px] font-bold">fest</text>
        <text x="230" y="168" textAnchor="middle" className="fill-fg text-[9px] font-bold">weich</text>
        <text x="330" y="168" textAnchor="middle" className="fill-fg text-[9px] font-bold">Schmelze</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Thermoplaste koennen bei Waerme weich oder schmelzfaehig werden. Konkrete Temperaturen gehoeren in Datenblatt oder Tabellenbuch.
      </figcaption>
    </figure>
  );
}

export interface DuroplastSchemaProps {
  className?: string;
}

/**
 * Zeigt Duroplaste als vernetztes Strukturmodell.
 */
export function DuroplastSchema({ className }: DuroplastSchemaProps) {
  const punkte = [
    [128, 92],
    [188, 74],
    [252, 94],
    [326, 78],
    [150, 142],
    [226, 134],
    [304, 146],
  ] as const;

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="duro-title duro-desc" className="h-auto w-full">
        <title id="duro-title">Duroplast als vernetztes Strukturmodell</title>
        <desc id="duro-desc">Knoten und Verbindungen zeigen eine vernetzte Struktur als vereinfachtes Duroplast-Modell.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M128 92 L188 74 L252 94 L326 78 M128 92 L150 142 L226 134 L304 146 L326 78 M188 74 L226 134 M252 94 L304 146 M150 142 L252 94" className="stroke-primary" strokeWidth="3" strokeLinecap="round" fill="none" />
        {punkte.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="13" className="fill-primary-subtle stroke-primary" strokeWidth="3" />)}
        <text x="230" y="170" textAnchor="middle" className="fill-fg text-[10px] font-bold">vernetzt und formstabil</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Duroplaste werden ueber ihre Vernetzung eingeordnet. Sie werden beim Erwaermen nicht wie Thermoplaste erneut schmelzfaehig.
      </figcaption>
    </figure>
  );
}

export interface ElastomerSchemaProps {
  className?: string;
}

/**
 * Visualisiert elastische Rueckstellung als Gummimodell.
 */
export function ElastomerSchema({ className }: ElastomerSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="elasto-title elasto-desc" className="h-auto w-full">
        <title id="elasto-title">Elastomer mit Rueckstellung</title>
        <desc id="elasto-desc">Ein Gummimodell wird gedehnt und kehrt als Elastomer vereinfacht zurueck.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="100" y="94" width="88" height="46" rx="22" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <rect x="266" y="100" width="108" height="34" rx="17" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <path d="M198 116 H252" className="stroke-primary" strokeWidth="4" strokeLinecap="round" markerEnd="url(#elasto-arrow)" />
        <defs>
          <marker id="elasto-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" className="fill-primary" />
          </marker>
        </defs>
        <path d="M106 156 C130 176 160 176 184 156 M272 156 C300 176 340 176 368 156" className="stroke-success" strokeWidth="3" strokeLinecap="round" fill="none" />
        <text x="144" y="82" textAnchor="middle" className="fill-fg text-[10px] font-bold">Ausgang</text>
        <text x="320" y="82" textAnchor="middle" className="fill-fg text-[10px] font-bold">gedehnt</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Elastomere koennen elastisch verformt werden und stellen sich wieder zurueck, solange die Vorgaben eingehalten werden.
      </figcaption>
    </figure>
  );
}

export interface AdditiveMasterbatchSchemaProps {
  className?: string;
}

/**
 * Zeigt Grundgranulat, Additiv und Masterbatch als Granulatmix.
 */
export function AdditiveMasterbatchSchema({ className }: AdditiveMasterbatchSchemaProps) {
  const koerner = [
    [130, 92, 'fill-primary-subtle stroke-primary'],
    [164, 126, 'fill-primary-subtle stroke-primary'],
    [196, 98, 'fill-warning-bg stroke-warning'],
    [230, 130, 'fill-primary-subtle stroke-primary'],
    [264, 94, 'fill-danger-bg stroke-danger'],
    [300, 124, 'fill-primary-subtle stroke-primary'],
    [334, 98, 'fill-warning-bg stroke-warning'],
  ] as const;

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="additiv-title additiv-desc" className="h-auto w-full">
        <title id="additiv-title">Additive und Masterbatch als Granulatmix</title>
        <desc id="additiv-desc">Farbige Koerner zeigen Grundgranulat, Additiv und Masterbatch als vereinfachten Granulatmix.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M96 70 H364 L340 154 H120 Z" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        {koerner.map(([x, y, klasse], index) => <circle key={index} cx={x} cy={y} r="12" className={klasse} strokeWidth="2" />)}
        <text x="156" y="174" textAnchor="middle" className="fill-fg text-[9px] font-bold">Grundgranulat</text>
        <text x="258" y="174" textAnchor="middle" className="fill-fg text-[9px] font-bold">Additiv</text>
        <text x="342" y="174" textAnchor="middle" className="fill-fg text-[9px] font-bold">Masterbatch</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Additive und Masterbatch beeinflussen Eigenschaften oder Farbe. Dosierung und Freigabe gehoeren ins Datenblatt oder in die Vorgabe.
      </figcaption>
    </figure>
  );
}

export interface GranulatChargeRezyklatSchemaProps {
  className?: string;
}

/**
 * Zeigt Sack, Charge und Rezyklatweg als Rueckverfolgungsbild.
 */
export function GranulatChargeRezyklatSchema({ className }: GranulatChargeRezyklatSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 240" role="img" aria-labelledby="charge-title charge-desc" className="h-auto w-full">
        <title id="charge-title">Granulat Charge und Rezyklat rueckverfolgen</title>
        <desc id="charge-desc">Ein Sacketikett zeigt Material, Charge und Rezyklatanteil als Rueckverfolgungsinformationen.</desc>
        <rect x="42" y="34" width="376" height="160" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M104 70 H230 L250 168 H84 Z" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <rect x="120" y="94" width="92" height="54" rx="6" className="fill-bg-subtle stroke-border-strong" />
        <text x="166" y="112" textAnchor="middle" className="fill-fg text-[8px] font-bold">Material</text>
        <text x="166" y="128" textAnchor="middle" className="fill-fg-muted text-[7px] font-semibold">Charge: offen</text>
        <text x="166" y="142" textAnchor="middle" className="fill-fg-muted text-[7px] font-semibold">Freigabe pruefen</text>
        <path d="M260 104 H352 M312 80 L352 104 L312 128" className="stroke-primary" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="300" y="142" width="78" height="32" rx="8" className="fill-success-bg stroke-success" strokeWidth="3" />
        <text x="339" y="163" textAnchor="middle" className="fill-fg text-[9px] font-bold">Rezyklatweg</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Granulat, Charge und Rezyklat muessen eindeutig verfolgt werden. Das Etikett ist Teil der Qualitaetssicherung.
      </figcaption>
    </figure>
  );
}

export interface HaerteSchemaProps {
  className?: string;
}

/**
 * Visualisiert Haerte als Widerstand gegen Eindringen.
 */
export function HaerteSchema({ className }: HaerteSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="haerte-title haerte-desc" className="h-auto w-full">
        <title id="haerte-title">Haerte als Widerstand gegen Eindringen</title>
        <desc id="haerte-desc">Ein Eindringkoerper trifft eine weiche und eine harte Probe mit unterschiedlich tiefem Eindruck.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M126 70 L152 114 L100 114 Z" className="fill-warning-bg stroke-warning" strokeWidth="3" />
        <path d="M306 70 L332 114 L280 114 Z" className="fill-warning-bg stroke-warning" strokeWidth="3" />
        <rect x="76" y="126" width="112" height="34" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <path d="M118 126 C124 146 134 146 140 126" className="stroke-danger" strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="256" y="126" width="112" height="34" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <path d="M306 126 C310 134 318 134 322 126" className="stroke-success" strokeWidth="3" fill="none" strokeLinecap="round" />
        <text x="132" y="178" textAnchor="middle" className="fill-fg text-[10px] font-bold">tiefer Eindruck</text>
        <text x="312" y="178" textAnchor="middle" className="fill-fg text-[10px] font-bold">kleiner Eindruck</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Haerte beschreibt vereinfacht, wie stark ein Werkstoff dem Eindringen widersteht. Konkrete Werte und Pruefverfahren gehoeren in Tabellenbuch oder Pruefanweisung.
      </figcaption>
    </figure>
  );
}

export interface FestigkeitSchemaProps {
  className?: string;
}

/**
 * Zeigt Festigkeit als Verhalten eines Probestabs unter Belastung.
 */
export function FestigkeitSchema({ className }: FestigkeitSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="festigkeit-title festigkeit-desc" className="h-auto w-full">
        <title id="festigkeit-title">Festigkeit bei Belastung</title>
        <desc id="festigkeit-desc">Ein Probestab wird links und rechts gezogen und zeigt die Belastungsrichtung bis zum Bruchrisiko.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M102 112 H180 M280 112 H358" className="stroke-primary" strokeWidth="7" strokeLinecap="round" />
        <path d="M124 94 L96 112 L124 130 M336 94 L364 112 L336 130" className="stroke-primary" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M178 90 C214 106 246 74 282 96 L282 128 C246 150 214 118 178 136 Z" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <path d="M232 92 L222 112 L238 130" className="stroke-danger" strokeWidth="3" strokeLinecap="round" fill="none" />
        <text x="230" y="168" textAnchor="middle" className="fill-fg text-[10px] font-bold">Belastbarkeit braucht Werkstoffangabe</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Festigkeit beschreibt, welche Belastung ein Werkstoff aufnehmen kann. Zahlenwerte werden aus Datenblatt, Zeichnung oder Tabellenbuch entnommen.
      </figcaption>
    </figure>
  );
}

export interface ZaehigkeitSproedigkeitSchemaProps {
  className?: string;
}

/**
 * Vergleicht zaehes und sproedes Bruchverhalten.
 */
export function ZaehigkeitSproedigkeitSchema({ className }: ZaehigkeitSproedigkeitSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="zaeh-title zaeh-desc" className="h-auto w-full">
        <title id="zaeh-title">Zaehigkeit und Sproedigkeit im Bruchvergleich</title>
        <desc id="zaeh-desc">Zwei Proben zeigen verformten zaehen Bruch und scharf getrennten sproeden Bruch.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M82 96 C124 78 162 96 192 126 C158 142 116 140 82 126 Z" className="fill-surface-raised stroke-success" strokeWidth="3" />
        <path d="M112 112 C136 104 154 112 172 126" className="stroke-success" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M268 84 L374 102 L330 152 L250 132 Z" className="fill-surface-raised stroke-danger" strokeWidth="3" />
        <path d="M304 92 L322 116 L298 134 L334 150" className="stroke-danger" strokeWidth="4" fill="none" strokeLinecap="round" />
        <text x="136" y="170" textAnchor="middle" className="fill-fg text-[10px] font-bold">zaeh: verformt</text>
        <text x="316" y="170" textAnchor="middle" className="fill-fg text-[10px] font-bold">sproede: bricht scharf</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Zaehe Werkstoffe koennen Energie aufnehmen und sich verformen. Sproede Werkstoffe brechen eher ohne deutliche Vorverformung.
      </figcaption>
    </figure>
  );
}

export interface ElastischPlastischSchemaProps {
  className?: string;
}

/**
 * Zeigt elastische Rueckfederung und plastische bleibende Verformung.
 */
export function ElastischPlastischSchema({ className }: ElastischPlastischSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="verformung-title verformung-desc" className="h-auto w-full">
        <title id="verformung-title">Elastische und plastische Verformung</title>
        <desc id="verformung-desc">Eine Feder kehrt zurueck, ein gebogener Stab bleibt als plastische Verformung dauerhaft veraendert.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M86 112 C100 88 114 136 128 112 C142 88 156 136 170 112 C184 88 198 136 212 112" className="stroke-success" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M104 150 C136 170 174 170 206 150" className="stroke-success" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M268 88 C318 92 350 120 362 154" className="stroke-danger" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M270 146 C302 166 342 166 370 146" className="stroke-danger" strokeWidth="3" fill="none" strokeLinecap="round" />
        <text x="150" y="76" textAnchor="middle" className="fill-fg text-[10px] font-bold">elastisch</text>
        <text x="320" y="76" textAnchor="middle" className="fill-fg text-[10px] font-bold">plastisch</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Elastische Verformung geht weitgehend zurueck. Plastische Verformung bleibt bestehen und muss bei Bauteil, Prozess und Pruefung beachtet werden.
      </figcaption>
    </figure>
  );
}

export interface DichteVergleichSchemaProps {
  className?: string;
}

/**
 * Vergleicht Werkstoffe ueber gleich grosse Wuerfel mit unterschiedlicher Masse.
 */
export function DichteVergleichSchema({ className }: DichteVergleichSchemaProps) {
  const wuerfel = [
    { x: 92, label: 'Kunststoff', masse: 'leicht', hoehe: 24 },
    { x: 196, label: 'Alu', masse: 'mittel', hoehe: 42 },
    { x: 300, label: 'Stahl', masse: 'schwer', hoehe: 64 },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="dichtevergleich-title dichtevergleich-desc" className="h-auto w-full">
        <title id="dichtevergleich-title">Dichte im Werkstoffvergleich</title>
        <desc id="dichtevergleich-desc">Gleich grosse Werkstoffwuerfel zeigen unterschiedliche Masse als Dichtevergleich.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        {wuerfel.map((eintrag) => (
          <g key={eintrag.label}>
            <rect x={eintrag.x} y="84" width="58" height="58" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
            <rect x={eintrag.x + 8} y={150 - eintrag.hoehe} width="42" height={eintrag.hoehe} rx="6" className="fill-primary-subtle stroke-primary" />
            <text x={eintrag.x + 29} y="164" textAnchor="middle" className="fill-fg text-[9px] font-bold">{eintrag.label}</text>
            <text x={eintrag.x + 29} y="178" textAnchor="middle" className="fill-fg-muted text-[8px] font-semibold">{eintrag.masse}</text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Dichte verknuepft Masse und Volumen. Gleiche Bauteilgroesse kann je nach Werkstoff deutlich unterschiedlich schwer sein.
      </figcaption>
    </figure>
  );
}

export interface WaermeausdehnungSchemaProps {
  className?: string;
}

/**
 * Zeigt Laengenaenderung durch Temperaturanstieg.
 */
export function WaermeausdehnungSchema({ className }: WaermeausdehnungSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="waermeausdehnung-title waermeausdehnung-desc" className="h-auto w-full">
        <title id="waermeausdehnung-title">Waermeausdehnung bei Temperaturanstieg</title>
        <desc id="waermeausdehnung-desc">Ein kalter und ein warmer Stab zeigen eine Laengenaenderung durch Temperatur.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="86" y="86" width="126" height="28" rx="8" className="fill-info-bg stroke-info-border" strokeWidth="3" />
        <rect x="86" y="132" width="206" height="28" rx="8" className="fill-warning-bg stroke-warning-border" strokeWidth="3" />
        <path d="M306 130 C298 118 318 114 310 102 M338 130 C330 118 350 114 342 102" className="stroke-warning" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M214 100 H276 M260 88 L278 100 L260 112" className="stroke-primary" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="149" y="74" textAnchor="middle" className="fill-fg text-[10px] font-bold">kalt</text>
        <text x="189" y="178" textAnchor="middle" className="fill-fg text-[10px] font-bold">warm: Laenge kann sich aendern</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Waermeausdehnung kann Masse, Spiel und Messentscheidungen beeinflussen. Rechenwerte brauchen Tabellenbuch oder freigegebene Aufgabe.
      </figcaption>
    </figure>
  );
}

export interface KorrosionSchemaProps {
  className?: string;
}

/**
 * Visualisiert Korrosion und Schutzschicht an einem Bauteil.
 */
export function KorrosionSchema({ className }: KorrosionSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="korrosion-title korrosion-desc" className="h-auto w-full">
        <title id="korrosion-title">Korrosion und Schutz am Bauteil</title>
        <desc id="korrosion-desc">Ein Bauteil zeigt Roststellen auf einer Seite und eine Schutzschicht auf der anderen Seite.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="92" y="86" width="276" height="68" rx="10" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <path d="M112 92 C126 104 140 86 154 100 C166 112 182 96 196 110" className="stroke-danger" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="134" cy="132" r="10" className="fill-danger-bg stroke-danger" strokeWidth="3" />
        <rect x="248" y="86" width="104" height="68" rx="10" className="fill-success-bg stroke-success" strokeWidth="3" />
        <text x="146" y="174" textAnchor="middle" className="fill-fg text-[10px] font-bold">Korrosion erkennen</text>
        <text x="300" y="174" textAnchor="middle" className="fill-fg text-[10px] font-bold">Schutz beachten</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Korrosion veraendert Oberflaeche und Funktion. Auffaellige Stellen werden gemeldet und nach Vorgabe geschuetzt oder beurteilt.
      </figcaption>
    </figure>
  );
}

export interface WerkstoffauswahlSchemaProps {
  className?: string;
}

/**
 * Zeigt Werkstoffauswahl als Abgleich von Anforderungen.
 */
export function WerkstoffauswahlSchema({ className }: WerkstoffauswahlSchemaProps) {
  const kriterien = ['Belastung', 'Umgebung', 'Gewicht', 'Verarbeitung'];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 240" role="img" aria-labelledby="auswahl-title auswahl-desc" className="h-auto w-full">
        <title id="auswahl-title">Werkstoffauswahl nach Aufgabe</title>
        <desc id="auswahl-desc">Vier Anforderungen fuehren zu einer Werkstoffentscheidung nach Zeichnung, Datenblatt und Vorgabe.</desc>
        <rect x="42" y="34" width="376" height="160" rx="10" className="fill-bg-subtle stroke-border" />
        {kriterien.map((kriterium, index) => {
          const x = 70 + (index % 2) * 210;
          const y = 62 + Math.floor(index / 2) * 58;
          return (
            <g key={kriterium}>
              <rect x={x} y={y} width="126" height="34" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="2" />
              <text x={x + 63} y={y + 22} textAnchor="middle" className="fill-fg text-[9px] font-bold">{kriterium}</text>
              <path d={`M${x + 63} ${y + 34} L230 152`} className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
            </g>
          );
        })}
        <rect x="170" y="152" width="120" height="36" rx="8" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <text x="230" y="175" textAnchor="middle" className="fill-fg text-[10px] font-bold">Werkstoff pruefen</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Werkstoffauswahl ist ein Abgleich aus Anforderung, Zeichnung, Datenblatt und Prozess. Im Betrieb wird nicht nach Bauchgefuehl umgestellt.
      </figcaption>
    </figure>
  );
}

export interface WelleAchseSchemaProps {
  className?: string;
}

/**
 * Vergleicht Welle und Achse als Maschinenelemente.
 */
export function WelleAchseSchema({ className }: WelleAchseSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="welle-achse-title welle-achse-desc" className="h-auto w-full">
        <title id="welle-achse-title">Welle und Achse im Funktionsvergleich</title>
        <desc id="welle-achse-desc">Eine drehende Welle uebertraegt Bewegung, eine Achse traegt ein Rad als Lagerstelle.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <circle cx="128" cy="112" r="34" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <rect x="92" y="102" width="130" height="20" rx="10" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <path d="M104 76 C126 58 158 60 180 78 M176 62 L182 80 L162 78" className="stroke-primary" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="326" cy="112" r="34" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <rect x="258" y="104" width="136" height="16" rx="8" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <path d="M286 150 H366" className="stroke-fg-muted" strokeWidth="3" strokeLinecap="round" />
        <text x="150" y="172" textAnchor="middle" className="fill-fg text-[10px] font-bold">Welle: uebertraegt Drehung</text>
        <text x="326" y="172" textAnchor="middle" className="fill-fg text-[10px] font-bold">Achse: traegt</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Wellen uebertragen Drehbewegung oder Drehmoment. Achsen tragen drehende Teile und muessen nicht selbst antreiben.
      </figcaption>
    </figure>
  );
}

export interface LagerartenSchemaProps {
  className?: string;
}

/**
 * Zeigt Lagerarten als Grundueberblick.
 */
export function LagerartenSchema({ className }: LagerartenSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="lagerarten-title lagerarten-desc" className="h-auto w-full">
        <title id="lagerarten-title">Lagerarten als Grundueberblick</title>
        <desc id="lagerarten-desc">Gleitlager und Waelzlager stuetzen eine Welle und verringern Reibung unterschiedlich.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <g>
          <rect x="82" y="92" width="128" height="52" rx="12" className="fill-surface-raised stroke-primary" strokeWidth="3" />
          <rect x="104" y="108" width="84" height="20" rx="10" className="fill-primary-subtle stroke-primary" strokeWidth="2" />
          <text x="146" y="166" textAnchor="middle" className="fill-fg text-[10px] font-bold">Gleitlager</text>
        </g>
        <g>
          <circle cx="314" cy="118" r="38" className="fill-surface-raised stroke-primary" strokeWidth="3" />
          <circle cx="314" cy="118" r="18" className="fill-bg-subtle stroke-primary" strokeWidth="3" />
          {[0, 60, 120, 180, 240, 300].map((winkel) => {
            const rad = (winkel * Math.PI) / 180;
            const x = 314 + Math.cos(rad) * 28;
            const y = 118 + Math.sin(rad) * 28;
            return <circle key={winkel} cx={x} cy={y} r="6" className="fill-primary-subtle stroke-primary" strokeWidth="2" />;
          })}
          <text x="314" y="166" textAnchor="middle" className="fill-fg text-[10px] font-bold">Waelzlager</text>
        </g>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Lager fuehren und stuetzen bewegte Teile. Bauart, Schmierung, Last und Montage richten sich nach Zeichnung und Vorgabe.
      </figcaption>
    </figure>
  );
}

export interface GleitlagerSchemaProps {
  className?: string;
}

/**
 * Visualisiert Gleitlager mit Schmierfilm.
 */
export function GleitlagerSchema({ className }: GleitlagerSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="gleitlager-title gleitlager-desc" className="h-auto w-full">
        <title id="gleitlager-title">Gleitlager mit Schmierfilm</title>
        <desc id="gleitlager-desc">Eine Welle gleitet in einer Lagerschale, der Schmierfilm trennt Reibflaechen.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M106 92 H354 V142 H106 Z" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <rect x="132" y="104" width="196" height="26" rx="13" className="fill-info-bg stroke-info-border" strokeWidth="3" />
        <rect x="150" y="110" width="160" height="14" rx="7" className="fill-primary-subtle stroke-primary" strokeWidth="2" />
        <path d="M152 86 C180 70 214 70 242 86 M254 86 C282 70 316 70 344 86" className="stroke-info" strokeWidth="3" fill="none" strokeLinecap="round" />
        <text x="230" y="166" textAnchor="middle" className="fill-fg text-[10px] font-bold">Schmierfilm vermindert Reibung</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Beim Gleitlager gleiten Flaechen aufeinander. Schmierung, Sauberkeit und richtige Montage sind entscheidend.
      </figcaption>
    </figure>
  );
}

export interface WaelzlagerSchemaProps {
  className?: string;
}

/**
 * Visualisiert Waelzlager mit Waelzkoerpern.
 */
export function WaelzlagerSchema({ className }: WaelzlagerSchemaProps) {
  const kugeln = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="waelzlager-title waelzlager-desc" className="h-auto w-full">
        <title id="waelzlager-title">Waelzlager mit Waelzkoerpern</title>
        <desc id="waelzlager-desc">Innenring, Aussenring und Kugeln zeigen den Grundaufbau eines Waelzlagers.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <circle cx="230" cy="112" r="70" className="fill-surface-raised stroke-primary" strokeWidth="4" />
        <circle cx="230" cy="112" r="34" className="fill-bg-subtle stroke-primary" strokeWidth="4" />
        {kugeln.map((winkel) => {
          const rad = (winkel * Math.PI) / 180;
          const x = 230 + Math.cos(rad) * 52;
          const y = 112 + Math.sin(rad) * 52;
          return <circle key={winkel} cx={x} cy={y} r="10" className="fill-primary-subtle stroke-primary" strokeWidth="3" />;
        })}
        <text x="230" y="202" textAnchor="middle" className="fill-fg text-[10px] font-bold">Waelzkoerper rollen zwischen Ringen</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Waelzlager nutzen Waelzkoerper wie Kugeln oder Rollen. Einbau, Belastung und Pflege folgen der technischen Vorgabe.
      </figcaption>
    </figure>
  );
}

export interface KupplungSchemaProps {
  className?: string;
}

/**
 * Zeigt Kupplung zwischen zwei Wellen.
 */
export function KupplungSchema({ className }: KupplungSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="kupplung-title kupplung-desc" className="h-auto w-full">
        <title id="kupplung-title">Kupplung uebertraegt Drehmoment</title>
        <desc id="kupplung-desc">Zwei Wellen werden ueber eine Kupplung verbunden und uebertragen Drehmoment.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="78" y="102" width="118" height="20" rx="10" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <rect x="264" y="102" width="118" height="20" rx="10" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <rect x="184" y="82" width="92" height="60" rx="12" className="fill-primary-subtle stroke-primary" strokeWidth="4" />
        <path d="M110 78 C136 60 166 62 190 78 M270 78 C296 60 326 62 350 78" className="stroke-primary" strokeWidth="3" fill="none" strokeLinecap="round" />
        <text x="230" y="166" textAnchor="middle" className="fill-fg text-[10px] font-bold">Verbindung zwischen Wellen</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Kupplungen verbinden Wellen und uebertragen Drehmoment. Ausgleich, Ausrichtung und Schutz richten sich nach Bauart und Vorgabe.
      </figcaption>
    </figure>
  );
}

export interface ZahnradgetriebeSchemaProps {
  className?: string;
}

/**
 * Visualisiert ein Zahnradpaar mit Uebersetzung.
 */
export function ZahnradgetriebeSchema({ className }: ZahnradgetriebeSchemaProps) {
  const zaehne = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 240" role="img" aria-labelledby="zahnrad-title zahnrad-desc" className="h-auto w-full">
        <title id="zahnrad-title">Zahnradgetriebe mit Uebersetzung</title>
        <desc id="zahnrad-desc">Zwei unterschiedlich grosse Zahnraeder greifen ineinander und veraendern Drehzahl und Drehmoment.</desc>
        <rect x="42" y="34" width="376" height="160" rx="10" className="fill-bg-subtle stroke-border" />
        <g>
          <circle cx="168" cy="116" r="44" className="fill-primary-subtle stroke-primary" strokeWidth="4" />
          {zaehne.map((winkel) => {
            const rad = (winkel * Math.PI) / 180;
            const x = 168 + Math.cos(rad) * 52;
            const y = 116 + Math.sin(rad) * 52;
            return <rect key={winkel} x={x - 5} y={y - 5} width="10" height="10" transform={`rotate(${winkel} ${x} ${y})`} className="fill-primary stroke-primary" />;
          })}
          <circle cx="168" cy="116" r="10" className="fill-bg-subtle stroke-primary" strokeWidth="3" />
        </g>
        <g>
          <circle cx="282" cy="116" r="30" className="fill-surface-raised stroke-primary" strokeWidth="4" />
          {zaehne.map((winkel) => {
            const rad = (winkel * Math.PI) / 180;
            const x = 282 + Math.cos(rad) * 38;
            const y = 116 + Math.sin(rad) * 38;
            return <rect key={winkel} x={x - 4} y={y - 4} width="8" height="8" transform={`rotate(${winkel} ${x} ${y})`} className="fill-primary stroke-primary" />;
          })}
          <circle cx="282" cy="116" r="8" className="fill-bg-subtle stroke-primary" strokeWidth="3" />
        </g>
        <text x="230" y="184" textAnchor="middle" className="fill-fg text-[10px] font-bold">Zaehne greifen formschluessig</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Zahnradgetriebe uebertragen Bewegung formschluessig. Uebersetzung und Drehrichtung werden aus Zahnradpaar und Vorgabe abgeleitet.
      </figcaption>
    </figure>
  );
}

export interface RiemenantriebSchemaProps {
  className?: string;
}

/**
 * Zeigt Riemenantrieb mit zwei Riemenscheiben.
 */
export function RiemenantriebSchema({ className }: RiemenantriebSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="riemen-title riemen-desc" className="h-auto w-full">
        <title id="riemen-title">Riemenantrieb mit Kraftschluss</title>
        <desc id="riemen-desc">Ein Riemen laeuft ueber zwei Riemenscheiben und uebertraegt Bewegung ueber Reibung.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M132 78 H326 A34 34 0 0 1 326 146 H132 A34 34 0 0 1 132 78 Z" className="fill-none stroke-primary" strokeWidth="10" strokeLinecap="round" />
        <circle cx="132" cy="112" r="34" className="fill-surface-raised stroke-primary" strokeWidth="4" />
        <circle cx="326" cy="112" r="34" className="fill-surface-raised stroke-primary" strokeWidth="4" />
        <circle cx="132" cy="112" r="10" className="fill-bg-subtle stroke-primary" strokeWidth="3" />
        <circle cx="326" cy="112" r="10" className="fill-bg-subtle stroke-primary" strokeWidth="3" />
        <text x="230" y="178" textAnchor="middle" className="fill-fg text-[10px] font-bold">Reibung und Spannung beachten</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Riemenantriebe arbeiten kraftschluessig. Riemenspannung, Schutz und Zustand werden nach Vorgabe kontrolliert.
      </figcaption>
    </figure>
  );
}

export interface KettenantriebSchemaProps {
  className?: string;
}

/**
 * Visualisiert Kettenantrieb als formschluessige Verbindung.
 */
export function KettenantriebSchema({ className }: KettenantriebSchemaProps) {
  const glieder = Array.from({ length: 12 }, (_, index) => index);

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="kette-title kette-desc" className="h-auto w-full">
        <title id="kette-title">Kettenantrieb mit Formschluss</title>
        <desc id="kette-desc">Eine Kette mit Gliedern greift auf Kettenraeder und uebertraegt Bewegung formschluessig.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <circle cx="140" cy="112" r="32" className="fill-surface-raised stroke-primary" strokeWidth="4" />
        <circle cx="320" cy="112" r="32" className="fill-surface-raised stroke-primary" strokeWidth="4" />
        {glieder.map((index) => {
          const x = 110 + index * 20;
          const y = index % 2 === 0 ? 78 : 146;
          return <rect key={index} x={x} y={y} width="28" height="14" rx="7" className="fill-primary-subtle stroke-primary" strokeWidth="2" />;
        })}
        <path d="M140 80 H320 M140 144 H320" className="stroke-primary" strokeWidth="4" strokeLinecap="round" />
        <text x="230" y="178" textAnchor="middle" className="fill-fg text-[10px] font-bold">Kette greift formschluessig</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Kettenantriebe uebertragen Bewegung formschluessig. Schmierung, Spannung und Schutz sind nach Vorgabe zu beachten.
      </figcaption>
    </figure>
  );
}

export interface SchraubenMutternSchemaProps {
  className?: string;
}

/**
 * Zeigt Schraubenverbindung mit Gewinde und Mutter.
 */
export function SchraubenMutternSchema({ className }: SchraubenMutternSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="schraube-title schraube-desc" className="h-auto w-full">
        <title id="schraube-title">Schrauben und Muttern als loesbare Verbindung</title>
        <desc id="schraube-desc">Eine Schraube, zwei Bauteile und eine Mutter bilden eine loesbare Verbindung.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="114" y="90" width="116" height="46" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <rect x="230" y="90" width="116" height="46" rx="8" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <rect x="92" y="104" width="244" height="18" rx="9" className="fill-bg-subtle stroke-border-strong" strokeWidth="3" />
        <rect x="82" y="94" width="34" height="38" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <path d="M142 103 L154 123 M164 103 L176 123 M186 103 L198 123 M208 103 L220 123 M230 103 L242 123 M252 103 L264 123" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
        <path d="M336 92 L378 104 L378 122 L336 136 Z" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <text x="230" y="170" textAnchor="middle" className="fill-fg text-[10px] font-bold">Gewinde und Anzug nach Vorgabe</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Schrauben und Muttern bilden loesbare Verbindungen. Gewinde, Sicherung und Anzug richten sich nach Zeichnung und Arbeitsanweisung.
      </figcaption>
    </figure>
  );
}

export interface FedernDaempferSchemaProps {
  className?: string;
}

/**
 * Vergleicht Feder und Daempfer als Funktionselemente.
 */
export function FedernDaempferSchema({ className }: FedernDaempferSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="feder-daempfer-title feder-daempfer-desc" className="h-auto w-full">
        <title id="feder-daempfer-title">Federn und Daempfer im Funktionsvergleich</title>
        <desc id="feder-daempfer-desc">Eine Feder speichert Rueckstellkraft, ein Daempfer bremst Bewegung.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M102 78 H176 M118 78 C102 94 192 94 176 110 C160 126 102 126 118 142 H192" className="stroke-success" strokeWidth="4" fill="none" strokeLinecap="round" />
        <rect x="270" y="78" width="80" height="28" rx="10" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <rect x="256" y="118" width="108" height="28" rx="10" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <path d="M310 106 V118" className="stroke-primary" strokeWidth="5" strokeLinecap="round" />
        <path d="M286 156 C306 170 334 170 354 156" className="stroke-primary" strokeWidth="3" fill="none" strokeLinecap="round" />
        <text x="150" y="174" textAnchor="middle" className="fill-fg text-[10px] font-bold">Feder: stellt zurueck</text>
        <text x="310" y="174" textAnchor="middle" className="fill-fg text-[10px] font-bold">Daempfer: bremst</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Federn speichern Energie und stellen zurueck. Daempfer bremsen Bewegungen oder Schwingungen nach Vorgabe.
      </figcaption>
    </figure>
  );
}

export interface FertigungHauptgruppenSchemaProps {
  className?: string;
}

/**
 * Zeigt die sechs Hauptgruppen der Fertigung als Prozessrad.
 */
export function FertigungHauptgruppenSchema({ className }: FertigungHauptgruppenSchemaProps) {
  const gruppen = [
    { label: 'Urformen', x: 110, y: 72 },
    { label: 'Umformen', x: 230, y: 72 },
    { label: 'Trennen', x: 350, y: 72 },
    { label: 'Fuegen', x: 110, y: 142 },
    { label: 'Beschichten', x: 230, y: 142 },
    { label: 'Stoffeigenschaft', x: 350, y: 142 },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 240" role="img" aria-labelledby="fer-haupt-title fer-haupt-desc" className="h-auto w-full">
        <title id="fer-haupt-title">Sechs Hauptgruppen der Fertigung</title>
        <desc id="fer-haupt-desc">Sechs Prozesskarten fuer Urformen, Umformen, Trennen, Fuegen, Beschichten und Stoffeigenschaften aendern.</desc>
        <rect x="38" y="34" width="384" height="170" rx="10" className="fill-bg-subtle stroke-border" />
        {gruppen.map((gruppe, index) => (
          <g key={gruppe.label}>
            <rect x={gruppe.x - 48} y={gruppe.y - 22} width="96" height="44" rx="8" className={index === 2 ? 'fill-primary-subtle stroke-primary' : 'fill-surface-raised stroke-border-strong'} strokeWidth="3" />
            <text x={gruppe.x} y={gruppe.y + 4} textAnchor="middle" className="fill-fg text-[9px] font-bold">
              {gruppe.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Fertigungsverfahren werden nach ihrer Hauptwirkung eingeordnet. Das hilft, Arbeitsgaenge und Tabellenbuchangaben richtig zu lesen.
      </figcaption>
    </figure>
  );
}

export interface SpanendSpanlosSchemaProps {
  className?: string;
}

/**
 * Vergleicht spanende und spanlose Fertigung.
 */
export function SpanendSpanlosSchema({ className }: SpanendSpanlosSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="spanend-title spanend-desc" className="h-auto w-full">
        <title id="spanend-title">Spanend und spanlos unterscheiden</title>
        <desc id="spanend-desc">Links wird Material als Span getrennt, rechts wird ein Werkstueck ohne Span umgeformt.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="78" y="100" width="122" height="46" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <path d="M166 76 L210 104 L184 112 Z" className="fill-warning-bg stroke-warning" strokeWidth="3" />
        <path d="M130 92 C146 72 172 72 190 88" className="stroke-warning" strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="270" y="84" width="98" height="36" rx="8" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <path d="M270 142 C292 120 346 120 368 142" className="fill-none stroke-primary" strokeWidth="4" strokeLinecap="round" />
        <text x="140" y="170" textAnchor="middle" className="fill-fg text-[10px] font-bold">spanend: Span entsteht</text>
        <text x="320" y="170" textAnchor="middle" className="fill-fg text-[10px] font-bold">spanlos: Form aendert sich</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Spanend bedeutet Materialabtrag durch Spane. Spanlos bedeutet Formveraenderung ohne spanenden Abtrag.
      </figcaption>
    </figure>
  );
}

export interface SchnittVorschubSchemaProps {
  className?: string;
}

/**
 * Visualisiert Schnittbewegung, Vorschub und Zustellung.
 */
export function SchnittVorschubSchema({ className }: SchnittVorschubSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 240" role="img" aria-labelledby="schnitt-vorschub-title schnitt-vorschub-desc" className="h-auto w-full">
        <title id="schnitt-vorschub-title">Schnittbewegung Vorschub und Zustellung</title>
        <desc id="schnitt-vorschub-desc">Werkstueck, Werkzeug und drei Richtungspfeile fuer Schnittbewegung, Vorschub und Zustellung.</desc>
        <rect x="42" y="34" width="376" height="160" rx="10" className="fill-bg-subtle stroke-border" />
        <circle cx="170" cy="116" r="46" className="fill-surface-raised stroke-primary" strokeWidth="4" />
        <path d="M138 84 C160 62 202 70 214 100 M214 100 L198 94 M214 100 L208 84" className="stroke-primary" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M278 76 L326 112 L278 148 Z" className="fill-warning-bg stroke-warning" strokeWidth="3" />
        <path d="M334 112 H388 M388 112 L374 104 M388 112 L374 120" className="stroke-warning" strokeWidth="4" strokeLinecap="round" />
        <path d="M278 166 V132 M278 132 L270 146 M278 132 L286 146" className="stroke-info" strokeWidth="4" strokeLinecap="round" />
        <text x="156" y="178" textAnchor="middle" className="fill-fg text-[9px] font-bold">Schnittbewegung</text>
        <text x="356" y="98" textAnchor="middle" className="fill-fg text-[9px] font-bold">Vorschub</text>
        <text x="248" y="170" textAnchor="middle" className="fill-fg text-[9px] font-bold">Zustellung</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Schnittbewegung erzeugt die Zerspanung. Vorschub fuehrt das Werkzeug weiter, Zustellung legt die Eingriffstiefe fest.
      </figcaption>
    </figure>
  );
}

export interface SchnittgeschwindigkeitSchemaProps {
  className?: string;
}

/**
 * Zeigt Schnittgeschwindigkeit am Umfang eines Drehteils.
 */
export function SchnittgeschwindigkeitSchema({ className }: SchnittgeschwindigkeitSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="vc-title vc-desc" className="h-auto w-full">
        <title id="vc-title">Schnittgeschwindigkeit am Werkstueckumfang</title>
        <desc id="vc-desc">Drehendes Werkstueck mit Durchmesser, Drehzahl und Umfangsgeschwindigkeit vc.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <circle cx="200" cy="112" r="54" className="fill-primary-subtle stroke-primary" strokeWidth="4" />
        <path d="M156 78 C186 50 236 62 254 98 M254 98 L238 90 M254 98 L250 80" className="stroke-primary" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M146 112 H254" className="stroke-fg-muted" strokeWidth="3" strokeLinecap="round" />
        <text x="200" y="103" textAnchor="middle" className="fill-fg text-[11px] font-bold">d</text>
        <path d="M284 76 L336 76" className="stroke-warning" strokeWidth="4" strokeLinecap="round" />
        <path d="M336 76 L322 68 M336 76 L322 84" className="stroke-warning" strokeWidth="4" strokeLinecap="round" />
        <text x="312" y="102" textAnchor="middle" className="fill-fg text-[12px] font-bold">vc</text>
        <text x="230" y="178" textAnchor="middle" className="fill-fg text-[10px] font-bold">vc = pi x d x n</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Schnittgeschwindigkeit beschreibt die Umfangsgeschwindigkeit an der Schnittstelle. Tabellenwerte muessen aus freigegebener Quelle kommen.
      </figcaption>
    </figure>
  );
}

export interface DrehzahlBerechnenSchemaProps {
  className?: string;
}

/**
 * Zeigt die Umstellung von Schnittgeschwindigkeit auf Drehzahl.
 */
export function DrehzahlBerechnenSchema({ className }: DrehzahlBerechnenSchemaProps) {
  const karten = ['vc', 'd', 'n'];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="drehzahl-title drehzahl-desc" className="h-auto w-full">
        <title id="drehzahl-title">Drehzahl aus Schnittgeschwindigkeit berechnen</title>
        <desc id="drehzahl-desc">Formeldreieck mit Schnittgeschwindigkeit, Durchmesser und Drehzahl.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M230 62 L140 164 H320 Z" className="fill-surface-raised stroke-primary" strokeWidth="4" />
        {karten.map((karte, index) => (
          <g key={karte}>
            <circle cx={index === 0 ? 230 : index === 1 ? 188 : 272} cy={index === 0 ? 92 : 138} r="20" className={index === 2 ? 'fill-primary-subtle stroke-primary' : 'fill-bg-subtle stroke-border-strong'} strokeWidth="3" />
            <text x={index === 0 ? 230 : index === 1 ? 188 : 272} y={(index === 0 ? 92 : 138) + 5} textAnchor="middle" className="fill-fg text-[13px] font-bold">
              {karte}
            </text>
          </g>
        ))}
        <text x="230" y="182" textAnchor="middle" className="fill-fg text-[10px] font-bold">n = vc / (pi x d)</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Drehzahl wird aus Schnittgeschwindigkeit und Durchmesser abgeleitet. Einheit und Tabellenwert entscheiden ueber ein sinnvolles Ergebnis.
      </figcaption>
    </figure>
  );
}

export interface VorschubZustellungSchemaProps {
  className?: string;
}

/**
 * Visualisiert Vorschub und Zustellung am Span.
 */
export function VorschubZustellungSchema({ className }: VorschubZustellungSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="vf-title vf-desc" className="h-auto w-full">
        <title id="vf-title">Vorschub und Zustellung beeinflussen den Span</title>
        <desc id="vf-desc">Werkzeug, Werkstueck, Vorschubpfeil und Zustellungspfeil zeigen Einfluss auf den Span.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="82" y="122" width="250" height="34" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <path d="M278 76 L334 116 L278 126 Z" className="fill-warning-bg stroke-warning" strokeWidth="3" />
        <path d="M134 94 H258 M258 94 L244 86 M258 94 L244 102" className="stroke-primary" strokeWidth="4" strokeLinecap="round" />
        <path d="M286 72 V110 M286 110 L278 96 M286 110 L294 96" className="stroke-info" strokeWidth="4" strokeLinecap="round" />
        <path d="M206 114 C224 96 254 96 272 112" className="stroke-warning" strokeWidth="3" fill="none" strokeLinecap="round" />
        <text x="196" y="86" textAnchor="middle" className="fill-fg text-[10px] font-bold">Vorschub</text>
        <text x="318" y="86" textAnchor="middle" className="fill-fg text-[10px] font-bold">Zustellung</text>
        <text x="230" y="178" textAnchor="middle" className="fill-fg text-[10px] font-bold">vf = f x n</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Vorschub und Zustellung beeinflussen Spanbildung, Oberflaeche, Belastung und Bearbeitungszeit.
      </figcaption>
    </figure>
  );
}

export interface WerkzeugverschleissSchemaProps {
  className?: string;
}

/**
 * Vergleicht intakte und verschlissene Werkzeugkante.
 */
export function WerkzeugverschleissSchema({ className }: WerkzeugverschleissSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="verschleiss-title verschleiss-desc" className="h-auto w-full">
        <title id="verschleiss-title">Werkzeugverschleiss an der Schneide</title>
        <desc id="verschleiss-desc">Links scharfe Schneide, rechts abgerundete Schneide mit Verschleisszone.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M98 146 L182 70 L206 146 Z" className="fill-primary-subtle stroke-primary" strokeWidth="4" />
        <path d="M272 146 L342 82 Q360 104 368 146 Z" className="fill-warning-bg stroke-warning" strokeWidth="4" />
        <path d="M330 92 Q350 112 356 146" className="stroke-danger" strokeWidth="5" fill="none" strokeLinecap="round" />
        <text x="152" y="172" textAnchor="middle" className="fill-fg text-[10px] font-bold">scharf</text>
        <text x="322" y="172" textAnchor="middle" className="fill-fg text-[10px] font-bold">verschlissen</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Verschleiss zeigt sich an Schneide, Oberflaeche, Masshaltigkeit oder Geraeusch. Standzeit wird nach Vorgabe beurteilt.
      </figcaption>
    </figure>
  );
}

export interface KuehlschmierstoffFertigungSchemaProps {
  className?: string;
}

/**
 * Zeigt Kuehlschmierstoff direkt an der Zerspanstelle.
 */
export function KuehlschmierstoffFertigungSchema({ className }: KuehlschmierstoffFertigungSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="fer-kss-title fer-kss-desc" className="h-auto w-full">
        <title id="fer-kss-title">Kuehlschmierstoff an der Schnittzone</title>
        <desc id="fer-kss-desc">Duese fuehrt Kuehlschmierstoff zur Schnittzone zwischen Werkzeug und Werkstueck.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="102" y="122" width="210" height="34" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <path d="M280 74 L346 116 L290 126 Z" className="fill-warning-bg stroke-warning" strokeWidth="3" />
        <path d="M124 70 C164 82 206 94 258 116" className="stroke-info" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M128 88 C174 104 216 116 258 128" className="stroke-info" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="262" cy="120" r="10" className="fill-info-bg stroke-info" strokeWidth="3" />
        <text x="230" y="178" textAnchor="middle" className="fill-fg text-[10px] font-bold">kuehlen, schmieren, spaenen helfen</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Kuehlschmierstoff kann kuehlen, schmieren und Spane abtransportieren. Umgang und Konzentration brauchen betriebliche Vorgaben.
      </figcaption>
    </figure>
  );
}

export interface WerkzeugdatenSchemaProps {
  className?: string;
}

/**
 * Visualisiert den sicheren Weg von Tabellenwert zu Maschineneinstellung.
 */
export function WerkzeugdatenSchema({ className }: WerkzeugdatenSchemaProps) {
  const schritte = ['Werkzeug', 'Werkstoff', 'Tabelle', 'Einstellung'];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="werkzeugdaten-title werkzeugdaten-desc" className="h-auto w-full">
        <title id="werkzeugdaten-title">Werkzeugdaten sicher uebernehmen</title>
        <desc id="werkzeugdaten-desc">Vier Schritte fuehren von Werkzeug und Werkstoff zur Tabelle und zur Maschineneinstellung.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        {schritte.map((schritt, index) => {
          const x = 70 + index * 88;
          return (
            <g key={schritt}>
              <rect x={x} y="82" width="70" height="58" rx="8" className={index === 2 ? 'fill-primary-subtle stroke-primary' : 'fill-surface-raised stroke-border-strong'} strokeWidth="3" />
              <text x={x + 35} y="115" textAnchor="middle" className="fill-fg text-[9px] font-bold">
                {schritt}
              </text>
              {index < schritte.length - 1 ? <path d={`M${x + 72} 112 H${x + 86}`} className="stroke-primary" strokeWidth="3" strokeLinecap="round" /> : null}
            </g>
          );
        })}
        <text x="230" y="172" textAnchor="middle" className="fill-fg text-[10px] font-bold">nicht raten, Quelle pruefen</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Werkzeugdaten werden aus Werkzeug, Werkstoff, Verfahren und Tabellenbuch abgeleitet. Unklare Werte werden geklaert, nicht geschaetzt.
      </figcaption>
    </figure>
  );
}

export interface BearbeitungszeitSchemaProps {
  className?: string;
}

/**
 * Zeigt Bearbeitungszeit als Weg durch Vorschubgeschwindigkeit.
 */
export function BearbeitungszeitSchema({ className }: BearbeitungszeitSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="zeitplanung-title zeitplanung-desc" className="h-auto w-full">
        <title id="zeitplanung-title">Bearbeitungszeit grob planen</title>
        <desc id="zeitplanung-desc">Zeitstrahl mit Bearbeitungsweg, Vorschubgeschwindigkeit und Ergebniszeit.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M94 116 H338" className="stroke-primary" strokeWidth="8" strokeLinecap="round" />
        <path d="M338 116 L320 104 M338 116 L320 128" className="stroke-primary" strokeWidth="5" strokeLinecap="round" />
        <circle cx="104" cy="116" r="16" className="fill-surface-raised stroke-border-strong" strokeWidth="3" />
        <circle cx="348" cy="116" r="16" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <rect x="162" y="70" width="136" height="34" rx="8" className="fill-surface-raised stroke-border-strong" />
        <text x="230" y="92" textAnchor="middle" className="fill-fg text-[11px] font-bold">t = s / v</text>
        <text x="230" y="158" textAnchor="middle" className="fill-fg text-[10px] font-bold">Weg durch Geschwindigkeit</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Bearbeitungszeit laesst sich grob aus Weg und Vorschubgeschwindigkeit planen. Ruesten, Pruefen und Nebenzeiten muessen separat betrachtet werden.
      </figcaption>
    </figure>
  );
}

interface MetallprozessKarte {
  label: string;
  detail: string;
}

interface MetallprozessSchemaBaseProps {
  className?: string;
  title: string;
  desc: string;
  caption: string;
  karten: readonly MetallprozessKarte[];
  formel?: string;
}

/**
 * Rendert eine kompakte Prozesskarte fuer Metall-Fertigungsverfahren.
 */
function MetallprozessSchemaBase({ className, title, desc, caption, karten, formel }: MetallprozessSchemaBaseProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 250" role="img" aria-labelledby={`${slug(title)}-title ${slug(title)}-desc`} className="h-auto w-full">
        <title id={`${slug(title)}-title`}>{title}</title>
        <desc id={`${slug(title)}-desc`}>{desc}</desc>
        <rect x="36" y="34" width="388" height="168" rx="10" className="fill-bg-subtle stroke-border" />
        {karten.map((karte, index) => {
          const x = 58 + (index % 4) * 88;
          const y = 66 + Math.floor(index / 4) * 74;
          const istHauptkarte = index === 0;
          return (
            <g key={`${karte.label}-${index}`}>
              <rect x={x} y={y} width="72" height="54" rx="8" className={istHauptkarte ? 'fill-primary-subtle stroke-primary' : 'fill-surface-raised stroke-border-strong'} strokeWidth="3" />
              <text x={x + 36} y={y + 22} textAnchor="middle" className="fill-fg text-[9px] font-bold">
                {karte.label}
              </text>
              <text x={x + 36} y={y + 39} textAnchor="middle" className="fill-fg-muted text-[7px] font-semibold">
                {karte.detail}
              </text>
              {index < karten.length - 1 && index % 4 !== 3 ? <path d={`M${x + 74} ${y + 27} H${x + 86}`} className="stroke-primary" strokeWidth="3" strokeLinecap="round" /> : null}
            </g>
          );
        })}
        {formel ? (
          <g>
            <rect x="144" y="208" width="172" height="28" rx="7" className="fill-warning-bg stroke-warning" />
            <text x="230" y="227" textAnchor="middle" className="fill-fg text-[11px] font-bold">
              {formel}
            </text>
          </g>
        ) : null}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        {caption}
      </figcaption>
    </figure>
  );
}

export interface SaegeSchemaProps {
  className?: string;
}

/**
 * Zeigt Saegen als trennendes Metallverfahren.
 */
export function SaegeSchema({ className }: SaegeSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Saegen mit Saegeblatt und Schnittspalt"
      desc="Saegeblatt, Werkstueck, Schnittspalt und Spaene zeigen Saegen als trennendes Verfahren."
      caption="Saegen trennt Werkstoff mit vielen Schneiden. Schnittspalt, Einspannung und sichere Spanabfuhr sind wichtig."
      karten={[
        { label: 'Saegeblatt', detail: 'Schneiden' },
        { label: 'Werkstueck', detail: 'spannen' },
        { label: 'Schnittspalt', detail: 'Trennung' },
        { label: 'Spaene', detail: 'abfuehren' },
      ]}
    />
  );
}

export interface BohrenSchemaProps {
  className?: string;
}

/**
 * Zeigt Bohren als spanendes Herstellen einer Bohrung.
 */
export function BohrenSchema({ className }: BohrenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Bohren mit Bohrer Span und Bohrung"
      desc="Bohrer erzeugt mit Schnittbewegung und Vorschub eine Bohrung im Werkstueck."
      caption="Beim Bohren greifen Bohrerschneiden in das Werkstueck. Drehzahl, Vorschub und Kuehlung sind quellenpflichtig."
      formel="vc, n"
      karten={[
        { label: 'Bohrer', detail: 'Schneiden' },
        { label: 'Drehung', detail: 'Schnitt' },
        { label: 'Vorschub', detail: 'Tiefe' },
        { label: 'Bohrung', detail: 'Ergebnis' },
      ]}
    />
  );
}

export interface SenkenReibenSchemaProps {
  className?: string;
}

/**
 * Vergleicht Senken und Reiben als Nacharbeit an Bohrungen.
 */
export function SenkenReibenSchema({ className }: SenkenReibenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Senken und Reiben an einer Bohrung"
      desc="Senker erzeugt eine Form an der Bohrung, Reibahle verbessert Mass und Oberflaeche."
      caption="Senken veraendert die Bohrungskante oder Auflage. Reiben dient der genaueren Bohrungsqualitaet."
      karten={[
        { label: 'Bohrung', detail: 'Basis' },
        { label: 'Senker', detail: 'Kante' },
        { label: 'Reibahle', detail: 'Mass' },
        { label: 'Pruefen', detail: 'Qualitaet' },
      ]}
    />
  );
}

export interface GewindeschneidenSchemaProps {
  className?: string;
}

/**
 * Zeigt Gewindeschneiden mit Kernloch und Gewindeprofil.
 */
export function GewindeschneidenSchema({ className }: GewindeschneidenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Gewindeschneiden mit Kernloch"
      desc="Kernloch, Schneidwerkzeug, Span und Gewindeprofil bilden die Grundfolge."
      caption="Beim Gewindeschneiden muessen Kernloch, Gewindeart, Schmierung und Werkzeugfuehrung zur Vorgabe passen."
      karten={[
        { label: 'Kernloch', detail: 'vorbohren' },
        { label: 'Gewinde', detail: 'schneiden' },
        { label: 'Span', detail: 'brechen' },
        { label: 'Lehre', detail: 'pruefen' },
      ]}
    />
  );
}

export interface DrehenGrundlagenSchemaProps {
  className?: string;
}

/**
 * Zeigt Drehen mit Drehmaschine, Werkstueck und Drehmeissel.
 */
export function DrehenGrundlagenSchema({ className }: DrehenGrundlagenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Drehen Grundlagen an der Drehmaschine"
      desc="Rotierendes Werkstueck und Drehmeissel zeigen das Grundprinzip des Drehens."
      caption="Beim Drehen rotiert meist das Werkstueck. Werkzeug, Einspannung, Drehzahl und Vorschub werden nach Vorgabe gewaehlt."
      formel="vc, n"
      karten={[
        { label: 'Werkstueck', detail: 'rotiert' },
        { label: 'Drehmeissel', detail: 'schneidet' },
        { label: 'Vorschub', detail: 'laengs' },
        { label: 'Mass', detail: 'pruefen' },
      ]}
    />
  );
}

export interface LaengsPlanDrehenSchemaProps {
  className?: string;
}

/**
 * Unterscheidet Laengsdrehen und Plandrehen.
 */
export function LaengsPlanDrehenSchema({ className }: LaengsPlanDrehenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Laengs- und Plandrehen im Vergleich"
      desc="Laengsdrehen bearbeitet die Mantelflaeche, Plandrehen bearbeitet die Stirnflaeche."
      caption="Laengsdrehen und Plandrehen unterscheiden sich durch Bearbeitungsrichtung und erzeugte Flaeche."
      karten={[
        { label: 'Laengs', detail: 'Mantel' },
        { label: 'Plan', detail: 'Stirn' },
        { label: 'Bezug', detail: 'Zeichnung' },
        { label: 'Messen', detail: 'danach' },
      ]}
    />
  );
}

export interface FraesenGrundlagenSchemaProps {
  className?: string;
}

/**
 * Zeigt Fraesen mit rotierendem Fraeser und Tischvorschub.
 */
export function FraesenGrundlagenSchema({ className }: FraesenGrundlagenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Fraesen Grundlagen mit rotierendem Fraeser"
      desc="Fraeser, Werkstueck, Tischvorschub und Span zeigen das Grundprinzip des Fraesens."
      caption="Beim Fraesen rotiert das Werkzeug. Tischvorschub, Eingriff, Schnittwerte und Sicherheit folgen der Vorgabe."
      formel="vc, n"
      karten={[
        { label: 'Fraeser', detail: 'rotiert' },
        { label: 'Tisch', detail: 'Vorschub' },
        { label: 'Span', detail: 'mehrschneidig' },
        { label: 'Flaeche', detail: 'erzeugen' },
      ]}
    />
  );
}

export interface UmfangStirnFraesenSchemaProps {
  className?: string;
}

/**
 * Vergleicht Umfangsfraesen und Stirnfraesen.
 */
export function UmfangStirnFraesenSchema({ className }: UmfangStirnFraesenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Umfangs- und Stirnfraesen unterscheiden"
      desc="Umfangsschneiden und Stirnschneiden erzeugen unterschiedliche Bearbeitungssituationen."
      caption="Beim Umfangsfraesen arbeitet der Umfang des Werkzeugs, beim Stirnfraesen die Stirnseite beziehungsweise Planflaeche."
      karten={[
        { label: 'Umfang', detail: 'Mantel' },
        { label: 'Stirn', detail: 'Plan' },
        { label: 'Richtung', detail: 'Vorschub' },
        { label: 'Flaeche', detail: 'Ziel' },
      ]}
    />
  );
}

export interface SchleifenSchemaProps {
  className?: string;
}

/**
 * Zeigt Schleifen mit Schleifscheibe und Korn.
 */
export function SchleifenSchema({ className }: SchleifenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Schleifen mit Schleifscheibe und Korn"
      desc="Schleifscheibe, Korn, Werkstueck und Funkenzone zeigen Schleifen als trennendes Verfahren."
      caption="Schleifen nutzt viele harte Koerner. Schutz, Waerme, Zustellung und Scheibenzustand sind sicherheitsrelevant."
      karten={[
        { label: 'Scheibe', detail: 'Korn' },
        { label: 'Kontakt', detail: 'Zone' },
        { label: 'Waerme', detail: 'beachten' },
        { label: 'Schutz', detail: 'Pflicht' },
      ]}
    />
  );
}

export interface StanzenSchneidenSchemaProps {
  className?: string;
}

/**
 * Zeigt Stanzen und Schneiden mit Stempel, Matrize und Grat.
 */
export function StanzenSchneidenSchema({ className }: StanzenSchneidenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Stanzen und Schneiden mit Stempel und Matrize"
      desc="Stempel, Blech, Matrize und Schnittkante zeigen das Schneidprinzip."
      caption="Beim Stanzen und Schneiden trennt ein Werkzeug das Material. Schnittspalt, Grat und Schutzbereich sind zentrale Punkte."
      karten={[
        { label: 'Stempel', detail: 'drueckt' },
        { label: 'Blech', detail: 'trennt' },
        { label: 'Matrize', detail: 'Gegenform' },
        { label: 'Grat', detail: 'pruefen' },
      ]}
    />
  );
}

export interface BiegenSchemaProps {
  className?: string;
}

/**
 * Zeigt Biegen mit Biegeradius und Rueckfederung.
 */
export function BiegenSchema({ className }: BiegenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Biegen mit Biegeradius und Rueckfederung"
      desc="Blech, Biegekante, Radius und Rueckfederung zeigen das Umformprinzip."
      caption="Beim Biegen wird spanlos umgeformt. Biegeradius, Werkstoff, Faserverlauf und Rueckfederung muessen beachtet werden."
      karten={[
        { label: 'Blech', detail: 'umformen' },
        { label: 'Radius', detail: 'Vorgabe' },
        { label: 'Winkel', detail: 'messen' },
        { label: 'Rueckfeder', detail: 'beachten' },
      ]}
    />
  );
}

export interface WalzenSchemaProps {
  className?: string;
}

/**
 * Zeigt Walzen mit zwei Walzen und Walzspalt.
 */
export function WalzenSchema({ className }: WalzenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Walzen mit Walzspalt"
      desc="Zwei Walzen veraendern Dicke und Form eines Werkstuecks im Walzspalt."
      caption="Walzen ist Umformen durch Druck zwischen Walzen. Spalt, Richtung, Dicke und Oberflaeche sind zu kontrollieren."
      karten={[
        { label: 'Walze', detail: 'oben' },
        { label: 'Walzspalt', detail: 'Dicke' },
        { label: 'Walze', detail: 'unten' },
        { label: 'Band', detail: 'Auslauf' },
      ]}
    />
  );
}

export interface TiefziehenSchemaProps {
  className?: string;
}

/**
 * Zeigt Tiefziehen mit Niederhalter, Ziehring und Napf.
 */
export function TiefziehenSchema({ className }: TiefziehenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Tiefziehen mit Niederhalter und Ziehring"
      desc="Blechzuschnitt, Niederhalter, Ziehring und Napf zeigen die Prozessfolge."
      caption="Tiefziehen formt Blech zu Hohlkoerpern. Falten, Risse, Niederhalter und Werkzeugzustand sind wichtige Beobachtungspunkte."
      karten={[
        { label: 'Blech', detail: 'Zuschnitt' },
        { label: 'Niederhalter', detail: 'fuehrt' },
        { label: 'Ziehring', detail: 'formt' },
        { label: 'Napf', detail: 'Ergebnis' },
      ]}
    />
  );
}

export interface PressenSchemaProps {
  className?: string;
}

/**
 * Zeigt Pressen mit Kraft, Flaeche und Druck.
 */
export function PressenSchema({ className }: PressenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Pressen mit Presskraft und Flaeche"
      desc="Presse, Stempel, Werkstueck und Flaeche zeigen den Druckzusammenhang."
      caption="Pressen nutzt Kraft auf eine Flaeche. Presskraft, Werkzeug, Schutzraum und Freigabe muessen nach Vorgabe passen."
      formel="p = F / A"
      karten={[
        { label: 'Presse', detail: 'Kraft' },
        { label: 'Stempel', detail: 'drueckt' },
        { label: 'Flaeche', detail: 'A' },
        { label: 'Druck', detail: 'p' },
      ]}
    />
  );
}

export interface SchmiedenSchemaProps {
  className?: string;
}

/**
 * Zeigt Schmieden mit Rohling, Werkzeug und Umformung.
 */
export function SchmiedenSchema({ className }: SchmiedenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Schmieden mit Rohling und Werkzeug"
      desc="Rohling wird durch Druck oder Schlag in eine neue Form gebracht."
      caption="Schmieden ist Umformen unter hoher Kraft, oft mit Waerme. Sicherheit, Temperatur und Werkzeugfuehrung sind entscheidend."
      karten={[
        { label: 'Rohling', detail: 'warm' },
        { label: 'Werkzeug', detail: 'Druck' },
        { label: 'Form', detail: 'aendert' },
        { label: 'Gefuege', detail: 'beachten' },
      ]}
    />
  );
}

export interface GiessenSchemaProps {
  className?: string;
}

/**
 * Zeigt Giessen mit Form, Schmelze und Speiser.
 */
export function GiessenSchema({ className }: GiessenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Giessen mit Form Schmelze und Speiser"
      desc="Fluessiges Metall wird in eine Form eingebracht und erstarrt zum Gussteil."
      caption="Giessen ist Urformen. Form, Schmelze, Speiser, Erstarrung und Sicherheit werden nach Vorgabe betrachtet."
      karten={[
        { label: 'Form', detail: 'Hohlraum' },
        { label: 'Schmelze', detail: 'fuellen' },
        { label: 'Speiser', detail: 'nachspeisen' },
        { label: 'Gussteil', detail: 'erstarrt' },
      ]}
    />
  );
}

export interface SchweissenSchemaProps {
  className?: string;
}

/**
 * Zeigt Schweissen mit Naht, Waerme und Schutz.
 */
export function SchweissenSchema({ className }: SchweissenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Schweissen mit Schweissnaht und Waerme"
      desc="Zwei Werkstuecke werden durch Waerme und eine Schweissnaht verbunden."
      caption="Schweissen ist Fuegen mit besonderem Schutzbedarf. Naht, Waermeeinfluss, PSA und Freigabe sind zentral."
      karten={[
        { label: 'Bauteile', detail: 'fuegen' },
        { label: 'Waerme', detail: 'hoch' },
        { label: 'Naht', detail: 'Verbindung' },
        { label: 'Schutz', detail: 'PSA' },
      ]}
    />
  );
}

export interface LoetenSchemaProps {
  className?: string;
}

/**
 * Zeigt Loeten mit Lot und Benetzung.
 */
export function LoetenSchema({ className }: LoetenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Loeten mit Lot und Benetzung"
      desc="Lot benetzt die Fuegeflaechen und verbindet Bauteile ohne Grundwerkstoff aufzuschmelzen."
      caption="Beim Loeten verbindet ein Lot die Bauteile. Spalt, Sauberkeit, Benetzung und Temperaturfenster sind wichtig."
      karten={[
        { label: 'Spalt', detail: 'klein' },
        { label: 'Lot', detail: 'fliesst' },
        { label: 'Benetzung', detail: 'haftet' },
        { label: 'Verbindung', detail: 'fuegt' },
      ]}
    />
  );
}

export interface KlebenSchemaProps {
  className?: string;
}

/**
 * Zeigt Kleben mit Oberflaeche, Klebstoff und Fuegespalt.
 */
export function KlebenSchema({ className }: KlebenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Kleben mit Oberflaeche und Klebschicht"
      desc="Vorbereitete Oberflaechen, Klebstoff und Fuegedruck erzeugen eine Klebverbindung."
      caption="Kleben braucht saubere Oberflaechen, passenden Klebstoff, Verarbeitungszeit und Datenblatt. Raten ist hier unsicher."
      karten={[
        { label: 'Reinigen', detail: 'Oberflaeche' },
        { label: 'Klebstoff', detail: 'Datenblatt' },
        { label: 'Fuegen', detail: 'Druck' },
        { label: 'Ausharten', detail: 'Zeit' },
      ]}
    />
  );
}

export interface SchraubenNietenSchemaProps {
  className?: string;
}

/**
 * Vergleicht Schrauben und Nieten als Verbindungen.
 */
export function SchraubenNietenSchema({ className }: SchraubenNietenSchemaProps) {
  return (
    <MetallprozessSchemaBase
      className={className}
      title="Schrauben und Nieten als Verbindungen"
      desc="Schraube und Niet verbinden Bauteile mit unterschiedlicher Loesbarkeit."
      caption="Schrauben sind meist loesbar, Nieten meist dauerhaft. Drehmoment, Sicherung, Lochbild und Vorgabe entscheiden."
      formel="Drehmoment"
      karten={[
        { label: 'Schraube', detail: 'loesbar' },
        { label: 'Niet', detail: 'dauerhaft' },
        { label: 'Lochbild', detail: 'passen' },
        { label: 'Sicherung', detail: 'pruefen' },
      ]}
    />
  );
}

interface KunststoffprozessKarte {
  label: string;
  detail: string;
}

interface KunststoffprozessSchemaBaseProps {
  className?: string;
  title: string;
  desc: string;
  caption: string;
  karten: readonly KunststoffprozessKarte[];
  merker?: string;
}

/**
 * Rendert eine kompakte Prozesskarte fuer Kunststoffverfahren.
 */
function KunststoffprozessSchemaBase({ className, title, desc, caption, karten, merker }: KunststoffprozessSchemaBaseProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 258" role="img" aria-labelledby={`${slug(title)}-title ${slug(title)}-desc`} className="h-auto w-full">
        <title id={`${slug(title)}-title`}>{title}</title>
        <desc id={`${slug(title)}-desc`}>{desc}</desc>
        <rect x="34" y="32" width="392" height="176" rx="12" className="fill-bg-subtle stroke-border" />
        <path d="M62 120 H398" className="stroke-primary/70" strokeWidth="5" strokeLinecap="round" />
        <path d="M398 120 L382 110 M398 120 L382 130" className="stroke-primary/70" strokeWidth="4" strokeLinecap="round" />
        {karten.map((karte, index) => {
          const x = 54 + (index % 5) * 70;
          const y = 58 + Math.floor(index / 5) * 82;
          const istStart = index === 0;
          return (
            <g key={`${karte.label}-${index}`}>
              <rect x={x} y={y} width="58" height="58" rx="10" className={istStart ? 'fill-primary-subtle stroke-primary' : 'fill-surface-raised stroke-border-strong'} strokeWidth="3" />
              <circle cx={x + 29} cy={y + 19} r="10" className={istStart ? 'fill-primary stroke-primary' : 'fill-info-bg stroke-info-border'} />
              <text x={x + 29} y={y + 23} textAnchor="middle" className={istStart ? 'fill-primary-fg text-[9px] font-bold' : 'fill-fg text-[9px] font-bold'}>
                {index + 1}
              </text>
              <text x={x + 29} y={y + 41} textAnchor="middle" className="fill-fg text-[8px] font-bold">
                {karte.label}
              </text>
              <text x={x + 29} y={y + 53} textAnchor="middle" className="fill-fg-muted text-[7px] font-semibold">
                {karte.detail}
              </text>
            </g>
          );
        })}
        {merker ? (
          <g>
            <rect x="112" y="216" width="236" height="28" rx="8" className="fill-warning-bg stroke-warning" />
            <text x="230" y="235" textAnchor="middle" className="fill-fg text-[10px] font-bold">
              {merker}
            </text>
          </g>
        ) : null}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        {caption}
      </figcaption>
    </figure>
  );
}

export interface SpritzgiessmaschineSchemaProps {
  className?: string;
}

/**
 * Zeigt den Grundaufbau einer Spritzgiessmaschine.
 */
export function SpritzgiessmaschineSchema({ className }: SpritzgiessmaschineSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Spritzgiessmaschine mit Schliess- und Spritzeinheit"
      desc="Materialtrichter, Plastifiziereinheit, Werkzeug, Schliessseite und Auswerfer zeigen den Maschinenueberblick."
      caption="Die Spritzgiessmaschine verbindet Materialaufbereitung, Plastifizieren, Werkzeugfuellung, Kuehlung und Entformen zu einem geregelten Prozess."
      merker="Schliessseite + Spritzseite"
      karten={[
        { label: 'Trichter', detail: 'Material' },
        { label: 'Zylinder', detail: 'Schmelze' },
        { label: 'Werkzeug', detail: 'Form' },
        { label: 'Schliessen', detail: 'Kraft' },
        { label: 'Auswerfer', detail: 'Teil' },
      ]}
    />
  );
}

export interface MaterialtrichterTrocknungSchemaProps {
  className?: string;
}

/**
 * Zeigt Materialtrichter und Trocknung als Vorstufe.
 */
export function MaterialtrichterTrocknungSchema({ className }: MaterialtrichterTrocknungSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Materialtrichter und Trocknung vor dem Plastifizieren"
      desc="Granulat, Trockner, Foerderung, Trichter und Chargenfreigabe bilden die Materialvorbereitung."
      caption="Material wird nicht nur eingefuellt. Sorte, Charge, Sauberkeit und Trocknung nach Datenblatt sichern den Startzustand."
      merker="Datenblatt vor Start"
      karten={[
        { label: 'Granulat', detail: 'Sorte' },
        { label: 'Trockner', detail: 'Feuchte' },
        { label: 'Foerderung', detail: 'sauber' },
        { label: 'Trichter', detail: 'bereit' },
        { label: 'Freigabe', detail: 'Charge' },
      ]}
    />
  );
}

export interface SchneckeZylinderSchemaProps {
  className?: string;
}

/**
 * Zeigt Schnecke und Zylinder als Plastifiziereinheit.
 */
export function SchneckeZylinderSchema({ className }: SchneckeZylinderSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Schnecke und Zylinder plastifizieren Kunststoff"
      desc="Einzug, Verdichtung, Homogenisierung, Dosierung und Schmelzetransport laufen in Schnecke und Zylinder."
      caption="Schnecke und Zylinder foerdern Granulat, bauen Waerme und Druck auf und bereiten eine gleichmaessige Schmelze vor."
      merker="Foerdern, Schmelzen, Dosieren"
      karten={[
        { label: 'Einzug', detail: 'Granulat' },
        { label: 'Reibung', detail: 'Waerme' },
        { label: 'Mischen', detail: 'homogen' },
        { label: 'Dosieren', detail: 'Menge' },
        { label: 'Vorraum', detail: 'Schmelze' },
      ]}
    />
  );
}

export interface EinzugszoneSchemaProps {
  className?: string;
}

/**
 * Zeigt die Einzugszone der Schnecke.
 */
export function EinzugszoneSchema({ className }: EinzugszoneSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Einzugszone nimmt Granulat sicher auf"
      desc="Granulat rieselt in die Schneckengaenge und wird in Richtung Zylinder gefoerdert."
      caption="Die Einzugszone muss Material gleichmaessig aufnehmen. Brueckenbildung, falsches Material oder Feuchte stoeren den Prozess frueh."
      karten={[
        { label: 'Trichter', detail: 'Zufuhr' },
        { label: 'Granulat', detail: 'rieselt' },
        { label: 'Schnecke', detail: 'nimmt auf' },
        { label: 'Foerderung', detail: 'stetig' },
        { label: 'Stoerung', detail: 'melden' },
      ]}
    />
  );
}

export interface KompressionszoneSchemaProps {
  className?: string;
}

/**
 * Zeigt die Kompressionszone als Verdichtungsbereich.
 */
export function KompressionszoneSchema({ className }: KompressionszoneSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Kompressionszone verdichtet und schmilzt"
      desc="Der freie Raum im Schneckengang wird kleiner, Material wird verdichtet und zunehmend aufgeschmolzen."
      caption="In der Kompressionszone entstehen Druck, Scherung und Waermeeintrag. Deshalb sind Temperaturen und Materialverhalten quellenpflichtig."
      merker="Druck + Waerme"
      karten={[
        { label: 'Gangtiefe', detail: 'kleiner' },
        { label: 'Druck', detail: 'steigt' },
        { label: 'Scherung', detail: 'Waerme' },
        { label: 'Schmelze', detail: 'entsteht' },
        { label: 'Kontrolle', detail: 'Vorgabe' },
      ]}
    />
  );
}

export interface MeteringzoneSchemaProps {
  className?: string;
}

/**
 * Zeigt die Meteringzone als Homogenisier- und Dosierbereich.
 */
export function MeteringzoneSchema({ className }: MeteringzoneSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Meteringzone homogenisiert die Schmelze"
      desc="Die Schmelze wird weiter gefoerdert, gemischt und fuer den naechsten Schuss dosiert."
      caption="Die Meteringzone soll eine moeglichst gleichmaessige Schmelze in Menge, Temperatur und Zusammensetzung liefern."
      merker="gleichmaessige Schmelze"
      karten={[
        { label: 'Mischen', detail: 'homogen' },
        { label: 'Temperatur', detail: 'stabil' },
        { label: 'Menge', detail: 'dosiert' },
        { label: 'Vorraum', detail: 'fuellen' },
        { label: 'Freigabe', detail: 'Prozess' },
      ]}
    />
  );
}

export interface RueckstromsperreDueseSchemaProps {
  className?: string;
}

/**
 * Zeigt Rueckstromsperre und Duese an der Spritzeinheit.
 */
export function RueckstromsperreDueseSchema({ className }: RueckstromsperreDueseSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Rueckstromsperre und Duese fuehren die Schmelze"
      desc="Rueckstromsperre verhindert Rueckfluss beim Einspritzen, die Duese koppelt zur Werkzeugseite."
      caption="Rueckstromsperre und Duese beeinflussen Dosiergenauigkeit, Druckaufbau, Dichtheit und sichere Uebergabe in das Werkzeug."
      karten={[
        { label: 'Vorraum', detail: 'Schmelze' },
        { label: 'Sperre', detail: 'dichtet' },
        { label: 'Druck', detail: 'aufbau' },
        { label: 'Duese', detail: 'Uebergabe' },
        { label: 'Werkzeug', detail: 'Anguss' },
      ]}
    />
  );
}

export interface WerkzeugKavitaetSchemaProps {
  className?: string;
}

/**
 * Zeigt Werkzeug und Kavitaet als formgebenden Bereich.
 */
export function WerkzeugKavitaetSchema({ className }: WerkzeugKavitaetSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Werkzeug und Kavitaet geben die Form vor"
      desc="Werkzeughaelften, Kavitaet, Trennebene, Anguss und Temperierung bestimmen die Bauteilform."
      caption="Die Kavitaet ist der Hohlraum fuer das Bauteil. Werkzeugzustand, Trennebene und Temperierung beeinflussen Qualitaet und Entformung."
      karten={[
        { label: 'Haelften', detail: 'schliessen' },
        { label: 'Kavitaet', detail: 'Form' },
        { label: 'Trennebene', detail: 'Lage' },
        { label: 'Kuehlung', detail: 'stabil' },
        { label: 'Teil', detail: 'erstarrt' },
      ]}
    />
  );
}

export interface AngussEntlueftungSchemaProps {
  className?: string;
}

/**
 * Zeigt Anguss und Entlueftung beim Fuellen.
 */
export function AngussEntlueftungSchema({ className }: AngussEntlueftungSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Anguss und Entlueftung fuehren Schmelze und Luft"
      desc="Schmelze fliesst ueber den Anguss in die Kavitaet, Luft muss kontrolliert entweichen."
      caption="Anguss und Entlueftung bestimmen Fuellbild, Bindenahte, Brandstellenrisiko und stabile Werkzeugfuellung."
      merker="Schmelze hinein, Luft heraus"
      karten={[
        { label: 'Duese', detail: 'startet' },
        { label: 'Anguss', detail: 'fuehrt' },
        { label: 'Kavitaet', detail: 'fuellt' },
        { label: 'Luft', detail: 'weicht' },
        { label: 'Pruefen', detail: 'Fehler' },
      ]}
    />
  );
}

export interface AuswerferEntformenSchemaProps {
  className?: string;
}

/**
 * Zeigt Auswerfer und Entformen nach der Kuehlung.
 */
export function AuswerferEntformenSchema({ className }: AuswerferEntformenSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Auswerfer entformen das abgekuehlte Teil"
      desc="Werkzeug oeffnet, Auswerfer druecken das Teil aus der Kavitaet und die Entnahme wird ueberwacht."
      caption="Entformen klappt nur sicher, wenn Kuehlung, Auswerferweg, Werkzeugzustand und Entnahme zusammenpassen."
      karten={[
        { label: 'Kuehlen', detail: 'fest' },
        { label: 'Oeffnen', detail: 'Werkzeug' },
        { label: 'Auswerfer', detail: 'drueckt' },
        { label: 'Entnahme', detail: 'sicher' },
        { label: 'Kontrolle', detail: 'Teil' },
      ]}
    />
  );
}

export interface WerkzeugtemperierungSchemaProps {
  className?: string;
}

/**
 * Zeigt Werkzeugtemperierung als Stabilitaetsfaktor.
 */
export function WerkzeugtemperierungSchema({ className }: WerkzeugtemperierungSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Werkzeugtemperierung stabilisiert den Prozess"
      desc="Temperierkanaele, Medium, Vorlauf, Ruecklauf und Werkzeugtemperatur beeinflussen Erstarrung und Masshaltigkeit."
      caption="Temperierung ist kein Nebenpunkt. Sie beeinflusst Fuellen, Kuehlen, Zykluszeit, Schwindung und Oberflaeche."
      merker="Temperatur stabil halten"
      karten={[
        { label: 'Medium', detail: 'fliesst' },
        { label: 'Vorlauf', detail: 'rein' },
        { label: 'Werkzeug', detail: 'temperiert' },
        { label: 'Ruecklauf', detail: 'raus' },
        { label: 'Mass', detail: 'stabil' },
      ]}
    />
  );
}

export interface PlastifizierenDosierenSchemaProps {
  className?: string;
}

/**
 * Zeigt Plastifizieren und Dosieren als Vorbereitung des Schusses.
 */
export function PlastifizierenDosierenSchema({ className }: PlastifizierenDosierenSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Plastifizieren und Dosieren bereiten den Schuss vor"
      desc="Schnecke rotiert, Material schmilzt, Schmelze sammelt sich vor der Schnecke und die Dosiermenge wird erreicht."
      caption="Plastifizieren erzeugt die Schmelze, Dosieren stellt die passende Menge fuer den naechsten Einspritzvorgang bereit."
      karten={[
        { label: 'Rotation', detail: 'Schnecke' },
        { label: 'Waerme', detail: 'Schmelze' },
        { label: 'Staudruck', detail: 'wirkt' },
        { label: 'Dosierweg', detail: 'Menge' },
        { label: 'Bereit', detail: 'Schuss' },
      ]}
    />
  );
}

export interface EinspritzenUmschaltpunktSchemaProps {
  className?: string;
}

/**
 * Zeigt Einspritzen und Umschaltpunkt.
 */
export function EinspritzenUmschaltpunktSchema({ className }: EinspritzenUmschaltpunktSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Einspritzen und Umschaltpunkt fuellen die Kavitaet"
      desc="Schnecke bewegt sich vor, Schmelze fuellt die Kavitaet und der Prozess schaltet auf Nachdruck um."
      caption="Der Umschaltpunkt trennt Fuellphase und Nachdruckphase. Er wird nach Prozessvorgabe eingestellt und beobachtet."
      merker="Fuellen -> Nachdruck"
      karten={[
        { label: 'Start', detail: 'Schuss' },
        { label: 'Fuellung', detail: 'Kavitaet' },
        { label: 'Front', detail: 'wandert' },
        { label: 'Umschalt', detail: 'Punkt' },
        { label: 'Nachdruck', detail: 'folgt' },
      ]}
    />
  );
}

export interface NachdruckSchemaProps {
  className?: string;
}

/**
 * Zeigt Nachdruck als Ausgleichsphase.
 */
export function NachdruckSchema({ className }: NachdruckSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Nachdruck gleicht Schwindung beim Erstarren aus"
      desc="Nach der Fuellung wird Druck gehalten, damit Material nachfliessen kann."
      caption="Nachdruck beeinflusst Masse, Einfallstellen, Gewicht und innere Spannungen. Werte kommen aus freigegebener Prozessvorgabe."
      merker="Druck halten, bis Anguss sperrt"
      karten={[
        { label: 'Gefuellt', detail: 'Kavitaet' },
        { label: 'Druck', detail: 'halten' },
        { label: 'Nachfluss', detail: 'moeglich' },
        { label: 'Anguss', detail: 'sperrt' },
        { label: 'Mass', detail: 'pruefen' },
      ]}
    />
  );
}

export interface KuehlzeitRestkuehlzeitSchemaProps {
  className?: string;
}

/**
 * Zeigt Kuehlzeit und Restkuehlzeit.
 */
export function KuehlzeitRestkuehlzeitSchema({ className }: KuehlzeitRestkuehlzeitSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Kuehlzeit und Restkuehlzeit bestimmen Entformbarkeit"
      desc="Das Teil erstarrt im Werkzeug und kuehlt nach dem Druckhalten weiter bis zur Entformung."
      caption="Kuehlzeit ist oft ein grosser Zyklusanteil. Zu kurze Kuehlung kann Verzug, Massfehler oder Entformschaden verursachen."
      karten={[
        { label: 'Nachdruck', detail: 'Ende' },
        { label: 'Erstarren', detail: 'innen' },
        { label: 'Restkuehl', detail: 'Zeit' },
        { label: 'Oeffnen', detail: 'sicher' },
        { label: 'Entformen', detail: 'stabil' },
      ]}
    />
  );
}

export interface SchliesskraftSchemaProps {
  className?: string;
}

/**
 * Zeigt Schliesskraft als Gegenkraft zum Werkzeuginnendruck.
 */
export function SchliesskraftSchema({ className }: SchliesskraftSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Schliesskraft haelt das Werkzeug geschlossen"
      desc="Schliesseinheit wirkt gegen den Druck der Schmelze in der Kavitaet."
      caption="Schliesskraft verhindert ungewolltes Oeffnen der Werkzeughaelften. Sie wird nicht nach Gefuehl geaendert."
      merker="Werkzeug geschlossen halten"
      karten={[
        { label: 'Schliessen', detail: 'Kraft' },
        { label: 'Druck', detail: 'innen' },
        { label: 'Trennebene', detail: 'dicht' },
        { label: 'Grat', detail: 'beachten' },
        { label: 'Vorgabe', detail: 'nutzen' },
      ]}
    />
  );
}

export interface SpritzgiessParameterSchemaProps {
  className?: string;
}

/**
 * Zeigt wichtige Spritzgiessparameter im Zusammenhang.
 */
export function SpritzgiessParameterSchema({ className }: SpritzgiessParameterSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Einspritzdruck Staudruck und Temperaturen zusammen lesen"
      desc="Einspritzdruck, Staudruck, Zylinder- und Werkzeugtemperaturen beeinflussen die Schmelze."
      caption="Parameter werden immer im Zusammenhang bewertet. Eine einzelne Zahl ohne Material, Werkzeug und Quelle reicht nicht."
      merker="Parameter nur mit Quelle"
      karten={[
        { label: 'Einspritz', detail: 'Druck' },
        { label: 'Staudruck', detail: 'Dosieren' },
        { label: 'Zylinder', detail: 'Temp.' },
        { label: 'Werkzeug', detail: 'Temp.' },
        { label: 'Qualitaet', detail: 'Teil' },
      ]}
    />
  );
}

export interface SpritzgiesszyklusSchemaProps {
  className?: string;
}

/**
 * Zeigt den kompletten Spritzgiesszyklus.
 */
export function SpritzgiesszyklusSchema({ className }: SpritzgiesszyklusSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Kompletter Spritzgiesszyklus vom Schliessen bis Entformen"
      desc="Schliessen, Einspritzen, Nachdruck, Kuehlen, Oeffnen und Auswerfen bilden den wiederholbaren Zyklus."
      caption="Der Zyklus verbindet Maschinenbewegung, Schmelzeverhalten, Werkzeugzustand und Qualitaetskontrolle."
      merker="Schliessen -> Auswerfen"
      karten={[
        { label: 'Schliessen', detail: 'Werkzeug' },
        { label: 'Spritzen', detail: 'fuellen' },
        { label: 'Nachdruck', detail: 'halten' },
        { label: 'Kuehlen', detail: 'fest' },
        { label: 'Auswerfen', detail: 'Teil' },
      ]}
    />
  );
}

export interface ExtruderAufbauSchemaProps {
  className?: string;
}

/**
 * Zeigt den Aufbau eines Extruders.
 */
export function ExtruderAufbauSchema({ className }: ExtruderAufbauSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Extruder mit Trichter Schnecke Zylinder und Werkzeug"
      desc="Granulat wird kontinuierlich plastifiziert und durch ein formgebendes Werkzeug gedrueckt."
      caption="Extrusion ist ein kontinuierlicher Prozess. Schnecke, Zylinder, Werkzeug und Abzug muessen stabil zusammenarbeiten."
      merker="kontinuierlicher Prozess"
      karten={[
        { label: 'Trichter', detail: 'Granulat' },
        { label: 'Schnecke', detail: 'foerdert' },
        { label: 'Zylinder', detail: 'waermt' },
        { label: 'Werkzeug', detail: 'formt' },
        { label: 'Abzug', detail: 'zieht' },
      ]}
    />
  );
}

export interface ExtrusionsprodukteSchemaProps {
  className?: string;
}

/**
 * Zeigt typische Extrusionsprodukte.
 */
export function ExtrusionsprodukteSchema({ className }: ExtrusionsprodukteSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Profile Rohre und Folien extrudieren"
      desc="Werkzeugform, Kalibrierung, Kuehlung, Abzug und Aufwicklung bestimmen das Extrusionsprodukt."
      caption="Profile, Rohre und Folien entstehen kontinuierlich. Mass, Wanddicke, Kuehlung und Abzugsgeschwindigkeit werden nach Vorgabe gefuehrt."
      karten={[
        { label: 'Werkzeug', detail: 'Querschnitt' },
        { label: 'Kalibrier', detail: 'Mass' },
        { label: 'Kuehlen', detail: 'stabil' },
        { label: 'Abzug', detail: 'Tempo' },
        { label: 'Produkt', detail: 'endlos' },
      ]}
    />
  );
}

export interface BlasformenSchemaProps {
  className?: string;
}

/**
 * Zeigt Blasformen fuer Hohlkoerper.
 */
export function BlasformenSchema({ className }: BlasformenSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Blasformen erzeugt Hohlkoerper mit Luftdruck"
      desc="Vorformling oder Schlauch wird im Werkzeug mit Luft an die Kavitaet angelegt."
      caption="Beim Blasformen bestimmen Vorformling, Werkzeug, Luftdruck, Kuehlung und Entformung die Hohlkoerperqualitaet."
      merker="Vorformling + Luft"
      karten={[
        { label: 'Vorform', detail: 'warm' },
        { label: 'Werkzeug', detail: 'schliesst' },
        { label: 'Luft', detail: 'blaest' },
        { label: 'Kuehlen', detail: 'Form' },
        { label: 'Hohlteil', detail: 'fertig' },
      ]}
    />
  );
}

export interface ThermoformenSchemaProps {
  className?: string;
}

/**
 * Zeigt Thermoformen aus erwarmter Folie oder Platte.
 */
export function ThermoformenSchema({ className }: ThermoformenSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Thermoformen verformt erwaermte Folie oder Platte"
      desc="Halbzeug wird erwaermt, an eine Form gezogen oder gedrueckt, gekuehlt und beschnitten."
      caption="Thermoformen nutzt ein vorhandenes Halbzeug. Temperaturfenster, Form, Wanddicke und Beschnitt sind zentrale Beobachtungspunkte."
      karten={[
        { label: 'Halbzeug', detail: 'Folie' },
        { label: 'Waerme', detail: 'weich' },
        { label: 'Form', detail: 'ziehen' },
        { label: 'Kuehlen', detail: 'fest' },
        { label: 'Beschnitt', detail: 'Rand' },
      ]}
    />
  );
}

export interface SchwindungVerzugSchemaProps {
  className?: string;
}

/**
 * Zeigt Schwindung und Verzug als Qualitaetsrisiken.
 */
export function SchwindungVerzugSchema({ className }: SchwindungVerzugSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Schwindung und Verzug veraendern Mass und Form"
      desc="Kunststoff zieht sich beim Abkuehlen zusammen und kann sich ungleichmaessig verformen."
      caption="Schwindung und Verzug werden ueber Material, Werkzeug, Wanddicke, Kuehlung und Prozessfuehrung beeinflusst."
      merker="Mass und Form pruefen"
      karten={[
        { label: 'Waerme', detail: 'hoch' },
        { label: 'Kuehlen', detail: 'ungleich' },
        { label: 'Schwind', detail: 'Mass' },
        { label: 'Verzug', detail: 'Form' },
        { label: 'Pruefen', detail: 'Teil' },
      ]}
    />
  );
}

export interface MolekuelorientierungSchemaProps {
  className?: string;
}

/**
 * Zeigt Molekuelorientierung als Folge von Fliessrichtung und Abkuehlung.
 */
export function MolekuelorientierungSchema({ className }: MolekuelorientierungSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Molekuelorientierung folgt Fliessrichtung und Abkuehlung"
      desc="Polymerketten koennen sich beim Fliessen ausrichten und nach dem Erstarren Eigenschaften beeinflussen."
      caption="Molekuelorientierung ist vereinfacht: Fliessweg, Scherung und Abkuehlung koennen Richtungseigenschaften verursachen."
      karten={[
        { label: 'Fliessen', detail: 'Richtung' },
        { label: 'Ketten', detail: 'richten' },
        { label: 'Scherung', detail: 'wirkt' },
        { label: 'Kuehlen', detail: 'fixiert' },
        { label: 'Eigenschaft', detail: 'Richtung' },
      ]}
    />
  );
}

export interface FarbMaterialwechselSchemaProps {
  className?: string;
}

/**
 * Zeigt Farb- und Materialwechsel als kontrollierten Umstellprozess.
 */
export function FarbMaterialwechselSchema({ className }: FarbMaterialwechselSchemaProps) {
  return (
    <KunststoffprozessSchemaBase
      className={className}
      title="Farbwechsel und Materialwechsel kontrolliert durchfuehren"
      desc="Restmaterial, Spuelen, Freigabe, erste Teile und Dokumentation gehoeren zur Umstellung."
      caption="Beim Wechsel zaehlen Sauberkeit, Rueckverfolgbarkeit, Materialvertraeglichkeit und Freigabe. Vermischung wird nicht verborgen."
      merker="sauber, freigegeben, dokumentiert"
      karten={[
        { label: 'Alt', detail: 'sichern' },
        { label: 'Spuelen', detail: 'reinigen' },
        { label: 'Neu', detail: 'Charge' },
        { label: 'Anfahren', detail: 'pruefen' },
        { label: 'Freigabe', detail: 'Doku' },
      ]}
    />
  );
}

interface ProduktionsvorbereitungKarte {
  label: string;
  detail: string;
}

interface ProduktionsvorbereitungSchemaBaseProps {
  className?: string;
  title: string;
  desc: string;
  caption: string;
  karten: readonly ProduktionsvorbereitungKarte[];
  merker?: string;
}

/**
 * Rendert eine kompakte Ablaufkarte fuer Produktionsvorbereitung.
 */
function ProduktionsvorbereitungSchemaBase({ className, title, desc, caption, karten, merker }: ProduktionsvorbereitungSchemaBaseProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 248" role="img" aria-labelledby={`${slug(title)}-title ${slug(title)}-desc`} className="h-auto w-full">
        <title id={`${slug(title)}-title`}>{title}</title>
        <desc id={`${slug(title)}-desc`}>{desc}</desc>
        <rect x="30" y="32" width="400" height="158" rx="12" className="fill-bg-subtle stroke-border" />
        {karten.map((karte, index) => {
          const x = 50 + index * 78;
          const istStart = index === 0;
          return (
            <g key={`${karte.label}-${index}`}>
              {index > 0 ? <path d={`M${x - 30} 106 H${x - 10}`} className="stroke-primary" strokeWidth="3" strokeLinecap="round" /> : null}
              <rect x={x} y="70" width="58" height="72" rx="9" className={istStart ? 'fill-primary-subtle stroke-primary' : 'fill-surface-raised stroke-border-strong'} strokeWidth="3" />
              <text x={x + 29} y="94" textAnchor="middle" className="fill-fg text-[9px] font-bold">
                {karte.label}
              </text>
              <text x={x + 29} y="116" textAnchor="middle" className="fill-fg-muted text-[7px] font-semibold">
                {karte.detail}
              </text>
              <circle cx={x + 29} cy="134" r="7" className={istStart ? 'fill-primary' : 'fill-info-bg stroke-info-border'} />
            </g>
          );
        })}
        {merker ? (
          <g>
            <rect x="112" y="202" width="236" height="28" rx="8" className="fill-warning-bg stroke-warning" />
            <text x="230" y="221" textAnchor="middle" className="fill-fg text-[10px] font-bold">
              {merker}
            </text>
          </g>
        ) : null}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        {caption}
      </figcaption>
    </figure>
  );
}

export interface AuftragZeichnungAbgleichSchemaProps {
  className?: string;
}

/**
 * Zeigt den Abgleich von Auftrag und Zeichnung.
 */
export function AuftragZeichnungAbgleichSchema({ className }: AuftragZeichnungAbgleichSchemaProps) {
  return (
    <ProduktionsvorbereitungSchemaBase
      className={className}
      title="Auftrag und Zeichnung sicher abgleichen"
      desc="Auftrag, Zeichnung, Material, Menge und Rueckfrage bilden den sicheren Startabgleich."
      caption="Vor Produktionsstart muessen Auftrag und Zeichnung zusammenpassen. Widersprueche werden geklaert, nicht ueberbrueckt."
      merker="Widerspruch klaeren"
      karten={[
        { label: 'Auftrag', detail: 'was?' },
        { label: 'Zeichnung', detail: 'wie?' },
        { label: 'Material', detail: 'womit?' },
        { label: 'Menge', detail: 'wie viel?' },
        { label: 'Klaeren', detail: 'bevor Start' },
      ]}
    />
  );
}

export interface MaterialChargePruefenSchemaProps {
  className?: string;
}

/**
 * Zeigt Material- und Chargenpruefung vor Produktionsstart.
 */
export function MaterialChargePruefenSchema({ className }: MaterialChargePruefenSchemaProps) {
  return (
    <ProduktionsvorbereitungSchemaBase
      className={className}
      title="Material und Charge pruefen"
      desc="Etikett, Charge, Materialfreigabe, Lagerzustand und Dokumentation sichern die Rueckverfolgbarkeit."
      caption="Material und Charge muessen zum Auftrag passen. Rueckverfolgbarkeit ist Teil der Qualitaetssicherung."
      karten={[
        { label: 'Etikett', detail: 'lesen' },
        { label: 'Charge', detail: 'passen' },
        { label: 'Material', detail: 'freigegeben' },
        { label: 'Zustand', detail: 'sichtbar' },
        { label: 'Doku', detail: 'notieren' },
      ]}
    />
  );
}

export interface WerkzeugVorbereitenSchemaProps {
  className?: string;
}

/**
 * Zeigt Werkzeugvorbereitung am Ruestplatz.
 */
export function WerkzeugVorbereitenSchema({ className }: WerkzeugVorbereitenSchemaProps) {
  return (
    <ProduktionsvorbereitungSchemaBase
      className={className}
      title="Werkzeug am Ruestplatz vorbereiten"
      desc="Werkzeug, Zustand, Hilfsmittel, Freigabe und Transport werden vor dem Ruesten geprueft."
      caption="Werkzeugvorbereitung reduziert Stillstand und Risiko. Beschaedigungen werden vor dem Einbau gemeldet."
      karten={[
        { label: 'Werkzeug', detail: 'identisch' },
        { label: 'Zustand', detail: 'pruefen' },
        { label: 'Hilfsmittel', detail: 'bereit' },
        { label: 'Freigabe', detail: 'klaeren' },
        { label: 'Transport', detail: 'sicher' },
      ]}
    />
  );
}

export interface MaschineRuestenSchemaProps {
  className?: string;
}

/**
 * Zeigt Ruestschritte an einer Maschine.
 */
export function MaschineRuestenSchema({ className }: MaschineRuestenSchemaProps) {
  return (
    <ProduktionsvorbereitungSchemaBase
      className={className}
      title="Maschine ruesten in sicherer Reihenfolge"
      desc="Sichern, Werkzeug einbauen, Nullpunkt oder Bezug pruefen, Parameter laden und Freigabe vorbereiten."
      caption="Ruesten ist ein geplanter Ablauf. Sicherheit, Reihenfolge, Bezugspunkte und Freigabe sind wichtiger als Tempo."
      merker="Reihenfolge vor Tempo"
      karten={[
        { label: 'Sichern', detail: 'Stillstand' },
        { label: 'Einbau', detail: 'Werkzeug' },
        { label: 'Bezug', detail: 'Nullpunkt' },
        { label: 'Daten', detail: 'laden' },
        { label: 'Check', detail: 'Freigabe' },
      ]}
    />
  );
}

export interface ParameterUebernehmenSchemaProps {
  className?: string;
}

/**
 * Zeigt sichere Parameteruebernahme aus freigegebenen Quellen.
 */
export function ParameterUebernehmenSchema({ className }: ParameterUebernehmenSchemaProps) {
  return (
    <ProduktionsvorbereitungSchemaBase
      className={className}
      title="Parameter aus Rezept oder Vorgabe uebernehmen"
      desc="Quelle, Rezeptstand, Maschine, Plausibilitaet und Rueckfrage sichern die Parameteruebernahme."
      caption="Parameter werden nicht geraten. Quelle, Rezeptversion und Maschinenbezug muessen vor dem Anfahren stimmen."
      merker="Parameter nicht raten"
      karten={[
        { label: 'Quelle', detail: 'freigegeben' },
        { label: 'Rezept', detail: 'Stand' },
        { label: 'Maschine', detail: 'passt' },
        { label: 'Plausibel', detail: 'pruefen' },
        { label: 'Rueckfrage', detail: 'bei Zweifel' },
      ]}
    />
  );
}

export interface ErstteilHerstellenSchemaProps {
  className?: string;
}

/**
 * Zeigt das Herstellen eines Erstteils beim Anfahren.
 */
export function ErstteilHerstellenSchema({ className }: ErstteilHerstellenSchemaProps) {
  return (
    <ProduktionsvorbereitungSchemaBase
      className={className}
      title="Erstteil herstellen und Anfahren beobachten"
      desc="Anfahren, erstes Teil, Sichtpruefung, Prozessbeobachtung und Kennzeichnung fuehren zur Erstteilpruefung."
      caption="Das Erstteil zeigt, ob Ruestung, Material und Parameter grob zusammenpassen. Serienlauf beginnt erst nach Freigabe."
      karten={[
        { label: 'Anfahren', detail: 'langsam' },
        { label: 'Erstteil', detail: 'nehmen' },
        { label: 'Sicht', detail: 'pruefen' },
        { label: 'Prozess', detail: 'beobachten' },
        { label: 'Kennz.', detail: 'trennen' },
      ]}
    />
  );
}

export interface ErstteilPruefenSchemaProps {
  className?: string;
}

/**
 * Zeigt Erstteilpruefung gegen Sollvorgaben.
 */
export function ErstteilPruefenSchema({ className }: ErstteilPruefenSchemaProps) {
  return (
    <ProduktionsvorbereitungSchemaBase
      className={className}
      title="Erstteil gegen Pruefplan pruefen"
      desc="Sollvorgabe, Pruefmerkmal, Messmittel, Ergebnis und Entscheidung bilden die Erstteilpruefung."
      caption="Erstteilpruefung vergleicht das erste Teil mit Zeichnung, Pruefplan und Freigabegrenzen."
      karten={[
        { label: 'Soll', detail: 'lesen' },
        { label: 'Merkmal', detail: 'finden' },
        { label: 'Messmittel', detail: 'passen' },
        { label: 'Ergebnis', detail: 'notieren' },
        { label: 'Entscheid', detail: 'weiter?' },
      ]}
    />
  );
}

export interface ProduktionsfreigabeSchemaProps {
  className?: string;
}

/**
 * Zeigt Produktionsfreigabe als Entscheidung nach Pruefung.
 */
export function ProduktionsfreigabeSchema({ className }: ProduktionsfreigabeSchemaProps) {
  return (
    <ProduktionsvorbereitungSchemaBase
      className={className}
      title="Produktionsfreigabe nach Pruefung entscheiden"
      desc="Gutteil, Nacharbeit, Sperrung, Freigabe und Dokumentation ordnen den Serienstart."
      caption="Produktionsfreigabe ist eine klare Entscheidung. Ohne Freigabe laufen auffaellige Teile nicht in die Serie."
      merker="Freigabe vor Serie"
      karten={[
        { label: 'Pruefen', detail: 'Erstteil' },
        { label: 'Gut?', detail: 'Grenzen' },
        { label: 'Sperren', detail: 'bei Fehler' },
        { label: 'Freigabe', detail: 'berechtigt' },
        { label: 'Serie', detail: 'starten' },
      ]}
    />
  );
}

export interface WerkzeugwechselVorbereitungSchemaProps {
  className?: string;
}

/**
 * Zeigt Werkzeugwechsel mit Sicherheits- und Zeitbezug.
 */
export function WerkzeugwechselVorbereitungSchema({ className }: WerkzeugwechselVorbereitungSchemaProps) {
  return (
    <ProduktionsvorbereitungSchemaBase
      className={className}
      title="Werkzeugwechsel sicher planen"
      desc="Stillsetzen, Sichern, Ausbau, Einbau und Ruestzeit werden fuer den Werkzeugwechsel geplant."
      caption="Werkzeugwechsel verbindet Sicherheit, Hilfsmittel, Reihenfolge und Zeitplanung. Eingriffe erfolgen nur nach Freigabe."
      merker="Stillstand und Freigabe"
      karten={[
        { label: 'Stop', detail: 'sicher' },
        { label: 'Sichern', detail: 'Energie' },
        { label: 'Ausbau', detail: 'alt' },
        { label: 'Einbau', detail: 'neu' },
        { label: 'Zeit', detail: 'ruesten' },
      ]}
    />
  );
}

export interface AnfahrenAbfahrenSchemaProps {
  className?: string;
}

/**
 * Zeigt Anfahren und Abfahren eines Prozesses.
 */
export function AnfahrenAbfahrenSchema({ className }: AnfahrenAbfahrenSchemaProps) {
  return (
    <ProduktionsvorbereitungSchemaBase
      className={className}
      title="Anfahren und Abfahren kontrolliert ausfuehren"
      desc="Startzustand, Anfahrteile, stabiler Lauf, Stoppfolge und Ausschussbehandlung strukturieren den Prozesswechsel."
      caption="Anfahren und Abfahren erzeugen oft besondere Teile. Diese werden getrennt, geprueft und dokumentiert."
      karten={[
        { label: 'Start', detail: 'Zustand' },
        { label: 'Anfahr', detail: 'Teile' },
        { label: 'Stabil', detail: 'Lauf' },
        { label: 'Abfahren', detail: 'Folge' },
        { label: 'Aussch.', detail: 'trennen' },
      ]}
    />
  );
}

export interface SchichtuebergabeSchemaProps {
  className?: string;
}

/**
 * Zeigt eine strukturierte Schichtuebergabe.
 */
export function SchichtuebergabeSchema({ className }: SchichtuebergabeSchemaProps) {
  return (
    <ProduktionsvorbereitungSchemaBase
      className={className}
      title="Schichtuebergabe mit relevanten Informationen"
      desc="Auftrag, Status, Stoerung, Qualitaet und offene Punkte gehoeren in eine verwertbare Uebergabe."
      caption="Eine gute Schichtuebergabe verhindert Informationsverlust. Wichtig ist, was die naechste Schicht fuer Sicherheit, Qualitaet und Ablauf braucht."
      karten={[
        { label: 'Auftrag', detail: 'Stand' },
        { label: 'Status', detail: 'laufend' },
        { label: 'Stoerung', detail: 'melden' },
        { label: 'Quali', detail: 'Befund' },
        { label: 'Offen', detail: 'naechst' },
      ]}
    />
  );
}

export interface ProduktionsdatenQualitaetSchemaProps {
  className?: string;
}

/**
 * Zeigt Produktionsdaten als Rueckverfolgbarkeitskette.
 */
export function ProduktionsdatenQualitaetSchema({ className }: ProduktionsdatenQualitaetSchemaProps) {
  return (
    <ProduktionsvorbereitungSchemaBase
      className={className}
      title="Produktionsdaten fuer Qualitaet sichern"
      desc="Auftrag, Charge, Maschine, Pruefergebnis und Freigabe bilden eine Rueckverfolgbarkeitskette."
      caption="Produktionsdaten muessen verwertbar und rueckverfolgbar sein. Fehlende Daten machen spaetere Qualitaetsklaerung schwer."
      merker="rueckverfolgbar dokumentieren"
      karten={[
        { label: 'Auftrag', detail: 'ID' },
        { label: 'Charge', detail: 'Material' },
        { label: 'Maschine', detail: 'Anlage' },
        { label: 'Pruefung', detail: 'Wert' },
        { label: 'Freigabe', detail: 'Doku' },
      ]}
    />
  );
}

interface QualitaetSchemaKarte {
  label: string;
  detail: string;
}

interface QualitaetSchemaBaseProps {
  className?: string;
  title: string;
  desc: string;
  caption: string;
  karten: readonly QualitaetSchemaKarte[];
  merker?: string;
}

/**
 * Rendert eine kompakte QS-Karte fuer Pruefung, Entscheidung und Dokumentation.
 */
function QualitaetSchemaBase({ className, title, desc, caption, karten, merker }: QualitaetSchemaBaseProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 248" role="img" aria-labelledby={`${slug(title)}-title ${slug(title)}-desc`} className="h-auto w-full">
        <title id={`${slug(title)}-title`}>{title}</title>
        <desc id={`${slug(title)}-desc`}>{desc}</desc>
        <rect x="30" y="30" width="400" height="158" rx="12" className="fill-bg-subtle stroke-border" />
        <path d="M60 152 C130 78 185 150 230 104 S335 118 400 72" className="fill-none stroke-primary" strokeWidth="4" strokeLinecap="round" />
        {karten.map((karte, index) => {
          const x = 50 + index * 78;
          return (
            <g key={`${karte.label}-${index}`}>
              <rect x={x} y="58" width="58" height="86" rx="9" className={index === 0 ? 'fill-primary-subtle stroke-primary' : 'fill-surface-raised stroke-border-strong'} strokeWidth="3" />
              <circle cx={x + 29} cy="82" r="12" className={index % 2 === 0 ? 'fill-info-bg stroke-info-border' : 'fill-warning-bg stroke-warning'} />
              <text x={x + 29} y="86" textAnchor="middle" className="fill-fg text-[10px] font-bold">
                {index + 1}
              </text>
              <text x={x + 29} y="112" textAnchor="middle" className="fill-fg text-[8px] font-bold">
                {karte.label}
              </text>
              <text x={x + 29} y="132" textAnchor="middle" className="fill-fg-muted text-[7px] font-semibold">
                {karte.detail}
              </text>
            </g>
          );
        })}
        {merker ? (
          <g>
            <rect x="92" y="202" width="276" height="28" rx="8" className="fill-success-bg stroke-success" />
            <text x="230" y="221" textAnchor="middle" className="fill-fg text-[10px] font-bold">
              {merker}
            </text>
          </g>
        ) : null}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        {caption}
      </figcaption>
    </figure>
  );
}

export interface QualitaetBetriebSchemaProps {
  className?: string;
}

export interface SollIstNennmassSchemaProps {
  className?: string;
}

export interface GrenzmasseToleranzSchemaProps {
  className?: string;
}

export interface PruefplanLesenSchemaProps {
  className?: string;
}

export interface PruefhaeufigkeitSchemaProps {
  className?: string;
}

export interface PruefartenSchemaProps {
  className?: string;
}

export interface SichtMassFunktionspruefungSchemaProps {
  className?: string;
}

export interface StichprobeVollpruefungSchemaProps {
  className?: string;
}

export interface GutteilNacharbeitAusschussSchemaProps {
  className?: string;
}

export interface FehlerquoteBerechnenSchemaProps {
  className?: string;
}

export interface MittelwertSpannweiteSchemaProps {
  className?: string;
}

export interface TrendProzessstreuungSchemaProps {
  className?: string;
}

export interface NormalverteilungSchemaProps {
  className?: string;
}

export interface RegelkarteLesenSchemaProps {
  className?: string;
}

export interface ProzessfaehigkeitSchemaProps {
  className?: string;
}

export interface MessunsicherheitQsSchemaProps {
  className?: string;
}

export interface RueckverfolgbarkeitChargeSchemaProps {
  className?: string;
}

export interface PruefprotokollSchreibenSchemaProps {
  className?: string;
}

export interface SperrungFreigabeSchemaProps {
  className?: string;
}

/**
 * Zeigt Qualitaet als Kette vom Kunden bis zur Rueckmeldung.
 */
export function QualitaetBetriebSchema({ className }: QualitaetBetriebSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Qualitaet im Betrieb als Kundenanforderung verstehen" desc="Kundenanforderung, Vorgabe, Fertigung, Pruefung und Rueckmeldung bilden die Qualitaetskette." caption="Qualitaet heisst: Das Ergebnis erfuellt die festgelegte Anforderung. Im Betrieb wird das durch Vorgaben, Pruefung und Rueckmeldung gesichert." merker="Qualitaet = Anforderung erfuellt" karten={[{ label: 'Kunde', detail: 'braucht' }, { label: 'Vorgabe', detail: 'festlegen' }, { label: 'Fertigung', detail: 'umsetzen' }, { label: 'Pruefung', detail: 'belegen' }, { label: 'Rueckm.', detail: 'lernen' }]} />;
}

export function SollIstNennmassSchema({ className }: SollIstNennmassSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Sollwert Istwert und Nennmass sicher unterscheiden" desc="Nennmass, Sollwert, Istwert, Abweichung und Bewertung werden getrennt gelesen." caption="Der Sollwert kommt aus der Vorgabe, der Istwert aus der Messung. Die Abweichung zeigt, wie weit das Ergebnis von der Vorgabe entfernt ist." merker="Soll vor Ist lesen" karten={[{ label: 'Nenn', detail: 'Zeichnung' }, { label: 'Soll', detail: 'Vorgabe' }, { label: 'Ist', detail: 'Messung' }, { label: 'Abw.', detail: 'Differenz' }, { label: 'Urteil', detail: 'gut?' }]} />;
}

export function GrenzmasseToleranzSchema({ className }: GrenzmasseToleranzSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Grenzmasse und Toleranz als Gutteilbereich lesen" desc="Unteres Grenzmass, oberes Grenzmass, Toleranzfeld, Istwert und Gutteilentscheidung." caption="Grenzmasse begrenzen den erlaubten Bereich. Ein Istwert innerhalb des Toleranzfelds ist gut, ausserhalb muss nach Vorgabe reagiert werden." merker="innerhalb der Grenzen = gut" karten={[{ label: 'UG', detail: 'unten' }, { label: 'Nenn', detail: 'Mitte' }, { label: 'OG', detail: 'oben' }, { label: 'Ist', detail: 'messen' }, { label: 'Gut?', detail: 'entsch.' }]} />;
}

export function PruefplanLesenSchema({ className }: PruefplanLesenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Pruefplan lesen und Merkmale finden" desc="Pruefmerkmal, Sollvorgabe, Pruefmittel, Haeufigkeit und Dokumentation stehen im Pruefplan." caption="Der Pruefplan sagt, was, womit, wann und wie dokumentiert wird. Ohne Pruefplan werden Merkmale nicht geraten." karten={[{ label: 'Merkmal', detail: 'was?' }, { label: 'Soll', detail: 'wie?' }, { label: 'Mittel', detail: 'womit?' }, { label: 'Takt', detail: 'wann?' }, { label: 'Doku', detail: 'wo?' }]} />;
}

export function PruefhaeufigkeitSchema({ className }: PruefhaeufigkeitSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Pruefhaeufigkeit als Intervall oder Stichprobe planen" desc="Pruefstart, Intervall, Stichprobe, Anlasspruefung und Dokumentation strukturieren die Pruefhaeufigkeit." caption="Pruefhaeufigkeit beschreibt, wie oft geprueft wird. Sie folgt Pruefplan, Risiko und betrieblichen Vorgaben." karten={[{ label: 'Start', detail: 'wann' }, { label: 'Interv.', detail: 'Abstand' }, { label: 'Probe', detail: 'Menge' }, { label: 'Anlass', detail: 'Stoerung' }, { label: 'Doku', detail: 'Nachweis' }]} />;
}

export function PruefartenSchema({ className }: PruefartenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Erst Zwischen und Endpruefung im Ablauf zuordnen" desc="Erstpruefung, Zwischenpruefung und Endpruefung liegen an unterschiedlichen Punkten im Prozess." caption="Pruefarten werden nach Zeitpunkt und Zweck unterschieden: Start absichern, laufenden Prozess ueberwachen und Ergebnis abschliessen." karten={[{ label: 'Ruest', detail: 'bereit' }, { label: 'Erst', detail: 'Start' }, { label: 'Zwisch.', detail: 'laufend' }, { label: 'Ende', detail: 'abschl.' }, { label: 'Frei', detail: 'weiter' }]} />;
}

export function SichtMassFunktionspruefungSchema({ className }: SichtMassFunktionspruefungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Sicht Mass und Funktionspruefung passend waehlen" desc="Sichtpruefung, Masspruefung und Funktionspruefung beantworten unterschiedliche Qualitaetsfragen." caption="Nicht jede Pruefung misst eine Zahl. Sicht, Mass und Funktion muessen zum Merkmal im Pruefplan passen." karten={[{ label: 'Sicht', detail: 'Auge' }, { label: 'Mass', detail: 'mm' }, { label: 'Funktion', detail: 'passt?' }, { label: 'Merkmal', detail: 'Plan' }, { label: 'Urteil', detail: 'nachweis' }]} />;
}

export function StichprobeVollpruefungSchema({ className }: StichprobeVollpruefungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Stichprobe und Vollpruefung nach Risiko unterscheiden" desc="Losgroesse, Stichprobe, Vollpruefung, Risiko und Aufwand werden gegeneinander abgewogen." caption="Stichprobe prueft einen Teil der Menge, Vollpruefung jedes Teil. Welche Variante gilt, steht in Vorgabe oder Pruefplan." karten={[{ label: 'Los', detail: 'Menge' }, { label: 'Probe', detail: 'Teil' }, { label: 'Voll', detail: 'alle' }, { label: 'Risiko', detail: 'hoch?' }, { label: 'Plan', detail: 'Vorgabe' }]} />;
}

export function GutteilNacharbeitAusschussSchema({ className }: GutteilNacharbeitAusschussSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Gutteil Nacharbeit und Ausschuss sauber klassifizieren" desc="Pruefergebnis, Gutteil, Nacharbeit, Ausschuss und Sperrung ordnen Teile nach der Pruefung." caption="Nach der Pruefung braucht jedes auffaellige Teil eine klare Einstufung. Nacharbeit und Ausschuss werden nicht mit Gutteilen vermischt." merker="Teile eindeutig trennen" karten={[{ label: 'Pruef.', detail: 'Ergebnis' }, { label: 'Gut', detail: 'weiter' }, { label: 'Nacharb.', detail: 'moegl.' }, { label: 'Aussch.', detail: 'nicht gut' }, { label: 'Sperre', detail: 'klaeren' }]} />;
}

export function FehlerquoteBerechnenSchema({ className }: FehlerquoteBerechnenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Fehlerquote aus Fehlern und Gesamtmenge berechnen" desc="Gesamtmenge, Fehleranzahl, Quotient, Prozentwert und Bewertung bilden die Fehlerquote." caption="Die Fehlerquote zeigt den Anteil fehlerhafter Teile. Reale Grenzwerte und Bewertungsregeln bleiben quellenpflichtig." merker="Fehler / Gesamt" karten={[{ label: 'Gesamt', detail: 'alle' }, { label: 'Fehler', detail: 'zaehlen' }, { label: 'Teilen', detail: 'Quote' }, { label: 'Prozent', detail: 'x100' }, { label: 'Bewert.', detail: 'Quelle' }]} />;
}

export function MittelwertSpannweiteSchema({ className }: MittelwertSpannweiteSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Mittelwert und Spannweite aus Messreihe bilden" desc="Messwerte, kleinster Wert, groesster Wert, Mittelwert und Spannweite beschreiben eine Messreihe." caption="Mittelwert beschreibt die Lage, Spannweite die Streuung einer Messreihe. Beides ersetzt keine Pruefplanentscheidung." karten={[{ label: 'Werte', detail: 'Reihe' }, { label: 'Min', detail: 'klein' }, { label: 'Max', detail: 'gross' }, { label: 'Mittel', detail: 'Lage' }, { label: 'Spann.', detail: 'max-min' }]} />;
}

export function TrendProzessstreuungSchema({ className }: TrendProzessstreuungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Trend und Prozessstreuung in Messwerten erkennen" desc="Messreihe, Trend, Streuung, Drift und Reaktion helfen beim Ueberwachen des Prozesses." caption="Ein einzelner Messwert reicht oft nicht. Trend und Streuung zeigen, ob der Prozess stabil bleibt oder sich verschiebt." karten={[{ label: 'Reihe', detail: 'laufend' }, { label: 'Trend', detail: 'Richtung' }, { label: 'Streu.', detail: 'Breite' }, { label: 'Drift', detail: 'Warnung' }, { label: 'Reakt.', detail: 'melden' }]} />;
}

export function NormalverteilungSchema({ className }: NormalverteilungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Normalverteilung als einfache Glockenkurve deuten" desc="Viele Messwerte, Mitte, Streuung, Randbereiche und Bewertung bilden die einfache Normalverteilung." caption="Die Normalverteilung ist ein Modell fuer Messwerte um eine Mitte. Sie hilft beim groben Verstehen von Streuung und Prozessfaehigkeit." karten={[{ label: 'Viele', detail: 'Werte' }, { label: 'Mitte', detail: 'haeufig' }, { label: 'Streu.', detail: 'breit' }, { label: 'Rand', detail: 'selten' }, { label: 'Modell', detail: 'deuten' }]} />;
}

export function RegelkarteLesenSchema({ className }: RegelkarteLesenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Regelkarte lesen und Warnsignale erkennen" desc="Messpunkte, Mittellinie, Warngrenze, Eingriffsgrenze und Reaktion strukturieren die Regelkarte." caption="Regelkarten zeigen Prozessverlauf. Punkte ausserhalb von Grenzen oder auffaellige Muster werden nach Vorgabe eskaliert." merker="Signal erkennen, nicht ignorieren" karten={[{ label: 'Punkt', detail: 'Messung' }, { label: 'Mitte', detail: 'Linie' }, { label: 'Warn', detail: 'Signal' }, { label: 'Eingriff', detail: 'Grenze' }, { label: 'Reakt.', detail: 'Vorgabe' }]} />;
}

export function ProzessfaehigkeitSchema({ className }: ProzessfaehigkeitSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Prozessfaehigkeit Cp und Cpk grob einordnen" desc="Toleranzbreite, Prozessstreuung, Prozesslage, Cp und Cpk werden fuer Faehigkeit grob verglichen." caption="Cp und Cpk sind Kennwerte fuer Prozessfaehigkeit. Sie werden nur mit belastbaren Messdaten und passenden Vorgaben bewertet." karten={[{ label: 'Tol.', detail: 'Breite' }, { label: 'Streu.', detail: 'Prozess' }, { label: 'Lage', detail: 'Mitte' }, { label: 'Cp', detail: 'Breite' }, { label: 'Cpk', detail: 'Lage' }]} />;
}

export function MessunsicherheitQsSchema({ className }: MessunsicherheitQsSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Messunsicherheit in der Qualitaetssicherung beruecksichtigen" desc="Messmittel, Umgebung, Bedienung, Kalibrierung und Ergebnisbereich beeinflussen Messunsicherheit." caption="Messunsicherheit beschreibt, wie sicher ein Messergebnis ist. Bei grenznahen Werten wird nach Pruef- und Freigabevorgabe entschieden." karten={[{ label: 'Mittel', detail: 'geeignet' }, { label: 'Umgeb.', detail: 'stabil' }, { label: 'Bedien.', detail: 'gleich' }, { label: 'Kalib.', detail: 'Status' }, { label: 'Bereich', detail: 'unsicher' }]} />;
}

export function RueckverfolgbarkeitChargeSchema({ className }: RueckverfolgbarkeitChargeSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Rueckverfolgbarkeit und Charge sicher verbinden" desc="Charge, Auftrag, Maschine, Pruefprotokoll und Freigabe bilden die Trace-Kette." caption="Rueckverfolgbarkeit verbindet Material, Prozess und Entscheidung. Ohne Charge und Dokumentation ist spaetere Klaerung unsicher." merker="Charge immer zuordnen" karten={[{ label: 'Charge', detail: 'Material' }, { label: 'Auftrag', detail: 'Produkt' }, { label: 'Masch.', detail: 'Anlage' }, { label: 'Pruef.', detail: 'Nachweis' }, { label: 'Frei', detail: 'Entsch.' }]} />;
}

export function PruefprotokollSchreibenSchema({ className }: PruefprotokollSchreibenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Pruefprotokoll mit Abweichung nachvollziehbar schreiben" desc="Merkmal, Soll, Ist, Bewertung, Unterschrift oder Kennung gehoeren ins Pruefprotokoll." caption="Ein Pruefprotokoll muss spaeter lesbar machen, was geprueft wurde, welches Ergebnis vorlag und wer entschieden hat." karten={[{ label: 'Merkm.', detail: 'was' }, { label: 'Soll', detail: 'Vorgabe' }, { label: 'Ist', detail: 'Wert' }, { label: 'Bewert.', detail: 'Urteil' }, { label: 'Kenn.', detail: 'wer' }]} />;
}

export function SperrungFreigabeSchema({ className }: SperrungFreigabeSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Sperrung und Freigabe als QS-Entscheidung treffen" desc="Abweichung, Sperrung, Klaerung, Freigabe und Dokumentation bilden den Entscheidungsbaum." caption="Bei Abweichungen wird nicht weiterproduziert, bis Sperrung, Klaerung oder Freigabe nach betrieblichem Weg entschieden sind." merker="Abweichung erst klaeren" karten={[{ label: 'Abw.', detail: 'finden' }, { label: 'Sperre', detail: 'trennen' }, { label: 'Klaer.', detail: 'melden' }, { label: 'Frei?', detail: 'Entsch.' }, { label: 'Doku', detail: 'Nachweis' }]} />;
}

export interface GratMetallSchemaProps {
  className?: string;
}

export interface MassabweichungMetallSchemaProps {
  className?: string;
}

export interface RattermarkenSchemaProps {
  className?: string;
}

export interface SchlechterRundlaufSchemaProps {
  className?: string;
}

export interface WerkzeugbruchSchemaProps {
  className?: string;
}

export interface WerkzeugverschleissMetallSchemaProps {
  className?: string;
}

export interface VerformungRissSchemaProps {
  className?: string;
}

export interface SchlechteOberflaecheSchemaProps {
  className?: string;
}

export interface HaertefehlerSchemaProps {
  className?: string;
}

export interface KorrosionBauteilSchemaProps {
  className?: string;
}

export interface EinfallstellenSchemaProps {
  className?: string;
}

export interface LunkerSchemaProps {
  className?: string;
}

export interface GratUeberspritzungSchemaProps {
  className?: string;
}

export interface UnterfuellungSchemaProps {
  className?: string;
}

export interface FliessnaehteBindenaehteSchemaProps {
  className?: string;
}

export interface SchlierenFeuchtigkeitSchemaProps {
  className?: string;
}

export interface VerbrennungDieseleffektSchemaProps {
  className?: string;
}

export interface VerzugKunststoffSchemaProps {
  className?: string;
}

export interface DelaminationSchemaProps {
  className?: string;
}

export interface SchwarzePunkteSchemaProps {
  className?: string;
}

export interface FarbabweichungSchemaProps {
  className?: string;
}

export interface AngussAuswerfermarkenSchemaProps {
  className?: string;
}

export interface MassabweichungKunststoffSchemaProps {
  className?: string;
}

export interface Fehlerdiagnose5MSchemaProps {
  className?: string;
}

export interface SensorAktorSteuerungSchemaProps {
  className?: string;
}

export interface SteuerungRegelungSchemaProps {
  className?: string;
}

export interface SollIstStellgroesseSchemaProps {
  className?: string;
}

export interface SpsGrundlagenSchemaProps {
  className?: string;
}

export interface EingangAusgangSchemaProps {
  className?: string;
}

export interface UndOderVerriegelungSchemaProps {
  className?: string;
}

export interface EndschalterLichtschrankeSchemaProps {
  className?: string;
}

export interface InduktivKapazitivSensorSchemaProps {
  className?: string;
}

export interface TemperaturDrucksensorenSchemaProps {
  className?: string;
}

export interface ElektromotorFrequenzumrichterSchemaProps {
  className?: string;
}

export interface DruckluftanlageSchemaProps {
  className?: string;
}

export interface WartungseinheitSchemaProps {
  className?: string;
}

export interface VentileDrosselnSchemaProps {
  className?: string;
}

export interface EinfachwirkenderZylinderSchemaProps {
  className?: string;
}

export interface DoppeltwirkenderZylinderSchemaProps {
  className?: string;
}

export interface HydraulikGrundlagenSchemaProps {
  className?: string;
}

export interface WartungInspektionInstandsetzungSchemaProps {
  className?: string;
}

export interface VorbeugendeInstandhaltungSchemaProps {
  className?: string;
}

export interface SchmierungSchmierplanSchemaProps {
  className?: string;
}

export interface VerschleissReibungSchemaProps {
  className?: string;
}

export interface TemperaturSchwingungGeraeuschSchemaProps {
  className?: string;
}

export interface LeckageErkennenSchemaProps {
  className?: string;
}

export interface LagerfehlerSchemaProps {
  className?: string;
}

export interface UnwuchtFehlausrichtungSchemaProps {
  className?: string;
}

export interface StoerungFehlerUrsacheWirkungSchemaProps {
  className?: string;
}

export interface FiveWhySchemaProps {
  className?: string;
}

export interface IshikawaDiagrammSchemaProps {
  className?: string;
}

export interface StoerungDokumentierenSchemaProps {
  className?: string;
}

export interface SichereFehlersucheSchemaProps {
  className?: string;
}

export interface VerbesserungNachStoerungSchemaProps {
  className?: string;
}

export interface FertigungsauftragSchemaProps {
  className?: string;
}

export interface ArbeitsfolgePlanenSchemaProps {
  className?: string;
}

export interface StuecklisteMaterialbedarfSchemaProps {
  className?: string;
}

export interface PersonalMaschinenbedarfSchemaProps {
  className?: string;
}

export interface MaschinenbelegungKapazitaetSchemaProps {
  className?: string;
}

export interface TaktzeitZykluszeitSchemaProps {
  className?: string;
}

export interface DurchlaufzeitSchemaProps {
  className?: string;
}

export interface RuestzeitBearbeitungszeitSchemaProps {
  className?: string;
}

export interface StillstandszeitSchemaProps {
  className?: string;
}

export interface LieferterminLosgroesseSchemaProps {
  className?: string;
}

export interface BestandMindestbestandSchemaProps {
  className?: string;
}

export interface MeldebestandSicherheitsbestandSchemaProps {
  className?: string;
}

export interface FifoSchemaProps {
  className?: string;
}

export interface KanbanGrundprinzipSchemaProps {
  className?: string;
}

export interface WertschoepfungVerschwendungSchemaProps {
  className?: string;
}

export interface FuenfSWiederholenSchemaProps {
  className?: string;
}

export interface KvpImTeamSchemaProps {
  className?: string;
}

export function GratMetallSchema({ className }: GratMetallSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Grat an Metallteilen als Schnittfehler erkennen" desc="Kante, Grat, Schnittspalt, Werkzeugzustand und Nacharbeit ordnen den Fehler ein." caption="Grat entsteht haeufig an Schnitt- oder Bearbeitungskanten. Er wird erkannt, getrennt bewertet und nach Vorgabe entfernt oder gemeldet." merker="Grat nicht uebersehen" karten={[{ label: 'Kante', detail: 'finden' }, { label: 'Grat', detail: 'tasten?' }, { label: 'Spalt', detail: 'Ursache' }, { label: 'Werkz.', detail: 'pruefen' }, { label: 'Nacharb.', detail: 'klaeren' }]} />;
}

export function MassabweichungMetallSchema({ className }: MassabweichungMetallSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Massabweichung Metall systematisch eingrenzen" desc="Soll, Ist, Messmittel, Werkzeug und Aufspannung helfen bei der Ursachenpruefung." caption="Massabweichungen werden nicht nur gemessen, sondern auf Ursache und Wiederholung geprueft. Messmittel, Werkzeug, Maschine und Material werden einbezogen." merker="erst messen, dann Ursache pruefen" karten={[{ label: 'Soll', detail: 'lesen' }, { label: 'Ist', detail: 'messen' }, { label: 'Mittel', detail: 'sicher' }, { label: 'Werkz.', detail: 'Zustand' }, { label: 'Urs.', detail: 'melden' }]} />;
}

export function RattermarkenSchema({ className }: RattermarkenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Rattermarken als Schwingungsspur deuten" desc="Oberflaeche, Schwingung, Werkzeugspannung, Schnittwerte und Meldung strukturieren Rattermarken." caption="Rattermarken sind regelmaessige Spuren auf der Oberflaeche. Sie koennen auf Schwingung, unpassende Schnittwerte oder Spannprobleme hinweisen." karten={[{ label: 'Spur', detail: 'sehen' }, { label: 'Schwing.', detail: 'deuten' }, { label: 'Spann.', detail: 'pruefen' }, { label: 'Werte', detail: 'Quelle' }, { label: 'Meld.', detail: 'Doku' }]} />;
}

export function SchlechterRundlaufSchema({ className }: SchlechterRundlaufSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Schlechten Rundlauf mit Messuhr pruefen" desc="Drehteil, Messuhr, Ausschlag, Unwucht und Ursache werden zur Rundlaufpruefung verbunden." caption="Schlechter Rundlauf zeigt, dass ein drehendes Teil nicht gleichmaessig laeuft. Die Messuhr macht die Abweichung sichtbar." karten={[{ label: 'Teil', detail: 'spannen' }, { label: 'Messuhr', detail: 'setzen' }, { label: 'Ausschl.', detail: 'lesen' }, { label: 'Unw.', detail: 'moegl.' }, { label: 'Urs.', detail: 'klaeren' }]} />;
}

export function WerkzeugbruchSchema({ className }: WerkzeugbruchSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Werkzeugbruch sicher erkennen und sofort reagieren" desc="Bruch, Maschinenstopp, Teilepruefung, Werkzeugwechsel und Meldung bilden die Sofortmassnahmen." caption="Werkzeugbruch ist ein akuter Prozessfehler. Sicherheit, Stillsetzen, Teiletrennung und Meldung kommen vor weiterem Produzieren." merker="Stoppen und melden" karten={[{ label: 'Bruch', detail: 'erkennen' }, { label: 'Stop', detail: 'sicher' }, { label: 'Teile', detail: 'sperren' }, { label: 'Werkz.', detail: 'wechseln' }, { label: 'Meld.', detail: 'Doku' }]} />;
}

export function WerkzeugverschleissMetallSchema({ className }: WerkzeugverschleissMetallSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Werkzeugverschleiss an Schneide und Freiflaeche erkennen" desc="Schneide, Freiflaeche, Oberflaeche, Massdrift und Standzeit ordnen Verschleiss ein." caption="Werkzeugverschleiss entwickelt sich oft schrittweise. Oberflaeche, Massdrift und Schneidenzustand liefern Hinweise." karten={[{ label: 'Schneide', detail: 'sehen' }, { label: 'Frei', detail: 'Flaeche' }, { label: 'Oberfl.', detail: 'Spur' }, { label: 'Mass', detail: 'drift' }, { label: 'Standz.', detail: 'Quelle' }]} />;
}

export function VerformungRissSchema({ className }: VerformungRissSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Verformung und Riss als Materialfehler unterscheiden" desc="Formabweichung, Riss, Belastung, Materialzustand und Sperrung strukturieren die Diagnose." caption="Verformung veraendert die Gestalt, ein Riss trennt Material an. Beide Fehler brauchen klare Bewertung und sichere Trennung." karten={[{ label: 'Form', detail: 'abweich.' }, { label: 'Riss', detail: 'sichtbar' }, { label: 'Last', detail: 'Ursache' }, { label: 'Mat.', detail: 'Zustand' }, { label: 'Sperre', detail: 'klaeren' }]} />;
}

export function SchlechteOberflaecheSchema({ className }: SchlechteOberflaecheSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Schlechte Oberflaeche nach Rauheit und Kratzern pruefen" desc="Rauheit, Kratzer, Werkzeugspur, Kuehlung und Vorgabe helfen bei Oberflaechenfehlern." caption="Oberflaechenfehler koennen Funktion, Passung oder Optik beeinflussen. Bewertet wird nach Zeichnung, Pruefplan oder Musterfreigabe." karten={[{ label: 'Rauheit', detail: 'fuehlen' }, { label: 'Kratzer', detail: 'sehen' }, { label: 'Werkz.', detail: 'Spur' }, { label: 'KSS', detail: 'pruefen' }, { label: 'Vorg.', detail: 'lesen' }]} />;
}

export function HaertefehlerSchema({ className }: HaertefehlerSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Haertefehler als Pruefbedarf erkennen" desc="Haerte, Waermebehandlung, Pruefpunkt, Vergleich und Freigabe ordnen Haertefehler." caption="Haertefehler sind oft nicht sicher mit blossem Auge zu erkennen. Bei Verdacht braucht es Pruefung, Quelle und Freigabeweg." karten={[{ label: 'Haerte', detail: 'Soll' }, { label: 'Waerme', detail: 'Prozess' }, { label: 'Punkt', detail: 'pruefen' }, { label: 'Vergl.', detail: 'Quelle' }, { label: 'Frei?', detail: 'klaeren' }]} />;
}

export function KorrosionBauteilSchema({ className }: KorrosionBauteilSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Korrosion am Bauteil erkennen und Ursache pruefen" desc="Medium, Oberflaeche, Schutzschicht, Lagerung und Sperrung helfen bei Korrosionsursachen." caption="Korrosion veraendert die Oberflaeche und kann Bauteile schwaechen. Ursache, Lagerung und Schutz werden nach Vorgabe geprueft." karten={[{ label: 'Medium', detail: 'Kontakt' }, { label: 'Oberfl.', detail: 'Rost' }, { label: 'Schutz', detail: 'Schicht' }, { label: 'Lager', detail: 'Umfeld' }, { label: 'Sperre', detail: 'bei Fund' }]} />;
}

export function EinfallstellenSchema({ className }: EinfallstellenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Einfallstellen durch Schwindung und Nachdruck deuten" desc="Oberflaeche, Wanddicke, Schwindung, Nachdruck und Kuehlung ordnen Einfallstellen ein." caption="Einfallstellen sind eingesunkene Bereiche an der Oberflaeche. Sie entstehen haeufig dort, wo Material beim Abkuehlen nachschwindet und der Nachdruck nicht ausreicht." merker="Dicke Stelle zuerst pruefen" karten={[{ label: 'Delle', detail: 'sehen' }, { label: 'Wand', detail: 'dick?' }, { label: 'Schwind.', detail: 'Ursache' }, { label: 'Nachd.', detail: 'Quelle' }, { label: 'Kuehl.', detail: 'pruefen' }]} />;
}

export function LunkerSchema({ className }: LunkerSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Lunker als inneren Hohlraum im Kunststoffteil erklaeren" desc="Schnittbild, Hohlraum, Schwindung, Wanddicke und Nachdruck bilden die Diagnose." caption="Lunker liegen im Inneren des Bauteils und sind von aussen nicht immer sichtbar. Schnittbild, Gewicht, Bruchbild oder Pruefvorgabe helfen bei der Klaerung." karten={[{ label: 'Innen', detail: 'Hohlr.' }, { label: 'Schnitt', detail: 'pruefen' }, { label: 'Wand', detail: 'dick' }, { label: 'Schwind.', detail: 'deuten' }, { label: 'Nachd.', detail: 'klaeren' }]} />;
}

export function GratUeberspritzungSchema({ className }: GratUeberspritzungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Grat und Ueberspritzung an Trennebene erkennen" desc="Trennebene, Werkzeugspalt, Schliesskraft, Einspritzdruck und Sperrung strukturieren den Fehler." caption="Grat oder Ueberspritzung entsteht, wenn Kunststoffschmelze aus der Kavitaet austritt. Bewertet wird nach Funktion, Muster und Prozessvorgabe." merker="Trennebene genau ansehen" karten={[{ label: 'Trenn.', detail: 'Ebene' }, { label: 'Grat', detail: 'Rand' }, { label: 'Spalt', detail: 'Werkz.' }, { label: 'Kraft', detail: 'Quelle' }, { label: 'Sperre', detail: 'bei Fund' }]} />;
}

export function UnterfuellungSchema({ className }: UnterfuellungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Unterfuellung und kurze Teile als Fliessende erkennen" desc="Fliessweg, Schmelze, Fuellgrad, Anschnitt und Temperatur helfen bei Unterfuellung." caption="Unterfuellung zeigt sich als unvollstaendig gefuelltes Bauteil. Die Ursache kann bei Materialfluss, Temperatur, Druck, Entlueftung oder Werkzeug liegen." merker="nicht als Gutteil mischen" karten={[{ label: 'Kurz', detail: 'Teil' }, { label: 'Fliess.', detail: 'Ende' }, { label: 'Anschn.', detail: 'Weg' }, { label: 'Temp.', detail: 'Quelle' }, { label: 'Druck', detail: 'klaeren' }]} />;
}

export function FliessnaehteBindenaehteSchema({ className }: FliessnaehteBindenaehteSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Fliessnaehte und Bindenaehte an Fliessfronten deuten" desc="Fliessfront, Hindernis, Temperatur, Festigkeit und Sichtpruefung erklaeren Nahtbildung." caption="Wenn zwei Fliessfronten zusammentreffen, kann eine sichtbare oder festigkeitsrelevante Naht entstehen. Lage und Bewertung kommen aus Zeichnung, Muster oder Pruefplan." karten={[{ label: 'Front', detail: 'trifft' }, { label: 'Naht', detail: 'Linie' }, { label: 'Temp.', detail: 'Einfluss' }, { label: 'Festig.', detail: 'Risiko' }, { label: 'Plan', detail: 'lesen' }]} />;
}

export function SchlierenFeuchtigkeitSchema({ className }: SchlierenFeuchtigkeitSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Schlieren und Feuchtigkeitsschlieren als Materialhinweis pruefen" desc="Oberflaeche, Feuchte, Trocknung, Materialcharge und Datenblatt strukturieren Schlieren." caption="Schlieren sind sichtbare Streifen oder Wolken im Teil. Bei Feuchteverdacht werden Material, Trocknung und Freigabe nach Datenblatt geprueft." karten={[{ label: 'Streif.', detail: 'sehen' }, { label: 'Feuchte', detail: 'Verd.' }, { label: 'Trockn.', detail: 'Quelle' }, { label: 'Charge', detail: 'trace' }, { label: 'Daten', detail: 'lesen' }]} />;
}

export function VerbrennungDieseleffektSchema({ className }: VerbrennungDieseleffektSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Verbrennungen und Dieseleffekt an Brandstellen erkennen" desc="Dunkle Stelle, eingeschlossene Luft, Entlueftung, Temperatur und Meldung ordnen Brandfehler." caption="Dunkle oder verbrannte Stellen koennen durch ueberhitzte Schmelze oder komprimierte Luft am Fliessende entstehen. Die Ursache wird nicht kosmetisch verdeckt." merker="Brandstelle melden" karten={[{ label: 'Dunkel', detail: 'Fund' }, { label: 'Luft', detail: 'ein' }, { label: 'Entl.', detail: 'Werkz.' }, { label: 'Temp.', detail: 'Quelle' }, { label: 'Meld.', detail: 'Doku' }]} />;
}

export function VerzugKunststoffSchema({ className }: VerzugKunststoffSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Verzug durch Schwindung und Orientierung eingrenzen" desc="Formabweichung, Kuehlung, Schwindung, Orientierung und Lagerung helfen bei Verzug." caption="Verzug bedeutet, dass das Teil nach dem Entformen nicht die geforderte Form haelt. Ursache koennen ungleichmaessige Abkuehlung, Wanddicken oder Molekuelorientierung sein." karten={[{ label: 'Form', detail: 'krumm' }, { label: 'Kuehl.', detail: 'gleich?' }, { label: 'Schwind.', detail: 'Urs.' }, { label: 'Orient.', detail: 'Faser' }, { label: 'Lager', detail: 'pruefen' }]} />;
}

export function DelaminationSchema({ className }: DelaminationSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Delamination als Schichttrennung am Kunststoffteil erkennen" desc="Schicht, Abloesung, Materialmix, Feuchte und Sperrung ordnen Delamination." caption="Delamination zeigt sich als abloesende Schichten oder schuppige Oberflaeche. Materialvertraeglichkeit, Feuchte und Verunreinigung werden geprueft." karten={[{ label: 'Schicht', detail: 'loest' }, { label: 'Mix', detail: 'Material' }, { label: 'Feuchte', detail: 'Einfl.' }, { label: 'Fremd.', detail: 'pruefen' }, { label: 'Sperre', detail: 'klar' }]} />;
}

export function SchwarzePunkteSchema({ className }: SchwarzePunkteSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Schwarze Punkte als Verschmutzung oder Materialabbau pruefen" desc="Punkte, Schnecke, Zylinder, Materialabbau, Fremdstoff und Reinigung bilden die Ursachenfelder." caption="Schwarze Punkte koennen aus verbranntem Material, Fremdstoff oder verschmutztem Prozessraum stammen. Betroffene Teile werden getrennt und die Ursache wird systematisch gesucht." karten={[{ label: 'Punkt', detail: 'sehen' }, { label: 'Abbau', detail: 'Hitze' }, { label: 'Fremd.', detail: 'Stoff' }, { label: 'Reinig.', detail: 'Plan' }, { label: 'Teile', detail: 'sperren' }]} />;
}

export function FarbabweichungSchema({ className }: FarbabweichungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Farbabweichungen mit Muster und Masterbatch vergleichen" desc="Farbton, Muster, Masterbatch, Dosierung und Materialcharge strukturieren Farbfehler." caption="Farbabweichung wird gegen Muster, Freigabe oder Kundenvorgabe bewertet. Ursache koennen Dosierung, Materialwechsel, Charge oder Restfarbe sein." karten={[{ label: 'Muster', detail: 'vergl.' }, { label: 'Farbe', detail: 'Ton' }, { label: 'Batch', detail: 'Dos.' }, { label: 'Charge', detail: 'trace' }, { label: 'Frei?', detail: 'klaer.' }]} />;
}

export function AngussAuswerfermarkenSchema({ className }: AngussAuswerfermarkenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Sichtbaren Anguss und Auswerfermarken sicher bewerten" desc="Angussrest, Auswerferstelle, Werkzeugspur, Musterfreigabe und Nacharbeit ordnen Sichtfehler." caption="Angussreste und Auswerfermarken sind werkzeugbedingte Spuren. Ob sie zulaessig sind, entscheidet die Zeichnung, das Muster oder die Freigabe." karten={[{ label: 'Anguss', detail: 'Rest' }, { label: 'Ausw.', detail: 'Marke' }, { label: 'Muster', detail: 'vergl.' }, { label: 'Nacharb.', detail: 'klaer.' }, { label: 'Doku', detail: 'Fund' }]} />;
}

export function MassabweichungKunststoffSchema({ className }: MassabweichungKunststoffSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Massabweichungen Kunststoff mit Schwindung und Prozess pruefen" desc="Soll, Ist, Schwindung, Kuehlung, Nachdruck und Messzeitpunkt helfen bei Massabweichung." caption="Kunststoffteile koennen nach dem Entformen weiter schrumpfen. Masspruefung braucht daher Vorgabe, Messzeitpunkt, Umgebung und Prozessbezug." merker="Messzeitpunkt beachten" karten={[{ label: 'Soll', detail: 'lesen' }, { label: 'Ist', detail: 'messen' }, { label: 'Schwind.', detail: 'Einfl.' }, { label: 'Zeit', detail: 'nach Entf.' }, { label: 'Proz.', detail: 'klaeren' }]} />;
}

export function Fehlerdiagnose5MSchema({ className }: Fehlerdiagnose5MSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Kunststofffehler mit 5M strukturiert diagnostizieren" desc="Material, Maschine, Methode, Mensch und Mitwelt ordnen Fehlerursachen vor Massnahmen." caption="Die 5M-Methode verhindert vorschnelle Einzelursachen. Erst werden die Ursachenfelder gesammelt, dann werden Pruefung und Massnahme nach Vorgabe festgelegt." merker="erst strukturieren, dann handeln" karten={[{ label: 'Mat.', detail: 'Charge' }, { label: 'Masch.', detail: 'Zust.' }, { label: 'Meth.', detail: 'Param.' }, { label: 'Mensch', detail: 'Ablauf' }, { label: 'Mitwelt', detail: 'Umfeld' }]} />;
}

export function SensorAktorSteuerungSchema({ className }: SensorAktorSteuerungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Sensor Aktor und Steuerung als Signalweg verstehen" desc="Sensor, Steuerung, Programm, Aktor und Rueckmeldung bilden den Grundablauf." caption="Ein Sensor erkennt einen Zustand, die Steuerung verarbeitet das Signal und ein Aktor fuehrt eine Aktion aus. So entsteht ein einfacher automatischer Ablauf." merker="Sensor meldet, Aktor handelt" karten={[{ label: 'Sensor', detail: 'erkennt' }, { label: 'Signal', detail: 'sendet' }, { label: 'Steuer.', detail: 'verarb.' }, { label: 'Aktor', detail: 'handelt' }, { label: 'Prozess', detail: 'reag.' }]} />;
}

export function SteuerungRegelungSchema({ className }: SteuerungRegelungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Steuerung und Regelung im Rueckmeldevergleich unterscheiden" desc="Vorgabe, Ablauf, Rueckmeldung, Vergleich und Korrektur trennen Steuerung von Regelung." caption="Eine Steuerung arbeitet einen Ablauf ab. Eine Regelung vergleicht Istwert und Sollwert und korrigiert fortlaufend die Stellgroesse." merker="Regelung vergleicht zurueck" karten={[{ label: 'Soll', detail: 'Vorgabe' }, { label: 'Ablauf', detail: 'steuern' }, { label: 'Ist', detail: 'messen' }, { label: 'Vergl.', detail: 'regeln' }, { label: 'Korr.', detail: 'stellen' }]} />;
}

export function SollIstStellgroesseSchema({ className }: SollIstStellgroesseSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Sollwert Istwert und Stellgroesse im Regelkreis zuordnen" desc="Sollwert, Istwert, Regler, Stellgroesse und Prozessgroesse bilden den einfachen Regelkreis." caption="Der Sollwert ist die Vorgabe, der Istwert der gemessene Zustand. Die Stellgroesse ist der Eingriff, mit dem der Prozess angepasst wird." karten={[{ label: 'Soll', detail: 'Ziel' }, { label: 'Ist', detail: 'Messung' }, { label: 'Diff.', detail: 'Abw.' }, { label: 'Stell.', detail: 'Eingriff' }, { label: 'Prozess', detail: 'wirkt' }]} />;
}

export function SpsGrundlagenSchema({ className }: SpsGrundlagenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="SPS als speicherprogrammierbare Steuerung einordnen" desc="Eingaenge, Programm, Zyklus, Ausgaenge und Maschine beschreiben die SPS-Grundaufgabe." caption="Eine SPS liest Eingangssignale, verarbeitet sie nach Programm und setzt Ausgaenge. Programme werden nur nach Freigabe oder durch befugte Personen geaendert." merker="SPS liest, verarbeitet, schaltet" karten={[{ label: 'Eing.', detail: 'lesen' }, { label: 'Prog.', detail: 'Logik' }, { label: 'Zyklus', detail: 'laufend' }, { label: 'Ausg.', detail: 'setzen' }, { label: 'Anlage', detail: 'bewegt' }]} />;
}

export function EingangAusgangSchema({ className }: EingangAusgangSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Eingang und Ausgang an der Steuerung sicher zuordnen" desc="Sensor, Eingang, SPS, Ausgang und Aktor werden als Signalrichtung gelesen." caption="Eingaenge bringen Signale in die Steuerung hinein. Ausgaenge geben Schaltbefehle an Aktoren, Anzeigen oder Ventile heraus." merker="Eingang rein, Ausgang raus" karten={[{ label: 'Sensor', detail: 'Signal' }, { label: 'Eing.', detail: 'rein' }, { label: 'SPS', detail: 'Logik' }, { label: 'Ausg.', detail: 'raus' }, { label: 'Aktor', detail: 'Aktion' }]} />;
}

export function UndOderVerriegelungSchema({ className }: UndOderVerriegelungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="UND ODER und Verriegelung als einfache Steuerlogik lesen" desc="Bedingung, UND, ODER, Freigabe, Sperre und Verriegelung strukturieren sichere Logik." caption="UND bedeutet: alle Bedingungen muessen stimmen. ODER bedeutet: eine passende Bedingung reicht. Eine Verriegelung verhindert gefaehrliche oder falsche Aktionen." merker="Verriegelung schuetzt Ablauf" karten={[{ label: 'UND', detail: 'alle' }, { label: 'ODER', detail: 'eine' }, { label: 'Frei', detail: 'ja' }, { label: 'Sperre', detail: 'nein' }, { label: 'Sicher', detail: 'Logik' }]} />;
}

export function EndschalterLichtschrankeSchema({ className }: EndschalterLichtschrankeSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Endschalter und Lichtschranke als Sensoren erkennen" desc="Position, Beruehrung, Lichtstrahl, Signal und Diagnose unterscheiden zwei Sensortypen." caption="Ein Endschalter erkennt haeufig eine mechanische Endlage. Eine Lichtschranke erkennt, ob ein Lichtweg frei oder unterbrochen ist." karten={[{ label: 'Ende', detail: 'Lage' }, { label: 'Kontakt', detail: 'mech.' }, { label: 'Licht', detail: 'Strahl' }, { label: 'Unterbr.', detail: 'Signal' }, { label: 'Pruef.', detail: 'melden' }]} />;
}

export function InduktivKapazitivSensorSchema({ className }: InduktivKapazitivSensorSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Induktive und kapazitive Sensoren nach Materialwirkung unterscheiden" desc="Metall, Nichtmetall, Schaltabstand, Einbau und Sensorflaeche helfen bei der Zuordnung." caption="Induktive Sensoren reagieren typisch auf Metall. Kapazitive Sensoren koennen auch andere Materialien erkennen, sind aber staerker von Einbau und Umgebung abhaengig." karten={[{ label: 'Indukt.', detail: 'Metall' }, { label: 'Kapaz.', detail: 'Material' }, { label: 'Abst.', detail: 'Quelle' }, { label: 'Einbau', detail: 'Umfeld' }, { label: 'Signal', detail: 'testen' }]} />;
}

export function TemperaturDrucksensorenSchema({ className }: TemperaturDrucksensorenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Temperatur und Drucksensoren als Prozesswerte einordnen" desc="Messstelle, Prozesswert, Einheit, Grenzwert, Signal und Reaktion strukturieren Sensorwerte." caption="Temperatur- und Drucksensoren liefern Prozesswerte. Bewertet wird gegen Vorgabe, Anzeige, Plausibilitaet und freigegebenen Reaktionsweg." merker="Wert nur mit Quelle bewerten" karten={[{ label: 'Messst.', detail: 'wo?' }, { label: 'Temp.', detail: 'Grad' }, { label: 'Druck', detail: 'bar' }, { label: 'Grenze', detail: 'Quelle' }, { label: 'Reakt.', detail: 'Plan' }]} />;
}

export function ElektromotorFrequenzumrichterSchema({ className }: ElektromotorFrequenzumrichterSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Elektromotor und Frequenzumrichter als Antriebskette verstehen" desc="Versorgung, Frequenzumrichter, Motor, Drehzahl, Last und Freigabe ordnen den Antrieb." caption="Der Frequenzumrichter kann die Motordrehzahl beeinflussen. Parameter, Drehrichtung und Grenzwerte werden nicht frei veraendert." merker="Antrieb nur nach Freigabe einstellen" karten={[{ label: 'Netz', detail: 'Versorg.' }, { label: 'FU', detail: 'stellt' }, { label: 'Motor', detail: 'dreht' }, { label: 'Last', detail: 'bewegt' }, { label: 'Frei.', detail: 'Quelle' }]} />;
}

export function DruckluftanlageSchema({ className }: DruckluftanlageSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Druckluftanlage vom Erzeugen bis zum Verbraucher ueberblicken" desc="Kompressor, Speicher, Aufbereitung, Leitung und Verbraucher bilden den Druckluftweg." caption="Eine Druckluftanlage erzeugt, speichert, bereitet und verteilt verdichtete Luft. Am Verbraucher wird daraus Bewegung, Spannen, Blasen oder Schalten." merker="Luftweg erst verfolgen" karten={[{ label: 'Komp.', detail: 'erzeugt' }, { label: 'Speich.', detail: 'puffert' }, { label: 'Aufber.', detail: 'reinigt' }, { label: 'Leitung', detail: 'fuehrt' }, { label: 'Verbr.', detail: 'arbeitet' }]} />;
}

export function WartungseinheitSchema({ className }: WartungseinheitSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Wartungseinheit als Luftaufbereitung sicher einordnen" desc="Filter, Druckregler, Anzeige, Kondensat und Oeler oder oelfreier Betrieb werden getrennt." caption="Die Wartungseinheit bereitet Druckluft fuer den Verbraucher vor. Filterung, Druckeinstellung und Kondensatkontrolle erfolgen nach Anlagenvorgabe." merker="Druckluft vor dem Verbraucher pruefen" karten={[{ label: 'Filter', detail: 'reinigt' }, { label: 'Regler', detail: 'stellt' }, { label: 'Anzeige', detail: 'lesen' }, { label: 'Wasser', detail: 'ablassen' }, { label: 'Oel?', detail: 'Vorgabe' }]} />;
}

export function VentileDrosselnSchema({ className }: VentileDrosselnSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Ventile und Drosseln im Pneumatikplan unterscheiden" desc="Wegeventil, Anschluss, Schaltstellung, Drossel und Rueckschlag strukturieren die Luftsteuerung." caption="Ventile bestimmen die Luftwege. Drosseln veraendern den Volumenstrom und damit Bewegungszeiten, werden aber nur nach Vorgabe eingestellt." merker="Ventil schaltet, Drossel dosiert" karten={[{ label: 'Ventil', detail: 'schaltet' }, { label: 'Wege', detail: 'lesen' }, { label: 'Stell.', detail: 'Position' }, { label: 'Dross.', detail: 'dosiert' }, { label: 'Quelle', detail: 'Einst.' }]} />;
}

export function EinfachwirkenderZylinderSchema({ className }: EinfachwirkenderZylinderSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Einfachwirkenden Zylinder nach Luft und Feder erklaeren" desc="Druckluftanschluss, Kolben, Ausfahrbewegung, Feder und Rueckhub bilden die Grundfunktion." caption="Beim einfachwirkenden Zylinder wirkt Druckluft meist nur in eine Richtung. Die Rueckbewegung erfolgt durch Feder, Gewicht oder aehnliche Rueckstellkraft." karten={[{ label: 'Luft', detail: 'eine Seite' }, { label: 'Kolben', detail: 'faehrt' }, { label: 'Feder', detail: 'zurueck' }, { label: 'Hub', detail: 'begrenzt' }, { label: 'Last', detail: 'passen' }]} />;
}

export function DoppeltwirkenderZylinderSchema({ className }: DoppeltwirkenderZylinderSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Doppeltwirkenden Zylinder mit zwei Arbeitsraeumen verstehen" desc="Ein Luftanschluss faehrt aus, der andere faehrt ein; Ventil und Drossel bestimmen die Bewegung." caption="Beim doppeltwirkenden Zylinder wird Luft abwechselnd auf beide Seiten des Kolbens gegeben. Dadurch kann der Zylinder aktiv aus- und einfahren." merker="zwei Anschluesse, zwei Bewegungen" karten={[{ label: 'A+', detail: 'aus' }, { label: 'A-', detail: 'ein' }, { label: 'Ventil', detail: 'wechselt' }, { label: 'Dross.', detail: 'Tempo' }, { label: 'Ende', detail: 'Signal' }]} />;
}

export function HydraulikGrundlagenSchema({ className }: HydraulikGrundlagenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Hydraulik als Kraftuebertragung mit Druck und Oel verstehen" desc="Oel, Pumpe, Ventil, Zylinder, Flaeche und Kraft gehoeren zum Hydraulikgrundprinzip." caption="Hydraulik nutzt Fluessigkeit zur Kraftuebertragung. Druck wirkt auf eine Flaeche; die daraus entstehende Kraft wird nur mit freigegebenen Werten berechnet." merker="F = p mal A" karten={[{ label: 'Pumpe', detail: 'foerdert' }, { label: 'Oel', detail: 'uebertr.' }, { label: 'Druck', detail: 'p' }, { label: 'Flaeche', detail: 'A' }, { label: 'Kraft', detail: 'F' }]} />;
}

export function WartungInspektionInstandsetzungSchema({ className }: WartungInspektionInstandsetzungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Wartung Inspektion und Instandsetzung sicher unterscheiden" desc="Erhalten, feststellen, wiederherstellen, dokumentieren und freigeben trennen die Begriffe." caption="Wartung erhaelt den Sollzustand, Inspektion stellt den Istzustand fest, Instandsetzung stellt die Funktion wieder her. Im Betrieb werden die Schritte dokumentiert und freigegeben." merker="erhalten, feststellen, wiederherstellen" karten={[{ label: 'Wart.', detail: 'erhalten' }, { label: 'Insp.', detail: 'festst.' }, { label: 'Inst.', detail: 'repar.' }, { label: 'Doku', detail: 'Nachweis' }, { label: 'Frei', detail: 'Start' }]} />;
}

export function VorbeugendeInstandhaltungSchema({ className }: VorbeugendeInstandhaltungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Vorbeugende Instandhaltung vor dem Ausfall planen" desc="Intervall, Zustand, Pruefpunkt, Risiko und Termin helfen, Ausfaelle zu vermeiden." caption="Vorbeugende Instandhaltung reagiert nicht erst nach dem Stillstand. Sie nutzt Plan, Zustand oder Risiko, um Verschleiss und Stoerungen frueh zu erkennen." merker="vor Ausfall handeln" karten={[{ label: 'Plan', detail: 'wann' }, { label: 'Zust.', detail: 'Signal' }, { label: 'Punkt', detail: 'wo' }, { label: 'Risiko', detail: 'hoch?' }, { label: 'Termin', detail: 'fix' }]} />;
}

export function SchmierungSchmierplanSchema({ className }: SchmierungSchmierplanSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Schmierung und Schmierplan als Vorgabe lesen" desc="Schmierstelle, Schmierstoff, Menge, Intervall und Nachweis bilden den Schmierplan." caption="Der Schmierplan legt fest, wo, womit, wie viel und wann geschmiert wird. Schmierstoffe werden nicht nach Farbe oder Gefuehl ersetzt." merker="Schmierplan ist Quelle" karten={[{ label: 'Stelle', detail: 'wo' }, { label: 'Stoff', detail: 'womit' }, { label: 'Menge', detail: 'Quelle' }, { label: 'Takt', detail: 'wann' }, { label: 'Doku', detail: 'erled.' }]} />;
}

export function VerschleissReibungSchema({ className }: VerschleissReibungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Verschleiss und Reibung als Ursache einordnen" desc="Kontakt, Bewegung, Schmierung, Waerme und Spiel zeigen typische Verschleissursachen." caption="Reibung entsteht bei Kontakt und Bewegung. Fehlende Schmierung, Schmutz, Ueberlast oder falsche Einstellung koennen Verschleiss beschleunigen." karten={[{ label: 'Kontakt', detail: 'reibt' }, { label: 'Beweg.', detail: 'laufend' }, { label: 'Schmier.', detail: 'Film' }, { label: 'Waerme', detail: 'Signal' }, { label: 'Spiel', detail: 'Folge' }]} />;
}

export function TemperaturSchwingungGeraeuschSchema({ className }: TemperaturSchwingungGeraeuschSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Temperatur Schwingung und Geraeusch als Symptome erkennen" desc="Waerme, Vibration, Laufgeraeusch, Trend und Meldung strukturieren Maschinenzeichen." caption="Maschinen zeigen viele Stoerungen zuerst als Symptom: ungewoehnliche Temperatur, Schwingung oder Geraeusch. Bewertet wird gegen Erfahrung, Vorgabe und Messstelle." merker="Symptom frueh melden" karten={[{ label: 'Temp.', detail: 'warm?' }, { label: 'Schwing.', detail: 'vibriert' }, { label: 'Ton', detail: 'anders' }, { label: 'Trend', detail: 'mehr?' }, { label: 'Meld.', detail: 'Doku' }]} />;
}

export function LeckageErkennenSchema({ className }: LeckageErkennenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Leckage erkennen und sicher melden" desc="Medium, Austrittsstelle, Tropfen, Druckverlust, Sperrung und Meldung bilden den Reaktionsweg." caption="Leckagen sind nicht nur Schmutz. Oel, Luft, Wasser oder Kuehlschmierstoff koennen Sicherheit, Umwelt, Qualitaet und Anlagenfunktion beeinflussen." merker="Leckage nicht ueberwischen" karten={[{ label: 'Medium', detail: 'was?' }, { label: 'Stelle', detail: 'wo?' }, { label: 'Spur', detail: 'sehen' }, { label: 'Druck', detail: 'sink?' }, { label: 'Meld.', detail: 'sofort' }]} />;
}

export function LagerfehlerSchema({ className }: LagerfehlerSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Lagerfehler an Laufbild und Symptom einordnen" desc="Lagerstelle, Geraeusch, Waerme, Spiel, Pitting und Schmierung helfen bei der Diagnose." caption="Lagerfehler zeigen sich oft durch Geraeusch, Waerme, Schwingung oder Spiel. Die Bewertung erfolgt nicht durch Zerlegen nach Gefuehl, sondern ueber Freigabe und Diagnoseweg." karten={[{ label: 'Lager', detail: 'Stelle' }, { label: 'Ton', detail: 'rauh' }, { label: 'Waerme', detail: 'hoch' }, { label: 'Spiel', detail: 'pruef.' }, { label: 'Pitting', detail: 'Schaden' }]} />;
}

export function UnwuchtFehlausrichtungSchema({ className }: UnwuchtFehlausrichtungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Unwucht und Fehlausrichtung als Laufproblem trennen" desc="Rotation, Masseverteilung, Wellenflucht, Kupplung, Schwingung und Meldung strukturieren Laufprobleme." caption="Unwucht betrifft die Masseverteilung eines rotierenden Teils. Fehlausrichtung betrifft die Lage von Wellen, Kupplungen oder Baugruppen zueinander." karten={[{ label: 'Rot.', detail: 'dreht' }, { label: 'Masse', detail: 'unwucht' }, { label: 'Flucht', detail: 'ausr.' }, { label: 'Kuppl.', detail: 'pruef.' }, { label: 'Schwing.', detail: 'Signal' }]} />;
}

export function StoerungFehlerUrsacheWirkungSchema({ className }: StoerungFehlerUrsacheWirkungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Stoerung Fehler Ursache und Wirkung sauber trennen" desc="Symptom, Fehlerbild, Ursache, Wirkung und Massnahme verhindern vorschnelle Schluesse." caption="Eine Stoerung ist die bemerkte Abweichung. Der Fehler ist das konkrete Problem, die Ursache erklaert das Warum und die Wirkung beschreibt die Folge im Prozess." merker="nicht Symptom mit Ursache verwechseln" karten={[{ label: 'Stoer.', detail: 'bemerkt' }, { label: 'Fehler', detail: 'Problem' }, { label: 'Urs.', detail: 'Warum' }, { label: 'Wirk.', detail: 'Folge' }, { label: 'Massn.', detail: 'Plan' }]} />;
}

export function FiveWhySchema({ className }: FiveWhySchemaProps) {
  return <QualitaetSchemaBase className={className} title="5-Why als Warum-Kette zur Grundursache nutzen" desc="Problem, Warum-Fragen, Beleg, Grundursache und Massnahme fuehren von Symptom zu Ursache." caption="5-Why fragt mehrfach nach dem Warum. Jede Antwort braucht einen belegbaren Bezug, sonst wird aus der Methode nur Raten." merker="Warum mit Beleg" karten={[{ label: 'Problem', detail: 'klar' }, { label: 'Warum1', detail: 'naechst' }, { label: 'Beleg', detail: 'pruefen' }, { label: 'Grund', detail: 'Urs.' }, { label: 'Massn.', detail: 'wirkt' }]} />;
}

export function IshikawaDiagrammSchema({ className }: IshikawaDiagrammSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Ishikawa-Diagramm mit Ursachenfeldern strukturieren" desc="Problemkopf, 5M-Felder, moegliche Ursachen, Pruefung und Prioritaet ordnen die Analyse." caption="Das Ishikawa-Diagramm sammelt moegliche Ursachen in Feldern wie Mensch, Maschine, Material, Methode und Mitwelt. Danach werden Ursachen geprueft, nicht nur gesammelt." merker="Ursachenfelder erst ordnen" karten={[{ label: 'Kopf', detail: 'Problem' }, { label: '5M', detail: 'Felder' }, { label: 'Urs.', detail: 'ideen' }, { label: 'Pruef.', detail: 'Beleg' }, { label: 'Prio', detail: 'naechst' }]} />;
}

export function StoerungDokumentierenSchema({ className }: StoerungDokumentierenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Stoerung so dokumentieren dass sie verwertbar bleibt" desc="Zeit, Anlage, Symptom, Massnahme, Freigabe und Ergebnis gehoeren in die Stoerungsdokumentation." caption="Eine Stoerungsdokumentation muss spaeter nachvollziehbar machen, was passiert ist, was geprueft wurde, wer entschieden hat und ob die Anlage wieder freigegeben wurde." karten={[{ label: 'Zeit', detail: 'wann' }, { label: 'Anlage', detail: 'wo' }, { label: 'Sympt.', detail: 'was' }, { label: 'Massn.', detail: 'getan' }, { label: 'Frei', detail: 'wer' }]} />;
}

export function SichereFehlersucheSchema({ className }: SichereFehlersucheSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Sichere Fehlersuche vor Technik-Eingriff planen" desc="Gefahr, Freischalten, Restenergie, Befugnis, Pruefung und Meldung bilden den sicheren Ablauf." caption="Fehlersuche darf nicht zu einem unsicheren Eingriff werden. Vor dem Oeffnen, Einstellen oder Testen werden Gefahrstellen, Restenergie und Befugnis geklaert." merker="erst sichern, dann suchen" karten={[{ label: 'Gefahr', detail: 'finden' }, { label: 'Frei', detail: 'schalt.' }, { label: 'Rest', detail: 'Energie' }, { label: 'Befug.', detail: 'wer' }, { label: 'Meld.', detail: 'Doku' }]} />;
}

export function VerbesserungNachStoerungSchema({ className }: VerbesserungNachStoerungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Verbesserung nach Stoerung als KVP-Schleife verstehen" desc="Stoerung, Ursache, Massnahme, Wirksamkeit und Standard bilden eine einfache Verbesserungslogik." caption="Nach einer Stoerung endet die Arbeit nicht immer mit dem Neustart. Gute Betriebe pruefen, ob die Ursache beseitigt wurde und ob eine Verbesserung in Standard oder Plan eingeht." karten={[{ label: 'Stoer.', detail: 'Fund' }, { label: 'Urs.', detail: 'klar' }, { label: 'Massn.', detail: 'setzen' }, { label: 'Wirk.', detail: 'pruefen' }, { label: 'Stand.', detail: 'lernen' }]} />;
}

/**
 * Zeigt den Fertigungsauftrag als Startpunkt der Planung.
 */
export function FertigungsauftragSchema({ className }: FertigungsauftragSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Fertigungsauftrag mit Teil Menge Termin und Vorgabe lesen" desc="Teil, Zeichnung, Menge, Termin und Rueckfrage bilden den sicheren Start in die Planung." caption="Der Fertigungsauftrag beschreibt, was hergestellt werden soll. Erst wenn Teil, Menge, Termin, Material und Vorgaben klar sind, kann die Arbeit geplant werden." merker="Auftrag vor Start klaeren" karten={[{ label: 'Teil', detail: 'was?' }, { label: 'Menge', detail: 'wie viel?' }, { label: 'Termin', detail: 'bis wann?' }, { label: 'Vorg.', detail: 'Quelle' }, { label: 'Klaer.', detail: 'offen?' }]} />;
}

/**
 * Zeigt die Arbeitsfolge als begruendete Reihenfolge.
 */
export function ArbeitsfolgePlanenSchema({ className }: ArbeitsfolgePlanenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Arbeitsfolge nach Vorgabe und Abhaengigkeit planen" desc="Arbeitsgaenge, Reihenfolge, Betriebsmittel, Pruefschritt und Freigabe strukturieren die Planung." caption="Eine Arbeitsfolge ist mehr als eine Liste. Sie muss technisch sinnvoll sein, Vorgaben einhalten und Pruefschritte an der richtigen Stelle enthalten." karten={[{ label: 'Gang', detail: 'Schritt' }, { label: 'Reihenf.', detail: 'Plan' }, { label: 'Mittel', detail: 'bereit' }, { label: 'Pruef.', detail: 'wann?' }, { label: 'Frei', detail: 'klar' }]} />;
}

/**
 * Zeigt Stueckliste und Materialbedarf als Mengenbezug.
 */
export function StuecklisteMaterialbedarfSchema({ className }: StuecklisteMaterialbedarfSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Stueckliste und Materialbedarf aus Menge und Position ableiten" desc="Position, Menge je Teil, Auftragsmenge, Bedarf und Reserve werden sauber getrennt." caption="Der Materialbedarf ergibt sich aus Stueckliste und Auftragsmenge. Zuschlag, Ausschuss oder Reserve duerfen nur nach freigegebener Vorgabe ergaenzt werden." merker="Menge mal Stuecklistenbedarf" karten={[{ label: 'Pos.', detail: 'finden' }, { label: 'Menge', detail: 'je Teil' }, { label: 'Los', detail: 'Auftrag' }, { label: 'Bedarf', detail: 'rechnen' }, { label: 'Quelle', detail: 'Zuschlag' }]} />;
}

/**
 * Zeigt Personal- und Maschinenbedarf als Ressourcenplanung.
 */
export function PersonalMaschinenbedarfSchema({ className }: PersonalMaschinenbedarfSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Personal und Maschinenbedarf passend zum Auftrag planen" desc="Arbeitsgang, Maschine, Personal, Befugnis und Verfuegbarkeit werden zusammen geprueft." caption="Ressourcenplanung klaert, welche Maschine und welche befugte Person fuer welchen Arbeitsgang gebraucht werden. Ohne Ressource bleibt der Plan theoretisch." karten={[{ label: 'Gang', detail: 'Aufgabe' }, { label: 'Masch.', detail: 'passt?' }, { label: 'Pers.', detail: 'befugt' }, { label: 'Zeit', detail: 'frei?' }, { label: 'Plan', detail: 'abst.' }]} />;
}

/**
 * Zeigt Maschinenbelegung und Kapazitaet als Zeitfenster.
 */
export function MaschinenbelegungKapazitaetSchema({ className }: MaschinenbelegungKapazitaetSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Maschinenbelegung und Kapazitaet im Zeitfenster pruefen" desc="Verfuegbare Zeit, Auftrag, Ruesten, Laufzeit und Konflikt zeigen die Belegung." caption="Kapazitaet bedeutet: Wie viel nutzbare Zeit oder Leistung steht wirklich zur Verfuegung? Belegung zeigt, welche Auftraege diese Kapazitaet bereits binden." merker="frei ist nicht gleich verfuegbar" karten={[{ label: 'Kal.', detail: 'Fenster' }, { label: 'Ruest.', detail: 'Zeit' }, { label: 'Lauf', detail: 'Dauer' }, { label: 'Konfl.', detail: 'sehen' }, { label: 'Plan', detail: 'anpass.' }]} />;
}

/**
 * Zeigt Taktzeit und Zykluszeit im Unterschied.
 */
export function TaktzeitZykluszeitSchema({ className }: TaktzeitZykluszeitSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Taktzeit und Zykluszeit fuer Ausbringung unterscheiden" desc="Kundenbedarf, verfuegbare Zeit, Prozesszyklus, Stueckzahl und Vergleich bilden die Zeitlogik." caption="Taktzeit beschreibt, wie schnell ein Teil gebraucht wird. Zykluszeit beschreibt, wie lange der Prozess fuer ein Teil oder einen Zyklus wirklich braucht." merker="Takt ist Bedarf, Zyklus ist Prozess" karten={[{ label: 'Bedarf', detail: 'Kunde' }, { label: 'Zeit', detail: 'verfueg.' }, { label: 'Takt', detail: 'Soll' }, { label: 'Zyklus', detail: 'Ist' }, { label: 'Vergl.', detail: 'Risiko' }]} />;
}

/**
 * Zeigt Durchlaufzeit als Gesamtweg eines Auftrags.
 */
export function DurchlaufzeitSchema({ className }: DurchlaufzeitSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Durchlaufzeit vom Auftragseingang bis zur Fertigmeldung lesen" desc="Warten, Ruesten, Bearbeiten, Pruefen und Transport ergeben die Durchlaufzeit." caption="Durchlaufzeit ist die gesamte Zeit, die ein Auftrag durch den Betrieb laeuft. Sie enthaelt oft Warte- und Liegezeiten, nicht nur reine Bearbeitung." karten={[{ label: 'Warten', detail: 'vorher' }, { label: 'Ruest.', detail: 'bereit' }, { label: 'Bearb.', detail: 'machen' }, { label: 'Pruef.', detail: 'sicher' }, { label: 'Fertig', detail: 'melden' }]} />;
}

/**
 * Zeigt Ruestzeit und Bearbeitungszeit als getrennte Zeitanteile.
 */
export function RuestzeitBearbeitungszeitSchema({ className }: RuestzeitBearbeitungszeitSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Ruestzeit und Bearbeitungszeit fuer Gesamtzeit trennen" desc="Vorbereiten, Umstellen, Bearbeiten, Nebenzeit und Menge ergeben den Zeitbedarf." caption="Ruestzeit faellt fuer das Einrichten oder Umstellen an. Bearbeitungszeit faellt fuer die eigentliche Herstellung an und kann sich mit der Menge vervielfachen." merker="Ruesten einmal, Bearbeiten je Menge" karten={[{ label: 'Ruest.', detail: 'einmal' }, { label: 'Start', detail: 'bereit' }, { label: 'Bearb.', detail: 'je Teil' }, { label: 'Menge', detail: 'mal' }, { label: 'Ges.', detail: 'planen' }]} />;
}

/**
 * Zeigt Stillstandszeit als Verlustzeit in der Planung.
 */
export function StillstandszeitSchema({ className }: StillstandszeitSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Stillstandszeit als Planungsrisiko und Verlustzeit bewerten" desc="Geplanter Stopp, Stoerung, Ausfall, Ursache und Rueckmeldung trennen Stillstandszeit." caption="Stillstand kann geplant sein, zum Beispiel Ruesten oder Wartung, oder ungeplant durch Stoerung. Fuer Planung und OEE muss die Ursache sauber dokumentiert werden." merker="Stillstand mit Ursache" karten={[{ label: 'Stop', detail: 'wann?' }, { label: 'Plan?', detail: 'ja/nein' }, { label: 'Urs.', detail: 'warum' }, { label: 'Dauer', detail: 'Zeit' }, { label: 'Doku', detail: 'melden' }]} />;
}

/**
 * Zeigt Liefertermin und Losgroesse als Planungsentscheidung.
 */
export function LieferterminLosgroesseSchema({ className }: LieferterminLosgroesseSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Liefertermin und Losgroesse gemeinsam gegen Kapazitaet pruefen" desc="Termin, Losgroesse, Material, Kapazitaet und Risiko entscheiden ueber die Planbarkeit." caption="Ein Termin ist nur belastbar, wenn Losgroesse, Material, Maschine, Personal und Puffer zusammenpassen. Bei Risiko wird frueh gemeldet." karten={[{ label: 'Termin', detail: 'Datum' }, { label: 'Los', detail: 'Menge' }, { label: 'Mat.', detail: 'bereit?' }, { label: 'Kap.', detail: 'reicht?' }, { label: 'Risiko', detail: 'melden' }]} />;
}

/**
 * Zeigt Bestand und Mindestbestand als Lagergrenzen.
 */
export function BestandMindestbestandSchema({ className }: BestandMindestbestandSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Bestand und Mindestbestand fuer Materialverfuegbarkeit pruefen" desc="Istbestand, Mindestbestand, Verbrauch, Auftrag und Meldung strukturieren den Lagerblick." caption="Bestand zeigt, was aktuell verfuegbar ist. Mindestbestand ist eine Untergrenze, damit Material nicht erst beim leeren Fach auffaellt." merker="Bestand gegen Grenze pruefen" karten={[{ label: 'Ist', detail: 'zaehlen' }, { label: 'Min.', detail: 'Grenze' }, { label: 'Verbr.', detail: 'Trend' }, { label: 'Auftr.', detail: 'Bedarf' }, { label: 'Meld.', detail: 'frueh' }]} />;
}

/**
 * Zeigt Meldebestand und Sicherheitsbestand als Nachbestelllogik.
 */
export function MeldebestandSicherheitsbestandSchema({ className }: MeldebestandSicherheitsbestandSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Meldebestand und Sicherheitsbestand als Nachbestellpunkt lesen" desc="Bestand, Verbrauch, Lieferzeit, Sicherheitsbestand und Bestellung bilden den Meldebestand." caption="Meldebestand ist der Punkt, an dem Nachschub ausgeloest wird. Sicherheitsbestand puffert Unsicherheit bei Verbrauch, Lieferzeit oder Stoerung." merker="Melden bevor leer" karten={[{ label: 'Best.', detail: 'aktuell' }, { label: 'Verbr.', detail: 'sinkt' }, { label: 'Liefer.', detail: 'Zeit' }, { label: 'Sicher.', detail: 'Puffer' }, { label: 'Bestell.', detail: 'ausloes.' }]} />;
}

/**
 * Zeigt FIFO als Reihenfolge fuer Material und Chargen.
 */
export function FifoSchema({ className }: FifoSchemaProps) {
  return <QualitaetSchemaBase className={className} title="FIFO als zuerst rein zuerst raus im Lager anwenden" desc="Eingang, Charge, Lagerplatz, Entnahme und Rueckverfolgung sichern die FIFO-Reihenfolge." caption="FIFO verhindert, dass altes Material liegen bleibt, waehrend neues zuerst verbraucht wird. Besonders bei Chargen, Haltbarkeit und Materialwechseln ist die Reihenfolge wichtig." merker="aelteste freigegebene Charge zuerst" karten={[{ label: 'Eing.', detail: 'Datum' }, { label: 'Charge', detail: 'ID' }, { label: 'Regal', detail: 'Platz' }, { label: 'Entn.', detail: 'alt' }, { label: 'Trace', detail: 'Doku' }]} />;
}

/**
 * Zeigt Kanban als Pull-Prinzip mit Karten.
 */
export function KanbanGrundprinzipSchema({ className }: KanbanGrundprinzipSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Kanban-Grundprinzip als Pull-System mit Karte verstehen" desc="Verbrauch, Karte, Nachschub, Menge und Regelkreis bilden das einfache Kanban-Prinzip." caption="Kanban startet Nachschub durch Verbrauchssignal. Die Karte oder der Behaelter ist kein Zettel fuer spaeter, sondern Teil eines geregelten Materialflusses." merker="Verbrauch zieht Nachschub" karten={[{ label: 'Verbr.', detail: 'nimmt' }, { label: 'Karte', detail: 'Signal' }, { label: 'Nachsch.', detail: 'fuellt' }, { label: 'Menge', detail: 'fest' }, { label: 'Kreis', detail: 'stabil' }]} />;
}

/**
 * Zeigt Wertschoepfung und Verschwendung als Prozessbewertung.
 */
export function WertschoepfungVerschwendungSchema({ className }: WertschoepfungVerschwendungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Wertschoepfung und Verschwendung im Prozessband unterscheiden" desc="Kunde, Arbeitsschritt, Nutzen, Wartezeit und Suche trennen wertschoepfende von verschwenderischen Taetigkeiten." caption="Wertschoepfung veraendert das Produkt so, dass der Kunde es wirklich braucht. Verschwendung kostet Zeit, Material oder Bewegung, ohne Nutzen zu schaffen." merker="Nutzen oder Verschwendung?" karten={[{ label: 'Kunde', detail: 'Nutzen?' }, { label: 'Schritt', detail: 'bewerten' }, { label: 'Wert', detail: 'nutzen' }, { label: 'Warten', detail: 'Verlust' }, { label: 'Suche', detail: 'Verlust' }]} />;
}

/**
 * Zeigt 5S als Arbeitsplatzstandard.
 */
export function FuenfSWiederholenSchema({ className }: FuenfSWiederholenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="5S als wiederholbaren Arbeitsplatzstandard anwenden" desc="Sortieren, Systematisieren, Saubern, Standardisieren und Selbstdisziplin halten den Arbeitsplatz stabil." caption="5S ist kein einmaliges Aufraeumen. Der Nutzen entsteht, wenn Ordnung, Standard und Kontrolle im Alltag erhalten bleiben." merker="Ordnung taeglich halten" karten={[{ label: '1S', detail: 'sortieren' }, { label: '2S', detail: 'ordnen' }, { label: '3S', detail: 'saubern' }, { label: '4S', detail: 'Standard' }, { label: '5S', detail: 'halten' }]} />;
}

/**
 * Zeigt KVP im Team als Verbesserungskreis.
 */
export function KvpImTeamSchema({ className }: KvpImTeamSchemaProps) {
  return <QualitaetSchemaBase className={className} title="KVP im Team als Verbesserungskreis verstehen" desc="Problem, Vorschlag, Massnahme, Wirksamkeit und Standard verbinden Team und Verbesserung." caption="KVP im Team bedeutet: Probleme sichtbar machen, gemeinsam bewerten, Massnahmen festlegen und den Erfolg pruefen. Ohne Standardisierung bleibt Verbesserung Zufall." merker="Vorschlag, Massnahme, Standard" karten={[{ label: 'Problem', detail: 'sehen' }, { label: 'Idee', detail: 'Team' }, { label: 'Massn.', detail: 'planen' }, { label: 'Wirk.', detail: 'pruefen' }, { label: 'Stand.', detail: 'halten' }]} />;
}


export interface OeeUeberblickenSchemaProps {
  className?: string;
}

export function OeeUeberblickenSchema({ className }: OeeUeberblickenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="OEE als Kreis aus drei Faktoren ueberblicken" desc="Verfuegbarkeit, Leistungsgrad und Qualitaetsrate ergeben gemeinsam die OEE." caption="OEE verbindet Laufzeit, Ausbringung und Gutanteil. Jeder Faktor braucht belastbare Betriebsdaten." merker="drei Faktoren, ein Gesamtwert" karten={[{ label: 'Verf.', detail: 'Laufzeit' }, { label: 'Leist.', detail: 'Tempo' }, { label: 'Qual.', detail: 'Gutteil' }, { label: 'OEE', detail: 'Produkt' }, { label: 'Quelle', detail: 'Daten' }]} />;
}


export interface VerfuegbarkeitBerechnenSchemaProps {
  className?: string;
}

export function VerfuegbarkeitBerechnenSchema({ className }: VerfuegbarkeitBerechnenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Verfuegbarkeit aus Laufzeit und Planzeit berechnen" desc="Planzeit, Laufzeit, Stillstand, Quotient und Quelle bilden die Verfuegbarkeit." caption="Verfuegbarkeit = Laufzeit geteilt durch geplante Zeit. Stillstandsarten muessen dokumentiert sein." merker="V = Lauf / Plan" karten={[{ label: 'Plan', detail: 'Zeit' }, { label: 'Lauf', detail: 'Zeit' }, { label: 'Stop', detail: 'Stillst.' }, { label: 'V', detail: 'Quotient' }, { label: 'Quelle', detail: 'Daten' }]} />;
}


export interface LeistungsgradBerechnenSchemaProps {
  className?: string;
}

export function LeistungsgradBerechnenSchema({ className }: LeistungsgradBerechnenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Leistungsgrad aus Istleistung und Sollleistung berechnen" desc="Soll, Ist, Laufzeit, Quotient und Quelle strukturieren den Leistungsgrad." caption="Leistungsgrad = Istleistung / Sollleistung. Die Sollbasis muss freigegeben sein." merker="L = Ist / Soll" karten={[{ label: 'Soll', detail: 'Vorgabe' }, { label: 'Ist', detail: 'Ausbr.' }, { label: 'Lauf', detail: 'Bezug' }, { label: 'L', detail: 'Quotient' }, { label: 'Quelle', detail: 'Takt' }]} />;
}


export interface QualitaetsrateBerechnenSchemaProps {
  className?: string;
}

export function QualitaetsrateBerechnenSchema({ className }: QualitaetsrateBerechnenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Qualitaetsrate aus Gutmenge und Gesamtmenge berechnen" desc="Gesamtmenge, Gutteil, Ausschuss, Nacharbeit und Quotient bilden die Qualitaetsrate." caption="Qualitaetsrate = Gutmenge / Gesamtmenge. Nacharbeit wird nur nach Regel bewertet." merker="Q = Gut / Gesamt" karten={[{ label: 'Gesamt', detail: 'Menge' }, { label: 'Gut', detail: 'Anteil' }, { label: 'Aussch.', detail: 'Verlust' }, { label: 'Nacharb.', detail: 'Regel' }, { label: 'Q', detail: 'Quotient' }]} />;
}


export interface OeeVerbessernSchemaProps {
  className?: string;
}

export function OeeVerbessernSchema({ className }: OeeVerbessernSchemaProps) {
  return <QualitaetSchemaBase className={className} title="OEE ueber Verlustursache und Massnahme verbessern" desc="Faktor, Verlust, Ursache, Massnahme und Wirksamkeitspruefung bilden den Verbesserungskreis." caption="OEE steigt nur nachhaltig, wenn Verluste erkannt, Massnahmen geprueft und Standards gesetzt werden." merker="Verlust vor Aktion" karten={[{ label: 'Faktor', detail: 'finden' }, { label: 'Verlust', detail: 'groesster' }, { label: 'Urs.', detail: 'klaeren' }, { label: 'Massn.', detail: 'planen' }, { label: 'Wirk.', detail: 'pruefen' }]} />;
}


export interface RechenwegInPruefungenSchemaProps {
  className?: string;
}

export function RechenwegInPruefungenSchema({ className }: RechenwegInPruefungenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Rechenweg in Pruefungen als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Rechenweg in Pruefungen." caption="Rechenweg in Pruefungen wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Gegeben und gesucht markieren" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface GrundrechenartenSicherSchemaProps {
  className?: string;
}

export function GrundrechenartenSicherSchema({ className }: GrundrechenartenSicherSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Grundrechenarten sicher als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Grundrechenarten sicher." caption="Grundrechenarten sicher wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Rechenfehler vermeiden" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface DreisatzSchemaProps {
  className?: string;
}

export function DreisatzSchema({ className }: DreisatzSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Dreisatz als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Dreisatz." caption="Dreisatz wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Proportional rechnen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface ProzentrechnungSchemaProps {
  className?: string;
}

export function ProzentrechnungSchema({ className }: ProzentrechnungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Prozentrechnung als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Prozentrechnung." caption="Prozentrechnung wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Anteile berechnen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface EinheitenInAufgabenSchemaProps {
  className?: string;
}

export function EinheitenInAufgabenSchema({ className }: EinheitenInAufgabenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Einheiten in Aufgaben umrechnen als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Einheiten in Aufgaben umrechnen." caption="Einheiten in Aufgaben umrechnen wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Einheit vor Formel pruefen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface UmfangFlaecheRechteckSchemaProps {
  className?: string;
}

export function UmfangFlaecheRechteckSchema({ className }: UmfangFlaecheRechteckSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Umfang und Flaeche Rechteck als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Umfang und Flaeche Rechteck." caption="Umfang und Flaeche Rechteck wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Rechteck berechnen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface KreisumfangKreisflaecheSchemaProps {
  className?: string;
}

export function KreisumfangKreisflaecheSchema({ className }: KreisumfangKreisflaecheSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Kreisumfang und Kreisflaeche als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Kreisumfang und Kreisflaeche." caption="Kreisumfang und Kreisflaeche wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Kreiswerte berechnen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface VolumenQuaderZylinderSchemaProps {
  className?: string;
}

export function VolumenQuaderZylinderSchema({ className }: VolumenQuaderZylinderSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Volumen Quader und Zylinder als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Volumen Quader und Zylinder." caption="Volumen Quader und Zylinder wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Volumen berechnen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface MasseAusDichteSchemaProps {
  className?: string;
}

export function MasseAusDichteSchema({ className }: MasseAusDichteSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Masse aus Dichte als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Masse aus Dichte." caption="Masse aus Dichte wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Masse berechnen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface GeschwindigkeitUndZeitSchemaProps {
  className?: string;
}

export function GeschwindigkeitUndZeitSchema({ className }: GeschwindigkeitUndZeitSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Geschwindigkeit und Zeit als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Geschwindigkeit und Zeit." caption="Geschwindigkeit und Zeit wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Bewegungsaufgaben loesen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface DrehzahlSchnittgeschwindigkeitSchemaProps {
  className?: string;
}

export function DrehzahlSchnittgeschwindigkeitSchema({ className }: DrehzahlSchnittgeschwindigkeitSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Drehzahl und Schnittgeschwindigkeit als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Drehzahl und Schnittgeschwindigkeit." caption="Drehzahl und Schnittgeschwindigkeit wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Formeln umstellen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface VorschubBerechnenSchemaProps {
  className?: string;
}

export function VorschubBerechnenSchema({ className }: VorschubBerechnenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Vorschub berechnen als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Vorschub berechnen." caption="Vorschub berechnen wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Vorschubaufgaben loesen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface KraftUndDruckSchemaProps {
  className?: string;
}

export function KraftUndDruckSchema({ className }: KraftUndDruckSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Kraft und Druck als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Kraft und Druck." caption="Kraft und Druck wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Druckaufgaben loesen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface HydraulischerDruckSchemaProps {
  className?: string;
}

export function HydraulischerDruckSchema({ className }: HydraulischerDruckSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Hydraulischer Druck als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Hydraulischer Druck." caption="Hydraulischer Druck wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Kraftuebersetzung verstehen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface LeistungArbeitWirkungsgradSchemaProps {
  className?: string;
}

export function LeistungArbeitWirkungsgradSchema({ className }: LeistungArbeitWirkungsgradSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Leistung, Arbeit, Wirkungsgrad als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Leistung, Arbeit, Wirkungsgrad." caption="Leistung, Arbeit, Wirkungsgrad wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Energiebegriffe anwenden" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface UebersetzungsverhaeltnisSchemaProps {
  className?: string;
}

export function UebersetzungsverhaeltnisSchema({ className }: UebersetzungsverhaeltnisSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Uebersetzungsverhaeltnis als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Uebersetzungsverhaeltnis." caption="Uebersetzungsverhaeltnis wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Getriebe rechnen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface DrehmomentSchemaProps {
  className?: string;
}

export function DrehmomentSchema({ className }: DrehmomentSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Drehmoment als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Drehmoment." caption="Drehmoment wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Hebelarm nutzen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface GutmengeAusschussquoteSchemaProps {
  className?: string;
}

export function GutmengeAusschussquoteSchema({ className }: GutmengeAusschussquoteSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Gutmenge und Ausschussquote als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Gutmenge und Ausschussquote." caption="Gutmenge und Ausschussquote wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Produktionsmenge bewerten" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface ProduktionsleistungSchemaProps {
  className?: string;
}

export function ProduktionsleistungSchema({ className }: ProduktionsleistungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Produktionsleistung als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Produktionsleistung." caption="Produktionsleistung wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Leistung je Zeit berechnen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface ProzentualeAbweichungSchemaProps {
  className?: string;
}

export function ProzentualeAbweichungSchema({ className }: ProzentualeAbweichungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Prozentuale Abweichung als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Prozentuale Abweichung." caption="Prozentuale Abweichung wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Abweichung bewerten" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface WaermeausdehnungPruefungsnahSchemaProps {
  className?: string;
}

export function WaermeausdehnungPruefungsnahSchema({ className }: WaermeausdehnungPruefungsnahSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Waermeausdehnung pruefungsnah als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Waermeausdehnung pruefungsnah." caption="Waermeausdehnung pruefungsnah wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Delta-L berechnen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface ToleranzberechnungSchemaProps {
  className?: string;
}

export function ToleranzberechnungSchema({ className }: ToleranzberechnungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Toleranzberechnung als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Toleranzberechnung." caption="Toleranzberechnung wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Grenzmasse berechnen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface FormelUmstellenSchemaProps {
  className?: string;
}

export function FormelUmstellenSchema({ className }: FormelUmstellenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Formel umstellen als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Formel umstellen." caption="Formel umstellen wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Zielgroesse isolieren" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface PlausibilitaetVonErgebnissenSchemaProps {
  className?: string;
}

export function PlausibilitaetVonErgebnissenSchema({ className }: PlausibilitaetVonErgebnissenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Plausibilitaet von Ergebnissen als Rechenweg strukturieren" desc="Gegeben, gesucht, Formel, Einheit und Plausibilitaet strukturieren Plausibilitaet von Ergebnissen." caption="Plausibilitaet von Ergebnissen wird in Schritten geloest: Werte markieren, Formel waehlen, Einheiten pruefen, Ergebnis kontrollieren." merker="Ergebnis pruefen" karten={[{ label: 'Geg.', detail: 'markieren' }, { label: 'Ges.', detail: 'finden' }, { label: 'Formel', detail: 'waehlen' }, { label: 'Einheit', detail: 'pruefen' }, { label: 'Ergeb.', detail: 'testen' }]} />;
}


export interface AusbildungsvertragSchemaProps {
  className?: string;
}

export function AusbildungsvertragSchema({ className }: AusbildungsvertragSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Ausbildungsvertrag als WiSo-Lernbild einordnen" desc="Begriff, Regel, Quelle, Beispiel und Pruefung strukturieren Ausbildungsvertrag." caption="Ausbildungsvertrag wird mit klaren Begriffen und Quellen gelernt, nicht durch Raten." merker="Vertragsinhalte kennen" karten={[{ label: 'Begriff', detail: 'kennen' }, { label: 'Regel', detail: 'zuordnen' }, { label: 'Quelle', detail: 'finden' }, { label: 'Beispiel', detail: 'Betrieb' }, { label: 'Pruef.', detail: 'ueben' }]} />;
}


export interface RechteUndPflichtenSchemaProps {
  className?: string;
}

export function RechteUndPflichtenSchema({ className }: RechteUndPflichtenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Rechte und Pflichten als WiSo-Lernbild einordnen" desc="Begriff, Regel, Quelle, Beispiel und Pruefung strukturieren Rechte und Pflichten." caption="Rechte und Pflichten wird mit klaren Begriffen und Quellen gelernt, nicht durch Raten." merker="Pflichten zuordnen" karten={[{ label: 'Begriff', detail: 'kennen' }, { label: 'Regel', detail: 'zuordnen' }, { label: 'Quelle', detail: 'finden' }, { label: 'Beispiel', detail: 'Betrieb' }, { label: 'Pruef.', detail: 'ueben' }]} />;
}


export interface ProbezeitUndKuendigungSchemaProps {
  className?: string;
}

export function ProbezeitUndKuendigungSchema({ className }: ProbezeitUndKuendigungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Probezeit und Kuendigung als WiSo-Lernbild einordnen" desc="Begriff, Regel, Quelle, Beispiel und Pruefung strukturieren Probezeit und Kuendigung." caption="Probezeit und Kuendigung wird mit klaren Begriffen und Quellen gelernt, nicht durch Raten." merker="Fristen nicht raten" karten={[{ label: 'Begriff', detail: 'kennen' }, { label: 'Regel', detail: 'zuordnen' }, { label: 'Quelle', detail: 'finden' }, { label: 'Beispiel', detail: 'Betrieb' }, { label: 'Pruef.', detail: 'ueben' }]} />;
}


export interface ArbeitsvertragTarifvertragSchemaProps {
  className?: string;
}

export function ArbeitsvertragTarifvertragSchema({ className }: ArbeitsvertragTarifvertragSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Arbeitsvertrag und Tarifvertrag als WiSo-Lernbild einordnen" desc="Begriff, Regel, Quelle, Beispiel und Pruefung strukturieren Arbeitsvertrag und Tarifvertrag." caption="Arbeitsvertrag und Tarifvertrag wird mit klaren Begriffen und Quellen gelernt, nicht durch Raten." merker="Vertragstypen trennen" karten={[{ label: 'Begriff', detail: 'kennen' }, { label: 'Regel', detail: 'zuordnen' }, { label: 'Quelle', detail: 'finden' }, { label: 'Beispiel', detail: 'Betrieb' }, { label: 'Pruef.', detail: 'ueben' }]} />;
}


export interface TarifautonomieBetriebsratSchemaProps {
  className?: string;
}

export function TarifautonomieBetriebsratSchema({ className }: TarifautonomieBetriebsratSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Tarifautonomie und Betriebsrat als WiSo-Lernbild einordnen" desc="Begriff, Regel, Quelle, Beispiel und Pruefung strukturieren Tarifautonomie und Betriebsrat." caption="Tarifautonomie und Betriebsrat wird mit klaren Begriffen und Quellen gelernt, nicht durch Raten." merker="Mitbestimmung einordnen" karten={[{ label: 'Begriff', detail: 'kennen' }, { label: 'Regel', detail: 'zuordnen' }, { label: 'Quelle', detail: 'finden' }, { label: 'Beispiel', detail: 'Betrieb' }, { label: 'Pruef.', detail: 'ueben' }]} />;
}


export interface JugendAuszubildendenvertretungSchemaProps {
  className?: string;
}

export function JugendAuszubildendenvertretungSchema({ className }: JugendAuszubildendenvertretungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Jugend- und Auszubildendenvertretung als WiSo-Lernbild einordnen" desc="Begriff, Regel, Quelle, Beispiel und Pruefung strukturieren Jugend- und Auszubildendenvertretung." caption="Jugend- und Auszubildendenvertretung wird mit klaren Begriffen und Quellen gelernt, nicht durch Raten." merker="Vertretung kennen" karten={[{ label: 'Begriff', detail: 'kennen' }, { label: 'Regel', detail: 'zuordnen' }, { label: 'Quelle', detail: 'finden' }, { label: 'Beispiel', detail: 'Betrieb' }, { label: 'Pruef.', detail: 'ueben' }]} />;
}


export interface SozialversicherungSchemaProps {
  className?: string;
}

export function SozialversicherungSchema({ className }: SozialversicherungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Sozialversicherung als WiSo-Lernbild einordnen" desc="Begriff, Regel, Quelle, Beispiel und Pruefung strukturieren Sozialversicherung." caption="Sozialversicherung wird mit klaren Begriffen und Quellen gelernt, nicht durch Raten." merker="Zweige nennen" karten={[{ label: 'Begriff', detail: 'kennen' }, { label: 'Regel', detail: 'zuordnen' }, { label: 'Quelle', detail: 'finden' }, { label: 'Beispiel', detail: 'Betrieb' }, { label: 'Pruef.', detail: 'ueben' }]} />;
}


export interface ArbeitszeitUndUrlaubSchemaProps {
  className?: string;
}

export function ArbeitszeitUndUrlaubSchema({ className }: ArbeitszeitUndUrlaubSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Arbeitszeit und Urlaub als WiSo-Lernbild einordnen" desc="Begriff, Regel, Quelle, Beispiel und Pruefung strukturieren Arbeitszeit und Urlaub." caption="Arbeitszeit und Urlaub wird mit klaren Begriffen und Quellen gelernt, nicht durch Raten." merker="Regelungen finden" karten={[{ label: 'Begriff', detail: 'kennen' }, { label: 'Regel', detail: 'zuordnen' }, { label: 'Quelle', detail: 'finden' }, { label: 'Beispiel', detail: 'Betrieb' }, { label: 'Pruef.', detail: 'ueben' }]} />;
}


export interface EntgeltabrechnungSchemaProps {
  className?: string;
}

export function EntgeltabrechnungSchema({ className }: EntgeltabrechnungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Entgeltabrechnung als WiSo-Lernbild einordnen" desc="Begriff, Regel, Quelle, Beispiel und Pruefung strukturieren Entgeltabrechnung." caption="Entgeltabrechnung wird mit klaren Begriffen und Quellen gelernt, nicht durch Raten." merker="Brutto/Netto verstehen" karten={[{ label: 'Begriff', detail: 'kennen' }, { label: 'Regel', detail: 'zuordnen' }, { label: 'Quelle', detail: 'finden' }, { label: 'Beispiel', detail: 'Betrieb' }, { label: 'Pruef.', detail: 'ueben' }]} />;
}


export interface NachhaltigkeitUmweltschutzSchemaProps {
  className?: string;
}

export function NachhaltigkeitUmweltschutzSchema({ className }: NachhaltigkeitUmweltschutzSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Nachhaltigkeit und Umweltschutz als WiSo-Lernbild einordnen" desc="Begriff, Regel, Quelle, Beispiel und Pruefung strukturieren Nachhaltigkeit und Umweltschutz." caption="Nachhaltigkeit und Umweltschutz wird mit klaren Begriffen und Quellen gelernt, nicht durch Raten." merker="Nachhaltigkeit betrieblich sehen" karten={[{ label: 'Begriff', detail: 'kennen' }, { label: 'Regel', detail: 'zuordnen' }, { label: 'Quelle', detail: 'finden' }, { label: 'Beispiel', detail: 'Betrieb' }, { label: 'Pruef.', detail: 'ueben' }]} />;
}


export interface WirtschaftlichkeitProduktivitaetSchemaProps {
  className?: string;
}

export function WirtschaftlichkeitProduktivitaetSchema({ className }: WirtschaftlichkeitProduktivitaetSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Wirtschaftlichkeit und Produktivitaet als WiSo-Lernbild einordnen" desc="Begriff, Regel, Quelle, Beispiel und Pruefung strukturieren Wirtschaftlichkeit und Produktivitaet." caption="Wirtschaftlichkeit und Produktivitaet wird mit klaren Begriffen und Quellen gelernt, nicht durch Raten." merker="Kennzahlen deuten" karten={[{ label: 'Begriff', detail: 'kennen' }, { label: 'Regel', detail: 'zuordnen' }, { label: 'Quelle', detail: 'finden' }, { label: 'Beispiel', detail: 'Betrieb' }, { label: 'Pruef.', detail: 'ueben' }]} />;
}


export interface OekonomischesPrinzipSchemaProps {
  className?: string;
}

export function OekonomischesPrinzipSchema({ className }: OekonomischesPrinzipSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Oekonomisches Prinzip als WiSo-Lernbild einordnen" desc="Begriff, Regel, Quelle, Beispiel und Pruefung strukturieren Oekonomisches Prinzip." caption="Oekonomisches Prinzip wird mit klaren Begriffen und Quellen gelernt, nicht durch Raten." merker="Minimal/Maximalprinzip erkennen" karten={[{ label: 'Begriff', detail: 'kennen' }, { label: 'Regel', detail: 'zuordnen' }, { label: 'Quelle', detail: 'finden' }, { label: 'Beispiel', detail: 'Betrieb' }, { label: 'Pruef.', detail: 'ueben' }]} />;
}


export interface AufgabenstellungRichtigLesenSchemaProps {
  className?: string;
}

export function AufgabenstellungRichtigLesenSchema({ className }: AufgabenstellungRichtigLesenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Aufgabenstellung richtig lesen als Pruefungsstrategie trainieren" desc="Lesen, Struktur, Kontrolle, Zeit und Wiederholung tragen Aufgabenstellung richtig lesen." caption="Aufgabenstellung richtig lesen wird als wiederholbarer Pruefungsschritt geuebt." merker="Operatoren markieren" karten={[{ label: 'Lesen', detail: 'klar' }, { label: 'Struktur', detail: 'ordnen' }, { label: 'Kontroll.', detail: 'Einheit' }, { label: 'Zeit', detail: 'teilen' }, { label: 'Wiederh.', detail: 'ueben' }]} />;
}


export interface GegebenUndGesuchtSchemaProps {
  className?: string;
}

export function GegebenUndGesuchtSchema({ className }: GegebenUndGesuchtSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Gegeben und gesucht finden als Pruefungsstrategie trainieren" desc="Lesen, Struktur, Kontrolle, Zeit und Wiederholung tragen Gegeben und gesucht finden." caption="Gegeben und gesucht finden wird als wiederholbarer Pruefungsschritt geuebt." merker="Werte strukturieren" karten={[{ label: 'Lesen', detail: 'klar' }, { label: 'Struktur', detail: 'ordnen' }, { label: 'Kontroll.', detail: 'Einheit' }, { label: 'Zeit', detail: 'teilen' }, { label: 'Wiederh.', detail: 'ueben' }]} />;
}


export interface PassendeFormelFindenSchemaProps {
  className?: string;
}

export function PassendeFormelFindenSchema({ className }: PassendeFormelFindenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Passende Formel finden als Pruefungsstrategie trainieren" desc="Lesen, Struktur, Kontrolle, Zeit und Wiederholung tragen Passende Formel finden." caption="Passende Formel finden wird als wiederholbarer Pruefungsschritt geuebt." merker="Formel auswaehlen" karten={[{ label: 'Lesen', detail: 'klar' }, { label: 'Struktur', detail: 'ordnen' }, { label: 'Kontroll.', detail: 'Einheit' }, { label: 'Zeit', detail: 'teilen' }, { label: 'Wiederh.', detail: 'ueben' }]} />;
}


export interface EinheitenKontrollierenSchemaProps {
  className?: string;
}

export function EinheitenKontrollierenSchema({ className }: EinheitenKontrollierenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Einheiten kontrollieren als Pruefungsstrategie trainieren" desc="Lesen, Struktur, Kontrolle, Zeit und Wiederholung tragen Einheiten kontrollieren." caption="Einheiten kontrollieren wird als wiederholbarer Pruefungsschritt geuebt." merker="Einheitenfehler finden" karten={[{ label: 'Lesen', detail: 'klar' }, { label: 'Struktur', detail: 'ordnen' }, { label: 'Kontroll.', detail: 'Einheit' }, { label: 'Zeit', detail: 'teilen' }, { label: 'Wiederh.', detail: 'ueben' }]} />;
}


export interface TabellenbuchNutzenSchemaProps {
  className?: string;
}

export function TabellenbuchNutzenSchema({ className }: TabellenbuchNutzenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Tabellenbuch nutzen als Pruefungsstrategie trainieren" desc="Lesen, Struktur, Kontrolle, Zeit und Wiederholung tragen Tabellenbuch nutzen." caption="Tabellenbuch nutzen wird als wiederholbarer Pruefungsschritt geuebt." merker="Fundstellen finden" karten={[{ label: 'Lesen', detail: 'klar' }, { label: 'Struktur', detail: 'ordnen' }, { label: 'Kontroll.', detail: 'Einheit' }, { label: 'Zeit', detail: 'teilen' }, { label: 'Wiederh.', detail: 'ueben' }]} />;
}


export interface MultipleChoiceAusschlussSchemaProps {
  className?: string;
}

export function MultipleChoiceAusschlussSchema({ className }: MultipleChoiceAusschlussSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Multiple-Choice-Ausschlussverfahren als Pruefungsstrategie trainieren" desc="Lesen, Struktur, Kontrolle, Zeit und Wiederholung tragen Multiple-Choice-Ausschlussverfahren." caption="Multiple-Choice-Ausschlussverfahren wird als wiederholbarer Pruefungsschritt geuebt." merker="Distraktoren pruefen" karten={[{ label: 'Lesen', detail: 'klar' }, { label: 'Struktur', detail: 'ordnen' }, { label: 'Kontroll.', detail: 'Einheit' }, { label: 'Zeit', detail: 'teilen' }, { label: 'Wiederh.', detail: 'ueben' }]} />;
}


export interface UnbekannteBegriffeSchemaProps {
  className?: string;
}

export function UnbekannteBegriffeSchema({ className }: UnbekannteBegriffeSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Unbekannte Begriffe bearbeiten als Pruefungsstrategie trainieren" desc="Lesen, Struktur, Kontrolle, Zeit und Wiederholung tragen Unbekannte Begriffe bearbeiten." caption="Unbekannte Begriffe bearbeiten wird als wiederholbarer Pruefungsschritt geuebt." merker="Kontext nutzen" karten={[{ label: 'Lesen', detail: 'klar' }, { label: 'Struktur', detail: 'ordnen' }, { label: 'Kontroll.', detail: 'Einheit' }, { label: 'Zeit', detail: 'teilen' }, { label: 'Wiederh.', detail: 'ueben' }]} />;
}


export interface ZeitmanagementSchemaProps {
  className?: string;
}

export function ZeitmanagementSchema({ className }: ZeitmanagementSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Zeitmanagement als Pruefungsstrategie trainieren" desc="Lesen, Struktur, Kontrolle, Zeit und Wiederholung tragen Zeitmanagement." caption="Zeitmanagement wird als wiederholbarer Pruefungsschritt geuebt." merker="Zeit einteilen" karten={[{ label: 'Lesen', detail: 'klar' }, { label: 'Struktur', detail: 'ordnen' }, { label: 'Kontroll.', detail: 'Einheit' }, { label: 'Zeit', detail: 'teilen' }, { label: 'Wiederh.', detail: 'ueben' }]} />;
}


export interface PruefungsangstReduzierenSchemaProps {
  className?: string;
}

export function PruefungsangstReduzierenSchema({ className }: PruefungsangstReduzierenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Pruefungsangst reduzieren als Pruefungsstrategie trainieren" desc="Lesen, Struktur, Kontrolle, Zeit und Wiederholung tragen Pruefungsangst reduzieren." caption="Pruefungsangst reduzieren wird als wiederholbarer Pruefungsschritt geuebt." merker="Routine nutzen" karten={[{ label: 'Lesen', detail: 'klar' }, { label: 'Struktur', detail: 'ordnen' }, { label: 'Kontroll.', detail: 'Einheit' }, { label: 'Zeit', detail: 'teilen' }, { label: 'Wiederh.', detail: 'ueben' }]} />;
}


export interface TypischePruefungsfallenSchemaProps {
  className?: string;
}

export function TypischePruefungsfallenSchema({ className }: TypischePruefungsfallenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Typische Pruefungsfallen als Pruefungsstrategie trainieren" desc="Lesen, Struktur, Kontrolle, Zeit und Wiederholung tragen Typische Pruefungsfallen." caption="Typische Pruefungsfallen wird als wiederholbarer Pruefungsschritt geuebt." merker="Fallen erkennen" karten={[{ label: 'Lesen', detail: 'klar' }, { label: 'Struktur', detail: 'ordnen' }, { label: 'Kontroll.', detail: 'Einheit' }, { label: 'Zeit', detail: 'teilen' }, { label: 'Wiederh.', detail: 'ueben' }]} />;
}


export interface MiniPruefungProduktionstechnikSchemaProps {
  className?: string;
}

export function MiniPruefungProduktionstechnikSchema({ className }: MiniPruefungProduktionstechnikSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Mini-Pruefung Produktionstechnik als Pruefungsstrategie trainieren" desc="Lesen, Struktur, Kontrolle, Zeit und Wiederholung tragen Mini-Pruefung Produktionstechnik." caption="Mini-Pruefung Produktionstechnik wird als wiederholbarer Pruefungsschritt geuebt." merker="gemischt ueben" karten={[{ label: 'Lesen', detail: 'klar' }, { label: 'Struktur', detail: 'ordnen' }, { label: 'Kontroll.', detail: 'Einheit' }, { label: 'Zeit', detail: 'teilen' }, { label: 'Wiederh.', detail: 'ueben' }]} />;
}


export interface MiniPruefungProduktionsplanungSchemaProps {
  className?: string;
}

export function MiniPruefungProduktionsplanungSchema({ className }: MiniPruefungProduktionsplanungSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Mini-Pruefung Produktionsplanung als Pruefungsstrategie trainieren" desc="Lesen, Struktur, Kontrolle, Zeit und Wiederholung tragen Mini-Pruefung Produktionsplanung." caption="Mini-Pruefung Produktionsplanung wird als wiederholbarer Pruefungsschritt geuebt." merker="Planung ueben" karten={[{ label: 'Lesen', detail: 'klar' }, { label: 'Struktur', detail: 'ordnen' }, { label: 'Kontroll.', detail: 'Einheit' }, { label: 'Zeit', detail: 'teilen' }, { label: 'Wiederh.', detail: 'ueben' }]} />;
}


export interface MiniPruefungWisoSchemaProps {
  className?: string;
}

export function MiniPruefungWisoSchema({ className }: MiniPruefungWisoSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Mini-Pruefung WiSo als Pruefungsstrategie trainieren" desc="Lesen, Struktur, Kontrolle, Zeit und Wiederholung tragen Mini-Pruefung WiSo." caption="Mini-Pruefung WiSo wird als wiederholbarer Pruefungsschritt geuebt." merker="WiSo ueben" karten={[{ label: 'Lesen', detail: 'klar' }, { label: 'Struktur', detail: 'ordnen' }, { label: 'Kontroll.', detail: 'Einheit' }, { label: 'Zeit', detail: 'teilen' }, { label: 'Wiederh.', detail: 'ueben' }]} />;
}


export interface WiederholungsmodusSchemaProps {
  className?: string;
}

export function WiederholungsmodusSchema({ className }: WiederholungsmodusSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Wiederholungsmodus nach Fehlern als Pruefungsstrategie trainieren" desc="Lesen, Struktur, Kontrolle, Zeit und Wiederholung tragen Wiederholungsmodus nach Fehlern." caption="Wiederholungsmodus nach Fehlern wird als wiederholbarer Pruefungsschritt geuebt." merker="Schwachstellen nutzen" karten={[{ label: 'Lesen', detail: 'klar' }, { label: 'Struktur', detail: 'ordnen' }, { label: 'Kontroll.', detail: 'Einheit' }, { label: 'Zeit', detail: 'teilen' }, { label: 'Wiederh.', detail: 'ueben' }]} />;
}


export interface PersoenlicheSchwachstellenSchemaProps {
  className?: string;
}

export function PersoenlicheSchwachstellenSchema({ className }: PersoenlicheSchwachstellenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Persoenliche Schwachstellen erkennen als Pruefungsstrategie trainieren" desc="Lesen, Struktur, Kontrolle, Zeit und Wiederholung tragen Persoenliche Schwachstellen erkennen." caption="Persoenliche Schwachstellen erkennen wird als wiederholbarer Pruefungsschritt geuebt." merker="Lernplan ableiten" karten={[{ label: 'Lesen', detail: 'klar' }, { label: 'Struktur', detail: 'ordnen' }, { label: 'Kontroll.', detail: 'Einheit' }, { label: 'Zeit', detail: 'teilen' }, { label: 'Wiederh.', detail: 'ueben' }]} />;
}


export interface PruefungssimulationAbschlussSchemaProps {
  className?: string;
}

export function PruefungssimulationAbschlussSchema({ className }: PruefungssimulationAbschlussSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Pruefungssimulation Abschluss als Pruefungsstrategie trainieren" desc="Lesen, Struktur, Kontrolle, Zeit und Wiederholung tragen Pruefungssimulation Abschluss." caption="Pruefungssimulation Abschluss wird als wiederholbarer Pruefungsschritt geuebt." merker="realistisch trainieren" karten={[{ label: 'Lesen', detail: 'klar' }, { label: 'Struktur', detail: 'ordnen' }, { label: 'Kontroll.', detail: 'Einheit' }, { label: 'Zeit', detail: 'teilen' }, { label: 'Wiederh.', detail: 'ueben' }]} />;
}


export interface ProduktionsauftragLesenSchemaProps {
  className?: string;
}

export function ProduktionsauftragLesenSchema({ className }: ProduktionsauftragLesenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Produktionsauftrag mit Teil Menge Termin und Vorgabe lesen" desc="Teil, Menge, Termin, Zeichnung und offene Punkte strukturieren den Auftragscheck." caption="Der Auftrag ist die Startquelle. Offene Punkte werden vor dem Ruesten geklaert." merker="Auftrag vor Start klaeren" karten={[{ label: 'Teil', detail: 'was?' }, { label: 'Menge', detail: 'wie viel?' }, { label: 'Termin', detail: 'bis wann?' }, { label: 'Zeichn.', detail: 'Quelle' }, { label: 'Offen', detail: 'klaeren' }]} />;
}


export interface ProduktionsablaufVerstehenSchemaProps {
  className?: string;
}

export function ProduktionsablaufVerstehenSchema({ className }: ProduktionsablaufVerstehenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Produktionsablauf als Stationenkette verstehen" desc="Auftrag, Material, Bearbeitung, Pruefung und Weitergabe bilden den Ablauf." caption="Der Ablauf zeigt, wie Stationen voneinander abhaengen." merker="vorher - hier - nachher" karten={[{ label: 'Auftrag', detail: 'start' }, { label: 'Material', detail: 'bereit' }, { label: 'Bearb.', detail: 'machen' }, { label: 'Pruef.', detail: 'sichern' }, { label: 'Weiter', detail: 'geben' }]} />;
}


export interface SchichtbeginnVorbereitenSchemaProps {
  className?: string;
}

export function SchichtbeginnVorbereitenSchema({ className }: SchichtbeginnVorbereitenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Schichtbeginn mit Checkliste und Uebergabe vorbereiten" desc="Uebergabe, Sicherheit, Auftrag, Material und offene Punkte bilden den Startcheck." caption="Schichtbeginn ist ein geregelter Check, kein einfaches Weiterlaufenlassen." merker="Check vor Start" karten={[{ label: 'Ueberg.', detail: 'lesen' }, { label: 'Sicher', detail: 'check' }, { label: 'Auftrag', detail: 'Stand' }, { label: 'Mat.', detail: 'bereit?' }, { label: 'Offen', detail: 'klaeren' }]} />;
}


export interface OrdnungAmArbeitsplatzSchemaProps {
  className?: string;
}

export function OrdnungAmArbeitsplatzSchema({ className }: OrdnungAmArbeitsplatzSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Ordnung am Arbeitsplatz als Sicherheits- und Qualitaetsfaktor" desc="Platz, Kennzeichnung, Werkzeug, Sauberkeit und Standard halten den Arbeitsplatz stabil." caption="Ordnung ist Teil von Sicherheit, Qualitaet und Lean." merker="Platz fuer jedes Werkzeug" karten={[{ label: 'Platz', detail: 'fest' }, { label: 'Kennz.', detail: 'klar' }, { label: 'Werkz.', detail: 'bereit' }, { label: 'Sauber', detail: 'halten' }, { label: 'Stand.', detail: 'pruefen' }]} />;
}


export interface ProduktionsdatenNotierenSchemaProps {
  className?: string;
}

export function ProduktionsdatenNotierenSchema({ className }: ProduktionsdatenNotierenSchemaProps) {
  return <QualitaetSchemaBase className={className} title="Produktionsdaten vollstaendig und nachvollziehbar notieren" desc="Menge, Charge, Ausschuss, Zeit und Unterschrift bilden die Datensicherung." caption="Produktionsdaten sind Nachweis und Steuerungsgrundlage zugleich." merker="vollstaendig und wahr" karten={[{ label: 'Menge', detail: 'Ist' }, { label: 'Charge', detail: 'ID' }, { label: 'Aussch.', detail: 'zahl' }, { label: 'Zeit', detail: 'wann' }, { label: 'Doku', detail: 'klar' }]} />;
}

export interface ProduktionskarteProps {
  className?: string;
}

/**
 * Zeigt einen einfachen Produktionsfluss vom Auftrag bis zur Rueckmeldung.
 */
export function Produktionskarte({ className }: ProduktionskarteProps) {
  const stationen = [
    { label: 'Auftrag', beschreibung: 'Was, wie viel, bis wann?' },
    { label: 'Material', beschreibung: 'Richtig, sauber, freigegeben?' },
    { label: 'Maschine', beschreibung: 'Bereit und sicher?' },
    { label: 'Pruefung', beschreibung: 'Ergebnis nach Vorgabe?' },
    { label: 'Rueckmeldung', beschreibung: 'Menge, Fehler, Status' },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 220" role="img" aria-labelledby="produktionskarte-title produktionskarte-desc" className="h-auto w-full">
        <title id="produktionskarte-title">Produktionskarte mit fuenf Stationen</title>
        <desc id="produktionskarte-desc">
          Die Karte zeigt Auftrag, Material, Maschine, Pruefung und Rueckmeldung als verbundenen Ablauf.
        </desc>
        <rect x="18" y="26" width="424" height="168" rx="10" className="fill-bg-subtle stroke-border" />
        {stationen.map((station, index) => {
          const x = 38 + index * 82;
          return (
            <g key={station.label}>
              {index > 0 ? <path d={`M${x - 26} 88 L${x - 8} 88`} className="stroke-primary" strokeWidth="3" strokeLinecap="round" /> : null}
              <rect x={x} y="54" width="68" height="68" rx="8" className="fill-surface-raised stroke-border-strong" />
              <circle cx={x + 34} cy="78" r="13" className="fill-primary-subtle stroke-primary-border" />
              <text x={x + 34} y="83" textAnchor="middle" className="fill-primary text-[12px] font-bold">
                {index + 1}
              </text>
              <text x={x + 34} y="108" textAnchor="middle" className="fill-fg text-[11px] font-semibold">
                {station.label}
              </text>
              <text x={x + 34} y="146" textAnchor="middle" className="fill-fg-muted text-[9px]">
                {station.beschreibung}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Die Karte zeigt, warum Maschinenfuehrung mehr ist als Bedienen: Auftrag, Material, Sicherheit, Qualitaet und Rueckmeldung gehoeren zusammen.
      </figcaption>
    </figure>
  );
}

export interface RollenradProps {
  className?: string;
}

/**
 * Visualisiert die Kernaufgaben eines Maschinenfuehrers als Rollenrad.
 */
export function Rollenrad({ className }: RollenradProps) {
  const rollen = [
    { label: 'Ruesten', x: 230, y: 42 },
    { label: 'Bedienen', x: 346, y: 96 },
    { label: 'Pruefen', x: 316, y: 170 },
    { label: 'Melden', x: 144, y: 170 },
    { label: 'Sichern', x: 114, y: 96 },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="rollenrad-title rollenrad-desc" className="h-auto w-full">
        <title id="rollenrad-title">Rollenrad Maschinenfuehrer</title>
        <desc id="rollenrad-desc">
          Das Rollenrad verbindet Ruesten, Bedienen, Pruefen, Melden und Sichern mit der Mitte Verantwortung.
        </desc>
        <circle cx="230" cy="116" r="62" className="fill-primary-subtle stroke-primary-border" />
        <text x="230" y="111" textAnchor="middle" className="fill-fg text-[15px] font-bold">
          Verantwortung
        </text>
        <text x="230" y="130" textAnchor="middle" className="fill-fg-muted text-[10px]">
          Auftrag + Sicherheit + Qualitaet
        </text>
        {rollen.map((rolle) => (
          <g key={rolle.label}>
            <path d={`M230 116 L${rolle.x} ${rolle.y}`} className="stroke-border-strong" strokeWidth="2" strokeLinecap="round" />
            <rect x={rolle.x - 42} y={rolle.y - 18} width="84" height="36" rx="8" className="fill-surface-raised stroke-border-strong" />
            <text x={rolle.x} y={rolle.y + 4} textAnchor="middle" className="fill-fg text-[11px] font-semibold">
              {rolle.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Die Aufgaben greifen ineinander. Wenn eine Aufgabe unsicher ist, wird nicht geraten, sondern nach Vorgabe gefragt oder gemeldet.
      </figcaption>
    </figure>
  );
}

export interface MeldewegAblaufProps {
  className?: string;
}

/**
 * Stellt den sicheren Meldeweg bei Stoerungen als Ablaufkarte dar.
 */
export function MeldewegAblauf({ className }: MeldewegAblaufProps) {
  const schritte = [
    { label: 'Erkennen', beschreibung: 'Abweichung, Gefahr oder Fehler bemerken' },
    { label: 'Sichern', beschreibung: 'Personen schuetzen, Anlage nach Vorgabe sichern' },
    { label: 'Melden', beschreibung: 'Ausbilder, Schichtleitung oder Instandhaltung informieren' },
    { label: 'Sperren', beschreibung: 'Teil, Bereich oder Anlage nicht weiter nutzen' },
    { label: 'Dokumentieren', beschreibung: 'Was, wann, wo und welche Massnahme notieren' },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 250" role="img" aria-labelledby="meldeweg-title meldeweg-desc" className="h-auto w-full">
        <title id="meldeweg-title">Meldeweg bei Stoerungen</title>
        <desc id="meldeweg-desc">
          Ablaufkarte mit den Schritten Erkennen, Sichern, Melden, Sperren und Dokumentieren.
        </desc>
        {schritte.map((schritt, index) => {
          const y = 24 + index * 43;
          return (
            <g key={schritt.label}>
              {index > 0 ? <path d={`M54 ${y - 13} L54 ${y + 3}`} className="stroke-primary" strokeWidth="3" strokeLinecap="round" /> : null}
              <circle cx="54" cy={y + 18} r="16" className="fill-primary-subtle stroke-primary-border" />
              <text x="54" y={y + 23} textAnchor="middle" className="fill-primary text-[11px] font-bold">
                {index + 1}
              </text>
              <rect x="86" y={y} width="334" height="36" rx="8" className="fill-bg-subtle stroke-border" />
              <text x="104" y={y + 15} className="fill-fg text-[11px] font-bold">
                {schritt.label}
              </text>
              <text x="104" y={y + 29} className="fill-fg-muted text-[10px]">
                {schritt.beschreibung}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Betriebliche Meldewege koennen abweichen. Die Reihenfolge zeigt die sichere Grundlogik: erst Menschen schuetzen, dann melden und dokumentieren.
      </figcaption>
    </figure>
  );
}

export interface GefahrenstellenBildProps {
  className?: string;
}

/**
 * Zeigt typische Gefahrstellen in einer vereinfachten Werkhallensituation.
 */
export function GefahrenstellenBild({ className }: GefahrenstellenBildProps) {
  const punkte = [
    { x: 96, y: 92, label: 'Einzug' },
    { x: 214, y: 112, label: 'Quetschen' },
    { x: 326, y: 84, label: 'Schneiden' },
    { x: 352, y: 158, label: 'Stolpern' },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="gefahren-title gefahren-desc" className="h-auto w-full">
        <title id="gefahren-title">Werkhalle mit markierten Gefahrstellen</title>
        <desc id="gefahren-desc">
          Vereinfachte Werkhalle mit markierten Stellen fuer Einzug, Quetschen, Schneiden und Stolpern.
        </desc>
        <rect x="24" y="32" width="412" height="156" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="58" y="72" width="92" height="48" rx="8" className="fill-surface-raised stroke-border-strong" />
        <circle cx="84" cy="96" r="14" className="fill-primary-subtle stroke-primary-border" />
        <circle cx="124" cy="96" r="14" className="fill-primary-subtle stroke-primary-border" />
        <rect x="184" y="82" width="84" height="70" rx="8" className="fill-surface-raised stroke-border-strong" />
        <path d="M286 124 L386 124" className="stroke-border-strong" strokeWidth="12" strokeLinecap="round" />
        <path d="M318 64 L384 92 L318 120 Z" className="fill-surface-raised stroke-border-strong" />
        <path d="M42 168 L418 168" className="stroke-border-strong" strokeWidth="4" strokeLinecap="round" />
        {punkte.map((punkt, index) => (
          <g key={punkt.label}>
            <circle cx={punkt.x} cy={punkt.y} r="15" className="fill-warning-bg stroke-warning" strokeWidth="2" />
            <text x={punkt.x} y={punkt.y + 5} textAnchor="middle" className="fill-fg text-[11px] font-bold">
              {index + 1}
            </text>
            <text x={punkt.x + 18} y={punkt.y - 13} className="fill-fg text-[10px] font-semibold">
              {punkt.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Das Bild ist eine Lernskizze. Echte Gefahrstellen ergeben sich aus Maschine, Betriebsanweisung und Unterweisung.
      </figcaption>
    </figure>
  );
}

export interface PsaSetProps {
  className?: string;
}

/**
 * Zeigt ein einfaches PSA-Set fuer Werkhalle und Maschinenumfeld.
 */
export function PsaSet({ className }: PsaSetProps) {
  const teile = [
    { label: 'Schutzbrille', x: 86, y: 76 },
    { label: 'Sicherheitsschuhe', x: 226, y: 154 },
    { label: 'Handschuhe nach Vorgabe', x: 340, y: 92 },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 220" role="img" aria-labelledby="psa-title psa-desc" className="h-auto w-full">
        <title id="psa-title">Persoenliche Schutzausruestung als Set</title>
        <desc id="psa-desc">Schutzbrille, Sicherheitsschuhe und Handschuhe als vereinfachte Symbole.</desc>
        <rect x="28" y="28" width="404" height="160" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M56 82 C72 62 100 62 116 82 C102 94 70 94 56 82 Z" className="fill-info-bg stroke-info" />
        <path d="M190 154 L270 154 L286 174 L176 174 Z" className="fill-surface-raised stroke-border-strong" />
        <path d="M324 64 C350 54 376 72 374 104 C356 96 338 96 318 108 C310 92 310 72 324 64 Z" className="fill-warning-bg stroke-warning" />
        {teile.map((teil) => (
          <g key={teil.label}>
            <circle cx={teil.x} cy={teil.y} r="4" className="fill-primary" />
            <text x={teil.x + 10} y={teil.y + 4} className="fill-fg text-[11px] font-semibold">
              {teil.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Welche PSA genau getragen wird, entscheidet die freigegebene Betriebsanweisung und Unterweisung am Arbeitsplatz.
      </figcaption>
    </figure>
  );
}

export interface SicherheitszeichenSetProps {
  className?: string;
}

/**
 * Zeigt die drei Grundarten Gebot, Verbot und Warnung.
 */
export function SicherheitszeichenSet({ className }: SicherheitszeichenSetProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 210" role="img" aria-labelledby="zeichen-title zeichen-desc" className="h-auto w-full">
        <title id="zeichen-title">Sicherheitszeichen Gebot Verbot Warnung</title>
        <desc id="zeichen-desc">Drei vereinfachte Zeichenarten: Gebot, Verbot und Warnung.</desc>
        <rect x="32" y="34" width="104" height="104" rx="52" className="fill-info-bg stroke-info" strokeWidth="4" />
        <text x="84" y="92" textAnchor="middle" className="fill-fg text-[22px] font-bold">!</text>
        <text x="84" y="164" textAnchor="middle" className="fill-fg text-[12px] font-bold">Gebot</text>
        <circle cx="230" cy="86" r="52" className="fill-surface stroke-danger" strokeWidth="5" />
        <path d="M196 120 L264 52" className="stroke-danger" strokeWidth="8" strokeLinecap="round" />
        <text x="230" y="164" textAnchor="middle" className="fill-fg text-[12px] font-bold">Verbot</text>
        <path d="M376 34 L432 138 L320 138 Z" className="fill-warning-bg stroke-warning" strokeWidth="5" />
        <text x="376" y="108" textAnchor="middle" className="fill-fg text-[22px] font-bold">!</text>
        <text x="376" y="164" textAnchor="middle" className="fill-fg text-[12px] font-bold">Warnung</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Die Darstellung zeigt Zeichenarten, nicht alle konkreten Sicherheitszeichen. Am Arbeitsplatz gilt die beschilderte Vorgabe.
      </figcaption>
    </figure>
  );
}

export interface NotHaltSchemaProps {
  className?: string;
}

/**
 * Zeigt Not-Halt, Stillstand, Melden und Reset als sichere Grundfolge.
 */
export function NotHaltSchema({ className }: NotHaltSchemaProps) {
  const schritte = [
    { label: 'Gefahr erkennen', x: 68 },
    { label: 'Not-Halt', x: 178 },
    { label: 'Melden', x: 288 },
    { label: 'Reset nur nach Freigabe', x: 378 },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 220" role="img" aria-labelledby="not-halt-title not-halt-desc" className="h-auto w-full">
        <title id="not-halt-title">Not-Halt als sichere Grundfolge</title>
        <desc id="not-halt-desc">
          Ablauf mit Gefahr erkennen, Not-Halt betaetigen, melden und Reset nur nach Freigabe.
        </desc>
        <rect x="24" y="34" width="412" height="144" rx="10" className="fill-bg-subtle stroke-border" />
        {schritte.map((schritt, index) => (
          <g key={schritt.label}>
            {index > 0 ? <path d={`M${schritt.x - 62} 94 L${schritt.x - 34} 94`} className="stroke-primary" strokeWidth="3" strokeLinecap="round" /> : null}
            <circle cx={schritt.x} cy="94" r={index === 1 ? 32 : 25} className={index === 1 ? 'fill-danger-bg stroke-danger' : 'fill-surface-raised stroke-border-strong'} strokeWidth={index === 1 ? 4 : 2} />
            <text x={schritt.x} y="99" textAnchor="middle" className="fill-fg text-[12px] font-bold">
              {index === 1 ? 'STOP' : index + 1}
            </text>
            <text x={schritt.x} y="146" textAnchor="middle" className="fill-fg text-[10px] font-semibold">
              {schritt.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Not-Halt stoppt Gefahr, ersetzt aber keine Freigabe. Nach dem Ausloesen wird nicht einfach weiter produziert.
      </figcaption>
    </figure>
  );
}

export interface SchutzeinrichtungSchemaProps {
  className?: string;
}

/**
 * Visualisiert Schutzgitter, Verriegelung und Lichtschranke an einer Maschine.
 */
export function SchutzeinrichtungSchema({ className }: SchutzeinrichtungSchemaProps) {
  const labels = [
    { label: 'Schutzgitter', x: 90, y: 60 },
    { label: 'Verriegelung', x: 198, y: 144 },
    { label: 'Lichtschranke', x: 322, y: 68 },
    { label: 'Gefahrbereich', x: 246, y: 104 },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="schutz-title schutz-desc" className="h-auto w-full">
        <title id="schutz-title">Schutzeinrichtungen an einer Maschine</title>
        <desc id="schutz-desc">
          Schema mit Schutzgitter, Verriegelung, Lichtschranke und markiertem Gefahrbereich.
        </desc>
        <rect x="36" y="42" width="388" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="176" y="74" width="112" height="86" rx="8" className="fill-surface-raised stroke-border-strong" />
        <rect x="62" y="70" width="82" height="92" rx="7" className="fill-info-bg stroke-info" />
        {Array.from({ length: 5 }).map((_, index) => (
          <path key={index} d={`M${76 + index * 14} 76 L${76 + index * 14} 156`} className="stroke-info" strokeWidth="2" />
        ))}
        <rect x="318" y="58" width="18" height="116" rx="6" className="fill-warning-bg stroke-warning" />
        <rect x="364" y="58" width="18" height="116" rx="6" className="fill-warning-bg stroke-warning" />
        <path d="M336 84 L364 84 M336 112 L364 112 M336 140 L364 140" className="stroke-warning" strokeWidth="3" strokeLinecap="round" />
        <circle cx="204" cy="144" r="12" className="fill-primary-subtle stroke-primary" />
        <path d="M222 144 L258 144" className="stroke-primary" strokeWidth="4" strokeLinecap="round" />
        {labels.map((label) => (
          <g key={label.label}>
            <circle cx={label.x} cy={label.y} r="4" className="fill-primary" />
            <text x={label.x + 9} y={label.y + 4} className="fill-fg text-[10px] font-semibold">
              {label.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Schutzeinrichtungen sind Teil des Schutzkonzepts. Sie werden nicht ueberbrueckt und nicht manipuliert.
      </figcaption>
    </figure>
  );
}

export interface EinzugQuetschstellenSchemaProps {
  className?: string;
}

/**
 * Zeigt typische Einzugs- und Quetschstellen mit sicherem Abstand.
 */
export function EinzugQuetschstellenSchema({ className }: EinzugQuetschstellenSchemaProps) {
  const punkte = [
    { label: 'Einzugsstelle', x: 140, y: 92 },
    { label: 'Quetschstelle', x: 292, y: 118 },
    { label: 'sicherer Abstand', x: 338, y: 168 },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="einzug-title einzug-desc" className="h-auto w-full">
        <title id="einzug-title">Einzugsstellen und Quetschstellen</title>
        <desc id="einzug-desc">
          Zwei Walzen als Einzugsstelle, ein bewegter Schieber als Quetschstelle und ein markierter Sicherheitsabstand.
        </desc>
        <rect x="28" y="38" width="404" height="154" rx="10" className="fill-bg-subtle stroke-border" />
        <circle cx="112" cy="92" r="31" className="fill-surface-raised stroke-border-strong" />
        <circle cx="168" cy="92" r="31" className="fill-surface-raised stroke-border-strong" />
        <path d="M128 66 L152 92 L128 118" className="stroke-danger" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="252" y="84" width="58" height="68" rx="6" className="fill-surface-raised stroke-border-strong" />
        <rect x="322" y="84" width="46" height="68" rx="6" className="fill-warning-bg stroke-warning" />
        <path d="M312 118 L336 118" className="stroke-danger" strokeWidth="4" strokeLinecap="round" />
        <path d="M258 174 L382 174" className="stroke-success" strokeWidth="4" strokeLinecap="round" />
        <path d="M258 166 L258 182 M382 166 L382 182" className="stroke-success" strokeWidth="3" strokeLinecap="round" />
        {punkte.map((punkt) => (
          <g key={punkt.label}>
            <circle cx={punkt.x} cy={punkt.y} r="4" className="fill-primary" />
            <text x={punkt.x + 10} y={punkt.y + 4} className="fill-fg text-[10px] font-semibold">
              {punkt.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Einzugs- und Quetschstellen werden nicht mit der Hand geprueft. Abstand, Stillstand und Freigabe sind entscheidend.
      </figcaption>
    </figure>
  );
}

export interface WiedereinschaltenSchemaProps {
  className?: string;
}

/**
 * Zeigt eine einfache Sicherungsfolge gegen unbeabsichtigtes Wiedereinschalten.
 */
export function WiedereinschaltenSchema({ className }: WiedereinschaltenSchemaProps) {
  const schritte = [
    { label: 'Abstellen', x: 62 },
    { label: 'Sichern', x: 154 },
    { label: 'Kennzeichnen', x: 246 },
    { label: 'Pruefen', x: 338 },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 220" role="img" aria-labelledby="wiederein-title wiederein-desc" className="h-auto w-full">
        <title id="wiederein-title">Sicher gegen Wiedereinschalten</title>
        <desc id="wiederein-desc">
          Ablaufskizze mit Abstellen, Sichern, Kennzeichnen und Pruefen vor dem Eingriff.
        </desc>
        <rect x="24" y="34" width="412" height="144" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="46" y="72" width="70" height="58" rx="8" className="fill-surface-raised stroke-border-strong" />
        <circle cx="81" cy="101" r="17" className="fill-danger-bg stroke-danger" />
        <path d="M145 78 L183 78 L183 130 L129 130 L129 94 Q129 78 145 78 Z" className="fill-warning-bg stroke-warning" />
        <path d="M150 78 L150 58 Q150 42 166 42 Q182 42 182 58 L182 78" className="fill-none stroke-warning" strokeWidth="5" strokeLinecap="round" />
        <rect x="218" y="74" width="56" height="66" rx="6" className="fill-info-bg stroke-info" />
        <path d="M228 92 L264 92 M228 110 L258 110 M228 128 L252 128" className="stroke-info" strokeWidth="3" strokeLinecap="round" />
        <circle cx="338" cy="104" r="29" className="fill-success-bg stroke-success" />
        <path d="M324 104 L334 114 L354 92" className="fill-none stroke-success" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        {schritte.map((schritt) => (
          <text key={schritt.label} x={schritt.x} y="160" textAnchor="middle" className="fill-fg text-[10px] font-semibold">
            {schritt.label}
          </text>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Die Skizze zeigt die Grundidee. Verbindlich ist die betriebliche Freischalt- und Sicherungsanweisung.
      </figcaption>
    </figure>
  );
}

export interface SicherheitsregelnSchemaProps {
  className?: string;
}

/**
 * Visualisiert fuenf Sicherheitsregeln als Reihenfolge-Karten.
 */
export function SicherheitsregelnSchema({ className }: SicherheitsregelnSchemaProps) {
  const regeln = ['Freischalten', 'Sichern', 'Pruefen', 'Erden', 'Abdecken'];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="regeln-title regeln-desc" className="h-auto w-full">
        <title id="regeln-title">Fuenf Sicherheitsregeln als Lernkarten</title>
        <desc id="regeln-desc">Fuenf Karten in Reihenfolge: Freischalten, Sichern, Pruefen, Erden und Abdecken.</desc>
        <rect x="24" y="36" width="412" height="148" rx="10" className="fill-bg-subtle stroke-border" />
        {regeln.map((regel, index) => {
          const x = 44 + index * 76;
          return (
            <g key={regel}>
              {index > 0 ? <path d={`M${x - 22} 105 L${x - 8} 105`} className="stroke-primary" strokeWidth="3" strokeLinecap="round" /> : null}
              <rect x={x} y="70" width="60" height="70" rx="8" className="fill-surface-raised stroke-border-strong" />
              <circle cx={x + 30} cy="93" r="14" className="fill-primary-subtle stroke-primary-border" />
              <text x={x + 30} y="98" textAnchor="middle" className="fill-primary text-[11px] font-bold">
                {index + 1}
              </text>
              <text x={x + 30} y="124" textAnchor="middle" className="fill-fg text-[9px] font-semibold">
                {regel}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Die Regeln werden hier als Lernreihenfolge dargestellt. Welche Regeln am Arbeitsplatz gelten, muss fachlich freigegeben werden.
      </figcaption>
    </figure>
  );
}

export interface WerkzeugwechselSchemaProps {
  className?: string;
}

/**
 * Zeigt den sicheren Werkzeugwechsel als Ablauf von Stoppen bis Probeteil.
 */
export function WerkzeugwechselSchema({ className }: WerkzeugwechselSchemaProps) {
  const schritte = [
    { label: 'Stoppen', y: 50 },
    { label: 'Sichern', y: 88 },
    { label: 'Wechseln', y: 126 },
    { label: 'Pruefen', y: 164 },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 240" role="img" aria-labelledby="werkzeug-title werkzeug-desc" className="h-auto w-full">
        <title id="werkzeug-title">Sicherer Werkzeugwechsel als Ablauf</title>
        <desc id="werkzeug-desc">Maschinenraum mit Werkzeug und den Schritten Stoppen, Sichern, Wechseln und Pruefen.</desc>
        <rect x="34" y="36" width="196" height="160" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="68" y="72" width="128" height="82" rx="8" className="fill-surface-raised stroke-border-strong" />
        <path d="M104 116 L132 88 L160 116 L132 144 Z" className="fill-warning-bg stroke-warning" />
        <path d="M94 170 L180 170" className="stroke-border-strong" strokeWidth="6" strokeLinecap="round" />
        {schritte.map((schritt, index) => (
          <g key={schritt.label}>
            <circle cx="278" cy={schritt.y} r="13" className="fill-primary-subtle stroke-primary-border" />
            <text x="278" y={schritt.y + 4} textAnchor="middle" className="fill-primary text-[10px] font-bold">
              {index + 1}
            </text>
            <rect x="306" y={schritt.y - 14} width="112" height="28" rx="7" className="fill-surface-raised stroke-border-strong" />
            <text x="322" y={schritt.y + 4} className="fill-fg text-[10px] font-semibold">
              {schritt.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Werkzeugwechsel braucht sichere Maschine, passende Freigabe und Pruefung oder Probeteil vor Serienlauf.
      </figcaption>
    </figure>
  );
}

export interface UnfallMeldeketteSchemaProps {
  className?: string;
}

/**
 * Zeigt Meldekette und Erstreaktion bei Unfall oder Beinaheunfall.
 */
export function UnfallMeldeketteSchema({ className }: UnfallMeldeketteSchemaProps) {
  const schritte = [
    'Sichern',
    'Hilfe holen',
    'Erste Hilfe',
    'Melden',
    'Dokumentieren',
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 240" role="img" aria-labelledby="unfall-title unfall-desc" className="h-auto w-full">
        <title id="unfall-title">Meldekette bei Unfall und Beinaheunfall</title>
        <desc id="unfall-desc">
          Ablauf mit Sichern, Hilfe holen, Erste Hilfe, Melden und Dokumentieren.
        </desc>
        <rect x="28" y="34" width="404" height="158" rx="10" className="fill-bg-subtle stroke-border" />
        {schritte.map((schritt, index) => {
          const y = 55 + index * 28;
          return (
            <g key={schritt}>
              <circle cx="62" cy={y} r="12" className={index < 2 ? 'fill-danger-bg stroke-danger' : 'fill-primary-subtle stroke-primary-border'} />
              <text x="62" y={y + 4} textAnchor="middle" className="fill-fg text-[9px] font-bold">
                {index + 1}
              </text>
              <path d={`M82 ${y} L112 ${y}`} className="stroke-primary" strokeWidth="3" strokeLinecap="round" />
              <rect x="124" y={y - 13} width="246" height="26" rx="7" className="fill-surface-raised stroke-border-strong" />
              <text x="140" y={y + 4} className="fill-fg text-[10px] font-semibold">
                {schritt}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Auch Beinaheunfaelle werden gemeldet. Sie zeigen Risiken, bevor jemand verletzt wird.
      </figcaption>
    </figure>
  );
}

export interface UmweltStoffstromSchemaProps {
  className?: string;
}

/**
 * Zeigt einen einfachen betrieblichen Stoffstrom von Material bis Entsorgung.
 */
export function UmweltStoffstromSchema({ className }: UmweltStoffstromSchemaProps) {
  const stationen = ['Material', 'Produktion', 'Ausschuss', 'Trennen', 'Verwerten'];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 220" role="img" aria-labelledby="umweltstrom-title umweltstrom-desc" className="h-auto w-full">
        <title id="umweltstrom-title">Stoffstrom im Betrieb</title>
        <desc id="umweltstrom-desc">Ablauf von Material ueber Produktion, Ausschuss, Trennen und Verwerten.</desc>
        <rect x="24" y="38" width="412" height="132" rx="10" className="fill-bg-subtle stroke-border" />
        {stationen.map((station, index) => {
          const x = 44 + index * 76;
          return (
            <g key={station}>
              {index > 0 ? <path d={`M${x - 24} 100 L${x - 8} 100`} className="stroke-success" strokeWidth="3" strokeLinecap="round" /> : null}
              <rect x={x} y="72" width="60" height="56" rx="8" className="fill-success-bg stroke-success" />
              <text x={x + 30} y="103" textAnchor="middle" className="fill-fg text-[9px] font-semibold">
                {station}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Umweltschutz beginnt im Prozess: vermeiden, sauber trennen, richtig lagern und nach Vorgabe entsorgen.
      </figcaption>
    </figure>
  );
}

export interface BetriebsstoffeSchemaProps {
  className?: string;
}

/**
 * Zeigt typische Betriebsstoffe als unterscheidbare Lernkarten.
 */
export function BetriebsstoffeSchema({ className }: BetriebsstoffeSchemaProps) {
  const stoffe = [
    { label: 'Oel', x: 76, variante: 'fill-warning-bg stroke-warning' },
    { label: 'Fett', x: 178, variante: 'fill-surface-raised stroke-border-strong' },
    { label: 'KSS', x: 280, variante: 'fill-info-bg stroke-info' },
    { label: 'Reiniger', x: 382, variante: 'fill-danger-bg stroke-danger' },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 220" role="img" aria-labelledby="betriebsstoffe-title betriebsstoffe-desc" className="h-auto w-full">
        <title id="betriebsstoffe-title">Betriebsstoffe unterscheiden</title>
        <desc id="betriebsstoffe-desc">Vier Lernkarten fuer Oel, Fett, Kuehlschmierstoff und Reiniger.</desc>
        <rect x="26" y="34" width="408" height="146" rx="10" className="fill-bg-subtle stroke-border" />
        {stoffe.map((stoff) => (
          <g key={stoff.label}>
            <path d={`M${stoff.x - 26} 74 Q${stoff.x} 40 ${stoff.x + 26} 74 L${stoff.x + 26} 132 Q${stoff.x} 154 ${stoff.x - 26} 132 Z`} className={stoff.variante} />
            <text x={stoff.x} y="112" textAnchor="middle" className="fill-fg text-[12px] font-bold">
              {stoff.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Betriebsstoffe werden nicht nach Aussehen geraten. Kennzeichnung, Gebinde und Betriebsanweisung entscheiden.
      </figcaption>
    </figure>
  );
}

export interface GefahrstoffEtikettSchemaProps {
  className?: string;
}

/**
 * Visualisiert ein vereinfachtes Gefahrstoffetikett mit Pflichtbereichen.
 */
export function GefahrstoffEtikettSchema({ className }: GefahrstoffEtikettSchemaProps) {
  const labels = [
    { text: 'Produktname', x: 90, y: 70 },
    { text: 'Piktogramm', x: 292, y: 92 },
    { text: 'H-/P-Saetze', x: 96, y: 138 },
    { text: 'Signalwort', x: 286, y: 150 },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 240" role="img" aria-labelledby="etikett-title etikett-desc" className="h-auto w-full">
        <title id="etikett-title">Gefahrstoffetikett mit Lernbereichen</title>
        <desc id="etikett-desc">Etikett mit Produktname, Piktogramm, H- und P-Saetzen sowie Signalwort.</desc>
        <rect x="58" y="34" width="344" height="166" rx="10" className="fill-bg-subtle stroke-border-strong" />
        <rect x="82" y="58" width="156" height="34" rx="6" className="fill-surface-raised stroke-border" />
        <path d="M292 54 L354 92 L292 130 L230 92 Z" className="fill-danger-bg stroke-danger" strokeWidth="4" />
        <text x="292" y="99" textAnchor="middle" className="fill-fg text-[22px] font-bold">!</text>
        <rect x="82" y="116" width="168" height="58" rx="6" className="fill-surface-raised stroke-border" />
        <rect x="276" y="142" width="86" height="32" rx="6" className="fill-warning-bg stroke-warning" />
        {labels.map((label) => (
          <text key={label.text} x={label.x} y={label.y} className="fill-fg text-[10px] font-semibold">
            {label.text}
          </text>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Das Etikett ist eine Lernskizze. Konkrete Gefahrstoffangaben muessen vom echten Gebinde und Sicherheitsdatenblatt kommen.
      </figcaption>
    </figure>
  );
}

export interface SicherheitsdatenblattSchemaProps {
  className?: string;
}

/**
 * Zeigt wichtige Sicherheitsdatenblatt-Abschnitte als Navigationskarte.
 */
export function SicherheitsdatenblattSchema({ className }: SicherheitsdatenblattSchemaProps) {
  const abschnitte = ['Stoff', 'Gefahren', 'Erste Hilfe', 'Handhabung', 'PSA', 'Entsorgung'];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 240" role="img" aria-labelledby="sdb-title sdb-desc" className="h-auto w-full">
        <title id="sdb-title">Sicherheitsdatenblatt als Abschnittskarte</title>
        <desc id="sdb-desc">Sechs wichtige Abschnitte: Stoff, Gefahren, Erste Hilfe, Handhabung, PSA und Entsorgung.</desc>
        <rect x="58" y="34" width="344" height="166" rx="10" className="fill-bg-subtle stroke-border-strong" />
        <path d="M326 34 L402 110 L326 110 Z" className="fill-surface-raised stroke-border" />
        {abschnitte.map((abschnitt, index) => {
          const x = 82 + (index % 2) * 150;
          const y = 64 + Math.floor(index / 2) * 42;
          return (
            <g key={abschnitt}>
              <rect x={x} y={y} width="124" height="28" rx="7" className="fill-surface-raised stroke-border" />
              <text x={x + 12} y={y + 18} className="fill-fg text-[10px] font-semibold">
                {index + 1}. {abschnitt}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Im Sicherheitsdatenblatt findest du Schutzmassnahmen, Erste Hilfe, Handhabung und Entsorgung nach Stoff.
      </figcaption>
    </figure>
  );
}

export interface KuehlschmierstoffSchemaProps {
  className?: string;
}

/**
 * Zeigt einen vereinfachten Kuehlschmierstoff-Kreislauf an der Maschine.
 */
export function KuehlschmierstoffSchema({ className }: KuehlschmierstoffSchemaProps) {
  const punkte = [
    { text: 'Tank', x: 86, y: 146 },
    { text: 'Pumpe', x: 170, y: 146 },
    { text: 'Werkzeug', x: 258, y: 86 },
    { text: 'Ruecklauf', x: 334, y: 146 },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="kss-title kss-desc" className="h-auto w-full">
        <title id="kss-title">Kuehlschmierstoff-Kreislauf</title>
        <desc id="kss-desc">Tank, Pumpe, Werkzeugbereich und Ruecklauf als vereinfachter Kreislauf.</desc>
        <rect x="40" y="42" width="380" height="144" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M90 146 C134 92 194 92 238 92 C286 92 328 112 352 146" className="fill-none stroke-info" strokeWidth="5" strokeLinecap="round" />
        <path d="M352 146 C266 178 172 178 90 146" className="fill-none stroke-info" strokeWidth="5" strokeLinecap="round" />
        <rect x="214" y="66" width="84" height="52" rx="8" className="fill-surface-raised stroke-border-strong" />
        <path d="M248 118 L236 146 L274 146 L262 118" className="fill-warning-bg stroke-warning" />
        {punkte.map((punkt) => (
          <g key={punkt.text}>
            <circle cx={punkt.x} cy={punkt.y} r="5" className="fill-primary" />
            <text x={punkt.x + 10} y={punkt.y + 4} className="fill-fg text-[10px] font-semibold">
              {punkt.text}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Kuehlschmierstoff schuetzt Prozess und Werkzeug, kann aber Haut, Umwelt und Anlage belasten, wenn er falsch gehandhabt wird.
      </figcaption>
    </figure>
  );
}

export interface KunststoffAbfallSchemaProps {
  className?: string;
}

/**
 * Zeigt Kunststoffabfaelle als Sortierstation mit sortenreinen Wegen.
 */
export function KunststoffAbfallSchema({ className }: KunststoffAbfallSchemaProps) {
  const boxen = [
    { label: 'Anguss', x: 70 },
    { label: 'Fehlteil', x: 180 },
    { label: 'Folie', x: 290 },
    { label: 'Fremdstoff', x: 360 },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 220" role="img" aria-labelledby="kunststoffabfall-title kunststoffabfall-desc" className="h-auto w-full">
        <title id="kunststoffabfall-title">Kunststoffabfaelle sortieren</title>
        <desc id="kunststoffabfall-desc">Sortierstation mit Anguss, Fehlteil, Folie und Fremdstoff.</desc>
        <rect x="30" y="34" width="400" height="146" rx="10" className="fill-bg-subtle stroke-border" />
        {boxen.map((box, index) => (
          <g key={box.label}>
            <rect x={box.x} y="78" width="68" height="68" rx="8" className={index === 3 ? 'fill-danger-bg stroke-danger' : 'fill-success-bg stroke-success'} />
            <text x={box.x + 34} y="116" textAnchor="middle" className="fill-fg text-[10px] font-semibold">
              {box.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Sortenreinheit entscheidet, ob Kunststoffreste wiederverwendet oder getrennt entsorgt werden muessen.
      </figcaption>
    </figure>
  );
}

export interface ZeichnungGrundlagenSchemaProps {
  className?: string;
}

/**
 * Zeigt eine technische Zeichnung als Vertrag zwischen Konstruktion und Fertigung.
 */
export function ZeichnungGrundlagenSchema({ className }: ZeichnungGrundlagenSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 240" role="img" aria-labelledby="zeichnung-title zeichnung-desc" className="h-auto w-full">
        <title id="zeichnung-title">Technische Zeichnung als Fertigungsgrundlage</title>
        <desc id="zeichnung-desc">Zeichnungsblatt mit Bauteilansicht, Bemassung und Schriftfeld.</desc>
        <rect x="48" y="28" width="364" height="178" rx="8" className="fill-bg-subtle stroke-border-strong" />
        <rect x="72" y="54" width="176" height="98" rx="6" className="fill-surface-raised stroke-border" />
        <path d="M104 124 L104 82 L192 82 L192 124 Z" className="fill-none stroke-primary" strokeWidth="4" />
        <circle cx="148" cy="103" r="18" className="fill-none stroke-primary" strokeWidth="3" />
        <path d="M94 154 L206 154 M104 146 L104 162 M192 146 L192 162" className="stroke-fg-muted" strokeWidth="2" />
        <text x="129" y="174" className="fill-fg text-[10px] font-semibold">Massangaben</text>
        <rect x="270" y="132" width="118" height="52" rx="4" className="fill-surface-raised stroke-border-strong" />
        <path d="M270 150 L388 150 M314 132 L314 184" className="stroke-border-strong" strokeWidth="1.5" />
        <text x="280" y="147" className="fill-fg text-[9px] font-semibold">Schriftfeld</text>
        <text x="280" y="168" className="fill-fg-muted text-[8px]">Teil / Werkstoff</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Eine technische Zeichnung legt fest, wie ein Bauteil gefertigt und geprueft werden soll.
      </figcaption>
    </figure>
  );
}

export interface SchriftfeldSchemaProps {
  className?: string;
}

/**
 * Visualisiert typische Informationen im Schriftfeld.
 */
export function SchriftfeldSchema({ className }: SchriftfeldSchemaProps) {
  const felder = ['Zeichnungsnummer', 'Benennung', 'Werkstoff', 'Massstab', 'Datum', 'Aenderung'];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="schriftfeld-title schriftfeld-desc" className="h-auto w-full">
        <title id="schriftfeld-title">Schriftfeld einer technischen Zeichnung</title>
        <desc id="schriftfeld-desc">Tabellarisches Schriftfeld mit Zeichnungsnummer, Benennung, Werkstoff, Massstab, Datum und Aenderung.</desc>
        <rect x="42" y="34" width="376" height="154" rx="8" className="fill-bg-subtle stroke-border-strong" />
        {felder.map((feld, index) => {
          const x = 66 + (index % 2) * 178;
          const y = 58 + Math.floor(index / 2) * 40;
          return (
            <g key={feld}>
              <rect x={x} y={y} width="150" height="28" rx="6" className="fill-surface-raised stroke-border" />
              <text x={x + 10} y={y + 18} className="fill-fg text-[10px] font-semibold">
                {feld}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Das Schriftfeld sagt, welche Zeichnung gilt und welche Grunddaten zum Bauteil gehoeren.
      </figcaption>
    </figure>
  );
}

export interface AnsichtenSchemaProps {
  className?: string;
}

/**
 * Zeigt Vorderansicht, Draufsicht und Seitenansicht als zusammenhaengende Ansichten.
 */
export function AnsichtenSchema({ className }: AnsichtenSchemaProps) {
  const ansichten = [
    { label: 'Vorderansicht', x: 72, y: 68, w: 100, h: 78 },
    { label: 'Draufsicht', x: 196, y: 58, w: 92, h: 48 },
    { label: 'Seitenansicht', x: 312, y: 70, w: 70, h: 76 },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="ansichten-title ansichten-desc" className="h-auto w-full">
        <title id="ansichten-title">Technische Ansichten eines Bauteils</title>
        <desc id="ansichten-desc">Vorderansicht, Draufsicht und Seitenansicht zeigen dasselbe Bauteil aus verschiedenen Richtungen.</desc>
        <rect x="34" y="34" width="392" height="152" rx="10" className="fill-bg-subtle stroke-border" />
        {ansichten.map((ansicht) => (
          <g key={ansicht.label}>
            <rect x={ansicht.x} y={ansicht.y} width={ansicht.w} height={ansicht.h} rx="6" className="fill-surface-raised stroke-primary" strokeWidth="3" />
            <circle cx={ansicht.x + ansicht.w / 2} cy={ansicht.y + ansicht.h / 2} r="13" className="fill-none stroke-primary" strokeWidth="2" />
            <text x={ansicht.x + ansicht.w / 2} y="166" textAnchor="middle" className="fill-fg text-[10px] font-semibold">
              {ansicht.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Mehrere Ansichten ergeben zusammen die Form. Eine einzelne Ansicht reicht oft nicht aus.
      </figcaption>
    </figure>
  );
}

export interface LinienartenSchemaProps {
  className?: string;
}

/**
 * Zeigt wichtige Linienarten als technische Lernkarte.
 */
export function LinienartenSchema({ className }: LinienartenSchemaProps) {
  const linien = [
    { label: 'Volllinie', y: 72 },
    { label: 'Strichlinie', y: 112, dash: '14 10' },
    { label: 'Strichpunktlinie', y: 152, dash: '22 8 4 8' },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="linien-title linien-desc" className="h-auto w-full">
        <title id="linien-title">Linienarten in technischen Zeichnungen</title>
        <desc id="linien-desc">Volllinie, Strichlinie und Strichpunktlinie als Beispiele.</desc>
        <rect x="42" y="36" width="376" height="146" rx="10" className="fill-bg-subtle stroke-border" />
        {linien.map((linie) => (
          <g key={linie.label}>
            <path d={`M82 ${linie.y} L350 ${linie.y}`} className="stroke-primary" strokeWidth="5" strokeLinecap="round" strokeDasharray={linie.dash} />
            <text x="82" y={linie.y - 10} className="fill-fg text-[10px] font-semibold">
              {linie.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Linienarten haben Bedeutung. Sie werden nicht dekorativ gelesen, sondern nach Zeichnungsregel.
      </figcaption>
    </figure>
  );
}

export interface MassstabSchemaProps {
  className?: string;
}

/**
 * Visualisiert Original, Vergroesserung und Verkleinerung als Massstabsidee.
 */
export function MassstabSchema({ className }: MassstabSchemaProps) {
  const koerper = [
    { label: '2:1', x: 70, size: 70 },
    { label: '1:1', x: 198, size: 48 },
    { label: '1:2', x: 310, size: 30 },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 220" role="img" aria-labelledby="massstab-title massstab-desc" className="h-auto w-full">
        <title id="massstab-title">Massstab in technischen Zeichnungen</title>
        <desc id="massstab-desc">Drei Quadrate zeigen Vergroesserung 2 zu 1, Original 1 zu 1 und Verkleinerung 1 zu 2.</desc>
        <rect x="32" y="34" width="396" height="140" rx="10" className="fill-bg-subtle stroke-border" />
        {koerper.map((item) => (
          <g key={item.label}>
            <rect x={item.x} y={116 - item.size} width={item.size} height={item.size} rx="6" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
            <text x={item.x + item.size / 2} y="150" textAnchor="middle" className="fill-fg text-[12px] font-bold">
              {item.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Der Massstab aendert die Darstellung, nicht das echte Bauteilmass in der Bemassung.
      </figcaption>
    </figure>
  );
}

export interface BemassungSchemaProps {
  className?: string;
}

/**
 * Zeigt Masslinie, Masszahl, Pfeile und Bezug zum Bauteil.
 */
export function BemassungSchema({ className }: BemassungSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="bemassung-title bemassung-desc" className="h-auto w-full">
        <title id="bemassung-title">Bemassung an einem einfachen Bauteil</title>
        <desc id="bemassung-desc">Bauteil mit Masslinie, Masszahl, Pfeilen und Hilfslinien.</desc>
        <rect x="108" y="78" width="206" height="74" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="4" />
        <circle cx="212" cy="115" r="18" className="fill-none stroke-primary" strokeWidth="3" />
        <path d="M108 166 L108 188 M314 166 L314 188 M108 180 L314 180" className="stroke-fg-muted" strokeWidth="2" />
        <path d="M108 180 L120 174 M108 180 L120 186 M314 180 L302 174 M314 180 L302 186" className="stroke-fg-muted" strokeWidth="2" strokeLinecap="round" />
        <text x="202" y="174" className="fill-fg text-[12px] font-bold">Masszahl</text>
        <text x="46" y="183" className="fill-fg-muted text-[10px] font-semibold">Masslinie</text>
        <path d="M96 180 L66 180" className="stroke-fg-muted" strokeWidth="2" />
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Bemassung wird von Masszahl, Masslinie, Pfeilen und Bezug zum Bauteil getragen.
      </figcaption>
    </figure>
  );
}

export interface ToleranzangabenSchemaProps {
  className?: string;
}

/**
 * Zeigt Nennmass, oberes Abmass, unteres Abmass und Toleranzfeld als Lernschema.
 */
export function ToleranzangabenSchema({ className }: ToleranzangabenSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="toleranz-title toleranz-desc" className="h-auto w-full">
        <title id="toleranz-title">Toleranzangaben an einem Zeichnungsmass</title>
        <desc id="toleranz-desc">Nennmass mit oberem und unterem Abmass sowie daraus gebildetem Toleranzfeld.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <line x1="94" y1="126" x2="366" y2="126" className="stroke-border-strong" strokeWidth="6" strokeLinecap="round" />
        <line x1="168" y1="126" x2="292" y2="126" className="stroke-success" strokeWidth="10" strokeLinecap="round" />
        <line x1="230" y1="82" x2="230" y2="158" className="stroke-primary" strokeWidth="3" strokeDasharray="7 6" />
        <text x="230" y="74" textAnchor="middle" className="fill-fg text-[12px] font-bold">Nennmass</text>
        <text x="168" y="164" textAnchor="middle" className="fill-fg-muted text-[10px] font-semibold">unteres Grenzmass</text>
        <text x="292" y="164" textAnchor="middle" className="fill-fg-muted text-[10px] font-semibold">oberes Grenzmass</text>
        <rect x="186" y="96" width="88" height="32" rx="6" className="fill-surface-raised stroke-primary" />
        <text x="230" y="116" textAnchor="middle" className="fill-fg text-[11px] font-bold">Toleranzfeld</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Toleranzangaben legen fest, welcher Istwert noch innerhalb der zulaessigen Grenzen liegt.
      </figcaption>
    </figure>
  );
}

export interface PassungSchemaProps {
  className?: string;
}

/**
 * Visualisiert Welle, Bohrung, Spiel und Uebermass als Passungsgrundlage.
 */
export function PassungSchema({ className }: PassungSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="passung-title passung-desc" className="h-auto w-full">
        <title id="passung-title">Passung zwischen Welle und Bohrung</title>
        <desc id="passung-desc">Bohrung und Welle mit Spielpassung, Uebergang und Uebermass als Lernbild.</desc>
        <rect x="40" y="34" width="380" height="148" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="76" y="74" width="96" height="64" rx="8" className="fill-surface-raised stroke-border-strong" />
        <circle cx="124" cy="106" r="26" className="fill-bg-subtle stroke-primary" strokeWidth="4" />
        <circle cx="124" cy="106" r="17" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <text x="124" y="158" textAnchor="middle" className="fill-fg text-[10px] font-semibold">Spiel</text>
        <rect x="198" y="74" width="96" height="64" rx="8" className="fill-surface-raised stroke-border-strong" />
        <circle cx="246" cy="106" r="23" className="fill-bg-subtle stroke-primary" strokeWidth="4" />
        <circle cx="246" cy="106" r="23" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <text x="246" y="158" textAnchor="middle" className="fill-fg text-[10px] font-semibold">Uebergang</text>
        <rect x="320" y="74" width="64" height="64" rx="8" className="fill-surface-raised stroke-border-strong" />
        <circle cx="352" cy="106" r="21" className="fill-bg-subtle stroke-primary" strokeWidth="4" />
        <circle cx="352" cy="106" r="27" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <text x="352" y="158" textAnchor="middle" className="fill-fg text-[10px] font-semibold">Uebermass</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Eine Passung beschreibt, wie Welle und Bohrung nach ihren Massen zusammenwirken.
      </figcaption>
    </figure>
  );
}

export interface SchnittdarstellungSchemaProps {
  className?: string;
}

/**
 * Zeigt eine Schnittdarstellung mit sichtbarer Innenkontur und Schraffur.
 */
export function SchnittdarstellungSchema({ className }: SchnittdarstellungSchemaProps) {
  const schraffur = Array.from({ length: 8 }, (_, index) => 92 + index * 18);

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="schnitt-title schnitt-desc" className="h-auto w-full">
        <title id="schnitt-title">Schnittdarstellung eines Bauteils</title>
        <desc id="schnitt-desc">Bauteil im Schnitt mit Innenkontur, Bohrung und Schraffur der geschnittenen Flaechen.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M112 148 L112 78 L348 78 L348 148 Z" className="fill-surface-raised stroke-primary" strokeWidth="4" />
        <rect x="190" y="78" width="80" height="70" className="fill-bg-subtle stroke-primary" strokeWidth="3" />
        {schraffur.map((x) => (
          <path key={x} d={`M${x} 148 L${x + 54} 78`} className="stroke-fg-muted" strokeWidth="1.5" />
        ))}
        <text x="230" y="170" textAnchor="middle" className="fill-fg text-[11px] font-bold">Schraffur zeigt geschnittene Flaeche</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Schnitte machen Innenformen sichtbar, die in normalen Ansichten schwer zu erkennen waeren.
      </figcaption>
    </figure>
  );
}

export interface OberflaechenangabenSchemaProps {
  className?: string;
}

/**
 * Visualisiert einfache Oberflaechenangaben und ihren Bezug zum Bauteil.
 */
export function OberflaechenangabenSchema({ className }: OberflaechenangabenSchemaProps) {
  const zeilen = ['allgemeine Angabe', 'Funktionsflaeche', 'Pruefhinweis'];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="ober-title ober-desc" className="h-auto w-full">
        <title id="ober-title">Oberflaechenangaben an einem Bauteil</title>
        <desc id="ober-desc">Bauteil mit Symbolen fuer Rauheit und Oberflaechenhinweise.</desc>
        <rect x="44" y="34" width="372" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="84" y="94" width="172" height="54" rx="6" className="fill-surface-raised stroke-primary" strokeWidth="4" />
        <path d="M270 78 L292 128 L314 78" className="fill-none stroke-primary" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <text x="324" y="106" className="fill-fg text-[12px] font-bold">Ra</text>
        {zeilen.map((zeile, index) => (
          <text key={zeile} x="284" y={132 + index * 16} className="fill-fg-muted text-[9px] font-semibold">
            {zeile}
          </text>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Oberflaechenangaben sagen, welche Flaechenqualitaet an einer Stelle gefordert oder zu pruefen ist.
      </figcaption>
    </figure>
  );
}

export interface StuecklisteSchemaProps {
  className?: string;
}

/**
 * Zeigt eine einfache Stueckliste mit Position, Menge, Benennung und Werkstoff.
 */
export function StuecklisteSchema({ className }: StuecklisteSchemaProps) {
  const zeilen = [
    ['1', '1', 'Grundplatte', 'POM'],
    ['2', '2', 'Fuehrung', 'Stahl'],
    ['3', '4', 'Schraube', 'Normteil'],
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 240" role="img" aria-labelledby="stueckliste-title stueckliste-desc" className="h-auto w-full">
        <title id="stueckliste-title">Stueckliste einer Baugruppe</title>
        <desc id="stueckliste-desc">Tabelle mit Position, Menge, Benennung und Werkstoff fuer mehrere Teile.</desc>
        <rect x="42" y="32" width="376" height="170" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="70" y="58" width="320" height="120" rx="6" className="fill-surface-raised stroke-border-strong" />
        <path d="M70 88 L390 88 M112 58 L112 178 M168 58 L168 178 M282 58 L282 178" className="stroke-border-strong" strokeWidth="1.5" />
        <text x="82" y="78" className="fill-fg text-[9px] font-bold">Pos.</text>
        <text x="126" y="78" className="fill-fg text-[9px] font-bold">Menge</text>
        <text x="184" y="78" className="fill-fg text-[9px] font-bold">Benennung</text>
        <text x="298" y="78" className="fill-fg text-[9px] font-bold">Werkstoff</text>
        {zeilen.map((zeile, index) => (
          <g key={zeile[0]}>
            <path d={`M70 ${112 + index * 24} L390 ${112 + index * 24}`} className="stroke-border" strokeWidth="1" />
            <text x="84" y={105 + index * 24} className="fill-fg-muted text-[9px]">{zeile[0]}</text>
            <text x="134" y={105 + index * 24} className="fill-fg-muted text-[9px]">{zeile[1]}</text>
            <text x="184" y={105 + index * 24} className="fill-fg-muted text-[9px]">{zeile[2]}</text>
            <text x="298" y={105 + index * 24} className="fill-fg-muted text-[9px]">{zeile[3]}</text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Die Stueckliste verbindet Positionsnummern mit Teilen, Mengen und Materialangaben.
      </figcaption>
    </figure>
  );
}

export interface ArbeitsplanSchemaProps {
  className?: string;
}

/**
 * Visualisiert eine einfache Arbeitsfolge mit Arbeitsgang und Betriebsmittel.
 */
export function ArbeitsplanSchema({ className }: ArbeitsplanSchemaProps) {
  const schritte = [
    { nr: '10', text: 'Material bereitstellen' },
    { nr: '20', text: 'Bearbeiten' },
    { nr: '30', text: 'Pruefen' },
    { nr: '40', text: 'Rueckmelden' },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="arbeitsplan-title arbeitsplan-desc" className="h-auto w-full">
        <title id="arbeitsplan-title">Arbeitsplan als geordnete Arbeitsfolge</title>
        <desc id="arbeitsplan-desc">Vier Arbeitsgaenge in Reihenfolge mit Pfeilen zwischen den Prozesskarten.</desc>
        <rect x="36" y="34" width="388" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        {schritte.map((schritt, index) => {
          const x = 58 + index * 94;
          return (
            <g key={schritt.nr}>
              <rect x={x} y="78" width="76" height="54" rx="7" className="fill-surface-raised stroke-primary" strokeWidth="3" />
              <text x={x + 38} y="98" textAnchor="middle" className="fill-fg text-[11px] font-bold">{schritt.nr}</text>
              <text x={x + 38} y="116" textAnchor="middle" className="fill-fg-muted text-[8px] font-semibold">{schritt.text}</text>
              {index < schritte.length - 1 ? <path d={`M${x + 78} 105 L${x + 92} 105`} className="stroke-fg-muted" strokeWidth="3" strokeLinecap="round" /> : null}
            </g>
          );
        })}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Der Arbeitsplan ordnet Arbeitsgaenge, Betriebsmittel und Pruefschritte in eine sinnvolle Reihenfolge.
      </figcaption>
    </figure>
  );
}

export interface SiEinheitenSchemaProps {
  className?: string;
}

/**
 * Zeigt wichtige Basiseinheiten als kompakte Einheitentafel.
 */
export function SiEinheitenSchema({ className }: SiEinheitenSchemaProps) {
  const einheiten = [
    { symbol: 'm', label: 'Laenge' },
    { symbol: 's', label: 'Zeit' },
    { symbol: 'kg', label: 'Masse' },
    { symbol: 'K', label: 'Temperatur' },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="si-title si-desc" className="h-auto w-full">
        <title id="si-title">SI-Basiseinheiten im Betrieb</title>
        <desc id="si-desc">Vier Lernkarten zeigen Meter, Sekunde, Kilogramm und Kelvin als Basiseinheiten.</desc>
        <rect x="36" y="34" width="388" height="152" rx="10" className="fill-bg-subtle stroke-border" />
        {einheiten.map((einheit, index) => {
          const x = 62 + index * 92;
          return (
            <g key={einheit.symbol}>
              <rect x={x} y="70" width="74" height="76" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
              <text x={x + 37} y="104" textAnchor="middle" className="fill-fg text-[22px] font-extrabold">{einheit.symbol}</text>
              <text x={x + 37} y="128" textAnchor="middle" className="fill-fg-muted text-[9px] font-semibold">{einheit.label}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Einheiten machen Messwerte eindeutig: Zahl und Einheit gehoeren zusammen.
      </figcaption>
    </figure>
  );
}

export interface LaengenUmrechnungSchemaProps {
  className?: string;
}

/**
 * Visualisiert die Umrechnung zwischen Meter, Zentimeter und Millimeter.
 */
export function LaengenUmrechnungSchema({ className }: LaengenUmrechnungSchemaProps) {
  const stufen = [
    { einheit: 'm', faktor: 'x 100' },
    { einheit: 'cm', faktor: 'x 10' },
    { einheit: 'mm', faktor: '' },
  ];

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 220" role="img" aria-labelledby="laenge-title laenge-desc" className="h-auto w-full">
        <title id="laenge-title">Laengen umrechnen</title>
        <desc id="laenge-desc">Stufenleiter fuer Meter, Zentimeter und Millimeter mit Faktoren.</desc>
        <rect x="42" y="34" width="376" height="136" rx="10" className="fill-bg-subtle stroke-border" />
        {stufen.map((stufe, index) => {
          const x = 78 + index * 122;
          return (
            <g key={stufe.einheit}>
              <rect x={x} y="78" width="72" height="48" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
              <text x={x + 36} y="109" textAnchor="middle" className="fill-fg text-[18px] font-bold">{stufe.einheit}</text>
              {stufe.faktor ? <text x={x + 92} y="106" textAnchor="middle" className="fill-fg-muted text-[10px] font-semibold">{stufe.faktor}</text> : null}
              {index < stufen.length - 1 ? <path d={`M${x + 76} 102 L${x + 112} 102`} className="stroke-fg-muted" strokeWidth="3" strokeLinecap="round" /> : null}
            </g>
          );
        })}
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Vor jeder Formel muss die Laengeneinheit passen, sonst wird das Ergebnis falsch.
      </figcaption>
    </figure>
  );
}

export interface FlaechenSchemaProps {
  className?: string;
}

/**
 * Zeigt Flaeche als Rechteck mit Laenge mal Breite.
 */
export function FlaechenSchema({ className }: FlaechenSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="flaeche-title flaeche-desc" className="h-auto w-full">
        <title id="flaeche-title">Flaeche berechnen</title>
        <desc id="flaeche-desc">Rechteck mit Laenge, Breite und Formel A gleich Laenge mal Breite.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="116" y="72" width="184" height="78" rx="8" className="fill-primary-subtle stroke-primary" strokeWidth="4" />
        <text x="208" y="116" textAnchor="middle" className="fill-fg text-[16px] font-bold">A</text>
        <path d="M116 164 L300 164 M116 156 L116 172 M300 156 L300 172" className="stroke-fg-muted" strokeWidth="2" />
        <path d="M314 72 L314 150 M306 72 L322 72 M306 150 L322 150" className="stroke-fg-muted" strokeWidth="2" />
        <text x="208" y="180" textAnchor="middle" className="fill-fg-muted text-[10px] font-semibold">Laenge</text>
        <text x="336" y="115" className="fill-fg-muted text-[10px] font-semibold">Breite</text>
        <text x="208" y="55" textAnchor="middle" className="fill-fg text-[12px] font-bold">A = Laenge x Breite</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Eine Flaeche beschreibt, wie gross eine ebene Stelle ist.
      </figcaption>
    </figure>
  );
}

export interface VolumenSchemaProps {
  className?: string;
}

/**
 * Zeigt Volumen als Quader mit Laenge, Breite und Hoehe.
 */
export function VolumenSchema({ className }: VolumenSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="volumen-title volumen-desc" className="h-auto w-full">
        <title id="volumen-title">Volumen berechnen</title>
        <desc id="volumen-desc">Quader mit Laenge, Breite und Hoehe sowie Formel V gleich Laenge mal Breite mal Hoehe.</desc>
        <rect x="44" y="34" width="372" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <path d="M138 126 L138 78 L270 78 L270 126 Z" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <path d="M270 78 L318 104 L318 152 L270 126 Z" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <path d="M138 126 L186 152 L318 152 L270 126 Z" className="fill-bg-subtle stroke-primary" strokeWidth="3" />
        <text x="214" y="108" textAnchor="middle" className="fill-fg text-[16px] font-bold">V</text>
        <text x="230" y="58" textAnchor="middle" className="fill-fg text-[12px] font-bold">V = L x B x H</text>
        <text x="224" y="172" textAnchor="middle" className="fill-fg-muted text-[10px] font-semibold">Quader als Rauminhalt</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Volumen beschreibt den Rauminhalt eines Koerpers oder Materials.
      </figcaption>
    </figure>
  );
}

export interface DichteSchemaProps {
  className?: string;
}

/**
 * Visualisiert den Zusammenhang zwischen Masse, Volumen und Dichte.
 */
export function DichteSchema({ className }: DichteSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="dichte-title dichte-desc" className="h-auto w-full">
        <title id="dichte-title">Masse und Dichte</title>
        <desc id="dichte-desc">Zwei gleich grosse Wuerfel mit unterschiedlicher Masse zeigen den Dichtebezug.</desc>
        <rect x="42" y="34" width="376" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="102" y="82" width="74" height="74" rx="8" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <rect x="284" y="82" width="74" height="74" rx="8" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <text x="139" y="122" textAnchor="middle" className="fill-fg text-[15px] font-bold">leicht</text>
        <text x="321" y="122" textAnchor="middle" className="fill-fg text-[15px] font-bold">schwer</text>
        <text x="230" y="64" textAnchor="middle" className="fill-fg text-[12px] font-bold">Dichte = Masse / Volumen</text>
        <text x="230" y="176" textAnchor="middle" className="fill-fg-muted text-[10px] font-semibold">gleiches Volumen, unterschiedliche Masse</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Dichte hilft, Masse und Volumen eines Werkstoffs zusammen zu verstehen.
      </figcaption>
    </figure>
  );
}

export interface GeschwindigkeitSchemaProps {
  className?: string;
}

/**
 * Zeigt Geschwindigkeit als Weg pro Zeit auf einem Foerderband.
 */
export function GeschwindigkeitSchema({ className }: GeschwindigkeitSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="geschwindigkeit-title geschwindigkeit-desc" className="h-auto w-full">
        <title id="geschwindigkeit-title">Zeit und Geschwindigkeit</title>
        <desc id="geschwindigkeit-desc">Foerderband mit Wegpfeil und Uhr zeigt Geschwindigkeit als Weg pro Zeit.</desc>
        <rect x="40" y="34" width="380" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="82" y="118" width="254" height="28" rx="14" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <circle cx="126" cy="154" r="12" className="fill-bg-subtle stroke-border-strong" />
        <circle cx="292" cy="154" r="12" className="fill-bg-subtle stroke-border-strong" />
        <path d="M104 92 L314 92" className="stroke-primary" strokeWidth="4" strokeLinecap="round" />
        <path d="M314 92 L300 84 M314 92 L300 100" className="stroke-primary" strokeWidth="4" strokeLinecap="round" />
        <circle cx="364" cy="92" r="26" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <path d="M364 92 L364 76 M364 92 L378 98" className="stroke-fg-muted" strokeWidth="3" strokeLinecap="round" />
        <text x="204" y="78" textAnchor="middle" className="fill-fg text-[12px] font-bold">v = Weg / Zeit</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Geschwindigkeit verbindet eine Strecke mit der Zeit, in der sie zurueckgelegt wird.
      </figcaption>
    </figure>
  );
}

export interface TemperaturSchemaProps {
  className?: string;
}

/**
 * Visualisiert Temperatur und Temperaturdifferenz im Prozess.
 */
export function TemperaturSchema({ className }: TemperaturSchemaProps) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <svg viewBox="0 0 460 230" role="img" aria-labelledby="temperatur-title temperatur-desc" className="h-auto w-full">
        <title id="temperatur-title">Temperatur im Prozess</title>
        <desc id="temperatur-desc">Thermometer mit kaltem und warmem Bereich sowie Delta T als Temperaturdifferenz.</desc>
        <rect x="44" y="34" width="372" height="150" rx="10" className="fill-bg-subtle stroke-border" />
        <rect x="194" y="62" width="44" height="94" rx="22" className="fill-surface-raised stroke-primary" strokeWidth="3" />
        <circle cx="216" cy="154" r="24" className="fill-primary-subtle stroke-primary" strokeWidth="3" />
        <rect x="210" y="104" width="12" height="50" rx="6" className="fill-primary" />
        <text x="126" y="114" textAnchor="middle" className="fill-fg-muted text-[11px] font-semibold">kalt</text>
        <text x="316" y="114" textAnchor="middle" className="fill-fg-muted text-[11px] font-semibold">warm</text>
        <path d="M148 126 L188 126 M244 126 L284 126" className="stroke-fg-muted" strokeWidth="3" strokeLinecap="round" />
        <text x="216" y="50" textAnchor="middle" className="fill-fg text-[12px] font-bold">Delta T = Temperaturunterschied</text>
      </svg>
      <figcaption className="border-t border-border px-4 py-3 text-caption text-fg-muted">
        Temperaturwerte beschreiben Prozesszustand; Temperaturunterschiede zeigen Veraenderungen.
      </figcaption>
    </figure>
  );
}

/**
 * Erzeugt einen stabilen Fragment-Slug fuer Begriff-Links.
 */
function slug(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
}
