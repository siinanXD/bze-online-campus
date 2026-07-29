import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { FragenClient, type FrageAnsicht, type ThemaOption } from './fragen-client';

export default async function AusbilderFragenSeite({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('ausbilder.fragen');
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profil } = await supabase
    .from('profiles')
    .select('rolle')
    .eq('id', user.id)
    .maybeSingle();
  if (!profil || !['ausbilder', 'verwaltung', 'admin'].includes(profil.rolle)) {
    redirect(`/${locale}`);
  }

  const { data: themen } = await supabase
    .from('themen')
    .select('id, bezeichnung')
    .order('reihenfolge', { ascending: true })
    .limit(500);
  const themaOptionen: ThemaOption[] = (themen ?? []).map((th) => ({
    id: th.id,
    bezeichnung: th.bezeichnung,
  }));
  const themaMap = new Map(themaOptionen.map((th) => [th.id, th.bezeichnung]));

  // Entwurfs- und Verifikationsliste (Spec §6.3 Screen 19).
  const { data: fragen } = await supabase
    .from('fragen')
    .select(
      'id, thema_id, typ, aufgabenstellung, status, kern, ki_generiert, schwierigkeit, quellenstufe, tabellenbuch_fundstelle, enthaelt_zahlenwert, normbezuege, verifikation, created_at',
    )
    .in('status', ['entwurf', 'verifiziert'])
    .order('created_at', { ascending: false })
    .limit(150);

  const frageIds = (fragen ?? []).map((f) => f.id);

  const [{ data: optionen }, { data: reviewEintraege }] = await Promise.all([
    frageIds.length
      ? supabase
          .from('antwortoptionen')
          .select('id, frage_id, text, ist_korrekt, erklaerung, reihenfolge')
          .in('frage_id', frageIds)
          .order('reihenfolge', { ascending: true })
      : Promise.resolve({ data: [] as Array<{
          id: string;
          frage_id: string;
          text: string;
          ist_korrekt: boolean;
          erklaerung: string | null;
          reihenfolge: number;
        }> }),
    frageIds.length
      ? supabase
          .from('review_queue')
          .select('frage_id, grund, status')
          .eq('status', 'offen')
          .in('frage_id', frageIds)
      : Promise.resolve({ data: [] as Array<{ frage_id: string; grund: string; status: string }> }),
  ]);

  const optMap = new Map<string, FrageAnsicht['optionen']>();
  for (const o of optionen ?? []) {
    const arr = optMap.get(o.frage_id) ?? [];
    arr.push({
      id: o.id,
      text: o.text,
      ist_korrekt: o.ist_korrekt,
      erklaerung: o.erklaerung,
    });
    optMap.set(o.frage_id, arr);
  }

  const reviewMap = new Map<string, string[]>();
  for (const r of reviewEintraege ?? []) {
    if (!r.frage_id) continue;
    const arr = reviewMap.get(r.frage_id) ?? [];
    arr.push(r.grund);
    reviewMap.set(r.frage_id, arr);
  }

  const ansicht: FrageAnsicht[] = (fragen ?? []).map((f) => {
    const fund = f.tabellenbuch_fundstelle as { verlag?: string; seite?: number | string; tabelle?: string } | null;
    const verif = f.verifikation as { bestaetigt?: boolean; einwaende?: string[]; confidence?: number } | null;
    return {
      id: f.id,
      thema: themaMap.get(f.thema_id) ?? '—',
      typ: f.typ,
      aufgabenstellung: f.aufgabenstellung,
      status: f.status,
      kern: f.kern,
      kiGeneriert: f.ki_generiert,
      schwierigkeit: f.schwierigkeit ?? null,
      quellenstufe: f.quellenstufe ?? null,
      fundstelle: fund
        ? [fund.verlag, fund.seite != null ? `S. ${fund.seite}` : null, fund.tabelle]
            .filter(Boolean)
            .join(', ')
        : null,
      enthaeltZahlenwert: f.enthaelt_zahlenwert,
      normbezuege: Array.isArray(f.normbezuege) ? (f.normbezuege as string[]) : [],
      verifikation: verif
        ? {
            bestaetigt: !!verif.bestaetigt,
            einwaende: verif.einwaende ?? [],
            confidence: verif.confidence ?? null,
          }
        : null,
      reviewGruende: reviewMap.get(f.id) ?? [],
      optionen: optMap.get(f.id) ?? [],
    };
  });

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <h1 className="text-2xl font-extrabold">{t('titel')}</h1>
        <Link
          href={`/${locale}/ausbilder`}
          className="touchable text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {t('zurueckCockpit')}
        </Link>
      </div>
      <p className="text-fg-muted">{t('untertitel')}</p>
      <FragenClient themen={themaOptionen} fragen={ansicht} />
    </main>
  );
}
