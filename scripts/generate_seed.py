#!/usr/bin/env python3
"""Erzeugt supabase/seed/0001_maf_seed.sql aus Seed-JSON-Dateien.

Fragenpool-Dateien folgen weiterhin dem Muster
``supabase/seed/<KUERZEL>_Fragenpool_*.json``. Zusaetzliche
Demo-Content-Dateien folgen ``supabase/seed/*_DemoContent.json`` und werden in
die bestehenden Tabellen geschrieben: Fachbereiche in ``pruefungsbereiche``,
Themen und Unterthemen in ``themen``, Fachkunde in ``lerneinheiten`` und
Fragen in ``fragen``/``antwortoptionen``.

Deterministische UUIDs (uuid5) je Fachobjekt halten den Seed wiederholbar und
idempotent.
"""

from __future__ import annotations

import collections
import json
import pathlib
import re
import uuid
from typing import Any

BASE = pathlib.Path(__file__).resolve().parent.parent
SEED_DIR = BASE / "supabase/seed"
POOLS = sorted(SEED_DIR.glob("*_Fragenpool_*.json"))
DEMO_CONTENT_FILES = sorted(SEED_DIR.glob("*_DemoContent.json"))
NS = uuid.UUID("11111111-2222-3333-4444-555555555555")

DEMO_LABEL = "KI-generierter Beispielinhalt - nicht fachlich verifiziert"
DEMO_QUALITAET = 0.72
DEMO_WARNUNG = {
    "hinweis": "Automatisch erzeugter Demo-Seed; vor Produktion fachlich pruefen.",
    "fachlich_verifiziert": False,
    "keine_original_pruefungsaufgabe": True,
}
RECHEN_UNTERTHEMEN = {
    "Laengen",
    "Flaechen",
    "Volumen",
    "Masse",
    "Dichte",
    "Kraefte",
    "Drehmoment",
    "Leistung",
    "Arbeit",
    "Geschwindigkeit",
    "Drehzahl",
    "Schnittgeschwindigkeit",
    "Vorschub",
    "Prozentrechnung",
    "Verhaeltnisrechnung",
    "Drehen",
    "Fraesen",
    "Bohren",
    "Saegen",
    "Schleifen",
    "Stanzen",
    "Biegen",
    "Pneumatik",
    "Hydraulik",
    "Foerdertechnik",
}


def uid(*parts: object) -> str:
    """Erzeugt eine deterministische UUID (uuid5) aus den Teilen."""
    return str(uuid.uuid5(NS, "|".join(str(p) for p in parts)))


def q(value: object) -> str:
    """Quotiert einen Wert als SQL-Literal."""
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int | float):
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"


def jsonb(value: object) -> str:
    """Serialisiert einen Wert als SQL-jsonb-Literal."""
    if value is None:
        return "null"
    payload = json.dumps(value, ensure_ascii=False)
    return "'" + payload.replace("'", "''") + "'::jsonb"


def code(value: str) -> str:
    """Formt einen stabilen Code aus einem deutschen Anzeigenamen."""
    replacements = {
        "ä": "ae",
        "ö": "oe",
        "ü": "ue",
        "Ä": "AE",
        "Ö": "OE",
        "Ü": "UE",
        "ß": "SS",
    }
    normalized = "".join(replacements.get(char, char) for char in value)
    normalized = re.sub(r"[^A-Za-z0-9]+", "-", normalized).strip("-")
    return normalized.upper()


def schwierigkeitsgrad(index: int) -> str:
    """Waehlt einen Content-Schwierigkeitsgrad in stabiler Rotation."""
    return ("einfach", "mittel", "schwer")[index % 3]


def schwierigkeit_nummer(index: int) -> int:
    """Waehlt die alte numerische Schwierigkeit 1..3 in stabiler Rotation."""
    return (index % 3) + 1


def sql_list(values: list[str]) -> str:
    """Gibt eine komma-getrennte SQL-Werteliste zurueck."""
    return ",".join(values)


def load_pools() -> collections.OrderedDict[str, dict[str, Any]]:
    """Laedt und validiert alle bestehenden Fragenpool-Dateien."""
    berufe: collections.OrderedDict[str, dict[str, Any]] = collections.OrderedDict()
    gesehen: set[str] = set()
    for path in POOLS:
        pool = json.load(open(path, encoding="utf-8"))
        meta = pool["meta"]
        slug = meta.get("beruf_slug")
        if not slug:
            raise SystemExit(f"{path.name}: meta.beruf_slug fehlt")
        eintrag = berufe.setdefault(slug, {"meta": meta, "pruefungsbereiche": [], "fragen": []})
        if pool.get("pruefungsbereiche"):
            if eintrag["pruefungsbereiche"]:
                raise SystemExit(f"{path.name}: Pruefungsbereiche fuer {slug} bereits definiert")
            eintrag["pruefungsbereiche"] = pool["pruefungsbereiche"]
            eintrag["meta"] = meta
        for frage in pool["fragen"]:
            if frage["id"] in gesehen:
                raise SystemExit(f"Frage-ID {frage['id']} kommt mehrfach vor ({path.name})")
            gesehen.add(frage["id"])
            eintrag["fragen"].append(frage)
    return berufe


def load_demo_content() -> dict[str, list[dict[str, Any]]]:
    """Laedt Demo-Content-Dateien nach beruf_slug gruppiert."""
    gruppiert: dict[str, list[dict[str, Any]]] = collections.defaultdict(list)
    for path in DEMO_CONTENT_FILES:
        content = json.load(open(path, encoding="utf-8"))
        slug = content.get("meta", {}).get("beruf_slug")
        if not slug:
            raise SystemExit(f"{path.name}: meta.beruf_slug fehlt")
        gruppiert[slug].append(content)
    return gruppiert


def demo_common(meta: dict[str, Any]) -> dict[str, Any]:
    """Liefert gemeinsame Demo-Metadaten fuer Content-Inserts."""
    return {
        "ist_demo": True,
        "demo_sichtbar": True,
        "demo_label": meta.get("demo_label", DEMO_LABEL),
        "fachlich_verifiziert": False,
        "quellenart": "demo",
        "ki_anbieter": meta.get("ki_anbieter", "mock"),
        "ki_modell": meta.get("ki_modell", "seed-demo-content-v1"),
        "ki_metadaten": {
            "seed": "MAF_DemoContent",
            "modus": "mock",
            "deterministisch": True,
        },
        "qualitaetswert": DEMO_QUALITAET,
        "qualitaetsmetadaten": DEMO_WARNUNG,
    }


def context_for(thema: str) -> str:
    """Beschreibt den Praxisbezug eines Demo-Themas."""
    mapping = {
        "Werkstoffkunde": "Werkstoffauswahl, Lagerung und einfache Pruefung",
        "Fertigungstechnik": "Einrichten, Bedienen und Ueberwachen von Fertigungsprozessen",
        "Technische Mathematik": "Rechnen mit Beispielwerten aus Fertigung und Kontrolle",
        "Technisches Zeichnen": "Lesen und Umsetzen technischer Unterlagen",
        "Maschinen und Anlagen": "Bedienen, Stoerungssuche und Instandhaltung",
        "Arbeitssicherheit": "sicheres Verhalten an Maschinen und Anlagen",
    }
    return mapping.get(thema, "Praxis in der Metall- und Kunststofftechnik")


def lernzieltexte(name: str, thema: str) -> list[tuple[str, str]]:
    """Erzeugt vier Lernziele fuer ein Unterthema."""
    context = context_for(thema)
    return [
        (
            f"{name} erklaeren",
            f"Die lernende Person beschreibt {name} mit eigenen Worten und ordnet es dem Bereich {thema} zu.",
        ),
        (
            f"{name} in der Praxis erkennen",
            f"Die lernende Person erkennt typische Situationen zu {name} im Kontext {context}.",
        ),
        (
            f"Fehler bei {name} vermeiden",
            f"Die lernende Person nennt haeufige Fehler und einfache Gegenmassnahmen zu {name}.",
        ),
        (
            f"Entscheidungen zu {name} begruenden",
            f"Die lernende Person begruendet eine einfache Auswahl, Einstellung oder Pruefung zu {name}.",
        ),
    ]


def erklaerung_kurz(name: str, thema: str) -> str:
    """Erzeugt eine kurze fachliche Erklaerung."""
    return (
        f"{name} gehoert zum Lernbereich {thema}. In der Ausbildung geht es darum, "
        f"den Begriff sicher zu erkennen, typische Anwendungen zu nennen und einfache "
        f"Entscheidungen im Arbeitsalltag zu begruenden. Dieser Demo-Inhalt ist ein "
        f"KI-generierter Beispielinhalt und nicht fachlich verifiziert."
    )


def erklaerung_lang(name: str, thema: str) -> str:
    """Erzeugt eine ausfuehrlichere Erklaerung fuer MAF-Lernende."""
    context = context_for(thema)
    return (
        f"## {name}\n\n"
        f"{name} ist fuer Maschinen- und Anlagenfuehrer/-innen wichtig, weil es "
        f"beim {context.lower()} immer wieder vorkommt. Entscheidend ist nicht, "
        f"Definitionen auswendig zu lernen, sondern den Zusammenhang zur Arbeit an "
        f"Maschine, Werkzeug, Werkstoff und Pruefung zu verstehen.\n\n"
        f"In der Praxis pruefst du zuerst die Unterlagen, dann den Zustand von "
        f"Material, Werkzeug, Maschine und Sicherheitseinrichtungen. Bei {name} "
        f"geht es meist um eine einfache Frage: Welche Eigenschaft, Einstellung "
        f"oder Gefahr ist fuer den naechsten Arbeitsschritt entscheidend? Wenn "
        f"Zahlenwerte, Grenzwerte oder Normangaben noetig sind, werden sie im "
        f"Tabellenbuch, in der Zeichnung oder in der Betriebsanweisung nachgeschlagen.\n\n"
        f"Typische Fehler sind vorschnelles Schaetzen, das Uebertragen von Werten "
        f"auf andere Werkstoffe oder Maschinen und das Uebergehen von Warnhinweisen. "
        f"Dieser Abschnitt ist als KI-generierter Beispielinhalt markiert und vor "
        f"einem produktiven Einsatz fachlich zu pruefen."
    )


def zusammenfassung(name: str, thema: str) -> str:
    """Erzeugt eine kurze Zusammenfassung."""
    return (
        f"- {name} gehoert zu {thema}.\n"
        "- In der Ausbildung zaehlen sichere Begriffe, Praxisbezug und sauberes Vorgehen.\n"
        "- Zahlenwerte sind Beispielwerte oder muessen in einer freigegebenen Quelle nachgeschlagen werden.\n"
        "- Dieser Inhalt ist KI-generierter Beispielinhalt und nicht fachlich verifiziert."
    )


def lernkarten(name: str, thema: str) -> list[dict[str, str]]:
    """Erzeugt zwei Lernkarten fuer ein Unterthema."""
    return [
        {
            "titel": f"Grundidee: {name}",
            "vorderseite": f"Worum geht es bei {name} im Bereich {thema}?",
            "rueckseite": (
                f"Es geht darum, {name} zu erkennen, den Praxisbezug zu verstehen "
                "und passende Arbeitsschritte oder Pruefungen abzuleiten."
            ),
            "merksatz": f"{name}: erst Unterlagen pruefen, dann sicher handeln.",
        },
        {
            "titel": f"Praxischeck: {name}",
            "vorderseite": f"Welche Frage hilft dir bei {name} in der Werkstatt?",
            "rueckseite": (
                "Welche Eigenschaft, Einstellung, Gefahr oder Pruefung ist fuer "
                "den naechsten Arbeitsschritt wichtig?"
            ),
            "merksatz": "Nicht schaetzen - Quelle, Maschine und Auftrag pruefen.",
        },
    ]


def single_choice(name: str, thema: str, nummer: int) -> dict[str, Any]:
    """Erzeugt eine Single-Choice-Frage mit genau einer richtigen Antwort."""
    if nummer == 1:
        frage = f"Welche Aussage zu {name} im Bereich {thema} ist am besten?"
        richtig = (
            f"{name} wird mit dem Arbeitsauftrag, der Maschine und den Unterlagen "
            "in Beziehung gesetzt."
        )
        falsch = [
            f"{name} ist nur fuer die Abschlusspruefung wichtig.",
            f"{name} ersetzt die Pruefung von Zeichnung und Arbeitsplan.",
            f"Bei {name} duerfen Beispielwerte ungeprueft als Normwerte verwendet werden.",
        ]
    else:
        frage = f"Wie gehst du bei einer Aufgabe zu {name} sinnvoll vor?"
        richtig = "Unterlagen lesen, sichere Arbeitsschritte planen und offene Werte nachschlagen."
        falsch = [
            "Sofort mit der Fertigung beginnen, damit keine Zeit verloren geht.",
            "Alle Werte aus dem Gedaechtnis einsetzen.",
            "Warnhinweise erst nach dem Probelauf pruefen.",
        ]
    optionen = [
        {
            "text": richtig,
            "ist_korrekt": True,
            "erklaerung": "Das ist das sichere und fachlich nachvollziehbare Vorgehen.",
        },
        {
            "text": falsch[0],
            "ist_korrekt": False,
            "erklaerung": "Der Praxisbezug ist wichtiger als reines Pruefungslernen.",
        },
        {
            "text": falsch[1],
            "ist_korrekt": False,
            "erklaerung": "Unterlagen und Pruefungen werden nicht ersetzt.",
        },
        {
            "text": falsch[2],
            "ist_korrekt": False,
            "erklaerung": "Zahlen- und Grenzwerte muessen aus freigegebenen Quellen kommen.",
        },
    ]
    return {"aufgabenstellung": frage, "optionen": optionen}


def multiple_choice(name: str, thema: str) -> dict[str, Any]:
    """Erzeugt eine Multiple-Choice-Frage mit zwei richtigen Antworten."""
    return {
        "aufgabenstellung": (
            f"Welche zwei Handlungen passen zu einer sauberen Bearbeitung von {name}?"
        ),
        "optionen": [
            {
                "text": "Arbeitsauftrag, Zeichnung oder Betriebsanweisung vor dem Start lesen.",
                "ist_korrekt": True,
                "erklaerung": "Die Unterlagen legen fest, was gefordert ist.",
            },
            {
                "text": "Bei Unsicherheit Rueckfrage stellen oder freigegebene Quelle nutzen.",
                "ist_korrekt": True,
                "erklaerung": "So werden Schaetzungen und Folgefehler vermieden.",
            },
            {
                "text": "Sicherheitseinrichtungen ueberbruecken, wenn der Auftrag eilig ist.",
                "ist_korrekt": False,
                "erklaerung": "Sicherheitseinrichtungen duerfen nicht umgangen werden.",
            },
            {
                "text": f"{name} immer gleich behandeln, unabhaengig von Werkstoff und Maschine.",
                "ist_korrekt": False,
                "erklaerung": "Werkstoff, Maschine und Auftrag koennen unterschiedliche Entscheidungen erfordern.",
            },
            {
                "text": "Beispielwerte aus Lernmaterial als freigegebene Normwerte verwenden.",
                "ist_korrekt": False,
                "erklaerung": "Beispielwerte sind zum Ueben da und ersetzen keine Quelle.",
            },
        ],
    }


def praxisfall(name: str, thema: str) -> dict[str, Any]:
    """Erzeugt einen Praxisfall fuer ein Unterthema."""
    return {
        "situation": (
            f"Du uebernimmst eine Anlage fuer einen Auftrag, bei dem {name} eine Rolle spielt. "
            "Die Schicht vor dir hat eine kurze Notiz hinterlassen, aber nicht alle Details sind klar."
        ),
        "aufgabe": (
            "Beschreibe, welche Unterlagen du pruefst, welche Rueckfrage du stellst "
            "und welche Sicherheits- oder Qualitaetskontrolle du vor dem Start durchfuehrst."
        ),
        "erwartungshorizont": [
            f"Bezug zu {name} und {thema} herstellen.",
            "Arbeitsauftrag, Zeichnung, Pruefplan oder Betriebsanweisung nennen.",
            "Unsichere Werte nicht schaetzen.",
            "Sicherheits- und Qualitaetsaspekt begruenden.",
        ],
    }


def rechenaufgabe(name: str) -> dict[str, Any]:
    """Erzeugt eine passende Rechenaufgabe mit ausdruecklichen Beispielwerten."""
    templates = {
        "Dichte": (
            "Ein Beispielkoerper hat 780 g Masse und 100 cm3 Volumen.",
            "rho = m / V = 780 g / 100 cm3 = 7,8 g/cm3.",
        ),
        "Flaechen": (
            "Ein Beispielblech ist 120 mm lang und 80 mm breit.",
            "A = l x b = 120 mm x 80 mm = 9600 mm2.",
        ),
        "Volumen": (
            "Ein Beispielquader ist 80 mm lang, 40 mm breit und 20 mm hoch.",
            "V = l x b x h = 80 x 40 x 20 = 64000 mm3.",
        ),
        "Drehmoment": (
            "An einem Hebel von 0,25 m wirkt beispielhaft eine Kraft von 80 N.",
            "M = F x l = 80 N x 0,25 m = 20 Nm.",
        ),
        "Leistung": (
            "Eine Maschine verrichtet beispielhaft 12 kJ Arbeit in 6 s.",
            "P = W / t = 12000 J / 6 s = 2000 W.",
        ),
        "Geschwindigkeit": (
            "Ein Foerderband legt beispielhaft 18 m in 12 s zurueck.",
            "v = s / t = 18 m / 12 s = 1,5 m/s.",
        ),
        "Schnittgeschwindigkeit": (
            "Ein Werkstueck mit 60 mm Durchmesser dreht beispielhaft mit 500 min-1.",
            "vc = pi x d x n = 3,1416 x 0,06 m x 500 min-1 = rund 94 m/min.",
        ),
        "Vorschub": (
            "Ein Bohrer hat beispielhaft 0,20 mm Vorschub je Umdrehung bei 600 min-1.",
            "vf = f x n = 0,20 mm x 600 min-1 = 120 mm/min.",
        ),
        "Prozentrechnung": (
            "Von 500 Beispielteilen sind 15 Teile Ausschuss.",
            "Ausschussquote = 15 / 500 x 100 Prozent = 3 Prozent.",
        ),
        "Verhaeltnisrechnung": (
            "Eine Mischung soll im Beispiel im Verhaeltnis 1:4 angesetzt werden.",
            "Bei 1 Teil Zusatz und 4 Teilen Grundstoff bestehen 5 Teile Gesamtmenge.",
        ),
    }
    text, loesung = templates.get(
        name,
        (
            f"Zu {name} werden beispielhafte Werte aus einem Uebungsauftrag vorgegeben.",
            "Rechenweg: passende Formel waehlen, Einheiten pruefen, Ergebnis mit Einheit angeben.",
        ),
    )
    formel = loesung.split("=")[0].strip() if "=" in loesung else "Passende Formel auswaehlen"
    ergebnis = loesung.split("=")[-1].strip() if "=" in loesung else "Ergebnis mit Einheit angeben"
    return {
        "aufgabe": f"{text} Berechne den gesuchten Wert. Die Zahlen sind reine Beispielwerte.",
        "gegebene_werte": [text],
        "gesuchte_groesse": "Gesuchter Wert aus der Aufgabenstellung",
        "formel": formel,
        "loesungsweg": loesung,
        "ergebnis": ergebnis,
        "erklaerung": "Einheiten pruefen, Beispielwerte einsetzen und Ergebnis mit Einheit angeben.",
        "loesung": loesung,
        "hinweis": "Beispielwerte ersetzen keine Tabellenbuch- oder Zeichnungswerte.",
    }


def insert_lernziel(
    out: list[str],
    traeger_id: str,
    pb_id: str,
    thema_id: str,
    unterthema_id: str,
    meta: dict[str, Any],
    title: str,
    description: str,
    index: int,
) -> str:
    """Schreibt ein Lernziel und gibt dessen ID zurueck."""
    common = demo_common(meta)
    lernziel_id = uid("demo-lernziel", unterthema_id, title)
    out.append(
        "insert into lernziele (id,traeger_id,pruefungsbereich_id,thema_id,unterthema_id,"
        "titel,beschreibung,schwierigkeitsgrad,status,ist_demo,demo_sichtbar,demo_label,"
        "fachlich_verifiziert,quellenart,ki_anbieter,ki_modell,ki_metadaten,qualitaetswert,"
        "qualitaetsmetadaten) values ("
        f"{q(lernziel_id)},{q(traeger_id)},{q(pb_id)},{q(thema_id)},{q(unterthema_id)},"
        f"{q(title)},{q(description)},{q(schwierigkeitsgrad(index))},'generiert',"
        f"true,true,{q(common['demo_label'])},false,'demo',{q(common['ki_anbieter'])},"
        f"{q(common['ki_modell'])},{jsonb(common['ki_metadaten'])},{common['qualitaetswert']},"
        f"{jsonb(common['qualitaetsmetadaten'])}) on conflict (id) do nothing;"
    )
    return lernziel_id


def link_content(
    out: list[str],
    content_id: str,
    lernziel_ids: list[str],
    quelle_id: str,
) -> None:
    """Verknuepft ein Content-Element mit Lernzielen und Quelle."""
    for lernziel_id in lernziel_ids:
        out.append(
            "insert into content_element_lernziele (content_element_id,lernziel_id) "
            f"values ({q(content_id)},{q(lernziel_id)}) on conflict do nothing;"
        )
    out.append(
        "insert into content_element_quellen (content_element_id,quelle_id,fundstelle) "
        f"values ({q(content_id)},{q(quelle_id)},{jsonb({'art': 'demo-seed'})}) on conflict do nothing;"
    )


def insert_content_element(
    out: list[str],
    traeger_id: str,
    ids: dict[str, str],
    meta: dict[str, Any],
    title: str,
    content_type: str,
    inhalt: dict[str, Any],
    difficulty: str,
    lernziel_ids: list[str],
    quelle_id: str,
    lerneinheit_id: str | None = None,
    frage_id: str | None = None,
) -> str:
    """Schreibt ein Content-Element und verknuepft es."""
    common = demo_common(meta)
    content_id = uid("demo-content", ids["unterthema"], title, content_type)
    out.append(
        "insert into content_elemente (id,traeger_id,titel,beschreibung,content_typ,"
        "pruefungsbereich_id,thema_id,unterthema_id,lerneinheit_id,frage_id,inhalt,"
        "schwierigkeitsgrad,status,ist_demo,demo_sichtbar,demo_label,fachlich_verifiziert,"
        "quellenart,ki_anbieter,ki_modell,ki_metadaten,qualitaetswert,qualitaetsmetadaten) values ("
        f"{q(content_id)},{q(traeger_id)},{q(title)},{q(DEMO_LABEL)},{q(content_type)},"
        f"{q(ids['pb'])},{q(ids['thema'])},{q(ids['unterthema'])},{q(lerneinheit_id)},"
        f"{q(frage_id)},{jsonb(inhalt)},{q(difficulty)},'generiert',true,true,"
        f"{q(common['demo_label'])},false,'demo',{q(common['ki_anbieter'])},"
        f"{q(common['ki_modell'])},{jsonb(common['ki_metadaten'])},{common['qualitaetswert']},"
        f"{jsonb(common['qualitaetsmetadaten'])}) on conflict (id) do nothing;"
    )
    link_content(out, content_id, lernziel_ids, quelle_id)
    return content_id


def insert_lerneinheit(
    out: list[str],
    ids: dict[str, str],
    meta: dict[str, Any],
    title: str,
    content_type: str,
    mdx: str,
    minutes: int,
    order: int,
    lernziel_ids: list[str],
    quelle_id: str,
) -> str:
    """Schreibt eine Demo-Lerneinheit und ihr Content-Element."""
    common = demo_common(meta)
    le_id = uid("demo-lerneinheit", ids["unterthema"], title)
    abschnitte = [{"titel": title, "inhalt": mdx, "minuten": minutes}]
    quellen = [{"titel": "KI-Demo-Seed MAF", "hinweis": DEMO_LABEL}]
    out.append(
        "insert into lerneinheiten (id,thema_id,titel,inhalt_mdx,abschnitte,lesedauer_minuten,"
        "reihenfolge,status,quellenangaben,beschreibung,content_typ,schwierigkeitsgrad,"
        "content_status,ist_demo,demo_sichtbar,demo_label,fachlich_verifiziert,quellenart,"
        "ki_anbieter,ki_modell,ki_metadaten,qualitaetswert,qualitaetsmetadaten) values ("
        f"{q(le_id)},{q(ids['unterthema'])},{q(title)},{q(mdx)},{jsonb(abschnitte)},"
        f"{minutes},{order},'entwurf',{jsonb(quellen)},{q(DEMO_LABEL)},{q(content_type)},"
        f"{q(schwierigkeitsgrad(order))},'generiert',true,true,{q(common['demo_label'])},"
        f"false,'demo',{q(common['ki_anbieter'])},{q(common['ki_modell'])},"
        f"{jsonb(common['ki_metadaten'])},{common['qualitaetswert']},"
        f"{jsonb(common['qualitaetsmetadaten'])}) on conflict (id) do nothing;"
    )
    insert_content_element(
        out,
        TRAEGER,
        ids,
        meta,
        title,
        content_type,
        {"mdx": mdx, "lesedauer_minuten": minutes},
        schwierigkeitsgrad(order),
        lernziel_ids,
        quelle_id,
        lerneinheit_id=le_id,
    )
    return le_id


def insert_lernkarte(
    out: list[str],
    traeger_id: str,
    ids: dict[str, str],
    meta: dict[str, Any],
    card: dict[str, str],
    index: int,
    lernziel_ids: list[str],
    quelle_id: str,
) -> None:
    """Schreibt eine Lernkarte als Content-Element plus lernkarten-Zeile."""
    content_id = insert_content_element(
        out,
        traeger_id,
        ids,
        meta,
        card["titel"],
        "lernkarte",
        card,
        schwierigkeitsgrad(index),
        lernziel_ids,
        quelle_id,
    )
    karte_id = uid("demo-lernkarte", content_id)
    out.append(
        "insert into lernkarten (id,content_element_id,vorderseite,rueckseite,merksatz) values ("
        f"{q(karte_id)},{q(content_id)},{q(card['vorderseite'])},{q(card['rueckseite'])},"
        f"{q(card.get('merksatz'))}) on conflict (id) do nothing;"
    )


def insert_frage(
    out: list[str],
    traeger_id: str,
    ids: dict[str, str],
    meta: dict[str, Any],
    frage_ref: str,
    title: str,
    content_type: str,
    frage: dict[str, Any],
    index: int,
    lernziel_ids: list[str],
    quelle_id: str,
) -> str:
    """Schreibt eine Demo-Frage in die bestehende Fragenstruktur."""
    common = demo_common(meta)
    frage_id = uid("frage", frage_ref)
    contains_number = content_type == "rechenaufgabe"
    out.append(
        "insert into fragen (id,thema_id,typ,aufgabenstellung,schwierigkeit,status,kern,"
        "ki_generiert,quellenstufe,tabellenbuch_fundstelle,enthaelt_zahlenwert,quell_ref,"
        "beschreibung,content_typ,schwierigkeitsgrad,content_status,ist_demo,demo_sichtbar,"
        "demo_label,fachlich_verifiziert,quellenart,ki_anbieter,ki_modell,ki_metadaten,"
        "qualitaetswert,qualitaetsmetadaten) values ("
        f"{q(frage_id)},{q(ids['unterthema'])},'mc',{q(frage['aufgabenstellung'])},"
        f"{schwierigkeit_nummer(index)},'entwurf',false,true,1,null,{q(contains_number)},"
        f"{q(frage_ref)},{q(DEMO_LABEL)},{q(content_type)},{q(schwierigkeitsgrad(index))},"
        f"'generiert',true,true,{q(common['demo_label'])},false,'demo',"
        f"{q(common['ki_anbieter'])},{q(common['ki_modell'])},{jsonb(common['ki_metadaten'])},"
        f"{common['qualitaetswert']},{jsonb(common['qualitaetsmetadaten'])}) "
        "on conflict (id) do nothing;"
    )
    for option_index, option in enumerate(frage["optionen"], start=1):
        option_id = uid("opt", frage_ref, option_index)
        out.append(
            "insert into antwortoptionen (id,frage_id,text,ist_korrekt,erklaerung,reihenfolge) values "
            f"({q(option_id)},{q(frage_id)},{q(option['text'])},{q(option['ist_korrekt'])},"
            f"{q(option.get('erklaerung'))},{option_index}) on conflict (id) do nothing;"
        )
    insert_content_element(
        out,
        traeger_id,
        ids,
        meta,
        title,
        content_type,
        {"aufgabenstellung": frage["aufgabenstellung"], "optionen": frage["optionen"]},
        schwierigkeitsgrad(index),
        lernziel_ids,
        quelle_id,
        frage_id=frage_id,
    )
    return frage_id


def insert_demo_content(
    out: list[str],
    slug: str,
    beruf_id: str,
    phase_id: str,
    start_order: int,
    docs: list[dict[str, Any]],
) -> dict[str, int]:
    """Schreibt den Demo-Content fuer einen Beruf und liefert Zaehler."""
    stats = collections.Counter()
    for doc_index, doc in enumerate(docs, start=1):
        meta = doc["meta"]
        pb_id = uid("demo-pbereich", beruf_id, meta["fachbereich_code"])
        quelle_id = uid("demo-quelle", slug, meta["fachbereich_code"])
        out.append(f"-- Demo-Content: {meta['fachbereich']}")
        out.append(
            "update traeger set einstellungen = coalesce(einstellungen, '{}'::jsonb) "
            "|| '{\"flag_demo_content\": true}'::jsonb "
            f"where id = {q(TRAEGER)};"
        )
        out.append(
            "insert into pruefungsbereiche (id,beruf_id,phase_id,bezeichnung,gewichtung_prozent,"
            "pruefungsdauer_minuten,reihenfolge,code,beschreibung) values ("
            f"{q(pb_id)},{q(beruf_id)},{q(phase_id)},{q(meta['fachbereich'])},0,null,"
            f"{start_order + doc_index},{q(meta['fachbereich_code'])},{q(meta['beschreibung'])}) "
            "on conflict (id) do nothing;"
        )
        out.append(
            "insert into content_quellen (id,traeger_id,titel,beschreibung,quellenart,referenz,"
            "ist_demo,demo_sichtbar,fachlich_verifiziert) values ("
            f"{q(quelle_id)},{q(TRAEGER)},{q('KI-Demo-Seed MAF')},{q(meta['beschreibung'])},"
            f"'demo',{q(meta['fachbereich_code'])},true,true,false) on conflict (id) do nothing;"
        )
        stats["fachbereiche"] += 1

        for thema_index, thema in enumerate(doc["themen"], start=1):
            thema_id = uid("demo-thema", pb_id, thema["code"])
            thema_beschreibung = (
                f"Demo-Thema {thema['bezeichnung']} fuer Maschinen- und Anlagenfuehrer/-innen."
            )
            out.append(
                "insert into themen (id,pruefungsbereich_id,parent_id,bezeichnung,code,beschreibung,"
                "reihenfolge) values ("
                f"{q(thema_id)},{q(pb_id)},null,{q(thema['bezeichnung'])},{q(thema['code'])},"
                f"{q(thema_beschreibung)},{thema_index}) on conflict (id) do nothing;"
            )
            stats["themen"] += 1

            for unter_index, unterthema in enumerate(thema["unterthemen"], start=1):
                unter_code = f"{thema['code']}-{code(unterthema)}"
                unter_id = uid("demo-unterthema", thema_id, unter_code)
                ids = {"pb": pb_id, "thema": thema_id, "unterthema": unter_id}
                beschreibung = (
                    f"Demo-Unterthema {unterthema} mit Lernzielen, Erklaerungen, "
                    "Lernkarten und Uebungsfragen."
                )
                out.append(
                    "insert into themen (id,pruefungsbereich_id,parent_id,bezeichnung,code,"
                    "beschreibung,reihenfolge) values ("
                    f"{q(unter_id)},{q(pb_id)},{q(thema_id)},{q(unterthema)},"
                    f"{q(unter_code)},{q(beschreibung)},{unter_index}) on conflict (id) do nothing;"
                )
                stats["unterthemen"] += 1

                lernziel_ids = [
                    insert_lernziel(
                        out,
                        TRAEGER,
                        pb_id,
                        thema_id,
                        unter_id,
                        meta,
                        title,
                        description,
                        ziel_index,
                    )
                    for ziel_index, (title, description) in enumerate(
                        lernzieltexte(unterthema, thema["bezeichnung"]),
                        start=1,
                    )
                ]
                stats["lernziele"] += len(lernziel_ids)

                insert_lerneinheit(
                    out,
                    ids,
                    meta,
                    f"{unterthema} - kurze Erklaerung",
                    "erklaerung",
                    erklaerung_kurz(unterthema, thema["bezeichnung"]),
                    3,
                    1,
                    lernziel_ids,
                    quelle_id,
                )
                insert_lerneinheit(
                    out,
                    ids,
                    meta,
                    f"{unterthema} - ausfuehrliche Erklaerung",
                    "erklaerung",
                    erklaerung_lang(unterthema, thema["bezeichnung"]),
                    7,
                    2,
                    lernziel_ids,
                    quelle_id,
                )
                stats["erklaerungen"] += 2

                for card_index, card in enumerate(
                    lernkarten(unterthema, thema["bezeichnung"]),
                    start=1,
                ):
                    insert_lernkarte(
                        out, TRAEGER, ids, meta, card, card_index, lernziel_ids, quelle_id
                    )
                    stats["lernkarten"] += 1

                for frage_index in (1, 2):
                    frage_ref = f"{unter_code}-SC-{frage_index:02d}"
                    insert_frage(
                        out,
                        TRAEGER,
                        ids,
                        meta,
                        frage_ref,
                        f"{unterthema} - Single Choice {frage_index}",
                        "single_choice",
                        single_choice(unterthema, thema["bezeichnung"], frage_index),
                        frage_index,
                        lernziel_ids,
                        quelle_id,
                    )
                    stats["fragen"] += 1

                insert_frage(
                    out,
                    TRAEGER,
                    ids,
                    meta,
                    f"{unter_code}-MC-01",
                    f"{unterthema} - Multiple Choice",
                    "multiple_choice",
                    multiple_choice(unterthema, thema["bezeichnung"]),
                    3,
                    lernziel_ids,
                    quelle_id,
                )
                stats["fragen"] += 1

                insert_content_element(
                    out,
                    TRAEGER,
                    ids,
                    meta,
                    f"{unterthema} - Praxisfall",
                    "praxisfall",
                    praxisfall(unterthema, thema["bezeichnung"]),
                    "mittel",
                    lernziel_ids,
                    quelle_id,
                )
                stats["praxisfaelle"] += 1

                if unterthema in RECHEN_UNTERTHEMEN:
                    insert_content_element(
                        out,
                        TRAEGER,
                        ids,
                        meta,
                        f"{unterthema} - Rechenaufgabe mit Beispielwerten",
                        "rechenaufgabe",
                        rechenaufgabe(unterthema),
                        "mittel",
                        lernziel_ids,
                        quelle_id,
                    )
                    stats["rechenaufgaben"] += 1

                insert_lerneinheit(
                    out,
                    ids,
                    meta,
                    f"{unterthema} - Zusammenfassung",
                    "zusammenfassung",
                    zusammenfassung(unterthema, thema["bezeichnung"]),
                    2,
                    3,
                    lernziel_ids,
                    quelle_id,
                )
                stats["zusammenfassungen"] += 1

        out.append("")
    return dict(stats)


TRAEGER = uid("traeger", "bze")
SCHLUESSEL = uid("schluessel", "ihk100")
berufe = load_pools()
demo_content = load_demo_content()
quellen = [p.name for p in POOLS] + [p.name for p in DEMO_CONTENT_FILES]

out = [
    "-- AUTOGENERIERT von scripts/generate_seed.py - nicht von Hand aendern.",
    "-- Quelle: " + ", ".join(quellen),
    "begin;\n",
]

out.append(
    f"insert into traeger (id,name,slug) values ({q(TRAEGER)},"
    f"{q('Berufsbildungszentrum Euskirchen')},{q('bze')}) on conflict (id) do nothing;"
)

KAMMERN = {
    "IHK": (uid("kammer", "ihk-aachen"), "IHK Aachen", "IHK", "Theaterstrasse 6-10, 52062 Aachen"),
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

stufen = [
    {"von": 92, "bis": 100, "note": 1, "bezeichnung": "sehr gut"},
    {"von": 81, "bis": 91, "note": 2, "bezeichnung": "gut"},
    {"von": 67, "bis": 80, "note": 3, "bezeichnung": "befriedigend"},
    {"von": 50, "bis": 66, "note": 4, "bezeichnung": "ausreichend"},
    {"von": 30, "bis": 49, "note": 5, "bezeichnung": "mangelhaft"},
    {"von": 0, "bis": 29, "note": 6, "bezeichnung": "ungenuegend"},
]
out.append(
    "insert into bewertungsschluessel (id,name,stufen,bestehensgrenze) values "
    f"({q(SCHLUESSEL)},{q('IHK 100-Punkte-Schluessel')},{jsonb(stufen)},50) "
    "on conflict (id) do nothing;"
)
out.append("")

statistik = []
demo_statistik = collections.Counter()
for slug, eintrag in berufe.items():
    meta = eintrag["meta"]
    if not eintrag["pruefungsbereiche"]:
        raise SystemExit(f"Beruf {slug}: keine Charge definiert Pruefungsbereiche")
    beruf_id = uid("beruf", slug)
    kammer_id = KAMMERN[meta.get("kammer", "IHK")][0]
    phase1 = uid("phase", beruf_id, 1)
    phase2 = uid("phase", beruf_id, 2)

    out.append(f"-- Beruf: {meta['beruf']}")
    out.append(
        "insert into berufe (id,traeger_id,kammer_id,bezeichnung,dauer_monate,"
        "bewertungsschluessel_id) values "
        f"({q(beruf_id)},{q(TRAEGER)},{q(kammer_id)},{q(meta['bezeichnung_lang'])},"
        f"{meta.get('dauer_monate_umschulung') or 'null'},{q(SCHLUESSEL)}) "
        "on conflict (id) do nothing;"
    )
    out.append(
        "insert into ausbildungsphasen (id,beruf_id,bezeichnung,reihenfolge,zielpruefung,"
        "mindest_wochenpruefungen) values "
        f"({q(phase1)},{q(beruf_id)},{q('Phase 1 - bis zur Zwischenpruefung')},"
        "1,'zwischenpruefung',4),"
        f"({q(phase2)},{q(beruf_id)},{q('Phase 2 - bis zur Abschlusspruefung')},"
        "2,'abschlusspruefung',4) on conflict (id) do nothing;"
    )

    themen_uuid = {}
    for pb_index, pb in enumerate(eintrag["pruefungsbereiche"], start=1):
        pb_id = uid("pbereich", beruf_id, pb["code"])
        phase = phase1 if pb.get("phase") == 1 else phase2
        out.append(
            "insert into pruefungsbereiche (id,beruf_id,phase_id,bezeichnung,"
            "gewichtung_prozent,pruefungsdauer_minuten,reihenfolge) values "
            f"({q(pb_id)},{q(beruf_id)},{q(phase)},{q(pb['bezeichnung'])},"
            f"{q(pb.get('gewichtung_prozent') or 0)},{q(pb.get('pruefungsdauer_minuten'))},"
            f"{pb_index}) on conflict (id) do nothing;"
        )
        for thema_index, thema in enumerate(pb["themen"], start=1):
            thema_id = uid("thema", pb_id, thema["code"])
            themen_uuid[thema["code"]] = thema_id
            out.append(
                "insert into themen (id,pruefungsbereich_id,bezeichnung,code,reihenfolge) "
                f"values ({q(thema_id)},{q(pb_id)},{q(thema['bezeichnung'])},"
                f"{q(thema['code'])},{thema_index}) on conflict (id) do nothing;"
            )

    mc = ft = 0
    for frage in eintrag["fragen"]:
        frage_id = uid("frage", frage["id"])
        thema_id = themen_uuid.get(frage["thema"])
        if not thema_id:
            raise SystemExit(f"Unbekanntes Thema {frage['thema']} in Frage {frage['id']}")
        out.append(
            "insert into fragen (id,thema_id,typ,aufgabenstellung,schwierigkeit,status,kern,"
            "ki_generiert,quellenstufe,tabellenbuch_fundstelle,enthaelt_zahlenwert,quell_ref) "
            "values ("
            f"{q(frage_id)},{q(thema_id)},{q(frage['typ'])},{q(frage['aufgabenstellung'])},"
            f"{frage.get('schwierigkeit') or 'null'},'entwurf',{q(frage.get('kern', False))},"
            f"false,{frage.get('quellenstufe') or 'null'},"
            f"{jsonb(frage.get('tabellenbuch_fundstelle'))},"
            f"{q(frage.get('enthaelt_zahlenwert', False))},{q(frage['id'])}) "
            "on conflict (id) do nothing;"
        )
        for normbezug in frage.get("normbezuege", []) or []:
            norm_id = uid("norm", normbezug)
            out.append(
                "insert into normen (id,nummer,status) values "
                f"({q(norm_id)},{q(normbezug)},'gueltig') on conflict (id) do nothing;"
            )
            out.append(
                "insert into frage_normen (frage_id,norm_id) values "
                f"({q(frage_id)},{q(norm_id)}) on conflict do nothing;"
            )
        if frage["typ"] == "mc":
            mc += 1
            for option_index, option in enumerate(frage["optionen"], start=1):
                option_id = uid("opt", frage["id"], option_index)
                out.append(
                    "insert into antwortoptionen (id,frage_id,text,ist_korrekt,erklaerung,"
                    "reihenfolge) values "
                    f"({q(option_id)},{q(frage_id)},{q(option['text'])},"
                    f"{q(option['ist_korrekt'])},{q(option.get('erklaerung'))},"
                    f"{option_index}) on conflict (id) do nothing;"
                )
        else:
            ft += 1
            raster = frage["bewertungsraster"]
            out.append(
                "insert into freitext_loesungen (frage_id,musterloesung,bewertungsraster,"
                "max_punkte) values "
                f"({q(frage_id)},{q(frage['musterloesung'])},{jsonb(raster)},"
                f"{raster.get('max_punkte', 4)}) on conflict (frage_id) do nothing;"
            )

    if demo_content.get(slug):
        demo_stats = insert_demo_content(
            out,
            slug,
            beruf_id,
            phase2,
            len(eintrag["pruefungsbereiche"]),
            demo_content[slug],
        )
        demo_statistik.update(demo_stats)

    out.append("")
    statistik.append((meta["beruf"], len(eintrag["pruefungsbereiche"]), len(themen_uuid), mc, ft))

out.append("commit;")
gesamt_mc = sum(s[3] for s in statistik)
gesamt_ft = sum(s[4] for s in statistik)
out.append(f"-- {len(statistik)} Berufe, {gesamt_mc} MC-Fragen, {gesamt_ft} Freitext-Fragen.")
if demo_statistik:
    out.append(
        "-- Demo-Content: " + json.dumps(dict(demo_statistik), ensure_ascii=False, sort_keys=True)
    )

target = SEED_DIR / "0001_maf_seed.sql"
target.write_text("\n".join(out), encoding="utf-8")
print(f"OK: {target.name} geschrieben.")
for name, pruefungsbereiche, themen, mc, ft in statistik:
    print(
        f"  {name}: {pruefungsbereiche} Pruefungsbereiche, {themen} Themen, {mc} MC, {ft} Freitext"
    )
print(f"  Gesamt: {gesamt_mc} MC, {gesamt_ft} Freitext, {gesamt_mc + gesamt_ft} Fragen")
if demo_statistik:
    print("  Demo-Content:")
    for key in sorted(demo_statistik):
        print(f"    {key}: {demo_statistik[key]}")
