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
 *  - Web Push: der Versender schickt fertig übersetzten Titel und Text; dieser
 *    Worker zeigt sie nur an und führt beim Antippen zum richtigen Ort
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

// =====================================================================
// Web Push (AP-17)
//
// Der Worker übersetzt bewusst nicht und entscheidet nichts. Titel und Text
// kommen fertig aus der Edge Function `sende-erinnerungen`, die die Sprache der
// Person kennt. Ein Worker müsste sonst alle sechs Sprachdateien vorhalten und
// bei jeder Textänderung neu ausgeliefert werden.
// =====================================================================

// Anzeige, wenn die Nutzlast fehlt oder unlesbar ist. Ohne diesen Rückfall
// zeigen Chrome und Firefox von sich aus „Diese Website wurde im Hintergrund
// aktualisiert" — eine Meldung, die niemandem hilft.
const PUSH_RUECKFALL = {
  titel: 'BZE Online Campus',
  text: 'Es gibt etwas Neues für dich.',
  pfad: '/',
  tag: 'bze-allgemein',
};

function lesePushNutzlast(event) {
  if (!event.data) return PUSH_RUECKFALL;
  try {
    const daten = event.data.json();
    return {
      titel: daten.titel || PUSH_RUECKFALL.titel,
      text: daten.text || PUSH_RUECKFALL.text,
      pfad: daten.pfad || PUSH_RUECKFALL.pfad,
      tag: daten.tag || PUSH_RUECKFALL.tag,
      // Rechtsläufige Sprachen (Arabisch) brauchen die Richtungsangabe, sonst
      // stellt das Betriebssystem den Text falsch dar.
      richtung: daten.richtung === 'rtl' ? 'rtl' : 'ltr',
      sprache: daten.sprache || 'de',
    };
  } catch (err) {
    return PUSH_RUECKFALL;
  }
}

self.addEventListener('push', function (event) {
  const inhalt = lesePushNutzlast(event);
  event.waitUntil(
    self.registration.showNotification(inhalt.titel, {
      body: inhalt.text,
      icon: '/icons/icon-192.svg',
      badge: '/icons/icon-192.svg',
      lang: inhalt.sprache,
      dir: inhalt.richtung,
      // Gleiches Tag ersetzt die vorherige Meldung statt zu stapeln — niemand
      // soll fünf Serien-Hinweise nebeneinander vorfinden.
      tag: inhalt.tag,
      renotify: false,
      // Lernerinnerungen dürfen nicht vibrieren oder klingeln; sie sind
      // Angebote, keine Alarme.
      silent: false,
      requireInteraction: false,
      data: { pfad: inhalt.pfad },
    }),
  );
});

/**
 * Öffnet beim Antippen ein bereits offenes Fenster, statt ein zweites zu
 * starten. Ein zweiter Tab derselben App verwirrt und verliert den Lernstand
 * des ersten.
 */
async function oeffneZiel(pfad) {
  const ziel = new URL(pfad || '/', self.location.origin);
  const fenster = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });

  for (const fenstereintrag of fenster) {
    const offen = new URL(fenstereintrag.url);
    if (offen.origin !== ziel.origin) continue;
    if ('focus' in fenstereintrag) {
      await fenstereintrag.focus();
      if ('navigate' in fenstereintrag && offen.pathname !== ziel.pathname) {
        try {
          await fenstereintrag.navigate(ziel.href);
        } catch (err) {
          // navigate ist nicht überall erlaubt — der Fokus allein genügt dann.
        }
      }
      return;
    }
  }

  if (self.clients.openWindow) await self.clients.openWindow(ziel.href);
}

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const pfad = (event.notification.data && event.notification.data.pfad) || '/';
  event.waitUntil(oeffneZiel(pfad));
});

/**
 * Der Push-Dienst hat das Abo erneuert (Schlüsselwechsel, Ablauf).
 *
 * Ohne diesen Handler verstummt Push nach Wochen stillschweigend: der alte
 * Endpunkt antwortet mit 410, der neue ist dem Server nie mitgeteilt worden.
 * Die Clients werden benachrichtigt, damit sie das Abo neu anmelden, sobald die
 * App das nächste Mal geöffnet wird.
 */
self.addEventListener('pushsubscriptionchange', function (event) {
  event.waitUntil(notifyClients({ type: 'PUSH_ABO_ERNEUERN' }));
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
