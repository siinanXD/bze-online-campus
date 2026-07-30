#!/usr/bin/env python3
"""Prüft Fragenpool-JSON-Dateien auf strukturelle Fehler, bevor sie in den Seed wandern.

Aufruf:  python3 scripts/pruefe_fragenpool.py [datei ...]
Ohne Argument werden alle supabase/seed/*_Fragenpool_*.json geprüft.
Exit-Code 1, sobald ein Fehler gefunden wurde.
"""
import json, pathlib, sys, collections

BASE = pathlib.Path(__file__).resolve().parent.parent
THEMEN = set()
for pfad in (BASE / "supabase/seed").glob("*_Fragenpool_*.json"):
    pool = json.load(open(pfad, encoding="utf-8"))
    for pb in pool.get("pruefungsbereiche", []):
        THEMEN.update(t["code"] for t in pb["themen"])

fehler, warnungen = [], []


def pruefe(pfad: pathlib.Path) -> None:
    pool = json.load(open(pfad, encoding="utf-8"))
    name = pfad.name
    ids = collections.Counter(f["id"] for f in pool["fragen"])
    for fid, n in ids.items():
        if n > 1:
            fehler.append(f"{name}: Frage-ID {fid} kommt {n}-mal vor")

    for f in pool["fragen"]:
        fid = f["id"]
        if THEMEN and f["thema"] not in THEMEN:
            fehler.append(f"{name}/{fid}: unbekanntes Thema {f['thema']}")
        if not f["aufgabenstellung"].strip():
            fehler.append(f"{name}/{fid}: leere Aufgabenstellung")
        if f.get("enthaelt_zahlenwert") and not f.get("tabellenbuch_fundstelle"):
            warnungen.append(
                f"{name}/{fid}: Zahlenwert ohne Tabellenbuch-Fundstelle – vor Freigabe nachtragen")
        if f.get("status") != "entwurf":
            fehler.append(f"{name}/{fid}: Status muss 'entwurf' sein (Ausbilderfreigabe)")

        if f["typ"] == "mc":
            opts = f["optionen"]
            richtig = [o for o in opts if o["ist_korrekt"]]
            if len(richtig) != 1:
                fehler.append(f"{name}/{fid}: {len(richtig)} richtige Antworten, erwartet genau 1")
            texte = [o["text"].strip().lower() for o in opts]
            if len(set(texte)) != len(texte):
                fehler.append(f"{name}/{fid}: doppelte Antworttexte")
            for o in opts:
                if not o.get("erklaerung", "").strip():
                    warnungen.append(f"{name}/{fid}: Option ohne Erklärung: {o['text'][:40]}")
            if len(opts) not in (4, 5):
                warnungen.append(f"{name}/{fid}: {len(opts)} Optionen (üblich sind 4 oder 5)")
        else:
            br = f.get("bewertungsraster") or {}
            summe = sum(k["punkte"] for k in br.get("kriterien", []))
            if summe != br.get("max_punkte"):
                fehler.append(
                    f"{name}/{fid}: Kriterienpunkte {summe} != max_punkte {br.get('max_punkte')}")
            if not f.get("musterloesung", "").strip():
                fehler.append(f"{name}/{fid}: fehlende Musterlösung")

    # Übungsprüfungen dürfen nur vorhandene Fragen referenzieren
    vorhanden = set(ids)
    for up in pool.get("uebungspruefungen", []):
        unbekannt = [a for a in up["aufgaben"] if a not in vorhanden]
        if unbekannt:
            fehler.append(f"{name}/{up['code']}: unbekannte Frage-IDs {unbekannt}")
        doppelt = [a for a, n in collections.Counter(up["aufgaben"]).items() if n > 1]
        if doppelt:
            fehler.append(f"{name}/{up['code']}: Aufgabe doppelt im Satz: {doppelt}")

    meta = pool.get("meta", {})
    ist_mc = sum(1 for f in pool["fragen"] if f["typ"] == "mc")
    ist_ft = len(pool["fragen"]) - ist_mc
    if meta.get("anzahl_mc") not in (None, ist_mc):
        fehler.append(f"{name}: meta.anzahl_mc={meta['anzahl_mc']}, tatsächlich {ist_mc}")
    if meta.get("anzahl_freitext") not in (None, ist_ft):
        fehler.append(f"{name}: meta.anzahl_freitext={meta['anzahl_freitext']}, tatsächlich {ist_ft}")
    print(f"{name}: {ist_mc} MC, {ist_ft} Freitext, "
          f"{len(pool.get('uebungspruefungen', []))} Übungsprüfung(en)")


dateien = [pathlib.Path(a) for a in sys.argv[1:]] or sorted(
    (BASE / "supabase/seed").glob("*_Fragenpool_*.json"))
for d in dateien:
    pruefe(d)

for w in warnungen:
    print("WARNUNG:", w)
for f in fehler:
    print("FEHLER:", f)
if fehler:
    sys.exit(1)
print("Alle Prüfungen bestanden.")
