'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@bze/ui';
import { setzeAktivStatusAction, setzePasswortZurueckAction } from '../actions';
import { fehlerSchluessel } from '../../_lib/fehler';
import type { Zugangsdaten } from '../../_lib/types';

export function Aktionen({ nutzerId, aktiv }: { nutzerId: string; aktiv: boolean }) {
  const t = useTranslations('admin');
  const tc = useTranslations('common');
  const router = useRouter();
  const [istPending, startTransition] = useTransition();
  const [fehler, setFehler] = useState<string | null>(null);
  const [neueZugangsdaten, setNeueZugangsdaten] = useState<Zugangsdaten | null>(null);
  const [bestaetigungOffen, setBestaetigungOffen] = useState(false);

  function statusUmschalten() {
    setFehler(null);
    startTransition(async () => {
      const antwort = await setzeAktivStatusAction(nutzerId, !aktiv);
      if (!antwort.ok) {
        setFehler(antwort.fehler);
        return;
      }
      router.refresh();
    });
  }

  function passwortZuruecksetzen() {
    setFehler(null);
    setBestaetigungOffen(false);
    startTransition(async () => {
      const antwort = await setzePasswortZurueckAction(nutzerId);
      if (!antwort.ok) {
        setFehler(antwort.fehler);
        return;
      }
      setNeueZugangsdaten(antwort.daten);
    });
  }

  if (neueZugangsdaten) {
    return (
      <div className="rounded-xl border-2 border-accent bg-surface p-4">
        <p className="text-sm font-bold text-accent">{t('nutzer.zugangsdatenTitel')}</p>
        <p className="mt-1 text-sm text-muted">{t('nutzer.zugangsdatenHinweis')}</p>
        <dl className="mt-3 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-[15px]">
          <dt className="text-muted">{t('nutzer.spalte.benutzername')}</dt>
          <dd className="font-mono font-semibold">{neueZugangsdaten.benutzername}</dd>
          <dt className="text-muted">{t('nutzer.initialpasswort')}</dt>
          <dd className="font-mono text-lg font-bold tracking-wide">{neueZugangsdaten.initialPasswort}</dd>
        </dl>
        <Button variant="soft" className="mt-3" onClick={() => setNeueZugangsdaten(null)}>
          {tc('weiter')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {bestaetigungOffen ? (
          <>
            <span className="self-center text-sm text-muted">{t('nutzer.passwortBestaetigung')}</span>
            <Button variant="primary" disabled={istPending} onClick={passwortZuruecksetzen}>
              {t('nutzer.bestaetigen')}
            </Button>
            <Button variant="ghost" disabled={istPending} onClick={() => setBestaetigungOffen(false)}>
              {t('common.abbrechen')}
            </Button>
          </>
        ) : (
          <Button variant="soft" disabled={istPending} onClick={() => setBestaetigungOffen(true)}>
            {t('nutzer.passwortZuruecksetzen')}
          </Button>
        )}
        <Button variant={aktiv ? 'ghost' : 'primary'} disabled={istPending} onClick={statusUmschalten}>
          {aktiv ? t('nutzer.deaktivieren') : t('nutzer.aktivieren')}
        </Button>
      </div>
      {fehler && (
        <p role="alert" className="text-sm text-status-falsch">
          {t(`fehler.${fehlerSchluessel(fehler)}`)}
        </p>
      )}
    </div>
  );
}
