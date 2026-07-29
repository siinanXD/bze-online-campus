'use client';

import * as React from 'react';
import {
  registriereServiceWorker,
  serviceWorkerVerfuegbar,
  wendeUpdateAn,
  fordereSync,
  loeseUebertragungAus,
  anzahlAusstehend,
} from './offline-client';
import { OfflineIndicator, UpdatePrompt } from './offline-indicator';

/*
 * Orchestriert die PWA-Laufzeit im Client (AP-15, Spec §9):
 *  - registriert den Service Worker (/sw.js)
 *  - erkennt Online/Offline und zeigt den Offline-Indikator
 *  - erkennt eine neue Worker-Version und bietet das Update an
 *  - stößt bei Rückkehr der Verbindung die Übertragung offener Antworten an
 *
 * Wird im Root-Layout innerhalb des NextIntlClientProvider eingebunden.
 */
export function ServiceWorkerManager() {
  const [offline, setOffline] = React.useState(false);
  const [ausstehend, setAusstehend] = React.useState(0);
  const [wartenderWorker, setWartenderWorker] = React.useState<ServiceWorker | null>(null);
  const reloadRef = React.useRef(false);

  const aktualisiereAusstehend = React.useCallback(() => {
    anzahlAusstehend()
      .then(setAusstehend)
      .catch(() => undefined);
  }, []);

  React.useEffect(() => {
    setOffline(typeof navigator !== 'undefined' && !navigator.onLine);
    aktualisiereAusstehend();

    function handleOnline() {
      setOffline(false);
      fordereSync().then((registriert) => {
        if (!registriert) loeseUebertragungAus();
      });
      aktualisiereAusstehend();
    }
    function handleOffline() {
      setOffline(true);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!serviceWorkerVerfuegbar()) {
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    function handleMessage(event: MessageEvent) {
      const data = (event.data ?? {}) as { type?: string; verbleibend?: number };
      if (data.type === 'SYNC_STATUS') {
        if (typeof data.verbleibend === 'number') setAusstehend(data.verbleibend);
      }
    }

    function handleControllerChange() {
      if (reloadRef.current) return;
      reloadRef.current = true;
      window.location.reload();
    }

    navigator.serviceWorker.addEventListener('message', handleMessage);
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    registriereServiceWorker().then((reg) => {
      if (!reg) return;
      if (reg.waiting) setWartenderWorker(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const neu = reg.installing;
        if (!neu) return;
        neu.addEventListener('statechange', () => {
          if (neu.state === 'installed' && navigator.serviceWorker.controller) {
            setWartenderWorker(neu);
          }
        });
      });
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      navigator.serviceWorker.removeEventListener('message', handleMessage);
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, [aktualisiereAusstehend]);

  function aktualisieren() {
    wendeUpdateAn(wartenderWorker);
    setWartenderWorker(null);
  }

  return (
    <>
      <OfflineIndicator offline={offline} ausstehend={ausstehend} />
      <UpdatePrompt
        sichtbar={wartenderWorker !== null}
        onAktualisieren={aktualisieren}
        onSpaeter={() => setWartenderWorker(null)}
      />
    </>
  );
}
