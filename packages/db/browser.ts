'use client';
import { createBrowserClient } from '@supabase/ssr';

function supabaseOrigin(url: string | undefined): string {
  if (!url) return '';
  try {
    return new URL(url).origin;
  } catch {
    return url.replace(/\/rest\/v1\/?$/i, '').replace(/\/$/, '');
  }
}

export function createBrowserSupabase() {
  return createBrowserClient(
    supabaseOrigin(process.env.NEXT_PUBLIC_SUPABASE_URL),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
