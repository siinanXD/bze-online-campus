import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { ladeFortsetzenEmpfehlung } from '../fortschritt/_lib/queries';
import { berechneFragenFortschrittProzent, ladeFragenUebersicht } from './_lib/fragen';

/**
 * Figma 04.1 Lernen Hub — Fragen üben, Fachkunde lesen, Lernwerkzeuge.
 */
export default async function LernenIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('lernen');
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const uebersicht = await ladeFragenUebersicht(user?.id ?? null);
  const themen = uebersicht.themen;
  const gruppen = uebersicht.gruppen;
  const empfehlung = user ? await ladeFortsetzenEmpfehlung(user.id) : null;
  const gesamtProzent = berechneFragenFortschrittProzent(themen);
  const gesamtFragen = themen.reduce((sum, t) => sum + t.gesamt, 0);
  const beherrscht = themen.reduce((sum, t) => sum + t.fertig, 0);
  const offen = gruppen.find((g) => g.id === 'alle')?.anzahl ?? 0;
  const lerneinheitAnzahl = await zaehleFachkundeDateien();

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-4 px-5 pb-6 pt-3">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-[22px] font-extrabold leading-7 text-fg">{t('titel')}</h1>
        <div
          className="flex size-9 items-center justify-center rounded-full bg-info-bg text-[12px] font-bold text-info"
          aria-label={`Gesamtfortschritt ${gesamtProzent} Prozent`}
        >
          {gesamtProzent}%
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <article className="flex flex-col gap-3.5 rounded-[16px] border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-[12px] bg-primary text-[20px] font-bold text-fg-onPrimary">
              ?
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[18px] font-bold text-fg">Fragen üben</h2>
              <p className="text-[13px] text-fg-muted">Trainiere mit Prüfungsfragen</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-lg bg-bg-subtle px-2 py-1 text-[12px] font-semibold text-fg">
              {gesamtFragen} Fragen
            </span>
            <span className="rounded-lg bg-success-bg px-2 py-1 text-[12px] font-semibold text-success">
              {beherrscht} beherrscht
            </span>
            <span className="rounded-lg bg-info-bg px-2 py-1 text-[12px] font-semibold text-info">
              {offen} offen
            </span>
          </div>
          <Link
            href={`/${locale}/campus/lernen/fragen`}
            className="touchable flex min-h-11 items-center justify-center rounded-full bg-primary px-4 text-[14px] font-bold text-fg-onPrimary"
          >
            Starten →
          </Link>
        </article>

        <article className="flex flex-col gap-3.5 rounded-[16px] border border-border bg-surface p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-[12px] bg-[#f0fdfa] text-[18px] font-bold text-[#0d9488]">
              F
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[18px] font-bold text-fg">Fachkunde lesen</h2>
              <p className="text-[13px] text-fg-muted">Lerneinheiten &amp; Theorie</p>
            </div>
          </div>
          <p className="text-[13px] font-semibold text-fg">
            {lerneinheitAnzahl} Lerneinheiten
            <span className="mx-1.5 text-fg-subtle">·</span>
            <Link href={`/${locale}/campus/topic/PT-MES`} className="text-[#0d9488]">
              Lernpfad öffnen
            </Link>
          </p>
          <Link
            href={`/${locale}/campus/topic`}
            className="touchable flex min-h-11 items-center justify-center rounded-full border-[1.5px] border-[#0d9488] px-4 text-[14px] font-bold text-[#0d9488]"
          >
            Öffnen
          </Link>
        </article>

        <article className="flex flex-col gap-3 rounded-[16px] border border-border bg-surface p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-[12px] bg-[#f5f3ff] text-[18px] font-bold text-[#7c3aed]">
              W
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[18px] font-bold text-fg">Lernwerkzeuge</h2>
              <p className="text-[13px] text-fg-muted">Interaktive Hilfsmittel</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Link
              href={`/${locale}/campus/lernen/werkzeuge/glossar`}
              className="rounded-lg bg-[#f5f3ff] px-2.5 py-1.5 text-[12px] font-semibold text-[#7c3aed]"
            >
              Glossar
            </Link>
            <Link
              href={`/${locale}/campus/lernen/werkzeuge/formeltrainer`}
              className="rounded-lg bg-[#f5f3ff] px-2.5 py-1.5 text-[12px] font-semibold text-[#7c3aed]"
            >
              Formeltrainer
            </Link>
            <Link
              href={`/${locale}/campus/lernen/werkzeuge/fehlerdiagnose`}
              className="rounded-lg bg-[#f5f3ff] px-2.5 py-1.5 text-[12px] font-semibold text-[#7c3aed]"
            >
              Fehlerdiagnose
            </Link>
          </div>
        </article>
      </section>

      {empfehlung ? (
        <Link
          href={`/${locale}/campus/lernen/thema/${empfehlung.themaId}`}
          className="rounded-[14px] border border-primary-border bg-primary-subtle px-4 py-3"
        >
          <p className="text-[11px] font-bold uppercase text-primary">Fortsetzen</p>
          <p className="truncate text-[15px] font-bold text-fg">{empfehlung.bezeichnung}</p>
        </Link>
      ) : null}

      <section className="mt-auto flex flex-col gap-2 pt-2" aria-label="Gesamtfortschritt">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-bold text-fg">Gesamtfortschritt</span>
          <span className="font-extrabold text-primary">{gesamtProzent}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-border" aria-hidden>
          <div className="h-full rounded-full bg-primary" style={{ width: `${gesamtProzent}%` }} />
        </div>
      </section>
    </main>
  );
}

async function zaehleFachkundeDateien(): Promise<number> {
  try {
    const dateien = await readdir(path.join(process.cwd(), 'content', 'fachkunde'));
    return dateien.filter((d) => d.endsWith('.mdx')).length;
  } catch {
    return 0;
  }
}
