import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';
import { ladeAdminSitzung } from '../_lib/auth';
import { MonitoringFilter } from './filter';
import { BudgetBadge, type BudgetStatus } from './budget-badge';

export const dynamic = 'force-dynamic';

type Zeitraum = 'tag' | 'woche' | 'monat';

interface Kennzahlen {
  aufrufe: number;
  fehler: number;
  cache_treffer: number;
  kosten_eur: number | string;
  p95_latenz_ms: number;
  avg_latenz_ms: number;
}
interface TrendZeile {
  bucket: string;
  aufrufe: number;
  fehler: number;
  cache_treffer: number;
  kosten_eur: number | string;
}
interface FunktionZeile {
  funktion: string;
  aufrufe: number;
  fehler: number;
  kosten_eur: number | string;
}
interface TraegerZeile {
  traeger_id: string | null;
  name: string | null;
  aufrufe: number;
  fehler: number;
  kosten_eur: number | string;
}
interface KohorteZeile {
  kohorte_id: string;
  bezeichnung: string | null;
  aufrufe: number;
  kosten_eur: number | string;
}
interface NutzerZeile {
  user_id: string;
  benutzername: string | null;
  vorname: string | null;
  nachname: string | null;
  aufrufe: number;
  fehler: number;
  kosten_eur: number | string;
}
interface BudgetZeile {
  traeger_id: string;
  name: string | null;
  budget_eur: number | string;
  kosten_monat_eur: number | string;
}

function berechneFenster(zeitraum: Zeitraum): { von: string; bis: string } {
  const jetzt = new Date();
  const bis = jetzt.toISOString();
  let von: Date;
  if (zeitraum === 'woche') {
    von = new Date(jetzt);
    von.setUTCDate(von.getUTCDate() - 7 * 12);
  } else if (zeitraum === 'monat') {
    von = new Date(Date.UTC(jetzt.getUTCFullYear(), jetzt.getUTCMonth() - 11, 1));
  } else {
    von = new Date(Date.UTC(jetzt.getUTCFullYear(), jetzt.getUTCMonth(), jetzt.getUTCDate() - 29));
  }
  return { von: von.toISOString(), bis };
}

function budgetStatus(kosten: number, budget: number): BudgetStatus {
  if (!(budget > 0)) return 'keinBudget';
  const anteil = kosten / budget;
  if (anteil >= 1) return 'ueberschritten';
  if (anteil >= 0.8) return 'warnung';
  return 'ok';
}

export default async function MonitoringPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ zeitraum?: string; funktion?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations('admin.monitoring');
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return null;

  const zeitraum: Zeitraum =
    sp.zeitraum === 'tag' || sp.zeitraum === 'woche' ? sp.zeitraum : sp.zeitraum === 'monat' ? 'monat' : 'monat';
  const funktion = (sp.funktion ?? '').trim();
  const funktionParam = funktion || null;
  const { von, bis } = berechneFenster(zeitraum);
  const { supabase } = sitzung;

  const [kennzahlenR, trendR, funktionR, traegerR, kohorteR, nutzerR, budgetR] = await Promise.all([
    supabase.rpc('ki_kennzahlen', { p_von: von, p_bis: bis, p_funktion: funktionParam }),
    supabase.rpc('ki_trend', { p_von: von, p_bis: bis, p_granularitaet: zeitraum, p_funktion: funktionParam }),
    supabase.rpc('ki_nach_funktion', { p_von: von, p_bis: bis }),
    supabase.rpc('ki_nach_traeger', { p_von: von, p_bis: bis, p_funktion: funktionParam }),
    supabase.rpc('ki_nach_kohorte', { p_von: von, p_bis: bis, p_funktion: funktionParam }),
    supabase.rpc('ki_top_nutzer', { p_von: von, p_bis: bis, p_funktion: funktionParam, p_limit: 20 }),
    supabase.rpc('ki_budget', {}),
  ]);

  const ladefehler = Boolean(kennzahlenR.error && trendR.error && budgetR.error);

  const kennzahlen: Kennzahlen =
    (kennzahlenR.data?.[0] as Kennzahlen | undefined) ?? {
      aufrufe: 0,
      fehler: 0,
      cache_treffer: 0,
      kosten_eur: 0,
      p95_latenz_ms: 0,
      avg_latenz_ms: 0,
    };
  const trend = (trendR.data ?? []) as TrendZeile[];
  const funktionen = (funktionR.data ?? []) as FunktionZeile[];
  const traeger = (traegerR.data ?? []) as TraegerZeile[];
  const kohorten = (kohorteR.data ?? []) as KohorteZeile[];
  const nutzer = (nutzerR.data ?? []) as NutzerZeile[];
  const budget = (budgetR.data ?? []) as BudgetZeile[];

  const num = (w: number | string | null | undefined) => Number(w ?? 0) || 0;
  const eur = (w: number | string | null | undefined) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(num(w));
  const zahl = (w: number | string | null | undefined) => new Intl.NumberFormat(locale).format(num(w));
  const prozent = (teil: number, ganz: number) =>
    new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(ganz > 0 ? teil / ganz : 0);
  const ms = (w: number | string | null | undefined) => `${zahl(Math.round(num(w)))} ms`;

  const bucketLabel = (iso: string) => {
    const d = new Date(iso);
    if (zeitraum === 'monat') return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(d);
    if (zeitraum === 'woche')
      return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
    return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit' }).format(d);
  };

  const nutzerName = (n: NutzerZeile) => {
    const voll = `${n.vorname ?? ''} ${n.nachname ?? ''}`.trim();
    return voll || n.benutzername || t('unbekannterNutzer');
  };

  const kennzahlKarten = [
    { label: t('kennzahl.kosten'), wert: eur(kennzahlen.kosten_eur) },
    { label: t('kennzahl.aufrufe'), wert: zahl(kennzahlen.aufrufe) },
    { label: t('kennzahl.fehlerquote'), wert: prozent(num(kennzahlen.fehler), num(kennzahlen.aufrufe)) },
    { label: t('kennzahl.cacheQuote'), wert: prozent(num(kennzahlen.cache_treffer), num(kennzahlen.aufrufe)) },
    { label: t('kennzahl.p95'), wert: ms(kennzahlen.p95_latenz_ms) },
    { label: t('kennzahl.durchschnitt'), wert: ms(kennzahlen.avg_latenz_ms) },
  ];

  const tabellenKopf = 'px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-fg-muted';
  const zelle = 'px-4 py-3';
  const zahlZelle = 'px-4 py-3 text-end tabular-nums';

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">{t('titel')}</h2>
        <p className="mt-1 text-sm text-fg-muted">{t('einleitung')}</p>
      </div>

      <p className="rounded-xl border border-border bg-surface px-3 py-2 text-xs text-fg-muted">
        {t('hinweisLernfeedback')}
      </p>

      <Card>
        <MonitoringFilter zeitraum={zeitraum} funktion={funktion} funktionen={funktionen.map((f) => f.funktion)} />
      </Card>

      {ladefehler && (
        <Card>
          <p className="text-sm text-status-falsch">{t('leer')}</p>
        </Card>
      )}

      {/* Kennzahlen */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {kennzahlKarten.map((k) => (
          <Card key={k.label} className="p-4">
            <p className="text-xs text-fg-muted">{k.label}</p>
            <p className="mt-1 text-xl font-extrabold tabular-nums">{k.wert}</p>
          </Card>
        ))}
      </div>
      <p className="text-xs text-fg-muted">{t('cacheHinweis')}</p>

      {/* Budget */}
      <Card className="overflow-x-auto p-0">
        <div className="p-4 pb-0">
          <h3 className="text-base font-bold">{t('budget.titel')}</h3>
        </div>
        {budget.length === 0 ? (
          <p className="p-4 text-sm text-fg-muted">{t('budget.leer')}</p>
        ) : (
          <table className="mt-2 w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className={tabellenKopf}>{t('budget.traeger')}</th>
                <th className={`${tabellenKopf} text-end`}>{t('budget.budget')}</th>
                <th className={`${tabellenKopf} text-end`}>{t('budget.verbraucht')}</th>
                <th className={`${tabellenKopf} text-end`}>{t('budget.auslastung')}</th>
                <th className={tabellenKopf}>{t('budget.status')}</th>
              </tr>
            </thead>
            <tbody>
              {budget.map((b) => {
                const kosten = num(b.kosten_monat_eur);
                const bud = num(b.budget_eur);
                const status = budgetStatus(kosten, bud);
                return (
                  <tr key={b.traeger_id} className="border-b border-border last:border-0">
                    <td className={`${zelle} font-semibold`}>{b.name ?? t('ohneTraeger')}</td>
                    <td className={zahlZelle}>{bud > 0 ? eur(bud) : '—'}</td>
                    <td className={zahlZelle}>{eur(kosten)}</td>
                    <td className={zahlZelle}>{bud > 0 ? prozent(kosten, bud) : '—'}</td>
                    <td className={zelle}>
                      <BudgetBadge status={status} label={t(`budget.${status}`)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      {/* Kostenverlauf */}
      <Card className="overflow-x-auto p-0">
        <div className="p-4 pb-0">
          <h3 className="text-base font-bold">{t('trend.titel')}</h3>
        </div>
        {trend.length === 0 ? (
          <p className="p-4 text-sm text-fg-muted">{t('leer')}</p>
        ) : (
          <table className="mt-2 w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className={tabellenKopf}>{t('trend.bucket')}</th>
                <th className={`${tabellenKopf} text-end`}>{t('trend.kosten')}</th>
                <th className={`${tabellenKopf} text-end`}>{t('trend.aufrufe')}</th>
                <th className={`${tabellenKopf} text-end`}>{t('trend.fehler')}</th>
                <th className={`${tabellenKopf} text-end`}>{t('trend.cache')}</th>
              </tr>
            </thead>
            <tbody>
              {trend.map((z) => (
                <tr key={z.bucket} className="border-b border-border last:border-0">
                  <td className={`${zelle} whitespace-nowrap font-semibold`}>{bucketLabel(z.bucket)}</td>
                  <td className={zahlZelle}>{eur(z.kosten_eur)}</td>
                  <td className={zahlZelle}>{zahl(z.aufrufe)}</td>
                  <td className={zahlZelle}>{zahl(z.fehler)}</td>
                  <td className={zahlZelle}>{zahl(z.cache_treffer)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Nach Funktion */}
        <Card className="overflow-x-auto p-0">
          <div className="p-4 pb-0">
            <h3 className="text-base font-bold">{t('nachFunktion.titel')}</h3>
          </div>
          {funktionen.length === 0 ? (
            <p className="p-4 text-sm text-fg-muted">{t('leer')}</p>
          ) : (
            <table className="mt-2 w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className={tabellenKopf}>{t('nachFunktion.funktion')}</th>
                  <th className={`${tabellenKopf} text-end`}>{t('nachFunktion.aufrufe')}</th>
                  <th className={`${tabellenKopf} text-end`}>{t('nachFunktion.fehler')}</th>
                  <th className={`${tabellenKopf} text-end`}>{t('nachFunktion.kosten')}</th>
                </tr>
              </thead>
              <tbody>
                {funktionen.map((f) => (
                  <tr key={f.funktion} className="border-b border-border last:border-0">
                    <td className={`${zelle} font-semibold`}>{f.funktion}</td>
                    <td className={zahlZelle}>{zahl(f.aufrufe)}</td>
                    <td className={zahlZelle}>{zahl(f.fehler)}</td>
                    <td className={zahlZelle}>{eur(f.kosten_eur)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* Nach Träger */}
        <Card className="overflow-x-auto p-0">
          <div className="p-4 pb-0">
            <h3 className="text-base font-bold">{t('nachTraeger.titel')}</h3>
          </div>
          {traeger.length === 0 ? (
            <p className="p-4 text-sm text-fg-muted">{t('leer')}</p>
          ) : (
            <table className="mt-2 w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className={tabellenKopf}>{t('nachTraeger.traeger')}</th>
                  <th className={`${tabellenKopf} text-end`}>{t('nachTraeger.aufrufe')}</th>
                  <th className={`${tabellenKopf} text-end`}>{t('nachTraeger.fehler')}</th>
                  <th className={`${tabellenKopf} text-end`}>{t('nachTraeger.kosten')}</th>
                </tr>
              </thead>
              <tbody>
                {traeger.map((tr) => (
                  <tr key={tr.traeger_id ?? 'ohne'} className="border-b border-border last:border-0">
                    <td className={`${zelle} font-semibold`}>{tr.name ?? t('ohneTraeger')}</td>
                    <td className={zahlZelle}>{zahl(tr.aufrufe)}</td>
                    <td className={zahlZelle}>{zahl(tr.fehler)}</td>
                    <td className={zahlZelle}>{eur(tr.kosten_eur)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* Nach Kohorte */}
        <Card className="overflow-x-auto p-0">
          <div className="p-4 pb-0">
            <h3 className="text-base font-bold">{t('nachKohorte.titel')}</h3>
            <p className="mt-1 text-xs text-fg-muted">{t('nachKohorte.hinweis')}</p>
          </div>
          {kohorten.length === 0 ? (
            <p className="p-4 text-sm text-fg-muted">{t('leer')}</p>
          ) : (
            <table className="mt-2 w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className={tabellenKopf}>{t('nachKohorte.kohorte')}</th>
                  <th className={`${tabellenKopf} text-end`}>{t('nachKohorte.aufrufe')}</th>
                  <th className={`${tabellenKopf} text-end`}>{t('nachKohorte.kosten')}</th>
                </tr>
              </thead>
              <tbody>
                {kohorten.map((k) => (
                  <tr key={k.kohorte_id} className="border-b border-border last:border-0">
                    <td className={`${zelle} font-semibold`}>{k.bezeichnung ?? t('ohneKohorte')}</td>
                    <td className={zahlZelle}>{zahl(k.aufrufe)}</td>
                    <td className={zahlZelle}>{eur(k.kosten_eur)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* Top-Nutzer */}
        <Card className="overflow-x-auto p-0">
          <div className="p-4 pb-0">
            <h3 className="text-base font-bold">{t('topNutzer.titel')}</h3>
          </div>
          {nutzer.length === 0 ? (
            <p className="p-4 text-sm text-fg-muted">{t('leer')}</p>
          ) : (
            <table className="mt-2 w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className={tabellenKopf}>{t('topNutzer.nutzer')}</th>
                  <th className={`${tabellenKopf} text-end`}>{t('topNutzer.aufrufe')}</th>
                  <th className={`${tabellenKopf} text-end`}>{t('topNutzer.fehler')}</th>
                  <th className={`${tabellenKopf} text-end`}>{t('topNutzer.kosten')}</th>
                </tr>
              </thead>
              <tbody>
                {nutzer.map((n) => (
                  <tr key={n.user_id} className="border-b border-border last:border-0">
                    <td className={`${zelle} font-semibold`}>{nutzerName(n)}</td>
                    <td className={zahlZelle}>{zahl(n.aufrufe)}</td>
                    <td className={zahlZelle}>{zahl(n.fehler)}</td>
                    <td className={zahlZelle}>{eur(n.kosten_eur)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}
