'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button, Chip } from '@bze/ui';
import { createBrowserSupabase } from '@bze/db';
import { sprachwahlSchema, SPRACHEN } from '../lib/schemas';

/** Endonyme — bewusst sprachunabhängig, jede Sprache zeigt sich in ihrer eigenen Schrift. */
const SPRACHNAMEN: Record<(typeof SPRACHEN)[number], string> = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
  uk: 'Українська',
  tr: 'Türkçe',
};

export function SprachwahlForm({ locale }: { locale: string }) {
  const t = useTranslations('auth.sprachwahl');
  const tFehler = useTranslations('auth.fehler');
  const router = useRouter();

  const [sprache, setSprache] = useState<(typeof SPRACHEN)[number]>(
    (SPRACHEN as readonly string[]).includes(locale) ? (locale as (typeof SPRACHEN)[number]) : 'de',
  );
  const [beitrittscode, setBeitrittscode] = useState('');
  const [fehler, setFehler] = useState<string | null>(null);
  const [hinweis, setHinweis] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function weiterZuCampus(zielSprache: string) {
    router.replace(`/${zielSprache}/campus`);
  }

  function absenden(ereignis: FormEvent<HTMLFormElement>) {
    ereignis.preventDefault();
    setFehler(null);
    setHinweis(null);

    const ergebnis = sprachwahlSchema.safeParse({ sprache, beitrittscode });
    if (!ergebnis.success) {
      setFehler(tFehler('zuLang'));
      return;
    }

    startTransition(async () => {
      const supabase = createBrowserSupabase();
      const { data: sitzung } = await supabase.auth.getUser();
      if (!sitzung.user) {
        setFehler(tFehler('anmeldungFehlgeschlagen'));
        return;
      }

      const { error: spracheFehler } = await supabase
        .from('profiles')
        .update({ sprache: ergebnis.data.sprache })
        .eq('id', sitzung.user.id);

      if (spracheFehler) {
        setFehler(tFehler('serverfehler'));
        return;
      }

      if (!ergebnis.data.beitrittscode) {
        weiterZuCampus(ergebnis.data.sprache);
        return;
      }

      const { data: kohorte } = await supabase
        .from('kohorten')
        .select('id, bezeichnung')
        .eq('beitrittscode', ergebnis.data.beitrittscode)
        .maybeSingle();

      if (!kohorte) {
        setFehler(tFehler('codeUngueltig'));
        return;
      }

      const { error: beitrittFehler } = await supabase
        .from('kohorten_mitglieder')
        .insert({ kohorte_id: kohorte.id, user_id: sitzung.user.id });

      if (beitrittFehler) {
        // Aktueller RLS-Stand (AP-01, km_manage) erlaubt Schreiben auf kohorten_mitglieder
        // nur für admin/verwaltung — ein Teilnehmer kann sich damit noch nicht selbst per
        // Code eintragen. Offene Frage an AP-01/AP-03-Abstimmung, siehe Sitzungsnotiz.
        setFehler(tFehler('beitrittNichtMoeglich'));
        return;
      }

      setHinweis(t('beitrittErfolgreich', { kohorte: kohorte.bezeichnung }));
      weiterZuCampus(ergebnis.data.sprache);
    });
  }

  return (
    <form onSubmit={absenden} className="space-y-5" noValidate>
      <div>
        <span className="mb-2 block text-start text-sm font-semibold">{t('sprache')}</span>
        <div className="flex flex-wrap gap-2">
          {SPRACHEN.map((code) => (
            <Chip key={code} type="button" active={sprache === code} onClick={() => setSprache(code)}>
              {SPRACHNAMEN[code]}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="beitrittscode" className="mb-1 block text-start text-sm font-semibold">
          {t('beitrittscode')}
        </label>
        <input
          id="beitrittscode"
          name="beitrittscode"
          autoComplete="off"
          value={beitrittscode}
          onChange={(ereignis) => setBeitrittscode(ereignis.target.value.toUpperCase())}
          className="touchable w-full rounded-xl border border-border bg-bg px-3 text-[15px] uppercase tracking-wide text-fg"
        />
        <p className="mt-1 text-start text-xs text-fg-muted">{t('beitrittscodeHinweis')}</p>
      </div>

      {hinweis && (
        <p role="status" className="flex items-start gap-2 text-sm font-semibold text-status-fertig">
          <span aria-hidden="true">✓</span>
          <span>{hinweis}</span>
        </p>
      )}
      {fehler && (
        <p role="alert" className="flex items-start gap-2 text-sm font-semibold text-status-falsch">
          <span aria-hidden="true">✕</span>
          <span>{fehler}</span>
        </p>
      )}

      <div className="flex flex-col gap-3">
        <Button type="submit" disabled={pending} className="w-full" aria-busy={pending}>
          {pending ? t('ladeStatus') : t('weiter')}
        </Button>
        <Button
          type="button"
          variante="leise"
          className="w-full"
          disabled={pending}
          onClick={() => weiterZuCampus(sprache)}
        >
          {t('ueberspringen')}
        </Button>
      </div>
    </form>
  );
}
