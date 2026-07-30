# Lokal einrichten

Diese Anleitung beschreibt den vollständigen Weg von einem frischen Klon bis zu
einer angemeldeten Sitzung im Campus. Reihenfolge einhalten — jeder Schritt baut
auf dem vorigen auf.

## 1 — Voraussetzungen

| Werkzeug | Version | Wofür |
|---|---|---|
| Node | ≥ 22 | Die CI läuft auf 22; der Test-Runner braucht Glob-Unterstützung. |
| pnpm | 9.7 | Wird über `packageManager` in der `package.json` festgelegt (`corepack enable`). |
| Docker | aktuell, laufend | Die lokale Supabase-Instanz besteht aus Containern. |
| Supabase CLI | ≥ 2.0 | `brew install supabase/tap/supabase` oder `npm i -g supabase`. |
| Python | ≥ 3.12 | Nur für `pnpm seed:generate` und `pnpm lint:py`. |

## 2 — Ohne Datenbank starten

Für einen ersten Blick auf Landing Page und Designsystem braucht es kein
Supabase:

```bash
pnpm install
pnpm dev            # http://localhost:3000/de
```

Erreichbar sind ohne Anmeldung nur die öffentlichen Pfade: `/de`, `/de/login`,
`/de/showcase`, `/de/impressum`, `/de/datenschutz`. Alles andere leitet die
Middleware auf `/de/login` um — solange keine Supabase-Zugangsdaten hinterlegt
sind, ist ein Login nicht möglich. Das ist gewolltes Verhalten und kein Fehler:
ohne gültige Umgebungswerte findet gar kein Auth-Roundtrip statt
(`middleware.ts`).

## 3 — Supabase lokal hochziehen

```bash
supabase start      # startet Postgres, Auth, Storage, Studio, Mail-Catcher
supabase db reset   # spielt supabase/migrations/* und supabase/seed/* ein
```

`supabase start` gibt am Ende die lokalen Werte aus, die in die `.env.local`
gehören — insbesondere `API URL` (`http://127.0.0.1:54321`), `anon key` und
`service_role key`. Studio liegt auf <http://127.0.0.1:54323>, ausgehende Mails
landen im Catcher auf <http://127.0.0.1:54324>.

```bash
cp .env.example .env.local
```

Danach ausfüllen:

| Variable | Woher | Pflicht |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Ausgabe von `supabase start` → *API URL*. Nur die Origin, **kein** `/rest/v1`. | ja |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ausgabe von `supabase start` → *anon key*. | ja |
| `SUPABASE_SERVICE_ROLE_KEY` | Ausgabe von `supabase start` → *service_role key*. Nur für Edge Functions, nie im Client. | nur für Functions |
| `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODELL` | Beim eigenen LLM-Anbieter. Für die Erprobung stattdessen `LLM_MOCK=1` setzen — dann rechnet eine Heuristik ohne externen Aufruf. | nein |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` | `npx web-push generate-vapid-keys` — der private Schlüssel bleibt serverseitig. | nur für Push |
| `VAPID_SUBJECT` | Eigene Kontaktadresse als `mailto:`. | nur für Push |

Gegen ein gehostetes Supabase-Projekt statt lokal: URL und anon key stehen dort
unter *Project Settings → API*, der service_role key ebenfalls (und gehört
ausschließlich in die Function-Secrets, nicht in die `.env.local` eines Clients).

`.env.local` ist über `.gitignore` ausgeschlossen und darf nie eingecheckt
werden.

## 4 — Ersten Zugang anlegen

Die Anwendung kennt bewusst **keine Selbstregistrierung**: Zugänge legt die
Verwaltung an (Spec §6.2.1), technisch über die Edge Function `nutzer-anlegen`
mit dem Service-Role-Key. Für den ersten Admin gibt es diesen Weg noch nicht —
er wird einmalig direkt in der lokalen Datenbank erzeugt. Benutzernamen werden
intern auf `<benutzername>@campus.bze` abgebildet
(`app/[locale]/(auth)/lib/benutzername.ts`).

```sql
-- psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres"
insert into auth.users (id, instance_id, aud, role, email, encrypted_password,
                        email_confirmed_at, created_at, updated_at)
values (gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated', 'admin@campus.bze',
        crypt('bitte-aendern', gen_salt('bf')), now(), now(), now())
returning id;

-- Die zurückgegebene id unten einsetzen. traeger_id ist der geseedete Träger BZE.
insert into profiles (id, traeger_id, benutzername, rolle, muss_passwort_aendern)
values ('<id-von-oben>',
        (select id from traeger where slug = 'bze'),
        'admin', 'admin', false);
```

Anmelden dann auf `/de/login` mit Benutzername `admin` und dem gesetzten
Passwort. Weitere Nutzer entstehen danach über den Admin-Bereich.

Solche Hilfs-SQL mit Klartextpasswörtern gehört nicht ins Repository — die
`.gitignore` schließt `*.local.sql` deshalb aus.

## 5 — Prüfen, dass alles läuft

```bash
pnpm typecheck
pnpm lint
pnpm test              # Unit + Integration, ohne Datenbank
pnpm lint:py           # nur bei Änderungen an scripts/
```

E2E braucht eine laufende Anwendung; ohne `E2E_BASE_URL` überspringen sich die
Tests selbst:

```bash
E2E_BASE_URL=http://localhost:3000 pnpm test:e2e
```

Service Worker, Installierbarkeit und Offline-Verhalten sind erst im
Produktionsbuild sinnvoll zu prüfen:

```bash
pnpm build && pnpm start
```

## 6 — Edge Functions lokal

```bash
supabase functions serve bewerte-freitext --env-file .env.local
```

Die Functions lesen ihre Geheimnisse aus der Umgebung, nicht aus dem Client.
Mit `LLM_MOCK=1` laufen alle LLM-Pfade ohne externen Anbieter, mit
nachvollziehbarem Ergebnis. Jeder echte Aufruf wird in `ki_aufrufe`
protokolliert und gegen das Monatsbudget des Trägers geprüft. Cron-getriebene
Functions (`sende-erinnerungen`, `erzeuge-wochenbericht`) erwarten den Header
`x-cron-secret`; die jeweilige README neben der Function beschreibt Aufruf und
Nutzlast.

## 7 — Seed neu erzeugen

Der Seed ist generiert, nicht handgeschrieben: aus den Fragenpool-JSON-Dateien
unter `supabase/seed/` entstehen deterministische UUIDs (uuid5), damit der Seed
idempotent bleibt.

```bash
pnpm seed:generate     # schreibt supabase/seed/0001_maf_seed.sql
python3 scripts/pruefe_fragenpool.py    # Plausibilitätsprüfung der Pools
```

Alle Fragen kommen im Status `entwurf` in die Datenbank. Nur Migration `0003`
gibt für die Erprobung eine kleine, zahlenwertfreie Auswahl frei — vor echtem
Einsatz ist diese Freigabe zurückzunehmen (Kommentar in der Migration).

## Häufige Stolpersteine

- **Alles leitet auf `/de/login` um.** `.env.local` fehlt oder die Werte sind
  leer. Nach dem Ändern der Datei den Dev-Server neu starten.
- **`NEXT_PUBLIC_SUPABASE_URL` mit `/rest/v1` am Ende.** Die Middleware räumt
  das notdürftig auf, der Browser-Client nicht — nur die Origin eintragen.
- **`supabase start` scheitert an Ports.** 54321–54324 werden belegt; andere
  Supabase-Projekte vorher mit `supabase stop` beenden.
- **Login schlägt trotz Nutzer fehl.** Fehlt die `profiles`-Zeile zum
  Auth-User, kennt die Middleware keine Rolle und leitet zurück auf `/login`.
- **Service Worker zeigt alte Inhalte.** Im Dev-Modus nicht aktiv; nach einem
  `pnpm build` in DevTools → Application → Service Workers abmelden.
