-- =====================================================================
-- Fix: pruefung_abgeben scheitert mit "record pf is not assigned yet"
--
-- Ursache: Die Loop-Variable `pf` kollidiert mit dem Tabellen-Alias `pf`
-- im FOR-SELECT. PL/pgSQL ersetzt `pf.frage_id` als Feldzugriff auf die
-- (noch unassigned) Record-Variable und bricht ab — jede Abgabe scheitert.
-- =====================================================================

create or replace function pruefung_abgeben(p_ergebnis_id uuid, p_antworten jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid   uuid := auth.uid();
  v_pruef uuid;
  v_mc_erreicht numeric := 0;
  v_mc_max      numeric := 0;
  v_ft_offen    int := 0;
  v_ft_max      numeric := 0;
  v_norm  numeric;
  v_note  smallint;
  v_grenze numeric;
  v_stufen jsonb;
  a       jsonb;
  r       record;
  v_korrekt boolean;
  v_erreicht numeric;
begin
  if v_uid is null then raise exception 'nicht angemeldet'; end if;
  select pruefung_id into v_pruef from pruefung_ergebnisse
   where id = p_ergebnis_id and user_id = v_uid and abgegeben_am is null;
  if v_pruef is null then raise exception 'ergebnis_unbekannt_oder_abgegeben'; end if;

  for r in
    select pq.frage_id, pq.punkte, f.typ
      from pruefung_fragen pq
      join fragen f on f.id = pq.frage_id
     where pq.pruefung_id = v_pruef
  loop
    a := null;
    select value into a from jsonb_array_elements(coalesce(p_antworten,'[]'::jsonb)) value
      where value->>'frage_id' = r.frage_id::text limit 1;

    if r.typ = 'mc' then
      v_mc_max := v_mc_max + r.punkte;
      v_korrekt := false;
      if a is not null and (a->>'option_id') is not null then
        select coalesce(ist_korrekt, false) into v_korrekt from antwortoptionen
          where id = (a->>'option_id')::uuid and frage_id = r.frage_id;
        v_korrekt := coalesce(v_korrekt, false);
      end if;
      v_erreicht := case when v_korrekt then r.punkte else 0 end;
      v_mc_erreicht := v_mc_erreicht + v_erreicht;
      insert into versuche (user_id, frage_id, pruefung_ergebnis_id, antwort, antwort_sprache, ist_korrekt, erzielte_punkte)
      values (v_uid, r.frage_id, p_ergebnis_id,
              jsonb_build_object('option_id', a->>'option_id'), 'de', v_korrekt, v_erreicht);
    else
      v_ft_max := v_ft_max + r.punkte;
      v_ft_offen := v_ft_offen + 1;
      insert into versuche (user_id, frage_id, pruefung_ergebnis_id, antwort, antwort_sprache, ist_korrekt, erzielte_punkte)
      values (v_uid, r.frage_id, p_ergebnis_id,
              jsonb_build_object('text', a->>'text'), 'de', null, null);
    end if;
  end loop;

  if v_ft_offen = 0 then
    select b.stufen, b.bestehensgrenze into v_stufen, v_grenze
      from berufe be join bewertungsschluessel b on b.id = be.bewertungsschluessel_id
      join kohorten k on k.beruf_id = be.id
      join pruefungen p on p.kohorte_id = k.id where p.id = v_pruef;
    v_norm := case when (v_mc_max + v_ft_max) > 0
                   then round(100.0 * v_mc_erreicht / (v_mc_max + v_ft_max), 1) else 0 end;
    if v_stufen is not null then
      select (s->>'note')::smallint into v_note from jsonb_array_elements(v_stufen) s
        where v_norm >= (s->>'von')::numeric and v_norm <= (s->>'bis')::numeric limit 1;
    end if;
    update pruefung_ergebnisse set
      mc_punkte = v_mc_erreicht, freitext_punkte = 0, gesamtpunkte = v_norm,
      note = v_note, bestanden = (v_norm >= coalesce(v_grenze,50)),
      abgegeben_am = now(), updated_at = now()
    where id = p_ergebnis_id;
  else
    update pruefung_ergebnisse set
      mc_punkte = v_mc_erreicht, freitext_punkte = null, gesamtpunkte = null,
      note = null, bestanden = null, abgegeben_am = now(), updated_at = now()
    where id = p_ergebnis_id;
  end if;

  return jsonb_build_object(
    'mc_erreicht', v_mc_erreicht, 'mc_max', v_mc_max,
    'freitext_ausstehend', v_ft_offen, 'freitext_max', v_ft_max,
    'gesamt', case when v_ft_offen=0 then v_norm else null end,
    'note', v_note, 'bestanden', case when v_ft_offen=0 then (v_norm >= coalesce(v_grenze,50)) else null end
  );
end $$;

revoke all on function pruefung_abgeben(uuid, jsonb) from public;
grant execute on function pruefung_abgeben(uuid, jsonb) to authenticated;
