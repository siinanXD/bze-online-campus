'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Badge, Button, Card, LeerZustand } from '@bze/ui';
import type { PaginierteQualitaetsListe, QualitaetsZeile } from '../_lib/types';
import { qualitaetsPruefungStartenAction } from './actions';

/**
 * Client-Komponente fuer Pruefaktionen in der Qualitaetsuebersicht.
 */
export function QualitaetsUebersichtClient({ liste }: { liste: PaginierteQualitaetsListe }) {
  const locale = useLocale();
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [meldung, setMeldung] = useState<string | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function pruefen(contentId: string) {
    setPendingId(contentId);
    setMeldung(null);
    setFehler(null);
    startTransition(async () => {
      const ergebnis = await qualitaetsPruefungStartenAction({ contentId });
      setPendingId(null);
      if (!ergebnis.ok) {
        setFehler(`Pruefung fehlgeschlagen: ${ergebnis.fehler}`);
        return;
      }
      setMeldung(`Qualitaetspruefung abgeschlossen: ${ergebnis.daten.score} Punkte.`);
      router.refresh();
    });
  }

  if (liste.eintraege.length === 0) {
    return (
      <Card>
        <LeerZustand titel="Keine Inhalte" text="Fuer diesen Filter wurden keine Inhalte gefunden." />
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {meldung && <p role="status" className="rounded-lg border border-status-fertig/40 px-3 py-2 text-sm font-semibold text-status-fertig">{meldung}</p>}
      {fehler && <p role="alert" className="rounded-lg border border-status-falsch/40 px-3 py-2 text-sm font-semibold text-status-falsch">{fehler}</p>}
      {liste.eintraege.map((row) => (
        <QualitaetsZeileKarte
          key={row.id}
          row={row}
          locale={locale}
          pending={pending && pendingId === row.id}
          onPruefen={() => pruefen(row.id)}
        />
      ))}
    </div>
  );
}

/**
 * Stellt ein Content-Element mit letzter Pruefung dar.
 */
function QualitaetsZeileKarte({
  row,
  locale,
  pending,
  onPruefen,
}: {
  row: QualitaetsZeile;
  locale: string;
  pending: boolean;
  onPruefen: () => void;
}) {
  const score = row.letztePruefung?.gesamt_score ?? (row.qualitaetswert == null ? null : Math.round(row.qualitaetswert * 100));
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href={`/${locale}/admin/content/inhalte/${row.id}`} className="font-bold text-primary underline-offset-2 hover:underline">
            {row.titel}
          </Link>
          <p className="mt-1 text-sm text-fg-muted">
            {row.content_typ} / {row.schwierigkeitsgrad}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ScoreBadge score={score} />
          {row.ist_demo && <Badge variante="warning" symbol="!">Demo</Badge>}
        </div>
      </div>
      <p className="mt-3 text-sm text-fg-muted">
        Score ist keine fachliche Freigabe. Im Demo-Modus blockiert die Pruefung die Sichtbarkeit nicht.
      </p>
      {row.letztePruefung && (
        <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          <div>
            <p className="font-semibold">Hinweise</p>
            <p className="text-fg-muted">{row.letztePruefung.hinweise.slice(0, 2).join(' ') || '-'}</p>
          </div>
          <div>
            <p className="font-semibold">Verbesserung</p>
            <p className="text-fg-muted">{row.letztePruefung.verbesserungsvorschlaege.slice(0, 2).join(' ') || '-'}</p>
          </div>
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" groesse="sm" laedt={pending} disabled={pending} onClick={onPruefen}>
          Pruefen
        </Button>
        <Link href={`/${locale}/admin/content/inhalte/${row.id}`} className="touchable rounded-lg border border-border px-3 py-2 text-sm font-semibold">
          Detail
        </Link>
      </div>
    </Card>
  );
}

/**
 * Zeigt die Scoreklasse nach Plattform-Schwelle.
 */
function ScoreBadge({ score }: { score: number | null }) {
  if (score == null) return <Badge variante="neutral">ohne Pruefung</Badge>;
  if (score < 60) return <Badge variante="danger">{score} problematisch</Badge>;
  if (score < 80) return <Badge variante="warning">{score} pruefen</Badge>;
  return <Badge variante="success">{score} gute Qualitaet</Badge>;
}
