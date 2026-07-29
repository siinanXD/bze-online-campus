# 0003 — PWA: handgeschriebener Service Worker statt Serwist

**Kontext:** AP-15 verlangt eine installierbare PWA mit App-Shell-Precache, Vorladen der aktuellen Prüfungswoche und fälliger Fragen, Offline-Antworten in IndexedDB, Background Sync sowie einen sichtbaren Offline-Indikator und Update-Hinweis (Spec §9). Stack-Vorgabe war Serwist (ADR 0001). Zielgeräte sind ältere Android-Telefone in Werkhallen mit instabilem Netz — Robustheit und geringe Komplexität wiegen schwer.

**Entscheidung:** Wir liefern einen handgeschriebenen Service Worker (`public/sw.js`) ohne Serwist/Workbox aus. Die Offline-Schicht (IndexedDB-Outbox, Registrierung, Sync, Vorladen) liegt in `service-worker/` und wird über eine Client-Komponente (`ServiceWorkerManager`) im Root-Layout eingebunden.

Gründe gegen Serwist in diesem Paket:

- `@serwist/next` verlangt einen Build-Injection-Schritt (`swSrc`/`injectionPoint`) und einen eigenen Worker-Typkontext (`webworker`-Lib), der mit dem projektweiten `dom`-Typkontext (strikter `tsc --noEmit`) kollidiert.
- Der `withSerwist`-Wrapper müsste mit dem bestehenden `withNextIntl`-Wrapper in `next.config.mjs` verschachtelt werden — zusätzliche Kopplung an einem von Welle 0 verwalteten Wurzelartefakt.
- Der Funktionsumfang (Precache, Runtime-Caches, Background Sync) ist mit den nativen Service-Worker-APIs direkt und nachvollziehbar umsetzbar.

**Konsequenzen:**

- Kein zusätzlicher Build-Schritt; `public/sw.js` wird unverändert unter `/sw.js` ausgeliefert und ist unabhängig vom Bundler.
- Cache-Namen und das IndexedDB-Schema (`bze-offline`, Store `outbox`, Sync-Tag `bze-sync-antworten`) sind zwischen `public/sw.js` und `service-worker/offline-db.ts` von Hand konsistent zu halten. Änderungen an einem Ort erfordern den Abgleich am anderen.
- Cache-Invalidierung erfolgt über die `VERSION`-Konstante in `public/sw.js`; ein neuer Worker wartet, bis der Nutzer über den Update-Hinweis „Jetzt aktualisieren" bestätigt (`SKIP_WAITING`).
- Wird später doch Serwist gewünscht, bleibt die Client-Offline-Schicht (`service-worker/`) weitgehend wiederverwendbar; nur `public/sw.js` würde durch einen generierten Worker ersetzt.

**Alternativen:**

- **Serwist (`@serwist/next`)** — verworfen für dieses Paket wegen Build-/Typkomplexität; bleibt als Option dokumentiert.
- **`next-pwa`** — verworfen: für App Router in Next 15 nicht mehr aktiv gepflegt.
- **Gar kein SW (nur Manifest)** — verworfen: Offline-Betrieb und Background Sync sind laut Spec §9 verbindlich.
