'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button, Card, StatusBadge, cn, type FrageStatus } from '@bze/ui';
import type { LernFrage, MasteryStatus } from '@bze/core/mastery';
import { ZurueckIcon } from '@/components/shell/icons';
import { beantworteMc, type AntwortFeedback } from '../../_actions';

const STATUS_KEY: Record<MasteryStatus, string> = {
  neu: 'neu',
  einmal_richtig: 'einmalRichtig',
  falsch: 'falsch',
  abgeschlossen: 'abgeschlossen',
};

export interface FragenRunnerProps {
  queue: LernFrage[];
  backHref?: string;
  sessionLabel?: string;
}

/**
 * Fuehrt Lernende durch eine gespeicherte Multiple-Choice-Fragenrunde.
 */
export function FragenRunner({ queue, backHref, sessionLabel }: FragenRunnerProps) {
  const t = useTranslations('lernen');
  const tRoot = useTranslations();
  const [i, setI] = React.useState(0);
  const [gewaehlt, setGewaehlt] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<AntwortFeedback | null>(null);
  const [pending, setPending] = React.useState(false);
  const [fehlerText, setFehlerText] = React.useState<string | null>(null);
  const [start, setStart] = React.useState(() => Date.now());
  const [richtigZahl, setRichtigZahl] = React.useState(0);

  const frage = queue[i];
  const fertig = i >= queue.length || !frage;

  React.useEffect(() => {
    setStart(Date.now());
  }, [i]);

  if (fertig || !frage) {
    return (
      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-bold">{t('fertig.titel')}</h2>
          <p className="mt-1 text-fg-muted">
            {t('fertig.zusammenfassung', { richtig: richtigZahl, gesamt: queue.length })}
          </p>
        </div>
        {backHref && (
          <Link href={backHref} className="block">
            <Button volleBreite iconLinks={<ZurueckIcon className="h-5 w-5" />}>Zurück zur Auswahl</Button>
          </Link>
        )}
      </Card>
    );
  }

  /**
   * Speichert die ausgewaehlte Antwort und zeigt direkt den neuen Mastery-Stand.
   */
  async function absenden() {
    if (!gewaehlt || pending || !frage) return;
    setPending(true);
    setFehlerText(null);
    try {
      const fb = await beantworteMc({
        frageId: frage.id,
        optionId: gewaehlt,
        dauerSekunden: Math.round((Date.now() - start) / 1000),
      });
      setFeedback(fb);
      if (fb.ergebnis.ist_korrekt) setRichtigZahl((n) => n + 1);
    } catch {
      setFehlerText(t('fehler.speichern'));
    } finally {
      setPending(false);
    }
  }

  /**
   * Wechselt zur naechsten Frage der aktuellen Sitzung.
   */
  function weiter() {
    setFeedback(null);
    setGewaehlt(null);
    setI((n) => n + 1);
  }

  const beantwortet = feedback !== null;
  const fund = frage.tabellenbuch_fundstelle;
  const prozent = Math.round(((i + (beantwortet ? 1 : 0)) / queue.length) * 100);
  const streakText = feedback
    ? feedback.ergebnis.status === 'abgeschlossen'
      ? 'Abgeschlossen'
      : `${feedback.ergebnis.streak}/2 richtig in Folge`
    : 'Ziel: 2x richtig in Folge';

  return (
    <div className="flex min-h-full flex-col gap-3">
      <div className="shrink-0 space-y-2">
        <div className="flex items-center justify-between gap-2 text-sm">
          <div className="min-w-0">
            {sessionLabel && <p className="truncate text-xs font-bold uppercase text-primary">{sessionLabel}</p>}
            <p className="font-semibold text-fg-muted">{t('fortschritt', { pos: i + 1, gesamt: queue.length })}</p>
          </div>
          {backHref && (
            <Link
              href={backHref}
              aria-label="Fragenrunde beenden und zur Auswahl zurück"
              className="touchable inline-flex items-center gap-1 rounded-md px-2 text-sm font-semibold text-primary"
            >
              <ZurueckIcon className="h-5 w-5" />
              Beenden
            </Link>
          )}
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-bg-subtle" aria-hidden="true">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${prozent}%` }} />
        </div>
      </div>

      <Card className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-primary-subtle px-2 py-1 text-xs font-bold text-primary">
            {streakText}
          </span>
          {feedback && (
            <StatusBadge
              status={feedback.ergebnis.status as FrageStatus}
              label={tRoot(`status.${STATUS_KEY[feedback.ergebnis.status]}`)}
            />
          )}
        </div>

        <p className="text-[17px] font-bold leading-snug">{frage.aufgabenstellung}</p>

        <div className="mt-4 space-y-2">
          {frage.optionen.map((option) => {
            const istRichtige = feedback?.richtigeOptionId === option.id;
            const istGewaehltFalsch = beantwortet && gewaehlt === option.id && !istRichtige;
            return (
              <button
                key={option.id}
                type="button"
                disabled={beantwortet || pending}
                onClick={() => setGewaehlt(option.id)}
                aria-pressed={gewaehlt === option.id}
                className={cn(
                  'touchable flex w-full items-start gap-2 rounded-lg border p-3 text-start text-[15px] transition',
                  !beantwortet && gewaehlt === option.id && 'border-primary ring-2 ring-primary',
                  !beantwortet && gewaehlt !== option.id && 'border-border hover:border-primary',
                  istRichtige && 'border-status-fertig text-status-fertig',
                  istGewaehltFalsch && 'border-status-falsch text-status-falsch',
                  beantwortet && !istRichtige && !istGewaehltFalsch && 'border-border opacity-70',
                )}
              >
                <span aria-hidden="true" className="mt-0.5 font-bold">
                  {istRichtige ? '+' : istGewaehltFalsch ? 'x' : 'o'}
                </span>
                <span>{option.text}</span>
              </button>
            );
          })}
        </div>

        {fehlerText && (
          <p role="alert" className="mt-3 text-sm text-status-falsch">
            {fehlerText}
          </p>
        )}

        {beantwortet && (
          <div className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
            <p className="font-semibold">
              {feedback.ergebnis.ist_korrekt ? t('feedback.richtig') : t('feedback.falsch')}
            </p>
            {feedback.richtigErklaerung && <p className="text-fg-muted">{feedback.richtigErklaerung}</p>}
            {!feedback.ergebnis.ist_korrekt && fund && (
              <p className="text-fg-muted">
                {t('beleg')}: {fund.auflage ?? ''} {fund.seite ? `S. ${fund.seite}` : ''}
                {fund.tabelle ? `, ${fund.tabelle}` : ''}
              </p>
            )}
            {feedback.ergebnis.spacing_gesperrt && (
              <p className="text-xs text-fg-muted">{t('spacingHinweis')}</p>
            )}
          </div>
        )}
      </Card>

      <div className="shrink-0">
        {!beantwortet ? (
          <Button className="w-full min-h-12" onClick={absenden} disabled={!gewaehlt || pending}>
            {pending ? t('pruefe') : t('antworten')}
          </Button>
        ) : (
          <Button className="w-full min-h-12" onClick={weiter}>
            {t('weiter')}
          </Button>
        )}
      </div>
    </div>
  );
}
