/**
 * Client-Helfer der Offline-Schicht (AP-15, Spec §9).
 *
 * Registrierung des Service Workers, Background-Sync-Anforderung, Ablage von
 * Antworten in der IndexedDB-Outbox sowie Vorladen der relevanten Inhalte
 * (aktuelle Prüfungswoche, Fragen mit Status einmal_richtig/falsch, Fachkunde
 * des aktuellen Themas). Nur im Browser verwenden.
 */

import {
  enqueueOutbox,
  countOutbox,
  SYNC_TAG,
  type OutboxEntry,
} from './offline-db';

export const SW_URL = '/sw.js';

/** SyncManager ist in den Standard-DOM-Typen (noch) nicht enthalten. */
interface SyncManagerLike {
  register(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}
type RegistrationMitSync = ServiceWorkerRegistration & { sync?: SyncManagerLike };

export function serviceWorkerVerfuegbar(): boolean {
  return typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
}

/** Registriert den Service Worker unter /sw.js. */
export async function registriereServiceWorker(): Promise<ServiceWorkerRegistration | undefined> {
  if (!serviceWorkerVerfuegbar()) return undefined;
  try {
    return await navigator.serviceWorker.register(SW_URL, { scope: '/' });
  } catch {
    return undefined;
  }
}

/** Fordert den wartenden Worker auf, sofort zu übernehmen (Update anwenden). */
export function wendeUpdateAn(worker: ServiceWorker | null | undefined): void {
  worker?.postMessage({ type: 'SKIP_WAITING' });
}

/** Registriert einen Background-Sync; liefert false, wenn nicht unterstützt. */
export async function fordereSync(): Promise<boolean> {
  if (!serviceWorkerVerfuegbar()) return false;
  try {
    const reg = (await navigator.serviceWorker.ready) as RegistrationMitSync;
    if (reg.sync) {
      await reg.sync.register(SYNC_TAG);
      return true;
    }
  } catch {
    // Kein Background Sync — Fallback über das online-Ereignis.
  }
  return false;
}

/** Bittet den aktiven Service Worker, die Outbox jetzt zu übertragen. */
export async function loeseUebertragungAus(): Promise<void> {
  if (!serviceWorkerVerfuegbar()) return;
  const reg = await navigator.serviceWorker.ready;
  reg.active?.postMessage({ type: 'REPLAY_OUTBOX' });
}

/**
 * Speichert eine schreibende Aktion offline und stößt die Übertragung an.
 * Ist Netz vorhanden, übernimmt der Background Sync die Zustellung; sonst wartet
 * der Eintrag in der Outbox bis zur nächsten Verbindung.
 */
export async function speichereOffline(
  eintrag: Omit<OutboxEntry, 'id' | 'erstelltAm'>,
): Promise<void> {
  await enqueueOutbox(eintrag);
  const registriert = await fordereSync();
  if (!registriert && navigator.onLine) {
    await loeseUebertragungAus();
  }
}

/** Anzahl der noch nicht übertragenen Eingaben (für den Sync-Hinweis). */
export async function anzahlAusstehend(): Promise<number> {
  return countOutbox();
}

/**
 * Lässt den Service Worker die angegebenen Inhalts-URLs vorladen
 * (Prüfungswoche, fällige Fragen, Fachkunde des aktuellen Themas).
 */
export async function ladeInhalteVor(urls: string[]): Promise<void> {
  if (!serviceWorkerVerfuegbar() || urls.length === 0) return;
  const reg = await navigator.serviceWorker.ready;
  reg.active?.postMessage({ type: 'PRECACHE_URLS', urls });
}
