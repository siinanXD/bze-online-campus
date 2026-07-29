-- =====================================================================
-- BZE Online Campus — Migration 0012 (AP-16): LLM-Betriebsüberwachung
-- Additiv. Spec §6.4 Screen 26 — Kosten pro Tag/Woche/Monat, nach
-- Funktion/Träger/Kohorte, Top-Nutzer, Budgetgrenzen, Cache-Trefferquote,
-- Fehlerquote, p95-Latenz.
--
-- ARCHITEKTUR
-- Alle Aggregationen laufen als *SECURITY INVOKER* SQL-Funktionen. Dadurch
-- gilt die RLS von `ki_aufrufe` (Policy `ki_read`, Migration 0001) für den
-- Aufrufer: Admin sieht alles, Verwaltung ausschließlich den eigenen Träger.
-- Es wird bewusst KEIN service_role und KEIN security definer verwendet, damit
-- der Zugriffsschutz nicht in Anwendungscode wandert (AGENTS.md §2).
--
-- CACHE-HEURISTIK
-- `ki_aufrufe` besitzt kein explizites `aus_cache`-Flag. Ein Cache-Treffer
-- wird über die von den Edge Functions geschriebenen Werte erkannt: ein
-- erfolgreicher Aufruf ohne Kosten und ohne Token, dessen Modell nicht der
-- Mock-Pfad ist. Das ist eine dokumentierte Schätzung (siehe DATENMODELL.md),
-- keine exakte Messung — daher wird die Kennzahl in der Oberfläche als
-- Schätzung ausgewiesen.
-- =====================================================================

-- Zeitfenster wird immer halboffen interpretiert: [p_von, p_bis).

-- ---------------------------------------------------------------------
-- Kennzahlen für ein Zeitfenster (eine Zeile): Aufrufe, Fehler,
-- Cache-Treffer, Kosten, p95-/Durchschnittslatenz.
-- ---------------------------------------------------------------------
create or replace function ki_kennzahlen(
  p_von      timestamptz,
  p_bis      timestamptz,
  p_funktion text default null
)
returns table (
  aufrufe        bigint,
  fehler         bigint,
  cache_treffer  bigint,
  kosten_eur     numeric,
  p95_latenz_ms  int,
  avg_latenz_ms  int
)
language sql
stable
set search_path = public
as $$
  select
    count(*)::bigint,
    count(*) filter (where erfolg is not true)::bigint,
    count(*) filter (
      where erfolg is true
        and coalesce(kosten_eur, 0) = 0
        and coalesce(input_tokens, 0) = 0
        and coalesce(output_tokens, 0) = 0
        and modell is not null
        and modell not ilike 'mock%'
    )::bigint,
    coalesce(sum(kosten_eur), 0)::numeric,
    coalesce(
      percentile_cont(0.95) within group (order by latenz_ms)
        filter (where latenz_ms is not null),
      0
    )::int,
    coalesce(avg(latenz_ms) filter (where latenz_ms is not null), 0)::int
  from ki_aufrufe
  where created_at >= p_von
    and created_at <  p_bis
    and (p_funktion is null or funktion = p_funktion);
$$;

-- ---------------------------------------------------------------------
-- Zeitreihe der Kosten je Tag / Woche / Monat (p_granularitaet: 'tag'
-- | 'woche' | 'monat'). Buckets ohne Aufrufe fehlen bewusst — die
-- Oberfläche stellt die vorhandenen Buckets dar.
-- ---------------------------------------------------------------------
create or replace function ki_trend(
  p_von           timestamptz,
  p_bis           timestamptz,
  p_granularitaet text default 'tag',
  p_funktion      text default null
)
returns table (
  bucket        timestamptz,
  aufrufe       bigint,
  fehler        bigint,
  cache_treffer bigint,
  kosten_eur    numeric
)
language sql
stable
set search_path = public
as $$
  select
    date_trunc(
      case p_granularitaet
        when 'monat' then 'month'
        when 'woche' then 'week'
        else 'day'
      end,
      created_at
    ) as bucket,
    count(*)::bigint,
    count(*) filter (where erfolg is not true)::bigint,
    count(*) filter (
      where erfolg is true
        and coalesce(kosten_eur, 0) = 0
        and coalesce(input_tokens, 0) = 0
        and coalesce(output_tokens, 0) = 0
        and modell is not null
        and modell not ilike 'mock%'
    )::bigint,
    coalesce(sum(kosten_eur), 0)::numeric
  from ki_aufrufe
  where created_at >= p_von
    and created_at <  p_bis
    and (p_funktion is null or funktion = p_funktion)
  group by 1
  order by 1;
$$;

-- ---------------------------------------------------------------------
-- Kosten je Funktion im Zeitfenster.
-- ---------------------------------------------------------------------
create or replace function ki_nach_funktion(
  p_von timestamptz,
  p_bis timestamptz
)
returns table (
  funktion   text,
  aufrufe    bigint,
  fehler     bigint,
  kosten_eur numeric
)
language sql
stable
set search_path = public
as $$
  select
    funktion,
    count(*)::bigint,
    count(*) filter (where erfolg is not true)::bigint,
    coalesce(sum(kosten_eur), 0)::numeric
  from ki_aufrufe
  where created_at >= p_von
    and created_at <  p_bis
  group by funktion
  order by coalesce(sum(kosten_eur), 0) desc, count(*) desc;
$$;

-- ---------------------------------------------------------------------
-- Kosten je Träger im Zeitfenster (Verwaltung sieht via RLS nur den
-- eigenen Träger).
-- ---------------------------------------------------------------------
create or replace function ki_nach_traeger(
  p_von      timestamptz,
  p_bis      timestamptz,
  p_funktion text default null
)
returns table (
  traeger_id uuid,
  name       text,
  aufrufe    bigint,
  fehler     bigint,
  kosten_eur numeric
)
language sql
stable
set search_path = public
as $$
  select
    a.traeger_id,
    t.name,
    count(*)::bigint,
    count(*) filter (where a.erfolg is not true)::bigint,
    coalesce(sum(a.kosten_eur), 0)::numeric
  from ki_aufrufe a
  left join traeger t on t.id = a.traeger_id
  where a.created_at >= p_von
    and a.created_at <  p_bis
    and (p_funktion is null or a.funktion = p_funktion)
  group by a.traeger_id, t.name
  order by coalesce(sum(a.kosten_eur), 0) desc;
$$;

-- ---------------------------------------------------------------------
-- Kosten je Kohorte im Zeitfenster. Mehrfachmitgliedschaften eines
-- Nutzers können Kosten mehreren Kohorten zurechnen (dokumentiert).
-- ---------------------------------------------------------------------
create or replace function ki_nach_kohorte(
  p_von      timestamptz,
  p_bis      timestamptz,
  p_funktion text default null
)
returns table (
  kohorte_id  uuid,
  bezeichnung text,
  aufrufe     bigint,
  kosten_eur  numeric
)
language sql
stable
set search_path = public
as $$
  select
    k.id,
    k.bezeichnung,
    count(*)::bigint,
    coalesce(sum(a.kosten_eur), 0)::numeric
  from ki_aufrufe a
  join kohorten_mitglieder km on km.user_id = a.user_id
  join kohorten k            on k.id = km.kohorte_id
  where a.created_at >= p_von
    and a.created_at <  p_bis
    and (p_funktion is null or a.funktion = p_funktion)
  group by k.id, k.bezeichnung
  order by coalesce(sum(a.kosten_eur), 0) desc;
$$;

-- ---------------------------------------------------------------------
-- Nutzer mit den höchsten Kosten im Zeitfenster (Top-N, Spec: Top 20).
-- Namen via LEFT JOIN — falls RLS auf profiles einen Namen verbirgt,
-- bleibt die Kostenzeile (user_id) trotzdem sichtbar.
-- ---------------------------------------------------------------------
create or replace function ki_top_nutzer(
  p_von      timestamptz,
  p_bis      timestamptz,
  p_funktion text default null,
  p_limit    int default 20
)
returns table (
  user_id      uuid,
  benutzername text,
  vorname      text,
  nachname     text,
  aufrufe      bigint,
  fehler       bigint,
  kosten_eur   numeric
)
language sql
stable
set search_path = public
as $$
  select
    a.user_id,
    p.benutzername,
    p.vorname,
    p.nachname,
    count(*)::bigint,
    count(*) filter (where a.erfolg is not true)::bigint,
    coalesce(sum(a.kosten_eur), 0)::numeric
  from ki_aufrufe a
  left join profiles p on p.id = a.user_id
  where a.created_at >= p_von
    and a.created_at <  p_bis
    and a.user_id is not null
    and (p_funktion is null or a.funktion = p_funktion)
  group by a.user_id, p.benutzername, p.vorname, p.nachname
  order by coalesce(sum(a.kosten_eur), 0) desc, count(*) desc
  limit greatest(1, coalesce(p_limit, 20));
$$;

-- ---------------------------------------------------------------------
-- Budgetstatus des laufenden Kalendermonats je Träger. Budget aus
-- traeger.einstellungen->>'monatsbudget_eur' (Migration 0001, Default 200).
-- Träger ohne Aufrufe erscheinen mit 0 Kosten (LEFT JOIN LATERAL).
-- ---------------------------------------------------------------------
create or replace function ki_budget()
returns table (
  traeger_id       uuid,
  name             text,
  budget_eur       numeric,
  kosten_monat_eur numeric
)
language sql
stable
set search_path = public
as $$
  select
    t.id,
    t.name,
    coalesce((t.einstellungen->>'monatsbudget_eur')::numeric, 0) as budget_eur,
    coalesce(k.kosten, 0)                                         as kosten_monat_eur
  from traeger t
  left join lateral (
    select coalesce(sum(a.kosten_eur), 0) as kosten
    from ki_aufrufe a
    where a.traeger_id = t.id
      and a.created_at >= date_trunc('month', now())
  ) k on true
  order by t.name;
$$;

grant execute on function ki_kennzahlen(timestamptz, timestamptz, text)          to authenticated;
grant execute on function ki_trend(timestamptz, timestamptz, text, text)         to authenticated;
grant execute on function ki_nach_funktion(timestamptz, timestamptz)             to authenticated;
grant execute on function ki_nach_traeger(timestamptz, timestamptz, text)        to authenticated;
grant execute on function ki_nach_kohorte(timestamptz, timestamptz, text)        to authenticated;
grant execute on function ki_top_nutzer(timestamptz, timestamptz, text, int)     to authenticated;
grant execute on function ki_budget()                                            to authenticated;
