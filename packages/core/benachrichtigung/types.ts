/**
 * Typen der Benachrichtigungs-Domain.
 *
 * Die Domain entscheidet ausschließlich, **ob** und **was** gesendet wird. Das
 * eigentliche Senden (VAPID-Signatur, HTTP an den Push-Dienst) liegt in der Edge
 * Function `sende-erinnerungen`. Diese Trennung erlaubt es, die gesamte
 * Entscheidungslogik ohne Netzwerk und ohne Push-Dienst zu testen.
 */

/** Anlass einer Benachrichtigung — bestimmt Text, Ziel und Dringlichkeit. */
export type Anlass =
  /** Fragen stehen zur Wiederholung an (Spacing abgelaufen). */
  | 'faellige_wiederholung'
  /** Gestern gelernt, heute noch nicht — die Serie kann heute reißen. */
  | 'serie_gefaehrdet'
  /** Tagesziel noch nicht erreicht, der Tag geht aber zu Ende. */
  | 'tagesziel_offen'
  /** Die Wochenprüfung der laufenden Woche fehlt noch. */
  | 'wochenpruefung_offen'
  /** Der Ausbildungsnachweis einer vergangenen Woche fehlt. */
  | 'nachweis_luecke'
  /** Ein Ausbilder hat einen Nachweis freigegeben oder zurückgewiesen. */
  | 'nachweis_entschieden'
  /** Ein neuer Wochenbericht liegt bereit. */
  | 'wochenbericht_bereit';

/**
 * Dringlichkeit im Sinne des Web-Push-Protokolls (RFC 8030 `Urgency`).
 *
 * Wirkt auf die Auslieferung bei stromsparenden Geräten. Lernerinnerungen sind
 * `normal`, Entscheidungen eines Ausbilders `high`.
 */
export type Dringlichkeit = 'very-low' | 'low' | 'normal' | 'high';

/** Ein gespeichertes Push-Abo, wie es aus `push_abos` kommt. */
export interface PushAbo {
  id: string;
  userId: string;
  endpoint: string;
  /** Zeitpunkt des letzten erfolgreichen Versands, ISO-Zeitstempel. */
  zuletztGesendetAm: string | null;
  /** Aufeinanderfolgende Fehlversuche — ab einer Grenze wird das Abo entfernt. */
  fehlversuche: number;
}

/** Einstellungen einer lernenden Person aus `push_einstellungen`. */
export interface PushEinstellungen {
  /** Grundschalter — false bedeutet: gar nichts senden. */
  aktiv: boolean;
  /** Zeitzone der Person, z. B. `Europe/Berlin`. */
  zeitzone: string;
  /** Beginn der stillen Zeit als Stunde 0–23 (einschließlich). */
  stillVon: number;
  /** Ende der stillen Zeit als Stunde 0–23 (ausschließlich). */
  stillBis: number;
  /** Höchstzahl Benachrichtigungen pro Kalendertag. */
  maxProTag: number;
  /** Abgewählte Anlässe — alles andere ist erlaubt. */
  abgewaehlt: readonly Anlass[];
}

/** Ein bereits gesendeter Eintrag aus `push_protokoll`. */
export interface ProtokollEintrag {
  anlass: Anlass;
  /** ISO-Zeitstempel des Versands. */
  gesendetAm: string;
  /** Kalendertag des Versands in der Zeitzone der Person. */
  tag: string;
}

/** Alles, was die Planung über eine lernende Person wissen muss. */
export interface PlanungsEingabe {
  userId: string;
  einstellungen: PushEinstellungen;
  /** Bereits gesendete Benachrichtigungen, für Deckel und Wiederholungsschutz. */
  protokoll: readonly ProtokollEintrag[];
  /** Anzahl jetzt fälliger Fragen (aus `engagement/faelligkeit`). */
  faelligGesamt: number;
  /** Wie viele davon frühere Fehler sind — verdient eine deutlichere Ansprache. */
  faelligFalsch: number;
  /** Serienzustand aus `engagement/serie`. */
  serienStatus: 'aktiv' | 'gefaehrdet' | 'gerissen';
  serienLaenge: number;
  /** Offene Fragen bis zum Tagesziel. */
  tageszielOffen: number;
  /** Fehlt die Wochenprüfung der laufenden Woche? */
  wochenpruefungOffen: boolean;
  /** Anzahl fehlender Ausbildungsnachweise vergangener Wochen. */
  nachweisLuecken: number;
  /** Ausbilder-Entscheidungen, die noch nicht gemeldet wurden. */
  offeneEntscheidungen: number;
  /** Liegt ein ungelesener Wochenbericht vor? */
  wochenberichtBereit: boolean;
}

/** Eine geplante, noch nicht gesendete Benachrichtigung. */
export interface GeplanteBenachrichtigung {
  userId: string;
  anlass: Anlass;
  dringlichkeit: Dringlichkeit;
  /**
   * Übersetzungsschlüssel für Titel und Text. Die Domain liefert nie fertige
   * Sätze — der Versender übersetzt in die Sprache der Person.
   */
  titelKey: string;
  textKey: string;
  /** Werte für die Platzhalter im Text, z. B. `{ anzahl: 8 }`. */
  werte: Record<string, number | string>;
  /** Zielpfad ohne Sprachpräfix, z. B. `/campus/lernen`. */
  pfad: string;
  /**
   * Kennung zum Zusammenfassen auf dem Gerät. Gleiches Tag ersetzt die alte
   * Meldung statt zu stapeln — niemand soll fünf Serien-Hinweise vorfinden.
   */
  tag: string;
}
