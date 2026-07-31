'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@bze/db';
import { AbmeldenIcon, KontrastIcon, MehrIcon, ProfilIcon } from './icons';
import { anwenden, SPEICHER_SCHLUESSEL, type Darstellung } from './darstellung';

export interface HeaderMenuProps {
  profilHref: string;
}

/**
 * Stellt die schnellen Konto- und Anzeigeaktionen direkt im App-Header bereit.
 */
export function HeaderMenu({ profilHref }: HeaderMenuProps) {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const [offen, setOffen] = React.useState(false);
  const [darstellung, setDarstellung] = React.useState<Darstellung>('system');
  const [fehlerText, setFehlerText] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const gespeichert = liesDarstellung();
    document.documentElement.classList.remove('contrast');
    window.localStorage.removeItem('bze-kontrastmodus');
    anwenden(gespeichert);
    setDarstellung(gespeichert);
  }, []);

  React.useEffect(() => {
    /**
     * Schliesst das Dropdown, wenn ausserhalb geklickt wird.
     */
    function schliesseBeiAussenklick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOffen(false);
      }
    }

    /**
     * Schliesst das Dropdown per Escape-Taste.
     */
    function schliesseBeiEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOffen(false);
    }

    document.addEventListener('mousedown', schliesseBeiAussenklick);
    document.addEventListener('keydown', schliesseBeiEscape);
    return () => {
      document.removeEventListener('mousedown', schliesseBeiAussenklick);
      document.removeEventListener('keydown', schliesseBeiEscape);
    };
  }, []);

  /**
   * Setzt den vorhandenen Hell-/Dunkelmodus der App.
   */
  function waehleDarstellung(wahl: Darstellung) {
    window.localStorage.setItem(SPEICHER_SCHLUESSEL, wahl);
    document.documentElement.classList.remove('contrast');
    anwenden(wahl);
    setDarstellung(wahl);
  }

  /**
   * Meldet die aktuelle Sitzung ab und fuehrt zur Login-Seite zurueck.
   */
  async function abmelden() {
    const supabase = createBrowserSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) {
      setFehlerText('Abmelden ist gerade nicht moeglich.');
      return;
    }

    setOffen(false);
    router.push(`/${locale}/login`);
    router.refresh();
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label="Menue oeffnen"
        aria-haspopup="menu"
        aria-expanded={offen}
        onClick={() => setOffen((wert) => !wert)}
        className="touchable inline-flex items-center justify-center rounded-full border border-border bg-surface text-fg transition hover:border-primary hover:text-primary"
      >
        <MehrIcon />
      </button>

      {offen && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 overflow-hidden rounded-lg border border-border bg-surface-raised shadow-lg"
        >
          <Link
            href={profilHref}
            role="menuitem"
            onClick={() => setOffen(false)}
            className="flex min-h-12 items-center gap-3 border-b border-border px-3 py-2 text-sm font-semibold text-fg hover:bg-bg-subtle"
          >
            <ProfilIcon className="h-5 w-5" />
            Profil
          </Link>
          <div className="flex min-h-12 w-full items-center gap-3 px-3 py-2 text-sm font-semibold text-fg">
            <KontrastIcon className="h-5 w-5" />
            Darstellung
          </div>
          <div className="grid grid-cols-3 gap-1 border-b border-border px-2 pb-2">
            {(['system', 'hell', 'dunkel'] as Darstellung[]).map((wahl) => (
              <button
                key={wahl}
                type="button"
                onClick={() => waehleDarstellung(wahl)}
                aria-pressed={darstellung === wahl}
                className={`min-h-10 rounded-md px-2 text-xs font-bold transition ${
                  darstellung === wahl
                    ? 'bg-primary text-fg-onPrimary'
                    : 'bg-bg-subtle text-fg-muted hover:text-fg'
                }`}
              >
                {DARSTELLUNG_LABELS[wahl]}
              </button>
            ))}
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={abmelden}
            className="flex min-h-12 w-full items-center gap-3 px-3 py-2 text-left text-sm font-semibold text-danger hover:bg-danger-bg"
          >
            <AbmeldenIcon className="h-5 w-5" />
            Abmelden
          </button>
          {fehlerText && (
            <p role="alert" className="border-t border-danger-border bg-danger-bg px-3 py-2 text-xs font-semibold text-danger">
              {fehlerText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const DARSTELLUNG_LABELS: Record<Darstellung, string> = {
  system: 'System',
  hell: 'Hell',
  dunkel: 'Dunkel',
};

/**
 * Liest die gespeicherte Darstellung und validiert unbekannte Werte.
 */
function liesDarstellung(): Darstellung {
  const wert = window.localStorage.getItem(SPEICHER_SCHLUESSEL);
  if (wert === 'hell' || wert === 'dunkel' || wert === 'system') return wert;
  return 'system';
}
