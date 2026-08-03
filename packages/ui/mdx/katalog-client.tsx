'use client';

/**
 * Client-Bridge fuer alle Fachkunde-Interaktiv-Bausteine im MDX-Renderer.
 * Hält den RSC-Pfad frei vom riesigen Server-Schema-Katalog (`fachkunde.tsx`),
 * liefert Trainer aber als echte Client-Boundaries statt Platzhalter.
 */
export * from '../src/fachkunde-interaktiv';
