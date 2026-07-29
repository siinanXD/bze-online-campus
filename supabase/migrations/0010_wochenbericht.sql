-- AP-13 — Wochenbericht und Merkkarten (Spec §5 erzeuge_wochenbericht, §6.1 Start)
--
-- Die Tabelle `wochenberichte` (user_id, jahr, kalenderwoche, inhalt jsonb,
-- merksaetze jsonb, gelesen bool) und ihre RLS-Policy `wochenberichte_own`
-- (user_id = auth.uid()) stammen aus 0001_datenmodell.sql. Diese Migration
-- ergänzt additiv:
--   1. Index für den schnellen Zugriff auf den neuesten Bericht je Nutzer
--   2. RPC `wochenbericht_gelesen(uuid)` zum Markieren als gelesen (RLS-sicher)
--   3. View `v_wochenbericht_neueste` — neuester Bericht je Nutzer (security_invoker)
--   4. Hinweis zum pg_cron-Zeitplan (sonntags 20:00) am Ende der Datei

-- ---------------------------------------------------------------------
-- 1. Index: neuester Bericht je Nutzer (jahr, kalenderwoche absteigend)
-- ---------------------------------------------------------------------
create index if not exists wochenberichte_user_zeit_idx
  on wochenberichte (user_id, jahr desc, kalenderwoche desc);

-- Häufige Startbildschirm-Abfrage: ungelesene Berichte je Nutzer
create index if not exists wochenberichte_user_ungelesen_idx
  on wochenberichte (user_id)
  where gelesen = false;

-- ---------------------------------------------------------------------
-- 2. Bericht als gelesen markieren
--    Läuft mit Aufruferrechten (security invoker) — die bestehende
--    Policy `wochenberichte_own` stellt sicher, dass nur der Eigentümer
--    seinen eigenen Bericht ändern kann. Kein service_role nötig.
-- ---------------------------------------------------------------------
create or replace function wochenbericht_gelesen(p_bericht_id uuid)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_treffer int;
begin
  update wochenberichte
     set gelesen = true
   where id = p_bericht_id
     and user_id = auth.uid();
  get diagnostics v_treffer = row_count;
  return v_treffer > 0;
end $$;

revoke all on function wochenbericht_gelesen(uuid) from public;
grant execute on function wochenbericht_gelesen(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- 3. Helfer-View: neuester Bericht je Nutzer
--    security_invoker => RLS von `wochenberichte` greift für den Aufrufer,
--    Teilnehmer sehen also nur ihren eigenen Bericht.
-- ---------------------------------------------------------------------
create or replace view v_wochenbericht_neueste
with (security_invoker = true) as
select distinct on (w.user_id)
       w.id,
       w.user_id,
       w.jahr,
       w.kalenderwoche,
       w.inhalt,
       w.merksaetze,
       w.gelesen,
       w.created_at
from wochenberichte w
order by w.user_id, w.jahr desc, w.kalenderwoche desc, w.created_at desc;

grant select on v_wochenbericht_neueste to authenticated;

-- ---------------------------------------------------------------------
-- 4. Zeitplan (pg_cron) — Spec §5: Cron sonntags 20:00, pro aktivem
--    Teilnehmer. Der eigentliche Aufruf erfolgt über die Edge Function
--    `erzeuge-wochenbericht` (LLM-Aufruf darf nur dort passieren).
--
--    In vielen lokalen Supabase-Instanzen sind pg_cron/pg_net nicht
--    aktiv; daher steht der Zeitplan bewusst auskommentiert. In der
--    Zielumgebung (Supabase eu-central-1) aktivieren und die Function
--    per HTTP mit dem CRON_SECRET-Header aufrufen. Siehe Function-README.
--
--    Beispiel (in der Zielumgebung ausführen):
--
--    -- create extension if not exists pg_cron;
--    -- create extension if not exists pg_net;
--    --
--    -- select cron.schedule(
--    --   'erzeuge-wochenbericht-sonntag',
--    --   '0 20 * * 0',                          -- So 20:00 UTC
--    --   $cron$
--    --     select net.http_post(
--    --       url     := current_setting('app.settings.functions_url') || '/erzeuge-wochenbericht',
--    --       headers := jsonb_build_object(
--    --         'Content-Type', 'application/json',
--    --         'x-cron-secret', current_setting('app.settings.cron_secret')
--    --       ),
--    --       body    := jsonb_build_object('alle', true)
--    --     );
--    --   $cron$
--    -- );
-- ---------------------------------------------------------------------
