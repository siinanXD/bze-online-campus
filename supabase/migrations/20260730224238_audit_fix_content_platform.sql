-- =====================================================================
-- BZE Online Campus - Audit-Fixes fuer KI-Content-Plattform
--
-- Additive Korrekturen aus dem Abschlussaudit:
-- - generiere_pruefung ohne temporaere Relation, damit db lint sauber ist
-- - set_updated_at mit festem search_path
-- - Insert-Policies fuer Audit/KI-Protokoll nicht mehr pauschal true
-- - ungenutzte Variable in pruefung_freitext_abschliessen entfernt
-- =====================================================================

create or replace function set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop policy if exists ki_insert on ki_aufrufe;
create policy ki_insert on ki_aufrufe
  for insert
  to authenticated
  with check (
    app_is_admin()
    or (
      user_id = auth.uid()
      and (traeger_id is null or traeger_id = app_traeger())
    )
  );

drop policy if exists audit_insert on audit_log;
create policy audit_insert on audit_log
  for insert
  to authenticated
  with check (
    app_is_admin()
    or akteur_id = auth.uid()
  );

create or replace function generiere_pruefung(
  p_kohorte_id uuid,
  p_jahr       int,
  p_woche      int,
  p_anzahl_mc  int default 30,
  p_anzahl_ft  int default 15
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_beruf uuid;
  v_pruef uuid;
  v_mc int;
  v_ft int;
  v_pos int := 0;
  r record;
begin
  if not (app_is_admin() or app_rolle() in ('ausbilder','verwaltung')) then
    raise exception 'keine_berechtigung';
  end if;

  select beruf_id into v_beruf from kohorten where id = p_kohorte_id;
  if v_beruf is null then
    raise exception 'kohorte_unbekannt';
  end if;

  select id into v_pruef
    from pruefungen
   where kohorte_id = p_kohorte_id
     and jahr = p_jahr
     and kalenderwoche = p_woche;
  if v_pruef is not null then
    return v_pruef;
  end if;

  insert into pruefungen (kohorte_id, jahr, kalenderwoche, titel, status)
  values (p_kohorte_id, p_jahr, p_woche, 'Wochenpruefung KW ' || p_woche, 'geplant')
  returning id into v_pruef;

  for r in
    with pool as (
      select
        f.id,
        f.typ,
        coalesce((
          select count(*)
            from fragen_mastery m
            join kohorten_mitglieder km
              on km.user_id = m.user_id
             and km.kohorte_id = p_kohorte_id
           where m.frage_id = f.id
             and m.status in ('einmal_richtig','falsch')
        ), 0) as schwaeche
      from fragen f
      join themen th on th.id = f.thema_id
      join pruefungsbereiche pb on pb.id = th.pruefungsbereich_id
      where pb.beruf_id = v_beruf
        and f.status = 'freigegeben'
    )
    select id
      from pool
     where typ = 'mc'
     order by (schwaeche > 0) desc, schwaeche desc, md5(id::text || v_pruef::text)
     limit greatest(coalesce(p_anzahl_mc, 0), 0)
  loop
    v_pos := v_pos + 1;
    insert into pruefung_fragen (pruefung_id, frage_id, position, punkte)
    values (v_pruef, r.id, v_pos, 0);
  end loop;

  for r in
    with pool as (
      select
        f.id,
        f.typ,
        coalesce((
          select count(*)
            from fragen_mastery m
            join kohorten_mitglieder km
              on km.user_id = m.user_id
             and km.kohorte_id = p_kohorte_id
           where m.frage_id = f.id
             and m.status in ('einmal_richtig','falsch')
        ), 0) as schwaeche
      from fragen f
      join themen th on th.id = f.thema_id
      join pruefungsbereiche pb on pb.id = th.pruefungsbereich_id
      where pb.beruf_id = v_beruf
        and f.status = 'freigegeben'
    )
    select id
      from pool
     where typ = 'freitext'
     order by (schwaeche > 0) desc, schwaeche desc, md5(id::text || v_pruef::text)
     limit greatest(coalesce(p_anzahl_ft, 0), 0)
  loop
    v_pos := v_pos + 1;
    insert into pruefung_fragen (pruefung_id, frage_id, position, punkte)
    values (v_pruef, r.id, v_pos, 0);
  end loop;

  select count(*) into v_mc
    from pruefung_fragen pf
    join fragen f on f.id = pf.frage_id
   where pf.pruefung_id = v_pruef
     and f.typ = 'mc';

  select count(*) into v_ft
    from pruefung_fragen pf
    join fragen f on f.id = pf.frage_id
   where pf.pruefung_id = v_pruef
     and f.typ = 'freitext';

  if v_mc > 0 then
    update pruefung_fragen pf
       set punkte = round(40.0 / v_mc, 4)
      from fragen f
     where f.id = pf.frage_id
       and pf.pruefung_id = v_pruef
       and f.typ = 'mc';
  end if;

  if v_ft > 0 then
    update pruefung_fragen pf
       set punkte = round(60.0 / v_ft, 4)
      from fragen f
     where f.id = pf.frage_id
       and pf.pruefung_id = v_pruef
       and f.typ = 'freitext';
  end if;

  return v_pruef;
end $$;

revoke all on function generiere_pruefung(uuid,int,int,int,int) from public;
grant execute on function generiere_pruefung(uuid,int,int,int,int) to authenticated;

create or replace function pruefung_freitext_abschliessen(p_ergebnis_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pruef  uuid;
  v_mc     numeric;
  v_mc_max numeric := 0;
  v_ft     numeric := 0;
  v_ft_max numeric := 0;
  v_offen  int;
  v_norm   numeric;
  v_note   smallint;
  v_grenze numeric;
  v_stufen jsonb;
begin
  select pruefung_id, mc_punkte
    into v_pruef, v_mc
    from pruefung_ergebnisse
   where id = p_ergebnis_id;

  if v_pruef is null then
    raise exception 'ergebnis_unbekannt';
  end if;

  select count(*) into v_offen
    from versuche v
    join fragen f on f.id = v.frage_id
   where v.pruefung_ergebnis_id = p_ergebnis_id
     and f.typ = 'freitext'
     and v.erzielte_punkte is null;

  if v_offen > 0 then
    return jsonb_build_object('fertig', false, 'offen', v_offen);
  end if;

  select coalesce(sum(pf.punkte), 0) into v_mc_max
    from pruefung_fragen pf
    join fragen f on f.id = pf.frage_id
   where pf.pruefung_id = v_pruef
     and f.typ = 'mc';

  select coalesce(sum(v.erzielte_punkte), 0), coalesce(sum(pf.punkte), 0)
    into v_ft, v_ft_max
    from versuche v
    join fragen f on f.id = v.frage_id
    join pruefung_fragen pf on pf.frage_id = v.frage_id and pf.pruefung_id = v_pruef
   where v.pruefung_ergebnis_id = p_ergebnis_id
     and f.typ = 'freitext';

  select b.stufen, b.bestehensgrenze into v_stufen, v_grenze
    from berufe be
    join bewertungsschluessel b on b.id = be.bewertungsschluessel_id
    join kohorten k on k.beruf_id = be.id
    join pruefungen p on p.kohorte_id = k.id
   where p.id = v_pruef;

  v_norm := case
    when (v_mc_max + v_ft_max) > 0
      then round(100.0 * (coalesce(v_mc, 0) + v_ft) / (v_mc_max + v_ft_max), 1)
    else 0
  end;

  if v_stufen is not null then
    select (s->>'note')::smallint into v_note
      from jsonb_array_elements(v_stufen) s
     where v_norm >= (s->>'von')::numeric
       and v_norm <= (s->>'bis')::numeric
     limit 1;
  end if;

  update pruefung_ergebnisse
     set freitext_punkte = v_ft,
         gesamtpunkte = v_norm,
         note = v_note,
         bestanden = (v_norm >= coalesce(v_grenze, 50)),
         updated_at = now()
   where id = p_ergebnis_id;

  return jsonb_build_object(
    'fertig', true,
    'freitext_punkte', v_ft,
    'freitext_max', v_ft_max,
    'gesamt', v_norm,
    'note', v_note,
    'bestanden', (v_norm >= coalesce(v_grenze, 50))
  );
end $$;

revoke all on function pruefung_freitext_abschliessen(uuid) from public;
grant execute on function pruefung_freitext_abschliessen(uuid) to authenticated;
grant execute on function pruefung_freitext_abschliessen(uuid) to service_role;
