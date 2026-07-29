'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@bze/ui';

/**
 * Diktatfähiges Textfeld (Spec §6.2.14: „Eintragsformular mit Diktat").
 * Nutzt die Web Speech API sofern verfügbar; sonst bleibt das Textfeld nutzbar
 * und der Mikrofonknopf wird ausgeblendet. Das Diktat ergänzt nur die Eingabe
 * des Nutzers — es wird nichts erfunden.
 */
export function DiktatFeld({
  label,
  hilfe,
  value,
  onChange,
  locale,
}: {
  label: string;
  hilfe?: string;
  value: string;
  onChange: (wert: string) => void;
  locale: string;
}) {
  const t = useTranslations('berichtsheft');
  const [verfuegbar, setVerfuegbar] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const recognitionRef = useRef<any>(null);
  const wertRef = useRef(value);
  wertRef.current = value;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setVerfuegbar(Boolean(SR));
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        /* egal */
      }
    };
  }, []);

  function toggleDiktat() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    if (laeuft) {
      recognitionRef.current?.stop();
      setLaeuft(false);
      return;
    }
    const erkennung = new SR();
    erkennung.lang = locale === 'de' ? 'de-DE' : locale;
    erkennung.interimResults = false;
    erkennung.continuous = true;
    erkennung.onresult = (event: any) => {
      let neu = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        neu += event.results[i][0].transcript;
      }
      const basis = wertRef.current.trim();
      onChange(basis ? `${basis} ${neu.trim()}` : neu.trim());
    };
    erkennung.onerror = () => setLaeuft(false);
    erkennung.onend = () => setLaeuft(false);
    recognitionRef.current = erkennung;
    erkennung.start();
    setLaeuft(true);
  }

  return (
    <label className="block text-sm">
      <span className="mb-1 flex items-center justify-between gap-2">
        <span className="font-medium">{label}</span>
        {verfuegbar && (
          <button
            type="button"
            onClick={toggleDiktat}
            aria-pressed={laeuft}
            aria-label={laeuft ? t('form.diktatStop') : t('form.diktatStart')}
            className={cn(
              'touchable inline-flex min-h-12 min-w-12 items-center justify-center rounded-full border text-lg',
              laeuft
                ? 'animate-pulse border-status-falsch text-status-falsch'
                : 'border-border text-fg hover:bg-surface',
            )}
          >
            <span aria-hidden="true">{laeuft ? '■' : '🎤'}</span>
          </button>
        )}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm leading-relaxed"
        maxLength={4000}
      />
      {hilfe && <span className="mt-1 block text-xs text-fg-muted">{hilfe}</span>}
      {laeuft && (
        <span className="mt-1 block text-xs text-status-falsch" role="status">
          {t('form.diktatLaeuft')}
        </span>
      )}
    </label>
  );
}
