-- AP-09 — Freitext-Bewertung: Cache + Abschluss der Prüfung nach KI/Ausbilder-Bewertung
-- Spec §5 bewerte_freitext, §4.4 Punkte/Note

-- ---------------------------------------------------------------------
-- Cache: Hash aus frage_id + normalisierter Antwort → Bewertungs-JSON
-- ---------------------------------------------------------------------
create table if not exists freitext_bewertung_cache (
  id              uuid primary key default gen_random_uuid(),
  frage_id        uuid not null references fragen(id) on delete cascade,
  antwort_hash    text not null,
  bewertung       jsonb not null,
  confidence      numeric not null,
  modell          text,
  created_at      timestamptz not null default now(),
  unique (frage_id, antwort_hash)
);

alter table freitext_bewertung_cache enable row level security;

-- Lesen/Schreiben nur über Service-Role (Edge Function). Keine Client-Policies.
create policy fbc_admin_read on freitext_bewertung_cache
  for select using (app_is_admin());

create index if not exists freitext_bewertung_cache_frage_idx
  on freitext_bewertung_cache (frage_id);

-- ---------------------------------------------------------------------
-- Prüfung abschließen, sobald alle Freitext-Versuche bewertet sind
-- (vom Edge Function / Ausbilder-Review nach Setzen von erzielte_punkte)
-- ---------------------------------------------------------------------
create or replace function pruefung_freitext_abschliessen(p_ergebnis_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid    uuid;
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
  select user_id, pruefung_id, mc_punkte
    into v_uid, v_pruef, v_mc
  from pruefung_ergebnisse
  where id = p_ergebnis_id;

  if v_pruef is null then
    raise exception 'ergebnis_unbekannt';
  end if;

  -- Noch offene Freitext-Versuche?
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
  where pf.pruefung_id = v_pruef and f.typ = 'mc';

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
    where v_norm >= (s->>'von')::numeric and v_norm <= (s->>'bis')::numeric
    limit 1;
  end if;

  update pruefung_ergebnisse set
    freitext_punkte = v_ft,
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
