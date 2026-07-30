-- Erlaubt der Supabase Data API die bestehenden Auth-/Rollen-Abfragen.
-- RLS bleibt die eigentliche Autorisierung; ohne Grants kommen Browser- und
-- SSR-Clients jedoch gar nicht bis zur Policy-Pruefung.

grant select, update on table profiles to authenticated;
grant select on table kohorten to authenticated;
grant select, insert, delete on table kohorten_mitglieder to authenticated;
