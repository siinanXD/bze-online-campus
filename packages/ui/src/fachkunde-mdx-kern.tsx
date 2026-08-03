import type { HTMLAttributes, ReactNode, AnchorHTMLAttributes } from 'react';
import { cn } from './cn';

/**
 * Schlanke MDX-Kernkomponenten fuer den Lerneinheit-Renderer.
 * Bewusst getrennt vom riesigen `fachkunde.tsx`-Katalog: dessen Voll-Import
 * loeste unter Next 15.5 / React 19 Dev HTTP-500
 * ("MDXContent without development properties") aus.
 */

export type Wissensstufe =
  | 'auswendig_wissen'
  | 'verstehen'
  | 'anwenden'
  | 'tabellenbuch_finden'
  | 'zusatzwissen';

const wissensstufen: Record<Wissensstufe, { label: string; kurz: string }> = {
  auswendig_wissen: { label: 'Muss ich auswendig wissen', kurz: 'Auswendig' },
  verstehen: { label: 'Muss ich verstehen', kurz: 'Verstehen' },
  anwenden: { label: 'Muss ich anwenden koennen', kurz: 'Anwenden' },
  tabellenbuch_finden: { label: 'Sollte ich im Tabellenbuch finden koennen', kurz: 'Tabellenbuch' },
  zusatzwissen: { label: 'Zusatzwissen', kurz: 'Zusatz' },
};

const WISSENSSTUFEN_LEISTE = [
  { stufe: 'auswendig_wissen' as const, nummer: '1', aktiv: 'border-[#1d8745] bg-[#f0fdf4] text-[#1d8745]' },
  { stufe: 'verstehen' as const, nummer: '2', aktiv: 'border-[#b45309] bg-[#fdf8ed] text-[#b45309]' },
  { stufe: 'anwenden' as const, nummer: '3', aktiv: 'border-[#1d4ed8] bg-[#eff6ff] text-[#1d4ed8]' },
  { stufe: 'tabellenbuch_finden' as const, nummer: '4', aktiv: 'border-[#78716c] bg-[#f5f5f4] text-[#78716c]' },
] as const;

const kastenStile = {
  story: 'border-[#1d4ed8] bg-[#eff6ff]',
  einfach: 'border-[#15803d] bg-[#f0fdf4]',
  fachlich: 'border-border bg-surface',
  praxis: 'border-primary-border bg-primary-subtle',
  merksatz: 'border-warning-border bg-warning-bg',
} as const;

const kastenLabelStil: Record<keyof typeof kastenStile, string> = {
  story: 'border-[#1d4ed8] text-[#1d4ed8]',
  einfach: 'border-[#15803d] text-[#15803d]',
  fachlich: 'border-border text-fg',
  praxis: 'border-primary text-primary',
  merksatz: 'border-warning text-warning',
};

const kastenLabels: Record<keyof typeof kastenStile, string> = {
  story: 'Story',
  einfach: 'Einfach',
  fachlich: 'Fachlich',
  praxis: 'Praxis',
  merksatz: 'Merksatz',
};

export interface FachkundeKastenProps extends HTMLAttributes<HTMLDivElement> {
  titel: string;
  variante: keyof typeof kastenStile;
  symbol: string;
}

export function FachkundeKasten({
  titel,
  variante,
  symbol: _symbol,
  className,
  children,
  ...props
}: FachkundeKastenProps) {
  return (
    <section
      className={cn('mb-0 flex flex-col gap-3 rounded-[14px] border p-5', kastenStile[variante], className)}
      {...props}
    >
      <div
        className={cn(
          'inline-flex w-fit items-start rounded-[6px] border bg-white px-2 py-1 text-[12px] font-semibold leading-4',
          kastenLabelStil[variante],
        )}
      >
        {kastenLabels[variante]}
      </div>
      <h3 className="text-[18px] font-semibold leading-[26px] text-fg">{titel}</h3>
      <div className="space-y-2 text-[14px] leading-[22px] text-fg-muted">{children}</div>
    </section>
  );
}

export function StoryEinstieg(props: Omit<FachkundeKastenProps, 'variante' | 'symbol'>) {
  return <FachkundeKasten variante="story" symbol="S" {...props} />;
}

export function EinfachErklaert(props: Omit<FachkundeKastenProps, 'variante' | 'symbol'>) {
  return <FachkundeKasten variante="einfach" symbol="E" {...props} />;
}

export function FachlichErklaert(props: Omit<FachkundeKastenProps, 'variante' | 'symbol'>) {
  return <FachkundeKasten variante="fachlich" symbol="F" {...props} />;
}

export function Praxisbeispiel(props: Omit<FachkundeKastenProps, 'variante' | 'symbol'>) {
  return <FachkundeKasten variante="praxis" symbol="P" {...props} />;
}

export function Merksatz(props: Omit<FachkundeKastenProps, 'variante' | 'symbol'>) {
  return <FachkundeKasten variante="merksatz" symbol="M" {...props} />;
}

export function WissensstufenLeiste({
  stufen,
  className,
}: {
  stufen: Wissensstufe[];
  className?: string;
}) {
  const aktiv = new Set(Array.isArray(stufen) ? stufen : []);

  return (
    <section
      className={cn('mb-0 flex flex-col gap-4 rounded-[14px] border border-border bg-surface p-5', className)}
      aria-label="Wissensstufen"
    >
      <h3 className="text-[18px] font-semibold leading-[26px] text-fg">Wissensstufen</h3>
      <div className="flex flex-wrap gap-2">
        {WISSENSSTUFEN_LEISTE.map((eintrag) => {
          const istAktiv = aktiv.has(eintrag.stufe);
          return (
            <div
              key={eintrag.stufe}
              className={cn(
                'flex h-12 w-11 items-center justify-center rounded-[10px] border',
                istAktiv ? eintrag.aktiv : 'border-border bg-bg-subtle text-fg-subtle opacity-55',
              )}
              title={wissensstufen[eintrag.stufe].label}
              aria-label={`${eintrag.nummer}: ${wissensstufen[eintrag.stufe].label}${istAktiv ? '' : ' (nicht markiert)'}`}
            >
              <span className="text-base font-bold leading-6">{eintrag.nummer}</span>
              <span className="sr-only">{wissensstufen[eintrag.stufe].kurz}</span>
            </div>
          );
        })}
      </div>
      <p className="text-[14px] leading-[22px] text-fg-muted">
        Auswendig → verstehen → anwenden → Tabellenbuch.
      </p>
    </section>
  );
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function BegriffChip({
  begriff,
  className,
  href,
  ...props
}: { begriff: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
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

export function BegriffListe({ begriffe, className }: { begriffe: string[]; className?: string }) {
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

export function TabellenbuchHinweis({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mb-4 rounded-lg border border-warning-border bg-warning-bg/45 p-4 text-body-sm text-fg', className)}>
      <p className="mb-1 font-bold">Tabellenbuch-Hinweis</p>
      <div className="leading-relaxed text-fg-muted">{children}</div>
    </div>
  );
}

export interface FormelkarteProps {
  /** Vollform: Anzeigename der Formel. */
  name?: string;
  /** Kurzform: alternativer Titel (MDX-Content). */
  titel?: string;
  formel: string;
  einheiten?: string;
  verwendung?: string;
  beispiel?: string;
  typischerFehler?: string;
  tabellenbuchHinweis?: string;
  /** Kurzform: Erklaerungstext als Prop. */
  erklaerung?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Flexible Formelkarte fuer MDX: akzeptiert Vollform (name + Felder) und Kurzform (titel/formel + children).
 */
export function Formelkarte({
  name,
  titel,
  formel,
  einheiten,
  verwendung,
  beispiel,
  typischerFehler,
  tabellenbuchHinweis,
  erklaerung,
  children,
  className,
}: FormelkarteProps) {
  const anzeigeTitel = name ?? titel ?? 'Formel';
  const hatDetailfelder = Boolean(einheiten || verwendung || beispiel || typischerFehler || tabellenbuchHinweis);

  return (
    <section
      className={cn(
        'mb-4 overflow-hidden rounded-[14px] border border-info-border bg-info-bg/35 p-5',
        className,
      )}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-[18px] font-semibold leading-[26px] text-fg">{anzeigeTitel}</h3>
        <span className="inline-flex items-center rounded-[6px] border border-info-border bg-white px-2 py-1 text-[12px] font-semibold text-info">
          Formel
        </span>
      </div>
      <p className="mb-3 rounded-[10px] border border-border bg-surface p-3 text-center font-mono text-body-lg text-fg">
        {formel}
      </p>
      {hatDetailfelder ? (
        <dl className="space-y-2 text-body-sm text-fg">
          {einheiten ? (
            <div>
              <dt className="font-semibold">Einheiten</dt>
              <dd className="text-fg-muted">{einheiten}</dd>
            </div>
          ) : null}
          {verwendung ? (
            <div>
              <dt className="font-semibold">Wann verwenden?</dt>
              <dd className="text-fg-muted">{verwendung}</dd>
            </div>
          ) : null}
          {beispiel ? (
            <div>
              <dt className="font-semibold">Beispiel</dt>
              <dd className="text-fg-muted">{beispiel}</dd>
            </div>
          ) : null}
          {typischerFehler ? (
            <div>
              <dt className="font-semibold">Typischer Fehler</dt>
              <dd className="text-fg-muted">{typischerFehler}</dd>
            </div>
          ) : null}
          {tabellenbuchHinweis ? (
            <div>
              <dt className="font-semibold">Tabellenbuch</dt>
              <dd className="text-fg-muted">{tabellenbuchHinweis}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
      {erklaerung || children ? (
        <div className="mt-3 space-y-2 text-[14px] leading-[22px] text-fg-muted">
          {erklaerung ? <p>{erklaerung}</p> : null}
          {children}
        </div>
      ) : null}
    </section>
  );
}

const MESSCHIEBER_HOTSPOTS = [
  { nr: '1', label: 'fester Messschenkel (Aussenmessung)' },
  { nr: '2', label: 'beweglicher Messschenkel' },
  { nr: '3', label: 'Nonius / Schieber' },
  { nr: '4', label: 'Nonius-Skala (Ablesung)' },
  { nr: '5', label: 'Feststellschraube' },
  { nr: '6', label: 'Tiefenstange' },
] as const;

/**
 * Messschieber-Aufbau nach Figma 00.25 — Labels als editierbarer UI-Text.
 * Ablesebeispiel ist Uebungswert, keine verbindliche Quellenangabe.
 */
export function MessschieberSchema({ className }: { className?: string }) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-[14px] border border-border bg-surface p-5', className)}>
      <header className="mb-4 flex flex-col gap-1">
        <p className="text-[18px] font-semibold leading-[26px] text-fg">Messschieber — Aufbau &amp; Ablesung</p>
        <p className="text-[13px] leading-5 text-fg-muted">
          Unterweisung Laengenprueftechnik · Beispielablesung (Uebungswert)
        </p>
      </header>

      <svg
        viewBox="0 0 420 200"
        role="img"
        aria-labelledby="messschieber-title messschieber-desc"
        className="h-auto w-full rounded-[10px] border border-border bg-bg-subtle"
      >
        <title id="messschieber-title">Messschieber mit nummerierten Bauteilen</title>
        <desc id="messschieber-desc">
          Vereinfachter Messschieber: feste und bewegliche Messschenkel, Hauptskala, Nonius, Feststellschraube und
          Tiefenstange.
        </desc>
        {/* Schiene / Hauptskala */}
        <rect x="40" y="88" width="280" height="28" rx="3" className="fill-surface stroke-border-strong" strokeWidth="1.5" />
        {/* Tiefenstange */}
        <rect x="320" y="96" width="60" height="12" className="fill-fg-muted" />
        {/* Feste Backe */}
        <path d="M40 88 L40 36 L68 88 Z" className="fill-surface stroke-border-strong" strokeWidth="1.5" />
        <path d="M40 116 L40 176 L68 116 Z" className="fill-surface stroke-border-strong" strokeWidth="1.5" />
        {/* Schieber */}
        <rect x="168" y="80" width="78" height="44" rx="4" className="fill-primary-subtle stroke-primary-border" strokeWidth="1.5" />
        <path d="M168 80 L168 36 L194 80 Z" className="fill-primary-subtle stroke-primary-border" strokeWidth="1.5" />
        <path d="M168 124 L168 176 L196 124 Z" className="fill-primary-subtle stroke-primary-border" strokeWidth="1.5" />
        {/* Feststellschraube */}
        <circle cx="210" cy="68" r="7" className="fill-fg-muted" />
        {/* Skalenstriche (vereinfacht) */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`h-${i}`}
            x1={52 + i * 50}
            y1={88}
            x2={52 + i * 50}
            y2={98}
            className="stroke-fg"
            strokeWidth="1.5"
          />
        ))}
        <text x="48" y="112" className="fill-fg-muted text-[9px]">
          0
        </text>
        <text x="148" y="112" className="fill-fg-muted text-[9px]">
          20
        </text>
        <text x="248" y="112" className="fill-fg-muted text-[9px]">
          40
        </text>
        {/* Hotspot-Nummern */}
        {[
          { nr: '1', x: 28, y: 168 },
          { nr: '2', x: 156, y: 168 },
          { nr: '3', x: 248, y: 72 },
          { nr: '4', x: 210, y: 148 },
          { nr: '5', x: 232, y: 52 },
          { nr: '6', x: 372, y: 118 },
        ].map((h) => (
          <g key={h.nr}>
            <circle cx={h.x} cy={h.y} r="11" className="fill-primary" />
            <text
              x={h.x}
              y={h.y + 4}
              textAnchor="middle"
              className="fill-white text-[11px] font-bold"
            >
              {h.nr}
            </text>
          </g>
        ))}
      </svg>

      <ol className="mt-4 grid gap-2 sm:grid-cols-2">
        {MESSCHIEBER_HOTSPOTS.map((teil) => (
          <li key={teil.nr} className="flex items-start gap-2 text-[13px] leading-5 text-fg">
            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
              {teil.nr}
            </span>
            <span>{teil.label}</span>
          </li>
        ))}
      </ol>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="rounded-[10px] bg-bg-subtle px-3 py-2 text-[12px] text-fg-muted">
          <span className="font-semibold text-fg">Messgenauigkeit (Beispiel): </span>
          <span className="font-medium text-primary">±0,05 mm (Standard-Messschieber)</span>
        </div>
        <div className="flex-1 rounded-[10px] border border-border bg-white p-3 shadow-sm">
          <p className="mb-2 text-[13px] font-bold text-fg">Ablesebeispiel (Uebung)</p>
          <dl className="space-y-1 text-[11px]">
            <div className="flex justify-between gap-2">
              <dt className="text-fg-muted">Hauptskala (vor 0):</dt>
              <dd className="font-semibold text-fg">23 mm</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-fg-muted">Strichdeckung (Nonius 5):</dt>
              <dd className="font-semibold text-fg">5 × 0,1 mm = 0,5 mm</dd>
            </div>
            <div className="flex justify-between gap-2 border-t border-border pt-1">
              <dt className="font-bold text-fg">Messwert:</dt>
              <dd className="font-bold text-primary">23,5 mm</dd>
            </div>
          </dl>
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-5 text-fg-muted">
        Beschriftungen und Beispielwerte sind UI-Text — verbindliche Werte immer aus Zeichnung oder Tabellenbuch.
      </figcaption>
    </figure>
  );
}

const PASSUNGSARTEN = [
  {
    name: 'Spielpassung',
    beispiel: 'H7 / f7',
    text: 'Mindestmass der Bohrung ist stets groesser als Maximalmass der Welle.',
  },
  {
    name: 'Uebergangspassung',
    beispiel: 'H7 / k6',
    text: 'Je nach Istmass entsteht beim Fuegen Spiel oder Ueberdeckung.',
  },
  {
    name: 'Presspassung',
    beispiel: 'H7 / p6',
    text: 'Bohrung ist im Kleinstmass kleiner als Welle im Hoechstmass.',
  },
] as const;

/**
 * ISO-Toleranzfeld nach Figma 00.26 — Zonen und Formeln als editierbarer Text.
 * Abweichungswerte sind Lehrbeispiel, keine Tabellenbuch-Fundstelle.
 */
export function ToleranzfeldSchema({ className }: { className?: string }) {
  return (
    <figure className={cn('mb-4 overflow-hidden rounded-[14px] border border-border bg-surface p-5', className)}>
      <header className="mb-4 flex flex-col gap-1">
        <p className="text-[18px] font-semibold leading-[26px] text-fg">Toleranzfeld — ISO-Toleranzsystem</p>
        <p className="text-[13px] leading-5 text-fg-muted">
          Bohrungen (Grossbuchstaben) und Wellen (Kleinbuchstaben) · Lehrbeispiel
        </p>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row">
        <svg
          viewBox="0 0 320 220"
          role="img"
          aria-labelledby="toleranzfeld-title"
          className="h-auto w-full flex-1 rounded-[10px] border border-border bg-white"
        >
          <title id="toleranzfeld-title">Toleranzfeld mit Nulllinie, H7-, f7- und g6-Zone</title>
          {/* Achsen */}
          <line x1="48" y1="20" x2="48" y2="200" className="stroke-border-strong" strokeWidth="2" />
          <line x1="40" y1="110" x2="300" y2="110" className="stroke-fg" strokeWidth="2.5" />
          <text x="200" y="104" className="fill-fg text-[10px] font-bold">
            Nulllinie = Nennmass
          </text>
          <text x="8" y="28" className="fill-fg-muted text-[10px] font-semibold">
            Abmass
          </text>
          <text x="18" y="48" className="fill-fg-muted text-[9px]">
            +40
          </text>
          <text x="18" y="78" className="fill-fg-muted text-[9px]">
            +20
          </text>
          <text x="28" y="114" className="fill-fg-muted text-[9px]">
            0
          </text>
          <text x="18" y="148" className="fill-fg-muted text-[9px]">
            −20
          </text>
          <text x="18" y="178" className="fill-fg-muted text-[9px]">
            −40
          </text>
          {/* H7 Bohrung */}
          <rect x="70" y="70" width="56" height="40" className="fill-success/15 stroke-success" strokeWidth="1.5" />
          <text x="86" y="94" className="fill-success text-[12px] font-bold">
            H7
          </text>
          <text x="70" y="64" className="fill-success text-[10px] font-bold">
            Bohrung (H)
          </text>
          <text x="132" y="94" className="fill-success text-[10px] font-semibold">
            +25
          </text>
          {/* f7 Welle */}
          <rect x="150" y="140" width="56" height="40" className="fill-primary/15 stroke-primary" strokeWidth="1.5" />
          <text x="168" y="164" className="fill-primary text-[12px] font-bold">
            f7
          </text>
          <text x="150" y="192" className="fill-primary text-[10px] font-bold">
            Welle (f)
          </text>
          {/* g6 Welle */}
          <rect x="230" y="122" width="56" height="28" className="fill-[#7c3aed]/15 stroke-[#7c3aed]" strokeWidth="1.5" />
          <text x="246" y="140" className="fill-[#7c3aed] text-[12px] font-bold">
            g6
          </text>
          <text x="230" y="164" className="fill-[#7c3aed] text-[10px] font-bold">
            Welle (g)
          </text>
          <text x="290" y="140" className="fill-[#7c3aed] text-[10px] font-semibold">
            −25
          </text>
        </svg>

        <div className="flex w-full flex-col gap-2 lg:max-w-[220px]">
          <p className="text-[11px] font-bold uppercase tracking-wide text-fg-muted">Passungsarten</p>
          {PASSUNGSARTEN.map((art) => (
            <div key={art.name} className="rounded-[10px] border border-border bg-white p-3">
              <p className="text-[12px] font-bold text-fg">{art.name}</p>
              <p className="text-[11px] font-semibold text-primary">{art.beispiel}</p>
              <p className="mt-1 text-[10px] leading-4 text-fg-muted">{art.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[12px] bg-bg-subtle px-3 py-2 text-[12px]">
        <div className="flex flex-wrap gap-4">
          <span className="inline-flex items-center gap-1.5 text-fg-muted">
            <span className="size-3 rounded-sm bg-success" aria-hidden />
            Bohrung (Innenteil)
          </span>
          <span className="inline-flex items-center gap-1.5 text-fg-muted">
            <span className="size-3 rounded-sm bg-primary" aria-hidden />
            Welle (Aussenteil)
          </span>
        </div>
        <p className="text-fg-muted">
          <span className="font-bold text-fg">Formeln: </span>
          T = ES − EI · Spiel = EI (Bohrung) − es (Welle)
        </p>
      </div>
      <figcaption className="mt-3 text-[13px] leading-5 text-fg-muted">
        Abmasse und Passungsbeispiele sind Lehrillustration — verbindliche Werte aus Tabellenbuch oder Zeichnung.
      </figcaption>
    </figure>
  );
}

const ZYKLUS_PHASEN = [
  { name: 'Schliessen', dauer: '2,5 s', anteil: '7,8 %', farbe: 'bg-primary' },
  { name: 'Einspritzen', dauer: '3,0 s', anteil: '9,4 %', farbe: 'bg-success' },
  { name: 'Nachdruecken', dauer: '5,0 s', anteil: '15,6 %', farbe: 'bg-warning' },
  { name: 'Kuehlen', dauer: '18,0 s', anteil: '56,3 %', farbe: 'bg-[#0891b2]' },
  { name: 'Oeffnen / Auswerfen', dauer: '3,5 s', anteil: '10,9 %', farbe: 'bg-[#7c3aed]' },
] as const;

const PROZESS_PARAMETER = [
  { name: 'Schmelzetemperatur', wert: '220–260 °C' },
  { name: 'Werkzeugtemperatur', wert: '40–80 °C' },
  { name: 'Einspritzdruck', wert: '800–1200 bar' },
  { name: 'Nachdruck', wert: '400–600 bar' },
] as const;

/**
 * Spritzgiesszyklus nach Figma 00.27 — Phasen und Parameter als editierbarer Text.
 * Zeiten/Temperaturen/Druecke sind Lehrbeispiel, keine verbindliche Quellenangabe.
 */
export function SpritzgiesszyklusSchema({ className }: { className?: string }) {
  const donut = [
    { farbe: '#2563eb', dash: '18 82', offset: 0 },
    { farbe: '#16a34a', dash: '22 78', offset: 18 },
    { farbe: '#d97706', dash: '28 72', offset: 40 },
    { farbe: '#0891b2', dash: '48 52', offset: 68 },
    { farbe: '#7c3aed', dash: '20 80', offset: 116 },
  ] as const;

  return (
    <figure className={cn('mb-4 overflow-hidden rounded-[14px] border border-border bg-surface p-5', className)}>
      <header className="mb-4 flex flex-col gap-1">
        <p className="text-[18px] font-semibold leading-[26px] text-fg">Spritzgiesszyklus — Prozessablauf</p>
        <p className="text-[13px] leading-5 text-fg-muted">
          Zeitliche Zusammensetzung eines Zyklus · Lehrbeispiel (Gesamt 32 s)
        </p>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-1 flex-col items-center rounded-[12px] border border-border bg-white p-4">
          <svg viewBox="0 0 160 160" role="img" aria-labelledby="zyklus-title" className="size-40">
            <title id="zyklus-title">Donut-Diagramm Zykluszeit 32 Sekunden</title>
            <circle cx="80" cy="80" r="58" fill="none" stroke="#e2e8f0" strokeWidth="22" />
            {donut.map((seg) => (
              <circle
                key={seg.farbe}
                cx="80"
                cy="80"
                r="58"
                fill="none"
                stroke={seg.farbe}
                strokeWidth="22"
                strokeDasharray={seg.dash}
                strokeDashoffset={-seg.offset}
                transform="rotate(-90 80 80)"
              />
            ))}
            <text x="80" y="74" textAnchor="middle" className="fill-fg-muted text-[9px] font-semibold uppercase">
              Zykluszeit
            </text>
            <text x="80" y="96" textAnchor="middle" className="fill-fg text-[22px] font-extrabold">
              32 s
            </text>
          </svg>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            {ZYKLUS_PHASEN.map((p) => (
              <span key={p.name} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-fg-muted">
                <span className={cn('size-2.5 rounded-sm', p.farbe)} aria-hidden />
                {p.dauer}
              </span>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 lg:max-w-[260px]">
          <p className="text-[11px] font-bold uppercase tracking-wide text-fg-muted">Prozessparameter (Beispiel)</p>
          <div className="rounded-[10px] border border-border bg-white p-3">
            <dl className="space-y-2">
              {PROZESS_PARAMETER.map((p) => (
                <div key={p.name} className="flex items-center justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0">
                  <dt className="text-[11px] text-fg-muted">{p.name}</dt>
                  <dd className="text-[12px] font-bold text-fg">{p.wert}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ul className="space-y-1.5">
            {ZYKLUS_PHASEN.slice(0, 3).map((p, i) => (
              <li key={p.name} className="flex items-center gap-2 rounded-[8px] border border-border bg-white px-2.5 py-2">
                <span className={cn('size-6 shrink-0 rounded-md', p.farbe, 'opacity-20')} aria-hidden />
                <div>
                  <p className="text-[11px] font-bold text-fg">
                    {i + 1}. {p.name}
                  </p>
                  <p className="text-[10px] text-fg-muted">Anteil: {p.anteil} der Gesamtzykluszeit</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-[12px] border border-border bg-bg-subtle p-3 sm:flex-row sm:items-center">
        <div className="shrink-0">
          <p className="text-[11px] font-bold uppercase text-fg-muted">Schnittmodell</p>
          <p className="text-[10px] text-fg-muted">Plastifiziereinheit</p>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-[11px] font-semibold text-fg">
          <span>Trichter</span>
          <span className="text-fg-muted" aria-hidden>
            →
          </span>
          <span className="rounded border border-border bg-white px-2 py-0.5">Schneckenkolben</span>
          <span className="text-fg-muted" aria-hidden>
            →
          </span>
          <span>Duese</span>
          <span className="text-fg-muted" aria-hidden>
            →
          </span>
          <span className="rounded border border-primary bg-primary-subtle px-2 py-0.5 text-primary">Formwerkzeug</span>
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-5 text-fg-muted">
        Zeiten und Parameter sind Lehrbeispiel — verbindliche Prozesswerte aus Betriebsvorgabe oder Datenblatt.
      </figcaption>
    </figure>
  );
}

/** Generischer Schema-Platzhalter fuer noch nicht in den Kern uebernommene Visuals. */
export function SchemaPlatzhalter({ titel, className }: { titel?: string; className?: string }) {
  return (
    <figure className={cn('mb-4 rounded-lg border border-border bg-surface p-4', className)}>
      <p className="text-label font-bold text-fg">{titel ?? 'Schema'}</p>
      <p className="mt-1 text-caption text-fg-muted">Visual folgt — Inhalt der Einheit bleibt lesbar.</p>
    </figure>
  );
}

/** Platzhalter fuer Client-Trainer / Mini-Wissenscheck (kein Client-Bundle im MDX-Map). */
export function InteraktivPlatzhalter({
  titel,
  children,
}: {
  titel?: string;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  return (
    <aside className="mb-4 rounded-lg border border-dashed border-border bg-bg-subtle p-4 text-body-sm text-fg-muted">
      <p className="font-semibold text-fg">{titel ?? 'Interaktive Uebung'}</p>
      <p className="mt-1">Interaktiver Baustein folgt — der Lesetext darueber und darunter bleibt nutzbar.</p>
      {children}
    </aside>
  );
}
