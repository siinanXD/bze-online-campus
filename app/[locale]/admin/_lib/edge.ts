/**
 * Ruft eine Supabase Edge Function unter dem Nutzerkontext des angemeldeten
 * Admins/Verwaltungs-Mitglieds auf (Bearer-Token der Sitzung), niemals mit
 * dem Service-Role-Key — der bleibt ausschließlich in der Function selbst.
 *
 * Endpunkte (Stand dieses Pakets):
 *  - `/functions/v1/nutzer-anlegen`            — bereitgestellt von AP-03 (Annahme, siehe README)
 *  - `/functions/v1/admin-passwort-ruecksetzen` — Teil dieses Pakets (AP-07)
 */
export async function rufeEdgeFunctionAuf<TAntwort>(
  pfad: string,
  accessToken: string,
  body: unknown,
): Promise<{ ok: true; daten: TAntwort } | { ok: false; status: number; fehler: string }> {
  const basis = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!basis || !anonKey) {
    return { ok: false, status: 500, fehler: 'edge_konfiguration_fehlt' };
  }

  try {
    const antwort = await fetch(`${basis}/functions/v1/${pfad}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const rohtext = await antwort.text();
    let json: unknown = null;
    try {
      json = rohtext ? JSON.parse(rohtext) : null;
    } catch {
      // Antwort war kein JSON — unten als Fehler behandelt
    }

    if (!antwort.ok) {
      const fehlertext =
        json && typeof json === 'object' && 'fehler' in json
          ? String((json as { fehler: unknown }).fehler)
          : `edge_status_${antwort.status}`;
      return { ok: false, status: antwort.status, fehler: fehlertext };
    }

    return { ok: true, daten: json as TAntwort };
  } catch {
    return { ok: false, status: 0, fehler: 'edge_nicht_erreichbar' };
  }
}
