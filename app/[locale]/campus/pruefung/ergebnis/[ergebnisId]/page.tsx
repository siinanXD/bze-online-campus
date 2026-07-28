import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Card, ProgressRing } from '@bze/ui';
import { noteBezeichnung, type NotenStufe } from '@bze/core/bewertung';

export default async function Ergebnis({ params }: { params: Promise<{ locale: string; ergebnisId: string }> }) {
  const { ergebnisId } = await params;
  const t = await getTranslations('pruefung');
  const supabase = await createServerSupabase();

  const { data: erg } = await supabase
    .from('pruefung_ergebnisse')
    .select('id,pruefung_id,mc_punkte,freitext_punkte,gesamtpunkte,note,bestanden,abgegeben_am')
    .eq('id', ergebnisId).maybeSingle();
  if (!erg) return <main className="p-4"><Card><p>{t('ergebnisFehlt')}</p></Card></main>;

  // Notenschlüssel (für Bezeichnung)
  const { data: schluessel } = await supabase
    .from('pruefungen')
    .select('kohorten!inner(berufe!inner(bewertungsschluessel!inner(stufen,bestehensgrenze)))')
    .eq('id', erg.pruefung_id).maybeSingle();
  const stufen: NotenStufe[] =
    (schluessel as any)?.kohorten?.berufe?.bewertungsschluessel?.stufen ?? [];

  // Aufschlüsselung nach Prüfungsbereich aus den Versuchen dieser Abgabe
  const { data: versuche } = await supabase
    .from('versuche')
    .select('ist_korrekt, fragen!inner(themen!inner(bezeichnung, pruefungsbereiche!inner(bezeichnung)))')
    .eq('pruefung_ergebnis_id', ergebnisId);

  const proBereich = new Map<string, { richtig: number; gesamt: number }>();
  const proThema = new Map<string, { richtig: number; gesamt: number }>();
  for (const v of (versuche ?? []) as any[]) {
    const bereich = v.fragen?.themen?.pruefungsbereiche?.bezeichnung ?? '—';
    const thema = v.fragen?.themen?.bezeichnung ?? '—';
    const b = proBereich.get(bereich) ?? { richtig: 0, gesamt: 0 };
    b.gesamt++; if (v.ist_korrekt) b.richtig++; proBereich.set(bereich, b);
    const th = proThema.get(thema) ?? { richtig: 0, gesamt: 0 };
    th.gesamt++; if (v.ist_korrekt) th.richtig++; proThema.set(thema, th);
  }
  const schwaechste = [...proThema.entries()]
    .map(([name, s]) => ({ name, quote: s.gesamt ? s.richtig / s.gesamt : 1 }))
    .sort((a, b) => a.quote - b.quote).slice(0, 3);

  const gesamt = erg.gesamtpunkte;
  const bez = gesamt != null ? noteBezeichnung(stufen, Number(gesamt)) : null;

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <h1 className="pt-2 text-2xl font-extrabold">{t('ergebnisTitel')}</h1>

      {gesamt == null ? (
        <Card>
          <p className="font-semibold">{t('freitextOffenTitel')}</p>
          <p className="mt-1 text-muted">{t('freitextOffenText')}</p>
          <p className="mt-3 text-sm">{t('mcVorlaeufig', { erreicht: Number(erg.mc_punkte ?? 0).toFixed(1) })}</p>
        </Card>
      ) : (
        <Card className="flex items-center gap-4">
          <ProgressRing value={Number(gesamt)} size={96} label={`${gesamt} / 100`} />
          <div>
            <p className="text-lg font-bold">
              {t('note')} {erg.note ?? '—'}{bez ? ` – ${bez.bezeichnung}` : ''}
            </p>
            <p className={erg.bestanden ? 'font-semibold text-status-fertig' : 'font-semibold text-status-falsch'}>
              {erg.bestanden ? '✓ ' + t('bestanden') : '✕ ' + t('nichtBestanden')}
            </p>
            <p className="text-sm text-muted">{t('von100', { punkte: Number(gesamt).toFixed(1) })}</p>
          </div>
        </Card>
      )}

      {proBereich.size > 0 && (
        <Card>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-accent">{t('nachBereich')}</h2>
          <ul className="space-y-1.5">
            {[...proBereich.entries()].map(([name, s]) => (
              <li key={name} className="flex items-center justify-between text-sm">
                <span>{name}</span>
                <span className="tabular-nums text-muted">{s.richtig}/{s.gesamt}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {schwaechste.length > 0 && (
        <Card>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-accent">{t('schwaechste')}</h2>
          <ul className="space-y-1.5">
            {schwaechste.map((th) => (
              <li key={th.name} className="flex items-center justify-between text-sm">
                <span>{th.name}</span>
                <span className="tabular-nums text-muted">{Math.round(th.quote * 100)}%</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </main>
  );
}
