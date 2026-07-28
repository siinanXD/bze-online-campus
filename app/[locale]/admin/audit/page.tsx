import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';
import { ladeAdminSitzung } from '../_lib/auth';
import type { AdminProfil, AuditLogEintrag } from '../_lib/types';
import { AuditFilter } from './filter';

export const dynamic = 'force-dynamic';

const SEITENGROESSE = 25;

type SucheParams = { aktion?: string; zielTyp?: string; von?: string; bis?: string; seite?: string };

export default async function AuditLogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SucheParams>;
}) {
  const { locale } = await params;
  const filter = await searchParams;
  const t = await getTranslations('admin');
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return null;

  // audit_read (Migration 0001) erlaubt SELECT nur für app_is_admin() — Verwaltung
  // sieht laut RLS bewusst keine Zeilen. Statt einer irreführend leeren Liste
  // zeigen wir das transparent an (siehe README dieses Pakets).
  if (sitzung.profil.rolle !== 'admin') {
    return (
      <Card>
        <h2 className="text-lg font-bold">{t('audit.titel')}</h2>
        <p className="mt-2 text-sm text-muted">{t('audit.nurAdmin')}</p>
      </Card>
    );
  }

  const seite = Math.max(1, Number.parseInt(filter.seite ?? '1', 10) || 1);
  const von = (seite - 1) * SEITENGROESSE;
  const bis = von + SEITENGROESSE - 1;

  let anfrage = sitzung.supabase
    .from('audit_log')
    .select('id, akteur_id, aktion, ziel_typ, ziel_id, details, ip, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(von, bis);

  if (filter.aktion) anfrage = anfrage.ilike('aktion', `%${filter.aktion.replace(/[%_]/g, '')}%`);
  if (filter.zielTyp) anfrage = anfrage.ilike('ziel_typ', `%${filter.zielTyp.replace(/[%_]/g, '')}%`);
  if (filter.von) anfrage = anfrage.gte('created_at', `${filter.von}T00:00:00`);
  if (filter.bis) anfrage = anfrage.lte('created_at', `${filter.bis}T23:59:59`);

  const { data, count, error } = await anfrage;
  const eintraege = (data ?? []) as AuditLogEintrag[];

  const akteurIds = [...new Set(eintraege.map((e) => e.akteur_id).filter((id): id is string => !!id))];
  const akteure = new Map<string, Pick<AdminProfil, 'vorname' | 'nachname' | 'benutzername'>>();
  if (akteurIds.length > 0) {
    const { data: akteurDaten } = await sitzung.supabase
      .from('profiles')
      .select('id, vorname, nachname, benutzername')
      .in('id', akteurIds);
    for (const a of (akteurDaten ?? []) as (AdminProfil & { id: string })[]) {
      akteure.set(a.id, { vorname: a.vorname, nachname: a.nachname, benutzername: a.benutzername });
    }
  }

  const formatiereDatum = (wert: string) =>
    new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(wert));

  const gesamtseiten = count ? Math.max(1, Math.ceil(count / SEITENGROESSE)) : 1;
  const querystring = (s: number) => {
    const p = new URLSearchParams();
    if (filter.aktion) p.set('aktion', filter.aktion);
    if (filter.zielTyp) p.set('zielTyp', filter.zielTyp);
    if (filter.von) p.set('von', filter.von);
    if (filter.bis) p.set('bis', filter.bis);
    p.set('seite', String(s));
    return p.toString();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">{t('audit.titel')}</h2>

      <Card>
        <AuditFilter />
      </Card>

      {error && (
        <Card>
          <p className="text-sm text-status-falsch">{t('fehler.laden')}</p>
        </Card>
      )}

      {!error && eintraege.length === 0 && (
        <Card>
          <p className="text-sm text-muted">{t('audit.leer')}</p>
        </Card>
      )}

      {!error && eintraege.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] border-collapse text-start text-sm">
            <thead>
              <tr className="border-b border-border text-start text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 text-start font-semibold">{t('audit.spalte.zeitpunkt')}</th>
                <th className="px-4 py-3 text-start font-semibold">{t('audit.spalte.akteur')}</th>
                <th className="px-4 py-3 text-start font-semibold">{t('audit.spalte.aktion')}</th>
                <th className="px-4 py-3 text-start font-semibold">{t('audit.spalte.ziel')}</th>
                <th className="px-4 py-3 text-start font-semibold">{t('audit.spalte.details')}</th>
              </tr>
            </thead>
            <tbody>
              {eintraege.map((e) => {
                const akteur = e.akteur_id ? akteure.get(e.akteur_id) : undefined;
                return (
                  <tr key={e.id} className="border-b border-border align-top last:border-0 hover:bg-bg">
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{formatiereDatum(e.created_at)}</td>
                    <td className="px-4 py-3">
                      {akteur ? `${akteur.vorname ?? ''} ${akteur.nachname ?? ''}`.trim() || akteur.benutzername : t('audit.systemAkteur')}
                    </td>
                    <td className="px-4 py-3 font-semibold">{e.aktion}</td>
                    <td className="px-4 py-3 text-muted">
                      {e.ziel_typ ?? '—'}
                      {e.ziel_id ? <span className="block font-mono text-xs">{e.ziel_id}</span> : null}
                    </td>
                    <td className="px-4 py-3">
                      {e.details ? (
                        <pre className="max-w-xs overflow-x-auto whitespace-pre-wrap break-words text-xs text-muted">
                          {JSON.stringify(e.details)}
                        </pre>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {gesamtseiten > 1 && (
        <nav aria-label={t('audit.seitenNavigation')} className="flex flex-wrap gap-2">
          {Array.from({ length: gesamtseiten }, (_, i) => i + 1).map((s) => (
            <Link
              key={s}
              href={`/${locale}/admin/audit?${querystring(s)}`}
              aria-current={s === seite ? 'page' : undefined}
              className={
                s === seite
                  ? 'touchable inline-flex items-center justify-center rounded-xl border border-accent bg-accent px-3 text-sm font-semibold text-accent-fg'
                  : 'touchable inline-flex items-center justify-center rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-fg hover:bg-bg'
              }
            >
              {s}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
