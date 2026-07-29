import { createServerSupabase } from '@bze/db/server';
import type {
  NachweisArt,
  NachweisInhalt,
  NachweisStatus,
} from '@bze/core/nachweis';

export interface AusbilderNachweisZeile {
  id: string;
  userId: string;
  teilnehmerName: string;
  benutzername: string;
  art: NachweisArt;
  zeitraumVon: string | null;
  zeitraumBis: string | null;
  ausbildungsjahr: number | null;
  status: NachweisStatus;
  kiFormuliert: boolean;
  updatedAt: string;
}

export interface AusbilderNachweisVoll extends AusbilderNachweisZeile {
  inhalt: NachweisInhalt;
  rahmenplanPositionen: string[];
}

function name(p: { vorname?: string | null; nachname?: string | null; benutzername?: string | null } | null): string {
  if (!p) return '—';
  const voll = [p.vorname, p.nachname].filter(Boolean).join(' ');
  return voll || p.benutzername || '—';
}

function alsInhalt(roh: unknown): NachweisInhalt {
  if (roh && typeof roh === 'object') {
    const o = roh as Record<string, unknown>;
    return {
      taetigkeiten: typeof o.taetigkeiten === 'string' ? o.taetigkeiten : '',
      unterweisungen: typeof o.unterweisungen === 'string' ? o.unterweisungen : '',
      berufsschulthemen: typeof o.berufsschulthemen === 'string' ? o.berufsschulthemen : '',
    };
  }
  return { taetigkeiten: '', unterweisungen: '', berufsschulthemen: '' };
}

function einProfil(p: any): { vorname?: string | null; nachname?: string | null; benutzername?: string | null } | null {
  return Array.isArray(p) ? (p[0] ?? null) : (p ?? null);
}

/**
 * Nachweise der betreuten Teilnehmer (RLS: `app_betreut`). Eigene Nachweise des
 * Ausbilders werden ausgeblendet — hier zählt die Prüfung fremder Blätter.
 */
export async function ladeAusbilderNachweise(): Promise<AusbilderNachweisZeile[]> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('nachweise')
    .select(
      'id, user_id, art, zeitraum_von, zeitraum_bis, ausbildungsjahr, status, ki_formuliert, updated_at, profiles!nachweise_user_id_fkey(vorname,nachname,benutzername)',
    )
    .order('updated_at', { ascending: false });

  return (data ?? [])
    .filter((n: any) => n.user_id !== user?.id)
    .map((n: any) => {
      const p = einProfil(n.profiles);
      return {
        id: n.id,
        userId: n.user_id,
        teilnehmerName: name(p),
        benutzername: p?.benutzername ?? '—',
        art: n.art,
        zeitraumVon: n.zeitraum_von,
        zeitraumBis: n.zeitraum_bis,
        ausbildungsjahr: n.ausbildungsjahr,
        status: n.status,
        kiFormuliert: Boolean(n.ki_formuliert),
        updatedAt: n.updated_at,
      };
    });
}

export async function ladeAusbilderNachweis(id: string): Promise<AusbilderNachweisVoll | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from('nachweise')
    .select(
      'id, user_id, art, zeitraum_von, zeitraum_bis, ausbildungsjahr, inhalt, rahmenplan_positionen, status, ki_formuliert, updated_at, profiles!nachweise_user_id_fkey(vorname,nachname,benutzername)',
    )
    .eq('id', id)
    .maybeSingle();
  if (!data) return null;
  const p = einProfil((data as any).profiles);
  return {
    id: data.id,
    userId: data.user_id,
    teilnehmerName: name(p),
    benutzername: p?.benutzername ?? '—',
    art: data.art,
    zeitraumVon: data.zeitraum_von,
    zeitraumBis: data.zeitraum_bis,
    ausbildungsjahr: data.ausbildungsjahr,
    status: data.status,
    kiFormuliert: Boolean(data.ki_formuliert),
    updatedAt: data.updated_at,
    inhalt: alsInhalt(data.inhalt),
    rahmenplanPositionen: Array.isArray(data.rahmenplan_positionen) ? data.rahmenplan_positionen : [],
  };
}

export interface KorrekturEintrag {
  id: string;
  begruendung: string;
  createdAt: string;
}

export async function ladeKorrekturen(nachweisId: string): Promise<KorrekturEintrag[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from('nachweis_korrekturen')
    .select('id, begruendung, created_at')
    .eq('nachweis_id', nachweisId)
    .order('created_at', { ascending: false });
  return (data ?? []).map((k: any) => ({ id: k.id, begruendung: k.begruendung, createdAt: k.created_at }));
}
