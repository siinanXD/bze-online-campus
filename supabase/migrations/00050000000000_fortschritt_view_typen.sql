-- =====================================================================
-- BZE Online Campus - Pre-AP-10 View-Kompatibilitaet
--
-- 0006 ersetzt v_fortschritt_bereich und castet die Summen explizit auf
-- bigint. Die urspruengliche Definition aus 0002 liefert fuer sum(bigint)
-- jedoch numeric. PostgreSQL erlaubt diese Typaenderung nicht per
-- CREATE OR REPLACE VIEW, deshalb wird die View vor 0006 mit der Zielsignatur
-- neu angelegt. Bestehende Basistabellen und Daten bleiben unveraendert.
-- =====================================================================

drop view if exists v_fortschritt_bereich;

create view v_fortschritt_bereich
with (security_invoker = true) as
select
  ft.user_id,
  th.pruefungsbereich_id,
  sum(ft.kern_gesamt)::bigint  as kern_gesamt,
  sum(ft.kern_fertig)::bigint  as kern_fertig,
  bool_and(ft.thema_fertig)    as bereich_fertig
from v_fortschritt_thema ft
join themen th on th.id = ft.thema_id
group by ft.user_id, th.pruefungsbereich_id;

grant select on v_fortschritt_bereich to authenticated;
