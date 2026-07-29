'use client';

import { useEffect, useState } from 'react';
import { Button, Card } from '@bze/ui';

type Mitglied = { id: string; benutzername: string; vorname: string | null; nachname: string | null; aktiv: boolean };
type GespeicherterEintrag = { id: string; benutzername: string; initialPasswort: string };

/**
 * Druckbare Kohortenliste (Spec §6.4 Nr. 25). Initialpasswörter werden
 * NIE dauerhaft gespeichert oder eingesehen — sie stehen ausschließlich für
 * die laufende Browser-Sitzung im sessionStorage, dort abgelegt direkt nach
 * der Anlage in `nutzer/neu`. Nach Sitzungsende oder auf einem anderen
 * Gerät zeigt diese Liste nur noch Benutzernamen ohne Passwort.
 */
export function DruckAnsicht({
  kohorteId,
  kohorteBezeichnung,
  mitglieder,
  texte,
}: {
  kohorteId: string;
  kohorteBezeichnung: string;
  mitglieder: Mitglied[];
  texte: {
    titel: string;
    traeger: string;
    spalteName: string;
    spalteBenutzername: string;
    spaltePasswort: string;
    passwortUnbekannt: string;
    drucken: string;
    hinweis: string;
    keineMitglieder: string;
  };
}) {
  const [passwoerter, setPasswoerter] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const roh = window.sessionStorage.getItem(`bze_admin_zugangsdaten_${kohorteId}`);
      if (!roh) return;
      const eintraege: GespeicherterEintrag[] = JSON.parse(roh);
      const zugeordnet: Record<string, string> = {};
      for (const e of eintraege) zugeordnet[e.id] = e.initialPasswort;
      setPasswoerter(zugeordnet);
    } catch {
      // kein sessionStorage verfügbar — Liste bleibt ohne Passwörter, kein harter Fehler
    }
  }, [kohorteId]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h2 className="text-lg font-bold">{texte.titel}</h2>
        <Button variante="primary" onClick={() => window.print()}>
          {texte.drucken}
        </Button>
      </div>

      <p className="text-sm text-fg-muted print:hidden">{texte.hinweis}</p>

      <Card className="print:border-0 print:p-0 print:shadow-none">
        <header className="mb-4 hidden print:block">
          <p className="text-sm text-fg-muted">{texte.traeger}</p>
          <h1 className="text-xl font-extrabold">{kohorteBezeichnung}</h1>
        </header>
        <h2 className="mb-3 text-base font-bold print:hidden">{kohorteBezeichnung}</h2>

        {mitglieder.length === 0 ? (
          <p className="text-sm text-fg-muted">{texte.keineMitglieder}</p>
        ) : (
          <table className="w-full border-collapse text-start text-sm">
            <thead>
              <tr className="border-b border-border text-start text-xs uppercase tracking-wide text-fg-muted">
                <th className="px-2 py-2 text-start font-semibold">{texte.spalteName}</th>
                <th className="px-2 py-2 text-start font-semibold">{texte.spalteBenutzername}</th>
                <th className="px-2 py-2 text-start font-semibold">{texte.spaltePasswort}</th>
              </tr>
            </thead>
            <tbody>
              {mitglieder.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0">
                  <td className="px-2 py-2">{m.vorname} {m.nachname}</td>
                  <td className="px-2 py-2 font-mono">{m.benutzername}</td>
                  <td className="px-2 py-2 font-mono">{passwoerter[m.id] ?? texte.passwortUnbekannt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
