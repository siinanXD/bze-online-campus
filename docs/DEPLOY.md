# Deployment für einen Testbetrieb

Ziel dieser Anleitung: eine erreichbare Umgebung, in der Testkunden — Ausbilder
des Trägers, einzelne Teilnehmende — die Anwendung unter echten Bedingungen
bedienen können. Zwei Teile, die unabhängig voneinander sind: die Datenhaltung
liegt immer bei Supabase, die Anwendung selbst kann bei Netlify oder Railway
laufen.

> Die Tarifangaben unten sind Stand der Projektdokumentation und **vor dem
> Buchen beim Anbieter zu prüfen**. Was zählt, ist die Struktur der Kosten, nicht
> der Cent-Betrag.

## Welche Plattform

| | Netlify Free | Railway Hobby |
|---|---|---|
| Kosten | 0 € | Grundgebühr mit enthaltenem Nutzungsguthaben, danach nach Verbrauch |
| Betriebsart | Serverless: jede Anfrage startet eine Function | Ein durchlaufender Container |
| Region der Serverfunktionen | vorbelegt USA; freie Regionswahl ist ein bezahltes Merkmal | frei wählbar, EU (Amsterdam) verfügbar |
| Kaltstarts | ja, nach Leerlauf spürbar | nein, solange der Container läuft |
| Aufwand | Repository verbinden, fertig | Dockerfile ist vorhanden, Region und Variablen setzen |

**Die Entscheidung hängt nicht am Preis, sondern an den Daten:**

- **Testdaten, erfundene Namen, kein echter Teilnehmerbestand** → Netlify Free.
  Kostet nichts, ist in zehn Minuten online, Vorschau-Deploys pro Branch
  inklusive.
- **Echte Teilnehmende mit echten Namen und Lernständen** → Railway in der
  EU-Region. Die Datenbank liegt ohnehin in `eu-central-1`; bei Netlify Free
  würden die Server-Renderings diese Daten in den USA verarbeiten. Das ist eine
  Übermittlung in ein Drittland, die man für einen Bildungsträger mit
  Auftragsverarbeitungsvertrag nicht nebenbei mitnimmt. Die Differenz von
  wenigen Euro im Monat ist der günstigste Teil dieser Frage.

Vercel, wie im README als Zielbetrieb genannt, ist für den Testbetrieb keine
Option: der kostenlose Tarif ist auf nichtkommerzielle Nutzung beschränkt, und
ein Pilot für einen zahlenden Träger fällt nicht darunter.

## Schritt 1 — Supabase (beide Wege gleich)

1. Projekt auf <https://supabase.com> anlegen, **Region `eu-central-1`
   (Frankfurt)**, Tarif Free. Datenbankpasswort sicher ablegen.
2. Lokales Repository mit dem Projekt verbinden und das Schema hochschieben:

   ```bash
   supabase login
   supabase link --project-ref <projekt-ref>
   supabase db push                 # spielt supabase/migrations/* ein
   ```

3. Seed einspielen (`db push` fasst den Seed nicht an):

   ```bash
   psql "<Connection-String aus Project Settings → Database>" \
     -f supabase/seed/0001_maf_seed.sql
   ```

4. Edge Functions veröffentlichen und ihre Geheimnisse setzen — diese Werte
   liegen ausschließlich hier, nie im Anwendungsprojekt:

   ```bash
   supabase functions deploy
   supabase secrets set LLM_API_KEY=... LLM_BASE_URL=... LLM_MODELL=... \
                        VAPID_PRIVATE_KEY=... VAPID_SUBJECT=mailto:... \
                        CRON_SECRET=<zufaellig>
   ```

   Für einen Test ohne LLM-Kosten stattdessen `supabase secrets set LLM_MOCK=1`.
   Dann rechnen Freitextbewertung und Wochenbericht mit einer Heuristik.

5. Auth einstellen (Authentication → URL Configuration): **Site URL** auf die
   spätere Adresse, Selbstregistrierung ausgeschaltet. Zugänge legt die
   Verwaltung an (Spec §6.2.1).
6. Zeitplan für Wochenbericht und Erinnerungen: die fertigen `cron.schedule`-
   Aufrufe stehen als Kommentar am Ende von `0010_wochenbericht.sql` und
   `0014_push.sql`. Auf der gehosteten Instanz sind `pg_cron` und `pg_net`
   verfügbar; das `CRON_SECRET` von oben muss dabei zum Header passen.
7. VAPID-Paar erzeugen, falls noch keins existiert:
   `npx web-push generate-vapid-keys`. Der öffentliche Schlüssel gehört ins
   Anwendungsprojekt, der private in die Supabase-Secrets.

**Zum Free-Tarif:** Projekte werden nach längerer Inaktivität pausiert und
müssen von Hand aufgeweckt werden. Für einen Test ist das verkraftbar — wenn
Testkunden aber an einem Montagmorgen ohne dich davorsitzen sollen, vorher
einmal aufrufen.

## Schritt 2a — Netlify

1. Netlify → *Add new site* → Repository verbinden. `netlify.toml` im
   Wurzelverzeichnis legt Buildbefehl, Node 22 und pnpm bereits fest; das
   Next.js-Runtime-Plugin installiert Netlify selbst.
2. Umgebungsvariablen setzen (*Site configuration → Environment variables*):

   | Variable | Wert |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Projekt-Origin, **ohne** `/rest/v1` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon- bzw. publishable key |
   | `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | öffentlicher VAPID-Schlüssel |
   | `NEXT_PUBLIC_DEFAULT_LOCALE` | `de` |
   | `NEXT_PUBLIC_ROBOTS` | `noindex` für die Testumgebung |

   `SUPABASE_SERVICE_ROLE_KEY` und `LLM_API_KEY` gehören **nicht** hierher —
   sie leben in den Supabase-Secrets.
3. Deploy auslösen. Danach die Netlify-Adresse als *Site URL* in Supabase
   nachtragen.

## Schritt 2b — Railway

1. Railway → *New Project* → *Deploy from GitHub repo*. `railway.json` wählt den
   `Dockerfile`-Build und prüft die Erreichbarkeit über `/de`.
2. **Region auf Europa stellen** (Service → Settings → Region, z. B. Amsterdam).
   Das ist der Grund, diesen Weg zu gehen — nicht vergessen.
3. Variablen setzen: dieselbe Liste wie bei Netlify. Zusätzlich zu beachten:
   `NEXT_PUBLIC_*` wird **beim Bauen** in das Browser-Bundle geschrieben. Damit
   das Dockerfile sie erhält, müssen sie als Build-Argument ankommen:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...        # als Variable UND als Build-Arg
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
   NEXT_PUBLIC_ROBOTS=noindex
   ```

   Kommen sie nur zur Laufzeit an, startet die Anwendung, aber der Browser-Client
   hat kein Supabase-Ziel und jede Anmeldung scheitert.
4. Domain erzeugen lassen (*Settings → Networking → Generate Domain*) und in
   Supabase als *Site URL* eintragen.
5. Kosten begrenzen: *App Sleeping* aktivieren, damit der Container in Ruhephasen
   nicht abgerechnet wird, und ein Ausgabenlimit setzen. Ein Testbetrieb mit
   einer Handvoll Nutzern bleibt damit im enthaltenen Guthaben.

Lokal lässt sich derselbe Container prüfen:

```bash
docker build -t bze \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon> .
docker run -p 3000:3000 bze
```

## Schritt 3 — Zugänge für die Testkunden

Es gibt keine Selbstregistrierung. Der erste Admin entsteht per SQL genau wie
lokal — der vollständige Befehl steht in
[`LOKAL-EINRICHTEN.md`](LOKAL-EINRICHTEN.md), nur gegen den Connection-String des
gehosteten Projekts. Danach entstehen alle weiteren Nutzer über den
Admin-Bereich der Anwendung, die dafür `nutzer-anlegen` mit dem Service-Role-Key
in der Edge Function verwendet.

Sinnvoll für einen Test: ein Ausbilder, zwei bis drei Teilnehmende, eine Kohorte.
Alle Konten starten mit `muss_passwort_aendern = true`, der Wechsel wird beim
ersten Login erzwungen.

## Vor dem ersten Zugriff durchgehen

- [ ] `NEXT_PUBLIC_ROBOTS=noindex` gesetzt, `/robots.txt` liefert `Disallow: /`
- [ ] Kein `service_role`-Schlüssel in den Variablen der Anwendung — nur in
      Supabase
- [ ] Selbstregistrierung in Supabase aus
- [ ] Impressum und Datenschutzerklärung mit echten Angaben gefüllt (`/de/impressum`,
      `/de/datenschutz`) — bei einem öffentlich erreichbaren Angebot Pflicht
- [ ] **Migration `0003_demo_freigabe.sql` bewusst behandeln.** Sie gibt 15
      maschinell erzeugte, fachlich unverifizierte Fragen frei, damit der
      Lernmodus etwas zu zeigen hat. Für einen Test mit Prüflingen entweder
      zurücknehmen oder die Testkunden ausdrücklich darauf hinweisen: falsch
      Gelerntes bleibt hängen.
- [ ] `LLM_MOCK=1` oder ein Monatsbudget in den Trägereinstellungen — sonst
      läuft die KI-Bewertung auf deine Rechnung
- [ ] Ein Durchlauf auf einem echten Android-Handy: installieren, Netz trennen,
      Frage beantworten, Netz wieder an, prüfen ob die Antwort ankommt
- [ ] Push nur nach ausdrücklicher Zustimmung im Profil — kein Vorbelegen

## Was der Testbetrieb kostet

| Posten | Free-Weg | EU-Weg |
|---|---|---|
| Anwendung | Netlify Free: 0 € | Railway Hobby: Grundgebühr, Verbrauch im Guthaben |
| Datenbank, Auth, Functions | Supabase Free: 0 € | Supabase Free: 0 € |
| LLM | 0 € mit `LLM_MOCK=1` | 0 € mit `LLM_MOCK=1`, sonst nach Nutzung |
| Push | 0 € (VAPID, eigener Versand) | 0 € |

Der wahrscheinlichste unerwartete Posten ist nicht die Plattform, sondern der
LLM-Anbieter: Freitextbewertung und Wochenberichte laufen pro Teilnehmer und
Woche. Deshalb protokolliert jede Function ihre Aufrufe in `ki_aufrufe` und
prüft das Monatsbudget des Trägers, bevor sie etwas sendet.
