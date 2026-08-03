import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card, ProgressRing } from '@bze/ui';
import type { Gate } from '@bze/core/fortschritt';

const SYMBOL: Record<Gate['status'], string> = {
  offen: '○',
  erreicht: '✓',
  empfohlen: '★',
  bestaetigt: '✓',
};

export async function GateZeile({
  gate,
  href,
}: {
  gate: Gate;
  /** Themen sind klickbar und führen zum Üben. */
  href?: string;
}) {
  const t = await getTranslations('fortschritt');
  const pct = Math.round(gate.anteil * 100);
  const stand =
    gate.gesamt != null && gate.fertig != null
      ? t('fragenStand', { fertig: gate.fertig, gesamt: gate.gesamt })
      : null;

  const inhalt = (
    <Card
      className={
        href
          ? 'flex items-center gap-3 rounded-[16px] transition-colors hover:border-primary-border hover:bg-primary-subtle/40'
          : 'flex items-center gap-3 rounded-[16px]'
      }
    >
      <ProgressRing value={pct} size={44} label={`${pct} %`} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{gate.bezeichnung}</p>
        <p className="flex flex-wrap items-center gap-1.5 text-sm text-fg-muted" role="status">
          <span aria-hidden="true">{SYMBOL[gate.status]}</span>
          <span>{t(`gateStatus.${gate.status}`)}</span>
          <span aria-hidden="true">·</span>
          <span>{t('prozentKurz', { wert: pct })}</span>
          {stand && (
            <>
              <span aria-hidden="true">·</span>
              <span>{stand}</span>
            </>
          )}
        </p>
        {gate.hinweis === 'lesezeit' && (
          <p className="mt-1 text-xs text-fg-muted">{t('lesezeitHinweis')}</p>
        )}
        {href && <p className="mt-1 text-xs font-semibold text-primary">{t('themaOeffnen')}</p>}
      </div>
    </Card>
  );

  if (!href) return inhalt;

  return (
    <Link href={href} className="block focus-visible:outline-none">
      {inhalt}
    </Link>
  );
}
