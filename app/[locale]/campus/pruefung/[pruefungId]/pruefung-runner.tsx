'use client';
import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button, Card, cn } from '@bze/ui';
import { restSekunden, formatMMSS, type PruefFrage, type PruefAntwort } from '@bze/core/bewertung';
import { pruefungAbgeben } from '../_actions';

type AntwortMap = Record<string, { option_id?: string; text?: string }>;

// ---- minimaler IndexedDB-Speicher (Offline-Autosave, Spec §4.3/§9) ----
function idb(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open('bze-pruefung', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('ergebnisse');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function idbSet(key: string, val: unknown) {
  try { const db = await idb(); const tx = db.transaction('ergebnisse', 'readwrite'); tx.objectStore('ergebnisse').put(val, key); } catch {}
}
async function idbGet<T>(key: string): Promise<T | null> {
  try {
    const db = await idb();
    return await new Promise((res) => {
      const req = db.transaction('ergebnisse', 'readonly').objectStore('ergebnisse').get(key);
      req.onsuccess = () => res((req.result as T) ?? null);
      req.onerror = () => res(null);
    });
  } catch { return null; }
}
async function idbDel(key: string) {
  try { const db = await idb(); db.transaction('ergebnisse', 'readwrite').objectStore('ergebnisse').delete(key); } catch {}
}

export function PruefungRunner({
  fragen, ergebnisId, gestartetAm, dauerMinuten,
}: { fragen: PruefFrage[]; ergebnisId: string; gestartetAm: string; dauerMinuten: number }) {
  const t = useTranslations('pruefung');
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();

  const [antworten, setAntworten] = React.useState<AntwortMap>({});
  const [markiert, setMarkiert] = React.useState<Set<string>>(new Set());
  const [idx, setIdx] = React.useState(0);
  const [rest, setRest] = React.useState(() => restSekunden(gestartetAm, dauerMinuten));
  const [dialog, setDialog] = React.useState(false);
  const [absenden, setAbsenden] = React.useState(false);
  const [fehler, setFehler] = React.useState<string | null>(null);
  const abgegeben = React.useRef(false);

  // Wiederherstellen
  React.useEffect(() => {
    idbGet<{ antworten: AntwortMap; markiert: string[] }>(ergebnisId).then((s) => {
      if (s) { setAntworten(s.antworten ?? {}); setMarkiert(new Set(s.markiert ?? [])); }
    });
  }, [ergebnisId]);

  // Autosave alle 10s + bei Änderung
  React.useEffect(() => {
    idbSet(ergebnisId, { antworten, markiert: [...markiert] });
    const iv = setInterval(() => idbSet(ergebnisId, { antworten, markiert: [...markiert] }), 10_000);
    return () => clearInterval(iv);
  }, [ergebnisId, antworten, markiert]);

  const abgeben = React.useCallback(async () => {
    if (abgegeben.current) return;
    abgegeben.current = true;
    setAbsenden(true); setFehler(null);
    try {
      const liste: PruefAntwort[] = fragen.map((f) => ({
        frage_id: f.id,
        option_id: antworten[f.id]?.option_id ?? null,
        text: antworten[f.id]?.text ?? null,
      }));
      await pruefungAbgeben({ ergebnisId, antworten: liste });
      await idbDel(ergebnisId);
      router.push(`/${locale}/campus/pruefung/ergebnis/${ergebnisId}`);
    } catch {
      abgegeben.current = false;
      setAbsenden(false);
      setFehler(t('abgabeFehler'));
    }
  }, [antworten, fragen, ergebnisId, locale, router, t]);

  // Timer
  React.useEffect(() => {
    const iv = setInterval(() => {
      const r = restSekunden(gestartetAm, dauerMinuten);
      setRest(r);
      if (r <= 0) { clearInterval(iv); void abgeben(); }
    }, 1000);
    return () => clearInterval(iv);
  }, [gestartetAm, dauerMinuten, abgeben]);

  const frage = fragen[idx]!;
  const beantwortet = (f: PruefFrage) => {
    const a = antworten[f.id];
    return f.typ === 'mc' ? Boolean(a?.option_id) : Boolean(a?.text && a.text.trim());
  };
  const anzahlBeantwortet = fragen.filter(beantwortet).length;

  function setMc(optionId: string) {
    setAntworten((m) => ({ ...m, [frage.id]: { option_id: optionId } }));
  }
  function setText(text: string) {
    setAntworten((m) => ({ ...m, [frage.id]: { text } }));
  }
  function toggleMark() {
    setMarkiert((s) => { const n = new Set(s); n.has(frage.id) ? n.delete(frage.id) : n.add(frage.id); return n; });
  }

  const knapp = rest <= 300;

  return (
    <main className="mx-auto max-w-2xl p-4 pb-28">
      {/* Kopf: Timer + Fortschritt */}
      <div className="sticky top-0 z-10 -mx-4 mb-3 flex items-center justify-between border-b border-border bg-bg px-4 py-2">
        <span className="text-sm text-muted">{t('frageXvonN', { pos: idx + 1, n: fragen.length })}</span>
        <span className={cn('rounded-full border px-3 py-1 text-sm font-bold tabular-nums',
          knapp ? 'border-status-falsch text-status-falsch' : 'border-border text-fg')}
          role="timer" aria-live="off">
          ⏱ {formatMMSS(rest)}
        </span>
      </div>

      {/* Übersichtsraster mit Markierung */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {fragen.map((f, i) => {
          const done = beantwortet(f);
          const mark = markiert.has(f.id);
          return (
            <button key={f.id} type="button" onClick={() => setIdx(i)}
              aria-current={i === idx ? 'true' : undefined}
              aria-label={t('zuFrage', { n: i + 1 }) + (done ? ' ✓' : '') + (mark ? ' ⚑' : '')}
              className={cn('relative h-9 w-9 rounded-md border text-xs font-semibold',
                i === idx && 'ring-2 ring-accent',
                done ? 'border-status-fertig text-status-fertig' : 'border-border text-muted')}>
              {i + 1}
              {mark && <span aria-hidden className="absolute -right-1 -top-1 text-[10px]">⚑</span>}
            </button>
          );
        })}
      </div>

      <Card>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent">
            {frage.typ === 'mc' ? t('mc') : t('freitext')}
          </span>
          <button type="button" onClick={toggleMark} className="touchable text-sm text-muted"
            aria-pressed={markiert.has(frage.id)}>
            {markiert.has(frage.id) ? t('markiertAn') : t('markieren')}
          </button>
        </div>
        <p className="text-[17px] font-semibold leading-snug">{frage.aufgabenstellung}</p>

        {frage.typ === 'mc' ? (
          <div className="mt-4 space-y-2">
            {frage.optionen.map((o) => (
              <button key={o.id} type="button" onClick={() => setMc(o.id)}
                aria-pressed={antworten[frage.id]?.option_id === o.id}
                className={cn('touchable flex w-full items-start gap-2 rounded-xl border p-3 text-start text-[15px]',
                  antworten[frage.id]?.option_id === o.id ? 'border-accent ring-2 ring-accent' : 'border-border hover:border-accent')}>
                <span aria-hidden className="mt-0.5 font-bold">
                  {antworten[frage.id]?.option_id === o.id ? '●' : '○'}
                </span>
                <span>{o.text}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <textarea
              value={antworten[frage.id]?.text ?? ''}
              onChange={(e) => setText(e.target.value)}
              rows={6} lang="de"
              className="w-full rounded-xl border border-border bg-surface p-3 text-[15px]"
              placeholder={t('freitextPlatzhalter')} />
            <p className="mt-1 text-xs text-muted">{t('freitextNurDeutsch')}</p>
          </div>
        )}
      </Card>

      {fehler && <p role="alert" className="mt-3 text-sm text-status-falsch">{fehler}</p>}

      {/* Navigation */}
      <div className="mt-4 flex gap-2">
        <Button variant="soft" className="flex-1" disabled={idx === 0} onClick={() => setIdx((n) => Math.max(0, n - 1))}>
          {t('zurueck')}
        </Button>
        {idx < fragen.length - 1 ? (
          <Button className="flex-1" onClick={() => setIdx((n) => Math.min(fragen.length - 1, n + 1))}>{t('weiter')}</Button>
        ) : (
          <Button className="flex-1" onClick={() => setDialog(true)}>{t('zurAbgabe')}</Button>
        )}
      </div>

      {/* Abgabedialog */}
      {dialog && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-20 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <Card className="w-full max-w-md">
            <h2 className="text-lg font-bold">{t('abgabeTitel')}</h2>
            <p className="mt-1 text-sm text-muted">{t('abgabeInfo', { beantwortet: anzahlBeantwortet, gesamt: fragen.length })}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="soft" className="flex-1" onClick={() => setDialog(false)} disabled={absenden}>{t('abbrechen')}</Button>
              <Button className="flex-1" onClick={abgeben} disabled={absenden}>{absenden ? t('sende') : t('jetztAbgeben')}</Button>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}
