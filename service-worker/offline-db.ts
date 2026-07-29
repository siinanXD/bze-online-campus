/**
 * IndexedDB-Outbox für die Offline-Schicht (AP-15, Spec §9).
 *
 * Antworten und andere schreibende Aktionen werden bei fehlender Verbindung
 * hier zwischengespeichert und vom Service Worker (public/sw.js) per Background
 * Sync übertragen, sobald wieder Netz besteht. Schema und Namen müssen mit
 * public/sw.js übereinstimmen.
 *
 * Nur im Browser verwenden ('use client'-Komponenten).
 */

export const DB_NAME = 'bze-offline';
export const DB_VERSION = 1;
export const OUTBOX_STORE = 'outbox';
export const SYNC_TAG = 'bze-sync-antworten';

/** Eine im Outbox gespeicherte, noch nicht übertragene Anfrage. */
export interface OutboxEntry {
  id?: number;
  /** Ziel-URL der schreibenden Anfrage. */
  url: string;
  /** HTTP-Methode, Standard POST. */
  method: string;
  /** Zu sendende Header. */
  headers: Record<string, string>;
  /** Serialisierter Body (in der Regel JSON). */
  body: string;
  /** Fachlicher Typ, z. B. "antwort" — nur zur Diagnose. */
  art?: string;
  /** Zeitpunkt der Ablage (ms seit Epoch). */
  erstelltAm: number;
}

function hatIndexedDb(): boolean {
  return typeof indexedDB !== 'undefined';
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(OUTBOX_STORE)) {
        db.createObjectStore(OUTBOX_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Legt eine Anfrage in der Outbox ab und liefert die vergebene ID. */
export async function enqueueOutbox(
  eintrag: Omit<OutboxEntry, 'id' | 'erstelltAm'> & { erstelltAm?: number },
): Promise<number | undefined> {
  if (!hatIndexedDb()) return undefined;
  const db = await openDb();
  const vollstaendig: OutboxEntry = {
    ...eintrag,
    method: eintrag.method ?? 'POST',
    erstelltAm: eintrag.erstelltAm ?? Date.now(),
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OUTBOX_STORE, 'readwrite');
    const req = tx.objectStore(OUTBOX_STORE).add(vollstaendig);
    req.onsuccess = () => resolve(req.result as number);
    req.onerror = () => reject(req.error);
  });
}

/** Liest alle noch offenen Outbox-Einträge. */
export async function getAllOutbox(): Promise<OutboxEntry[]> {
  if (!hatIndexedDb()) return [];
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OUTBOX_STORE, 'readonly');
    const req = tx.objectStore(OUTBOX_STORE).getAll();
    req.onsuccess = () => resolve((req.result as OutboxEntry[]) ?? []);
    req.onerror = () => reject(req.error);
  });
}

/** Entfernt einen übertragenen Eintrag. */
export async function deleteOutbox(id: number): Promise<void> {
  if (!hatIndexedDb()) return;
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OUTBOX_STORE, 'readwrite');
    tx.objectStore(OUTBOX_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Anzahl der noch nicht übertragenen Einträge. */
export async function countOutbox(): Promise<number> {
  const alle = await getAllOutbox();
  return alle.length;
}
