'use client';

import { useRef, useState, useTransition, type FormEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Badge, Button, Card, DatenTabelle, LeerZustand, Textarea, type Spalte } from '@bze/ui';
import {
  wissensDateiHochladenAction,
  wissensTextHinzufuegenAction,
  wissensdokumentDeaktivierenAction,
  wissensdokumentLoeschenAction,
} from './actions';
import type { WissensdokumentFilter } from './_lib/schemas';
import type { PaginierteWissensdokumentListe, WissensdokumentZeile } from './_lib/types';

/**
 * Interaktive Admin-UI fuer Wissensdokumente.
 */
export function WissensdatenbankClient({
  liste,
  filter,
}: {
  liste: PaginierteWissensdokumentListe;
  filter: WissensdokumentFilter;
}) {
  const t = useTranslations('admin.content.wissensdatenbank');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const textForm = useRef<HTMLFormElement>(null);
  const dateiForm = useRef<HTMLFormElement>(null);
  const [meldung, setMeldung] = useState<string | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function setzeFilter(status: WissensdokumentFilter['status']) {
    const neu = new URLSearchParams(params.toString());
    neu.set('status', status);
    neu.set('seite', '1');
    router.push(`${pathname}?${neu.toString()}`);
  }

  function geheZuSeite(seite: number) {
    const neu = new URLSearchParams(params.toString());
    neu.set('seite', String(seite));
    router.push(`${pathname}?${neu.toString()}`);
  }

  function sendeText(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    fuehreAus(() => wissensTextHinzufuegenAction(formData), () => {
      textForm.current?.reset();
      setMeldung(t('meldungen.textGespeichert'));
    });
  }

  function sendeDatei(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    fuehreAus(() => wissensDateiHochladenAction(formData), () => {
      dateiForm.current?.reset();
      setMeldung(t('meldungen.dateiGespeichert'));
    });
  }

  function deaktivieren(id: string) {
    fuehreAus(() => wissensdokumentDeaktivierenAction(id), () => setMeldung(t('meldungen.deaktiviert')));
  }

  function loeschen(id: string) {
    fuehreAus(() => wissensdokumentLoeschenAction(id), () => setMeldung(t('meldungen.geloescht')));
  }

  function fuehreAus(aktion: () => Promise<{ ok: true } | { ok: true; daten: unknown } | { ok: false; fehler: string }>, erfolg: () => void) {
    setFehler(null);
    setMeldung(null);
    startTransition(async () => {
      const ergebnis = await aktion();
      if (!ergebnis.ok) {
        setFehler(t('meldungen.fehler', { fehler: ergebnis.fehler }));
        router.refresh();
        return;
      }
      erfolg();
      router.refresh();
    });
  }

  const spalten: Spalte<WissensdokumentZeile>[] = [
    {
      key: 'titel',
      kopf: t('spalten.titel'),
      kopfzeileMobil: true,
      zelle: (row) => (
        <Link href={`/${locale}/admin/content/wissensdatenbank/${row.id}`} className="font-semibold text-primary underline-offset-2 hover:underline">
          {row.titel}
        </Link>
      ),
    },
    {
      key: 'status',
      kopf: t('spalten.status'),
      zelle: (row) => <StatusAnzeige dokument={row} />,
    },
    {
      key: 'quelle',
      kopf: t('spalten.quelle'),
      zelle: (row) => t(`quellen.${row.quelle_typ}`),
    },
    {
      key: 'dateityp',
      kopf: t('spalten.dateityp'),
      zelle: (row) => row.mime_type || row.quelle_typ,
    },
    {
      key: 'chunks',
      kopf: t('spalten.chunks'),
      zahl: true,
      zelle: (row) => row.chunk_anzahl,
    },
    {
      key: 'index',
      kopf: t('spalten.index'),
      zelle: (row) => t(`index.${row.index_status}`),
    },
    {
      key: 'created',
      kopf: t('spalten.erstellt'),
      zelle: (row) => new Date(row.created_at).toLocaleDateString(locale),
    },
    {
      key: 'aktionen',
      kopf: t('spalten.aktionen'),
      zelle: (row) => (
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variante="leise" groesse="sm" disabled={pending || !row.aktiv} onClick={() => deaktivieren(row.id)}>
            {t('aktionen.deaktivieren')}
          </Button>
          <Button type="button" variante="gefahr" groesse="sm" disabled={pending} onClick={() => loeschen(row.id)}>
            {t('aktionen.loeschen')}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <h2 className="text-h3">{t('textForm.titel')}</h2>
          <form ref={textForm} onSubmit={sendeText} className="mt-4 space-y-3">
            <label className="block text-sm font-semibold">
              {t('felder.titel')}
              <input name="titel" required maxLength={240} className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2" />
            </label>
            <label className="block text-sm font-semibold">
              {t('felder.beschreibung')}
              <input name="beschreibung" maxLength={2000} className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2" />
            </label>
            <label className="block text-sm font-semibold">
              {t('felder.text')}
              <Textarea name="text" required minLength={20} rows={8} className="mt-1" />
            </label>
            <Button type="submit" disabled={pending} laedt={pending}>
              {t('aktionen.textSpeichern')}
            </Button>
          </form>
        </Card>
        <Card>
          <h2 className="text-h3">{t('dateiForm.titel')}</h2>
          <p className="mt-1 text-sm text-fg-muted">{t('dateiForm.hinweis')}</p>
          <form ref={dateiForm} onSubmit={sendeDatei} className="mt-4 space-y-3">
            <label className="block text-sm font-semibold">
              {t('felder.titelOptional')}
              <input name="titel" maxLength={240} className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2" />
            </label>
            <label className="block text-sm font-semibold">
              {t('felder.beschreibung')}
              <input name="beschreibung" maxLength={2000} className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2" />
            </label>
            <label className="block text-sm font-semibold">
              {t('felder.datei')}
              <input name="datei" required type="file" accept=".txt,.md,.markdown,text/plain,text/markdown" className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2" />
            </label>
            <Button type="submit" disabled={pending} laedt={pending}>
              {t('aktionen.dateiHochladen')}
            </Button>
          </form>
        </Card>
      </div>

      {meldung && <p role="status" className="rounded-lg border border-status-fertig/40 bg-surface px-3 py-2 text-sm font-semibold text-status-fertig">{meldung}</p>}
      {fehler && <p role="alert" className="rounded-lg border border-status-falsch/40 bg-surface px-3 py-2 text-sm font-semibold text-status-falsch">{fehler}</p>}

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-h3">{t('liste.titel')}</h2>
            <p className="text-sm text-fg-muted">{t('liste.gesamt', { gesamt: liste.gesamt })}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['alle', 'aktiv', 'fehler', 'deaktiviert'] as const).map((status) => (
              <Button
                key={status}
                type="button"
                variante={filter.status === status ? 'sekundaer' : 'leise'}
                groesse="sm"
                onClick={() => setzeFilter(status)}
              >
                {t(`filter.${status}`)}
              </Button>
            ))}
          </div>
        </div>
        <DatenTabelle
          spalten={spalten}
          daten={liste.eintraege}
          schluessel={(row) => row.id}
          beschriftung={t('liste.tabelle')}
          zustand={liste.eintraege.length === 0 ? 'leer' : 'gefuellt'}
          leerInhalt={<LeerZustand titel={t('leer.titel')} text={t('leer.text')} />}
        />
        <div className="mt-4 flex items-center justify-between gap-3">
          <Button type="button" variante="leise" disabled={liste.seite <= 1} onClick={() => geheZuSeite(liste.seite - 1)}>
            {t('pagination.zurueck')}
          </Button>
          <p className="text-sm text-fg-muted">{t('pagination.stand', { seite: liste.seite, seiten: liste.seiten })}</p>
          <Button type="button" variante="leise" disabled={liste.seite >= liste.seiten} onClick={() => geheZuSeite(liste.seite + 1)}>
            {t('pagination.weiter')}
          </Button>
        </div>
      </Card>
    </div>
  );
}

/**
 * Rendert Status und aktive Kennzeichnung ohne Farbe als einziges Signal.
 */
function StatusAnzeige({ dokument }: { dokument: WissensdokumentZeile }) {
  const t = useTranslations('admin.content.wissensdatenbank');
  const kritisch = dokument.dokument_status === 'fehler' || !dokument.aktiv;
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variante={kritisch ? 'danger' : 'success'} symbol={kritisch ? '!' : 'ok'}>
        {t(`status.${dokument.dokument_status}`)}
      </Badge>
      {dokument.embedding_mock && <Badge variante="warning" symbol="M">{t('badges.mockEmbedding')}</Badge>}
    </div>
  );
}
