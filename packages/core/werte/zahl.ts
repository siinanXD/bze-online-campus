/**
 * Zahlen aus unbekannten Eingaben lesen.
 *
 * Werte aus der Datenbank, aus Formularen und aus JSON-Spalten kommen als alles
 * an: Zahl, Text, `null`, leerer Text, Objekt. Die naheliegende Prüfung
 * `Number.isFinite(Number(wert))` ist dabei eine Falle — `Number(null)`,
 * `Number('')` und `Number([])` ergeben alle 0. Ein fehlender Wert landet damit
 * stillschweigend auf 0 statt auf dem vorgesehenen Standard, und genau dieser
 * Fehler ist in der Anzeige praktisch nicht zu finden.
 *
 * Deshalb gibt es diese Funktionen an einer Stelle für die ganze Domain.
 */

/**
 * Liest eine endliche Zahl oder `null`.
 *
 * Nimmt echte Zahlen und Zahlen als Text an. Alles andere — `null`,
 * `undefined`, leerer oder nur aus Leerzeichen bestehender Text, Objekte,
 * Arrays, `NaN`, `Infinity` — ergibt `null`.
 */
export function endlicheZahl(wert: unknown): number | null {
  if (typeof wert === 'number') return Number.isFinite(wert) ? wert : null;
  if (typeof wert === 'string' && wert.trim() !== '') {
    const zahl = Number(wert);
    return Number.isFinite(zahl) ? zahl : null;
  }
  return null;
}

/**
 * Liest eine ganze Zahl im Bereich `von` bis `bis` (beide einschließlich).
 *
 * Unbrauchbare Eingaben und Werte außerhalb des Bereichs ergeben `null`. Das
 * unterscheidet sich bewusst vom Beschneiden: manchmal soll ein Wert außerhalb
 * des Bereichs durch einen Standard ersetzt werden (eine Stunde 99 ist ein
 * Fehler), manchmal beschnitten (ein Tagesziel von 500 ist eine Absicht).
 * Der Aufrufer entscheidet, diese Funktion liefert nur das Urteil.
 */
export function ganzeZahlImBereich(wert: unknown, von: number, bis: number): number | null {
  const zahl = endlicheZahl(wert);
  if (zahl === null) return null;
  const ganz = Math.floor(zahl);
  if (ganz < von || ganz > bis) return null;
  return ganz;
}

/**
 * Liest eine Zahl und beschneidet sie auf den Bereich.
 *
 * Unbrauchbare Eingaben ergeben `null`; gültige Zahlen außerhalb des Bereichs
 * werden auf die nächste Grenze gezogen.
 */
export function beschnitteneZahl(wert: unknown, von: number, bis: number): number | null {
  const zahl = endlicheZahl(wert);
  if (zahl === null) return null;
  return Math.min(bis, Math.max(von, Math.round(zahl)));
}
