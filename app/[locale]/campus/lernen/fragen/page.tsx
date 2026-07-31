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

interface FragenTrainingSearchParams {
  status?: string | string[];
  limit?: string | string[];
  cuatal?: string | string[];
  topic?: string | string[];
}

/**
 * Zeigt entweder die Cuatal-Oberthemen oder eine gefilterte Fragenrunde.
 */
export default async function FragenTrainingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<FragenTrainingSearchParams>;
}) {
  const { locale } = await params;
  const { status, limit, cuatal, topic } = await searchParams;
  const gruppe = normalisiereFragenGruppe(status);
  const aktiverCuatalNummer = normalisiereCuatal(cuatal);
  const aktivesTopicId = ersterWert(topic);
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
    ? cuatals.find((block) => block.cuatal === aktiverCuatalNummer) ?? null
    : null;
  const ueberthemen = aktiverCuatal ? baueUeberthemen(aktiverCuatal) : [];
  const aktivesUeberthema = ueberthemen.find((item) => item.id === aktivesTopicId) ?? null;

  if (aktiverCuatal && !aktivesUeberthema) {
    return (
      <main className="mx-auto flex min-h-full max-w-2xl flex-col gap-3 p-3 sm:p-4">
        <header className="grid shrink-0 grid-cols-[1fr_auto] items-center gap-3 pt-1">
          <div className="min-w-0">
            <Link
              href={`/${locale}/campus/lernen`}
              aria-label="Zurueck zur Lern-Auswahl"
              className="touchable inline-flex min-h-10 items-center gap-1 rounded-md text-sm font-semibold text-primary"
            >
              <ZurueckIcon className="h-5 w-5" />
              <span>Zurueck</span>
            </Link>
            <p className="mt-2 text-xs font-bold uppercase text-primary">Fragen</p>
            <h1 className="truncate text-xl font-extrabold sm:text-2xl">Cuatal {aktiverCuatal.cuatal}</h1>
            <p className="text-sm text-fg-muted">Waehle ein Oberthema in diesem Cuatal.</p>
          </div>
          <ProgressRing
            value={aktiverCuatal.prozent}
            size={58}
            label={`Cuatal ${aktiverCuatal.cuatal} ${aktiverCuatal.prozent} Prozent`}
          />
        </header>

        <section className="min-h-0 flex-1 rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <h2 className="text-sm font-bold">Oberthemen</h2>
            <span className="text-xs font-semibold text-fg-muted">{aktiverCuatal.gesamt} Fragen</span>
          </div>
          {ueberthemen.length === 0 ? (
            <Card className="m-3">
              <p className="font-bold">Hier ist gerade nichts offen.</p>
            </Card>
          ) : (
            <div className="grid h-[calc(100%-41px)] grid-cols-2 grid-rows-2 gap-2 p-2">
              {ueberthemen.map((block) => (
                <Link
                  key={block.id}
                  href={baueFragenHref(locale, { cuatal: aktiverCuatal.cuatal, topic: block.id })}
                  className="touchable flex min-h-0 flex-col justify-between rounded-lg border border-primary-border bg-primary-subtle p-3"
                >
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-sm font-extrabold leading-tight">{block.bezeichnung}</h3>
                    <p className="mt-1 text-[11px] font-semibold text-fg-muted">
                      {block.themenIds.length} Kategorien
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-center">
                    <div className="rounded-md bg-surface/80 p-1.5">
                      <p className="zahlen text-base font-extrabold">{block.gesamt}</p>
                      <p className="text-[10px] font-semibold text-fg-muted">Fragen</p>
                    </div>
                    <div className="rounded-md bg-surface/80 p-1.5">
                      <p className="zahlen text-base font-extrabold text-danger">{block.falsch}</p>
                      <p className="text-[10px] font-semibold text-fg-muted">Fehler</p>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface" aria-hidden="true">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${block.prozent}%` }} />
                  </div>
                </Link>
              ))}
            </div>
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
    : `/${locale}/campus/lernen`;

  return (
    <main className="mx-auto flex min-h-full max-w-2xl flex-col gap-3 p-3 sm:p-4">
      <header className="grid shrink-0 grid-cols-[1fr_auto] items-center gap-3 pt-1">
        <div className="min-w-0">
          <Link
            href={zurueckHref}
            aria-label="Zurueck zur Lern-Auswahl"
            className="touchable inline-flex min-h-10 items-center gap-1 rounded-md text-sm font-semibold text-primary"
          >
            <ZurueckIcon className="h-5 w-5" />
            <span>Zurueck</span>
          </Link>
          <p className="mt-2 text-xs font-bold uppercase text-primary">Fragen</p>
          <h1 className="truncate text-xl font-extrabold sm:text-2xl">
            {fragenLimit && gruppe === 'falsch' ? `${fragenLimit} Fehler verbessern` : sessionLabel}
          </h1>
          <p className="text-sm text-fg-muted">{aktiveGruppe.beschreibung}</p>
        </div>
        <ProgressRing value={prozent} size={58} label={`Fragenfortschritt ${prozent} Prozent`} />
      </header>

      <nav aria-label="Fragenstatus" className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4">
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
                })}
                aria-current={aktiv ? 'page' : undefined}
                className={`touchable rounded-lg border px-3 py-2 text-sm font-semibold ${
                  aktiv
                    ? 'border-primary bg-primary text-fg-onPrimary'
                    : 'border-border bg-surface text-fg hover:border-primary'
                }`}
              >
                <span className="block text-base">{item.anzahl}</span>
                <span className="block truncate">{KURZE_GRUPPEN_LABELS[item.id]}</span>
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

/**
 * Gibt den ersten Query-Wert zurueck.
 */
function ersterWert(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Baut eine Fragen-URL mit optionalem Cuatal-, Oberthema- und Statusfilter.
 */
function baueFragenHref(
  locale: string,
  options: { cuatal?: number | null; topic?: string | null; status?: FragenGruppe | null },
): string {
  const params = new URLSearchParams();
  if (options.cuatal) params.set('cuatal', String(options.cuatal));
  if (options.topic) params.set('topic', options.topic);
  if (options.status) params.set('status', options.status);
  const query = params.toString();
  return query ? `/${locale}/campus/lernen/fragen?${query}` : `/${locale}/campus/lernen/fragen`;
}
