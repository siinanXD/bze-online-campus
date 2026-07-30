'use client';

import * as React from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardKopf,
  CardTitel,
  DatenTabelle,
  LeerZustand,
  Progress,
  Seitenkopf,
  Suchfeld,
  Textarea,
} from '@bze/ui';
import { Huelle } from './huelle';

interface Teilnehmer {
  id: string;
  name: string;
  kohorte: string;
  reife: number;
  offen: number;
  bericht: 'abgezeichnet' | 'offen' | 'fehlt';
  aktiv: string;
}

const TEILNEHMER: Teilnehmer[] = [
  { id: '1', name: 'Amina Yildiz', kohorte: 'MAF-2026-A', reife: 68, offen: 2, bericht: 'offen', aktiv: 'vor 2 Stunden' },
  { id: '2', name: 'Dmytro Kovalenko', kohorte: 'MAF-2026-A', reife: 54, offen: 0, bericht: 'abgezeichnet', aktiv: 'gestern' },
  { id: '3', name: 'Sara Ben Ali', kohorte: 'MAF-2026-B', reife: 91, offen: 1, bericht: 'abgezeichnet', aktiv: 'vor 4 Stunden' },
  { id: '4', name: 'Lukas Hoffmann', kohorte: 'MAF-2026-B', reife: 33, offen: 3, bericht: 'fehlt', aktiv: 'vor 6 Tagen' },
  { id: '5', name: 'Fatima Nasser', kohorte: 'MAF-2026-A', reife: 77, offen: 0, bericht: 'abgezeichnet', aktiv: 'heute' },
];

const BERICHT_BADGE = {
  abgezeichnet: { variante: 'success' as const, symbol: '✓', text: 'Abgezeichnet' },
  offen: { variante: 'warning' as const, symbol: '!', text: 'Offen' },
  fehlt: { variante: 'danger' as const, symbol: '✕', text: 'Fehlt' },
};

/* -------------------------------------------------- ausbilder/teilnehmer */

export function AusbilderTeilnehmer() {
  return (
    <Huelle
      bereich="ausbilder"
      aktivPfad="/de/ausbilder/teilnehmer"
      titel="Teilnehmende"
    >
      <Seitenkopf
        titel="Teilnehmende"
        beschreibung="5 Personen in 2 Kohorten"
        aktionen={
          <>
            <Button variante="sekundaer" groesse="sm">
              Exportieren
            </Button>
            <Button groesse="sm">Einladen</Button>
          </>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="sm:w-72">
          <Suchfeld
            label="Teilnehmende suchen"
            platzhalter="Name oder Kohorte"
            onSuche={() => undefined}
            ergebnisText="5 Treffer"
          />
        </div>
      </div>

      <DatenTabelle<Teilnehmer>
        beschriftung="Betreute Teilnehmende"
        daten={TEILNEHMER}
        schluessel={(d) => d.id}
        sortierung={{ key: 'reife', richtung: 'absteigend' }}
        spalten={[
          {
            key: 'name',
            kopf: 'Name',
            kopfzeileMobil: true,
            sortierbar: true,
            zelle: (d) => (
              <span className="flex items-center gap-2 font-medium">
                <Avatar name={d.name} groesse={24} />
                {d.name}
              </span>
            ),
          },
          { key: 'kohorte', kopf: 'Kohorte', zelle: (d) => d.kohorte },
          {
            key: 'reife',
            kopf: 'Prüfungsreife',
            sortierbar: true,
            zelle: (d) => (
              <div className="w-40">
                <Progress wert={d.reife} label={`Prüfungsreife ${d.name}`} />
              </div>
            ),
          },
          {
            key: 'offen',
            kopf: 'Offene Reviews',
            zahl: true,
            zelle: (d) =>
              d.offen > 0 ? (
                <Badge variante="warning" symbol="!">
                  {d.offen}
                </Badge>
              ) : (
                <span className="text-fg-subtle">—</span>
              ),
          },
          {
            key: 'bericht',
            kopf: 'Berichtsheft',
            zelle: (d) => {
              const b = BERICHT_BADGE[d.bericht];
              return (
                <Badge variante={b.variante} symbol={b.symbol}>
                  {b.text}
                </Badge>
              );
            },
          },
          { key: 'aktiv', kopf: 'Letzte Aktivität', zelle: (d) => d.aktiv },
        ]}
      />
    </Huelle>
  );
}

/* ------------------------------------------------------ ausbilder/review */

export function AusbilderReview() {
  const warteschlange = [
    { name: 'Amina Yildiz', frage: 'Härteprüfung nach Brinell', wartet: '2 Std.', aktiv: true },
    { name: 'Lukas Hoffmann', frage: 'Aufbau einer SPS', wartet: '5 Std.' },
    { name: 'Sara Ben Ali', frage: 'Toleranzen und Passungen', wartet: '1 Tag' },
  ];

  return (
    <Huelle bereich="ausbilder" aktivPfad="/de/ausbilder/review" titel="Review">
      <Seitenkopf titel="Offene Bewertungen" beschreibung="3 Abgaben warten auf dich." />

      <div className="gap-6 lg:flex">
        <div className="mb-6 lg:mb-0 lg:w-72 lg:shrink-0">
          <ul className="space-y-2">
            {warteschlange.map((w) => (
              <li key={w.name}>
                <div
                  className={
                    'cursor-pointer rounded-lg border p-3 transition-colors ' +
                    (w.aktiv
                      ? 'border-primary bg-primary-subtle'
                      : 'border-border bg-surface hover:border-border-strong')
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-body-sm font-medium">{w.name}</p>
                    <span className="shrink-0 text-caption text-fg-muted">{w.wartet}</span>
                  </div>
                  <p className="truncate text-caption text-fg-muted">{w.frage}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <Card>
            <CardKopf>
              <CardTitel className="text-h4">Härteprüfung nach Brinell</CardTitel>
              <Badge variante="neutral">Lernfeld 2</Badge>
            </CardKopf>
            <p className="text-body-sm text-fg-muted">
              Erkläre, wofür sich die Härteprüfung nach Brinell besonders eignet.
            </p>
          </Card>

          <Card>
            <CardKopf>
              <CardTitel className="text-h4">Antwort von Amina Yildiz</CardTitel>
            </CardKopf>
            <p className="text-body">
              Brinell eignet sich gut für weiche und mittelharte Werkstoffe wie Guss und
              unlegierte Stähle, weil die Kugel eine große Fläche eindrückt und das
              Ergebnis dadurch weniger von einzelnen Körnern abhängt.
            </p>
          </Card>

          <Alert variante="info" titel="Automatisches Lernfeedback">
            Vorschlag: 8 von 10 Punkten. Der Kern ist richtig, der Hinweis auf die
            Grenzen bei sehr harten Werkstoffen fehlt. Keine Prüfungsleistung und keine
            Bewertung der Kammer.
          </Alert>

          <Card>
            <label htmlFor="bewertung" className="text-label">
              Deine Rückmeldung
            </label>
            <div className="mt-2">
              <Textarea
                id="bewertung"
                rows={3}
                defaultValue="Gute Antwort. Ergänze noch, warum Brinell bei gehärteten Stählen an seine Grenze kommt."
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button>Vorschlag übernehmen</Button>
              <Button variante="sekundaer">Anpassen und speichern</Button>
            </div>
          </Card>

          <p className="text-caption text-fg-muted">
            Tastatur: <kbd className="rounded-sm border border-border px-1">J</kbd> vor,{' '}
            <kbd className="rounded-sm border border-border px-1">K</kbd> zurück
          </p>
        </div>
      </div>
    </Huelle>
  );
}

/* ----------------------------------------------------- ausbilder/kohorte */

export function AusbilderKohorte() {
  const felder = [
    { name: 'Lernfeld 1 — Fertigungstechnik', wert: 81 },
    { name: 'Lernfeld 2 — Werkstoffe', wert: 64 },
    { name: 'Lernfeld 3 — Steuerungstechnik', wert: 37 },
    { name: 'Lernfeld 4 — Qualitätssicherung', wert: 12 },
  ];

  return (
    <Huelle bereich="ausbilder" aktivPfad="/de/ausbilder/kohorte" titel="Kohorte">
      <Seitenkopf
        titel="MAF-2026-A"
        beschreibung="Maschinen- und Anlagenführer · Prüfung im Mai 2026"
        aktionen={
          <Button variante="sekundaer" groesse="sm">
            Bericht drucken
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { wert: '18', label: 'Teilnehmende' },
          { wert: '61%', label: 'Ø Prüfungsreife' },
          { wert: '7', label: 'Offene Reviews' },
          { wert: '3', label: 'Berichtshefte fällig' },
        ].map((k) => (
          <Card key={k.label} dichte="kompakt">
            <p className="zahlen text-h1">{k.wert}</p>
            <p className="text-body-sm text-fg-muted">{k.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardKopf>
          <CardTitel className="text-h4">Beherrschung nach Lernfeld</CardTitel>
        </CardKopf>
        <ul className="space-y-4">
          {felder.map((f) => (
            <li key={f.name} className="space-y-1.5">
              <div className="flex justify-between gap-4 text-body-sm">
                <span>{f.name}</span>
                <span className="zahlen text-fg-muted">{f.wert}%</span>
              </div>
              <Progress wert={f.wert} label={f.name} zahlSichtbar={false} />
            </li>
          ))}
        </ul>
      </Card>
    </Huelle>
  );
}

/* -------------------------------------------- ausbilder/review — leer */

export function AusbilderReviewLeer() {
  return (
    <Huelle bereich="ausbilder" aktivPfad="/de/ausbilder/review" titel="Review">
      <Seitenkopf titel="Offene Bewertungen" />
      <LeerZustand
        symbol="✓"
        titel="Nichts zu prüfen"
        text="Alle Abgaben sind bearbeitet. Neue Antworten erscheinen hier automatisch, sobald Teilnehmende sie einreichen."
        aktion={<Button>Zur Teilnehmerliste</Button>}
      />
    </Huelle>
  );
}

/* ----------------------------------------------------------- admin/nutzer */

interface Nutzer {
  id: string;
  name: string;
  email: string;
  rolle: string;
  kohorte: string;
  status: 'aktiv' | 'gesperrt' | 'eingeladen';
}

const NUTZER: Nutzer[] = [
  { id: '1', name: 'Amina Yildiz', email: 'a.yildiz@bze-eu.de', rolle: 'Teilnehmer', kohorte: 'MAF-2026-A', status: 'aktiv' },
  { id: '2', name: 'Thomas Berger', email: 't.berger@bze-eu.de', rolle: 'Ausbilder', kohorte: '—', status: 'aktiv' },
  { id: '3', name: 'Petra Klein', email: 'p.klein@bze-eu.de', rolle: 'Verwaltung', kohorte: '—', status: 'aktiv' },
  { id: '4', name: 'Jonas Weber', email: 'j.weber@bze-eu.de', rolle: 'Teilnehmer', kohorte: 'MAF-2026-B', status: 'eingeladen' },
  { id: '5', name: 'Mira Schulz', email: 'm.schulz@bze-eu.de', rolle: 'Teilnehmer', kohorte: 'MAF-2025-C', status: 'gesperrt' },
];

const STATUS_BADGE = {
  aktiv: { variante: 'success' as const, symbol: '✓', text: 'Aktiv' },
  eingeladen: { variante: 'info' as const, symbol: 'i', text: 'Eingeladen' },
  gesperrt: { variante: 'danger' as const, symbol: '✕', text: 'Gesperrt' },
};

export function AdminNutzer() {
  return (
    <Huelle bereich="admin" aktivPfad="/de/admin/nutzer" titel="Nutzer">
      <Seitenkopf
        titel="Nutzerverwaltung"
        beschreibung="5 Konten"
        aktionen={
          <>
            <Button variante="sekundaer" groesse="sm">
              CSV exportieren
            </Button>
            <Button groesse="sm">Nutzer anlegen</Button>
          </>
        }
      />

      <div className="mb-4 sm:w-72">
        <Suchfeld
          label="Nutzer suchen"
          platzhalter="Name oder E-Mail"
          onSuche={() => undefined}
          ergebnisText="5 Treffer"
        />
      </div>

      <DatenTabelle<Nutzer>
        beschriftung="Alle Nutzerkonten"
        daten={NUTZER}
        schluessel={(d) => d.id}
        spalten={[
          {
            key: 'name',
            kopf: 'Name',
            kopfzeileMobil: true,
            sortierbar: true,
            zelle: (d) => <span className="font-medium">{d.name}</span>,
          },
          { key: 'email', kopf: 'E-Mail', zelle: (d) => d.email },
          { key: 'rolle', kopf: 'Rolle', zelle: (d) => d.rolle },
          { key: 'kohorte', kopf: 'Kohorte', zelle: (d) => d.kohorte },
          {
            key: 'status',
            kopf: 'Status',
            zelle: (d) => {
              const s = STATUS_BADGE[d.status];
              return (
                <Badge variante={s.variante} symbol={s.symbol}>
                  {s.text}
                </Badge>
              );
            },
          },
        ]}
      />
    </Huelle>
  );
}

/* -------------------------------------------------------- admin/audit */

export function AdminAudit() {
  const eintraege = [
    { zeit: '2026-07-29 14:32:11', akteur: 'p.klein', aktion: 'nutzer.anlegen', ziel: 'j.weber' },
    { zeit: '2026-07-29 13:58:02', akteur: 't.berger', aktion: 'nachweis.abzeichnen', ziel: 'KW29 / a.yildiz' },
    { zeit: '2026-07-29 11:04:47', akteur: 'system', aktion: 'pruefung.auswerten', ziel: 'WP31' },
    { zeit: '2026-07-28 16:20:09', akteur: 'p.klein', aktion: 'nutzer.sperren', ziel: 'm.schulz' },
  ];

  return (
    <Huelle bereich="admin" aktivPfad="/de/admin/audit" titel="Audit-Log">
      <Seitenkopf
        titel="Audit-Log"
        beschreibung="Nur lesbar. Einträge werden nie verändert oder gelöscht."
      />

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full border-collapse text-body-sm">
          <caption className="sr-only">Protokoll aller sicherheitsrelevanten Vorgänge</caption>
          <thead className="bg-bg-subtle">
            <tr>
              {['Zeitpunkt', 'Akteur', 'Aktion', 'Ziel'].map((k) => (
                <th
                  key={k}
                  scope="col"
                  className="border-b border-border px-4 py-2.5 text-start text-label font-semibold text-fg-muted"
                >
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {eintraege.map((e) => (
              <tr key={e.zeit} className="border-b border-border last:border-0">
                <td className="zahlen px-4 py-2.5 text-fg-muted">{e.zeit}</td>
                <td className="px-4 py-2.5">{e.akteur}</td>
                <td className="px-4 py-2.5 font-medium">{e.aktion}</td>
                <td className="px-4 py-2.5 text-fg-muted">{e.ziel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Huelle>
  );
}
