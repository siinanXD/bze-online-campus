'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
// Relativer Import: packages/ui/mdx ist kein eigenes pnpm-Workspace-Paket (Datei-Hoheit
// erlaubt kein Ändern von tsconfig.json, siehe _lib/content-fallback.ts).
import type { Kapitel } from '../../../../../packages/ui/mdx';
import { speichereAbschnittFortschritt, speichereBewertung } from '../_lib/actions';

type LesesitzungWert = {
  kapitel: Kapitel[];
  gelesen: ReadonlySet<number>;
  aktivIndex: number;
  bewertung: 1 | -1 | null;
  demoModus: boolean;
  setAktivIndex: (index: number) => void;
  markiereGelesen: (index: number) => void;
  sendeBewertung: (wert: 1 | -1) => void;
  /** true, wenn seit Sitzungsstart deutlich weniger Zeit vergangen ist als `lesedauer_minuten`. */
  pruefeLesezeit: () => boolean;
  navigiereWeiter: () => void;
};

const LesesitzungContext = React.createContext<LesesitzungWert | null>(null);

export function useLesesitzung(): LesesitzungWert {
  const wert = React.useContext(LesesitzungContext);
  if (!wert) {
    throw new Error('useLesesitzung() muss innerhalb von <Lesesitzung> aufgerufen werden.');
  }
  return wert;
}

export function Lesesitzung({
  lerneinheitId,
  kapitel,
  initialGelesenIndizes,
  initialBewertung,
  lesedauerMinuten,
  demoModus,
  naechsteHref,
  children,
}: {
  lerneinheitId: string;
  kapitel: Kapitel[];
  initialGelesenIndizes: number[];
  initialBewertung: 1 | -1 | null;
  lesedauerMinuten: number;
  demoModus: boolean;
  naechsteHref: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [gelesen, setGelesen] = React.useState<Set<number>>(() => new Set(initialGelesenIndizes));
  const [aktivIndex, setAktivIndexState] = React.useState(0);
  const [bewertung, setBewertung] = React.useState<1 | -1 | null>(initialBewertung);
  const startzeitRef = React.useRef<number>(Date.now());

  const setAktivIndex = React.useCallback((index: number) => setAktivIndexState(index), []);

  const markiereGelesen = React.useCallback(
    (index: number) => {
      setGelesen((bisher) => {
        if (bisher.has(index)) return bisher;
        const naechste = new Set(bisher);
        naechste.add(index);
        return naechste;
      });
      if (demoModus) return; // Beispiel-Inhalt hat keine echte lerneinheit_id — nichts zu speichern.
      const lesezeitSekunden = Math.round((Date.now() - startzeitRef.current) / 1000);
      void speichereAbschnittFortschritt({ lerneinheitId, abschnittIndex: index, lesezeitSekunden });
    },
    [demoModus, lerneinheitId],
  );

  const sendeBewertungAn = React.useCallback(
    (wert: 1 | -1) => {
      setBewertung(wert);
      if (demoModus) return;
      void speichereBewertung({ lerneinheitId, abschnittIndex: aktivIndex, bewertung: wert });
    },
    [demoModus, lerneinheitId, aktivIndex],
  );

  const pruefeLesezeit = React.useCallback(() => {
    const vergangeneMinuten = (Date.now() - startzeitRef.current) / 60000;
    // SPEC §4.2: Lesezeit-Unterschreitung erzeugt nur einen Hinweis, KEINE Sperre.
    return vergangeneMinuten < lesedauerMinuten * 0.5;
  }, [lesedauerMinuten]);

  const navigiereWeiter = React.useCallback(() => {
    router.push(naechsteHref);
  }, [naechsteHref, router]);

  const wert = React.useMemo<LesesitzungWert>(
    () => ({
      kapitel,
      gelesen,
      aktivIndex,
      bewertung,
      demoModus,
      setAktivIndex,
      markiereGelesen,
      sendeBewertung: sendeBewertungAn,
      pruefeLesezeit,
      navigiereWeiter,
    }),
    [kapitel, gelesen, aktivIndex, bewertung, demoModus, setAktivIndex, markiereGelesen, sendeBewertungAn, pruefeLesezeit, navigiereWeiter],
  );

  return <LesesitzungContext.Provider value={wert}>{children}</LesesitzungContext.Provider>;
}
