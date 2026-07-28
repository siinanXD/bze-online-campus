import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ladeAdminSitzung } from '../../../../_lib/auth';
import type { AdminProfil, Kohorte } from '../../../../_lib/types';
import { DruckAnsicht } from './druck-ansicht';

export const dynamic = 'force-dynamic';

export default async function KohorteDruckenPage({
  params,
}: {
  params: Promise<{ locale: string; kohorteId: string }>;
}) {
  const { kohorteId } = await params;
  const t = await getTranslations('admin');
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return null;
  const { supabase, profil } = sitzung;

  const { data: kohorteDaten } = await supabase
    .from('kohorten')
    .select('id, traeger_id, beruf_id, bezeichnung, start_datum, end_datum, beitrittscode')
    .eq('id', kohorteId)
    .maybeSingle();
  const kohorte = kohorteDaten as Kohorte | null;
  if (!kohorte || kohorte.traeger_id !== profil.traeger_id) notFound();

  const { data: mitgliederDaten } = await supabase
    .from('kohorten_mitglieder')
    .select('user_id')
    .eq('kohorte_id', kohorteId);
  const userIds = (mitgliederDaten ?? []).map((m: { user_id: string }) => m.user_id);

  let mitglieder: Pick<AdminProfil, 'id' | 'benutzername' | 'vorname' | 'nachname' | 'aktiv'>[] = [];
  if (userIds.length > 0) {
    const { data: profilDaten } = await supabase
      .from('profiles')
      .select('id, benutzername, vorname, nachname, aktiv')
      .in('id', userIds)
      .order('nachname');
    mitglieder = (profilDaten ?? []) as typeof mitglieder;
  }

  return (
    <DruckAnsicht
      kohorteId={kohorte.id}
      kohorteBezeichnung={kohorte.bezeichnung}
      mitglieder={mitglieder}
      texte={{
        titel: t('nutzer.kohorteDrucken'),
        traeger: t('titel'),
        spalteName: t('nutzer.spalte.name'),
        spalteBenutzername: t('nutzer.spalte.benutzername'),
        spaltePasswort: t('nutzer.initialpasswort'),
        passwortUnbekannt: t('nutzer.passwortNichtVerfuegbar'),
        drucken: t('nutzer.jetztDrucken'),
        hinweis: t('nutzer.druckHinweis'),
        keineMitglieder: t('nutzer.leer'),
      }}
    />
  );
}
