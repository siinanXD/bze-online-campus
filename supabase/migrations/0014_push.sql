-- =====================================================================
-- BZE Online Campus — Migration 0014 (AP-17): Web Push und Lernserie
-- Additiv. Spec §4.1/§4.2 — Fälligkeiten sichtbar machen, Fokus halten.
--
-- ARCHITEKTUR
-- Diese Migration liefert ausschließlich Speicher und Zugriffsschutz. Die
-- Entscheidung, *ob* und *was* gesendet wird, liegt vollständig in
-- packages/core/benachrichtigung und ist dort ohne Datenbank getestet. Die
-- Datenbank kennt keine stillen Zeiten und keine Rangfolge — sonst läge die
-- Fachlogik an zwei Stellen und würde auseinanderlaufen.
--
-- DATENSCHUTZ
-- Ein Push-Endpunkt ist ein personenbezogenes Datum: er identifiziert Browser
-- und Gerät dauerhaft. Deshalb
--   - kein Zugriff für Ausbilder oder Verwaltung, nur die Person selbst
--     (abweichend vom Muster der übrigen Lerndaten, wo Betreuer lesen dürfen),
--   - Löschung mit dem Konto über on delete cascade,
--   - das Protokoll speichert nur Anlass und Zeitpunkt, nie den Text.
-- Der Versand selbst läuft über die Edge Function `sende-erinnerungen`, die als
-- service_role arbeitet und damit an der RLS vorbeigeht — das ist der einzige
-- vorgesehene Weg an fremde Endpunkte.
--
-- SERIE
-- `lern_aktivitaet` speichert einen Kalendertag je Person und Tag, nicht einen
-- Zeitstempel je Antwort. Die Serie ist damit eine Zählung über Tage und bleibt
-- über Sommerzeitwechsel hinweg richtig. Der Tag wird in der Zeitzone der Person
-- gebildet, nicht in UTC.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Anlässe als Aufzählungstyp
--    Muss mit `Anlass` in packages/core/benachrichtigung/types.ts
--    übereinstimmen. Neue Anlässe werden additiv per `alter type` ergänzt.
-- ---------------------------------------------------------------------
create type push_anlass_t as enum (
  'faellige_wiederholung',
  'serie_gefaehrdet',
  'tagesziel_offen',
  'wochenpruefung_offen',
  'nachweis_luecke',
  'nachweis_entschieden',
  'wochenbericht_bereit'
);

-- ---------------------------------------------------------------------
-- 2. Abos — ein Eintrag je Gerät und Browser
-- ---------------------------------------------------------------------
create table push_abos (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles (id) on delete cascade,
  -- Der Endpunkt ist die eindeutige Adresse des Geräts beim Push-Dienst.
  endpoint      text not null,
  -- Schlüssel des Browsers für die Verschlüsselung der Nutzlast (RFC 8291).
  p256dh        text not null,
  auth_secret   text not null,
  -- Zur Anzeige in den Einstellungen („Chrome auf Android"), rein informativ.
  geraet        text,
  zuletzt_gesendet_am timestamptz,
  fehlversuche  smallint not null default 0 check (fehlversuche >= 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  -- Derselbe Endpunkt darf nur einmal existieren: der Browser liefert bei
  -- erneutem Abonnieren denselben Wert, und doppelte Einträge würden zu
  -- doppelten Benachrichtigungen auf einem Gerät führen.
  unique (endpoint)
);

comment on table push_abos is
  'Web-Push-Endpunkte je Gerät. Personenbezogen — nur die Person selbst hat Zugriff.';

create index push_abos_user_idx on push_abos (user_id);

-- ---------------------------------------------------------------------
-- 3. Einstellungen — ein Eintrag je Person
-- ---------------------------------------------------------------------
create table push_einstellungen (
  user_id     uuid primary key references profiles (id) on delete cascade,
  -- Grundschalter. Standard false: Push kommt erst nach ausdrücklicher
  -- Zustimmung, nie durch Voreinstellung.
  aktiv       boolean not null default false,
  zeitzone    text not null default 'Europe/Berlin',
  -- Stille Zeit als Stunden. Halboffen gelesen: [still_von, still_bis).
  still_von   smallint not null default 21 check (still_von between 0 and 23),
  still_bis   smallint not null default 7  check (still_bis between 0 and 23),
  -- Tagesdeckel über alle Anlässe. Obergrenze 5 entspricht
  -- ABSOLUTES_MAX_PRO_TAG in packages/core/benachrichtigung/deckel.ts.
  max_pro_tag smallint not null default 2 check (max_pro_tag between 0 and 5),
  -- Abgewählte Anlässe; alles nicht Genannte ist erlaubt.
  abgewaehlt  push_anlass_t[] not null default '{}',
  tagesziel   smallint not null default 10 check (tagesziel between 3 and 100),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table push_einstellungen is
  'Push-Einstellungen und Tagesziel je Person. Standard: aktiv=false (Opt-in).';

-- ---------------------------------------------------------------------
-- 4. Protokoll — Grundlage für Tagesdeckel und Mindestpause
--    Speichert bewusst keinen Text: für Deckel und Pause genügen Anlass und
--    Zeitpunkt, und was jemand gelesen hat, muss nicht nachvollziehbar sein.
-- ---------------------------------------------------------------------
create table push_protokoll (
  id          bigserial primary key,
  user_id     uuid not null references profiles (id) on delete cascade,
  anlass      push_anlass_t not null,
  gesendet_am timestamptz not null default now(),
  -- Kalendertag in der Zeitzone der Person, für den Tagesdeckel. Als Text,
  -- weil ein `date` in UTC gebildet würde und die Grenze damit falsch läge.
  tag         text not null check (tag ~ '^\d{4}-\d{2}-\d{2}$')
);

comment on table push_protokoll is
  'Versandprotokoll für Frequenzdeckel. Ohne Nachrichtentext.';

-- Deckt beide Abfragen des Versenders ab: „heute schon gesendet?" und
-- „wann zuletzt dieser Anlass?".
create index push_protokoll_user_tag_idx on push_protokoll (user_id, tag);
create index push_protokoll_user_anlass_idx
  on push_protokoll (user_id, anlass, gesendet_am desc);

-- ---------------------------------------------------------------------
-- 5. Lernaktivität — ein Eintrag je Person und Kalendertag
-- ---------------------------------------------------------------------
create table lern_aktivitaet (
  user_id  uuid not null references profiles (id) on delete cascade,
  -- Kalendertag in der Zeitzone der Person. Als Text, gleiche Begründung
  -- wie bei push_protokoll.tag.
  tag      text not null check (tag ~ '^\d{4}-\d{2}-\d{2}$'),
  -- Beantwortete Fragen an diesem Tag, für den Stand des Tagesziels.
  antworten integer not null default 0 check (antworten >= 0),
  primary key (user_id, tag)
);

comment on table lern_aktivitaet is
  'Ein Eintrag je Person und Kalendertag — Grundlage für Lernserie und Tagesziel.';

-- ---------------------------------------------------------------------
-- 6. Aktivität festhalten
--    Wird beim Beantworten einer Frage aufgerufen. Der Tag kommt vom Aufrufer,
--    weil nur der Client die Zeitzone der Person kennt; er wird gegen das
--    Format geprüft und gegen die Zukunft begrenzt, damit eine falsch gestellte
--    Geräteuhr keine Serie vortäuschen kann.
-- ---------------------------------------------------------------------
create or replace function notiere_lernaktivitaet(p_tag text, p_antworten integer default 1)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'notiere_lernaktivitaet: keine Sitzung';
  end if;

  if p_tag !~ '^\d{4}-\d{2}-\d{2}$' then
    raise exception 'notiere_lernaktivitaet: ungültiger Tag %', p_tag;
  end if;

  -- Höchstens ein Tag Vorlauf: mehr als das ist eine falsche Uhr, nicht eine
  -- Zeitzone. Neuseeland liegt maximal 14 Stunden vor UTC.
  if p_tag::date > (now() at time zone 'utc')::date + 1 then
    raise exception 'notiere_lernaktivitaet: Tag % liegt in der Zukunft', p_tag;
  end if;

  insert into lern_aktivitaet (user_id, tag, antworten)
  values (v_uid, p_tag, greatest(0, coalesce(p_antworten, 1)))
  on conflict (user_id, tag)
    do update set antworten = lern_aktivitaet.antworten + greatest(0, coalesce(p_antworten, 1));
end $$;

comment on function notiere_lernaktivitaet is
  'Zählt beantwortete Fragen für einen Kalendertag der aufrufenden Person.';

-- ---------------------------------------------------------------------
-- 7. RLS
--    Migration 0001 aktiviert RLS auf jeder Tabelle in public über eine
--    Schleife. Neue Tabellen sind davon nicht erfasst und werden hier
--    ausdrücklich geschützt.
-- ---------------------------------------------------------------------
alter table push_abos          enable row level security;
alter table push_einstellungen enable row level security;
alter table push_protokoll     enable row level security;
alter table lern_aktivitaet    enable row level security;

-- Abos und Einstellungen: ausschließlich die Person selbst. Bewusst ohne
-- `_betreuer`-Policy — ein Ausbilder hat kein Interesse an den Geräten seiner
-- Teilnehmenden, und ein Endpunkt ist eine Gerätekennung.
create policy push_abos_own on push_abos for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy push_einstellungen_own on push_einstellungen for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Protokoll: nur lesen. Einträge schreibt allein der Versender als
-- service_role; ein Client, der sein eigenes Protokoll schreiben oder löschen
-- könnte, könnte den Frequenzdeckel umgehen.
create policy push_protokoll_own_read on push_protokoll for select
  using (user_id = auth.uid());

-- Lernaktivität: lesen darf die Person selbst, schreiben nur über
-- notiere_lernaktivitaet. Ausbilder dürfen lesen — anders als bei den Geräten
-- ist die Lernaktivität Teil der Betreuung (Muster wie fragen_mastery in 0001).
create policy lern_aktivitaet_own on lern_aktivitaet for select
  using (user_id = auth.uid());

create policy lern_aktivitaet_betreuer on lern_aktivitaet for select
  using (app_is_admin() or app_betreut(user_id));

create policy lern_aktivitaet_insert on lern_aktivitaet for insert
  with check (user_id = auth.uid());

create policy lern_aktivitaet_update on lern_aktivitaet for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- 8. updated_at pflegen (Funktion aus Migration 0001)
-- ---------------------------------------------------------------------
create trigger push_abos_updated_at before update on push_abos
  for each row execute function set_updated_at();

create trigger push_einstellungen_updated_at before update on push_einstellungen
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- 9. Zeitplan (pg_cron)
--    Wie bei Migration 0010 bewusst auskommentiert: in lokalen
--    Supabase-Instanzen sind pg_cron und pg_net oft nicht aktiv. In der
--    Zielumgebung aktivieren.
--
--    Zweimal täglich, nicht stündlich: die Domain entscheidet ohnehin über
--    stille Zeiten und Mindestpausen, und zwei Läufe decken beide relevanten
--    Fenster ab (Mittag und Abend, jeweils über alle europäischen Zeitzonen).
--
--    -- create extension if not exists pg_cron;
--    -- create extension if not exists pg_net;
--    --
--    -- select cron.schedule(
--    --   'sende-erinnerungen-mittag',
--    --   '0 11 * * *',                          -- 11:00 UTC
--    --   $cron$
--    --     select net.http_post(
--    --       url     := current_setting('app.settings.functions_url') || '/sende-erinnerungen',
--    --       headers := jsonb_build_object(
--    --         'Content-Type', 'application/json',
--    --         'x-cron-secret', current_setting('app.settings.cron_secret')
--    --       ),
--    --       body    := jsonb_build_object('alle', true)
--    --     );
--    --   $cron$
--    -- );
--    --
--    -- select cron.schedule(
--    --   'sende-erinnerungen-abend',
--    --   '0 17 * * *',                          -- 17:00 UTC (19:00 MESZ)
--    --   $cron$
--    --     select net.http_post(
--    --       url     := current_setting('app.settings.functions_url') || '/sende-erinnerungen',
--    --       headers := jsonb_build_object(
--    --         'Content-Type', 'application/json',
--    --         'x-cron-secret', current_setting('app.settings.cron_secret')
--    --       ),
--    --       body    := jsonb_build_object('alle', true)
--    --     );
--    --   $cron$
--    -- );
-- ---------------------------------------------------------------------
