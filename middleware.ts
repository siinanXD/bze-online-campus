import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';
import type { Rolle } from '@bze/db';

type CookieZumSetzen = { name: string; value: string; options: CookieOptions };

/**
 * AP-03 — Auth-Guard + next-intl Locale-Routing in einer Middleware.
 *
 * 1) next-intl übernimmt Erkennung/Umleitung der Sprache (de, en, fr, ar, uk, tr; Default de).
 * 2) Danach wird die Supabase-Session aus den Cookies gelesen (SSR-Client, Token-Refresh
 *    landet automatisch in der Response). Unangemeldete Nutzer werden auf /[locale]/login
 *    umgeleitet — einzige öffentlich erreichbare Auth-Seite.
 * 3) Angemeldete Nutzer mit `muss_passwort_aendern` werden vor jeder anderen Seite auf
 *    /[locale]/passwort-aendern gezwungen (Spec §6.2.1). Danach greift die Rollenweiche:
 *    teilnehmer → /campus, ausbilder → /ausbilder, verwaltung/admin → /admin.
 *
 * Sprachwahl und Kohortenbeitritt (/[locale]/sprachwahl) sind KEIN erzwungener Schritt in
 * dieser Middleware — sie werden nach dem Login clientseitig als nächster sinnvoller Schritt
 * vorgeschlagen (siehe login-form.tsx), aber niemals blockierend erzwungen, damit ein Nutzer
 * ohne Kohortenzuordnung nicht dauerhaft ausgesperrt wird.
 */

const bearbeiteLocale = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

/** Pfade UNTERHALB des Locale-Präfixes, die ohne Anmeldung erreichbar sein müssen. */
const OEFFENTLICHE_PFADE = new Set<string>(['/login']);

const ROLLEN_STARTSEITE: Record<Rolle, string> = {
  teilnehmer: 'campus',
  ausbilder: 'ausbilder',
  verwaltung: 'admin',
  admin: 'admin',
};

export async function middleware(request: NextRequest) {
  // Schritt 1: next-intl Locale-Routing
  let response = bearbeiteLocale(request);

  // War das ein Redirect (Locale-Präfix fehlte in der URL)? Dann sofort zurück —
  // die Auth-Prüfung läuft beim nächsten Durchlauf mit vollständiger URL erneut.
  if (response.headers.get('location')) {
    return response;
  }

  // Schritt 2: Supabase-Session lesen (Cookies zwischen Request/Response spiegeln)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: CookieZumSetzen[]) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const segmente = request.nextUrl.pathname.split('/').filter(Boolean);
  const locale = (locales as readonly string[]).includes(segmente[0] ?? '') ? segmente[0]! : defaultLocale;
  const pfadOhneLocale = '/' + segmente.slice(1).join('/');

  // Schritt 3: unangemeldete Nutzer → Login
  if (!user) {
    if (OEFFENTLICHE_PFADE.has(pfadOhneLocale)) {
      return response;
    }
    const ziel = request.nextUrl.clone();
    ziel.pathname = `/${locale}/login`;
    return NextResponse.redirect(ziel);
  }

  // Schritt 4: angemeldet — Profil für Rollenweiche/Passwortzwang laden.
  // Fehler beim Lesen (z. B. kurzzeitiger Netzwerkfehler) sperrt keine gültige Session aus.
  const { data: profil } = await supabase
    .from('profiles')
    .select('rolle, muss_passwort_aendern')
    .eq('id', user.id)
    .maybeSingle();

  const rolle = (profil?.rolle as Rolle | undefined) ?? 'teilnehmer';
  const mussPasswortAendern = profil?.muss_passwort_aendern ?? false;
  const startseite = `/${locale}/${ROLLEN_STARTSEITE[rolle]}`;

  // Bereits angemeldete Nutzer nicht erneut die Login-Seite zeigen
  if (pfadOhneLocale === '/login') {
    const ziel = request.nextUrl.clone();
    ziel.pathname = mussPasswortAendern ? `/${locale}/passwort-aendern` : startseite;
    return NextResponse.redirect(ziel);
  }

  // Erzwungener Passwortwechsel vor jeder anderen Seite
  if (mussPasswortAendern && pfadOhneLocale !== '/passwort-aendern') {
    const ziel = request.nextUrl.clone();
    ziel.pathname = `/${locale}/passwort-aendern`;
    return NextResponse.redirect(ziel);
  }

  return response;
}

export const config = {
  // Next-Interna, statische Dateien und Icons aussparen
  matcher: ['/((?!_next|.*\\..*).*)'],
};
