import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card, Button, ProgressRing } from '@bze/ui';
import type { FokusStand } from '@/app/[locale]/campus/_lib/push-queries';

export interface FokusKarteProps {
  stand: FokusStand;
  locale: string;
}

/**
 * Fokus-Block auf der Startseite (AP-17).
 *
 * Bündelt die drei Signale, die den Lernenden am Ball halten, an genau der
 * Stelle, an der die Entscheidung fällt, die App zu öffnen oder wegzulegen:
 *  - die Lernserie (mit dem Hinweis „heute noch offen", solange sie zu retten ist),
 *  - das Tagesziel als Fortschrittsring,
 *  - die Fehler-Wiedervorlage als eigener, benannter Einstieg.
 *
 * Server-Komponente: alle Werte kommen fertig aus `ladeFokusStand`, hier wird
 * nur dargestellt. Nach der Design-Regel trägt jeder Zustand Symbol UND Text —
 * die Farbe ist nie der alleinige Träger.
 */
export async function FokusKarte({ stand, locale }: FokusKarteProps) {
  const t = await getTranslations('fokus');
  const { serie, tagesziel, faellig } = stand;

  const serienText =
    serie.status === 'aktiv'
      ? serie.laenge <= 1
        ? t('serieErsterTag')
        : t('serieAktiv', { tage: serie.laenge })
      : serie.status === 'gefaehrdet'
        ? t('serieGefaehrdet', { tage: serie.laenge })
        : t('serieGerissen');

  // Symbol trägt den Serienzustand mit, nicht nur die Farbe.
  const serienSymbol = serie.status === 'aktiv' ? '◆' : serie.status === 'gefaehrdet' ? '◈' : '◇';

  return (
    <Card className="space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wide text-primary">{t('titel')}</h2>

      <div className="flex items-center gap-4">
        <ProgressRing
          value={Math.round(tagesziel.anteil * 100)}
          size={64}
          label={
            tagesziel.erreicht
              ? t('tageszielErreicht')
              : t('tagesziel', { erledigt: tagesziel.erledigt, ziel: tagesziel.ziel })
          }
        />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 font-semibold">
            <span aria-hidden="true">{serienSymbol}</span>
            <span>{serienText}</span>
          </p>
          <p className="text-sm text-fg-muted">
            {tagesziel.erreicht
              ? t('tageszielErreicht')
              : t('tagesziel', { erledigt: tagesziel.erledigt, ziel: tagesziel.ziel })}
          </p>
          {serie.bestmarke > 1 && serie.status !== 'aktiv' && (
            <p className="text-xs text-fg-muted">{t('serieBestmarke', { tage: serie.bestmarke })}</p>
          )}
        </div>
      </div>

      {faellig.falsch > 0 ? (
        <Link href={`/${locale}/campus/lernen`} className="block">
          <Button volleBreite iconLinks={<span aria-hidden="true">↻</span>}>
            {t('fehlerWiederholen', { anzahl: faellig.falsch })}
          </Button>
        </Link>
      ) : faellig.gesamt > 0 ? (
        <Link href={`/${locale}/campus/lernen`} className="block">
          <Button variante="sekundaer" volleBreite>
            {t('faelligGesamt', { anzahl: faellig.gesamt })}
          </Button>
        </Link>
      ) : (
        <p className="text-sm text-fg-muted">{t('nichtsFaellig')}</p>
      )}
    </Card>
  );
}
