import { getTranslations } from 'next-intl/server';

export async function RisikoBadge({
  aktivitaet,
  pruefungen,
}: {
  aktivitaet: boolean;
  pruefungen: boolean;
}) {
  const t = await getTranslations('ausbilder.risiko');
  if (!aktivitaet && !pruefungen) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-status-fertig px-2.5 py-1 text-xs font-semibold text-status-fertig" role="status">
        <span aria-hidden="true">✓</span>
        <span>{t('ok')}</span>
      </span>
    );
  }
  const labels: string[] = [];
  if (aktivitaet) labels.push(t('aktivitaet'));
  if (pruefungen) labels.push(t('pruefungen'));
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-status-falsch px-2.5 py-1 text-xs font-semibold text-status-falsch" role="status">
      <span aria-hidden="true">!</span>
      <span>{labels.join(' · ')}</span>
    </span>
  );
}
