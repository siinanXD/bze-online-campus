import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fuehrt Klassen zusammen und laesst spaetere Tailwind-Klassen gewinnen.
 * Ohne twMerge wuerde ein durchgereichtes className die Basisklasse nicht
 * ueberschreiben, sondern nur danebenstehen.
 */
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
