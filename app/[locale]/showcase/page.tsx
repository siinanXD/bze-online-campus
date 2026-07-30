'use client';

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardFuss,
  CardKopf,
  CardTitel,
  Checkbox,
  Chip,
  DatenTabelle,
  FehlerZustand,
  Formularfeld,
  IconButton,
  Input,
  LadeZustand,
  LeerZustand,
  Progress,
  ProgressRing,
  Radio,
  Select,
  Skeleton,
  Spinner,
  StatusBadge,
  Textarea,
  type FrageStatus,
} from '@bze/ui';
import { Abschnitt, Reihe } from './_components/abschnitt';
import { VorschauSchalter } from './_components/vorschau-schalter';

/**
 * Designsystem-Referenz und Abnahmewerkzeug.
 *
 * Bewusste Ausnahme von der i18n-Regel: diese Seite ist ein internes
 * Entwicklerwerkzeug und wird Teilnehmenden nie angezeigt. Sie steht
 * deshalb fest auf Deutsch, statt 150 Uebersetzungsschluessel zu binden.
 */

const STATI: { status: FrageStatus; label: string }[] = [
  { status: 'neu', label: 'Noch nicht geübt' },
  { status: 'einmal_richtig', label: 'Teilweise sicher' },
  { status: 'falsch', label: 'Nochmal üben' },
  { status: 'abgeschlossen', label: 'Sicher' },
];

const FARBEN: { name: string; klasse: string; hex: string; text?: string }[] = [
  { name: 'primary', klasse: 'bg-primary', hex: '#B45309', text: 'text-fg-onPrimary' },
  { name: 'primary-hover', klasse: 'bg-primary-hover', hex: '#92400E', text: 'text-white' },
  { name: 'primary-subtle', klasse: 'bg-primary-subtle', hex: '#FDF8ED' },
  { name: 'bg', klasse: 'bg-bg', hex: '#FAFAF9' },
  { name: 'bg-subtle', klasse: 'bg-bg-subtle', hex: '#F5F5F4' },
  { name: 'surface', klasse: 'bg-surface', hex: '#FFFFFF' },
  { name: 'border', klasse: 'bg-border', hex: '#E7E5E4' },
  { name: 'border-strong', klasse: 'bg-border-strong', hex: '#D6D3D1' },
  { name: 'fg', klasse: 'bg-fg', hex: '#1C1917', text: 'text-bg' },
  { name: 'fg-muted', klasse: 'bg-fg-muted', hex: '#57534E', text: 'text-white' },
  { name: 'success', klasse: 'bg-success', hex: '#15803D', text: 'text-white' },
  { name: 'warning', klasse: 'bg-warning', hex: '#A16207', text: 'text-white' },
  { name: 'danger', klasse: 'bg-danger', hex: '#B91C1C', text: 'text-white' },
  { name: 'info', klasse: 'bg-info', hex: '#1D4ED8', text: 'text-white' },
];

const TYPO: { klasse: string; name: string; wert: string }[] = [
  { klasse: 'text-display', name: 'display', wert: '2.25 / 2.5 · 700' },
  { klasse: 'text-h1', name: 'h1', wert: '1.875 / 2.25 · 700' },
  { klasse: 'text-h2', name: 'h2', wert: '1.5 / 2 · 600' },
  { klasse: 'text-h3', name: 'h3', wert: '1.25 / 1.75 · 600' },
  { klasse: 'text-h4', name: 'h4', wert: '1.125 / 1.625 · 600' },
  { klasse: 'text-body-lg', name: 'body-lg', wert: '1.125 / 1.75 · 400' },
  { klasse: 'text-body', name: 'body', wert: '1 / 1.5 · 400' },
  { klasse: 'text-body-sm', name: 'body-sm', wert: '0.875 / 1.375 · 400' },
  { klasse: 'text-label', name: 'label', wert: '0.875 / 1.25 · 500' },
  { klasse: 'text-caption', name: 'caption', wert: '0.75 / 1.125 · 400' },
];

const SPACING = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];

interface Teilnehmer {
  id: string;
  name: string;
  kohorte: string;
  reife: number;
  offen: number;
}

const TABELLE: Teilnehmer[] = [
  { id: '1', name: 'Amina Yildiz', kohorte: 'MAF-2026-A', reife: 78, offen: 2 },
  { id: '2', name: 'Dmytro Kovalenko', kohorte: 'MAF-2026-A', reife: 54, offen: 0 },
  { id: '3', name: 'Sara Ben Ali', kohorte: 'MAF-2026-B', reife: 91, offen: 1 },
];

export default function Showcase() {
  return (
    <main id="inhalt" className="mx-auto max-w-campus space-y-8 px-4 py-6 md:px-8">
      <header className="space-y-2">
        <p className="text-overline uppercase text-fg-subtle">BZE Online Campus</p>
        <h1 className="text-h1">Designsystem</h1>
        <p className="max-w-lese text-body text-fg-muted">
          Jede Komponente mit jeder Variante und jedem Zustand. Prüfe neue
          Oberflächen gegen diese Seite, bevor du sie abnimmst.
        </p>
      </header>

      <VorschauSchalter />

      {/* ---------------------------------------------------------- Farben */}
      <Abschnitt
        titel="Farbpalette"
        hinweis="Primär erscheint nur als gefüllte Fläche. Warnungen bekommen immer eine helle Fläche mit Rand, Symbol und Textlabel — so bleiben sie vom bernsteinfarbenen Primärbutton unterscheidbar."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {FARBEN.map((f) => (
            <div key={f.name} className="overflow-hidden rounded-lg border border-border">
              <div
                className={`flex h-16 items-end p-2 ${f.klasse} ${f.text ?? 'text-fg'}`}
              >
                <span className="text-caption font-medium">{f.hex}</span>
              </div>
              <p className="bg-surface px-2 py-1.5 text-caption text-fg-muted">{f.name}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-overline uppercase text-fg-subtle">Lernstatus</p>
          <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-surface p-4">
            {STATI.map((s) => (
              <StatusBadge
                key={s.status}
                status={s.status}
                label={s.label}
                fehler={s.status === 'falsch' ? 2 : 0}
              />
            ))}
          </div>
          <p className="text-caption text-fg-muted">
            Farbe ist nie alleiniger Träger: jeder Status hat zusätzlich Symbol und Text.
          </p>
        </div>
      </Abschnitt>

      {/* ------------------------------------------------------ Typografie */}
      <Abschnitt
        titel="Typografie"
        hinweis="Inter, selbst gehostet. Es gibt genau diese Größen — wer eine andere braucht, nimmt die nächstgelegene."
      >
        <div className="space-y-3 rounded-lg border border-border bg-surface p-5">
          {TYPO.map((t) => (
            <div
              key={t.name}
              className="flex flex-col gap-1 border-b border-border pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <p className={t.klasse}>Prüfungsvorbereitung</p>
              <p className="shrink-0 text-caption text-fg-subtle">
                {t.name} · {t.wert}
              </p>
            </div>
          ))}
        </div>
      </Abschnitt>

      {/* --------------------------------------------------------- Spacing */}
      <Abschnitt titel="Abstände" hinweis="4er-Raster. Alle Abstände sind Vielfache von 4px.">
        <div className="space-y-2 rounded-lg border border-border bg-surface p-5">
          {SPACING.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <span className="zahlen w-8 shrink-0 text-caption text-fg-subtle">{s}</span>
              <span className="h-3 rounded-sm bg-primary" style={{ width: s * 4 }} />
              <span className="zahlen text-caption text-fg-muted">{s * 4}px</span>
            </div>
          ))}
        </div>
      </Abschnitt>

      {/* --------------------------------------------------------- Buttons */}
      <Abschnitt
        titel="Button"
        hinweis="Pro Screen genau ein primary-Button. Im Campus-Bereich mindestens 48px hoch."
      >
        <Reihe label="Varianten">
          <Button variante="primary">Prüfung starten</Button>
          <Button variante="sekundaer">Entwurf speichern</Button>
          <Button variante="leise">Abbrechen</Button>
          <Button variante="gefahr">Konto löschen</Button>
          <Button variante="link">Passwort vergessen</Button>
        </Reihe>

        <Reihe label="Größen">
          <Button groesse="sm">Klein (sm)</Button>
          <Button groesse="md">Mittel (md)</Button>
          <Button groesse="lg">Groß (lg)</Button>
        </Reihe>

        <Reihe label="Zustände">
          <Button>Standard</Button>
          <Button disabled>Deaktiviert</Button>
          <Button laedt>Wird gesendet</Button>
          <Button variante="sekundaer" disabled>
            Deaktiviert
          </Button>
          <Button variante="sekundaer" laedt>
            Lädt
          </Button>
        </Reihe>

        <Reihe label="Mit Icon und volle Breite">
          <Button iconLinks={<span aria-hidden="true">↻</span>}>Erneut versuchen</Button>
          <Button variante="sekundaer" iconRechts={<span aria-hidden="true">→</span>}>
            Weiter
          </Button>
          <IconButton aria-label="Suche öffnen" icon={<span aria-hidden="true">⌕</span>} />
          <div className="w-full">
            <Button volleBreite groesse="lg">
              Anmelden
            </Button>
          </div>
        </Reihe>
      </Abschnitt>

      {/* -------------------------------------------------------- Eingaben */}
      <Abschnitt
        titel="Eingaben"
        hinweis="Jedes Feld hat ein sichtbares Label. Ein Platzhalter ersetzt nie ein Label. Pflichtfelder werden mit dem Wort „Pflicht“ gekennzeichnet."
      >
        <div className="grid gap-5 rounded-lg border border-border bg-surface p-5 md:grid-cols-2">
          <Formularfeld label="E-Mail-Adresse" pflicht hinweis="Die Adresse aus deinem Einladungsschreiben.">
            {(p) => <Input type="email" inputMode="email" placeholder="name@beispiel.de" {...p} />}
          </Formularfeld>

          <Formularfeld label="Stunden" hinweis="Volle Stunden genügen.">
            {(p) => <Input type="number" inputMode="numeric" defaultValue={8} {...p} />}
          </Formularfeld>

          <Formularfeld label="Passwort" fehler="Das Passwort braucht mindestens 8 Zeichen." pflicht>
            {(p) => <Input type="password" defaultValue="123" {...p} />}
          </Formularfeld>

          <Formularfeld label="Lernfeld">
            {(p) => (
              <Select {...p}>
                <option>Lernfeld 1 — Fertigungstechnik</option>
                <option>Lernfeld 2 — Werkstoffe</option>
              </Select>
            )}
          </Formularfeld>

          <Formularfeld label="Deaktiviertes Feld">
            {(p) => <Input disabled defaultValue="Nicht änderbar" {...p} />}
          </Formularfeld>

          <Formularfeld label="Nur lesbar">
            {(p) => <Input readOnly defaultValue="MAF-2026-A" {...p} />}
          </Formularfeld>

          <div className="md:col-span-2">
            <Formularfeld label="Tätigkeiten dieser Woche" pflicht>
              {(p) => <Textarea placeholder="Was hast du diese Woche gemacht?" {...p} />}
            </Formularfeld>
          </div>

          <div className="space-y-3">
            <Checkbox label="Ich habe die Hinweise gelesen" defaultChecked />
            <Checkbox label="Teilweise ausgewählt" unbestimmt />
            <Checkbox label="Deaktiviert" disabled />
            <Checkbox label="Mit Fehler" fehler hinweis="Bitte bestätigen." />
          </div>

          <div className="space-y-3">
            <Radio name="vorschau-radio" label="Antwort A" defaultChecked />
            <Radio name="vorschau-radio" label="Antwort B" hinweis="Mit Zusatzhinweis" />
            <Radio name="vorschau-radio" label="Deaktiviert" disabled />
          </div>
        </div>
      </Abschnitt>

      {/* --------------------------------------------------------- Anzeige */}
      <Abschnitt titel="Badge, Alert und Fortschritt">
        <Reihe label="Badge">
          <Badge>Neutral</Badge>
          <Badge variante="primary">Primär</Badge>
          <Badge variante="success" symbol="✓">
            Abgezeichnet
          </Badge>
          <Badge variante="warning" symbol="!">
            Fällig
          </Badge>
          <Badge variante="danger" symbol="✕">
            Zurückgewiesen
          </Badge>
          <Badge variante="info" symbol="i">
            Entwurf
          </Badge>
        </Reihe>

        <div className="space-y-3">
          <p className="text-overline uppercase text-fg-subtle">Alert</p>
          <Alert variante="info" titel="Automatisches Lernfeedback">
            Keine Prüfungsleistung und keine Bewertung der Kammer.
          </Alert>
          <Alert variante="success" titel="Berichtsheft eingereicht">
            Dein Ausbilder sieht den Eintrag jetzt in seiner Liste.
          </Alert>
          <Alert variante="warning" titel="Prüfung endet in 5 Minuten">
            Speichere deine Antworten rechtzeitig.
          </Alert>
          <Alert
            variante="danger"
            titel="Keine Verbindung"
            aktion={
              <Button variante="sekundaer" groesse="sm">
                Erneut versuchen
              </Button>
            }
          >
            Deine Eingaben werden gespeichert und später gesendet.
          </Alert>
        </div>

        <Reihe label="Fortschritt">
          <div className="w-64">
            <Progress wert={72} label="Beherrschung Lernfeld 1" />
          </div>
          <div className="w-64">
            <Progress wert={12} label="Beherrschung Lernfeld 3" />
          </div>
          <ProgressRing value={72} size={96} label="Prüfungsreife 72 Prozent" />
          <ProgressRing value={38} size={56} label="Prüfungsreife 38 Prozent" />
        </Reihe>

        <Reihe label="Avatar, Chip, Spinner, Skeleton">
          <Avatar name="Amina Yildiz" groesse={24} />
          <Avatar name="Dmytro Kovalenko" groesse={32} />
          <Avatar name="Sara Ben Ali" groesse={40} />
          <Avatar name="Lukas Hoffmann" groesse={48} />
          <Chip active>Woche 12</Chip>
          <Chip>Woche 13</Chip>
          <Spinner groesse="sm" />
          <Spinner groesse="md" />
          <Spinner groesse="lg" />
          <div className="w-40 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Reihe>
      </Abschnitt>

      {/* ----------------------------------------------------------- Karten */}
      <Abschnitt titel="Karten">
        <div className="grid gap-4 md:grid-cols-3">
          <Card variante="flach">
            <CardKopf>
              <CardTitel>Flach</CardTitel>
            </CardKopf>
            <p className="text-body-sm text-fg-muted">Nur Rand, kein Schatten.</p>
          </Card>

          <Card variante="erhoben">
            <CardKopf>
              <CardTitel>Erhoben</CardTitel>
              <Badge variante="primary">Neu</Badge>
            </CardKopf>
            <p className="text-body-sm text-fg-muted">Mit leichtem Schatten.</p>
            <CardFuss>
              <Button groesse="sm">Öffnen</Button>
              <Button groesse="sm" variante="leise">
                Später
              </Button>
            </CardFuss>
          </Card>

          <Card variante="interaktiv">
            <CardKopf>
              <CardTitel>Interaktiv</CardTitel>
              <StatusBadge status="einmal_richtig" label="Teilweise sicher" />
            </CardKopf>
            <p className="mb-3 text-body-sm text-fg-muted">
              Ganze Fläche klickbar, Schatten beim Überfahren.
            </p>
            <Progress wert={45} label="Fortschritt Lernfeld 2" />
          </Card>
        </div>
      </Abschnitt>

      {/* --------------------------------------------------------- Zustände */}
      <Abschnitt
        titel="Lade-, Leer- und Fehlerzustand"
        hinweis="Pflicht auf jedem Screen, der Daten lädt. Ein Screen ohne diese drei wird nicht abgenommen."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <LeerZustand
            titel="Nichts zu prüfen"
            text="Alle Abgaben sind bearbeitet. Neue erscheinen hier automatisch."
            aktion={<Button>Zur Teilnehmerliste</Button>}
          />
          <FehlerZustand
            text="Die Liste konnte nicht geladen werden. Prüfe deine Verbindung."
            aktion={<Button variante="sekundaer">Erneut versuchen</Button>}
            details="TypeError: fetch failed (ECONNREFUSED 127.0.0.1:54321)"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="text-overline uppercase text-fg-subtle">Laden — Liste</p>
            <LadeZustand art="liste" />
          </div>
          <div className="space-y-2">
            <p className="text-overline uppercase text-fg-subtle">Laden — Formular</p>
            <LadeZustand art="formular" />
          </div>
        </div>
      </Abschnitt>

      {/* --------------------------------------------------------- Tabelle */}
      <Abschnitt
        titel="Datentabelle"
        hinweis="Für Ausbilder und Admin. Unter 768px wird jede Zeile zu einer Karte."
      >
        <DatenTabelle<Teilnehmer>
          beschriftung="Teilnehmende der Kohorte MAF-2026"
          daten={TABELLE}
          schluessel={(d) => d.id}
          sortierung={{ key: 'reife', richtung: 'absteigend' }}
          spalten={[
            {
              key: 'name',
              kopf: 'Name',
              kopfzeileMobil: true,
              sortierbar: true,
              zelle: (d) => (
                <span className="flex items-center gap-2">
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
          ]}
        />
      </Abschnitt>
    </main>
  );
}
