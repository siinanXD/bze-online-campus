import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Card } from '@bze/ui';
import type { PruefFrage } from '@bze/core/bewertung';
import { PruefungRunner } from './pruefung-runner';

export default async function PruefungLauf({ params }: { params: Promise<{ locale: string; pruefungId: string }> }) {
  const { pruefungId } = await params;
  const t = await getTranslations('pruefung');
  const supabase = await createServerSupabase();

  const { data: pruefung } = await supabase
    .from('pruefungen').select('id,titel,dauer_minuten').eq('id', pruefungId).maybeSingle();
  if (!pruefung) return <main className="p-4"><Card><p>{t('keine')}</p></Card></main>;

  // Ergebnis anlegen/fortsetzen
  const { data: ergId, error: startErr } = await supabase.rpc('pruefung_starten', { p_pruefung_id: pruefungId });
  if (startErr || !ergId) {
    return <main className="p-4"><Card><p role="alert" className="text-status-falsch">{t('startFehler')}</p></Card></main>;
  }
  const { data: erg } = await supabase
    .from('pruefung_ergebnisse').select('id,gestartet_am').eq('id', ergId).maybeSingle();

  const { data: pf } = await supabase
    .from('pruefung_fragen')
    .select('position,punkte, fragen!inner(id,typ,aufgabenstellung, antwortoptionen(id,text,reihenfolge))')
    .eq('pruefung_id', pruefungId)
    .order('position');

  const fragen: PruefFrage[] = (pf ?? []).map((row: any) => ({
    id: row.fragen.id,
    typ: row.fragen.typ,
    aufgabenstellung: row.fragen.aufgabenstellung,
    position: row.position,
    punkte: row.punkte,
    optionen: [...(row.fragen.antwortoptionen ?? [])]
      .sort((a: any, b: any) => a.reihenfolge - b.reihenfolge)
      .map((o: any) => ({ id: o.id, text: o.text, reihenfolge: o.reihenfolge })),
  }));

  if (fragen.length === 0) {
    return <main className="p-4"><Card><p>{t('leer')}</p></Card></main>;
  }

  return (
    <PruefungRunner
      fragen={fragen}
      ergebnisId={erg?.id ?? (ergId as string)}
      gestartetAm={erg?.gestartet_am ?? new Date().toISOString()}
      dauerMinuten={pruefung.dauer_minuten}
    />
  );
}
