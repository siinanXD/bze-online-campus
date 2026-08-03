import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createServerSupabase } from '@bze/db/server';
import { Alert, Badge, Button, Card, LeerZustand, Progress, cn } from '@bze/ui';
import { holeAktuellenNutzerId, holeFortschrittFuerLerneinheiten } from '../../_lib/queries';
import { ladeLernmodulDaten } from '../../_lib/content-queries';
import {
  ermittleNaechstenLernschritt,
  extrahiereMerkpunkte,
  extrahiereRechenaufgabe,
  extrahiereTextinhalt,
  gruppiereContentElemente,
  istUngepruefterDemoInhalt,
  sortiereContentElemente,
  type ContentElementView,
} from '../../_lib/content-view-model';
import type { AntwortoptionZeile, ContentElementZeile, FrageZeile, LernkarteZeile } from '../../_lib/content-types';

/**
 * Aggregierte Lernmodul-Seite fuer die neuen Content-Typen.
 */
export default async function LernmodulSeite({
  params,
}: {
  params: Promise<{ locale: string; themaId: string }>;
}) {
  const { locale, themaId } = await params;
  const t = await getTranslations('topic.content');
  const labels: ModulLabels = {
    keineInhalte: t('leer.keineInhalte'),
    vorderseite: t('lernkarten.vorderseite'),
    rueckseite: t('lernkarten.rueckseite'),
    singleChoice: t('fragen.singleChoice'),
    multipleChoice: t('fragen.multipleChoice'),
    kernfrage: t('fragen.kernfrage'),
    richtig: t('fragen.richtig'),
    situation: t('praxisfall.situation'),
    aufgabe: t('praxisfall.aufgabe'),
    erwartung: t('praxisfall.erwartung'),
    keineAngabe: t('leer.keineAngabe'),
    gegebeneWerte: t('rechenaufgabe.gegebeneWerte'),
    gesuchteGroesse: t('rechenaufgabe.gesuchteGroesse'),
    formel: t('rechenaufgabe.formel'),
    loesungAnzeigen: t('rechenaufgabe.loesungAnzeigen'),
    loesungsweg: t('rechenaufgabe.loesungsweg'),
    ergebnis: t('rechenaufgabe.ergebnis'),
    erklaerung: t('rechenaufgabe.erklaerung'),
    werteInAufgabe: t('rechenaufgabe.werteInAufgabe'),
  };
  const supabase = await createServerSupabase();
  const daten = await ladeLernmodulDaten(supabase, themaId);
  if (!daten) notFound();

  const userId = await holeAktuellenNutzerId(supabase);
  const elemente = sortiereContentElemente(daten.contentElemente.map(zuContentElementView));
  const gruppen = gruppiereContentElemente(elemente);
  const lernkarten = new Map(daten.lernkarten.map((karte) => [karte.content_element_id, karte]));
  const fragen = new Map(daten.fragen.map((frage) => [frage.id, frage]));
  const lerneinheitIds = elemente
    .map((element) => element.lerneinheit_id)
    .filter((id): id is string => typeof id === 'string');
  const fortschritt = await holeFortschrittFuerLerneinheiten(supabase, userId, lerneinheitIds);
  const gelesen = lerneinheitIds.filter((id) => (fortschritt.get(id)?.size ?? 0) > 0).length;
  const fortschrittProzent = lerneinheitIds.length === 0 ? 0 : Math.round((gelesen / lerneinheitIds.length) * 100);
  const hatDemoWarnung =
    elemente.some(istUngepruefterDemoInhalt) ||
    daten.lernziele.some((lernziel) => lernziel.ist_demo && !lernziel.fachlich_verifiziert);
  const merksaetze = [
    ...gruppen.zusammenfassungen.flatMap((element) => extrahiereMerkpunkte(element.inhalt)),
    ...daten.lernkarten.map((karte) => karte.merksatz).filter((satz): satz is string => Boolean(satz)),
  ].slice(0, 6);
  const naechsterSchritt = ermittleNaechstenLernschritt(locale, daten.unterthema.id, daten.geschwister);

  return (
    <main className="mx-auto max-w-md space-y-4 px-5 pb-8 pt-3">
      <header className="space-y-2">
        <nav className="flex flex-wrap gap-1 text-[12px] font-semibold uppercase tracking-wide text-primary" aria-label={t('navigation.breadcrumb')}>
          {daten.fachbereich && (
            <Link href={`/${locale}/campus/topic/fachbereich/${daten.fachbereich.id}`}>{daten.fachbereich.bezeichnung}</Link>
          )}
          {daten.thema && (
            <>
              <span aria-hidden="true">/</span>
              <Link href={`/${locale}/campus/topic/${daten.thema.id}`}>{daten.thema.bezeichnung}</Link>
            </>
          )}
        </nav>
        <h1 className="text-2xl font-extrabold text-fg">{daten.unterthema.bezeichnung}</h1>
        {daten.unterthema.beschreibung && <p className="text-sm text-fg-muted">{daten.unterthema.beschreibung}</p>}
        <div className="flex flex-wrap gap-2">
          <Badge variante="primary" symbol="i">{t('modul.badge')}</Badge>
          {hatDemoWarnung && <Badge variante="warning" symbol="!">{t('hinweise.nichtVerifiziertKurz')}</Badge>}
        </div>
      </header>

      {hatDemoWarnung && (
        <Alert variante="warning" titel={t('hinweise.demoTitel')}>
          <p>{t('hinweise.demoText')}</p>
          <p>{t('hinweise.verifikationText')}</p>
        </Alert>
      )}

      {elemente.length === 0 ? (
        <LeerZustand titel={t('leer.modulTitel')} text={t('leer.modulText')} />
      ) : (
        <>
          {lerneinheitIds.length > 0 && (
            <Card>
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">{t('abschnitte.fortschritt')}</h2>
              <p className="mb-3 text-sm text-fg-muted">
                {t('fortschritt.leseeinheiten', { gelesen, gesamt: lerneinheitIds.length })}
              </p>
              <Progress wert={fortschrittProzent} label={t('abschnitte.fortschritt')} />
            </Card>
          )}

          <Abschnitt titel={t('abschnitte.lernziele')}>
            {daten.lernziele.length === 0 ? (
              <LeerText>{t('leer.lernziele')}</LeerText>
            ) : (
              <ul className="space-y-2">
                {daten.lernziele.map((lernziel) => (
                  <li key={lernziel.id} className="rounded-lg border border-border bg-bg p-3">
                    <p className="font-semibold">{lernziel.titel}</p>
                    {lernziel.beschreibung && <p className="mt-1 text-sm text-fg-muted">{lernziel.beschreibung}</p>}
                  </li>
                ))}
              </ul>
            )}
          </Abschnitt>

          <TextAbschnitt titel={t('abschnitte.einfuehrung')} element={gruppen.einfuehrungen[0]} labels={labels} />
          <TextAbschnitt titel={t('abschnitte.erklaerung')} element={gruppen.erklaerungen[0]} labels={labels} />

          <Abschnitt titel={t('abschnitte.praxisbeispiel')}>
            {gruppen.praxisfaelle[0] ? <Praxisfall element={gruppen.praxisfaelle[0]} labels={labels} /> : <LeerText>{t('leer.praxisfall')}</LeerText>}
          </Abschnitt>

          <Abschnitt titel={t('abschnitte.merkpunkte')}>
            {merksaetze.length === 0 ? (
              <LeerText>{t('leer.merkpunkte')}</LeerText>
            ) : (
              <ul className="list-disc space-y-1 pl-5 text-sm text-fg-muted">
                {merksaetze.map((punkt) => <li key={punkt}>{punkt}</li>)}
              </ul>
            )}
          </Abschnitt>

          <Abschnitt titel={t('abschnitte.lernkarten')}>
            {gruppen.lernkarten.length === 0 ? (
              <LeerText>{t('leer.lernkarten')}</LeerText>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {gruppen.lernkarten.map((element) => {
                  const karte = lernkarten.get(element.id);
                  return karte ? <Lernkarte key={karte.id} karte={karte} labels={labels} /> : null;
                })}
              </div>
            )}
          </Abschnitt>

          <Abschnitt titel={t('abschnitte.uebungen')}>
            {gruppen.uebungen.length === 0 ? (
              <LeerText>{t('leer.uebungen')}</LeerText>
            ) : (
              <div className="space-y-3">
                {gruppen.uebungen.map((element) => {
                  const frage = element.frage_id ? fragen.get(element.frage_id) : null;
                  return frage ? <FrageVorschau key={element.id} frage={frage} typ={element.content_typ} labels={labels} /> : null;
                })}
              </div>
            )}
          </Abschnitt>

          <Abschnitt titel={t('abschnitte.praxisfaelle')}>
            {gruppen.praxisfaelle.length === 0 ? (
              <LeerText>{t('leer.praxisfall')}</LeerText>
            ) : (
              <div className="space-y-3">{gruppen.praxisfaelle.map((element) => <Praxisfall key={element.id} element={element} labels={labels} />)}</div>
            )}
          </Abschnitt>

          <Abschnitt titel={t('abschnitte.rechenaufgaben')}>
            {gruppen.rechenaufgaben.length === 0 ? (
              <LeerText>{t('leer.rechenaufgaben')}</LeerText>
            ) : (
              <div className="space-y-3">
                {gruppen.rechenaufgaben.map((element) => <Rechenaufgabe key={element.id} element={element} labels={labels} />)}
              </div>
            )}
          </Abschnitt>

          <Abschnitt titel={t('abschnitte.quiz')}>
            <p className="text-sm text-fg-muted">{t('quiz.hinweis')}</p>
            <div className="mt-3">
              <Link href={`/${locale}/campus/lernen/thema/${daten.unterthema.id}`}>
                <Button>{t('quiz.cta')}</Button>
              </Link>
            </div>
          </Abschnitt>

          <TextAbschnitt titel={t('abschnitte.zusammenfassung')} element={gruppen.zusammenfassungen[0]} labels={labels} />

          <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide text-primary">{t('abschnitte.naechsterSchritt')}</h2>
              <p className="mt-1 font-semibold">{naechsterSchritt.titel}</p>
              <p className="text-sm text-fg-muted">{naechsterSchritt.beschreibung}</p>
            </div>
            <Link href={naechsterSchritt.href}>
              <Button variante="sekundaer">{t('navigation.oeffnen')}</Button>
            </Link>
          </Card>
        </>
      )}
    </main>
  );
}

type ModulLabels = {
  keineInhalte: string;
  vorderseite: string;
  rueckseite: string;
  singleChoice: string;
  multipleChoice: string;
  kernfrage: string;
  richtig: string;
  situation: string;
  aufgabe: string;
  erwartung: string;
  keineAngabe: string;
  gegebeneWerte: string;
  gesuchteGroesse: string;
  formel: string;
  loesungAnzeigen: string;
  loesungsweg: string;
  ergebnis: string;
  erklaerung: string;
  werteInAufgabe: string;
};

/**
 * Wandelt DB-Zeilen in das pure View-Model-Format um.
 */
function zuContentElementView(element: ContentElementZeile): ContentElementView {
  return {
    id: element.id,
    titel: element.titel,
    content_typ: element.content_typ,
    inhalt: element.inhalt,
    lerneinheit_id: element.lerneinheit_id,
    frage_id: element.frage_id,
    ist_demo: element.ist_demo,
    demo_label: element.demo_label,
    fachlich_verifiziert: element.fachlich_verifiziert,
  };
}

/**
 * Einheitliche Abschnittskarte.
 */
function Abschnitt({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <Card>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">{titel}</h2>
      {children}
    </Card>
  );
}

/**
 * Schmaler Leertext innerhalb einer vorhandenen Abschnittskarte.
 */
function LeerText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-fg-muted">{children}</p>;
}

/**
 * Rendert Text-Content aus einem Content-Element.
 */
function TextAbschnitt({ titel, element, labels }: { titel: string; element?: ContentElementView; labels: ModulLabels }) {
  return (
    <Abschnitt titel={titel}>
      {element ? <FormatierterText text={extrahiereTextinhalt(element.inhalt)} labels={labels} /> : <LeerText>{labels.keineInhalte}</LeerText>}
    </Abschnitt>
  );
}

/**
 * Rendert einfache Markdown-artige Texte ohne eigene MDX-Pipeline.
 */
function FormatierterText({ text, labels }: { text: string; labels: ModulLabels }) {
  const zeilen = text.split(/\r?\n/).map((zeile) => zeile.trim()).filter(Boolean);
  if (zeilen.length === 0) return <LeerText>{labels.keineInhalte}</LeerText>;
  return (
    <div className="space-y-2 text-sm leading-6 text-fg-muted">
      {zeilen.map((zeile) => {
        if (zeile.startsWith('## ')) {
          return <h3 key={zeile} className="pt-1 text-base font-bold text-fg">{zeile.slice(3)}</h3>;
        }
        if (zeile.startsWith('- ')) {
          return <p key={zeile} className="pl-4 before:mr-2 before:content-['-']">{zeile.slice(2)}</p>;
        }
        return <p key={zeile}>{zeile}</p>;
      })}
    </div>
  );
}

/**
 * Rendert eine Lernkarte mit Vorder- und Rueckseite.
 */
function Lernkarte({ karte, labels }: { karte: LernkarteZeile; labels: ModulLabels }) {
  return (
    <article className="rounded-lg border border-border bg-bg p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{labels.vorderseite}</p>
      <p className="mt-1 font-semibold">{karte.vorderseite}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary">{labels.rueckseite}</p>
      <p className="mt-1 text-sm text-fg-muted">{karte.rueckseite}</p>
      {karte.merksatz && <p className="mt-3 rounded-md bg-bg-subtle p-2 text-sm font-semibold">{karte.merksatz}</p>}
    </article>
  );
}

/**
 * Rendert eine Frage als Lernvorschau ohne Bewertung oder Mastery-Schreibzugriff.
 */
function FrageVorschau({ frage, typ, labels }: { frage: FrageZeile; typ: ContentElementView['content_typ']; labels: ModulLabels }) {
  return (
    <article className="rounded-lg border border-border bg-bg p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variante="neutral" symbol="?">{typ === 'multiple_choice' ? labels.multipleChoice : labels.singleChoice}</Badge>
        {frage.kern && <Badge variante="primary" symbol="!">{labels.kernfrage}</Badge>}
      </div>
      <p className="font-semibold">{frage.aufgabenstellung}</p>
      <ul className="mt-3 space-y-2">
        {[...frage.antwortoptionen].sort(sortiereAntwortoptionen).map((option) => (
          <li
            key={option.id}
            className={cn(
              'rounded-md border p-2 text-sm',
              option.ist_korrekt ? 'border-success-border bg-success-bg' : 'border-border bg-surface',
            )}
          >
            <span className="font-semibold">{option.ist_korrekt ? `${labels.richtig}: ` : ''}</span>
            {option.text}
            {option.erklaerung && <p className="mt-1 text-fg-muted">{option.erklaerung}</p>}
          </li>
        ))}
      </ul>
    </article>
  );
}

/**
 * Sortiert Antwortoptionen nach vorhandener Reihenfolge.
 */
function sortiereAntwortoptionen(a: AntwortoptionZeile, b: AntwortoptionZeile): number {
  return a.reihenfolge - b.reihenfolge;
}

/**
 * Rendert einen Praxisfall mit Situation, Aufgabe und Erwartungshorizont.
 */
function Praxisfall({ element, labels }: { element: ContentElementView; labels: ModulLabels }) {
  const inhalt = istRecord(element.inhalt) ? element.inhalt : {};
  const erwartung = Array.isArray(inhalt.erwartungshorizont) ? inhalt.erwartungshorizont.filter((x): x is string => typeof x === 'string') : [];
  return (
    <article className="rounded-lg border border-border bg-bg p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{labels.situation}</p>
      <p className="mt-1 text-sm text-fg-muted">{text(inhalt.situation, labels)}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary">{labels.aufgabe}</p>
      <p className="mt-1 text-sm text-fg-muted">{text(inhalt.aufgabe, labels)}</p>
      {erwartung.length > 0 && (
        <>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary">{labels.erwartung}</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-fg-muted">
            {erwartung.map((punkt) => <li key={punkt}>{punkt}</li>)}
          </ul>
        </>
      )}
    </article>
  );
}

/**
 * Rendert eine Rechenaufgabe mit eingeklappter Loesung.
 */
function Rechenaufgabe({ element, labels }: { element: ContentElementView; labels: ModulLabels }) {
  const aufgabe = extrahiereRechenaufgabe(element.inhalt);
  return (
    <article className="rounded-lg border border-border bg-bg p-3">
      <p className="font-semibold">{aufgabe.aufgabe}</p>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <Feld label={labels.gegebeneWerte} wert={aufgabe.gegebeneWerte.length ? aufgabe.gegebeneWerte.join(', ') : labels.werteInAufgabe} />
        <Feld label={labels.gesuchteGroesse} wert={aufgabe.gesuchteGroesse} />
        <Feld label={labels.formel} wert={aufgabe.formel} />
      </dl>
      <details className="mt-3 rounded-md border border-border bg-surface p-3">
        <summary className="cursor-pointer font-semibold">{labels.loesungAnzeigen}</summary>
        <dl className="mt-3 space-y-2 text-sm">
          <Feld label={labels.loesungsweg} wert={aufgabe.loesungsweg} />
          <Feld label={labels.ergebnis} wert={aufgabe.ergebnis} />
          <Feld label={labels.erklaerung} wert={aufgabe.erklaerung} />
        </dl>
      </details>
    </article>
  );
}

/**
 * Rendert ein Label-Wert-Paar fuer Rechenaufgaben.
 */
function Feld({ label, wert }: { label: string; wert: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-primary">{label}</dt>
      <dd className="mt-0.5 text-fg-muted">{wert}</dd>
    </div>
  );
}

/**
 * Erkennt einfache Objektwerte.
 */
function istRecord(wert: unknown): wert is Record<string, unknown> {
  return typeof wert === 'object' && wert !== null && !Array.isArray(wert);
}

/**
 * Normalisiert unbekannte Werte zu UI-Text.
 */
function text(wert: unknown, labels: ModulLabels): string {
  return typeof wert === 'string' && wert.trim().length > 0 ? wert.trim() : labels.keineAngabe;
}
