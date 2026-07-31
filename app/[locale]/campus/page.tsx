import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Card, ProgressRing } from '@bze/ui';
import { Greeting } from '@/components/shell';
import { Merkkarte, WochenberichtKarte } from '@/components/dashboard';
import type { Wochenbericht } from '@/components/dashboard';
import { ladeFortsetzenEmpfehlung } from './fortschritt/_lib/queries';
import { ladeFokusStand } from './_lib/push-queries';
import { ladeFragenUebersicht } from './lernen/_lib/fragen';

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
  const streakText =
    !fokus || fokus.serie.status === 'gerissen'
      ? 'Heute starten'
      : fokus.serie.status === 'gefaehrdet'
        ? `${streak} Tage - heute noch offen`
        : `${Math.max(1, streak)} Tage in Folge`;
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
    <main className="mx-auto flex min-h-full max-w-2xl flex-col gap-3 p-3 sm:p-4">
      <section className="campus-pop shrink-0 rounded-xl border border-primary-border bg-primary-subtle p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Greeting name={profil?.vorname ?? undefined} />
            <p className="mt-1 text-sm text-fg-muted">Ein kurzer Lauf reicht, damit dein Fortschritt weiterzaehlt.</p>
          </div>
          <div className="streak-flame grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary text-xl font-black text-fg-onPrimary">
            {Math.max(1, streak)}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-surface/80 p-2">
            <p className="text-lg font-extrabold text-primary">{streak > 0 ? streak : 0}</p>
            <p className="text-[11px] font-semibold text-fg-muted">Streak</p>
          </div>
          <div className="rounded-lg bg-surface/80 p-2">
            <p className="text-lg font-extrabold text-primary">{offen}</p>
            <p className="text-[11px] font-semibold text-fg-muted">Offen</p>
          </div>
          <div className="rounded-lg bg-surface/80 p-2">
            <p className="text-lg font-extrabold text-danger">{fehler}</p>
            <p className="text-[11px] font-semibold text-fg-muted">Fehler</p>
          </div>
        </div>
      </section>

      <section className="shrink-0 rounded-lg border border-border bg-surface p-3 shadow-sm">
        <div className="grid grid-cols-[auto_1fr] items-center gap-3">
          <ProgressRing
            value={tageszielProzent}
            size={68}
            label={`Tagesziel ${tageszielProzent} Prozent`}
          />
          <div className="min-w-0">
            <p className="text-sm font-bold">Tagesziel</p>
            <p className="text-xs text-fg-muted">
              Heute: {fragenZiel} Fragen und {pruefungsZiel} Prüfung
            </p>
            <Link
              href={zielHref}
              className="touchable mt-2 inline-flex min-h-10 items-center rounded-md bg-primary px-4 text-sm font-bold text-fg-onPrimary"
            >
              {zielText}
            </Link>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-border bg-bg-subtle p-2">
            <div className="flex items-center justify-between gap-2 text-xs font-bold">
              <span>Fragen</span>
              <span>{Math.min(fragenErledigt, fragenZiel)}/{fragenZiel}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface" aria-hidden="true">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(fragenAnteil * 100)}%` }} />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-bg-subtle p-2">
            <div className="flex items-center justify-between gap-2 text-xs font-bold">
              <span>Prüfung</span>
              <span>{Math.min(pruefungenErledigt, pruefungsZiel)}/{pruefungsZiel}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface" aria-hidden="true">
              <div className="h-full rounded-full bg-info" style={{ width: `${Math.round(pruefungAnteil * 100)}%` }} />
            </div>
          </div>
        </div>
      </section>

      {empfehlung && (
        <Link href={`/${locale}/campus/lernen/thema/${empfehlung.themaId}`} className="block shrink-0">
          <Card variante="interaktiv" className="p-4">
            <p className="text-xs font-bold uppercase text-primary">{t('fortsetzenTitel')}</p>
            <p className="mt-1 font-bold">{t('fortsetzenAlsNaechstes', { thema: empfehlung.bezeichnung })}</p>
            <p className="text-sm text-fg-muted">
              {t('fortsetzenRest', {
                offen: empfehlung.kernOffen,
                prozent: Math.round(empfehlung.anteil * 100),
              })}
            </p>
          </Card>
        </Link>
      )}

      <section className="grid shrink-0 grid-cols-3 gap-2">
        <Link href={`/${locale}/campus/lernen`} className="block">
          <Card variante="interaktiv" className="h-full p-3 text-center">
            <p className="text-xl font-black">?</p>
            <p className="text-xs font-bold">{t('lernen')}</p>
          </Card>
        </Link>
        <Link href={`/${locale}/campus/pruefung`} className="block">
          <Card variante="interaktiv" className="h-full p-3 text-center">
            <p className="text-xl font-black">P</p>
            <p className="text-xs font-bold">{t('pruefung')}</p>
          </Card>
        </Link>
        <Link href={`/${locale}/campus/berichtsheft`} className="block">
          <Card variante="interaktiv" className="h-full p-3 text-center">
            <p className="text-xl font-black">B</p>
            <p className="text-xs font-bold">Bericht</p>
          </Card>
        </Link>
      </section>

      <section className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-border bg-surface p-3">
        {wochenbericht ? (
          <div className="space-y-3">
            <WochenberichtKarte bericht={wochenbericht} />
            <Merkkarte merksaetze={wochenbericht.merksaetze ?? null} />
          </div>
        ) : (
          <div>
            <p className="font-bold">Noch kein Wochenbericht</p>
            <p className="mt-1 text-sm text-fg-muted">Sobald ein Bericht bereitsteht, erscheint er hier.</p>
          </div>
        )}
      </section>
    </main>
  );
}
