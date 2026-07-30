-- =====================================================================
-- KI-Content-Plattform - Content-Grundmodell
--
-- Additiv: erweitert vorhandene Themen, Lerneinheiten und Fragen, ohne
-- bestehende Bewertungs-, Mastery- oder Fortschrittslogik zu duplizieren.
-- =====================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'content_typ_t') then
    create type content_typ_t as enum (
      'erklaerung',
      'lernkarte',
      'single_choice',
      'multiple_choice',
      'freitext',
      'rechenaufgabe',
      'praxisfall',
      'pruefungsnahe_uebungsfrage',
      'zusammenfassung'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'content_status_t') then
    create type content_status_t as enum (
      'entwurf',
      'generiert',
      'in_pruefung',
      'freigegeben',
      'abgelehnt',
      'archiviert'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'schwierigkeitsgrad_t') then
    create type schwierigkeitsgrad_t as enum ('einfach', 'mittel', 'schwer');
  end if;

  if not exists (select 1 from pg_type where typname = 'content_quellenart_t') then
    create type content_quellenart_t as enum (
      'tabellenbuch',
      'rahmenlehrplan',
      'traegerskript',
      'web',
      'ki',
      'demo',
      'manuell',
      'unbekannt'
    );
  end if;
end $$;

-- Demo-Modus ist Tenant-Konfiguration, nicht Client-Logik.
update traeger
   set einstellungen = coalesce(einstellungen, '{}'::jsonb)
     || jsonb_build_object('flag_demo_content', coalesce((einstellungen->>'flag_demo_content')::boolean, false))
 where not (coalesce(einstellungen, '{}'::jsonb) ? 'flag_demo_content');

create or replace function app_demo_content_aktiv(p_traeger_id uuid default null)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((t.einstellungen->>'flag_demo_content')::boolean, false)
    from traeger t
   where t.id = coalesce(p_traeger_id, app_traeger())
$$;

revoke all on function app_demo_content_aktiv(uuid) from public;
grant execute on function app_demo_content_aktiv(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- Bestehende Struktur erweitern
-- ---------------------------------------------------------------------

alter table pruefungsbereiche
  add column if not exists code text,
  add column if not exists beschreibung text;

alter table themen
  add column if not exists beschreibung text;

alter table lerneinheiten
  add column if not exists beschreibung text,
  add column if not exists content_typ content_typ_t not null default 'erklaerung',
  add column if not exists schwierigkeitsgrad schwierigkeitsgrad_t not null default 'mittel',
  add column if not exists content_status content_status_t not null default 'entwurf',
  add column if not exists ist_demo boolean not null default false,
  add column if not exists demo_sichtbar boolean not null default false,
  add column if not exists demo_label text,
  add column if not exists fachlich_verifiziert boolean not null default false,
  add column if not exists quellenart content_quellenart_t not null default 'unbekannt',
  add column if not exists ki_anbieter text,
  add column if not exists ki_modell text,
  add column if not exists ki_metadaten jsonb not null default '{}'::jsonb,
  add column if not exists qualitaetswert numeric check (qualitaetswert is null or (qualitaetswert >= 0 and qualitaetswert <= 1)),
  add column if not exists qualitaetsmetadaten jsonb not null default '{}'::jsonb;

update lerneinheiten
   set content_status = case
     when status = 'freigegeben' then 'freigegeben'::content_status_t
     else content_status
   end,
   fachlich_verifiziert = case
     when status = 'freigegeben' then true
     else fachlich_verifiziert
   end;

alter table fragen
  add column if not exists beschreibung text,
  add column if not exists content_typ content_typ_t,
  add column if not exists schwierigkeitsgrad schwierigkeitsgrad_t not null default 'mittel',
  add column if not exists content_status content_status_t not null default 'entwurf',
  add column if not exists ist_demo boolean not null default false,
  add column if not exists demo_sichtbar boolean not null default false,
  add column if not exists demo_label text,
  add column if not exists fachlich_verifiziert boolean not null default false,
  add column if not exists quellenart content_quellenart_t not null default 'unbekannt',
  add column if not exists ki_anbieter text,
  add column if not exists ki_modell text,
  add column if not exists ki_metadaten jsonb not null default '{}'::jsonb,
  add column if not exists qualitaetswert numeric check (qualitaetswert is null or (qualitaetswert >= 0 and qualitaetswert <= 1)),
  add column if not exists qualitaetsmetadaten jsonb not null default '{}'::jsonb;

update fragen
   set content_typ = case
     when typ = 'freitext' then 'freitext'::content_typ_t
     else 'single_choice'::content_typ_t
   end
 where content_typ is null;

alter table fragen
  alter column content_typ set default 'single_choice',
  alter column content_typ set not null;

update fragen
   set content_status = case
     when status = 'freigegeben' then 'freigegeben'::content_status_t
     when status = 'verifiziert' then 'in_pruefung'::content_status_t
     when status = 'gesperrt' then 'archiviert'::content_status_t
     else content_status
   end,
   fachlich_verifiziert = case
     when status = 'freigegeben' then true
     else fachlich_verifiziert
   end;

-- ---------------------------------------------------------------------
-- Neue Content-Tabellen
-- ---------------------------------------------------------------------

create table if not exists lernziele (
  id uuid primary key default gen_random_uuid(),
  traeger_id uuid not null references traeger(id) on delete cascade,
  pruefungsbereich_id uuid references pruefungsbereiche(id) on delete cascade,
  thema_id uuid references themen(id) on delete cascade,
  unterthema_id uuid references themen(id) on delete cascade,
  titel text not null,
  beschreibung text,
  schwierigkeitsgrad schwierigkeitsgrad_t not null default 'mittel',
  status content_status_t not null default 'entwurf',
  ist_demo boolean not null default false,
  demo_sichtbar boolean not null default false,
  demo_label text,
  fachlich_verifiziert boolean not null default false,
  quellenart content_quellenart_t not null default 'unbekannt',
  ki_anbieter text,
  ki_modell text,
  ki_metadaten jsonb not null default '{}'::jsonb,
  qualitaetswert numeric check (qualitaetswert is null or (qualitaetswert >= 0 and qualitaetswert <= 1)),
  qualitaetsmetadaten jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_elemente (
  id uuid primary key default gen_random_uuid(),
  traeger_id uuid not null references traeger(id) on delete cascade,
  titel text not null,
  beschreibung text,
  content_typ content_typ_t not null,
  pruefungsbereich_id uuid references pruefungsbereiche(id) on delete cascade,
  thema_id uuid references themen(id) on delete cascade,
  unterthema_id uuid references themen(id) on delete cascade,
  lerneinheit_id uuid references lerneinheiten(id) on delete cascade,
  frage_id uuid references fragen(id) on delete cascade,
  inhalt jsonb not null default '{}'::jsonb,
  schwierigkeitsgrad schwierigkeitsgrad_t not null default 'mittel',
  status content_status_t not null default 'entwurf',
  ist_demo boolean not null default false,
  demo_sichtbar boolean not null default false,
  demo_label text,
  fachlich_verifiziert boolean not null default false,
  quellenart content_quellenart_t not null default 'unbekannt',
  ki_anbieter text,
  ki_modell text,
  ki_metadaten jsonb not null default '{}'::jsonb,
  qualitaetswert numeric check (qualitaetswert is null or (qualitaetswert >= 0 and qualitaetswert <= 1)),
  qualitaetsmetadaten jsonb not null default '{}'::jsonb,
  erstellt_von uuid references profiles(id),
  geprueft_von uuid references profiles(id),
  geprueft_am timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lerneinheit_id),
  unique (frage_id)
);

create table if not exists content_element_lernziele (
  content_element_id uuid not null references content_elemente(id) on delete cascade,
  lernziel_id uuid not null references lernziele(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (content_element_id, lernziel_id)
);

create table if not exists lernkarten (
  id uuid primary key default gen_random_uuid(),
  content_element_id uuid not null unique references content_elemente(id) on delete cascade,
  vorderseite text not null,
  rueckseite text not null,
  merksatz text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_quellen (
  id uuid primary key default gen_random_uuid(),
  traeger_id uuid not null references traeger(id) on delete cascade,
  titel text not null,
  beschreibung text,
  quellenart content_quellenart_t not null default 'unbekannt',
  referenz text,
  url text,
  quelldokument_id uuid references quelldokumente(id) on delete set null,
  ist_demo boolean not null default false,
  demo_sichtbar boolean not null default false,
  fachlich_verifiziert boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_element_quellen (
  content_element_id uuid not null references content_elemente(id) on delete cascade,
  quelle_id uuid not null references content_quellen(id) on delete cascade,
  fundstelle jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  primary key (content_element_id, quelle_id)
);

create table if not exists content_quizze (
  id uuid primary key default gen_random_uuid(),
  traeger_id uuid not null references traeger(id) on delete cascade,
  titel text not null,
  beschreibung text,
  pruefungsbereich_id uuid references pruefungsbereiche(id) on delete cascade,
  thema_id uuid references themen(id) on delete cascade,
  unterthema_id uuid references themen(id) on delete cascade,
  status content_status_t not null default 'entwurf',
  ist_demo boolean not null default false,
  demo_sichtbar boolean not null default false,
  fachlich_verifiziert boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_quiz_fragen (
  quiz_id uuid not null references content_quizze(id) on delete cascade,
  frage_id uuid not null references fragen(id) on delete cascade,
  position smallint not null default 0,
  punkte numeric not null default 1,
  created_at timestamptz not null default now(),
  primary key (quiz_id, frage_id)
);

-- updated_at fuer neue Tabellen
drop trigger if exists trg_lernziele_updated on lernziele;
create trigger trg_lernziele_updated before update on lernziele
  for each row execute function set_updated_at();

drop trigger if exists trg_content_elemente_updated on content_elemente;
create trigger trg_content_elemente_updated before update on content_elemente
  for each row execute function set_updated_at();

drop trigger if exists trg_lernkarten_updated on lernkarten;
create trigger trg_lernkarten_updated before update on lernkarten
  for each row execute function set_updated_at();

drop trigger if exists trg_content_quellen_updated on content_quellen;
create trigger trg_content_quellen_updated before update on content_quellen
  for each row execute function set_updated_at();

drop trigger if exists trg_content_quizze_updated on content_quizze;
create trigger trg_content_quizze_updated before update on content_quizze
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------

alter table lernziele enable row level security;
alter table content_elemente enable row level security;
alter table content_element_lernziele enable row level security;
alter table lernkarten enable row level security;
alter table content_quellen enable row level security;
alter table content_element_quellen enable row level security;
alter table content_quizze enable row level security;
alter table content_quiz_fragen enable row level security;

drop policy if exists lernziele_read on lernziele;
create policy lernziele_read on lernziele for select using (
  app_is_admin()
  or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
  or (traeger_id = app_traeger() and status = 'freigegeben')
  or (traeger_id = app_traeger() and ist_demo and demo_sichtbar and app_demo_content_aktiv(traeger_id))
);

drop policy if exists lernziele_manage on lernziele;
create policy lernziele_manage on lernziele for all using (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
) with check (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
);

drop policy if exists content_elemente_read on content_elemente;
create policy content_elemente_read on content_elemente for select using (
  app_is_admin()
  or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
  or (traeger_id = app_traeger() and status = 'freigegeben')
  or (traeger_id = app_traeger() and ist_demo and demo_sichtbar and app_demo_content_aktiv(traeger_id))
);

drop policy if exists content_elemente_manage on content_elemente;
create policy content_elemente_manage on content_elemente for all using (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
) with check (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
);

drop policy if exists content_element_lernziele_read on content_element_lernziele;
create policy content_element_lernziele_read on content_element_lernziele for select using (
  exists (select 1 from content_elemente ce where ce.id = content_element_id)
  and exists (select 1 from lernziele l where l.id = lernziel_id)
);

drop policy if exists content_element_lernziele_manage on content_element_lernziele;
create policy content_element_lernziele_manage on content_element_lernziele for all using (
  exists (
    select 1 from content_elemente ce
    where ce.id = content_element_id
      and (app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and ce.traeger_id = app_traeger()))
  )
) with check (
  exists (
    select 1 from content_elemente ce
    join lernziele l on l.id = lernziel_id
    where ce.id = content_element_id
      and ce.traeger_id = l.traeger_id
      and (app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and ce.traeger_id = app_traeger()))
  )
);

drop policy if exists lernkarten_read on lernkarten;
create policy lernkarten_read on lernkarten for select using (
  exists (select 1 from content_elemente ce where ce.id = content_element_id)
);

drop policy if exists lernkarten_manage on lernkarten;
create policy lernkarten_manage on lernkarten for all using (
  exists (
    select 1 from content_elemente ce
    where ce.id = content_element_id
      and (app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and ce.traeger_id = app_traeger()))
  )
) with check (
  exists (
    select 1 from content_elemente ce
    where ce.id = content_element_id
      and ce.content_typ = 'lernkarte'
      and (app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and ce.traeger_id = app_traeger()))
  )
);

drop policy if exists content_quellen_read on content_quellen;
create policy content_quellen_read on content_quellen for select using (
  app_is_admin()
  or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
  or (traeger_id = app_traeger() and fachlich_verifiziert)
  or (traeger_id = app_traeger() and ist_demo and demo_sichtbar and app_demo_content_aktiv(traeger_id))
);

drop policy if exists content_quellen_manage on content_quellen;
create policy content_quellen_manage on content_quellen for all using (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
) with check (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
);

drop policy if exists content_element_quellen_read on content_element_quellen;
create policy content_element_quellen_read on content_element_quellen for select using (
  exists (select 1 from content_elemente ce where ce.id = content_element_id)
  and exists (select 1 from content_quellen cq where cq.id = quelle_id)
);

drop policy if exists content_element_quellen_manage on content_element_quellen;
create policy content_element_quellen_manage on content_element_quellen for all using (
  exists (
    select 1 from content_elemente ce
    where ce.id = content_element_id
      and (app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and ce.traeger_id = app_traeger()))
  )
) with check (
  exists (
    select 1 from content_elemente ce
    join content_quellen cq on cq.id = quelle_id
    where ce.id = content_element_id
      and ce.traeger_id = cq.traeger_id
      and (app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and ce.traeger_id = app_traeger()))
  )
);

drop policy if exists content_quizze_read on content_quizze;
create policy content_quizze_read on content_quizze for select using (
  app_is_admin()
  or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
  or (traeger_id = app_traeger() and status = 'freigegeben')
  or (traeger_id = app_traeger() and ist_demo and demo_sichtbar and app_demo_content_aktiv(traeger_id))
);

drop policy if exists content_quizze_manage on content_quizze;
create policy content_quizze_manage on content_quizze for all using (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
) with check (
  app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and traeger_id = app_traeger())
);

drop policy if exists content_quiz_fragen_read on content_quiz_fragen;
create policy content_quiz_fragen_read on content_quiz_fragen for select using (
  exists (select 1 from content_quizze q where q.id = quiz_id)
);

drop policy if exists content_quiz_fragen_manage on content_quiz_fragen;
create policy content_quiz_fragen_manage on content_quiz_fragen for all using (
  exists (
    select 1 from content_quizze q
    where q.id = quiz_id
      and (app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and q.traeger_id = app_traeger()))
  )
) with check (
  exists (
    select 1 from content_quizze q
    where q.id = quiz_id
      and (app_is_admin() or (app_rolle() in ('ausbilder','verwaltung') and q.traeger_id = app_traeger()))
  )
);

-- Demo-Sichtbarkeit fuer bestehende Fachkunde/Fragen serverseitig erweitern.
drop policy if exists le_read on lerneinheiten;
create policy le_read on lerneinheiten for select using (
  app_is_admin()
  or (app_rolle() in ('ausbilder','verwaltung'))
  or status = 'freigegeben'
  or (ist_demo and demo_sichtbar and app_demo_content_aktiv())
);

drop policy if exists fragen_read on fragen;
create policy fragen_read on fragen for select using (
  app_is_admin()
  or app_rolle() in ('ausbilder','verwaltung')
  or status = 'freigegeben'
  or (ist_demo and demo_sichtbar and app_demo_content_aktiv())
);

drop policy if exists ao_read on antwortoptionen;
create policy ao_read on antwortoptionen for select using (
  exists (
    select 1 from fragen f
    where f.id = frage_id
      and (
        app_is_admin()
        or app_rolle() in ('ausbilder','verwaltung')
        or f.status = 'freigegeben'
        or (f.ist_demo and f.demo_sichtbar and app_demo_content_aktiv())
      )
  )
);

-- security_invoker-Views fuer spaetere Oberflaechen: RLS der Basistabellen gilt.
create or replace view v_content_elemente_sichtbar
with (security_invoker = true) as
select *
  from content_elemente;

grant select on v_content_elemente_sichtbar to authenticated;

create index if not exists lernziele_thema_idx on lernziele (thema_id, unterthema_id);
create index if not exists lernziele_status_idx on lernziele (status, ist_demo, demo_sichtbar);
create index if not exists content_elemente_thema_idx on content_elemente (thema_id, unterthema_id);
create index if not exists content_elemente_status_idx on content_elemente (status, ist_demo, demo_sichtbar);
create index if not exists content_elemente_typ_idx on content_elemente (content_typ);
create index if not exists content_quellen_traeger_idx on content_quellen (traeger_id, quellenart);
create index if not exists content_quizze_thema_idx on content_quizze (thema_id, unterthema_id);

comment on column content_elemente.ist_demo is
  'Interne Kennzeichnung fuer Demo-Inhalte; Demo-Sichtbarkeit wird serverseitig per RLS und Traeger-Flag gesteuert.';
comment on column content_elemente.demo_label is
  'Anzeigehinweis, z.B. KI-generierter Beispielinhalt / nicht fachlich verifiziert.';
comment on column content_elemente.fachlich_verifiziert is
  'Fachliche Pruefung durch Ausbilder/Verwaltung; Demo-Inhalte koennen sichtbar, aber nicht verifiziert sein.';
