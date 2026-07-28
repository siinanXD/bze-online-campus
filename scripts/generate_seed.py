#!/usr/bin/env python3
"""Erzeugt supabase/seed/0001_maf_seed.sql aus MAF_Fragenpool_Charge1.json.
Deterministische UUIDs (uuid5) je Fachobjekt, damit der Seed idempotent bleibt.
Alle Fragen behalten Status 'entwurf' (Spec: Ausbilderfreigabe zwingend)."""
import json, uuid, pathlib

BASE = pathlib.Path(__file__).resolve().parent.parent
POOL = json.load(open(BASE / "supabase/seed/MAF_Fragenpool_Charge1.json", encoding="utf-8"))
NS = uuid.UUID("11111111-2222-3333-4444-555555555555")

def uid(*parts):
    return str(uuid.uuid5(NS, "|".join(str(p) for p in parts)))

def q(v):
    if v is None: return "null"
    if isinstance(v, bool): return "true" if v else "false"
    if isinstance(v, (int, float)): return str(v)
    return "'" + str(v).replace("'", "''") + "'"

def jsonb(v):
    return "null" if v is None else "'" + json.dumps(v, ensure_ascii=False).replace("'", "''") + "'::jsonb"

TRAEGER = uid("traeger", "bze")
KAMMER  = uid("kammer", "ihk-aachen")
SCHLUESSEL = uid("schluessel", "ihk100")
BERUF   = uid("beruf", "maf-metall")
PHASE1  = uid("phase", BERUF, 1)
PHASE2  = uid("phase", BERUF, 2)

out = []
out.append("-- AUTOGENERIERT von scripts/generate_seed.py — nicht von Hand ändern.")
out.append("-- Quelle: supabase/seed/MAF_Fragenpool_Charge1.json")
out.append("begin;\n")

# Träger
out.append(f"insert into traeger (id,name,slug) values ({q(TRAEGER)},{q('Berufsbildungszentrum Euskirchen')},{q('bze')}) on conflict (id) do nothing;")

# Kammer IHK Aachen
out.append(f"insert into kammern (id,name,typ,anschrift) values ({q(KAMMER)},{q('IHK Aachen')},'IHK',{q('Theaterstraße 6-10, 52062 Aachen')}) on conflict (id) do nothing;")

# Bewertungsschlüssel IHK 100 (Spec §4.4)
stufen = [
    {"von":92,"bis":100,"note":1,"bezeichnung":"sehr gut"},
    {"von":81,"bis":91,"note":2,"bezeichnung":"gut"},
    {"von":67,"bis":80,"note":3,"bezeichnung":"befriedigend"},
    {"von":50,"bis":66,"note":4,"bezeichnung":"ausreichend"},
    {"von":30,"bis":49,"note":5,"bezeichnung":"mangelhaft"},
    {"von":0,"bis":29,"note":6,"bezeichnung":"ungenügend"},
]
out.append(f"insert into bewertungsschluessel (id,name,stufen,bestehensgrenze) values ({q(SCHLUESSEL)},{q('IHK 100-Punkte-Schlüssel')},{jsonb(stufen)},50) on conflict (id) do nothing;")

# Beruf MAF
meta = POOL["meta"]
out.append(f"insert into berufe (id,traeger_id,kammer_id,bezeichnung,dauer_monate,bewertungsschluessel_id) "
           f"values ({q(BERUF)},{q(TRAEGER)},{q(KAMMER)},{q('Maschinen- und Anlagenführer/-in – Metall- und Kunststofftechnik')},16,{q(SCHLUESSEL)}) on conflict (id) do nothing;")

# Phasen
out.append(f"insert into ausbildungsphasen (id,beruf_id,bezeichnung,reihenfolge,zielpruefung,mindest_wochenpruefungen) values "
           f"({q(PHASE1)},{q(BERUF)},{q('Phase 1 – bis zur Zwischenprüfung')},1,'zwischenpruefung',4),"
           f"({q(PHASE2)},{q(BERUF)},{q('Phase 2 – bis zur Abschlussprüfung')},2,'abschlusspruefung',4) on conflict (id) do nothing;")

# Prüfungsbereiche + Themen aus Pool
themen_uuid = {}
for i, pb in enumerate(POOL["pruefungsbereiche"], start=1):
    pb_id = uid("pbereich", BERUF, pb["code"])
    out.append(f"insert into pruefungsbereiche (id,beruf_id,phase_id,bezeichnung,gewichtung_prozent,pruefungsdauer_minuten,reihenfolge) "
               f"values ({q(pb_id)},{q(BERUF)},{q(PHASE2)},{q(pb['bezeichnung'])},{pb['gewichtung_prozent']},{pb.get('pruefungsdauer_minuten') or 'null'},{i}) on conflict (id) do nothing;")
    for j, th in enumerate(pb["themen"], start=1):
        th_id = uid("thema", pb_id, th["code"])
        themen_uuid[th["code"]] = th_id
        out.append(f"insert into themen (id,pruefungsbereich_id,bezeichnung,code,reihenfolge) "
                   f"values ({q(th_id)},{q(pb_id)},{q(th['bezeichnung'])},{q(th['code'])},{j}) on conflict (id) do nothing;")

out.append("")
# Fragen
mc = ft = 0
for fr in POOL["fragen"]:
    fid = uid("frage", fr["id"])
    thema = themen_uuid.get(fr["thema"])
    if not thema:
        raise SystemExit(f"Unbekanntes Thema {fr['thema']} in Frage {fr['id']}")
    fundstelle = jsonb(fr.get("tabellenbuch_fundstelle"))
    out.append(
        "insert into fragen (id,thema_id,typ,aufgabenstellung,schwierigkeit,status,kern,ki_generiert,"
        "quellenstufe,tabellenbuch_fundstelle,enthaelt_zahlenwert,quell_ref) values ("
        f"{q(fid)},{q(thema)},{q(fr['typ'])},{q(fr['aufgabenstellung'])},{fr.get('schwierigkeit') or 'null'},"
        f"'entwurf',{q(fr.get('kern',False))},false,{fr.get('quellenstufe') or 'null'},{fundstelle},"
        f"{q(fr.get('enthaelt_zahlenwert',False))},{q(fr['id'])}) on conflict (id) do nothing;")
    # Normbezüge
    for nb in fr.get("normbezuege", []) or []:
        nid = uid("norm", nb)
        out.append(f"insert into normen (id,nummer,status) values ({q(nid)},{q(nb)},'gueltig') on conflict (id) do nothing;")
        out.append(f"insert into frage_normen (frage_id,norm_id) values ({q(fid)},{q(nid)}) on conflict do nothing;")
    if fr["typ"] == "mc":
        mc += 1
        for k, opt in enumerate(fr["optionen"], start=1):
            oid = uid("opt", fr["id"], k)
            out.append(f"insert into antwortoptionen (id,frage_id,text,ist_korrekt,erklaerung,reihenfolge) values "
                       f"({q(oid)},{q(fid)},{q(opt['text'])},{q(opt['ist_korrekt'])},{q(opt.get('erklaerung'))},{k}) on conflict (id) do nothing;")
    else:
        ft += 1
        br = fr["bewertungsraster"]
        out.append(f"insert into freitext_loesungen (frage_id,musterloesung,bewertungsraster,max_punkte) values "
                   f"({q(fid)},{q(fr['musterloesung'])},{jsonb(br)},{br.get('max_punkte',4)}) on conflict (frage_id) do nothing;")

out.append("\ncommit;")
out.append(f"-- Erzeugt: {mc} MC-Fragen, {ft} Freitext-Fragen, gesamt {mc+ft}.")

target = BASE / "supabase/seed/0001_maf_seed.sql"
target.write_text("\n".join(out), encoding="utf-8")
print(f"OK: {target} geschrieben. MC={mc} Freitext={ft} gesamt={mc+ft}")
print(f"Prüfungsbereiche={len(POOL['pruefungsbereiche'])} Themen={len(themen_uuid)}")
