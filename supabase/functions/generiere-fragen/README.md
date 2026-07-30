# Edge Function `generiere-fragen` (AP-12)

Erzeugt im Batchbetrieb eigenständig formulierte Fragenentwürfe zu einem Thema
(Spec §5 `generiere_fragen`). Ausgabe **immer** Status `entwurf`.

**Nicht verhandelbar (Spec Grundregeln / CONTRIBUTING.md):**

- Keine Reproduktion geschützter Prüfungsaufgaben von Kammern oder
  Prüfungsverlagen, auch nicht paraphrasiert.
- **Quellenhierarchie hart durchsetzen:** Enthält eine Frage einen Zahlenwert,
  eine Formel, einen Grenzwert oder einen Normbezug und stammt aus Stufe 4 oder
  hat keine Fundstelle → **ablehnen**, gelangt nie in den Kernpool.
- MC: genau vier Optionen, davon genau eine korrekt, plausible Distraktoren, je
  Option eine kurze Erklärung. Freitext: Musterlösung + Bewertungsraster.
- Verpflichtende Felder je Frage: `quellenstufe`, `tabellenbuch_fundstelle`,
  `normbezuege`, `enthaelt_zahlenwert`.

Nur für **Ausbilder / Verwaltung / Admin** (JWT-Rolle).

## Anfrage

```
POST /functions/v1/generiere-fragen
Authorization: Bearer <JWT eines Ausbilders/Admins>
Content-Type: application/json

{
  "thema_id": "…uuid…",
  "anzahl": 5,               // 1..50
  "typ": "mc",              // "mc" | "freitext"
  "schwierigkeit": 2,        // 1..3
  "zielpool": "erweiterung", // "kern" | "erweiterung"
  "quelldokument_id": null   // optional
}
```

## Ablauf (Spec §5)

1. **Generierung** (LLM oder Mock) mit erzwungenem JSON.
2. **Quellenhierarchie** je Frage prüfen — Verstöße werden abgelehnt (`abgelehnt`).
3. **Embedding** erzeugen und **Dublettencheck** über `frage_dubletten`
   (Kosinus ≥ 0,92 → verworfen, `verworfen_dublette`).
4. Frage + Optionen bzw. Musterlösung speichern (`entwurf`, `ki_generiert=true`,
   `kern` nur bei Zielpool `kern`).
5. **n-Gramm-Ähnlichkeit** gegen den Bestand → über Schwelle `review_queue`
   (`aehnlichkeit_zu_hoch`).
6. **`verifiziere-frage`** für die neuen IDs aufrufen (best-effort).

## Antwort (200)

```json
{
  "thema": "…", "zielpool": "erweiterung",
  "angefragt": 5, "erstellt": 4,
  "erstellte_ids": ["…"],
  "review_geflaggt": ["…"],
  "abgelehnt": [{"aufgabenstellung": "…", "grund": "zahlenwert_ohne_fundstelle"}],
  "verworfen_dublette": [{"aufgabenstellung": "…", "aehnlichkeit": 0.97}],
  "verifikation": { "geprueft": 4, "ergebnisse": [ … ] },
  "budget_warnung_80": false
}
```

## Betrieb & Mock

- Schreibt nach jedem Lauf eine Zeile in `ki_aufrufe`
  (`funktion = 'generiere_fragen'`), Budgetprüfung gegen
  `traeger.einstellungen.monatsbudget_eur`, Abbruch mit HTTP 429
  (`budget_ueberschritten`), 80-%-Warnung im Feld `budget_warnung_80`.
- **`LLM_MOCK=1`** (oder fehlender `LLM_API_KEY`): plausible Entwürfe ohne
  API-Aufruf. Das Embedding wird **hash-basiert** erzeugt (Bag-of-Words auf 1536
  Buckets, L2-normiert). **Einschränkung:** rein lexikalische Ähnlichkeit ohne
  semantisches Verständnis — genügt, um nahezu identische Entwürfe als Dubletten
  zu erkennen, ersetzt aber keine echten Embeddings im Produktivbetrieb.
- Der n-Gramm-Vergleich läuft mangels Volltext der Trägerskripte gegen die
  Aufgabenstellungen des Bestands desselben Themas (Proxy für den Quelltext).

## Umgebungsvariablen

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`LLM_API_KEY`, `LLM_MODELL`, `LLM_BASE_URL`, `EMBED_MODELL`, `LLM_MOCK`.

## Lokal testen

```
supabase functions serve generiere-fragen --env-file supabase/.env.local
```
