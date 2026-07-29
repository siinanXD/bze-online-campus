import '../globals.css';
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ServiceWorkerManager } from '@/service-worker/service-worker-manager';

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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4039d1' },
    { media: '(prefers-color-scheme: dark)', color: '#10131c' },
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
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  return (
    <html lang={locale} dir={dir}>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
          <ServiceWorkerManager />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
