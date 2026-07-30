import * as React from 'react';
import { cn } from '../cn';
import { LadeZustand } from './zustaende';

export interface Spalte<T> {
  key: string;
  kopf: React.ReactNode;
  /** Rendert den Zellinhalt. */
  zelle: (datensatz: T) => React.ReactNode;
  /** Zahlen werden rechtsbuendig mit tabular-nums gesetzt. */
  zahl?: boolean;
  sortierbar?: boolean;
  /** Auf Mobil wandern die ersten beiden Spalten in den Kartenkopf. */
  kopfzeileMobil?: boolean;
  breite?: string;
}

export interface DatenTabelleProps<T> {
  spalten: Spalte<T>[];
  daten: T[];
  schluessel: (datensatz: T) => string;
  beschriftung: string;
  zustand?: 'laden' | 'leer' | 'fehler' | 'gefuellt';
  leerInhalt?: React.ReactNode;
  fehlerInhalt?: React.ReactNode;
  sortierung?: { key: string; richtung: 'aufsteigend' | 'absteigend' };
  onSortieren?: (key: string) => void;
  onZeileKlick?: (datensatz: T) => void;
  className?: string;
}

export function DatenTabelle<T>({
  spalten,
  daten,
  schluessel,
  beschriftung,
  zustand = 'gefuellt',
  leerInhalt,
  fehlerInhalt,
  sortierung,
  onSortieren,
  onZeileKlick,
  className,
}: DatenTabelleProps<T>) {
  if (zustand === 'laden') return <LadeZustand art="tabelle" />;
  if (zustand === 'fehler') return <>{fehlerInhalt}</>;
  if (zustand === 'leer' || daten.length === 0) return <>{leerInhalt}</>;

  const kopfSpalten = spalten.filter((s) => s.kopfzeileMobil);
  const restSpalten = spalten.filter((s) => !s.kopfzeileMobil);

  return (
    <>
      {/* Desktop: echte Tabelle */}
      <div
        className={cn(
          'hidden overflow-x-auto rounded-lg border border-border bg-surface md:block',
          className,
        )}
      >
        <table className="w-full border-collapse text-body-sm">
          <caption className="sr-only">{beschriftung}</caption>
          <thead className="sticky top-0 bg-bg-subtle">
            <tr>
              {spalten.map((s) => {
                const aktiv = sortierung?.key === s.key;
                return (
                  <th
                    key={s.key}
                    scope="col"
                    style={s.breite ? { width: s.breite } : undefined}
                    aria-sort={
                      aktiv
                        ? sortierung.richtung === 'aufsteigend'
                          ? 'ascending'
                          : 'descending'
                        : s.sortierbar
                          ? 'none'
                          : undefined
                    }
                    className={cn(
                      'border-b border-border px-4 py-3 text-label font-semibold text-fg-muted',
                      s.zahl ? 'text-end' : 'text-start',
                    )}
                  >
                    {s.sortierbar && onSortieren ? (
                      <button
                        type="button"
                        onClick={() => onSortieren(s.key)}
                        className="inline-flex items-center gap-1 hover:text-fg"
                      >
                        {s.kopf}
                        <span aria-hidden="true" className="text-caption">
                          {aktiv ? (sortierung.richtung === 'aufsteigend' ? '↑' : '↓') : '↕'}
                        </span>
                      </button>
                    ) : (
                      s.kopf
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {daten.map((d) => (
              <tr
                key={schluessel(d)}
                onClick={onZeileKlick ? () => onZeileKlick(d) : undefined}
                className={cn(
                  'border-b border-border last:border-0',
                  onZeileKlick && 'cursor-pointer hover:bg-bg-subtle',
                )}
              >
                {spalten.map((s) => (
                  <td
                    key={s.key}
                    className={cn(
                      'px-4 py-3 align-middle',
                      s.zahl ? 'zahlen text-end' : 'text-start',
                    )}
                  >
                    {s.zelle(d)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobil: ein Datensatz pro Karte */}
      <ul className={cn('space-y-3 md:hidden', className)} aria-label={beschriftung}>
        {daten.map((d) => (
          <li
            key={schluessel(d)}
            onClick={onZeileKlick ? () => onZeileKlick(d) : undefined}
            className={cn(
              'rounded-lg border border-border bg-surface p-4',
              onZeileKlick && 'cursor-pointer hover:border-border-strong',
            )}
          >
            {kopfSpalten.length > 0 && (
              <div className="mb-3 flex items-center justify-between gap-3">
                {kopfSpalten.map((s) => (
                  <div key={s.key} className="min-w-0 font-semibold">
                    {s.zelle(d)}
                  </div>
                ))}
              </div>
            )}
            <dl className="space-y-1.5 text-body-sm">
              {restSpalten.map((s) => (
                <div key={s.key} className="flex justify-between gap-4">
                  <dt className="text-fg-muted">{s.kopf}</dt>
                  <dd className={cn('text-end', s.zahl && 'zahlen')}>{s.zelle(d)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
