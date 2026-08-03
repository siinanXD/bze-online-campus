import Link from 'next/link';
import { Fehlerdiagnose5MTrainer } from '@bze/ui';
import { WerkzeugKopf } from '../_components/werkzeug-kopf';

/**
 * Figma 04.12 Fehlerdiagnose — 5M-Trainer als Einstieg.
 */
export default async function FehlerdiagnoseSeite({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-4 px-5 pb-6 pt-3">
      <WerkzeugKopf
        locale={locale}
        titel="Fehlerdiagnose"
        untertitel="Ursachen systematisch mit 5M ordnen, bevor Prozesswerte geändert werden."
      />
      <Fehlerdiagnose5MTrainer titel="Fehlerdiagnose mit 5M" />
      <Link
        href={`/${locale}/campus/topic/PT-FEK/lerneinheit/pt-fek-14-fehlerdiagnose-mit-5m`}
        className="touchable rounded-[14px] border border-border bg-surface px-4 py-3 text-[14px] font-semibold text-primary"
      >
        Zur Lerneinheit „Fehlerdiagnose mit 5M“ →
      </Link>
    </main>
  );
}
