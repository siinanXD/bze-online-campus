-- =====================================================================
-- BZE Online Campus — Datenmodell (AP-01)
-- Spec: docs/SPEC.md §3. Postgres, UUID-PK, created_at/updated_at,
-- RLS auf JEDER Tabelle explizit. Mandantenfähig über traeger_id.
-- Migrationen sind additiv und werden nie geändert.
-- =====================================================================

create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- ---------------------------------------------------------------------
-- Hilfsfunktion: updated_at automatisch pflegen
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- =====================================================================
-- ENUMS
-- =====================================================================
create type rolle_t            as enum ('teilnehmer','ausbilder','verwaltung','admin');
create type kammer_typ_t       as enum ('IHK','HWK','sonstige');
create type pruefungsart_t     as enum ('zwischen','abschluss');
create type zielpruefung_t     as enum ('zwischenpruefung','abschlusspruefung');
create type le_status_t        as enum ('entwurf','freigegeben');
create type frage_typ_t        as enum ('mc','freitext');
create type frage_status_t     as enum ('entwurf','verifiziert','freigegeben','gesperrt','pruefung_noetig');
create type meldung_grund_t    as enum ('falsch','unverstaendlich','tippfehler','veraltet');
create type mastery_status_t   as enum ('neu','einmal_richtig','falsch','abgeschlossen');
create type nachweis_art_t     as enum ('tag','woche','monat','fach');
create type nachweis_status_t  as enum ('entwurf','eingereicht','signiert_teilnehmer','signiert_ausbilder','beanstandet');
create type signatur_rolle_t   as enum ('teilnehmer','ausbilder');
create type review_grund_t     as enum ('niedrige_confidence','einspruch','stichprobe','norm_veraltet','aehnlichkeit_zu_hoch','verifikation_fehlgeschlagen','fehlerquote_auffaellig','nutzermeldung');
create type norm_status_t      as enum ('gueltig','zurueckgezogen','ersetzt');
create type video_status_t     as enum ('skript_entwurf','skript_freigegeben','gerendert','veroeffentlicht');

-- =====================================================================
-- MANDANT UND NUTZER
-- =====================================================================
create table traeger (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique,
  logo_url     text,
  einstellungen jsonb not null default jsonb_build_object(
                  'mastery_streak',2,'spacing_stunden',12,'freitext_schwellwert',0.75,
                  'monatsbudget_eur',200,'flag_video',false,'flag_berichtsheft',true),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table profiles (
  id                 uuid primary key references auth.users(id) on delete cascade,
  traeger_id         uuid not null references traeger(id) on delete restrict,
  benutzername       text not null unique,
  rolle              rolle_t not null default 'teilnehmer',
  vorname            text,
  nachname           text,
  sprache            text not null default 'de',
  muss_passwort_aendern boolean not null default true,
  aktiv              boolean not null default true,
  letzter_login      timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table kammern (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  typ                  kammer_typ_t not null default 'IHK',
  anschrift            text,
  kontakt              jsonb,
  berichtsheft_vorgaben jsonb,
  hilfsmittel          jsonb,
  pdf_vorlage          text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create table bewertungsschluessel (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  stufen         jsonb not null,          -- [{von,bis,note,bezeichnung}]
  bestehensgrenze numeric not null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table berufe (
  id                     uuid primary key default gen_random_uuid(),
  traeger_id             uuid not null references traeger(id) on delete cascade,
  kammer_id              uuid not null references kammern(id) on delete restrict,
  bezeichnung            text not null,
  dauer_monate           smallint,
  bewertungsschluessel_id uuid references bewertungsschluessel(id),
  aktiv                  boolean not null default true,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create table kohorten (
  id                 uuid primary key default gen_random_uuid(),
  traeger_id         uuid not null references traeger(id) on delete cascade,
  beruf_id           uuid not null references berufe(id) on delete restrict,
  bezeichnung        text not null,
  start_datum        date,
  end_datum          date,
  beitrittscode      text unique,
  zwischenpruefung_am date,
  abschlusspruefung_am date,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table kohorten_mitglieder (
  kohorte_id uuid not null references kohorten(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (kohorte_id, user_id)
);

create table ausbilder_zuweisungen (
  ausbilder_id  uuid not null references profiles(id) on delete cascade,
  teilnehmer_id uuid not null references profiles(id) on delete cascade,
  zugewiesen_am timestamptz not null default now(),
  primary key (ausbilder_id, teilnehmer_id)
);

-- =====================================================================
-- KAMMER UND BERUF (Struktur)
-- =====================================================================
create table pruefungstermine (
  id           uuid primary key default gen_random_uuid(),
  kammer_id    uuid not null references kammern(id) on delete cascade,
  beruf_id     uuid references berufe(id) on delete cascade,
  art          pruefungsart_t not null,
  termin       date,
  anmeldefrist date,
  hinweis      text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table ausbildungsphasen (
  id                     uuid primary key default gen_random_uuid(),
  beruf_id               uuid not null references berufe(id) on delete cascade,
  bezeichnung            text not null,
  reihenfolge            smallint not null default 0,
  zielpruefung           zielpruefung_t not null,
  mindest_wochenpruefungen smallint not null default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create table pruefungsbereiche (
  id                  uuid primary key default gen_random_uuid(),
  beruf_id            uuid not null references berufe(id) on delete cascade,
  phase_id            uuid references ausbildungsphasen(id) on delete set null,
  bezeichnung         text not null,
  gewichtung_prozent  smallint not null,
  pruefungsdauer_minuten smallint,
  reihenfolge         smallint not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table themen (
  id                uuid primary key default gen_random_uuid(),
  pruefungsbereich_id uuid not null references pruefungsbereiche(id) on delete cascade,
  parent_id         uuid references themen(id) on delete cascade,
  bezeichnung       text not null,
  code              text,
  reihenfolge       smallint not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- =====================================================================
-- LERNINHALTE
-- =====================================================================
create table lerneinheiten (
  id               uuid primary key default gen_random_uuid(),
  thema_id         uuid not null references themen(id) on delete cascade,
  titel            text not null,
  inhalt_mdx       text,
  abschnitte       jsonb,          -- [{titel,inhalt,minuten}]
  lesedauer_minuten smallint,
  reihenfolge      smallint not null default 0,
  status           le_status_t not null default 'entwurf',
  quellenangaben   jsonb,
  erstellt_von     uuid references profiles(id),
  geprueft_von     uuid references profiles(id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table lerneinheiten_versionen (
  id            uuid primary key default gen_random_uuid(),
  lerneinheit_id uuid not null references lerneinheiten(id) on delete cascade,
  version       int not null,
  inhalt_mdx    text,
  geaendert_von uuid references profiles(id),
  created_at    timestamptz not null default now()
);

create table lerneinheit_fortschritt (
  user_id         uuid not null references profiles(id) on delete cascade,
  lerneinheit_id  uuid not null references lerneinheiten(id) on delete cascade,
  abschnitt_index smallint not null default 0,
  gelesen_am      timestamptz,
  lesezeit_sekunden int,
  wiederholt_am   timestamptz,
  bewertung       smallint,       -- Daumen hoch (+1) / runter (-1)
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  primary key (user_id, lerneinheit_id, abschnitt_index)
);

create table glossar_begriffe (
  id            uuid primary key default gen_random_uuid(),
  beruf_id      uuid not null references berufe(id) on delete cascade,
  begriff_de    text not null,
  uebersetzungen jsonb,
  erklaerung_de text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =====================================================================
-- FRAGEN
-- =====================================================================
create table fragen (
  id                    uuid primary key default gen_random_uuid(),
  thema_id              uuid not null references themen(id) on delete restrict,
  typ                   frage_typ_t not null,
  aufgabenstellung      text not null,
  bild_url              text,
  schwierigkeit         smallint check (schwierigkeit between 1 and 3),
  status                frage_status_t not null default 'entwurf',
  kern                  boolean not null default false,
  ki_generiert          boolean not null default false,
  quellenstufe          smallint check (quellenstufe between 1 and 4),
  tabellenbuch_fundstelle jsonb,   -- {verlag,auflage,seite,tabelle}
  enthaelt_zahlenwert   boolean not null default false,
  quelldokument_id      uuid,
  embedding             vector(1536),
  verifikation          jsonb,
  fehlerquote           numeric,
  bearbeitungen         int not null default 0,
  erstellt_von          uuid references profiles(id),
  geprueft_von          uuid references profiles(id),
  geprueft_am           timestamptz,
  normenstand_geprueft_am timestamptz,
  quell_ref             text,      -- externe ID aus Seed-Charge (z.B. PT-TU-001)
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create table antwortoptionen (
  id          uuid primary key default gen_random_uuid(),
  frage_id    uuid not null references fragen(id) on delete cascade,
  text        text not null,
  ist_korrekt boolean not null default false,
  erklaerung  text,
  reihenfolge smallint not null default 0
);

create table freitext_loesungen (
  frage_id       uuid primary key references fragen(id) on delete cascade,
  musterloesung  text not null,
  bewertungsraster jsonb not null,
  max_punkte     numeric not null default 4
);

create table fragen_uebersetzungen (
  frage_id    uuid not null references fragen(id) on delete cascade,
  sprache     text not null,
  aufgabenstellung text,
  optionen    jsonb,
  freigegeben boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (frage_id, sprache)
);

create table fragen_meldungen (
  id         uuid primary key default gen_random_uuid(),
  frage_id   uuid not null references fragen(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  grund      meldung_grund_t not null,
  kommentar  text,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- LERNFORTSCHRITT
-- =====================================================================
create table pruefungen (
  id           uuid primary key default gen_random_uuid(),
  kohorte_id   uuid not null references kohorten(id) on delete cascade,
  jahr         smallint not null,
  kalenderwoche smallint not null,
  titel        text,
  freigabe_ab  timestamptz,
  freigabe_bis timestamptz,
  dauer_minuten smallint not null default 120,
  status       text not null default 'geplant',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table pruefung_fragen (
  pruefung_id uuid not null references pruefungen(id) on delete cascade,
  frage_id    uuid not null references fragen(id) on delete restrict,
  position    smallint not null,
  punkte      numeric not null default 1,
  primary key (pruefung_id, frage_id)
);

create table pruefung_ergebnisse (
  id            uuid primary key default gen_random_uuid(),
  pruefung_id   uuid not null references pruefungen(id) on delete cascade,
  user_id       uuid not null references profiles(id) on delete cascade,
  mc_punkte     numeric,
  freitext_punkte numeric,
  gesamtpunkte  numeric,
  note          smallint,
  bestanden     boolean,
  gestartet_am  timestamptz,
  abgegeben_am  timestamptz,
  versuch_nr    smallint not null default 1,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table versuche (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references profiles(id) on delete cascade,
  frage_id           uuid not null references fragen(id) on delete cascade,
  pruefung_ergebnis_id uuid references pruefung_ergebnisse(id) on delete set null,
  antwort            jsonb,
  antwort_sprache    text,
  ist_korrekt        boolean,
  erzielte_punkte    numeric,
  ki_bewertung       jsonb,
  ki_confidence      numeric,
  dauer_sekunden     int,
  created_at         timestamptz not null default now()
);

create table fragen_mastery (
  user_id          uuid not null references profiles(id) on delete cascade,
  frage_id         uuid not null references fragen(id) on delete cascade,
  status           mastery_status_t not null default 'neu',
  streak           smallint not null default 0,
  fehler_gesamt    int not null default 0,
  richtig_gesamt   int not null default 0,
  letzter_versuch  timestamptz,
  naechste_faelligkeit timestamptz,
  updated_at       timestamptz not null default now(),
  primary key (user_id, frage_id)
);

create table lernpunkte (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  grund       text,
  punkte      int not null default 0,
  referenz_id uuid,
  created_at  timestamptz not null default now()
);

create table achievements (
  id             uuid primary key default gen_random_uuid(),
  code           text not null unique,
  titel_key      text not null,
  beschreibung_key text,
  bedingung      jsonb,
  punkte         int not null default 0
);

create table nutzer_achievements (
  user_id          uuid not null references profiles(id) on delete cascade,
  achievement_id   uuid not null references achievements(id) on delete cascade,
  freigeschaltet_am timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create table wochenberichte (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  jahr         smallint not null,
  kalenderwoche smallint not null,
  inhalt       jsonb,
  merksaetze   jsonb,
  gelesen      boolean not null default false,
  created_at   timestamptz not null default now(),
  unique (user_id, jahr, kalenderwoche)
);

-- =====================================================================
-- PRÜFUNGSREIFE
-- =====================================================================
create table pruefungsreife (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references profiles(id) on delete cascade,
  phase_id              uuid not null references ausbildungsphasen(id) on delete cascade,
  kriterien_erfuellt_am timestamptz,
  ausbilder_bestaetigt_von uuid references profiles(id),
  ausbilder_bestaetigt_am  timestamptz,
  kommentar             text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- =====================================================================
-- AUSBILDUNGSNACHWEIS
-- =====================================================================
create table nachweise (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  kohorte_id      uuid references kohorten(id) on delete set null,
  art             nachweis_art_t not null,
  zeitraum_von    date,
  zeitraum_bis    date,
  ausbildungsjahr smallint,
  inhalt          jsonb,
  rahmenplan_positionen text[],
  ki_formuliert   boolean not null default false,
  status          nachweis_status_t not null default 'entwurf',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table nachweis_signaturen (
  id          uuid primary key default gen_random_uuid(),
  nachweis_id uuid not null references nachweise(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  rolle       signatur_rolle_t not null,
  signiert_am timestamptz not null default now(),
  hash        text
);

create table nachweis_korrekturen (
  id          uuid primary key default gen_random_uuid(),
  nachweis_id uuid not null references nachweise(id) on delete cascade,
  geaendert_von uuid references profiles(id),
  vorher      jsonb,
  nachher     jsonb,
  begruendung text not null,
  created_at  timestamptz not null default now()
);

-- =====================================================================
-- QUALITÄT, BETRIEB, VIDEO
-- =====================================================================
create table review_queue (
  id            uuid primary key default gen_random_uuid(),
  versuch_id    uuid references versuche(id) on delete set null,
  frage_id      uuid references fragen(id) on delete set null,
  grund         review_grund_t not null,
  status        text not null default 'offen',
  ausbilder_id  uuid references profiles(id),
  korrigierte_punkte numeric,
  kommentar     text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table quelldokumente (
  id             uuid primary key default gen_random_uuid(),
  traeger_id     uuid not null references traeger(id) on delete cascade,
  dateiname      text not null,
  storage_pfad   text,
  typ            text,
  rechte_bestaetigt boolean not null default false,
  rechte_hinweis text,
  hochgeladen_von uuid references profiles(id),
  created_at     timestamptz not null default now()
);

create table normen (
  id             uuid primary key default gen_random_uuid(),
  nummer         text not null,
  titel          text,
  ausgabedatum   date,
  status         norm_status_t not null default 'gueltig',
  nachfolger_nummer text,
  geprueft_am    timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table frage_normen (
  frage_id   uuid not null references fragen(id) on delete cascade,
  norm_id    uuid not null references normen(id) on delete cascade,
  fundstelle text,
  primary key (frage_id, norm_id)
);

create table ki_aufrufe (
  id           uuid primary key default gen_random_uuid(),
  traeger_id   uuid references traeger(id) on delete set null,
  user_id      uuid references profiles(id) on delete set null,
  funktion     text not null,
  modell       text,
  input_tokens int,
  output_tokens int,
  kosten_eur   numeric,
  latenz_ms    int,
  erfolg       boolean,
  fehlertext   text,
  request_id   text,
  created_at   timestamptz not null default now()
);

create table audit_log (
  id         uuid primary key default gen_random_uuid(),
  akteur_id  uuid references profiles(id) on delete set null,
  aktion     text not null,
  ziel_typ   text,
  ziel_id    uuid,
  details    jsonb,
  ip         text,
  created_at timestamptz not null default now()
);

create table videos (
  id             uuid primary key default gen_random_uuid(),
  thema_id       uuid references themen(id) on delete cascade,
  lerneinheit_id uuid references lerneinheiten(id) on delete set null,
  titel          text,
  storage_pfad   text,
  dauer_sekunden int,
  sprache_tonspur text not null default 'de',
  status         video_status_t not null default 'skript_entwurf',
  remotion_composition text,
  render_hash    text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table video_skripte (
  id            uuid primary key default gen_random_uuid(),
  video_id      uuid not null references videos(id) on delete cascade,
  version       int not null,
  szenen        jsonb,
  erstellt_von_ki boolean not null default false,
  geprueft_von  uuid references profiles(id),
  geprueft_am   timestamptz,
  created_at    timestamptz not null default now()
);

create table video_untertitel (
  video_id    uuid not null references videos(id) on delete cascade,
  sprache     text not null,
  vtt_inhalt  text,
  freigegeben boolean not null default false,
  primary key (video_id, sprache)
);

-- ---------------------------------------------------------------------
-- updated_at-Trigger für alle Tabellen mit updated_at
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  for t in
    select table_name from information_schema.columns
    where table_schema='public' and column_name='updated_at'
  loop
    execute format('create trigger trg_%1$s_updated before update on %1$I
                    for each row execute function set_updated_at()', t);
  end loop;
end $$;

-- =====================================================================
-- RLS-HILFSFUNKTIONEN (SECURITY DEFINER, um Rekursion zu vermeiden)
-- =====================================================================
create or replace function app_rolle() returns rolle_t
language sql stable security definer set search_path = public as $$
  select rolle from profiles where id = auth.uid()
$$;

create or replace function app_traeger() returns uuid
language sql stable security definer set search_path = public as $$
  select traeger_id from profiles where id = auth.uid()
$$;

create or replace function app_is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(app_rolle() = 'admin', false)
$$;

-- Ist der aufrufende Ausbilder diesem Teilnehmer zugewiesen?
create or replace function app_betreut(teilnehmer uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from ausbilder_zuweisungen
    where ausbilder_id = auth.uid() and teilnehmer_id = teilnehmer
  )
$$;

-- =====================================================================
-- RLS AKTIVIEREN — auf JEDER Tabelle
-- =====================================================================
do $$
declare t text;
begin
  for t in
    select tablename from pg_tables where schemaname='public'
  loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- POLICIES
-- Grundmuster (Spec §3 RLS):
--  * Teilnehmer: nur EIGENE Lern-/Ergebnisdaten. Inhalte nur 'freigegeben'
--    und nur für Berufe der eigenen Kohorte.
--  * Ausbilder: Teilnehmer aus ausbilder_zuweisungen.
--  * Verwaltung: eigener Träger. Admin: alles.
--  * quelldokumente nie für Teilnehmer. Signierte nachweise schreibgeschützt.
-- ---------------------------------------------------------------------

-- ---- profiles ----
create policy profiles_select on profiles for select using (
  id = auth.uid()
  or app_is_admin()
  or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
);
create policy profiles_update_self on profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_admin_all on profiles for all using (app_is_admin()) with check (app_is_admin());

-- ---- traeger ----
create policy traeger_select on traeger for select using (id = app_traeger() or app_is_admin());
create policy traeger_admin on traeger for all using (app_is_admin()) with check (app_is_admin());

-- Helfer-Makro-Ersatz: viele Stammdaten sind lesbar für angemeldete Nutzer
-- des jeweiligen Trägers und voll änderbar für Admin/Verwaltung.
-- (Kammern/Bewertungsschlüssel/Normen sind trägerübergreifende Konfiguration.)

-- ---- kammern, bewertungsschluessel, normen, achievements: global lesbar, Admin schreibt ----
do $$
declare t text;
begin
  foreach t in array array['kammern','bewertungsschluessel','normen','achievements','pruefungstermine'] loop
    execute format('create policy %1$s_read on %1$I for select using (auth.uid() is not null)', t);
    execute format('create policy %1$s_admin on %1$I for all using (app_is_admin()) with check (app_is_admin())', t);
  end loop;
end $$;

-- ---- Trägergebundene Struktur- und Inhaltstabellen mit direkter traeger_id ----
-- berufe, kohorten, quelldokumente
do $$
declare t text;
begin
  foreach t in array array['berufe','kohorten','quelldokumente'] loop
    -- Lesen: eigener Träger (Teilnehmer eingeschlossen), Admin alles.
    -- quelldokumente werden unten für Teilnehmer wieder entzogen.
    execute format('create policy %1$s_read on %1$I for select using (traeger_id = app_traeger() or app_is_admin())', t);
    execute format('create policy %1$s_manage on %1$I for all using (app_is_admin() or (app_rolle()=''verwaltung'' and traeger_id = app_traeger())) with check (app_is_admin() or (app_rolle()=''verwaltung'' and traeger_id = app_traeger()))', t);
  end loop;
end $$;

-- quelldokumente: niemals für Teilnehmer lesbar (überschreibt Lesen enger)
drop policy quelldokumente_read on quelldokumente;
create policy quelldokumente_read on quelldokumente for select using (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
);

-- ---- Struktur ohne direkte traeger_id: über beruf -> traeger auflösen ----
-- ausbildungsphasen, pruefungsbereiche, themen, glossar_begriffe
create policy phasen_read on ausbildungsphasen for select using (
  app_is_admin() or exists (select 1 from berufe b where b.id = beruf_id and b.traeger_id = app_traeger()));
create policy phasen_manage on ausbildungsphasen for all using (
  app_is_admin() or (app_rolle()='verwaltung' and exists (select 1 from berufe b where b.id=beruf_id and b.traeger_id=app_traeger())))
  with check (app_is_admin() or (app_rolle()='verwaltung' and exists (select 1 from berufe b where b.id=beruf_id and b.traeger_id=app_traeger())));

create policy pbereiche_read on pruefungsbereiche for select using (
  app_is_admin() or exists (select 1 from berufe b where b.id = beruf_id and b.traeger_id = app_traeger()));
create policy pbereiche_manage on pruefungsbereiche for all using (
  app_is_admin() or (app_rolle()='verwaltung' and exists (select 1 from berufe b where b.id=beruf_id and b.traeger_id=app_traeger())))
  with check (app_is_admin() or (app_rolle()='verwaltung' and exists (select 1 from berufe b where b.id=beruf_id and b.traeger_id=app_traeger())));

create policy themen_read on themen for select using (
  app_is_admin() or exists (
    select 1 from pruefungsbereiche p join berufe b on b.id=p.beruf_id
    where p.id = pruefungsbereich_id and b.traeger_id = app_traeger()));
create policy themen_manage on themen for all using (app_is_admin() or app_rolle()='verwaltung')
  with check (app_is_admin() or app_rolle()='verwaltung');

create policy glossar_read on glossar_begriffe for select using (
  app_is_admin() or exists (select 1 from berufe b where b.id=beruf_id and b.traeger_id=app_traeger()));
create policy glossar_manage on glossar_begriffe for all using (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'))
  with check (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));

-- ---- Lerneinheiten: freigegeben für alle Trägernutzer lesbar; Entwurf nur Ausbilder/Verwaltung/Admin ----
create policy le_read on lerneinheiten for select using (
  app_is_admin()
  or (app_rolle() in ('ausbilder','verwaltung'))
  or (status = 'freigegeben')
);
create policy le_manage on lerneinheiten for all using (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'))
  with check (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));

create policy le_ver_read on lerneinheiten_versionen for select using (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));
create policy le_ver_manage on lerneinheiten_versionen for all using (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'))
  with check (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));

-- ---- Fragen: freigegeben für alle lesbar; sonstige Status nur Rollen mit Kompetenz ----
create policy fragen_read on fragen for select using (
  app_is_admin() or app_rolle() in ('ausbilder','verwaltung') or status = 'freigegeben');
create policy fragen_manage on fragen for all using (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'))
  with check (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));

-- antwortoptionen / freitext_loesungen / uebersetzungen: an Frage gekoppelt
create policy ao_read on antwortoptionen for select using (
  exists (select 1 from fragen f where f.id=frage_id and (app_is_admin() or app_rolle() in ('ausbilder','verwaltung') or f.status='freigegeben')));
create policy ao_manage on antwortoptionen for all using (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'))
  with check (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));

create policy fl_read on freitext_loesungen for select using (
  app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));  -- Musterlösung nicht an Teilnehmer vor der Bewertung
create policy fl_manage on freitext_loesungen for all using (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'))
  with check (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));

create policy fue_read on fragen_uebersetzungen for select using (
  freigegeben or app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));
create policy fue_manage on fragen_uebersetzungen for all using (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'))
  with check (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));

-- fragen_meldungen: Teilnehmer legt eigene an; Ausbilder/Admin lesen
create policy fm_insert on fragen_meldungen for insert with check (user_id = auth.uid());
create policy fm_read on fragen_meldungen for select using (
  user_id = auth.uid() or app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));

-- =====================================================================
-- Eigene Lern-/Ergebnisdaten des Teilnehmers (Muster: user_id = auth.uid())
-- Ausbilder dürfen LESEN, wenn Teilnehmer zugewiesen ist. Admin alles.
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'versuche','fragen_mastery','pruefung_ergebnisse','lerneinheit_fortschritt',
    'lernpunkte','wochenberichte','nutzer_achievements','pruefungsreife'
  ] loop
    execute format($f$
      create policy %1$s_own on %1$I for all
        using (user_id = auth.uid())
        with check (user_id = auth.uid());
    $f$, t);
    execute format($f$
      create policy %1$s_betreuer on %1$I for select
        using (app_is_admin() or app_betreut(user_id));
    $f$, t);
  end loop;
end $$;

-- ---- Prüfungen (kohortengebunden) ----
create policy pruef_read on pruefungen for select using (
  app_is_admin() or app_rolle() in ('ausbilder','verwaltung')
  or exists (select 1 from kohorten_mitglieder m where m.kohorte_id = pruefungen.kohorte_id and m.user_id = auth.uid())
);
create policy pruef_manage on pruefungen for all using (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'))
  with check (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));

create policy pf_read on pruefung_fragen for select using (
  app_is_admin() or app_rolle() in ('ausbilder','verwaltung')
  or exists (select 1 from pruefungen p join kohorten_mitglieder m on m.kohorte_id=p.kohorte_id
             where p.id = pruefung_id and m.user_id = auth.uid()));
create policy pf_manage on pruefung_fragen for all using (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'))
  with check (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));

-- ---- kohorten_mitglieder / ausbilder_zuweisungen ----
create policy km_read on kohorten_mitglieder for select using (
  user_id = auth.uid() or app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));
create policy km_manage on kohorten_mitglieder for all using (app_is_admin() or app_rolle()='verwaltung')
  with check (app_is_admin() or app_rolle()='verwaltung');

create policy az_read on ausbilder_zuweisungen for select using (
  ausbilder_id = auth.uid() or teilnehmer_id = auth.uid() or app_is_admin() or app_rolle()='verwaltung');
create policy az_manage on ausbilder_zuweisungen for all using (app_is_admin() or app_rolle()='verwaltung')
  with check (app_is_admin() or app_rolle()='verwaltung');

-- ---- Ausbildungsnachweis ----
create policy nachweis_own on nachweise for select using (
  user_id = auth.uid() or app_is_admin() or app_betreut(user_id));
create policy nachweis_write_own on nachweise for insert with check (user_id = auth.uid());
-- Update nur solange NICHT signiert; signierte sind schreibgeschützt (Spec §3, Regel 15)
create policy nachweis_update_unsigned on nachweise for update using (
  user_id = auth.uid() and status not in ('signiert_teilnehmer','signiert_ausbilder')
) with check (user_id = auth.uid());
create policy nachweis_ausbilder on nachweise for update using (app_betreut(user_id) or app_is_admin())
  with check (app_betreut(user_id) or app_is_admin());

create policy nsig_read on nachweis_signaturen for select using (
  user_id = auth.uid() or app_is_admin()
  or exists (select 1 from nachweise n where n.id=nachweis_id and app_betreut(n.user_id)));
create policy nsig_insert on nachweis_signaturen for insert with check (
  user_id = auth.uid() or app_is_admin());

create policy nkorr_read on nachweis_korrekturen for select using (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));
create policy nkorr_insert on nachweis_korrekturen for insert with check (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));

-- ---- Review-Queue: Ausbilder/Verwaltung/Admin ----
create policy rq_read on review_queue for select using (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));
create policy rq_manage on review_queue for all using (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'))
  with check (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));

-- ---- frage_normen ----
create policy fn_read on frage_normen for select using (auth.uid() is not null);
create policy fn_manage on frage_normen for all using (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'))
  with check (app_is_admin() or app_rolle() in ('ausbilder','verwaltung'));

-- ---- ki_aufrufe / audit_log: nur Admin (Verwaltung liest eigenen Träger bei ki_aufrufe) ----
create policy ki_read on ki_aufrufe for select using (
  app_is_admin() or (app_rolle()='verwaltung' and traeger_id = app_traeger()));
create policy ki_insert on ki_aufrufe for insert with check (true); -- Schreiben durch Edge Functions (service role) / Server
create policy audit_read on audit_log for select using (app_is_admin());
create policy audit_insert on audit_log for insert with check (true);

-- ---- Video (Feature-Flag, Verwaltung/Ausbilder/Admin) ----
do $$
declare t text;
begin
  foreach t in array array['videos','video_skripte','video_untertitel'] loop
    execute format('create policy %1$s_read on %1$I for select using (auth.uid() is not null)', t);
    execute format('create policy %1$s_manage on %1$I for all using (app_is_admin() or app_rolle() in (''ausbilder'',''verwaltung'')) with check (app_is_admin() or app_rolle() in (''ausbilder'',''verwaltung''))', t);
  end loop;
end $$;

-- =====================================================================
-- INDIZES (Auswahl für häufige Zugriffe)
-- =====================================================================
create index on profiles(traeger_id);
create index on fragen(thema_id);
create index on fragen(status);
create index on antwortoptionen(frage_id);
create index on versuche(user_id);
create index on versuche(frage_id);
create index on fragen_mastery(user_id);
create index on themen(pruefungsbereich_id);
create index on pruefungsbereiche(beruf_id);
create index on kohorten_mitglieder(user_id);
create index on ausbilder_zuweisungen(teilnehmer_id);

-- Ende 0001_datenmodell.sql
