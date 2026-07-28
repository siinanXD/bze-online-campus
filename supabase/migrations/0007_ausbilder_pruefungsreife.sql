-- =====================================================================
-- BZE Online Campus — Migration 0006 (AP-11): Ausbilder bestätigt Prüfungsreife
-- Additiv. Spec §4.2 / §6.3 — Empfehlung bestätigen (keine Zulassung).
-- Bisher: pruefungsreife_betreuer nur SELECT. Update der Bestätigungsfelder
-- für zugewiesene Teilnehmer freigeben.
-- =====================================================================

create policy pruefungsreife_betreuer_update on pruefungsreife
  for update
  using (
    app_is_admin()
    or app_rolle() = 'verwaltung'
    or (app_rolle() = 'ausbilder' and app_betreut(user_id))
  )
  with check (
    app_is_admin()
    or app_rolle() = 'verwaltung'
    or (app_rolle() = 'ausbilder' and app_betreut(user_id))
  );
