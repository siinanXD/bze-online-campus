'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Badge, Button, Card, DatenTabelle, LeerZustand, StatusBadge, type FrageStatus, type Spalte } from '@bze/ui';
import { contentBulkArchivierenAction, contentStatusAendernAction } from '../actions';
import { contentKonstanten } from '../_lib/schemas';
import type { ContentZeile, PaginierteContentListe } from '../_lib/types';

const STATUS_UI: Record<string, FrageStatus> = {
  entwurf: 'neu',
  generiert: 'einmal_richtig',
  in_pruefung: 'falsch',
  freigegeben: 'abgeschlossen',
  abgelehnt: 'falsch',
  archiviert: 'neu',
};

/**
 * Content-Tabelle mit Sortierung, Pagination und Bulk-Aktionen.
 */
export function ContentListe({ liste }: { liste: PaginierteContentListe }) {
  const t = useTranslations('admin.content');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [auswahl, setAuswahl] = useState<Set<string>>(new Set());
  const [meldung, setMeldung] = useState<string | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle(id: string) {
    setAuswahl((alt) => {
      const neu = new Set(alt);
      if (neu.has(id)) neu.delete(id);
      else neu.add(id);
      return neu;
    });
  }

  function sortiere(key: string) {
    const neu = new URLSearchParams(params.toString());
    const aktuelleRichtung = neu.get('richtung') ?? 'desc';
    if (neu.get('sort') === key) neu.set('richtung', aktuelleRichtung === 'asc' ? 'desc' : 'asc');
    else {
      neu.set('sort', key);
      neu.set('richtung', 'asc');
    }
    router.push(`${pathname}?${neu.toString()}`);
  }

  function geheZuSeite(seite: number) {
    const neu = new URLSearchParams(params.toString());
    neu.set('seite', String(seite));
    router.push(`${pathname}?${neu.toString()}`);
  }

  function bulkStatus(status: string) {
    const ids = [...auswahl];
    if (ids.length === 0) return;
    setFehler(null);
    setMeldung(null);
    startTransition(async () => {
      const ergebnis =
        status === 'archiviert'
          ? await contentBulkArchivierenAction({ ids })
          : await contentStatusAendernAction({ ids, status });
      if (!ergebnis.ok) {
        setFehler(t('fehler.aktion', { fehler: ergebnis.fehler }));
        return;
      }
      setAuswahl(new Set());
      setMeldung(t('liste.bulkErfolg'));
      router.refresh();
    });
  }

  const spalten = useMemo<Spalte<ContentZeile>[]>(() => [
    {
      key: 'auswahl',
      kopf: t('liste.auswahl'),
      kopfzeileMobil: true,
      zelle: (row) => (
        <input
          type="checkbox"
          aria-label={t('liste.auswaehlen', { titel: row.titel })}
          checked={auswahl.has(row.id)}
          onChange={() => toggle(row.id)}
          className="h-5 w-5"
        />
      ),
      breite: '44px',
    },
    {
      key: 'titel',
      kopf: t('spalten.titel'),
      sortierbar: true,
      kopfzeileMobil: true,
      zelle: (row) => (
        <Link href={`/${locale}/admin/content/inhalte/${row.id}`} className="font-semibold text-primary underline-offset-2 hover:underline">
          {row.titel}
        </Link>
      ),
    },
    {
      key: 'content_typ',
      kopf: t('spalten.typ'),
      sortierbar: true,
      zelle: (row) => t(`typen.${row.content_typ}`),
    },
    {
      key: 'status',
      kopf: t('spalten.status'),
      sortierbar: true,
      zelle: (row) => <StatusBadge status={STATUS_UI[row.status] ?? 'neu'} label={t(`status.${row.status}`)} />,
    },
    {
      key: 'demo',
      kopf: t('spalten.demo'),
      zelle: (row) => row.ist_demo ? <Badge variante="warning" symbol="!">{t('badges.demo')}</Badge> : <span className="text-fg-muted">-</span>,
    },
    {
      key: 'quellenart',
      kopf: t('spalten.quelle'),
      sortierbar: true,
      zelle: (row) => t(`quellen.${row.quellenart}`),
    },
    {
      key: 'schwierigkeitsgrad',
      kopf: t('spalten.schwierigkeit'),
      sortierbar: true,
      zelle: (row) => t(`schwierigkeit.${row.schwierigkeitsgrad}`),
    },
    {
      key: 'lernziele',
      kopf: t('spalten.lernziele'),
      zahl: true,
      zelle: (row) => row.lernzielAnzahl ?? 0,
    },
    {
      key: 'qualitaetswert',
      kopf: t('spalten.qualitaet'),
      zahl: true,
      sortierbar: true,
      zelle: (row) => row.qualitaetswert == null ? '-' : `${Math.round(row.qualitaetswert * 100)} %`,
    },
  ], [auswahl, locale, t]);

  return (
    <div className="space-y-3">
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{t('liste.auswahlZaehler', { anzahl: auswahl.size })}</p>
          <p className="text-xs text-fg-muted">{t('liste.gesamt', { gesamt: liste.gesamt })}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            aria-label={t('liste.bulkStatusLabel')}
            disabled={pending || auswahl.size === 0}
            defaultValue=""
            onChange={(event) => {
              if (event.currentTarget.value) bulkStatus(event.currentTarget.value);
              event.currentTarget.value = '';
            }}
            className="touchable rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          >
            <option value="">{t('liste.statusAendern')}</option>
            {contentKonstanten.status.map((status) => <option key={status} value={status}>{t(`status.${status}`)}</option>)}
          </select>
          <Button type="button" variante="leise" disabled={pending || auswahl.size === 0} onClick={() => bulkStatus('archiviert')}>
            {t('liste.archivieren')}
          </Button>
        </div>
      </Card>

      {meldung && <p role="status" className="rounded-xl border border-status-fertig/40 bg-surface px-3 py-2 text-sm font-semibold text-status-fertig">{meldung}</p>}
      {fehler && <p role="alert" className="rounded-xl border border-status-falsch/40 bg-surface px-3 py-2 text-sm font-semibold text-status-falsch">{fehler}</p>}

      <DatenTabelle
        spalten={spalten}
        daten={liste.eintraege}
        schluessel={(row) => row.id}
        beschriftung={t('liste.tabelle')}
        zustand={liste.eintraege.length === 0 ? 'leer' : 'gefuellt'}
        leerInhalt={<LeerZustand titel={t('leer.titel')} text={t('leer.text')} />}
        sortierung={{
          key: params.get('sort') ?? 'updated_at',
          richtung: (params.get('richtung') ?? 'desc') === 'asc' ? 'aufsteigend' : 'absteigend',
        }}
        onSortieren={sortiere}
      />

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variante="leise" disabled={liste.seite <= 1} onClick={() => geheZuSeite(liste.seite - 1)}>
          {t('pagination.zurueck')}
        </Button>
        <p className="text-sm text-fg-muted">{t('pagination.stand', { seite: liste.seite, seiten: liste.seiten })}</p>
        <Button type="button" variante="leise" disabled={liste.seite >= liste.seiten} onClick={() => geheZuSeite(liste.seite + 1)}>
          {t('pagination.weiter')}
        </Button>
      </div>
    </div>
  );
}
