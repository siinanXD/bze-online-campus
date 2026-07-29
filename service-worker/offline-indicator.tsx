'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';

/*
 * Präsentationskomponenten der Offline-Schicht (AP-15, Spec §9).
 *
 * Bewusst mit Inline-Styles auf Basis der Design-Tokens (globals.css), damit die
 * Komponenten unabhängig vom Tailwind-Content-Scan innerhalb von service-worker/
 * liegen können. Jeder Status trägt Farbe UND Symbol UND Textlabel
 * (Nicht-verhandelbar: Farbe nie alleiniger Informationsträger).
 */

const leiste: React.CSSProperties = {
  position: 'fixed',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'min(100%, 32rem)',
  padding: '0 0.75rem',
  zIndex: 60,
  boxSizing: 'border-box',
};

const karte: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  padding: '0.6rem 0.85rem',
  borderRadius: '0.9rem',
  border: '1px solid hsl(var(--border))',
  background: 'hsl(var(--surface))',
  color: 'hsl(var(--fg))',
  boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
  fontSize: '0.9rem',
  lineHeight: 1.35,
};

const symbolStil: React.CSSProperties = {
  fontSize: '1.15rem',
  lineHeight: 1,
  flex: '0 0 auto',
};

export interface OfflineIndicatorProps {
  offline: boolean;
  ausstehend?: number;
}

/** Sichtbarer Offline-Indikator mit Symbol + Text (kein reiner Farbträger). */
export function OfflineIndicator({ offline, ausstehend = 0 }: OfflineIndicatorProps) {
  const t = useTranslations('pwa');
  if (!offline) return null;
  return (
    <div style={{ ...leiste, bottom: 'calc(env(safe-area-inset-bottom, 0px) + 5rem)' }}>
      <div style={karte} role="status" aria-live="polite" aria-label={t('offline.titel')}>
        <span style={symbolStil} aria-hidden="true">⚠</span>
        <span>
          <strong>{t('offline.titel')}</strong>
          {' — '}
          {t('offline.text')}
          {ausstehend > 0 ? ' ' + t('sync.ausstehend', { anzahl: ausstehend }) : ''}
        </span>
      </div>
    </div>
  );
}

export interface UpdatePromptProps {
  sichtbar: boolean;
  onAktualisieren: () => void;
  onSpaeter: () => void;
}

/** Hinweis auf eine neue Version mit Aktion zum Aktualisieren. */
export function UpdatePrompt({ sichtbar, onAktualisieren, onSpaeter }: UpdatePromptProps) {
  const t = useTranslations('pwa');
  if (!sichtbar) return null;
  return (
    <div style={{ ...leiste, bottom: 'calc(env(safe-area-inset-bottom, 0px) + 8.5rem)' }}>
      <div style={{ ...karte, flexWrap: 'wrap' }} role="alert">
        <span style={symbolStil} aria-hidden="true">↻</span>
        <span style={{ flex: '1 1 8rem' }}>
          <strong>{t('update.titel')}</strong>
          {' — '}
          {t('update.text')}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', flex: '0 0 auto' }}>
          <button
            type="button"
            onClick={onSpaeter}
            style={{
              minHeight: '48px',
              padding: '0.5rem 0.9rem',
              borderRadius: '0.75rem',
              border: '1px solid hsl(var(--border))',
              background: 'transparent',
              color: 'hsl(var(--fg))',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {t('update.spaeter')}
          </button>
          <button
            type="button"
            onClick={onAktualisieren}
            style={{
              minHeight: '48px',
              padding: '0.5rem 0.9rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: 'hsl(var(--accent))',
              color: 'hsl(var(--accent-fg))',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {t('update.aktion')}
          </button>
        </div>
      </div>
    </div>
  );
}
