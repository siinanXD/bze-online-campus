'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button, Card, cn } from '@bze/ui';
import { NACHWEIS_ART, type NachweisArt, type NachweisInhalt } from '@bze/core/nachweis';
import {
  aktualisiereNachweis,
  erstelleNachweis,
  formuliereMitKi,
} from '../_lib/actions';
import { DiktatFeld } from './diktat-feld';

export interface NachweisFormWerte {
  art: NachweisArt;
  zeitraumVon: string | null;
  zeitraumBis: string | null;
  ausbildungsjahr: number | null;
  inhalt: NachweisInhalt;
  rahmenplanPositionen: string[];
  kiFormuliert: boolean;
}

export function NachweisForm({
  modus,
  nachweisId,
  initial,
  rahmenplanKatalog,
  locale,
}: {
  modus: 'neu' | 'bearbeiten';
  nachweisId?: string;
  initial: NachweisFormWerte;
  rahmenplanKatalog: string[];
  locale: string;
}) {
  const t = useTranslations('berichtsheft');
  const router = useRouter();
  const [pending, start] = useTransition();
  const [kiPending, startKi] = useTransition();

  const [art, setArt] = useState<NachweisArt>(initial.art);
  const [von, setVon] = useState(initial.zeitraumVon ?? '');
  const [bis, setBis] = useState(initial.zeitraumBis ?? '');
  const [jahr, setJahr] = useState<string>(initial.ausbildungsjahr ? String(initial.ausbildungsjahr) : '');
  const [taetigkeiten, setTaetigkeiten] = useState(initial.inhalt.taetigkeiten ?? '');
  const [unterweisungen, setUnterweisungen] = useState(initial.inhalt.unterweisungen ?? '');
  const [berufsschulthemen, setBerufsschulthemen] = useState(initial.inhalt.berufsschulthemen ?? '');
  const [positionen, setPositionen] = useState<string[]>(initial.rahmenplanPositionen);
  const [kiFormuliert, setKiFormuliert] = useState(initial.kiFormuliert);
  const [kiHinweisSichtbar, setKiHinweisSichtbar] = useState(initial.kiFormuliert);
  const [fehler, setFehler] = useState<string | null>(null);
  const kiHinweisRef = useRef<HTMLParagraphElement>(null);

  function togglePosition(pos: string) {
    setPositionen((prev) => (prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]));
  }

  function aktuelleWerte(): NachweisFormWerte {
    return {
      art,
      zeitraumVon: von || null,
      zeitraumBis: bis || null,
      ausbildungsjahr: jahr ? Number(jahr) : null,
      inhalt: { taetigkeiten, unterweisungen, berufsschulthemen },
      rahmenplanPositionen: positionen,
      kiFormuliert,
    };
  }

  function speichern() {
    setFehler(null);
    start(async () => {
      const werte = aktuelleWerte();
      const res =
        modus === 'neu'
          ? await erstelleNachweis(werte)
          : await aktualisiereNachweis({ ...werte, id: nachweisId });
      if (!res.ok) {
        const bekannt = ['nicht_gefunden', 'gesperrt'];
        setFehler(bekannt.includes(res.fehler) ? t(`fehler.${res.fehler}`) : t('fehler.speichern_fehlgeschlagen'));
        return;
      }
      const ziel = res.id ?? nachweisId;
      router.push(ziel ? `/${locale}/campus/berichtsheft/${ziel}` : `/${locale}/campus/berichtsheft`);
      router.refresh();
    });
  }

  function kiFormulieren() {
    setFehler(null);
    startKi(async () => {
      const res = await formuliereMitKi({
        art,
        zeitraumVon: von || null,
        zeitraumBis: bis || null,
        inhalt: { taetigkeiten, unterweisungen, berufsschulthemen },
        rahmenplanKatalog,
      });
      if (!res.ok) {
        setFehler(t('ki.fehler'));
        return;
      }
      const f = res.formulierung;
      if (f.taetigkeiten) setTaetigkeiten(f.taetigkeiten);
      if (f.unterweisungen) setUnterweisungen(f.unterweisungen);
      if (f.berufsschulthemen) setBerufsschulthemen(f.berufsschulthemen);
      if (Array.isArray(f.rahmenplan_positionen) && f.rahmenplan_positionen.length) {
        setPositionen((prev) => [...new Set([...prev, ...f.rahmenplan_positionen])]);
      }
      setKiFormuliert(true);
      setKiHinweisSichtbar(true);
      setTimeout(() => kiHinweisRef.current?.focus(), 0);
    });
  }

  const inputCls =
    'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm min-h-12';

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">{t('form.art')}</span>
            <select
              value={art}
              onChange={(e) => setArt(e.target.value as NachweisArt)}
              className={inputCls}
            >
              {NACHWEIS_ART.map((a) => (
                <option key={a} value={a}>
                  {t(`art.${a}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">{t('form.ausbildungsjahr')}</span>
            <input
              type="number"
              min={1}
              max={4}
              value={jahr}
              onChange={(e) => setJahr(e.target.value)}
              className={inputCls}
              inputMode="numeric"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">{t('form.zeitraumVon')}</span>
            <input type="date" value={von} onChange={(e) => setVon(e.target.value)} className={inputCls} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">{t('form.zeitraumBis')}</span>
            <input type="date" value={bis} onChange={(e) => setBis(e.target.value)} className={inputCls} />
          </label>
        </div>
      </Card>

      <Card className="space-y-4">
        <DiktatFeld
          label={t('form.taetigkeiten')}
          hilfe={t('form.taetigkeitenHilfe')}
          value={taetigkeiten}
          onChange={setTaetigkeiten}
          locale={locale}
        />
        <DiktatFeld
          label={t('form.unterweisungen')}
          value={unterweisungen}
          onChange={setUnterweisungen}
          locale={locale}
        />
        <DiktatFeld
          label={t('form.berufsschulthemen')}
          value={berufsschulthemen}
          onChange={setBerufsschulthemen}
          locale={locale}
        />

        <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold">{t('ki.titel')}</span>
            <Button
              type="button"
              variant="soft"
              className="min-h-12"
              disabled={kiPending}
              onClick={kiFormulieren}
            >
              {kiPending ? t('ki.laeuft') : t('ki.knopf')}
            </Button>
          </div>
          {/* Compliance-Pflichthinweis (Spec §10): Inhalte stammen vom Nutzer. */}
          <p
            ref={kiHinweisRef}
            tabIndex={-1}
            className={cn(
              'text-xs text-muted',
              kiHinweisSichtbar && 'font-semibold text-fg',
            )}
          >
            {t('ki.hinweis')}
          </p>
        </div>
      </Card>

      {rahmenplanKatalog.length > 0 && (
        <Card className="space-y-2">
          <span className="text-sm font-semibold">{t('form.rahmenplan')}</span>
          <p className="text-xs text-muted">{t('form.rahmenplanHilfe')}</p>
          <ul className="flex flex-wrap gap-2">
            {rahmenplanKatalog.map((pos) => {
              const aktiv = positionen.includes(pos);
              return (
                <li key={pos}>
                  <button
                    type="button"
                    onClick={() => togglePosition(pos)}
                    aria-pressed={aktiv}
                    className={cn(
                      'touchable min-h-12 rounded-full border px-3 py-1 text-sm',
                      aktiv
                        ? 'border-accent bg-accent/10 font-semibold text-accent'
                        : 'border-border text-fg hover:bg-surface',
                    )}
                  >
                    {aktiv ? '✓ ' : ''}
                    {pos}
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {fehler && (
        <p className="text-sm text-status-falsch" role="alert">
          {fehler}
        </p>
      )}

      {/* Primäraktion im unteren Drittel (Spec §7). */}
      <div className="flex flex-wrap gap-3">
        <Button type="button" className="min-h-12" disabled={pending} onClick={speichern}>
          {pending ? t('form.speichernLaeuft') : t('form.speichern')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="min-h-12"
          onClick={() => router.push(`/${locale}/campus/berichtsheft`)}
        >
          {t('form.abbrechen')}
        </Button>
      </div>
    </div>
  );
}
