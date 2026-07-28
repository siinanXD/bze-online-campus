import { getTranslations } from 'next-intl/server';
import { ladeAdminSitzung } from '../../_lib/auth';
import type { AdminProfil, AusbilderZuweisung } from '../../_lib/types';
import { ZuweisungenClient } from './zuweisungen-client';

/**
 * Lädt die Zuweisungsdaten server-seitig (RLS-geprüft) und übergibt sie an
 * die interaktiven Client-Bausteine. `ausbilder_zuweisungen` erlaubt
 * Lesen/Schreiben für Admin UND Verwaltung (siehe Migration, Policy `az_manage`).
 */
export async function Zuweisungen({ nutzer, traegerId }: { nutzer: AdminProfil; traegerId: string }) {
  const t = await getTranslations('admin');
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return null;
  const { supabase } = sitzung;

  if (nutzer.rolle === 'teilnehmer') {
    const { data: zuweisungenDaten } = await supabase
      .from('ausbilder_zuweisungen')
      .select('ausbilder_id, teilnehmer_id, zugewiesen_am')
      .eq('teilnehmer_id', nutzer.id);
    const zuweisungen = (zuweisungenDaten ?? []) as AusbilderZuweisung[];
    const zugewieseneIds = zuweisungen.map((z) => z.ausbilder_id);

    const { data: ausbilderDaten } = await supabase
      .from('profiles')
      .select('id, benutzername, vorname, nachname, rolle')
      .eq('traeger_id', traegerId)
      .eq('rolle', 'ausbilder')
      .eq('aktiv', true)
      .order('nachname');
    const alleAusbilder = (ausbilderDaten ?? []) as Pick<AdminProfil, 'id' | 'benutzername' | 'vorname' | 'nachname' | 'rolle'>[];

    const zugewiesen = alleAusbilder.filter((a) => zugewieseneIds.includes(a.id));
    const verfuegbar = alleAusbilder.filter((a) => !zugewieseneIds.includes(a.id));

    return (
      <ZuweisungenClient
        richtung="teilnehmer-zu-ausbilder"
        eigeneId={nutzer.id}
        zugewiesen={zugewiesen}
        verfuegbar={verfuegbar}
        leerText={t('nutzer.keinAusbilderZugewiesen')}
        auswahlText={t('nutzer.ausbilderZuweisen')}
      />
    );
  }

  // rolle === 'ausbilder'
  const { data: zuweisungenDaten } = await supabase
    .from('ausbilder_zuweisungen')
    .select('ausbilder_id, teilnehmer_id, zugewiesen_am')
    .eq('ausbilder_id', nutzer.id);
  const zuweisungen = (zuweisungenDaten ?? []) as AusbilderZuweisung[];
  const zugewieseneIds = zuweisungen.map((z) => z.teilnehmer_id);

  const { data: teilnehmerDaten } = await supabase
    .from('profiles')
    .select('id, benutzername, vorname, nachname, rolle')
    .eq('traeger_id', traegerId)
    .eq('rolle', 'teilnehmer')
    .eq('aktiv', true)
    .order('nachname');
  const alleTeilnehmer = (teilnehmerDaten ?? []) as Pick<AdminProfil, 'id' | 'benutzername' | 'vorname' | 'nachname' | 'rolle'>[];

  const zugewiesen = alleTeilnehmer.filter((p) => zugewieseneIds.includes(p.id));
  const verfuegbar = alleTeilnehmer.filter((p) => !zugewieseneIds.includes(p.id));

  return (
    <ZuweisungenClient
      richtung="ausbilder-zu-teilnehmer"
      eigeneId={nutzer.id}
      zugewiesen={zugewiesen}
      verfuegbar={verfuegbar}
      leerText={t('nutzer.keinTeilnehmerZugewiesen')}
      auswahlText={t('nutzer.teilnehmerZuweisen')}
    />
  );
}
