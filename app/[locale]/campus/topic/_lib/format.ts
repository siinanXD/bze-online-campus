/**
 * Zeitangaben je Ebene, z. B. "Lerneinheit · 32 Min" (SPEC §7). Gibt Minuten und ggf. Stunden
 * getrennt zurück, damit next-intl die Übersetzung übernimmt (keine fest verdrahtete Zeichenkette
 * — CONTRIBUTING.md §7).
 */
export function teileMinuten(minutenGesamt: number): { stunden: number; minuten: number } {
  const sicher = Math.max(0, Math.round(minutenGesamt));
  return { stunden: Math.floor(sicher / 60), minuten: sicher % 60 };
}

export function anteilProzent(erledigt: number, gesamt: number): number {
  if (gesamt <= 0) return 0;
  return Math.round((Math.min(erledigt, gesamt) / gesamt) * 100);
}
