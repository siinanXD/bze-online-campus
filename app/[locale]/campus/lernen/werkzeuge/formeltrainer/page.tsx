import { FormelUmstellenTrainer, Formelkarte } from '@bze/ui';
import { WerkzeugKopf } from '../_components/werkzeug-kopf';

/**
 * Figma 04.11 / 04.19 Formeltrainer — Formelkarte + interaktives Umstellen.
 */
export default async function FormeltrainerSeite({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-4 px-5 pb-6 pt-3">
      <WerkzeugKopf
        locale={locale}
        titel="Formeltrainer"
        untertitel="Formeln lesen, umstellen und mit Einheiten absichern — ohne geratene Zahlenwerte."
      />
      <Formelkarte
        name="Schnittgeschwindigkeit"
        formel="vc = π × d × n"
        einheiten="vc in m/min, d in mm, n in 1/min"
        verwendung="Schnittgeschwindigkeit aus Drehzahl und Durchmesser ableiten."
        beispiel="Lehrzusammenhang — konkrete Werte aus Tabellenbuch oder Vorgabe."
        typischerFehler="Einheiten nicht umrechnen (mm ↔ m, 1/min)."
        tabellenbuchHinweis="Schnittgeschwindigkeits-Tabellen für Werkstoff und Verfahren."
      />
      <FormelUmstellenTrainer titel="Formel umstellen üben" />
    </main>
  );
}
