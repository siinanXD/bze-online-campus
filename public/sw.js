/*
 * BZE Online Campus — Service Worker (AP-15)
 *
 * Handgeschriebener Service Worker ohne Serwist/Workbox (siehe docs/adr/0003-pwa-serwist.md).
 * Wird unter /sw.js ausgeliefert und aus service-worker/offline-client.ts registriert.
 *
 * Strategie:
 *  - App-Shell + statische Assets: Cache-First / Stale-While-Revalidate
 *  - Navigationen (HTML): Network-First mit Cache- und Offline-Fallback
 *  - Vorgeladene Inhalte (Prüfungswoche, Fragen einmal_richtig/falsch, Fachkunde
 *    des aktuellen Themas): per postMessage PRECACHE_URLS im Content-Cache
 *  - Antworten offline: Client legt sie in IndexedDB ab, Background Sync
 *    (Tag "bze-sync-antworten") überträgt sie, sobald wieder Verbindung besteht
 *  - Update: neuer Worker wartet; Client fordert per SKIP_WAITING das Update an
 */

const VERSION = 'v1';
const SHELL_CACHE = 'bze-shell-' + VERSION;
const STATIC_CACHE = 'bze-static-' + VERSION;
const PAGES_CACHE = 'bze-pages-' + VERSION;
const CONTENT_CACHE = 'bze-content-' + VERSION;

const KNOWN_CACHES = [SHELL_CACHE, STATIC_CACHE, PAGES_CACHE, CONTENT_CACHE];

const OFFLINE_URL = '/offline.html';

// Minimaler App-Shell, der beim Installieren fest vorgeladen wird.
const SHELL_ASSETS = [
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/icons/icon.svg',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/icons/maskable.svg',
];

// IndexedDB-Outbox (muss mit service-worker/offline-db.ts übereinstimmen).
const DB_NAME = 'bze-offline';
const DB_VERSION = 1;
const OUTBOX_STORE = 'outbox';
const SYNC_TAG = 'bze-sync-antworten';

function openDb() {
  return new Promise(function (resolve, reject) {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = function () {
      const db = req.result;
      if (!db.objectStoreNames.contains(OUTBOX_STORE)) {
        db.createObjectStore(OUTBOX_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = function () { resolve(req.result); };
    req.onerror = function () { reject(req.error); };
  });
}

function outboxGetAll() {
  return openDb().then(function (db) {
    return new Promise(function (resolve, reject) {
      const tx = db.transaction(OUTBOX_STORE, 'readonly');
      const req = tx.objectStore(OUTBOX_STORE).getAll();
      req.onsuccess = function () { resolve(req.result || []); };
      req.onerror = function () { reject(req.error); };
    });
  });
}

function outboxDelete(id) {
  return openDb().then(function (db) {
    return new Promise(function (resolve, reject) {
      const tx = db.transaction(OUTBOX_STORE, 'readwrite');
      tx.objectStore(OUTBOX_STORE).delete(id);
      tx.oncomplete = function () { resolve(); };
      tx.onerror = function () { reject(tx.error); };
    });
  });
}

async function outboxCount() {
  const all = await outboxGetAll();
  return all.length;
}

async function notifyClients(message) {
  const clientList = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  for (const client of clientList) {
    client.postMessage(message);
  }
}

// Überträgt alle gespeicherten Antworten. Bei Fehlern bleibt der Eintrag erhalten.
async function replayOutbox() {
  const entries = await outboxGetAll();
  let uebertragen = 0;
  for (const entry of entries) {
    try {
      const res = await fetch(entry.url, {
        method: entry.method || 'POST',
        headers: entry.headers || { 'Content-Type': 'application/json' },
        body: entry.body,
        credentials: 'include',
      });
      if (res && res.ok) {
        await outboxDelete(entry.id);
        uebertragen += 1;
      }
    } catch (err) {
      // Netz weiterhin instabil — Eintrag bleibt für den nächsten Sync.
      break;
    }
  }
  const verbleibend = await outboxCount();
  await notifyClients({ type: 'SYNC_STATUS', uebertragen: uebertragen, verbleibend: verbleibend });
  return verbleibend;
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(function (cache) {
      return cache.addAll(SHELL_ASSETS);
    }),
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    (async function () {
      const keys = await caches.keys();
      await Promise.all(
        keys.map(function (key) {
          if (key.indexOf('bze-') === 0 && KNOWN_CACHES.indexOf(key) === -1) {
            return caches.delete(key);
          }
          return undefined;
        }),
      );
      await self.clients.claim();
    })(),
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    /\.(?:css|js|woff2?|ttf|otf|png|jpg|jpeg|gif|svg|webp|ico)$/.test(url.pathname)
  );
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then(function (res) {
      if (res && res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(function () { return undefined; });
  return cached || network || fetch(request);
}

async function networkFirstNavigation(request) {
  const cache = await caches.open(PAGES_CACHE);
  try {
    const res = await fetch(request);
    if (res && res.ok) cache.put(request, res.clone());
    return res;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    const shell = await caches.open(SHELL_CACHE);
    const offline = await shell.match(OFFLINE_URL);
    return offline || new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

self.addEventListener('fetch', function (event) {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Fremde Ursprünge (z. B. Supabase-API/Auth) nicht abfangen — nie zwischenspeichern.
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
  }
});

self.addEventListener('sync', function (event) {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(replayOutbox());
  }
});

self.addEventListener('message', function (event) {
  const data = event.data || {};
  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }
  if (data.type === 'GET_VERSION') {
    if (event.source) event.source.postMessage({ type: 'VERSION', version: VERSION });
    return;
  }
  if (data.type === 'REPLAY_OUTBOX') {
    event.waitUntil(replayOutbox());
    return;
  }
  if (data.type === 'PRECACHE_URLS' && Array.isArray(data.urls)) {
    event.waitUntil(
      caches.open(CONTENT_CACHE).then(async function (cache) {
        for (const u of data.urls) {
          try {
            const res = await fetch(u, { credentials: 'include' });
            if (res && res.ok) await cache.put(u, res.clone());
          } catch (err) {
            // Einzelne Vorlade-Fehler ignorieren.
          }
        }
        await notifyClients({ type: 'PRECACHE_DONE', anzahl: data.urls.length });
      }),
    );
  }
});
