import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge muss unsere eigenen Skalen kennen. Sonst haelt es
 * Schriftgroessen wie `text-body` faelschlich fuer Textfarben und entfernt
 * die tatsaechliche Farbklasse aus derselben Gruppe — im Ergebnis stand auf
 * dem Primaerbutton dunkler statt heller Text (Kontrast 3.48:1 statt 5.14:1).
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'caption',
            'overline',
            'body-sm',
            'label',
            'body',
            'body-lg',
            'h4',
            'h3',
            'h2',
            'h1',
            'display',
          ],
        },
      ],
    },
  },
});

export function cn(...parts: ClassValue[]): string {
  return twMerge(clsx(parts));
}

/** Waehlt eine Variante aus einer Map und faellt auf den Standard zurueck. */
export function variante<T extends string>(
  map: Record<T, string>,
  key: T | undefined,
  standard: T,
): string {
  return map[key ?? standard];
}
