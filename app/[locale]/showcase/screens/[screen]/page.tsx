import { notFound } from 'next/navigation';
import { SCREENS } from '../_lib/registry';

export default async function ScreenVorschau({
  params,
}: {
  params: Promise<{ screen: string }>;
}) {
  const { screen } = await params;
  const eintrag = SCREENS.find((s) => s.slug === screen);
  if (!eintrag) notFound();

  const Komponente = eintrag.komponente;
  return <Komponente />;
}
