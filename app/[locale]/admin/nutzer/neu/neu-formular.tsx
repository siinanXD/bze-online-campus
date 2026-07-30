'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@bze/ui';
import { erstelleNutzerAction } from '../actions';
import { nutzerAnlegenSchema, ROLLEN, type NutzerAnlegenEingabe } from '../../_lib/schemas';
import type { Rolle, Zugangsdaten } from '../../_lib/types';
import { fehlerSchluessel } from '../../_lib/fehler';

type ZugangsdatenEintrag = Zugangsdaten & { vorname: string; nachname: string; rolle: Rolle };

function speicherEintragFuerDruck(kohorteId: string, eintrag: ZugangsdatenEintrag) {
  if (typeof window === 'undefined') return;
  const schluessel = `bze_admin_zugangsdaten_${kohorteId}`;
  try {
    const bestehend: ZugangsdatenEintrag[] = JSON.parse(window.sessionStorage.getItem(schluessel) ?? '[]');
    window.sessionStorage.setItem(schluessel, JSON.stringify([...bestehend, eintrag]));
  } catch {
    // sessionStorage nicht verfügbar (z. B. privater Modus) — Druckliste ist dann nur unvollständig, kein harter Fehler
  }
}

const LEER: NutzerAnlegenEingabe = {
  benutzername: '',
  vorname: '',
  nachname: '',
  rolle: 'teilnehmer',
  kohorte_id: '',
};

export function NeuFormular({
  locale,
  kohorten,
  erlaubteRollen,
}: {
  locale: string;
  kohorten: { id: string; bezeichnung: string }[];
  erlaubteRollen: Rolle[];
}) {
  const t = useTranslations('admin');
  const tc = useTranslations('common');
  const [eingabe, setEingabe] = useState<NutzerAnlegenEingabe>(LEER);
  const [fehler, setFehler] = useState<Record<string, string>>({});
  const [istPending, startTransition] = useTransition();
  const [ergebnis, setErgebnis] = useState<ZugangsdatenEintrag | null>(null);
  const [serverFehler, setServerFehler] = useState<string | null>(null);

  function feld<K extends keyof NutzerAnlegenEingabe>(name: K, wert: NutzerAnlegenEingabe[K]) {
    setEingabe((v) => ({ ...v, [name]: wert }));
  }

  function absenden(e: React.FormEvent) {
    e.preventDefault();
    setServerFehler(null);
    setErgebnis(null);

    const geprueft = nutzerAnlegenSchema.safeParse(eingabe);
    if (!geprueft.success) {
      const neueFehler: Record<string, string> = {};
      for (const issue of geprueft.error.issues) {
        neueFehler[String(issue.path[0])] = issue.message;
      }
      setFehler(neueFehler);
      return;
    }
    setFehler({});

    startTransition(async () => {
      const antwort = await erstelleNutzerAction(geprueft.data);
      if (!antwort.ok) {
        setServerFehler(antwort.fehler);
        return;
      }
      const eintrag: ZugangsdatenEintrag = {
        ...antwort.daten,
        vorname: geprueft.data.vorname,
        nachname: geprueft.data.nachname,
        rolle: geprueft.data.rolle,
      };
      if (geprueft.data.kohorte_id) speicherEintragFuerDruck(geprueft.data.kohorte_id, eintrag);
      setErgebnis(eintrag);
      setEingabe({ ...LEER, rolle: geprueft.data.rolle, kohorte_id: geprueft.data.kohorte_id });
    });
  }

  if (ergebnis) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border-2 border-primary bg-surface p-4">
          <p className="text-sm font-bold text-primary">{t('nutzer.zugangsdatenTitel')}</p>
          <p className="mt-1 text-sm text-fg-muted">{t('nutzer.zugangsdatenHinweis')}</p>
          <dl className="mt-3 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-[15px]">
            <dt className="text-fg-muted">{t('nutzer.spalte.name')}</dt>
            <dd className="font-semibold">{ergebnis.vorname} {ergebnis.nachname}</dd>
            <dt className="text-fg-muted">{t('nutzer.spalte.benutzername')}</dt>
            <dd className="font-mono font-semibold">{ergebnis.benutzername}</dd>
            <dt className="text-fg-muted">{t('nutzer.initialpasswort')}</dt>
            <dd className="font-mono text-lg font-bold tracking-wide">{ergebnis.initialPasswort}</dd>
          </dl>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variante="primary" onClick={() => setErgebnis(null)}>
            {t('nutzer.weiterenAnlegen')}
          </Button>
          {eingabe.kohorte_id && (
            <Link href={`/${locale}/admin/nutzer/kohorte/${eingabe.kohorte_id}/drucken`}>
              <Button variante="sekundaer">{t('nutzer.kohorteDrucken')}</Button>
            </Link>
          )}
          <Link href={`/${locale}/admin/nutzer`}>
            <Button variante="leise">{t('nutzer.zurListe')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={absenden} className="space-y-4" noValidate>
      <div>
        <label htmlFor="vorname" className="mb-1 block text-sm font-semibold">
          {t('nutzer.feld.vorname')}
        </label>
        <input
          id="vorname"
          value={eingabe.vorname}
          onChange={(e) => feld('vorname', e.currentTarget.value)}
          className="touchable w-full rounded-xl border border-border bg-surface px-3 py-2 text-[15px]"
          aria-invalid={!!fehler.vorname}
          aria-describedby={fehler.vorname ? 'vorname-fehler' : undefined}
        />
        {fehler.vorname && <p id="vorname-fehler" className="mt-1 text-sm text-status-falsch">{t(`fehler.${fehler.vorname}`)}</p>}
      </div>

      <div>
        <label htmlFor="nachname" className="mb-1 block text-sm font-semibold">
          {t('nutzer.feld.nachname')}
        </label>
        <input
          id="nachname"
          value={eingabe.nachname}
          onChange={(e) => feld('nachname', e.currentTarget.value)}
          className="touchable w-full rounded-xl border border-border bg-surface px-3 py-2 text-[15px]"
          aria-invalid={!!fehler.nachname}
          aria-describedby={fehler.nachname ? 'nachname-fehler' : undefined}
        />
        {fehler.nachname && <p id="nachname-fehler" className="mt-1 text-sm text-status-falsch">{t(`fehler.${fehler.nachname}`)}</p>}
      </div>

      <div>
        <label htmlFor="benutzername" className="mb-1 block text-sm font-semibold">
          {t('nutzer.feld.benutzername')}
        </label>
        <input
          id="benutzername"
          value={eingabe.benutzername}
          onChange={(e) => feld('benutzername', e.currentTarget.value.toLowerCase())}
          className="touchable w-full rounded-xl border border-border bg-surface px-3 py-2 font-mono text-[15px]"
          aria-invalid={!!fehler.benutzername}
          aria-describedby="benutzername-hinweis"
        />
        <p id="benutzername-hinweis" className="mt-1 text-xs text-fg-muted">{t('nutzer.feld.benutzernameHinweis')}</p>
        {fehler.benutzername && <p className="mt-1 text-sm text-status-falsch">{t(`fehler.${fehler.benutzername}`)}</p>}
      </div>

      <div>
        <label htmlFor="rolle" className="mb-1 block text-sm font-semibold">
          {t('nutzer.feld.rolle')}
        </label>
        <select
          id="rolle"
          value={eingabe.rolle}
          onChange={(e) => feld('rolle', e.currentTarget.value as Rolle)}
          className="touchable w-full rounded-xl border border-border bg-surface px-3 py-2 text-[15px]"
        >
          {ROLLEN.filter((r) => erlaubteRollen.includes(r)).map((r) => (
            <option key={r} value={r}>
              {t(`rollen.${r}`)}
            </option>
          ))}
        </select>
      </div>

      {eingabe.rolle === 'teilnehmer' && (
        <div>
          <label htmlFor="kohorte" className="mb-1 block text-sm font-semibold">
            {t('nutzer.feld.kohorte')}
          </label>
          <select
            id="kohorte"
            value={eingabe.kohorte_id}
            onChange={(e) => feld('kohorte_id', e.currentTarget.value)}
            className="touchable w-full rounded-xl border border-border bg-surface px-3 py-2 text-[15px]"
            aria-invalid={!!fehler.kohorte_id}
          >
            <option value="">{t('nutzer.feld.kohorteWaehlen')}</option>
            {kohorten.map((k) => (
              <option key={k.id} value={k.id}>
                {k.bezeichnung}
              </option>
            ))}
          </select>
          {fehler.kohorte_id && <p className="mt-1 text-sm text-status-falsch">{t(`fehler.${fehler.kohorte_id}`)}</p>}
        </div>
      )}

      {serverFehler && (
        <p role="alert" className="rounded-xl border border-status-falsch bg-surface px-3 py-2 text-sm text-status-falsch">
          {t(`fehler.${fehlerSchluessel(serverFehler)}`)}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" variante="primary" disabled={istPending}>
          {istPending ? t('nutzer.wirdAngelegt') : t('nutzer.anlegen')}
        </Button>
        <Link href={`/${locale}/admin/nutzer`}>
          <Button type="button" variante="leise">
            {tc('abbrechen')}
          </Button>
        </Link>
      </div>
    </form>
  );
}
