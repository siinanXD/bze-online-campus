'use client';

import * as React from 'react';
import { cn } from '../cn';
import { Button } from '../primitive/button';

export interface ModalProps {
  offen: boolean;
  onSchliessen: () => void;
  titel: React.ReactNode;
  beschreibung?: React.ReactNode;
  /** Verhindert Schliessen per Overlay-Klick, z. B. bei ungespeicherten Daten. */
  nurUeberButton?: boolean;
  fuss?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Fokusfalle, Escape schliesst, der Fokus kehrt zum Ausloeser zurueck.
 * Unter sm laeuft das Modal als Bottom-Sheet ueber die volle Breite.
 */
export function Modal({
  offen,
  onSchliessen,
  titel,
  beschreibung,
  nurUeberButton = false,
  fuss,
  children,
  className,
}: ModalProps) {
  const titelId = React.useId();
  const beschreibungId = React.useId();
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const ausloeserRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!offen) return;

    ausloeserRef.current = document.activeElement as HTMLElement | null;

    const fokussierbare = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    fokussierbare()[0]?.focus();

    const beiTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onSchliessen();
        return;
      }
      if (e.key !== 'Tab') return;

      const el = fokussierbare();
      const erster = el[0];
      const letzter = el[el.length - 1];
      if (!erster || !letzter) return;

      if (e.shiftKey && document.activeElement === erster) {
        e.preventDefault();
        letzter.focus();
      } else if (!e.shiftKey && document.activeElement === letzter) {
        e.preventDefault();
        erster.focus();
      }
    };

    document.addEventListener('keydown', beiTaste);
    const vorherigesOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', beiTaste);
      document.body.style.overflow = vorherigesOverflow;
      ausloeserRef.current?.focus();
    };
  }, [offen, onSchliessen]);

  if (!offen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={nurUeberButton ? undefined : onSchliessen}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titelId}
        aria-describedby={beschreibung ? beschreibungId : undefined}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'max-h-[90vh] w-full overflow-y-auto bg-surface shadow-lg',
          'rounded-t-xl sm:max-w-lg sm:rounded-xl',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div className="space-y-1">
            <h2 id={titelId} className="text-h3">
              {titel}
            </h2>
            {beschreibung && (
              <p id={beschreibungId} className="text-body-sm text-fg-muted">
                {beschreibung}
              </p>
            )}
          </div>
          <Button
            variante="leise"
            groesse="sm"
            aria-label="Schliessen"
            onClick={onSchliessen}
            className="w-9 shrink-0 p-0"
          >
            <span aria-hidden="true">✕</span>
          </Button>
        </div>

        {children && <div className="p-5">{children}</div>}

        {fuss && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-border p-5">
            {fuss}
          </div>
        )}
      </div>
    </div>
  );
}

export interface BestaetigungsdialogProps {
  offen: boolean;
  onSchliessen: () => void;
  onBestaetigen: () => void;
  /** Als Frage formuliert. */
  titel: React.ReactNode;
  /** Ein Satz zur Konsequenz. */
  konsequenz: React.ReactNode;
  /** Benennt die Handlung, nie "OK". */
  bestaetigenLabel: string;
  abbrechenLabel?: string;
  gefahr?: boolean;
  laedt?: boolean;
}

export function Bestaetigungsdialog({
  offen,
  onSchliessen,
  onBestaetigen,
  titel,
  konsequenz,
  bestaetigenLabel,
  abbrechenLabel = 'Abbrechen',
  gefahr = false,
  laedt = false,
}: BestaetigungsdialogProps) {
  return (
    <Modal
      offen={offen}
      onSchliessen={onSchliessen}
      titel={titel}
      nurUeberButton
      fuss={
        <>
          <Button variante="sekundaer" onClick={onSchliessen}>
            {abbrechenLabel}
          </Button>
          <Button
            variante={gefahr ? 'gefahr' : 'primary'}
            onClick={onBestaetigen}
            laedt={laedt}
          >
            {bestaetigenLabel}
          </Button>
        </>
      }
    >
      <p className="text-body text-fg-muted">{konsequenz}</p>
    </Modal>
  );
}
