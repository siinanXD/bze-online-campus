import '../globals.css';
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { ServiceWorkerManager } from '@/service-worker/service-worker-manager';
import { darstellungSkript } from '@/components/shell/darstellung';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  applicationName: 'BZE Online Campus',
  title: 'BZE Online Campus',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BZE Campus',
  },
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  // Entspricht --surface hell bzw. dunkel aus app/globals.css
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#1C1917' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function LocaleLayout({
  children, params,
}: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = await getTranslations('shell.sprung');
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        {/* Setzt die Darstellung, bevor der Body gemalt wird — sonst blitzt
            beim Laden kurz die falsche Variante auf. */}
        <script dangerouslySetInnerHTML={{ __html: darstellungSkript }} />
      </head>
      <body className="min-h-screen">
        <a
          href="#inhalt"
          className="skip-link rounded-md bg-primary px-4 py-2 text-label text-fg-onPrimary"
        >
          {t('label')}
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <ServiceWorkerManager />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
