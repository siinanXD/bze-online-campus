'use client';

import * as React from 'react';
import { BottomNav } from '@/components/shell';

/**
 * Campus-Rahmen: gesamter Teilnehmer-Campus im hellen Figma-Mobile-Skin
 * (Token-Reset + kein Campus-Header). BottomNav bleibt.
 */
export function CampusRahmen({
  children,
  berichtsheftAktiv,
}: {
  children: React.ReactNode;
  fortschritt: number;
  berichtsheftAktiv: boolean;
}) {
  return (
    <div className="fachkunde-figma flex h-dvh min-h-dvh flex-col overflow-hidden bg-bg pb-20">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      <BottomNav berichtsheftAktiv={berichtsheftAktiv} />
    </div>
  );
}
