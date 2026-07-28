import { useTranslations } from 'next-intl';
import { Card } from '@bze/ui';
import type { FachkundeQuelle } from '../../../../../packages/ui/mdx';

/**
 * Quellenangaben am Ende der Lerneinheit (SPEC §6.2.6). Faktenbelegpflicht: jede Quelle trägt
 * mindestens einen Titel und eine Seitenangabe — notfalls ein Platzhalter wie
 * "S. [vom Ausbilder]" statt einer geratenen Zahl (AGENTS.md §2).
 */
export function Quellenliste({ quellen }: { quellen: FachkundeQuelle[] }) {
  const t = useTranslations('topic');
  if (quellen.length === 0) return null;
  return (
    <Card className="mt-6">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-accent">
        {t('lerneinheit.quellenTitel')}
      </h2>
      <ul className="space-y-2 text-sm text-muted">
        {quellen.map((quelle, i) => (
          <li key={`${quelle.titel}-${i}`}>
            <span className="font-semibold text-fg">{quelle.titel}</span>
            {quelle.verlag ? `, ${quelle.verlag}` : ''}
            {quelle.auflage ? `, ${quelle.auflage}` : ''}
            {`, ${quelle.seite}`}
            {quelle.tabelle ? `, ${quelle.tabelle}` : ''}
          </li>
        ))}
      </ul>
    </Card>
  );
}
