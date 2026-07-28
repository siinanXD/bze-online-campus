-- =====================================================================
-- Migration 0003 — DEMO-Freigabe (NICHT für Produktion ohne Prüfung!)
-- Gibt eine begrenzte Zahl ZAHLENWERTFREIER MC-Fragen frei, damit der
-- Lernmodus (AP-06) live erprobbar ist. Diese Fragen sind KI-generiert und
-- fachlich NICHT verifiziert. Vor echtem Einsatz zurücknehmen:
--   update fragen set status='entwurf', kern=false where quell_ref = any(...);
-- Fragen mit Zahlenwert bleiben bewusst gesperrt (brauchen Tabellenbuch-Fundstelle).
-- =====================================================================
with kandidaten as (
  select id from fragen
   where typ = 'mc' and enthaelt_zahlenwert = false and status = 'entwurf'
   order by quell_ref
   limit 15
)
update fragen f
   set status = 'freigegeben', kern = true, updated_at = now()
  from kandidaten k
 where f.id = k.id;
