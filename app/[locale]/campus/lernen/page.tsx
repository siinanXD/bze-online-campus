import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Button, Card, CardKopf, CardTitel, Progress, ProgressRing, StatusBadge, type FrageStatus } from '@bze/ui';
import { ladeFortsetzenEmpfehlung } from '../fortschritt/_lib/queries';

type ThemaZeile = {
  id: string;
  bezeichnung: string;
  gesamt: number;
  fertig: number;
  status: FrageStatus;
};

function themaStatus(counts: {
  gesamt: number;
  fertig: number;
  falsch: number;
  teil: number;
}): FrageStatus {
  if (counts.gesamt === 0) return 'neu';
  if (counts.fertig >= counts.gesamt) return 'abgeschlossen';
  if (counts.falsch > 0) return 'falsch';
  if (counts.teil > 0 || counts.fertig > 0) return 'einmal_richtig';
  return 'neu';
}

export default async function LernenIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('lernen');
  const tCampus = await getTranslations('campus');
  const tStatus = await getTranslations('status');
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: fragenRoh } = await supabase
    .from('fragen')
    .select('id, thema_id, themen!inner(id, bezeichnung)')
    .eq('status', 'freigegeben');

  const fragen = (fragenRoh ?? []) as {
    id: string;
    thema_id: string;
    themen: { id: string; bezeichnung: string } | { id: string; bezeichnung: string }[];
  }[];

  const frageIds = fragen.map((f) => f.id);
  const masteryMap = new Map<string, string>();
  if (user && frageIds.length > 0) {
    const { data: masteryRoh } = await supabase
      .from('fragen_mastery')
      .select('frage_id, status')
      .eq('user_id', user.id)
      .in('frage_id', frageIds);
    for (const m of masteryRoh ?? []) {
      masteryMap.set(m.frage_id, m.status);
    }
  }

  const aggregat = new Map<
    string,
    { bezeichnung: string; gesamt: number; fertig: number; falsch: number; teil: number }
  >();

  for (const f of fragen) {
    const thema = Array.isArray(f.themen) ? f.themen[0] : f.themen;
    if (!thema) continue;
    const cur = aggregat.get(thema.id) ?? {
      bezeichnung: thema.bezeichnung,
      gesamt: 0,
      fertig: 0,
      falsch: 0,
      teil: 0,
    };
    cur.gesamt += 1;
    const status = masteryMap.get(f.id);
    if (status === 'abgeschlossen') cur.fertig += 1;
    else if (status === 'falsch') cur.falsch += 1;
    else if (status === 'einmal_richtig') cur.teil += 1;
    aggregat.set(thema.id, cur);
  }

  const themen: ThemaZeile[] = [...aggregat.entries()]
    .map(([id, a]) => ({
      id,
      bezeichnung: a.bezeichnung,
      gesamt: a.gesamt,
      fertig: a.fertig,
      status: themaStatus(a),
    }))
    .sort((a, b) => a.bezeichnung.localeCompare(b.bezeichnung, locale));

  const empfehlung = user ? await ladeFortsetzenEmpfehlung(user.id) : null;
  const gesamtFertig = themen.reduce((s, t) => s + t.fertig, 0);
  const gesamtFragen = themen.reduce((s, t) => s + t.gesamt, 0);
  const gesamtProzent = gesamtFragen === 0 ? 0 : Math.round((gesamtFertig / gesamtFragen) * 100);

  const statusLabel: Record<FrageStatus, string> = {
    neu: tStatus('neu'),
    einmal_richtig: tStatus('einmalRichtig'),
    falsch: tStatus('falsch'),
    abgeschlossen: tStatus('abgeschlossen'),
  };

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <header className="space-y-1 pt-2">
        <h1 className="text-2xl font-extrabold">{t('titel')}</h1>
        <p className="text-fg-muted">{t('einstiegHinweis')}</p>
      </header>

      {empfehlung && (
        <Card className="border-primary-border bg-primary-subtle">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            {tCampus('fortsetzenTitel')}
          </p>
          <h2 className="mt-1 text-lg font-semibold">
            {tCampus('fortsetzenAlsNaechstes', { thema: empfehlung.bezeichnung })}
          </h2>
          <p className="mt-1 text-sm text-fg-muted">
            {tCampus('fortsetzenRest', {
              offen: empfehlung.kernOffen,
              prozent: Math.round(empfehlung.anteil * 100),
            })}
          </p>
          <div className="mt-3">
            <Progress
              wert={Math.round(empfehlung.anteil * 100)}
              label={empfehlung.bezeichnung}
            />
          </div>
          <div className="mt-4">
            <Link href={`/${locale}/campus/lernen/thema/${empfehlung.themaId}`}>
              <Button volleBreite>{tCampus('fortsetzenCta')}</Button>
            </Link>
          </div>
        </Card>
      )}

      {themen.length > 0 && (
        <Card className="flex items-center gap-4">
          <ProgressRing
            value={gesamtProzent}
            size={72}
            label={t('gesamtFortschritt', { prozent: gesamtProzent })}
          />
          <div>
            <p className="font-semibold">{t('uebersicht')}</p>
            <p className="text-sm text-fg-muted">
              {t('fragenStand', { fertig: gesamtFertig, gesamt: gesamtFragen })}
            </p>
          </div>
        </Card>
      )}

      {themen.length === 0 ? (
        <Card>
          <p className="text-fg-muted">{tCampus('keineThemen')}</p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {themen.map((thema) => {
            const prozent =
              thema.gesamt === 0 ? 0 : Math.round((thema.fertig / thema.gesamt) * 100);
            return (
              <li key={thema.id}>
                <Link href={`/${locale}/campus/lernen/thema/${thema.id}`} className="block">
                  <Card variante="interaktiv" className="h-full">
                    <CardKopf>
                      <CardTitel className="text-base">{thema.bezeichnung}</CardTitel>
                      <StatusBadge status={thema.status} label={statusLabel[thema.status]} />
                    </CardKopf>
                    <p className="text-sm text-fg-muted">
                      {t('fragenStand', { fertig: thema.fertig, gesamt: thema.gesamt })}
                    </p>
                    <div className="mt-3">
                      <Progress wert={prozent} label={thema.bezeichnung} />
                    </div>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
