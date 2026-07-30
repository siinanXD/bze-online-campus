'use client';

/**
 * Opt-in und Einstellungen für Erinnerungen.
 *
 * Gestaltungsentscheidungen, die hier bewusst getroffen sind:
 *
 * 1. **Kein Fragen beim ersten Besuch.** Die Systemabfrage erscheint erst, wenn
 *    jemand den Knopf drückt. Eine Abfrage direkt beim Laden wird verlässlich
 *    abgelehnt, und eine Ablehnung ist im Browser dauerhaft — man bekommt keine
 *    zweite Gelegenheit.
 * 2. **Der Nutzen steht vor dem Knopf.** Nicht „Benachrichtigungen erlauben?",
 *    sondern was konkret ankommt und wie oft.
 * 3. **Nach einer Ablehnung verschwindet der Knopf.** Er würde nichts mehr
 *    bewirken; stattdessen steht dort der Hinweis auf die Browsereinstellungen.
 */

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Alert, Button, Card, Checkbox, Select } from '@bze/ui';
import type { Anlass, PushEinstellungen } from '@bze/core/benachrichtigung';
import {
  erneuerePushAbo,
  geraeteZeitzone,
  lesePushZustand,
  meldePushAb,
  meldePushAn,
  type PushZustand,
} from '@/service-worker/push-client';
import {
  entfernePushGeraet,
  speicherePushAbo,
  speicherePushEinstellungen,
} from '../_lib/push-actions';
import type { GeraeteAnzeige } from '../_lib/push-queries';

/** Anlässe, die abgewählt werden können. */
const ABWAEHLBAR: readonly Anlass[] = [
  'faellige_wiederholung',
  'serie_gefaehrdet',
  'tagesziel_offen',
  'wochenpruefung_offen',
  'nachweis_luecke',
  'wochenbericht_bereit',
];

/** Auswahlmöglichkeiten für den Beginn der stillen Zeit. */
const STUNDEN = Array.from({ length: 24 }, (_, i) => i);

export interface PushOptInProps {
  vapidPublicKey: string;
  einstellungen: PushEinstellungen;
  tagesziel: number;
  geraete: GeraeteAnzeige[];
}

export function PushOptIn({
  vapidPublicKey,
  einstellungen: gespeichert,
  tagesziel: gespeichertesZiel,
  geraete: gespeicherteGeraete,
}: PushOptInProps) {
  const t = useTranslations('push.einstellungen');
  const tAnlass = useTranslations('push.anlass');

  const [zustand, setZustand] = React.useState<PushZustand | null>(null);
  const [laedt, setLaedt] = React.useState(false);
  const [meldung, setMeldung] = React.useState<{ art: 'erfolg' | 'fehler'; text: string } | null>(null);
  const [formular, setFormular] = React.useState({ ...gespeichert, tagesziel: gespeichertesZiel });
  const [geraete, setGeraete] = React.useState(gespeicherteGeraete);

  // Zustand erst im Browser lesen: Notification.permission gibt es auf dem
  // Server nicht, und der Wert kann sich in den Browsereinstellungen ändern,
  // ohne dass die Seite davon erfährt.
  React.useEffect(() => {
    void lesePushZustand().then(setZustand);
  }, []);

  // Der Service Worker meldet, wenn der Push-Dienst das Abo ausgetauscht hat.
  // Ohne diese Reaktion verstummt Push nach einigen Wochen stillschweigend.
  React.useEffect(() => {
    if (!('serviceWorker' in navigator)) return undefined;

    const aufErneuerung = async (ereignis: MessageEvent) => {
      if (ereignis.data?.type !== 'PUSH_ABO_ERNEUERN') return;
      const abo = await erneuerePushAbo(vapidPublicKey);
      if (abo) await speicherePushAbo({ ...abo, zeitzone: geraeteZeitzone() });
    };

    navigator.serviceWorker.addEventListener('message', aufErneuerung);
    return () => navigator.serviceWorker.removeEventListener('message', aufErneuerung);
  }, [vapidPublicKey]);

  async function aktivieren() {
    setLaedt(true);
    setMeldung(null);
    try {
      const abo = await meldePushAn(vapidPublicKey);
      if (!abo) {
        setZustand(await lesePushZustand());
        setMeldung({ art: 'fehler', text: t('abgelehnt') });
        return;
      }
      const zeitzone = geraeteZeitzone();
      const ergebnis = await speicherePushAbo({ ...abo, zeitzone });
      if (!ergebnis.ok) {
        setMeldung({ art: 'fehler', text: t('fehlerSpeichern') });
        return;
      }
      setFormular((alt) => ({ ...alt, aktiv: true, zeitzone }));
      setZustand('aktiv');
      setMeldung({ art: 'erfolg', text: t('aktiviert') });
    } finally {
      setLaedt(false);
    }
  }

  async function deaktivieren() {
    setLaedt(true);
    setMeldung(null);
    try {
      await meldePushAb();
      // Der Grundschalter wird ebenfalls gesetzt: das Abo dieses Geräts ist weg,
      // aber ohne den Schalter würde auf anderen Geräten weiter gesendet.
      await speicherePushEinstellungen({ ...formular, aktiv: false });
      setFormular((alt) => ({ ...alt, aktiv: false }));
      setZustand('erlaubt_ohne_abo');
      setMeldung({ art: 'erfolg', text: t('deaktiviert') });
    } finally {
      setLaedt(false);
    }
  }

  async function speichern() {
    setLaedt(true);
    setMeldung(null);
    try {
      const ergebnis = await speicherePushEinstellungen(formular);
      setMeldung(
        ergebnis.ok
          ? { art: 'erfolg', text: t('gespeichert') }
          : { art: 'fehler', text: t('fehlerSpeichern') },
      );
    } finally {
      setLaedt(false);
    }
  }

  async function geraetEntfernen(id: string) {
    const ergebnis = await entfernePushGeraet({ id });
    if (ergebnis.ok) setGeraete((alt) => alt.filter((g) => g.id !== id));
  }

  function anlassUmschalten(anlass: Anlass, abgewaehlt: boolean) {
    setFormular((alt) => ({
      ...alt,
      abgewaehlt: abgewaehlt
        ? [...alt.abgewaehlt, anlass]
        : alt.abgewaehlt.filter((a) => a !== anlass),
    }));
  }

  // Solange der Zustand nicht gelesen ist, wird nichts angezeigt — ein Knopf,
  // der gleich wieder verschwindet, wirkt kaputt.
  if (zustand === null) return null;

  if (zustand === 'nicht_unterstuetzt') {
    return (
      <Card>
        <h2 className="mb-1 font-semibold">{t('titel')}</h2>
        <p className="text-sm text-fg-muted">{t('nichtUnterstuetzt')}</p>
      </Card>
    );
  }

  if (zustand === 'abgelehnt') {
    return (
      <Card>
        <h2 className="mb-1 font-semibold">{t('titel')}</h2>
        <p className="text-sm text-fg-muted">{t('imBrowserGesperrt')}</p>
      </Card>
    );
  }

  const istAktiv = zustand === 'aktiv' && formular.aktiv;

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-semibold">{t('titel')}</h2>
        <p className="mt-1 text-sm text-fg-muted">{t('nutzen')}</p>
      </div>

      {meldung && (
        <Alert variante={meldung.art === 'erfolg' ? 'success' : 'danger'} titel={meldung.text} />
      )}

      {!istAktiv ? (
        <Button onClick={aktivieren} laedt={laedt} volleBreite>
          {t('aktivieren')}
        </Button>
      ) : (
        <>
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold">{t('anlaesse')}</legend>
            <p className="text-sm text-fg-muted">{t('anlaesseHinweis')}</p>
            {ABWAEHLBAR.map((anlass) => (
              <Checkbox
                key={anlass}
                checked={!formular.abgewaehlt.includes(anlass)}
                onChange={(e) => anlassUmschalten(anlass, !e.target.checked)}
                label={tAnlass(anlass)}
              />
            ))}
          </fieldset>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-label">{t('stillVon')}</span>
              <Select
                value={String(formular.stillVon)}
                onChange={(e) => setFormular((a) => ({ ...a, stillVon: Number(e.target.value) }))}
              >
                {STUNDEN.map((s) => (
                  <option key={s} value={s}>{`${String(s).padStart(2, '0')}:00`}</option>
                ))}
              </Select>
            </label>
            <label className="block">
              <span className="mb-1 block text-label">{t('stillBis')}</span>
              <Select
                value={String(formular.stillBis)}
                onChange={(e) => setFormular((a) => ({ ...a, stillBis: Number(e.target.value) }))}
              >
                {STUNDEN.map((s) => (
                  <option key={s} value={s}>{`${String(s).padStart(2, '0')}:00`}</option>
                ))}
              </Select>
            </label>
            <label className="block">
              <span className="mb-1 block text-label">{t('maxProTag')}</span>
              <Select
                value={String(formular.maxProTag)}
                onChange={(e) => setFormular((a) => ({ ...a, maxProTag: Number(e.target.value) }))}
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </Select>
            </label>
            <label className="block">
              <span className="mb-1 block text-label">{t('tagesziel')}</span>
              <Select
                value={String(formular.tagesziel)}
                onChange={(e) => setFormular((a) => ({ ...a, tagesziel: Number(e.target.value) }))}
              >
                {[3, 5, 10, 15, 20, 30, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </Select>
            </label>
          </div>

          <p className="text-sm text-fg-muted">{t('zeitzone', { zone: formular.zeitzone })}</p>

          {geraete.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">{t('geraete')}</h3>
              <ul className="space-y-1">
                {geraete.map((geraet) => (
                  <li key={geraet.id} className="flex items-center justify-between gap-2 text-sm">
                    <span>{geraet.geraet}</span>
                    <Button
                      variante="link"
                      groesse="sm"
                      onClick={() => void geraetEntfernen(geraet.id)}
                    >
                      {t('geraetEntfernen')}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button onClick={speichern} laedt={laedt}>
              {t('speichern')}
            </Button>
            <Button variante="sekundaer" onClick={deaktivieren} laedt={laedt}>
              {t('deaktivieren')}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
