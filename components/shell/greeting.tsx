import * as React from 'react';
import { useTranslations } from 'next-intl';

export interface GreetingProps {
  /** Vorname oder Anzeigename. Ohne Angabe erscheint eine allgemeine Begrüßung. */
  name?: string;
  /**
   * Stunde (0–23) für die Tageszeit-Ermittlung. Standardmäßig die aktuelle
   * Serverzeit — als Prop überschreibbar (z. B. für Tests oder Storybook).
   */
  stunde?: number;
  className?: string;
}

type Tageszeit = 'morgen' | 'mittag' | 'abend';

function ermittleTageszeit(stunde: number): Tageszeit {
  if (stunde >= 4 && stunde < 11) return 'morgen';
  if (stunde >= 11 && stunde < 18) return 'mittag';
  return 'abend';
}

/**
 * Begrüßung nach Tageszeit (SPEC §6.1 / §6.2.3): „Guten Morgen/Tag/Abend, {name}".
 * Alle Texte über next-intl, kein fest verdrahtetes Wort.
 */
export function Greeting({ name, stunde, className }: GreetingProps) {
  const t = useTranslations('shell.begruessung');
  const zeit = ermittleTageszeit(stunde ?? new Date().getHours());
  const text = name ? t(`${zeit}MitName`, { name }) : t(`${zeit}Allgemein`);

  return (
    <p className={className ?? 'text-[22px] font-extrabold leading-7 text-fg'}>
      {text}
    </p>
  );
}
