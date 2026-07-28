import type { ReactNode } from 'react';

/**
 * Gemeinsames Layout für Login, erzwungenen Passwortwechsel und Sprachwahl/Kohortenbeitritt.
 * Mobile-first (funktioniert ab 360px), eine Spalte, Primärinhalt zentriert.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 p-4">{children}</main>;
}
