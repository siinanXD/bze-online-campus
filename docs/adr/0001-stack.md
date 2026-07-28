# 0001 — Stack: Next.js 15 + Supabase

**Kontext:** Lern-/Prüfungs-PWA für Bildungsträger, mobile-first, offline, mehrsprachig, mandantenfähig, mit KI-Bewertung. Zielgruppe auf älteren Android-Geräten in Werkhallen.

**Entscheidung:** Next.js 15 (App Router, RSC) + TypeScript strict, Supabase (Postgres, RLS, Auth, Storage, Edge Functions, pg_cron), next-intl, Serwist (PWA), Zod. Hosting Vercel EU + Supabase eu-central-1. Verbindlich laut Spec §1.

**Konsequenzen:** RLS ist die primäre Sicherheitsschicht (nicht Anwendungscode). Secrets nur in Edge Functions. Mandantentrennung über `traeger_id` auf jeder Nutzerdatentabelle.

**Alternativen:** Firebase (verworfen: RLS/Postgres-Anforderung, EU-Hosting, pgvector), reines Custom-Backend (verworfen: Aufwand).
