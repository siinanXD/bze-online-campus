import type {
  FachkundeFormel,
  FachkundeFreigabeInventarZeile,
  FachkundeGlossarBegriff,
  FachkundeReviewStatus,
} from './types';
import { fachkundeFreigabeInventarZeileSchema } from './types';

const PFLICHT_BAUSTEINE = [
  { key: 'hatStory', muster: /<StoryEinstieg[\s>]/ },
  { key: 'hatEinfach', muster: /<EinfachErklaert[\s>]/ },
  { key: 'hatFachlich', muster: /<FachlichErklaert[\s>]/ },
  { key: 'hatMerksatz', muster: /<Merksatz[\s>]/ },
  { key: 'hatQuiz', muster: /<MiniWissenscheck[\s>]/ },
  { key: 'hatBegriffe', muster: /<BegriffListe[\s>]/ },
] as const;

/**
 * Extrahiert einen einfachen YAML-Frontmatter-Block aus MDX.
 */
export function extrahiereMdxFrontmatter(quelltext: string): Record<string, unknown> {
  const treffer = quelltext.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!treffer) return {};
  const roh = treffer[1] ?? '';
  const ergebnis: Record<string, unknown> = {};
  let aktuellerSchluessel: string | null = null;
  let listenModus: 'quellen' | null = null;
  let aktuelleQuelle: Record<string, unknown> | null = null;

  for (const rohZeile of roh.split(/\r?\n/)) {
    const zeile = rohZeile.trimEnd();
    if (!zeile.trim()) continue;

    if (zeile.startsWith('quellen:')) {
      ergebnis.quellen = [];
      listenModus = 'quellen';
      aktuelleQuelle = null;
      aktuellerSchluessel = null;
      continue;
    }

    if (listenModus === 'quellen') {
      const listenEintrag = zeile.match(/^\s*-\s+titel:\s*"(.*)"\s*$/);
      if (listenEintrag) {
        aktuelleQuelle = { titel: listenEintrag[1], status: 'offen' };
        (ergebnis.quellen as Record<string, unknown>[]).push(aktuelleQuelle);
        continue;
      }
      const listenFeld = zeile.match(/^\s{2,}([a-z_]+):\s*(?:"(.*)"|(.+))\s*$/);
      if (listenFeld && aktuelleQuelle) {
        const wert = (listenFeld[2] ?? listenFeld[3] ?? '').trim();
        aktuelleQuelle[listenFeld[1]!] = wert === 'null' ? null : wert;
        continue;
      }
      if (!zeile.startsWith(' ') && !zeile.startsWith('-')) {
        listenModus = null;
        aktuelleQuelle = null;
      } else {
        continue;
      }
    }

    if (zeile.startsWith('fachliche_freigabe:')) {
      ergebnis.fachliche_freigabe = {};
      aktuellerSchluessel = 'fachliche_freigabe';
      continue;
    }

    if (aktuellerSchluessel === 'fachliche_freigabe') {
      const freigabeFeld = zeile.match(/^\s{2,}([a-z_]+):\s*(?:"(.*)"|(.+))\s*$/);
      if (freigabeFeld) {
        const rohWert = (freigabeFeld[2] ?? freigabeFeld[3] ?? '').trim();
        const freigabe = ergebnis.fachliche_freigabe as Record<string, unknown>;
        if (rohWert === 'true' || rohWert === 'false') freigabe[freigabeFeld[1]!] = rohWert === 'true';
        else if (rohWert === 'null') freigabe[freigabeFeld[1]!] = null;
        else freigabe[freigabeFeld[1]!] = rohWert;
        continue;
      }
      if (!zeile.startsWith(' ')) aktuellerSchluessel = null;
      else continue;
    }

    const einfach = zeile.match(/^([a-z_]+):\s*(?:"(.*)"|(.+))\s*$/);
    if (einfach) {
      const rohWert = (einfach[2] ?? einfach[3] ?? '').trim();
      if (rohWert === 'true' || rohWert === 'false') ergebnis[einfach[1]!] = rohWert === 'true';
      else if (/^\d+$/.test(rohWert)) ergebnis[einfach[1]!] = Number(rohWert);
      else if (rohWert === 'null') ergebnis[einfach[1]!] = null;
      else ergebnis[einfach[1]!] = rohWert;
    }
  }

  return ergebnis;
}

/**
 * Baut eine Freigabe-Inventarzeile aus MDX-Slug und Quelltext.
 */
export function baueFreigabeInventarZeile(slug: string, quelltext: string): FachkundeFreigabeInventarZeile {
  const fm = extrahiereMdxFrontmatter(quelltext);
  const freigabe = (fm.fachliche_freigabe as Record<string, unknown> | undefined) ?? {};
  const quellen = Array.isArray(fm.quellen) ? (fm.quellen as Array<Record<string, unknown>>) : [];
  const quellenOffen =
    quellen.length === 0 || quellen.some((quelle) => (quelle.status ?? 'offen') === 'offen');
  const bausteine = Object.fromEntries(
    PFLICHT_BAUSTEINE.map(({ key, muster }) => [key, muster.test(quelltext)]),
  ) as Record<(typeof PFLICHT_BAUSTEINE)[number]['key'], boolean>;

  const reviewStatus = (fm.review_status as FachkundeReviewStatus | undefined) ?? 'entwurf';
  const fragenStatusRoh = String(fm.fragen_status ?? 'entwurf');
  const fragenStatus =
    fragenStatusRoh === 'freigegeben' ? ('freigegeben' as const) : ('entwurf' as const);
  const freigabeErforderlich = freigabe.erforderlich !== false;
  const bereitFuerFachpruefung =
    Object.values(bausteine).every(Boolean) &&
    Boolean(fm.titel) &&
    Boolean(fm.thema_code) &&
    quellen.length > 0 &&
    reviewStatus === 'entwurf';

  const erlaubteZahlenwerte: FachkundeFreigabeInventarZeile['zahlenwerteStatus'][] = [
    'uebungswerte',
    'beispielwerte',
    'quellenwert',
    'quellenpflichtig',
    'keine_zahlenwerte',
  ];
  const rohZahlenwerte = String(fm.zahlenwerte_status ?? 'uebungswerte');
  const zahlenwerteStatus = erlaubteZahlenwerte.includes(
    rohZahlenwerte as FachkundeFreigabeInventarZeile['zahlenwerteStatus'],
  )
    ? (rohZahlenwerte as FachkundeFreigabeInventarZeile['zahlenwerteStatus'])
    : 'uebungswerte';

  return fachkundeFreigabeInventarZeileSchema.parse({
    slug,
    titel: String(fm.titel ?? slug),
    themaCode: String(fm.thema_code ?? 'UNBEKANNT'),
    reviewStatus,
    fragenStatus,
    zahlenwerteStatus,
    freigabeErforderlich,
    freigegebenVon: (freigabe.freigegeben_von as string | null | undefined) ?? null,
    quellenOffen,
    ...bausteine,
    bereitFuerFachpruefung,
  });
}

/**
 * Aggregiert Inventarstatistiken fuer Dashboard und CLI.
 */
export function aggregiereFreigabeInventar(zeilen: FachkundeFreigabeInventarZeile[]): {
  gesamt: number;
  entwurf: number;
  fachlichGeprueft: number;
  freigegeben: number;
  fragenFreigegeben: number;
  quellenOffen: number;
  bereitFuerFachpruefung: number;
  unvollstaendig: number;
} {
  return {
    gesamt: zeilen.length,
    entwurf: zeilen.filter((z) => z.reviewStatus === 'entwurf').length,
    fachlichGeprueft: zeilen.filter((z) => z.reviewStatus === 'fachlich_geprueft').length,
    freigegeben: zeilen.filter((z) => z.reviewStatus === 'freigegeben').length,
    fragenFreigegeben: zeilen.filter((z) => z.fragenStatus === 'freigegeben').length,
    quellenOffen: zeilen.filter((z) => z.quellenOffen).length,
    bereitFuerFachpruefung: zeilen.filter((z) => z.bereitFuerFachpruefung).length,
    unvollstaendig: zeilen.filter(
      (z) => !(z.hatStory && z.hatEinfach && z.hatFachlich && z.hatMerksatz && z.hatQuiz && z.hatBegriffe),
    ).length,
  };
}

/**
 * Prueft, ob ein Glossarbegriff fuer spaeteren DB-Import ausreichend spezifiziert ist.
 */
export function istGlossarbegriffImportfaehig(begriff: FachkundeGlossarBegriff): boolean {
  return (
    begriff.begriff.length > 0 &&
    begriff.einfacheErklaerung.length > 0 &&
    begriff.fachdefinition.length > 0 &&
    begriff.reviewStatus !== 'entwurf'
  );
}

/**
 * Prueft, ob eine Formel fuer spaeteren Formeltrainer-Import ausreichend spezifiziert ist.
 */
export function istFormelImportfaehig(formel: FachkundeFormel): boolean {
  return (
    formel.formelzeichen.length > 0 &&
    formel.einfacheErklaerung.length > 0 &&
    formel.fachlicheErklaerung.length > 0 &&
    formel.reviewStatus !== 'entwurf'
  );
}
