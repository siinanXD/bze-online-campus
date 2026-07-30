/**
 * Client-Helfer für Web Push (AP-17).
 *
 * Nur im Browser verwenden. Die Datei kümmert sich um die drei Dinge, die
 * ausschließlich im Browser möglich sind: Erlaubnis erfragen, ein Abo beim
 * Push-Dienst anlegen und die Schlüssel in ein Format bringen, das sich
 * speichern lässt. Alles Weitere — wann gesendet wird, was drinsteht — liegt in
 * `packages/core/benachrichtigung` und in der Edge Function.
 *
 * Bewusst ohne Bibliothek: die benötigten Umwandlungen sind zwei kurze
 * Funktionen, und eine Abhängigkeit im Service-Worker-Umfeld will man nicht
 * pflegen.
 */

import { serviceWorkerVerfuegbar } from './offline-client';

/** Zustand der Push-Einrichtung, wie ihn die Oberfläche anzeigt. */
export type PushZustand =
  /** Der Browser kann kein Web Push (etwa iOS-Safari außerhalb der Installation). */
  | 'nicht_unterstuetzt'
  /** Noch nie gefragt — der Opt-in-Knopf ist sinnvoll. */
  | 'ungefragt'
  /** Erlaubt und Abo vorhanden. */
  | 'aktiv'
  /** Erlaubt, aber kein Abo (etwa nach dem Abmelden). */
  | 'erlaubt_ohne_abo'
  /** Abgelehnt — der Knopf muss verschwinden, ein zweites Fragen ist gesperrt. */
  | 'abgelehnt';

/** Die zum Speichern nötigen Teile eines Abos. */
export interface AboDaten {
  endpoint: string;
  p256dh: string;
  authSecret: string;
  geraet: string;
}

/** Kann dieser Browser Web Push? */
export function pushVerfuegbar(): boolean {
  return (
    serviceWorkerVerfuegbar() &&
    typeof window !== 'undefined' &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Wandelt einen base64url-kodierten VAPID-Schlüssel in das von `subscribe`
 * verlangte `Uint8Array`.
 *
 * `applicationServerKey` nimmt keinen Text an. Die Umwandlung muss base64url
 * (mit `-` und `_`) in normales base64 überführen und auf ein Vielfaches von
 * vier auffüllen, sonst wirft `atob`.
 */
export function base64UrlZuBytes(base64Url: string): Uint8Array<ArrayBuffer> {
  const auffuellung = '='.repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + auffuellung).replace(/-/g, '+').replace(/_/g, '/');
  const rohdaten = atob(base64);
  // Auf einem eigens angelegten ArrayBuffer, nicht über new Uint8Array(länge):
  // pushManager.subscribe verlangt eine BufferSource über ArrayBuffer, und der
  // Standardpuffer eines Uint8Array ist als ArrayBufferLike typisiert.
  const puffer = new ArrayBuffer(rohdaten.length);
  const bytes = new Uint8Array(puffer);
  for (let i = 0; i < rohdaten.length; i += 1) bytes[i] = rohdaten.charCodeAt(i);
  return bytes;
}

/**
 * Wandelt einen Abo-Schlüssel in base64url für die Speicherung.
 *
 * Gegenstück zu `base64UrlZuBytes`. Die Edge Function erwartet base64url, weil
 * der Wert später in HTTP-Kopfzeilen auftaucht, wo `+` und `/` Probleme machen.
 */
export function bytesZuBase64Url(puffer: ArrayBuffer | null): string {
  if (!puffer) return '';
  const bytes = new Uint8Array(puffer);
  let roh = '';
  for (const byte of bytes) roh += String.fromCharCode(byte);
  return btoa(roh).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Kurze Gerätebeschreibung für die Anzeige in den Einstellungen.
 *
 * Absichtlich grob: es geht nur darum, mehrere Geräte einer Person
 * unterscheidbar zu machen („Chrome auf Android" gegenüber „Firefox auf
 * Windows"). Eine genaue Erkennung wäre eine Wiedererkennungsmarke und damit
 * unnötig personenbezogen.
 */
export function geraeteBeschreibung(userAgent: string): string {
  const browser =
    /Edg\//.test(userAgent) ? 'Edge'
    : /OPR\//.test(userAgent) ? 'Opera'
    : /Firefox\//.test(userAgent) ? 'Firefox'
    : /Chrome\//.test(userAgent) ? 'Chrome'
    : /Safari\//.test(userAgent) ? 'Safari'
    : 'Browser';

  const system =
    /Android/.test(userAgent) ? 'Android'
    : /iPhone|iPad|iPod/.test(userAgent) ? 'iOS'
    : /Windows/.test(userAgent) ? 'Windows'
    : /Mac OS X/.test(userAgent) ? 'macOS'
    : /Linux/.test(userAgent) ? 'Linux'
    : 'unbekannt';

  return `${browser} auf ${system}`;
}

/** Liest den aktuellen Zustand, ohne etwas zu verändern. */
export async function lesePushZustand(): Promise<PushZustand> {
  if (!pushVerfuegbar()) return 'nicht_unterstuetzt';
  if (Notification.permission === 'denied') return 'abgelehnt';
  if (Notification.permission === 'default') return 'ungefragt';

  const registrierung = await navigator.serviceWorker.ready;
  const abo = await registrierung.pushManager.getSubscription();
  return abo ? 'aktiv' : 'erlaubt_ohne_abo';
}

/**
 * Liest die speicherbaren Teile eines Abos.
 *
 * Gibt `null` zurück, wenn einer der Schlüssel fehlt. Ohne beide Schlüssel lässt
 * sich die Nutzlast nicht verschlüsseln, und ein Abo ohne sie wäre ein
 * Eintrag, an den nie gesendet werden kann.
 */
export function aboDaten(abo: PushSubscription, userAgent: string): AboDaten | null {
  const p256dh = bytesZuBase64Url(abo.getKey('p256dh'));
  const authSecret = bytesZuBase64Url(abo.getKey('auth'));
  if (!p256dh || !authSecret) return null;
  return { endpoint: abo.endpoint, p256dh, authSecret, geraet: geraeteBeschreibung(userAgent) };
}

/**
 * Fragt die Erlaubnis ab und legt ein Abo an.
 *
 * Gibt `null` zurück, wenn die Erlaubnis fehlt oder der Push-Dienst das Abo
 * verweigert. Der Aufrufer speichert die Rückgabe über eine Server Action.
 *
 * `userVisibleOnly: true` ist Pflicht — Chrome verweigert stille Abos, und
 * fachlich wäre ein unsichtbarer Push hier auch nicht gewollt.
 */
export async function meldePushAn(vapidPublicKey: string): Promise<AboDaten | null> {
  if (!pushVerfuegbar() || !vapidPublicKey) return null;

  const erlaubnis = await Notification.requestPermission();
  if (erlaubnis !== 'granted') return null;

  const registrierung = await navigator.serviceWorker.ready;

  // Ein vorhandenes Abo wiederverwenden, statt ein zweites anzulegen: der
  // Push-Dienst würde denselben Endpunkt liefern, aber der Aufruf kostet Zeit.
  const vorhanden = await registrierung.pushManager.getSubscription();
  if (vorhanden) return aboDaten(vorhanden, navigator.userAgent);

  try {
    const abo = await registrierung.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64UrlZuBytes(vapidPublicKey),
    });
    return aboDaten(abo, navigator.userAgent);
  } catch {
    return null;
  }
}

/**
 * Meldet das Abo dieses Geräts ab.
 *
 * Gibt den Endpunkt zurück, damit der Aufrufer die passende Zeile löschen kann.
 * `null` bedeutet: es gab hier nichts abzumelden.
 */
export async function meldePushAb(): Promise<string | null> {
  if (!pushVerfuegbar()) return null;
  const registrierung = await navigator.serviceWorker.ready;
  const abo = await registrierung.pushManager.getSubscription();
  if (!abo) return null;
  const { endpoint } = abo;
  await abo.unsubscribe();
  return endpoint;
}

/**
 * Erneuert das Abo, nachdem der Push-Dienst es ausgetauscht hat.
 *
 * Reaktion auf `PUSH_ABO_ERNEUERN` aus dem Service Worker. Ohne diesen Weg
 * verstummt Push nach einigen Wochen stillschweigend.
 */
export async function erneuerePushAbo(vapidPublicKey: string): Promise<AboDaten | null> {
  if (!pushVerfuegbar() || Notification.permission !== 'granted') return null;
  const registrierung = await navigator.serviceWorker.ready;
  const altes = await registrierung.pushManager.getSubscription();
  if (altes) await altes.unsubscribe();
  return meldePushAn(vapidPublicKey);
}

/** Die Zeitzone des Geräts, für die stillen Zeiten. */
export function geraeteZeitzone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Berlin';
  } catch {
    return 'Europe/Berlin';
  }
}
