'use client';

import * as React from 'react';
import { ladeInhalteVor } from '@/service-worker/offline-client';

export interface InhalteVorladenProps {
  urls: string[];
}

/**
 * Stoesst das gezielte Offline-Vorladen der aktuellen Fachkunde-Inhalte an.
 */
export function InhalteVorladen({ urls }: InhalteVorladenProps) {
  React.useEffect(() => {
    const eindeutigeUrls = Array.from(new Set(urls.filter((url) => url.startsWith('/'))));
    if (eindeutigeUrls.length === 0) return;
    ladeInhalteVor(eindeutigeUrls).catch(() => undefined);
  }, [urls]);

  return null;
}
