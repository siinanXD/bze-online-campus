import Link from 'next/link';
import { createServerSupabase } from '@bze/db/server';
import { Card, ProgressRing } from '@bze/ui';
import {
  baueCuatalBloecke,
  baueFragenGruppen,
  baueUeberthemen,
  filtereFragenGruppe,
  filtereFragenNachThemen,
  ladeFragenUebersicht,
  normalisiereCuatal,
  normalisiereFragenGruppe,
  sortiereFragenQueue,
  type FragenGruppe,
  type ThemaKategorie,
} from '../_lib/fragen';
import { FragenRunner } from '../thema/[themaId]/fragen-runner';
import { ZurueckIcon } from '@/components/shell/icons';

const KURZE_GRUPPEN_LABELS: Record<FragenGruppe, string> = {
  alle: 'Alle',
  falsch: 'Fehler',
  fast_fertig: 'Fast fertig',
  neu: 'Neu',
  abgeschlossen: 'Fertig',
};

type ThemenFilter = 'alle' | 'offen' | 'fehler' | 'beherrscht';

interface FragenTrainingSearchParams {
  status?: string | string[];
  limit?: string | string[];
  cuatal?: string | string[];
  topic?: string | string[];
  filter?: string | string[];
  starten?: string | string[];
}

/**
 * Figma 04.2 Themenliste oder gefilterte Fragenrunde (04.3–04.8 via Runner).
 */
export default async function FragenTrainingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<FragenTrainingSearchParams>;
}) {
  const { locale } = await params;
  const { status, limit, cuatal, topic, filter, starten } = await searchParams;
  const gruppe = normalisiereFragenGruppe(status);
  const aktiverCuatalNummer = normalisiereCuatal(cuatal);
  const aktivesTopicId = ersterWert(topic);
  const themenFilter = normalisiereThemenFilter(filter);
  const sessionStart = ersterWert(starten) === '1' || Boolean(status) || Boolean(limit);
  const limitRaw = ersterWert(limit);
  const limitValue = limitRaw ? Number.parseInt(limitRaw, 10) : null;
  const fragenLimit = limitValue && Number.isFinite(limitValue) ? Math.max(1, Math.min(20, limitValue)) : null;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const uebersicht = await ladeFragenUebersicht(user?.id ?? null);
  const cuatals = baueCuatalBloecke(uebersicht.themen);
  const aktiverCuatal = aktiverCuatalNummer
    ? (cuatals.find((block) => block.cuatal === aktiverCuatalNummer) ?? null)
    : null;
  const ueberthemen = aktiverCuatal ? baueUeberthemen(aktiverCuatal) : [];
  const aktivesUeberthema = ueberthemen.find((item) => item.id === aktivesTopicId) ?? null;
  const gesamtProzent =
    uebersicht.themen.length === 0
      ? 0
      : Math.round(
          (uebersicht.themen.reduce((s, t) => s + t.fertig, 0) /
            Math.max(
              1,
              uebersicht.themen.reduce((s, t) => s + t.gesamt, 0),
            )) *
            100,
        );

  // Figma 04.2: Themenliste, solange keine Session gestartet ist
  if (!aktiverCuatal && !aktivesTopicId && !sessionStart) {
    return (
      <ThemenlisteAnsicht
        locale={locale}
        themen={uebersicht.themen}
        filter={themenFilter}
        gesamtProzent={gesamtProzent}
      />
    );
  }

  if (aktiverCuatal && !aktivesUeberthema) {
    return (
      <main className="mx-auto flex min-h-full max-w-md flex-col gap-3 px-5 pb-6 pt-3">
        <header className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/${locale}/campus/lernen/fragen`}
              aria-label="Zurueck zur Themenliste"
              className="touchable inline-flex min-h-10 items-center gap-1 text-[16px] font-semibold text-primary"
            >
              <ZurueckIcon className="h-5 w-5" />
              <span>Fragen nach Thema</span>
            </Link>
            <h1 className="mt-2 truncate text-[20px] font-extrabold">Cuatal {aktiverCuatal.cuatal}</h1>
          </div>
          <ProgressRing
            value={aktiverCuatal.prozent}
            size={58}
            label={`Cuatal ${aktiverCuatal.cuatal} ${aktiverCuatal.prozent} Prozent`}
          />
        </header>

        <section className="flex flex-col gap-3">
          {ueberthemen.length === 0 ? (
            <Card>
              <p className="font-bold">Hier ist gerade nichts offen.</p>
            </Card>
          ) : (
            ueberthemen.map((block) => (
              <Link
                key={block.id}
                href={baueFragenHref(locale, { cuatal: aktiverCuatal.cuatal, topic: block.id, starten: true })}
                className="touchable flex items-center gap-3 rounded-[16px] border border-border bg-surface p-3"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-primary-subtle text-sm font-bold text-primary">
                  {block.prozent}%
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-fg">{block.bezeichnung}</p>
                  <p className="text-[12px] text-fg-muted">
                    {block.fertig}/{block.gesamt} · {block.falsch} Fehler
                  </p>
                </div>
                <span className="text-fg-subtle" aria-hidden>
                  ›
                </span>
              </Link>
            ))
          )}
        </section>
      </main>
    );
  }

  const scopedItems = aktivesUeberthema
    ? filtereFragenNachThemen(uebersicht.items, aktivesUeberthema.themenIds)
    : uebersicht.items;
  const scopedGruppen = baueFragenGruppen(scopedItems);
  const aktiveGruppe = scopedGruppen.find((item) => item.id === gruppe) ?? {
    id: 'alle' as const,
    label: 'Alle offenen Fragen',
    beschreibung: 'Falsche zuerst, dann neue und fast fertige Fragen.',
    anzahl: 0,
  };
  const items = filtereFragenGruppe(scopedItems, gruppe);
  const queue = fragenLimit ? sortiereFragenQueue(items).slice(0, fragenLimit) : sortiereFragenQueue(items);
  const offeneFragen = scopedGruppen.find((item) => item.id === 'alle')?.anzahl ?? 0;
  const gesamtFragen = scopedItems.length;
  const erledigt = Math.max(0, gesamtFragen - offeneFragen);
  const prozent = gesamtFragen === 0 ? 0 : Math.round((erledigt / gesamtFragen) * 100);
  const sessionLabel = aktivesUeberthema
    ? `${aktivesUeberthema.bezeichnung} · Cuatal ${aktiverCuatal?.cuatal ?? ''}`.trim()
    : aktiveGruppe.label;
  const zurueckHref = aktiverCuatal
    ? baueFragenHref(locale, { cuatal: aktiverCuatal.cuatal })
    : `/${locale}/campus/lernen/fragen`;

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-3 px-5 pb-6 pt-3">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={zurueckHref}
            aria-label="Zurueck zur Lern-Auswahl"
            className="touchable inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary"
          >
            <ZurueckIcon className="h-5 w-5" />
            <span>Zurueck</span>
          </Link>
          <h1 className="mt-1 truncate text-[20px] font-extrabold">
            {fragenLimit && gruppe === 'falsch' ? `${fragenLimit} Fehler verbessern` : sessionLabel}
          </h1>
          <p className="text-sm text-fg-muted">{aktiveGruppe.beschreibung}</p>
        </div>
        <ProgressRing value={prozent} size={58} label={`Fragenfortschritt ${prozent} Prozent`} />
      </header>

      <nav aria-label="Fragenstatus" className="flex gap-2 overflow-x-auto pb-1">
        {scopedGruppen
          .filter((item) => item.id !== 'abgeschlossen')
          .map((item) => {
            const aktiv = item.id === gruppe;
            return (
              <Link
                key={item.id}
                href={baueFragenHref(locale, {
                  cuatal: aktiverCuatal?.cuatal ?? null,
                  topic: aktivesUeberthema?.id ?? null,
                  status: item.id === 'alle' ? null : item.id,
                  starten: true,
                })}
                aria-current={aktiv ? 'page' : undefined}
                className={`touchable shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold ${
                  aktiv
                    ? 'border-primary bg-info-bg text-primary'
                    : 'border-border bg-surface text-fg-muted'
                }`}
              >
                {KURZE_GRUPPEN_LABELS[item.id]} ({item.anzahl})
              </Link>
            );
          })}
      </nav>

      <section className="min-h-0 flex-1">
        {queue.length === 0 ? (
          <Card>
            <p className="font-bold">Hier ist gerade nichts offen.</p>
            <p className="mt-1 text-sm text-fg-muted">
              Waehle eine andere Kategorie oder starte eine Pruefung.
            </p>
          </Card>
        ) : (
          <FragenRunner queue={queue} backHref={zurueckHref} sessionLabel={sessionLabel} />
        )}
      </section>
    </main>
  );
}

/** Figma 04.2 Themenliste mit Filter-Chips. */
function ThemenlisteAnsicht({
  locale,
  themen,
  filter,
  gesamtProzent,
}: {
  locale: string;
  themen: ThemaKategorie[];
  filter: ThemenFilter;
  gesamtProzent: number;
}) {
  const gefiltert = filtereThemen(themen, filter);
  const chips: { id: ThemenFilter; label: string }[] = [
    { id: 'alle', label: 'Alle' },
    { id: 'offen', label: 'Offen' },
    { id: 'fehler', label: 'Fehler' },
    { id: 'beherrscht', label: 'Beherrscht' },
  ];

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-3 px-5 pb-6 pt-3">
      <header className="flex items-center justify-between gap-3">
        <Link
          href={`/${locale}/campus/lernen`}
          className="touchable inline-flex min-h-10 items-center gap-1 text-[16px] font-semibold text-primary"
        >
          <ZurueckIcon className="h-5 w-5" />
          <span>Fragen nach Thema</span>
        </Link>
        <div
          className="flex size-9 items-center justify-center rounded-full bg-info-bg text-[12px] font-bold text-info"
          aria-label={`Fortschritt ${gesamtProzent} Prozent`}
        >
          {gesamtProzent}%
        </div>
      </header>

      <nav aria-label="Themenfilter" className="flex gap-2 overflow-x-auto pb-1">
        {chips.map((chip) => {
          const aktiv = chip.id === filter;
          return (
            <Link
              key={chip.id}
              href={
                chip.id === 'alle'
                  ? `/${locale}/campus/lernen/fragen`
                  : `/${locale}/campus/lernen/fragen?filter=${chip.id}`
              }
              aria-current={aktiv ? 'page' : undefined}
              className={`touchable shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold ${
                aktiv ? 'border-primary bg-info-bg text-primary' : 'border-border bg-surface text-fg-muted'
              }`}
            >
              {chip.label}
            </Link>
          );
        })}
      </nav>

      <section className="flex flex-col gap-3">
        {gefiltert.length === 0 ? (
          <Card>
            <p className="font-bold">Keine Themen in diesem Filter.</p>
          </Card>
        ) : (
          gefiltert.map((thema) => {
            const sterne = masterySterne(thema);
            const beherrscht = thema.gesamt > 0 && thema.fertig >= thema.gesamt;
            const gesperrt = thema.gesamt === 0;
            const prozent = thema.gesamt === 0 ? 0 : Math.round((thema.fertig / thema.gesamt) * 100);
            return (
              <Link
                key={thema.id}
                href={gesperrt ? `/${locale}/campus/lernen/fragen` : `/${locale}/campus/lernen/thema/${thema.id}`}
                aria-disabled={gesperrt || undefined}
                className={`touchable flex items-center gap-3 rounded-[16px] border border-border bg-surface p-3 ${
                  gesperrt ? 'pointer-events-none opacity-60' : ''
                }`}
              >
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                    beherrscht
                      ? 'bg-success-bg text-success'
                      : gesperrt
                        ? 'bg-bg-subtle text-fg-subtle'
                        : 'bg-info-bg text-info'
                  }`}
                >
                  {gesperrt ? '—' : beherrscht ? '✓' : `${prozent}%`}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`truncate text-[14px] font-bold ${gesperrt ? 'text-fg-subtle' : 'text-fg'}`}
                    >
                      {thema.bezeichnung}
                    </p>
                    <p className="shrink-0 text-[12px] font-semibold text-fg-muted">
                      {thema.fertig}/{thema.gesamt}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-[12px] text-warning" aria-label={`${sterne} von 3 Sternen`}>
                      {'★'.repeat(sterne)}
                      {'☆'.repeat(3 - sterne)}
                    </p>
                    {beherrscht ? (
                      <span className="rounded bg-success-bg px-2 py-0.5 text-[10px] font-bold text-success">
                        Beherrscht
                      </span>
                    ) : gesperrt ? null : (
                      <span className="h-1 w-[60px] overflow-hidden rounded-full bg-border" aria-hidden>
                        <span
                          className="block h-full rounded-full bg-primary"
                          style={{ width: `${prozent}%` }}
                        />
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-fg-subtle" aria-hidden>
                  ›
                </span>
              </Link>
            );
          })
        )}
      </section>

      <Link
        href={`/${locale}/campus/lernen/fragen?starten=1`}
        className="touchable mt-2 flex min-h-11 items-center justify-center rounded-full border border-border bg-surface text-[14px] font-bold text-fg"
      >
        Alle offenen Fragen starten
      </Link>
    </main>
  );
}

function filtereThemen(themen: ThemaKategorie[], filter: ThemenFilter): ThemaKategorie[] {
  switch (filter) {
    case 'offen':
      return themen.filter((t) => t.gesamt > 0 && t.fertig < t.gesamt);
    case 'fehler':
      return themen.filter((t) => t.falsch > 0);
    case 'beherrscht':
      return themen.filter((t) => t.gesamt > 0 && t.fertig >= t.gesamt);
    default:
      return themen;
  }
}

function masterySterne(thema: ThemaKategorie): 0 | 1 | 2 | 3 {
  if (thema.gesamt === 0) return 0;
  const ratio = thema.fertig / thema.gesamt;
  if (ratio >= 1) return 3;
  if (ratio >= 0.66) return 2;
  if (ratio >= 0.33) return 1;
  return 0;
}

function normalisiereThemenFilter(value: string | string[] | undefined): ThemenFilter {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === 'offen' || raw === 'fehler' || raw === 'beherrscht') return raw;
  return 'alle';
}

function ersterWert(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function baueFragenHref(
  locale: string,
  options: {
    cuatal?: number | null;
    topic?: string | null;
    status?: FragenGruppe | null;
    starten?: boolean;
  },
): string {
  const params = new URLSearchParams();
  if (options.cuatal) params.set('cuatal', String(options.cuatal));
  if (options.topic) params.set('topic', options.topic);
  if (options.status) params.set('status', options.status);
  if (options.starten) params.set('starten', '1');
  const query = params.toString();
  return query ? `/${locale}/campus/lernen/fragen?${query}` : `/${locale}/campus/lernen/fragen`;
}
