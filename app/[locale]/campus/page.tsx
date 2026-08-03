import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { ProgressRing } from '@bze/ui';
import { Greeting } from '@/components/shell';
import { Merkkarte, WochenberichtKarte } from '@/components/dashboard';
import type { Wochenbericht } from '@/components/dashboard';
import { ladeFortsetzenEmpfehlung } from './fortschritt/_lib/queries';
import { ladeFokusStand } from './_lib/push-queries';
import { ladeFragenUebersicht } from './lernen/_lib/fragen';

/**
 * Start-Dashboard im Figma-Mobile-Look (Foundations + Lernen-Hub-Muster).
 */
export default async function CampusStart({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('campus');
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profil } = user
    ? await supabase.from('profiles').select('vorname').eq('id', user.id).maybeSingle()
    : { data: null };

  const [empfehlung, fokus, fragenUebersicht, { data: berichtRow }] = await Promise.all([
    user ? ladeFortsetzenEmpfehlung(user.id) : null,
    user ? ladeFokusStand(user.id) : null,
    ladeFragenUebersicht(user?.id ?? null),
    user
      ? supabase
          .from('wochenberichte')
          .select('id, jahr, kalenderwoche, inhalt, merksaetze, gelesen')
          .eq('user_id', user.id)
          .order('jahr', { ascending: false })
          .order('kalenderwoche', { ascending: false })
          .limit(1)
          .maybeSingle()
      : { data: null },
  ]);

  const wochenbericht = (berichtRow as Wochenbericht | null) ?? null;
  const fehler = fragenUebersicht.gruppen.find((gruppe) => gruppe.id === 'falsch')?.anzahl ?? 0;
  const offen = fragenUebersicht.gruppen.find((gruppe) => gruppe.id === 'alle')?.anzahl ?? 0;
  const streak = fokus?.serie.laenge ?? 0;
  const fragenZiel = 20;
  const pruefungsZiel = 1;
  const fragenErledigt = fokus?.tagesziel.erledigt ?? 0;
  const pruefungenErledigt = fokus?.pruefungsziel.erledigt ?? 0;
  const fragenAnteil = Math.min(1, fragenErledigt / fragenZiel);
  const pruefungAnteil = Math.min(1, pruefungenErledigt / pruefungsZiel);
  const tageszielProzent = Math.round(((fragenAnteil + pruefungAnteil) / 2) * 100);
  const zielHref =
    fragenAnteil < 1
      ? fehler > 0
        ? `/${locale}/campus/lernen/fragen?status=falsch&limit=5`
        : `/${locale}/campus/lernen/fragen`
      : `/${locale}/campus/pruefung`;
  const zielText = fragenAnteil < 1 ? (fehler > 0 ? '5 Fehler verbessern' : '20 Fragen lernen') : 'Prüfung starten';

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-4 px-5 pb-6 pt-3">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Greeting name={profil?.vorname ?? undefined} />
          <p className="mt-1 text-[14px] text-fg-muted">
            Ein kurzer Lauf reicht, damit dein Fortschritt weiterzählt.
          </p>
        </div>
        <div
          className="streak-flame flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-[18px] font-black text-fg-onPrimary"
          aria-label={`Streak ${Math.max(0, streak)} Tage`}
        >
          {Math.max(0, streak)}
        </div>
      </header>

      <section className="grid grid-cols-3 gap-2">
        <div className="rounded-[14px] border border-border bg-surface p-3 text-center">
          <p className="text-[18px] font-extrabold text-primary">{streak > 0 ? streak : 0}</p>
          <p className="text-[11px] font-semibold text-fg-muted">Streak</p>
        </div>
        <div className="rounded-[14px] border border-border bg-surface p-3 text-center">
          <p className="text-[18px] font-extrabold text-primary">{offen}</p>
          <p className="text-[11px] font-semibold text-fg-muted">Offen</p>
        </div>
        <div className="rounded-[14px] border border-border bg-surface p-3 text-center">
          <p className="text-[18px] font-extrabold text-danger">{fehler}</p>
          <p className="text-[11px] font-semibold text-fg-muted">Fehler</p>
        </div>
      </section>

      <section className="rounded-[16px] border border-border bg-surface p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <ProgressRing
            value={tageszielProzent}
            size={64}
            label={`Tagesziel ${tageszielProzent} Prozent`}
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-[16px] font-bold text-fg">Tagesziel</h2>
            <p className="text-[12px] text-fg-muted">
              Heute: {fragenZiel} Fragen und {pruefungsZiel} Prüfung
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-[12px] bg-bg-subtle p-2.5">
            <div className="flex items-center justify-between text-[12px] font-bold">
              <span>Fragen</span>
              <span>
                {Math.min(fragenErledigt, fragenZiel)}/{fragenZiel}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border" aria-hidden>
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.round(fragenAnteil * 100)}%` }}
              />
            </div>
          </div>
          <div className="rounded-[12px] bg-bg-subtle p-2.5">
            <div className="flex items-center justify-between text-[12px] font-bold">
              <span>Prüfung</span>
              <span>
                {Math.min(pruefungenErledigt, pruefungsZiel)}/{pruefungsZiel}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border" aria-hidden>
              <div
                className="h-full rounded-full bg-info"
                style={{ width: `${Math.round(pruefungAnteil * 100)}%` }}
              />
            </div>
          </div>
        </div>
        <Link
          href={zielHref}
          className="touchable mt-3 flex min-h-11 items-center justify-center rounded-full bg-primary px-4 text-[14px] font-bold text-fg-onPrimary"
        >
          {zielText} →
        </Link>
      </section>

      <Link
        href={`/${locale}/campus/topic/PT-MES`}
        className="touchable rounded-[16px] border border-primary-border bg-primary-subtle p-4"
      >
        <p className="text-[11px] font-bold uppercase tracking-wide text-primary">{t('topics')}</p>
        <p className="mt-1 text-[15px] font-bold text-fg">Messen und Prüfen</p>
        <p className="mt-1 text-[13px] text-fg-muted">{t('topicsInfo')} — Lernpfad mit Statuskarten</p>
      </Link>

      {empfehlung ? (
        <Link
          href={`/${locale}/campus/lernen/thema/${empfehlung.themaId}`}
          className="touchable rounded-[16px] border border-border bg-surface p-4"
        >
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
            {t('fortsetzenTitel')}
          </p>
          <p className="mt-1 text-[15px] font-bold text-fg">
            {t('fortsetzenAlsNaechstes', { thema: empfehlung.bezeichnung })}
          </p>
          <p className="mt-1 text-[13px] text-fg-muted">
            {t('fortsetzenRest', {
              offen: empfehlung.kernOffen,
              prozent: Math.round(empfehlung.anteil * 100),
            })}
          </p>
        </Link>
      ) : null}

      <section className="grid grid-cols-3 gap-2">
        <Link
          href={`/${locale}/campus/topic`}
          className="touchable flex flex-col items-center gap-1 rounded-[14px] border border-border bg-surface p-3"
        >
          <span className="flex size-10 items-center justify-center rounded-[10px] bg-[#f0fdfa] text-[16px] font-bold text-[#0d9488]">
            F
          </span>
          <span className="text-[12px] font-bold text-fg">{t('topics')}</span>
        </Link>
        <Link
          href={`/${locale}/campus/lernen`}
          className="touchable flex flex-col items-center gap-1 rounded-[14px] border border-border bg-surface p-3"
        >
          <span className="flex size-10 items-center justify-center rounded-[10px] bg-primary text-[16px] font-bold text-fg-onPrimary">
            ?
          </span>
          <span className="text-[12px] font-bold text-fg">{t('lernen')}</span>
        </Link>
        <Link
          href={`/${locale}/campus/pruefung`}
          className="touchable flex flex-col items-center gap-1 rounded-[14px] border border-border bg-surface p-3"
        >
          <span className="flex size-10 items-center justify-center rounded-[10px] bg-info-bg text-[16px] font-bold text-info">
            P
          </span>
          <span className="text-[12px] font-bold text-fg">{t('pruefung')}</span>
        </Link>
      </section>

      <section className="rounded-[16px] border border-border bg-surface p-4">
        {wochenbericht ? (
          <div className="space-y-3">
            <WochenberichtKarte bericht={wochenbericht} />
            <Merkkarte merksaetze={wochenbericht.merksaetze ?? null} />
          </div>
        ) : (
          <div>
            <p className="text-[15px] font-bold text-fg">Noch kein Wochenbericht</p>
            <p className="mt-1 text-[13px] text-fg-muted">
              Sobald ein Bericht bereitsteht, erscheint er hier.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
