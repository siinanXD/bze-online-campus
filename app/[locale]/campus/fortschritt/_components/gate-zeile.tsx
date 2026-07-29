import { getTranslations } from 'next-intl/server';
import { Card, ProgressRing } from '@bze/ui';
import type { Gate } from '@bze/core/fortschritt';

const SYMBOL: Record<Gate['status'], string> = {
  offen: '○',
  erreicht: '✓',
  empfohlen: '★',
  bestaetigt: '✓',
};

export async function GateZeile({ gate }: { gate: Gate }) {
  const t = await getTranslations('fortschritt');
  const pct = Math.round(gate.anteil * 100);
  return (
    <Card className="flex items-center gap-3">
      <ProgressRing value={pct} size={44} label={`${pct} %`} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{gate.bezeichnung}</p>
        <p className="flex items-center gap-1.5 text-sm text-fg-muted" role="status">
          <span aria-hidden="true">{SYMBOL[gate.status]}</span>
          <span>{t(`gateStatus.${gate.status}`)}</span>
          <span aria-hidden="true">·</span>
          <span>{t('prozentKurz', { wert: pct })}</span>
        </p>
        {gate.hinweis === 'lesezeit' && (
          <p className="mt-1 text-xs text-fg-muted">{t('lesezeitHinweis')}</p>
        )}
      </div>
    </Card>
  );
}
