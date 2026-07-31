import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { lernqueue, type FrageMitStand, type LernFrage, type MasteryState } from '@bze/core/mastery';
import { Card } from '@bze/ui';
import { FragenRunner } from './fragen-runner';

export default async function ThemaLernen({ params }: { params: Promise<{ locale: string; themaId: string }> }) {
  const { themaId } = await params;
  const t = await getTranslations('lernen');
  const supabase = await createServerSupabase();

  const { data: thema } = await supabase.from('themen').select('bezeichnung').eq('id', themaId).maybeSingle();

  const { data: fragenRoh } = await supabase
    .from('fragen')
    .select('id,typ,aufgabenstellung,bild_url,schwierigkeit,kern,tabellenbuch_fundstelle, antwortoptionen(id,text,reihenfolge)')
    .eq('thema_id', themaId);

  const alleMc = (fragenRoh ?? []).filter((f) => f.typ === 'mc');
  const freitextAnzahl = (fragenRoh ?? []).filter((f) => f.typ === 'freitext').length;

  const ids = alleMc.map((f) => f.id);
  const { data: masteryRoh } = ids.length
    ? await supabase.from('fragen_mastery').select('frage_id,status,streak,fehler_gesamt,naechste_faelligkeit').in('frage_id', ids)
    : { data: [] as any[] };
  const masteryMap = new Map<string, MasteryState>((masteryRoh ?? []).map((m) => [m.frage_id, m as MasteryState]));

  const items: FrageMitStand[] = alleMc.map((f) => {
    const frage: LernFrage = {
      id: f.id, typ: f.typ, aufgabenstellung: f.aufgabenstellung, bild_url: f.bild_url,
      schwierigkeit: f.schwierigkeit, kern: f.kern,
      tabellenbuch_fundstelle: (f.tabellenbuch_fundstelle as any) ?? null,
      optionen: [...(f.antwortoptionen ?? [])].sort((a: any, b: any) => a.reihenfolge - b.reihenfolge)
        .map((o: any) => ({ id: o.id, text: o.text, reihenfolge: o.reihenfolge })),
    };
    return { frage, mastery: masteryMap.get(f.id) ?? null };
  });

  const queue = lernqueue(items);

  return (
    <main className="mx-auto max-w-2xl p-4 space-y-4">
      <header className="pt-2">
        <p className="text-xs text-fg-muted">{t('themaLabel')}</p>
        <h1 className="text-2xl font-extrabold">{thema?.bezeichnung ?? '—'}</h1>
      </header>

      {queue.length === 0 ? (
        <Card>
          <p className="font-semibold">{t('leer.titel')}</p>
          <p className="mt-1 text-fg-muted">
            {alleMc.length === 0 ? t('leer.keineFreigegeben') : t('leer.allesFertig')}
          </p>
          {freitextAnzahl > 0 && <p className="mt-3 text-sm text-fg-muted">{t('freitextHinweis', { n: freitextAnzahl })}</p>}
        </Card>
      ) : (
        <FragenRunner queue={queue} />
      )}
    </main>
  );
}
