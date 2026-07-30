#!/usr/bin/env python3
"""Erzeugt supabase/seed/0001_maf_seed.sql aus allen Fragenpool-JSON-Dateien.

Jede Datei supabase/seed/<KUERZEL>_Fragenpool_*.json gehört über meta.beruf_slug
zu genau einem Beruf. Mehrere Chargen desselben Berufs werden zusammengeführt;
die Prüfungsbereiche und Themen liefert die Charge, die sie definiert.

Deterministische UUIDs (uuid5) je Fachobjekt, damit der Seed idempotent bleibt.
Alle Fragen behalten Status 'entwurf' (Spec: Ausbilderfreigabe zwingend)."""

import collections
import json
import pathlib
import uuid

BASE = pathlib.Path(__file__).resolve().parent.parent
POOLS = sorted((BASE / "supabase/seed").glob("*_Fragenpool_*.json"))
NS = uuid.UUID("11111111-2222-3333-4444-555555555555")


def uid(*parts):
    """Deterministische UUID (uuid5) aus den mit '|' verketteten Teilen."""
    return str(uuid.uuid5(NS, "|".join(str(p) for p in parts)))


def q(v):
    """Quotiert einen Wert als SQL-Literal (null, bool, Zahl oder Text)."""
    if v is None:
        return "null"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, int | float):
        return str(v)
    return "'" + str(v).replace("'", "''") + "'"


def jsonb(v):
    """Serialisiert einen Wert als SQL-jsonb-Literal (oder null)."""
    if v is None:
        return "null"
    return "'" + json.dumps(v, ensure_ascii=False).replace("'", "''") + "'::jsonb"


# ---------------------------------------------------------------- Pools laden
# beruf_slug -> {"meta":…, "pruefungsbereiche":[…], "fragen":[…]}
berufe = collections.OrderedDict()
gesehen = set()
for pfad in POOLS:
    pool = json.load(open(pfad, encoding="utf-8"))
    meta = pool["meta"]
    slug = meta.get("beruf_slug")
    if not slug:
        raise SystemExit(f"{pfad.name}: meta.beruf_slug fehlt")
    eintrag = berufe.setdefault(slug, {"meta": meta, "pruefungsbereiche": [], "fragen": []})
    if pool.get("pruefungsbereiche"):
        if eintrag["pruefungsbereiche"]:
            raise SystemExit(f"{pfad.name}: Prüfungsbereiche für {slug} bereits definiert")
        eintrag["pruefungsbereiche"] = pool["pruefungsbereiche"]
        eintrag["meta"] = meta
    for fr in pool["fragen"]:
        if fr["id"] in gesehen:
            raise SystemExit(f"Frage-ID {fr['id']} kommt mehrfach vor ({pfad.name})")
        gesehen.add(fr["id"])
        eintrag["fragen"].append(fr)

TRAEGER = uid("traeger", "bze")
SCHLUESSEL = uid("schluessel", "ihk100")

out = [
    "-- AUTOGENERIERT von scripts/generate_seed.py — nicht von Hand ändern.",
    "-- Quelle: " + ", ".join(p.name for p in POOLS),
    "begin;\n",
]

out.append(
    f"insert into traeger (id,name,slug) values ({q(TRAEGER)},"
    f"{q('Berufsbildungszentrum Euskirchen')},{q('bze')}) on conflict (id) do nothing;"
)

# Kammern nach Bedarf (IHK Aachen / HWK Aachen)
KAMMERN = {
    "IHK": (uid("kammer", "ihk-aachen"), "IHK Aachen", "IHK", "Theaterstraße 6-10, 52062 Aachen"),
    "HWK": (
        uid("kammer", "hwk-aachen"),
        "Handwerkskammer Aachen",
        "HWK",
        "Sandkaulbach 17-21, 52062 Aachen",
    ),
}
for kid, name, typ, anschrift in KAMMERN.values():
    out.append(
        f"insert into kammern (id,name,typ,anschrift) values ({q(kid)},{q(name)},"
        f"{q(typ)},{q(anschrift)}) on conflict (id) do nothing;"
    )

# Bewertungsschlüssel IHK 100 (Spec §4.4)
stufen = [
    {"von": 92, "bis": 100, "note": 1, "bezeichnung": "sehr gut"},
    {"von": 81, "bis": 91, "note": 2, "bezeichnung": "gut"},
    {"von": 67, "bis": 80, "note": 3, "bezeichnung": "befriedigend"},
    {"von": 50, "bis": 66, "note": 4, "bezeichnung": "ausreichend"},
    {"von": 30, "bis": 49, "note": 5, "bezeichnung": "mangelhaft"},
    {"von": 0, "bis": 29, "note": 6, "bezeichnung": "ungenügend"},
]
out.append(
    f"insert into bewertungsschluessel (id,name,stufen,bestehensgrenze) values "
    f"({q(SCHLUESSEL)},{q('IHK 100-Punkte-Schlüssel')},{jsonb(stufen)},50) on conflict (id) do nothing;"
)
out.append("")

statistik = []
for slug, eintrag in berufe.items():
    meta = eintrag["meta"]
    if not eintrag["pruefungsbereiche"]:
        raise SystemExit(f"Beruf {slug}: keine Charge definiert Prüfungsbereiche")
    beruf_id = uid("beruf", slug)
    kammer_id = KAMMERN[meta.get("kammer", "IHK")][0]
    phase1 = uid("phase", beruf_id, 1)
    phase2 = uid("phase", beruf_id, 2)

    out.append(f"-- Beruf: {meta['beruf']}")
    out.append(
        f"insert into berufe (id,traeger_id,kammer_id,bezeichnung,dauer_monate,bewertungsschluessel_id) "
        f"values ({q(beruf_id)},{q(TRAEGER)},{q(kammer_id)},{q(meta['bezeichnung_lang'])},"
        f"{meta.get('dauer_monate_umschulung') or 'null'},{q(SCHLUESSEL)}) on conflict (id) do nothing;"
    )
    out.append(
        f"insert into ausbildungsphasen (id,beruf_id,bezeichnung,reihenfolge,zielpruefung,mindest_wochenpruefungen) values "
        f"({q(phase1)},{q(beruf_id)},{q('Phase 1 – bis zur Zwischenprüfung')},1,'zwischenpruefung',4),"
        f"({q(phase2)},{q(beruf_id)},{q('Phase 2 – bis zur Abschlussprüfung')},2,'abschlusspruefung',4) on conflict (id) do nothing;"
    )

    themen_uuid = {}
    for i, pb in enumerate(eintrag["pruefungsbereiche"], start=1):
        pb_id = uid("pbereich", beruf_id, pb["code"])
        phase = phase1 if pb.get("phase") == 1 else phase2
        out.append(
            f"insert into pruefungsbereiche (id,beruf_id,phase_id,bezeichnung,gewichtung_prozent,pruefungsdauer_minuten,reihenfolge) "
            f"values ({q(pb_id)},{q(beruf_id)},{q(phase)},{q(pb['bezeichnung'])},"
            f"{q(pb.get('gewichtung_prozent'))},{q(pb.get('pruefungsdauer_minuten'))},{i}) on conflict (id) do nothing;"
        )
        for j, th in enumerate(pb["themen"], start=1):
            th_id = uid("thema", pb_id, th["code"])
            themen_uuid[th["code"]] = th_id
            out.append(
                f"insert into themen (id,pruefungsbereich_id,bezeichnung,code,reihenfolge) "
                f"values ({q(th_id)},{q(pb_id)},{q(th['bezeichnung'])},{q(th['code'])},{j}) on conflict (id) do nothing;"
            )

    mc = ft = 0
    for fr in eintrag["fragen"]:
        fid = uid("frage", fr["id"])
        thema = themen_uuid.get(fr["thema"])
        if not thema:
            raise SystemExit(f"Unbekanntes Thema {fr['thema']} in Frage {fr['id']} (Beruf {slug})")
        out.append(
            "insert into fragen (id,thema_id,typ,aufgabenstellung,schwierigkeit,status,kern,ki_generiert,"
            "quellenstufe,tabellenbuch_fundstelle,enthaelt_zahlenwert,quell_ref) values ("
            f"{q(fid)},{q(thema)},{q(fr['typ'])},{q(fr['aufgabenstellung'])},{fr.get('schwierigkeit') or 'null'},"
            f"'entwurf',{q(fr.get('kern', False))},false,{fr.get('quellenstufe') or 'null'},"
            f"{jsonb(fr.get('tabellenbuch_fundstelle'))},"
            f"{q(fr.get('enthaelt_zahlenwert', False))},{q(fr['id'])}) on conflict (id) do nothing;"
        )
        for nb in fr.get("normbezuege", []) or []:
            nid = uid("norm", nb)
            out.append(
                f"insert into normen (id,nummer,status) values ({q(nid)},{q(nb)},'gueltig') on conflict (id) do nothing;"
            )
            out.append(
                f"insert into frage_normen (frage_id,norm_id) values ({q(fid)},{q(nid)}) on conflict do nothing;"
            )
        if fr["typ"] == "mc":
            mc += 1
            for k, opt in enumerate(fr["optionen"], start=1):
                oid = uid("opt", fr["id"], k)
                out.append(
                    f"insert into antwortoptionen (id,frage_id,text,ist_korrekt,erklaerung,reihenfolge) values "
                    f"({q(oid)},{q(fid)},{q(opt['text'])},{q(opt['ist_korrekt'])},{q(opt.get('erklaerung'))},{k}) on conflict (id) do nothing;"
                )
        else:
            ft += 1
            br = fr["bewertungsraster"]
            out.append(
                f"insert into freitext_loesungen (frage_id,musterloesung,bewertungsraster,max_punkte) values "
                f"({q(fid)},{q(fr['musterloesung'])},{jsonb(br)},{br.get('max_punkte', 4)}) on conflict (frage_id) do nothing;"
            )
    out.append("")
    statistik.append((meta["beruf"], len(eintrag["pruefungsbereiche"]), len(themen_uuid), mc, ft))

out.append("commit;")
gesamt_mc = sum(s[3] for s in statistik)
gesamt_ft = sum(s[4] for s in statistik)
out.append(f"-- {len(statistik)} Berufe, {gesamt_mc} MC-Fragen, {gesamt_ft} Freitext-Fragen.")

target = BASE / "supabase/seed/0001_maf_seed.sql"
target.write_text("\n".join(out), encoding="utf-8")
print(f"OK: {target.name} geschrieben.")
for name, npb, nth, mc, ft in statistik:
    print(f"  {name}: {npb} Prüfungsbereiche, {nth} Themen, {mc} MC, {ft} Freitext")
print(f"  Gesamt: {gesamt_mc} MC, {gesamt_ft} Freitext, {gesamt_mc + gesamt_ft} Fragen")
