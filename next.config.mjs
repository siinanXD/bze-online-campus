import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./i18n.ts');
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Nur im Container-Build (Railway, Fly, eigener Server): schlanke Ausgabe mit
  // ausschliesslich den tatsaechlich benoetigten Abhaengigkeiten. Auf Netlify
  // und Vercel muss die Voreinstellung bleiben, dort uebernimmt die Plattform
  // das Bundling.
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,
};
export default withNextIntl(nextConfig);
