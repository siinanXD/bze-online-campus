# Edge Function `berichtsheft-pdf` (AP-18)

Erzeugt den Export des Ausbildungsnachweises für die Prüfungsanmeldung (Spec §5
`berichtsheft_pdf`). Jedes Blatt trägt **Name, Ausbildungsjahr und Berichts­zeitraum**.

Bewusst **ohne schwere PDF-Bibliothek**: Die Function liefert sauber paginiertes,
druckfertiges **HTML** (`@media print`, Seitenumbruch je Blatt, Unterschriften­zeilen).
Der Client öffnet es und wählt „Als PDF speichern/drucken". Das hält das Bundle
klein und funktioniert auch auf älteren Android-Geräten (Spec §0). Die Antwort trägt
`Content-Type: text/html` und `Content-Disposition: inline`.

## Zugriff

Der **Nutzer-Client** (JWT) wird verwendet, damit die RLS entscheidet: Teilnehmer
sehen nur eigene Nachweise, Ausbilder/Verwaltung/Admin die der betreuten
Teilnehmer. Unberechtigte Zugriffe liefern schlicht ein leeres Dokument.

## Anfrage

```
POST /functions/v1/berichtsheft-pdf
Authorization: Bearer <JWT>
Content-Type: application/json

{ "user_id": "<uuid, optional – Standard: eigener Nutzer>",
  "nachweis_id": "<uuid, optional – nur ein Blatt>" }
```

Ohne Felder wird der Gesamtexport des angemeldeten Nutzers erzeugt.

## Antwort (200)

`text/html` (druckfertig). Beispiel-Header:

```
Content-Type: text/html; charset=utf-8
Content-Disposition: inline; filename="ausbildungsnachweis_<benutzername>.html"
```

## Umgebungsvariablen

`SUPABASE_URL`, `SUPABASE_ANON_KEY`.

## Lokal testen

```
supabase functions serve berichtsheft-pdf --env-file supabase/.env.local
```
