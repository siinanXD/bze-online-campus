// @ts-nocheck — Deno-Laufzeit (Supabase Edge Function), kein Teil des Next.js-TS-Projekts.
//
// AP-17 — Edge Function `sende-erinnerungen`.
//
// Sendet Web-Push-Erinnerungen an aktive Teilnehmer. Der Versender entscheidet
// NICHT, ob und was gesendet wird — das leistet vollständig die getestete
// Domain `packages/core/benachrichtigung` (`planeBenachrichtigungen`). Diese
// Function tut nur, was allein hier möglich ist:
//   1. Kandidaten laden und die Planungseingabe je Person bauen (kandidaten.ts)
//   2. die Domain fragen, was ansteht
//   3. Titel/Text in der Sprache der Person auflösen (texte.ts)
//   4. VAPID-signiert an alle Geräte der Person senden
//   5. Erfolg protokollieren, abgelaufene Endpunkte aufräumen
//
// Betriebsart: Cron (Header `x-cron-secret` == CRON_SECRET). Kein Nutzer-JWT.
// Ohne VAPID-Schlüssel oder mit LLM_MOCK-artigem PUSH_MOCK=1 wird nichts
// wirklich gesendet, aber die Planung läuft und wird zurückgegeben (Testlauf).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import webpush from 'https://esm.sh/web-push@3.6.7';

import { planeBenachrichtigungen } from '../../../packages/core/benachrichtigung/index.ts';
import {
  aboEntfernen,
  sendbareAbos,
  versandErfolgreich,
} from '../../../packages/core/benachrichtigung/index.ts';
import { alsKalendertag } from '../../../packages/core/engagement/index.ts';
import { baueEingabe } from './kandidaten.ts';
import { istRtl, loeseText, normalisiereSprache } from './texte.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const CRON_SECRET = Deno.env.get('CRON_SECRET') ?? '';
const VAPID_PUBLIC = Deno.env.get('NEXT_PUBLIC_VAPID_PUBLIC_KEY') ?? '';
const VAPID_PRIVATE = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:kontakt@bze-euskirchen.de';
const PUSH_MOCK = (Deno.env.get('PUSH_MOCK') ?? '') === '1';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const VAPID_BEREIT = Boolean(VAPID_PUBLIC && VAPID_PRIVATE) && !PUSH_MOCK;
if (VAPID_BEREIT) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
}

function jsonAntwort(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

/** Liest die Push-Einstellungen aller Personen, die Erinnerungen erlaubt haben. */
async function ladeAktiveEinstellungen(service) {
  const { data } = await service
    .from('push_einstellungen')
    .select('user_id,zeitzone,still_von,still_bis,max_pro_tag,abgewaehlt,tagesziel,aktiv')
    .eq('aktiv', true);
  return (data ?? []).map((z) => ({
    userId: z.user_id,
    aktiv: z.aktiv,
    zeitzone: z.zeitzone,
    stillVon: z.still_von,
    stillBis: z.still_bis,
    maxProTag: z.max_pro_tag,
    abgewaehlt: z.abgewaehlt ?? [],
    tagesziel: z.tagesziel,
    sprache: 'de',
  }));
}

/** Ergänzt die Einstellungen um die Sprache aus dem Profil. */
async function reichereSpracheAn(service, einstellungen) {
  const ids = einstellungen.map((e) => e.userId);
  if (ids.length === 0) return einstellungen;
  const { data } = await service.from('profiles').select('id,sprache').in('id', ids);
  const sprachen = new Map((data ?? []).map((p) => [p.id, p.sprache]));
  return einstellungen.map((e) => ({ ...e, sprache: sprachen.get(e.userId) ?? 'de' }));
}

/**
 * Sendet eine geplante Benachrichtigung an alle Geräte einer Person.
 *
 * Abgelaufene Endpunkte (404/410) und dauerhaft fehlschlagende Abos werden
 * entfernt bzw. hochgezählt — entschieden von der Domain (`aboEntfernen`).
 * Gibt zurück, ob mindestens ein Gerät erreicht wurde.
 */
async function sendeAnGeraete(service, userId: string, geplant, sprache: string): Promise<boolean> {
  const { data: aboZeilen } = await service
    .from('push_abos')
    .select('id,endpoint,p256dh,auth_secret,zuletzt_gesendet_am,fehlversuche')
    .eq('user_id', userId);

  const abos = sendbareAbos(
    (aboZeilen ?? []).map((z) => ({
      id: z.id,
      userId,
      endpoint: z.endpoint,
      zuletztGesendetAm: z.zuletzt_gesendet_am,
      fehlversuche: z.fehlversuche,
      _p256dh: z.p256dh,
      _auth: z.auth_secret,
    })),
  );

  const nutzlast = JSON.stringify({
    titel: loeseText(geplant.titelKey, normalisiereSprache(sprache), geplant.werte),
    text: loeseText(geplant.textKey, normalisiereSprache(sprache), geplant.werte),
    pfad: geplant.pfad,
    tag: geplant.tag,
    sprache,
    richtung: istRtl(sprache) ? 'rtl' : 'ltr',
  });

  let erreicht = false;
  for (const abo of abos) {
    if (!VAPID_BEREIT) {
      // Testlauf ohne Schlüssel: als erreicht werten, aber nichts senden.
      erreicht = true;
      continue;
    }
    const status = await sendeEinen(abo, nutzlast, geplant.dringlichkeit);
    if (versandErfolgreich(status)) {
      erreicht = true;
      await service
        .from('push_abos')
        .update({ zuletzt_gesendet_am: new Date().toISOString(), fehlversuche: 0 })
        .eq('id', abo.id);
    } else if (aboEntfernen(status, abo.fehlversuche)) {
      await service.from('push_abos').delete().eq('id', abo.id);
    } else {
      await service
        .from('push_abos')
        .update({ fehlversuche: abo.fehlversuche + 1 })
        .eq('id', abo.id);
    }
  }
  return erreicht;
}

/** Ein einzelner Versand; gibt den HTTP-Status des Push-Dienstes zurück. */
async function sendeEinen(abo, nutzlast: string, dringlichkeit: string): Promise<number> {
  try {
    const res = await webpush.sendNotification(
      {
        endpoint: abo.endpoint,
        keys: { p256dh: abo._p256dh, auth: abo._auth },
      },
      nutzlast,
      { urgency: dringlichkeit, TTL: 12 * 3600 },
    );
    return res.statusCode ?? 201;
  } catch (e) {
    // web-push wirft bei 4xx/5xx mit statusCode am Fehlerobjekt.
    return e?.statusCode ?? 500;
  }
}

/** Hält den Versand im Protokoll fest (für Deckel und Mindestpause). */
async function protokolliere(service, userId: string, anlass: string, tag: string) {
  await service.from('push_protokoll').insert({ user_id: userId, anlass, tag });
}

Deno.serve(async (anfrage: Request) => {
  if (anfrage.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (anfrage.method !== 'POST') return jsonAntwort({ fehler: 'methode' }, 405);

  // Nur der Cron-Aufruf ist erlaubt: der Versand geht an fremde Endpunkte und
  // darf nie durch einen einfachen Nutzeraufruf auslösbar sein.
  const secret = anfrage.headers.get('x-cron-secret') ?? '';
  if (!CRON_SECRET || secret !== CRON_SECRET) {
    return jsonAntwort({ fehler: 'nicht_berechtigt' }, 401);
  }

  const service = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const jetzt = new Date();

  const roh = await ladeAktiveEinstellungen(service);
  const einstellungen = await reichereSpracheAn(service, roh);

  let gesendet = 0;
  let geplantGesamt = 0;
  const fehler: string[] = [];

  for (const eintrag of einstellungen) {
    try {
      const eingabe = await baueEingabe(service, eintrag, jetzt);
      const geplant = planeBenachrichtigungen(eingabe, jetzt);
      geplantGesamt += geplant.length;

      for (const benachrichtigung of geplant) {
        const erreicht = await sendeAnGeraete(service, eintrag.userId, benachrichtigung, eintrag.sprache);
        if (erreicht) {
          gesendet += 1;
          await protokolliere(
            service,
            eintrag.userId,
            benachrichtigung.anlass,
            alsKalendertag(jetzt, eintrag.zeitzone),
          );
        }
      }
    } catch (e) {
      fehler.push(`${eintrag.userId}: ${e instanceof Error ? e.message : 'unbekannt'}`);
    }
  }

  return jsonAntwort(
    {
      modus: 'cron',
      kandidaten: einstellungen.length,
      geplant: geplantGesamt,
      gesendet,
      testlauf: !VAPID_BEREIT,
      fehler,
    },
    200,
  );
});
