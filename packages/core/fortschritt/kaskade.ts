import type {
  BereichMeta,
  FortsetzenEmpfehlung,
  Gate,
  GateStatus,
  KernStand,
  LerneinheitStand,
  PhaseMeta,
  PruefungStand,
  PruefungsreifeStand,
  ThemaMeta,
} from './types';

export function anteil(fertig: number, gesamt: number): number {
  if (gesamt <= 0) return 0;
  return Math.min(1, fertig / gesamt);
}

export function prozent(fertig: number, gesamt: number): number {
  return Math.round(anteil(fertig, gesamt) * 100);
}

/** Lerneinheit abgeschlossen: alle Abschnitte gelesen (Spec §4.2). */
export function lerneinheitFertig(le: LerneinheitStand): boolean {
  return le.abschnitteGesamt > 0 && le.abschnitteGelesen >= le.abschnitteGesamt;
}

/** Fachkunde eines Topics: alle Lerneinheiten gelesen — ohne LE gilt als erledigt. */
export function fachkundeFertig(les: LerneinheitStand[]): boolean {
  if (les.length === 0) return true;
  return les.every(lerneinheitFertig);
}

/** Topic: Fachkunde gelesen UND alle Kernfragen abgeschlossen. */
export function topicFertig(kern: KernStand, les: LerneinheitStand[]): boolean {
  const kernOk = kern.kernGesamt > 0 && kern.kernFertig >= kern.kernGesamt;
  return kernOk && fachkundeFertig(les);
}

export function bereichFertig(
  themen: ThemaMeta[],
  kernJeThema: Map<string, KernStand>,
  lesJeThema: Map<string, LerneinheitStand[]>,
): boolean {
  if (themen.length === 0) return false;
  return themen.every((t) => {
    const kern = kernJeThema.get(t.id) ?? { themaId: t.id, kernGesamt: 0, kernFertig: 0 };
    if (kern.kernGesamt === 0) return false;
    return topicFertig(kern, lesJeThema.get(t.id) ?? []);
  });
}

/** Phase: alle Fachgebiete + mindest_wochenpruefungen mit ≥ 50 Punkten. */
export function phaseFertig(
  bereiche: BereichMeta[],
  themenJeBereich: Map<string, ThemaMeta[]>,
  kernJeThema: Map<string, KernStand>,
  lesJeThema: Map<string, LerneinheitStand[]>,
  pruefungen: PruefungStand[],
  mindestWochenpruefungen: number,
): boolean {
  if (bereiche.length === 0) return false;
  const bereicheOk = bereiche.every((b) =>
    bereichFertig(themenJeBereich.get(b.id) ?? [], kernJeThema, lesJeThema),
  );
  const pruefOk = pruefungen.filter((p) => (p.gesamtpunkte ?? 0) >= 50).length;
  return bereicheOk && pruefOk >= mindestWochenpruefungen;
}

function gateStatus(fertig: boolean, empfehlungAktiv: boolean): GateStatus {
  if (fertig) return 'erreicht';
  if (empfehlungAktiv) return 'offen';
  return 'offen';
}

/**
 * Baut die sichtbaren Gates der Kaskade (keine Inhaltssperre — Spec §2 Regel 11).
 * `empfehlungThemaId` markiert das nächste sinnvolle Topic.
 */
export function baueGates(input: {
  themen: ThemaMeta[];
  bereiche: BereichMeta[];
  phasen: PhaseMeta[];
  kernJeThema: Map<string, KernStand>;
  lesJeThema: Map<string, LerneinheitStand[]>;
  pruefungen: PruefungStand[];
  pruefungsreifen: PruefungsreifeStand[];
  empfehlungThemaId: string | null;
}): Gate[] {
  const {
    themen, bereiche, phasen, kernJeThema, lesJeThema,
    pruefungen, pruefungsreifen, empfehlungThemaId,
  } = input;
  const gates: Gate[] = [];
  const themenJeBereich = new Map<string, ThemaMeta[]>();
  for (const t of themen) {
    const list = themenJeBereich.get(t.bereichId) ?? [];
    list.push(t);
    themenJeBereich.set(t.bereichId, list);
  }

  for (const t of [...themen].sort((a, b) => a.reihenfolge - b.reihenfolge)) {
    const kern = kernJeThema.get(t.id) ?? { themaId: t.id, kernGesamt: 0, kernFertig: 0 };
    const les = lesJeThema.get(t.id) ?? [];
    const fertig = topicFertig(kern, les);
    const leseHinweis = les.some((l) => l.lesezeitUnterschritten);
    // Themen ohne freigegebene Kernfragen ausblenden — sonst leere 0 %-Zeilen.
    if (kern.kernGesamt <= 0) continue;
    gates.push({
      ebene: 'topic',
      id: t.id,
      bezeichnung: t.bezeichnung,
      status: gateStatus(fertig, empfehlungThemaId === t.id),
      anteil: anteil(kern.kernFertig, kern.kernGesamt),
      fertig: kern.kernFertig,
      gesamt: kern.kernGesamt,
      hinweis: leseHinweis ? 'lesezeit' : undefined,
    });
  }

  for (const b of [...bereiche].sort((a, b) => a.reihenfolge - b.reihenfolge)) {
    const ts = themenJeBereich.get(b.id) ?? [];
    const fertig = bereichFertig(ts, kernJeThema, lesJeThema);
    const kernG = ts.reduce((s, t) => s + (kernJeThema.get(t.id)?.kernGesamt ?? 0), 0);
    const kernF = ts.reduce((s, t) => s + (kernJeThema.get(t.id)?.kernFertig ?? 0), 0);
    if (kernG <= 0) continue;
    gates.push({
      ebene: 'fachgebiet',
      id: b.id,
      bezeichnung: b.bezeichnung,
      status: fertig ? 'erreicht' : 'offen',
      anteil: anteil(kernF, kernG),
      fertig: kernF,
      gesamt: kernG,
    });
  }

  for (const ph of [...phasen].sort((a, b) => a.reihenfolge - b.reihenfolge)) {
    const bs = bereiche.filter((b) => b.phaseId === ph.id);
    const fertig = phaseFertig(bs, themenJeBereich, kernJeThema, lesJeThema, pruefungen, ph.mindestWochenpruefungen);
    const kernG = bs.reduce(
      (s, b) => s + (themenJeBereich.get(b.id) ?? []).reduce((x, t) => x + (kernJeThema.get(t.id)?.kernGesamt ?? 0), 0),
      0,
    );
    const kernF = bs.reduce(
      (s, b) => s + (themenJeBereich.get(b.id) ?? []).reduce((x, t) => x + (kernJeThema.get(t.id)?.kernFertig ?? 0), 0),
      0,
    );
    if (kernG <= 0 && !pruefungsreifen.some((r) => r.phaseId === ph.id)) continue;
    const reife = pruefungsreifen.find((r) => r.phaseId === ph.id);
    let status: GateStatus = fertig ? 'erreicht' : 'offen';
    if (reife?.ausbilderBestaetigtAm) status = 'bestaetigt';
    else if (reife?.kriterienErfuelltAm) status = 'empfohlen';

    gates.push({
      ebene: fertig || reife ? 'pruefungsreife' : 'phase',
      id: ph.id,
      bezeichnung: ph.bezeichnung,
      status,
      anteil: anteil(kernF, kernG),
      fertig: kernF,
      gesamt: kernG,
    });
  }

  return gates;
}

/**
 * Genau eine Fortsetzen-Empfehlung: nächstes sinnvolles Topic (Spec §4.2).
 * Priorität: offene Kernfragen (zuerst falsch/teilweise via niedrigem Anteil),
 * sonst ungelesene Fachkunde, sonst erstes unfertiges Topic in Reihenfolge.
 */
export function fortsetzenEmpfehlung(
  themen: ThemaMeta[],
  kernJeThema: Map<string, KernStand>,
  lesJeThema: Map<string, LerneinheitStand[]>,
): FortsetzenEmpfehlung | null {
  const sortiert = [...themen].sort((a, b) => a.reihenfolge - b.reihenfolge);

  // 1) Topic mit offenen Kernfragen, geringster Anteil zuerst
  const mitOffen = sortiert
    .map((t) => {
      const k = kernJeThema.get(t.id) ?? { themaId: t.id, kernGesamt: 0, kernFertig: 0 };
      return { t, k, offen: Math.max(0, k.kernGesamt - k.kernFertig) };
    })
    .filter((x) => x.offen > 0)
    .sort((a, b) => anteil(a.k.kernFertig, a.k.kernGesamt) - anteil(b.k.kernFertig, b.k.kernGesamt)
      || a.t.reihenfolge - b.t.reihenfolge);

  if (mitOffen[0]) {
    const { t, k, offen } = mitOffen[0];
    return {
      themaId: t.id,
      bezeichnung: t.bezeichnung,
      grund: 'kernfragen',
      kernOffen: offen,
      anteil: anteil(k.kernFertig, k.kernGesamt),
    };
  }

  // 2) Fachkunde noch offen
  for (const t of sortiert) {
    const les = lesJeThema.get(t.id) ?? [];
    if (!fachkundeFertig(les)) {
      const k = kernJeThema.get(t.id) ?? { themaId: t.id, kernGesamt: 0, kernFertig: 0 };
      return {
        themaId: t.id,
        bezeichnung: t.bezeichnung,
        grund: 'fachkunde',
        kernOffen: 0,
        anteil: anteil(k.kernFertig, k.kernGesamt),
      };
    }
  }

  // 3) Sonst erstes Topic (Wiederholung / Orientierung)
  const first = sortiert[0];
  if (!first) return null;
  const k = kernJeThema.get(first.id) ?? { themaId: first.id, kernGesamt: 0, kernFertig: 0 };
  return {
    themaId: first.id,
    bezeichnung: first.bezeichnung,
    grund: 'naechstes',
    kernOffen: 0,
    anteil: anteil(k.kernFertig, k.kernGesamt),
  };
}

/** Gesamtfortschritt Beruf = Kern fertig / Kern gesamt über alle Themen. */
export function berufFortschrittProzent(kernJeThema: Map<string, KernStand>): number {
  let g = 0;
  let f = 0;
  for (const k of kernJeThema.values()) {
    g += k.kernGesamt;
    f += k.kernFertig;
  }
  return prozent(f, g);
}
