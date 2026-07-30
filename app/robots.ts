import type { MetadataRoute } from 'next';

/**
 * Testumgebungen sollen nicht in Suchmaschinen landen: mit
 * `NEXT_PUBLIC_ROBOTS=noindex` wird alles gesperrt. Ohne die Variable gilt die
 * Produktionsregel — oeffentliche Seiten sind indexierbar, der angemeldete
 * Bereich nie.
 *
 * Der Wert wird beim Build gelesen, nicht zur Laufzeit: eine Aenderung wirkt
 * erst nach erneutem Deploy.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_ROBOTS === 'noindex') {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/*/campus/',
          '/*/ausbilder/',
          '/*/admin/',
          '/*/login',
          '/*/passwort-aendern',
          '/*/sprachwahl',
          '/*/showcase',
        ],
      },
    ],
  };
}
