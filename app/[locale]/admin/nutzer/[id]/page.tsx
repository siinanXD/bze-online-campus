import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';
import { ladeAdminSitzung } from '../../_lib/auth';
import type { AdminProfil, Kohorte } from '../../_lib/types';
import { KontoStatusBadge } from '../../_teile/konto-status';
import { Aktionen } from './aktionen';
import { KohorteWechseln } from './kohorte-wechseln';
import { Zuweisungen } from './zuweisungen';

export const dynamic = 'force-dynamic';

export default async function NutzerDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations('admin');
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return null;
  const { supabase, profil: eigenesProfil } = sitzung;

  const { data: nutzerDaten } = await supabase
    .from('profiles')
    .select('id, traeger_id, benutzername, rolle, vorname, nachname, sprache, muss_passwort_aendern, aktiv, letzter_login, created_at')
    .eq('id', id)
    .maybeSingle();
  const nutzer = nutzerDaten as AdminProfil | null;
  if (!nutzer || nutzer.traeger_id !== eigenesProfil.traeger_id) notFound();

  const formatiereDatum = (wert: string | null) =>
    wert ? new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(wert)) : t('nutzer.nie');

  let aktuelleKohorte: Kohorte | null = null;
  let alleKohorten: { id: string; bezeichnung: string }[] = [];
  if (nutzer.rolle === 'teilnehmer') {
    const [{ data: mitgliedschaft }, { data: kohortenDaten }] = await Promise.all([
      supabase.from('kohorten_mitglieder').select('kohorte_id').eq('user_id', nutzer.id).maybeSingle(),
      supabase
        .from('kohorten')
        .select('id, traeger_id, beruf_id, bezeichnung, start_datum, end_datum, beitrittscode')
        .eq('traeger_id', eigenesProfil.traeger_id)
        .order('start_datum', { ascending: false }),
    ]);
    alleKohorten = ((kohortenDaten ?? []) as Kohorte[]).map((k) => ({ id: k.id, bezeichnung: k.bezeichnung }));
    if (mitgliedschaft) {
      aktuelleKohorte = ((kohortenDaten ?? []) as Kohorte[]).find((k) => k.id === (mitgliedschaft as { kohorte_id: string }).kohorte_id) ?? null;
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">{nutzer.vorname} {nutzer.nachname}</h2>
            <p className="font-mono text-sm text-muted">{nutzer.benutzername}</p>
          </div>
          <KontoStatusBadge aktiv={nutzer.aktiv} label={nutzer.aktiv ? t('nutzer.aktiv') : t('nutzer.inaktiv')} />
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-[15px] sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted">{t('nutzer.spalte.rolle')}</dt>
            <dd className="font-semibold">{t(`rollen.${nutzer.rolle}`)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">{t('nutzer.feld.sprache')}</dt>
            <dd className="font-semibold">{nutzer.sprache}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">{t('nutzer.letzterLogin')}</dt>
            <dd className="font-semibold">{formatiereDatum(nutzer.letzter_login)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">{t('nutzer.angelegtAm')}</dt>
            <dd className="font-semibold">{formatiereDatum(nutzer.created_at)}</dd>
          </div>
          {nutzer.rolle === 'teilnehmer' && (
            <div className="sm:col-span-2">
              <dt className="text-xs text-muted">{t('nutzer.feld.kohorte')}</dt>
              <dd className="font-semibold">{aktuelleKohorte?.bezeichnung ?? t('nutzer.keineKohorte')}</dd>
            </div>
          )}
        </dl>

        {nutzer.muss_passwort_aendern && (
          <p className="mt-4 rounded-xl border border-border bg-bg px-3 py-2 text-sm text-muted">
            {t('nutzer.mussPasswortAendern')}
          </p>
        )}
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-accent">{t('nutzer.aktionenTitel')}</h3>
        <Aktionen nutzerId={nutzer.id} aktiv={nutzer.aktiv} />
      </Card>

      {nutzer.rolle === 'teilnehmer' && (
        <Card>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-accent">{t('nutzer.feld.kohorte')}</h3>
          <KohorteWechseln teilnehmerId={nutzer.id} aktuelleKohorteId={aktuelleKohorte?.id ?? ''} kohorten={alleKohorten} />
        </Card>
      )}

      {(nutzer.rolle === 'teilnehmer' || nutzer.rolle === 'ausbilder') && (
        <Card>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-accent">{t('nutzer.zuweisungenTitel')}</h3>
          <Zuweisungen nutzer={nutzer} traegerId={eigenesProfil.traeger_id} />
        </Card>
      )}
    </div>
  );
}
