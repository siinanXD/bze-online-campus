'use client';

import * as React from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardKopf,
  CardTitel,
  Chip,
  Formularfeld,
  Progress,
  ProgressRing,
  Radio,
  Seitenkopf,
  StatusBadge,
  Textarea,
  Input,
  type FrageStatus,
} from '@bze/ui';
import { Huelle } from './huelle';

const LERNFELDER: {
  titel: string;
  status: FrageStatus;
  statusLabel: string;
  prozent: number;
  fragen: string;
}[] = [
  {
    titel: 'Lernfeld 1 — Fertigungstechnik',
    status: 'abgeschlossen',
    statusLabel: 'Sicher',
    prozent: 94,
    fragen: '48 von 48 Fragen sicher',
  },
  {
    titel: 'Lernfeld 2 — Werkstoffe und Halbzeuge',
    status: 'einmal_richtig',
    statusLabel: 'Teilweise sicher',
    prozent: 61,
    fragen: '29 von 52 Fragen sicher',
  },
  {
    titel: 'Lernfeld 3 — Steuerungstechnik',
    status: 'falsch',
    statusLabel: 'Nochmal üben',
    prozent: 24,
    fragen: '9 von 40 Fragen sicher',
  },
  {
    titel: 'Lernfeld 4 — Qualitätssicherung',
    status: 'neu',
    statusLabel: 'Noch nicht geübt',
    prozent: 0,
    fragen: '0 von 36 Fragen geübt',
  },
];

/* ------------------------------------------------------- campus/lernen */

export function CampusLernen() {
  return (
    <Huelle bereich="campus" aktivPfad="/de/campus/lernen" titel="Lernen">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-h2 md:text-h1">Guten Morgen, Amina!</h1>
            <p className="text-body text-fg-muted">
              Mach dort weiter, wo du aufgehört hast.
            </p>
          </div>

          <Card variante="erhoben" className="border-primary-border bg-primary-subtle">
            <p className="text-overline uppercase text-fg-subtle">Weitermachen</p>
            <h2 className="mt-1 text-h3">Lernfeld 2 — Werkstoffe und Halbzeuge</h2>
            <p className="mt-1 text-body-sm text-fg-muted">
              Abschnitt 4 von 7 · Zuletzt am Dienstag geübt
            </p>
            <div className="mt-4">
              <Progress wert={61} label="Fortschritt Lernfeld 2" />
            </div>
            <div className="mt-4">
              <Button groesse="lg" volleBreite className="sm:w-auto">
                Weiterlernen
              </Button>
            </div>
          </Card>

          <section className="space-y-3">
            <h2 className="text-h3">Deine Lernfelder</h2>
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
              {LERNFELDER.map((lf) => (
                <li key={lf.titel}>
                  <Card variante="interaktiv" className="h-full">
                    <CardKopf>
                      <CardTitel className="text-h4">{lf.titel}</CardTitel>
                    </CardKopf>
                    <StatusBadge status={lf.status} label={lf.statusLabel} />
                    <p className="mt-3 text-caption text-fg-muted">{lf.fragen}</p>
                    <div className="mt-3">
                      <Progress wert={lf.prozent} label={`Fortschritt ${lf.titel}`} />
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardKopf>
              <CardTitel className="text-h4">Prüfungsreife</CardTitel>
            </CardKopf>
            <div className="flex flex-col items-center gap-3 text-center">
              <ProgressRing value={68} size={112} label="Prüfungsreife 68 Prozent" />
              <p className="text-body-sm text-fg-muted">
                Du bist auf einem guten Weg. Lernfeld 3 braucht noch Übung.
              </p>
            </div>
          </Card>

          <Alert variante="info" titel="Nächste Wochenprüfung">
            Freitag, 7. August · 30 Fragen · 45 Minuten
          </Alert>

          <Card>
            <CardKopf>
              <CardTitel className="text-h4">Offene Aufgaben</CardTitel>
            </CardKopf>
            <ul className="space-y-3 text-body-sm">
              <li className="flex items-center justify-between gap-3">
                <span>Berichtsheft Woche 30</span>
                <Badge variante="warning" symbol="!">
                  Fällig
                </Badge>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span>Berichtsheft Woche 29</span>
                <Badge variante="success" symbol="✓">
                  Abgezeichnet
                </Badge>
              </li>
            </ul>
          </Card>
        </aside>
      </div>
    </Huelle>
  );
}

/* -------------------------------------------------------- campus/topic */

export function CampusTopic() {
  return (
    <Huelle
      bereich="campus"
      aktivPfad="/de/campus/lernen"
      titel="Werkstoffe und Halbzeuge"
      zurueck
      kopfAktionen={
        <span className="hidden md:block">
          <Button groesse="sm">Fragen üben</Button>
        </span>
      }
    >
      <div className="sticky top-14 z-30 -mx-4 mb-6 bg-bg/95 px-4 py-2 backdrop-blur md:top-16 md:-mx-8 md:px-8">
        <Progress wert={57} label="Fortschritt in diesem Thema" />
      </div>

      <div className="gap-10 lg:flex">
        <article className="max-w-lese space-y-5">
          <Seitenkopf
            titel="Stahl und seine Legierungen"
            beschreibung="Lernfeld 2 · Abschnitt 4 von 7 · Lesezeit etwa 8 Minuten"
          />

          <p className="text-body-lg">
            Stahl ist eine Legierung aus Eisen und Kohlenstoff. Der Kohlenstoffanteil
            liegt unter 2,06 Prozent. Steigt er darüber, spricht man von Gusseisen.
          </p>

          <div className="rounded-lg border border-border bg-bg-subtle p-4">
            <p className="text-caption text-fg-muted">Türkçe</p>
            <p className="mt-1 text-body-sm text-fg-muted" lang="tr" dir="ltr">
              Çelik, demir ve karbondan oluşan bir alaşımdır. Karbon oranı yüzde
              2,06&apos;nın altındadır.
            </p>
          </div>

          <p className="text-body-lg">
            Mit steigendem Kohlenstoffgehalt nehmen Festigkeit und Härte zu, während
            die Zähigkeit und die Schweißeignung abnehmen. Für geschweißte Konstruktionen
            wird deshalb Stahl mit niedrigem Kohlenstoffgehalt verwendet.
          </p>

          <figure className="space-y-2">
            <div className="flex h-48 items-center justify-center rounded-lg border border-border bg-bg-subtle text-fg-subtle">
              <span aria-hidden="true">Abbildung: Eisen-Kohlenstoff-Diagramm</span>
            </div>
            <figcaption className="text-caption text-fg-muted">
              Abb. 4.1 — Eisen-Kohlenstoff-Diagramm. Quelle: Tabellenbuch Metall, S. 132.
            </figcaption>
          </figure>

          <h2 className="text-h3">Einteilung der Stähle</h2>
          <p className="text-body-lg">
            Unlegierte Stähle enthalten außer Eisen und Kohlenstoff nur geringe Mengen
            weiterer Elemente. Legierte Stähle enthalten gezielt zugesetzte Elemente wie
            Chrom, Nickel oder Molybdän.
          </p>
        </article>

        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-32 space-y-2">
            <p className="text-overline uppercase text-fg-subtle">Auf dieser Seite</p>
            <ul className="space-y-1 border-s border-border text-body-sm">
              <li className="border-s-2 border-primary -ms-px ps-3 font-medium text-primary">
                Stahl und Legierungen
              </li>
              <li className="ps-3 text-fg-muted">Einteilung der Stähle</li>
              <li className="ps-3 text-fg-muted">Wärmebehandlung</li>
              <li className="ps-3 text-fg-muted">Normbezeichnungen</li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="sticky bottom-20 mt-8 md:static md:mt-10">
        <Button groesse="lg" volleBreite className="md:w-auto">
          Fragen zu diesem Abschnitt üben
        </Button>
      </div>
    </Huelle>
  );
}

/* ---------------------------------------------- campus/pruefung — Start */

export function PruefungStart() {
  return (
    <Huelle bereich="campus" aktivPfad="/de/campus/pruefung" titel="Prüfung">
      <div className="mx-auto max-w-formular">
        <Card>
          <Seitenkopf
            titel="Wochenprüfung 31"
            beschreibung="Alle Lernfelder, die du bisher freigeschaltet hast."
          />
          <dl className="space-y-3 text-body">
            <div className="flex justify-between border-b border-border pb-3">
              <dt className="text-fg-muted">Dauer</dt>
              <dd className="zahlen font-medium">45 Minuten</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <dt className="text-fg-muted">Fragen</dt>
              <dd className="zahlen font-medium">30</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <dt className="text-fg-muted">Wiederholbar</dt>
              <dd className="font-medium">Einmal pro Woche</dd>
            </div>
          </dl>

          <div className="mt-6 space-y-4">
            <Button groesse="lg" volleBreite>
              Prüfung starten
            </Button>
            <p className="text-center text-caption text-fg-muted">
              Du kannst pausieren. Deine Antworten bleiben gespeichert.
            </p>
          </div>
        </Card>
      </div>
    </Huelle>
  );
}

/* ----------------------------------------------- campus/pruefung — Lauf */

export function PruefungLauf() {
  const antworten = [
    'Der Kohlenstoffgehalt liegt unter 2,06 Prozent.',
    'Der Kohlenstoffgehalt liegt über 2,06 Prozent.',
    'Der Chromgehalt liegt über 10,5 Prozent.',
    'Es sind keine Legierungselemente enthalten.',
  ];

  return (
    <Huelle bereich="campus" aktivPfad="/de/campus/pruefung" titel="Wochenprüfung 31">
      <div className="sticky top-14 z-30 -mx-4 mb-6 border-b border-border bg-surface px-4 py-3 md:top-16 md:-mx-8 md:px-8">
        <div className="mx-auto flex max-w-campus items-center justify-between gap-4">
          <p className="zahlen text-label">Frage 7 von 30</p>
          <p className="zahlen flex items-center gap-1.5 rounded-sm border border-warning-border bg-warning-bg px-2 py-1 text-label font-semibold text-warning">
            <span aria-hidden="true">⏱</span> 04:12
          </p>
        </div>
        <div className="mx-auto mt-2 max-w-campus">
          <Progress wert={23} label="Fortschritt in der Prüfung" zahlSichtbar={false} />
        </div>
      </div>

      <div className="gap-8 lg:flex">
        <div className="max-w-lese flex-1">
          <Card>
            <p className="text-overline uppercase text-fg-subtle">
              Lernfeld 2 — Werkstoffe
            </p>
            <h1 className="mt-2 text-body-lg font-semibold">
              Woran erkennt man, dass ein Werkstoff als Stahl gilt?
            </h1>

            <fieldset className="mt-5 space-y-3">
              <legend className="sr-only">Antwortmöglichkeiten</legend>
              {antworten.map((a, i) => (
                <label
                  key={a}
                  className="flex min-h-[56px] cursor-pointer items-center gap-3 rounded-md border border-border bg-surface p-4 hover:border-border-strong has-[:checked]:border-primary has-[:checked]:bg-primary-subtle"
                >
                  <input
                    type="radio"
                    name="frage-7"
                    defaultChecked={i === 0}
                    className="h-5 w-5 shrink-0 accent-primary"
                  />
                  <span className="text-body">{a}</span>
                </label>
              ))}
            </fieldset>
          </Card>

          <div className="mt-6 flex gap-3">
            <Button variante="sekundaer" groesse="lg" className="flex-1 md:flex-none">
              Zurück
            </Button>
            <Button groesse="lg" className="flex-1 md:flex-none">
              Weiter
            </Button>
          </div>
        </div>

        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-40 space-y-4">
            <Card dichte="kompakt">
              <p className="mb-3 text-overline uppercase text-fg-subtle">Fragen</p>
              <ol className="grid grid-cols-6 gap-1.5">
                {Array.from({ length: 30 }).map((_, i) => {
                  const beantwortet = i < 6;
                  const aktuell = i === 6;
                  return (
                    <li key={i}>
                      <span
                        className={
                          'zahlen flex h-8 w-8 items-center justify-center rounded-sm border text-caption ' +
                          (aktuell
                            ? 'border-primary bg-primary font-bold text-fg-onPrimary'
                            : beantwortet
                              ? 'border-border-strong bg-bg-subtle font-medium text-fg'
                              : 'border-border text-fg-subtle')
                        }
                      >
                        {i + 1}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </Card>
            <Button variante="sekundaer" volleBreite>
              Prüfung abgeben
            </Button>
          </div>
        </aside>
      </div>
    </Huelle>
  );
}

/* -------------------------------------------- campus/pruefung — Ergebnis */

export function PruefungErgebnis() {
  const felder = [
    { name: 'Lernfeld 1 — Fertigungstechnik', wert: 92 },
    { name: 'Lernfeld 2 — Werkstoffe', wert: 71 },
    { name: 'Lernfeld 3 — Steuerungstechnik', wert: 38 },
  ];

  return (
    <Huelle bereich="campus" aktivPfad="/de/campus/pruefung" titel="Ergebnis" zurueck>
      <div className="mx-auto max-w-lese space-y-6">
        <Card className="text-center">
          <p className="text-overline uppercase text-fg-subtle">Wochenprüfung 31</p>
          <div className="my-4 flex justify-center">
            <ProgressRing value={73} size={128} label="Ergebnis 73 Prozent" />
          </div>
          <p className="zahlen text-h3">22 von 30 Punkten</p>
          <p className="mt-2 text-body text-fg-muted">
            Stark verbessert gegenüber der letzten Woche. Lernfeld 3 lohnt sich als
            nächstes.
          </p>
        </Card>

        <Card>
          <CardKopf>
            <CardTitel className="text-h4">Ergebnis nach Lernfeld</CardTitel>
          </CardKopf>
          <ul className="space-y-4">
            {felder.map((f) => (
              <li key={f.name} className="space-y-1.5">
                <p className="text-body-sm">{f.name}</p>
                <Progress wert={f.wert} label={f.name} />
              </li>
            ))}
          </ul>
        </Card>

        <Alert variante="info" titel="Automatisches Lernfeedback">
          Die Bewertung deiner Freitextantworten wurde automatisch erstellt. Sie ist
          keine Prüfungsleistung und keine Bewertung der Kammer.
        </Alert>

        <Card>
          <CardKopf>
            <CardTitel className="text-h4">Deine Antworten</CardTitel>
          </CardKopf>
          <ul className="space-y-3">
            <li className="rounded-md border border-status-fertig/40 bg-success-bg p-3">
              <div className="flex items-start gap-2">
                <span aria-hidden="true" className="text-status-fertig">
                  ✓
                </span>
                <div className="min-w-0">
                  <p className="text-body-sm font-medium">Frage 1 — Richtig</p>
                  <p className="text-caption text-fg-muted">
                    Woran erkennt man, dass ein Werkstoff als Stahl gilt?
                  </p>
                </div>
              </div>
            </li>
            <li className="rounded-md border border-status-falsch/40 bg-danger-bg p-3">
              <div className="flex items-start gap-2">
                <span aria-hidden="true" className="text-status-falsch">
                  ✕
                </span>
                <div className="min-w-0">
                  <p className="text-body-sm font-medium">Frage 2 — Nochmal üben</p>
                  <p className="text-caption text-fg-muted">
                    Welche Härteprüfung eignet sich für dünne Bleche?
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </Card>

        <Button groesse="lg" volleBreite>
          Schwache Themen üben
        </Button>
      </div>
    </Huelle>
  );
}

/* -------------------------------------------------- campus/fortschritt */

export function CampusFortschritt() {
  return (
    <Huelle bereich="campus" aktivPfad="/de/campus/fortschritt" titel="Fortschritt">
      <Seitenkopf
        titel="Dein Fortschritt"
        beschreibung="So weit bist du auf dem Weg zur schriftlichen Prüfung."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col items-center gap-2 text-center">
          <ProgressRing value={68} size={96} label="Prüfungsreife 68 Prozent" />
          <p className="text-label">Prüfungsreife</p>
        </Card>
        {[
          { wert: '86', label: 'Fragen sicher', unter: 'von 176' },
          { wert: '12', label: 'Wochenprüfungen', unter: 'geschrieben' },
          { wert: '4', label: 'Lernfelder', unter: '1 abgeschlossen' },
        ].map((k) => (
          <Card key={k.label} className="flex flex-col justify-center">
            <p className="zahlen text-display">{k.wert}</p>
            <p className="text-label">{k.label}</p>
            <p className="text-caption text-fg-muted">{k.unter}</p>
          </Card>
        ))}
      </div>

      <Card dichte="kompakt" className="p-0">
        <ul className="divide-y divide-border">
          {LERNFELDER.map((lf) => (
            <li
              key={lf.titel}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <p className="truncate text-body-sm font-medium">{lf.titel}</p>
                <p className="text-caption text-fg-muted">{lf.fragen}</p>
              </div>
              <div className="flex items-center gap-4 sm:w-80">
                <StatusBadge status={lf.status} label={lf.statusLabel} />
                <div className="flex-1">
                  <Progress wert={lf.prozent} label={`Beherrschung ${lf.titel}`} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </Huelle>
  );
}

/* ------------------------------------------------- campus/berichtsheft */

export function CampusBerichtsheft() {
  const wochen = [30, 29, 28, 27, 26];

  return (
    <Huelle bereich="campus" aktivPfad="/de/campus/berichtsheft" titel="Berichtsheft">
      <Seitenkopf
        titel="Ausbildungsnachweis"
        beschreibung="Trage ein, was du diese Woche gemacht hast."
        aktionen={
          <Badge variante="info" symbol="i">
            Entwurf
          </Badge>
        }
      />

      <div className="gap-8 lg:flex">
        <div className="mb-6 lg:mb-0 lg:w-56 lg:shrink-0">
          <p className="mb-2 text-overline uppercase text-fg-subtle">Woche</p>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:px-0">
            {wochen.map((w, i) => (
              <Chip key={w} active={i === 0}>
                KW {w}
              </Chip>
            ))}
          </div>
        </div>

        <div className="max-w-formular flex-1 space-y-5">
          <Formularfeld
            label="Tätigkeiten"
            pflicht
            hinweis="Stichpunkte genügen. Der Text wird nur sprachlich geglättet, nichts wird ergänzt."
          >
            {(p) => (
              <Textarea
                rows={6}
                defaultValue={
                  'Drehmaschine eingerichtet und Wellen gefertigt.\nMessschieber und Bügelmessschraube benutzt.\nWartungsplan für die Fräsmaschine abgearbeitet.'
                }
                {...p}
              />
            )}
          </Formularfeld>

          <Formularfeld label="Stunden" pflicht>
            {(p) => <Input type="number" inputMode="numeric" defaultValue={38} {...p} />}
          </Formularfeld>

          <Formularfeld label="Lernfeldbezug">
            {(p) => (
              <Input defaultValue="Lernfeld 1 — Fertigungstechnik" readOnly {...p} />
            )}
          </Formularfeld>

          <p className="text-caption text-fg-muted">Zuletzt gespeichert um 14:32</p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variante="sekundaer" groesse="lg">
              Entwurf speichern
            </Button>
            <Button groesse="lg">Einreichen</Button>
          </div>

          <Alert variante="warning" titel="Noch nicht eingereicht">
            Reiche den Nachweis bis Sonntag ein, damit dein Ausbilder ihn abzeichnen kann.
          </Alert>
        </div>
      </div>
    </Huelle>
  );
}

/* --------------------------------------------------------- campus/mehr */

export function CampusMehr() {
  const gruppen: { titel: string; eintraege: { label: string; wert?: string }[] }[] = [
    {
      titel: 'Konto',
      eintraege: [
        { label: 'Profil', wert: 'Amina Yildiz' },
        { label: 'Kohorte', wert: 'MAF-2026-A' },
        { label: 'Passwort ändern' },
      ],
    },
    {
      titel: 'Darstellung',
      eintraege: [
        { label: 'Sprache', wert: 'Deutsch' },
        { label: 'Darstellung', wert: 'System' },
        { label: 'Benachrichtigungen', wert: 'An' },
      ],
    },
    {
      titel: 'Hilfe und Rechtliches',
      eintraege: [{ label: 'Hilfe' }, { label: 'Impressum' }, { label: 'Datenschutz' }],
    },
  ];

  return (
    <Huelle bereich="campus" aktivPfad="/de/campus/mehr" titel="Mehr">
      <Seitenkopf titel="Mehr" />

      <div className="max-w-formular space-y-6">
        {gruppen.map((g) => (
          <section key={g.titel} className="space-y-2">
            <h2 className="text-overline uppercase text-fg-subtle">{g.titel}</h2>
            <Card className="p-0">
              <ul className="divide-y divide-border">
                {g.eintraege.map((e) => (
                  <li key={e.label}>
                    <span className="flex min-h-[56px] cursor-pointer items-center justify-between gap-3 px-4 hover:bg-bg-subtle">
                      <span className="text-body">{e.label}</span>
                      <span className="flex items-center gap-2 text-body-sm text-fg-muted">
                        {e.wert}
                        <span aria-hidden="true" className="rtl:-scale-x-100">
                          ›
                        </span>
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        ))}

        <Card className="p-0">
          <span className="flex min-h-[56px] cursor-pointer items-center px-4 text-body font-medium text-danger hover:bg-danger-bg">
            Abmelden
          </span>
        </Card>
      </div>
    </Huelle>
  );
}
