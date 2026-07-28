import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { ReviewClient, type OffenerVersuch, type ReviewEintrag } from './review-client';

type KiBewertung = {
  staerken?: string;
  luecken?: string;
  verbesserungshinweis?: string;
};

export default async function AusbilderReviewSeite({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('ausbilder.review');
  const supabase = await createServerSupabase();

  const { data: zuweisungen } = await supabase
    .from('ausbilder_zuweisungen')
    .select('teilnehmer_id');
  const teilnehmerIds = (zuweisungen ?? []).map((z) => z.teilnehmer_id);

  let offeneVersuche: OffenerVersuch[] = [];
  if (teilnehmerIds.length > 0) {
    const { data: versuche } = await supabase
      .from('versuche')
      .select('id, frage_id, antwort, user_id')
      .is('erzielte_punkte', null)
      .in('user_id', teilnehmerIds)
      .order('created_at', { ascending: false })
      .limit(50);

    const frageIds = [...new Set((versuche ?? []).map((v) => v.frage_id))];
    const userIds = [...new Set((versuche ?? []).map((v) => v.user_id))];

    const [{ data: fragen }, { data: profile }] = await Promise.all([
      frageIds.length
        ? supabase.from('fragen').select('id, typ, aufgabenstellung').in('id', frageIds)
        : Promise.resolve({ data: [] as { id: string; typ: string; aufgabenstellung: string }[] }),
      userIds.length
        ? supabase.from('profiles').select('id, vorname, nachname, benutzername').in('id', userIds)
        : Promise.resolve({
            data: [] as { id: string; vorname: string | null; nachname: string | null; benutzername: string }[],
          }),
    ]);

    const frageMap = new Map((fragen ?? []).map((f) => [f.id, f]));
    const profilMap = new Map((profile ?? []).map((p) => [p.id, p]));

    offeneVersuche = (versuche ?? [])
      .filter((v) => frageMap.get(v.frage_id)?.typ === 'freitext')
      .map((v) => {
        const frage = frageMap.get(v.frage_id);
        const profil = profilMap.get(v.user_id);
        const antwort = v.antwort as { text?: string } | null;
        return {
          id: v.id,
          frage_id: v.frage_id,
          aufgabenstellung: frage?.aufgabenstellung ?? '—',
          antwortText: antwort?.text ?? '',
          teilnehmer: `${profil?.vorname ?? ''} ${profil?.nachname ?? ''} (${profil?.benutzername ?? ''})`.trim(),
        };
      });
  }

  const { data: queue } = await supabase
    .from('review_queue')
    .select('id, grund, status, versuch_id, frage_id')
    .eq('status', 'offen')
    .order('created_at', { ascending: true })
    .limit(50);

  const reviewVersuchIds = [...new Set((queue ?? []).map((r) => r.versuch_id).filter(Boolean))] as string[];
  const reviewFrageIds = [...new Set((queue ?? []).map((r) => r.frage_id).filter(Boolean))] as string[];

  const [{ data: reviewVersuche }, { data: reviewFragen }] = await Promise.all([
    reviewVersuchIds.length
      ? supabase
          .from('versuche')
          .select('id, user_id, antwort, erzielte_punkte, ki_confidence, ki_bewertung')
          .in('id', reviewVersuchIds)
      : Promise.resolve({ data: [] as Array<{
          id: string;
          user_id: string;
          antwort: unknown;
          erzielte_punkte: number | null;
          ki_confidence: number | null;
          ki_bewertung: KiBewertung | null;
        }> }),
    reviewFrageIds.length
      ? supabase.from('fragen').select('id, aufgabenstellung').in('id', reviewFrageIds)
      : Promise.resolve({ data: [] as { id: string; aufgabenstellung: string }[] }),
  ]);

  const reviewUserIds = [...new Set((reviewVersuche ?? []).map((v) => v.user_id))];
  const { data: reviewProfile } = reviewUserIds.length
    ? await supabase.from('profiles').select('id, vorname, nachname, benutzername').in('id', reviewUserIds)
    : { data: [] as { id: string; vorname: string | null; nachname: string | null; benutzername: string }[] };

  const rvMap = new Map((reviewVersuche ?? []).map((v) => [v.id, v]));
  const rfMap = new Map((reviewFragen ?? []).map((f) => [f.id, f]));
  const rpMap = new Map((reviewProfile ?? []).map((p) => [p.id, p]));

  const reviews: ReviewEintrag[] = (queue ?? []).map((r) => {
    const versuch = r.versuch_id ? rvMap.get(r.versuch_id) : undefined;
    const frage = r.frage_id ? rfMap.get(r.frage_id) : undefined;
    const profil = versuch ? rpMap.get(versuch.user_id) : undefined;
    const antwort = versuch?.antwort as { text?: string } | null;
    const ki = (versuch?.ki_bewertung ?? null) as KiBewertung | null;
    return {
      id: r.id,
      grund: r.grund,
      status: r.status,
      versuch_id: r.versuch_id,
      frage_id: r.frage_id,
      aufgabenstellung: frage?.aufgabenstellung ?? '—',
      antwortText: antwort?.text ?? '',
      erzielte_punkte: versuch?.erzielte_punkte ?? null,
      confidence: versuch?.ki_confidence ?? null,
      teilnehmer: `${profil?.vorname ?? ''} ${profil?.nachname ?? ''} (${profil?.benutzername ?? ''})`.trim(),
      staerken: ki?.staerken ?? null,
      luecken: ki?.luecken ?? null,
      verbesserungshinweis: ki?.verbesserungshinweis ?? null,
    };
  });

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <h1 className="text-2xl font-extrabold">{t('titel')}</h1>
        <Link
          href={`/${locale}/ausbilder`}
          className="touchable text-sm font-semibold text-accent underline-offset-4 hover:underline"
        >
          {t('zurueckCockpit')}
        </Link>
      </div>
      <p className="text-muted">{t('untertitel')}</p>
      <ReviewClient offeneVersuche={offeneVersuche} reviews={reviews} />
    </main>
  );
}
