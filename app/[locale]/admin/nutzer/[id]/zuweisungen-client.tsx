'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@bze/ui';
import { weiseZuAction, entferneZuweisungAction } from '../actions';
import { fehlerSchluessel } from '../../_lib/fehler';

type Person = { id: string; benutzername: string; vorname: string | null; nachname: string | null };

export function ZuweisungenClient({
  richtung,
  eigeneId,
  zugewiesen,
  verfuegbar,
  leerText,
  auswahlText,
}: {
  richtung: 'teilnehmer-zu-ausbilder' | 'ausbilder-zu-teilnehmer';
  eigeneId: string;
  zugewiesen: Person[];
  verfuegbar: Person[];
  leerText: string;
  auswahlText: string;
}) {
  const t = useTranslations('admin');
  const router = useRouter();
  const [istPending, startTransition] = useTransition();
  const [ausgewaehlt, setAusgewaehlt] = useState('');
  const [fehler, setFehler] = useState<string | null>(null);

  function ausbilderTeilnehmerIds(gegenueberId: string): [string, string] {
    return richtung === 'teilnehmer-zu-ausbilder' ? [gegenueberId, eigeneId] : [eigeneId, gegenueberId];
  }

  function zuweisen() {
    if (!ausgewaehlt) return;
    setFehler(null);
    const [ausbilderId, teilnehmerId] = ausbilderTeilnehmerIds(ausgewaehlt);
    startTransition(async () => {
      const antwort = await weiseZuAction(ausbilderId, teilnehmerId);
      if (!antwort.ok) {
        setFehler(antwort.fehler);
        return;
      }
      setAusgewaehlt('');
      router.refresh();
    });
  }

  function entfernen(gegenueberId: string) {
    setFehler(null);
    const [ausbilderId, teilnehmerId] = ausbilderTeilnehmerIds(gegenueberId);
    startTransition(async () => {
      const antwort = await entferneZuweisungAction(ausbilderId, teilnehmerId);
      if (!antwort.ok) {
        setFehler(antwort.fehler);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      {zugewiesen.length === 0 ? (
        <p className="text-sm text-fg-muted">{leerText}</p>
      ) : (
        <ul className="space-y-2">
          {zugewiesen.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2">
              <span className="text-[15px]">
                {p.vorname} {p.nachname} <span className="text-fg-muted">· {p.benutzername}</span>
              </span>
              <Button variante="leise" disabled={istPending} onClick={() => entfernen(p.id)}>
                {t('nutzer.entfernen')}
              </Button>
            </li>
          ))}
        </ul>
      )}

      {verfuegbar.length > 0 && (
        <div className="flex flex-wrap items-end gap-2 pt-2">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor={`zuweisen-${richtung}`} className="mb-1 block text-xs font-semibold text-fg-muted">
              {auswahlText}
            </label>
            <select
              id={`zuweisen-${richtung}`}
              value={ausgewaehlt}
              onChange={(e) => setAusgewaehlt(e.currentTarget.value)}
              className="touchable w-full rounded-xl border border-border bg-surface px-3 py-2 text-[15px]"
            >
              <option value="">{t('nutzer.bitteWaehlen')}</option>
              {verfuegbar.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.vorname} {p.nachname} ({p.benutzername})
                </option>
              ))}
            </select>
          </div>
          <Button variante="primary" disabled={!ausgewaehlt || istPending} onClick={zuweisen}>
            {t('nutzer.zuweisen')}
          </Button>
        </div>
      )}

      {fehler && (
        <p role="alert" className="text-sm text-status-falsch">
          {t(`fehler.${fehlerSchluessel(fehler)}`)}
        </p>
      )}
    </div>
  );
}
