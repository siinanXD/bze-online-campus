'use client';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@bze/ui';
import { createBrowserSupabase } from '@bze/db';

export function LogoutButton() {
  const t = useTranslations('campus');
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  async function abmelden() {
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    router.push(`/${locale}/login`);
    router.refresh();
  }
  return <Button variante="sekundaer" onClick={abmelden}>{t('abmelden')}</Button>;
}
