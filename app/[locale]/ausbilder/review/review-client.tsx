'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button, Card, StatusBadge } from '@bze/ui';
import { schliesseReviewAb, starteKiBewertung } from './actions';

export type OffenerVersuch = {
  id: string;
  frage_id: string;
  aufgabenstellung: string;
  antwortText: string;
  teilnehmer: string;
};

export type ReviewEintrag = {
  id: string;
  grund: string;
  status: string;
  versuch_id: string | null;
  frage_id: string | null;
  aufgabenstellung: string;
  antwortText: string;
  erzielte_punkte: number | null;
  confidence: number | null;
  teilnehmer: string;
  staerken: string | null;
  luecken: string | null;
  verbesserungshinweis: string | null;
};

const GRUND_KEY: Record<string, string> = {
  niedrige_confidence: 'niedrigeConfidence',
  stichprobe: 'stichprobe',
  einspruch: 'einspruch',
  nutzermeldung: 'nutzermeldung',
};

export function ReviewClient({
  offeneVersuche,
  reviews,
}: {
  offeneVersuche: OffenerVersuch[];
  reviews: ReviewEintrag[];
}) {
  const t = useTranslations('ausbilder.review');
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [fehler, setFehler] = useState<string | null>(null);
  const [punkte, setPunkte] = useState<Record<string, string>>({});
  const [kommentar, setKommentar] = useState<Record<string, string>>({});

  function bewerte(versuchId: string) {
    setFehler(null);
    startTransition(async () => {
      try {
        await starteKiBewertung({ versuchId });
        router.refresh();
      } catch (e) {
        setFehler(e instanceof Error ? e.message : t('fehlerAllgemein'));
      }
    });
  }

  function reviewAktion(reviewId: string, status: 'bestaetigt' | 'korrigiert' | 'abgelehnt') {
    setFehler(null);
    startTransition(async () => {
      try {
        const korr = punkte[reviewId];
        await schliesseReviewAb({
          reviewId,
          status,
          korrigiertePunkte:
            status === 'korrigiert' && korr != null && korr !== ''
              ? Number(korr)
              : undefined,
          kommentar: kommentar[reviewId] || undefined,
        });
        router.refresh();
      } catch (e) {
        setFehler(e instanceof Error ? e.message : t('fehlerAllgemein'));
      }
    });
  }

  return (
    <div className="space-y-6">
      <p
        role="note"
        className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-fg-muted"
      >
        <span aria-hidden="true" className="me-2">
          ℹ
        </span>
        {t('lernfeedbackHinweis')}
      </p>

      {fehler && (
        <p role="alert" className="text-sm font-semibold text-status-falsch">
          ✕ {fehler}
        </p>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-bold">{t('ausstehendTitel')}</h2>
        {offeneVersuche.length === 0 ? (
          <p className="text-sm text-fg-muted">{t('ausstehendLeer')}</p>
        ) : (
          offeneVersuche.map((v) => (
            <Card key={v.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-fg-muted">{v.teilnehmer}</p>
                  <p className="mt-1 font-semibold">{v.aufgabenstellung}</p>
                </div>
                <StatusBadge status="neu" label={t('statusOffen')} />
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm">{v.antwortText || t('keineAntwort')}</p>
              <Button
                type="button"
                className="mt-3"
                disabled={pending}
                onClick={() => bewerte(v.id)}
              >
                {t('kiStarten')}
              </Button>
            </Card>
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">{t('queueTitel')}</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-fg-muted">{t('queueLeer')}</p>
        ) : (
          reviews.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-fg-muted">{r.teilnehmer}</p>
                  <p className="mt-1 font-semibold">{r.aufgabenstellung}</p>
                </div>
                <StatusBadge
                  status="einmal_richtig"
                  label={t(`grund.${GRUND_KEY[r.grund] ?? 'sonstige'}`)}
                />
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm">{r.antwortText || t('keineAntwort')}</p>
              {(r.staerken || r.luecken || r.verbesserungshinweis) && (
                <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
                  {r.staerken && (
                    <p>
                      <span className="font-semibold">{t('staerken')}: </span>
                      {r.staerken}
                    </p>
                  )}
                  {r.luecken && (
                    <p>
                      <span className="font-semibold">{t('luecken')}: </span>
                      {r.luecken}
                    </p>
                  )}
                  {r.verbesserungshinweis && (
                    <p>
                      <span className="font-semibold">{t('hinweis')}: </span>
                      {r.verbesserungshinweis}
                    </p>
                  )}
                  <p className="text-fg-muted">
                    {t('punkteConfidence', {
                      punkte: r.erzielte_punkte ?? '–',
                      confidence:
                        r.confidence != null ? Math.round(r.confidence * 100) : '–',
                    })}
                  </p>
                </div>
              )}
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block font-semibold">{t('korrigiertePunkte')}</span>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    step={0.5}
                    value={punkte[r.id] ?? ''}
                    onChange={(e) => setPunkte((p) => ({ ...p, [r.id]: e.target.value }))}
                    className="touchable w-full rounded-xl border border-border bg-bg px-3 text-[15px]"
                  />
                </label>
                <label className="text-sm sm:col-span-2">
                  <span className="mb-1 block font-semibold">{t('kommentar')}</span>
                  <textarea
                    rows={2}
                    value={kommentar[r.id] ?? ''}
                    onChange={(e) => setKommentar((c) => ({ ...c, [r.id]: e.target.value }))}
                    className="touchable w-full rounded-xl border border-border bg-bg px-3 py-2 text-[15px]"
                  />
                </label>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  disabled={pending}
                  onClick={() => reviewAktion(r.id, 'bestaetigt')}
                >
                  {t('bestaetigen')}
                </Button>
                <Button
                  type="button"
                  disabled={pending}
                  onClick={() => reviewAktion(r.id, 'korrigiert')}
                >
                  {t('korrigieren')}
                </Button>
                <Button
                  type="button"
                  disabled={pending}
                  onClick={() => reviewAktion(r.id, 'abgelehnt')}
                >
                  {t('ablehnen')}
                </Button>
              </div>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
