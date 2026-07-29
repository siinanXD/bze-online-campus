'use client';
import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Button, Card, StatusBadge, cn, type FrageStatus } from '@bze/ui';
import type { LernFrage, MasteryStatus } from '@bze/core/mastery';
import { beantworteMc, type AntwortFeedback } from '../../_actions';

const STATUS_KEY: Record<MasteryStatus, string> = {
  neu: 'neu', einmal_richtig: 'einmalRichtig', falsch: 'falsch', abgeschlossen: 'abgeschlossen',
};

export function FragenRunner({ queue }: { queue: LernFrage[] }) {
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

  React.useEffect(() => { setStart(Date.now()); }, [i]);

  if (fertig || !frage) {
    return (
      <Card>
        <h2 className="text-lg font-bold">{t('fertig.titel')}</h2>
        <p className="mt-1 text-fg-muted">{t('fertig.zusammenfassung', { richtig: richtigZahl, gesamt: queue.length })}</p>
      </Card>
    );
  }

  async function absenden() {
    if (!gewaehlt || pending || !frage) return;
    setPending(true); setFehlerText(null);
    try {
      const fb = await beantworteMc({ frageId: frage.id, optionId: gewaehlt, dauerSekunden: Math.round((Date.now() - start) / 1000) });
      setFeedback(fb);
      if (fb.ergebnis.ist_korrekt) setRichtigZahl((n) => n + 1);
    } catch {
      setFehlerText(t('fehler.speichern'));
    } finally {
      setPending(false);
    }
  }

  function weiter() {
    setFeedback(null); setGewaehlt(null); setI((n) => n + 1);
  }

  const beantwortet = feedback !== null;
  const fund = frage.tabellenbuch_fundstelle;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-fg-muted">
        <span>{t('fortschritt', { pos: i + 1, gesamt: queue.length })}</span>
        {feedback && (
          <StatusBadge
            status={feedback.ergebnis.status as FrageStatus}
            label={tRoot(`status.${STATUS_KEY[feedback.ergebnis.status]}`)}
          />
        )}
      </div>

      <Card>
        <p className="text-[17px] font-semibold leading-snug">{frage.aufgabenstellung}</p>

        <div className="mt-4 space-y-2">
          {frage.optionen.map((o) => {
            const istRichtige = feedback?.richtigeOptionId === o.id;
            const istGewaehltFalsch = beantwortet && gewaehlt === o.id && !istRichtige;
            return (
              <button
                key={o.id}
                type="button"
                disabled={beantwortet || pending}
                onClick={() => setGewaehlt(o.id)}
                aria-pressed={gewaehlt === o.id}
                className={cn(
                  'touchable flex w-full items-start gap-2 rounded-xl border p-3 text-start text-[15px] transition',
                  !beantwortet && gewaehlt === o.id && 'border-primary ring-2 ring-primary',
                  !beantwortet && gewaehlt !== o.id && 'border-border hover:border-primary',
                  istRichtige && 'border-status-fertig text-status-fertig',
                  istGewaehltFalsch && 'border-status-falsch text-status-falsch',
                  beantwortet && !istRichtige && !istGewaehltFalsch && 'border-border opacity-70',
                )}
              >
                <span aria-hidden="true" className="mt-0.5 font-bold">
                  {istRichtige ? '✓' : istGewaehltFalsch ? '✕' : '○'}
                </span>
                <span>{o.text}</span>
              </button>
            );
          })}
        </div>

        {fehlerText && <p role="alert" className="mt-3 text-sm text-status-falsch">{fehlerText}</p>}

        {beantwortet && (
          <div className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
            <p className="font-semibold">
              {feedback!.ergebnis.ist_korrekt ? t('feedback.richtig') : t('feedback.falsch')}
            </p>
            {feedback!.richtigErklaerung && <p className="text-fg-muted">{feedback!.richtigErklaerung}</p>}
            {!feedback!.ergebnis.ist_korrekt && fund && (
              <p className="text-fg-muted">
                {t('beleg')}: {fund.auflage ?? ''} {fund.seite ? `S. ${fund.seite}` : ''}{fund.tabelle ? `, ${fund.tabelle}` : ''}
              </p>
            )}
            {feedback!.ergebnis.spacing_gesperrt && <p className="text-xs text-fg-muted">{t('spacingHinweis')}</p>}
          </div>
        )}
      </Card>

      {!beantwortet ? (
        <Button className="w-full" onClick={absenden} disabled={!gewaehlt || pending}>
          {pending ? t('pruefe') : t('antworten')}
        </Button>
      ) : (
        <Button className="w-full" onClick={weiter}>{t('weiter')}</Button>
      )}
    </div>
  );
}
