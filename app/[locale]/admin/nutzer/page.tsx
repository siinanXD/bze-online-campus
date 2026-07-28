import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button, Card } from '@bze/ui';
import { ladeAdminSitzung } from '../_lib/auth';
import type { AdminProfil, Kohorte, Rolle } from '../_lib/types';
import { FilterLeiste } from './filter-leiste';
import { KontoStatusBadge } from '../_teile/konto-status';

export const dynamic = 'force-dynamic';

type SucheParams = { q?: string; rolle?: string; status?: string; kohorte?: string };

export default async function NutzerListePage({
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

  const { supabase, profil } = sitzung;

  const { data: kohortenDaten } = await supabase
    .from('kohorten')
    .select('id, traeger_id, beruf_id, bezeichnung, start_datum, end_datum, beitrittscode')
    .eq('traeger_id', profil.traeger_id)
    .order('start_datum', { ascending: false });
  const kohorten = (kohortenDaten ?? []) as Kohorte[];

  let nutzerIdsInKohorte: string[] | null = null;
  if (filter.kohorte) {
    const { data } = await supabase
      .from('kohorten_mitglieder')
      .select('user_id')
      .eq('kohorte_id', filter.kohorte);
    nutzerIdsInKohorte = (data ?? []).map((z: { user_id: string }) => z.user_id);
  }

  let anfrage = supabase
    .from('profiles')
    .select('id, traeger_id, benutzername, rolle, vorname, nachname, sprache, muss_passwort_aendern, aktiv, letzter_login, created_at')
    .eq('traeger_id', profil.traeger_id)
    .order('created_at', { ascending: false });

  const ROLLEN_WERTE: Rolle[] = ['teilnehmer', 'ausbilder', 'verwaltung', 'admin'];
  if (filter.rolle && ROLLEN_WERTE.includes(filter.rolle as Rolle)) anfrage = anfrage.eq('rolle', filter.rolle as Rolle);
  if (filter.status === 'aktiv') anfrage = anfrage.eq('aktiv', true);
  if (filter.status === 'inaktiv') anfrage = anfrage.eq('aktiv', false);
  if (filter.q) {
    // Kommas/Klammern sind im PostgREST-`or()`-Ausdruck Trennzeichen — entfernen,
    // damit die Nutzereingabe den Filterausdruck nicht manipulieren kann.
    const q = filter.q.replace(/[%_,()]/g, '').trim();
    if (q) anfrage = anfrage.or(`benutzername.ilike.%${q}%,vorname.ilike.%${q}%,nachname.ilike.%${q}%`);
  }
  if (nutzerIdsInKohorte) anfrage = anfrage.in('id', nutzerIdsInKohorte.length ? nutzerIdsInKohorte : ['00000000-0000-0000-0000-000000000000']);

  const { data: nutzerDaten, error } = await anfrage;
  const nutzer = (nutzerDaten ?? []) as AdminProfil[];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{t('nutzer.titel')}</h2>
        <div className="flex flex-wrap gap-2">
          {filter.kohorte && (
            <Link href={`/${locale}/admin/nutzer/kohorte/${filter.kohorte}/drucken`}>
              <Button variant="soft">{t('nutzer.kohorteDrucken')}</Button>
            </Link>
          )}
          <Link href={`/${locale}/admin/nutzer/neu`}>
            <Button variant="primary">{t('nutzer.anlegen')}</Button>
          </Link>
        </div>
      </div>

      <Card>
        <FilterLeiste kohorten={kohorten.map((k) => ({ id: k.id, bezeichnung: k.bezeichnung }))} />
      </Card>

      {error && (
        <Card className="border-status-falsch">
          <p className="text-sm text-status-falsch">{t('fehler.laden')}</p>
        </Card>
      )}

      {!error && nutzer.length === 0 && (
        <Card>
          <p className="text-sm text-muted">{t('nutzer.leer')}</p>
        </Card>
      )}

      {!error && nutzer.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[560px] border-collapse text-start text-sm">
            <thead>
              <tr className="border-b border-border text-start text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 text-start font-semibold">{t('nutzer.spalte.name')}</th>
                <th className="px-4 py-3 text-start font-semibold">{t('nutzer.spalte.benutzername')}</th>
                <th className="px-4 py-3 text-start font-semibold">{t('nutzer.spalte.rolle')}</th>
                <th className="px-4 py-3 text-start font-semibold">{t('nutzer.spalte.status')}</th>
              </tr>
            </thead>
            <tbody>
              {nutzer.map((n) => (
                <tr key={n.id} className="border-b border-border last:border-0 hover:bg-bg">
                  <td className="px-4 py-3">
                    <Link href={`/${locale}/admin/nutzer/${n.id}`} className="font-semibold text-accent underline-offset-2 hover:underline">
                      {n.vorname} {n.nachname}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{n.benutzername}</td>
                  <td className="px-4 py-3">{t(`rollen.${n.rolle}`)}</td>
                  <td className="px-4 py-3">
                    <KontoStatusBadge aktiv={n.aktiv} label={n.aktiv ? t('nutzer.aktiv') : t('nutzer.inaktiv')} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
