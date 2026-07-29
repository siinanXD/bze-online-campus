'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button, Card, StatusBadge, type FrageStatus } from '@bze/ui';
import {
  frageBearbeiten,
  frageFreigeben,
  fragenMassenfreigabe,
  frageStatusSetzen,
  generiereFragen,
  verifiziereFragen,
} from './actions';

export type ThemaOption = { id: string; bezeichnung: string };

export type FrageAnsicht = {
  id: string;
  thema: string;
  typ: string;
  aufgabenstellung: string;
  status: string;
  kern: boolean;
  kiGeneriert: boolean;
  schwierigkeit: number | null;
  quellenstufe: number | null;
  fundstelle: string | null;
  enthaeltZahlenwert: boolean;
  normbezuege: string[];
  verifikation: { bestaetigt: boolean; einwaende: string[]; confidence: number | null } | null;
  reviewGruende: string[];
  optionen: Array<{ id: string; text: string; ist_korrekt: boolean; erklaerung: string | null }>;
};

const STATUS_UI: Record<string, { s: FrageStatus; key: string }> = {
  entwurf: { s: 'neu', key: 'entwurf' },
  verifiziert: { s: 'einmal_richtig', key: 'verifiziert' },
  freigegeben: { s: 'abgeschlossen', key: 'freigegeben' },
  gesperrt: { s: 'falsch', key: 'gesperrt' },
  pruefung_noetig: { s: 'falsch', key: 'pruefungNoetig' },
};

const GRUND_KEY: Record<string, string> = {
  aehnlichkeit_zu_hoch: 'aehnlichkeit',
  verifikation_fehlgeschlagen: 'verifikationFehlgeschlagen',
  stichprobe: 'stichprobe',
};

type EditForm = {
  aufgabenstellung: string;
  kern: boolean;
  optionen: Array<{ id: string; text: string; ist_korrekt: boolean; erklaerung: string }>;
};

export function FragenClient({
  themen,
  fragen,
}: {
  themen: ThemaOption[];
  fragen: FrageAnsicht[];
}) {
  const t = useTranslations('ausbilder.fragen');
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [fehler, setFehler] = useState<string | null>(null);
  const [ergebnis, setErgebnis] = useState<string | null>(null);

  const [themaId, setThemaId] = useState<string>(themen[0]?.id ?? '');
  const [anzahl, setAnzahl] = useState<string>('5');
  const [typ, setTyp] = useState<'mc' | 'freitext'>('mc');
  const [schwierigkeit, setSchwierigkeit] = useState<'1' | '2' | '3'>('2');
  const [zielpool, setZielpool] = useState<'kern' | 'erweiterung'>('erweiterung');

  const [auswahl, setAuswahl] = useState<Set<string>>(new Set());
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);

  const entwuerfe = useMemo(() => fragen.filter((f) => f.status === 'entwurf'), [fragen]);
  const verifizierte = useMemo(() => fragen.filter((f) => f.status === 'verifiziert'), [fragen]);

  function lauf(fn: () => Promise<void>) {
    setFehler(null);
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
      } catch (e) {
        setFehler(e instanceof Error ? e.message : t('fehlerAllgemein'));
      }
    });
  }

  function generieren() {
    setErgebnis(null);
    const n = Number(anzahl);
    if (!themaId) {
      setFehler(t('themaPflicht'));
      return;
    }
    lauf(async () => {
      const res = (await generiereFragen({
        themaId,
        anzahl: n,
        typ,
        schwierigkeit: Number(schwierigkeit) as 1 | 2 | 3,
        zielpool,
      })) as {
        erstellt?: number;
        abgelehnt?: unknown[];
        verworfen_dublette?: unknown[];
        review_geflaggt?: unknown[];
      };
      setErgebnis(
        t('genErgebnis', {
          erstellt: res.erstellt ?? 0,
          abgelehnt: res.abgelehnt?.length ?? 0,
          dubletten: res.verworfen_dublette?.length ?? 0,
          review: res.review_geflaggt?.length ?? 0,
        }),
      );
    });
  }

  function alleEntwuerfeVerifizieren() {
    const ids = entwuerfe.map((f) => f.id);
    if (ids.length === 0) return;
    lauf(async () => {
      await verifiziereFragen({ frageIds: ids });
    });
  }

  function massenfreigabe() {
    const ids = [...auswahl];
    if (ids.length === 0) return;
    lauf(async () => {
      await fragenMassenfreigabe({ frageIds: ids });
      setAuswahl(new Set());
    });
  }

  function toggleAuswahl(id: string) {
    setAuswahl((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function starteEdit(f: FrageAnsicht) {
    setEditId(f.id);
    setEditForm({
      aufgabenstellung: f.aufgabenstellung,
      kern: f.kern,
      optionen: f.optionen.map((o) => ({
        id: o.id,
        text: o.text,
        ist_korrekt: o.ist_korrekt,
        erklaerung: o.erklaerung ?? '',
      })),
    });
  }

  function speichereEdit(frageId: string, typ: string) {
    if (!editForm) return;
    lauf(async () => {
      await frageBearbeiten({
        frageId,
        aufgabenstellung: editForm.aufgabenstellung,
        kern: editForm.kern,
        optionen: typ === 'mc' && editForm.optionen.length > 0 ? editForm.optionen : undefined,
      });
      setEditId(null);
      setEditForm(null);
    });
  }

  function renderFrage(f: FrageAnsicht, waehlbar: boolean) {
    const ui = STATUS_UI[f.status] ?? { s: 'neu' as FrageStatus, key: 'entwurf' };
    const imEdit = editId === f.id && editForm;
    return (
      <Card key={f.id}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-muted">
              {f.thema} · {t(`typ.${f.typ}`)} · {t('schwierigkeitKurz', { n: f.schwierigkeit ?? '–' })}
            </p>
            {!imEdit && <p className="mt-1 font-semibold">{f.aufgabenstellung}</p>}
          </div>
          <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
            {f.kern && (
              <span className="rounded-full border border-accent px-2 py-1 text-xs font-semibold text-accent">
                ★ {t('kern')}
              </span>
            )}
            <StatusBadge status={ui.s} label={t(`status.${ui.key}`)} />
          </div>
        </div>

        {imEdit && editForm ? (
          <div className="mt-3 space-y-3">
            <label className="block text-sm">
              <span className="mb-1 block font-semibold">{t('aufgabenstellung')}</span>
              <textarea
                rows={3}
                value={editForm.aufgabenstellung}
                onChange={(e) => setEditForm({ ...editForm, aufgabenstellung: e.target.value })}
                className="touchable w-full rounded-xl border border-border bg-bg px-3 py-2 text-[15px]"
              />
            </label>
            {f.typ === 'mc' && editForm.optionen.length > 0 && (
              <fieldset className="space-y-2">
                <legend className="text-sm font-semibold">{t('optionen')}</legend>
                {editForm.optionen.map((o, idx) => (
                  <div key={o.id} className="flex items-start gap-2">
                    <input
                      type="radio"
                      name={`korrekt-${f.id}`}
                      checked={o.ist_korrekt}
                      aria-label={t('alsKorrekt')}
                      onChange={() =>
                        setEditForm({
                          ...editForm,
                          optionen: editForm.optionen.map((x, i) => ({
                            ...x,
                            ist_korrekt: i === idx,
                          })),
                        })
                      }
                      className="mt-3 h-5 w-5"
                    />
                    <input
                      type="text"
                      value={o.text}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          optionen: editForm.optionen.map((x, i) =>
                            i === idx ? { ...x, text: e.target.value } : x,
                          ),
                        })
                      }
                      className="touchable w-full rounded-xl border border-border bg-bg px-3 text-[15px]"
                    />
                  </div>
                ))}
              </fieldset>
            )}
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={editForm.kern}
                onChange={(e) => setEditForm({ ...editForm, kern: e.target.checked })}
                className="h-5 w-5"
              />
              {t('kernMarkieren')}
            </label>
            <div className="flex flex-wrap gap-2">
              <Button type="button" disabled={pending} onClick={() => speichereEdit(f.id, f.typ)}>
                {t('speichern')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={pending}
                onClick={() => {
                  setEditId(null);
                  setEditForm(null);
                }}
              >
                {t('abbrechen')}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <dl className="mt-3 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
              <div>
                <dt className="inline font-semibold">{t('quellenstufe')}: </dt>
                <dd className="inline">{f.quellenstufe ?? t('ohneAngabe')}</dd>
              </div>
              <div>
                <dt className="inline font-semibold">{t('fundstelle')}: </dt>
                <dd className="inline">{f.fundstelle ?? t('ohneAngabe')}</dd>
              </div>
              <div>
                <dt className="inline font-semibold">{t('zahlenwert')}: </dt>
                <dd className="inline">{f.enthaeltZahlenwert ? t('ja') : t('nein')}</dd>
              </div>
              {f.normbezuege.length > 0 && (
                <div>
                  <dt className="inline font-semibold">{t('normbezuege')}: </dt>
                  <dd className="inline">{f.normbezuege.join(', ')}</dd>
                </div>
              )}
            </dl>

            {f.typ === 'mc' && f.optionen.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm">
                {f.optionen.map((o) => (
                  <li key={o.id} className="flex items-start gap-2">
                    <span aria-hidden="true" className={o.ist_korrekt ? 'text-status-fertig' : 'text-muted'}>
                      {o.ist_korrekt ? '✓' : '○'}
                    </span>
                    <span>{o.text}</span>
                  </li>
                ))}
              </ul>
            )}

            {f.verifikation && (
              <div className="mt-3 rounded-xl border border-border bg-surface px-3 py-2 text-sm">
                <p className="font-semibold">
                  {f.verifikation.bestaetigt ? t('verifBestaetigt') : t('verifOffen')}
                  {f.verifikation.confidence != null &&
                    ` · ${t('confidence', { n: Math.round(f.verifikation.confidence * 100) })}`}
                </p>
                {f.verifikation.einwaende.length > 0 && (
                  <ul className="mt-1 list-disc ps-5 text-muted">
                    {f.verifikation.einwaende.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {f.reviewGruende.length > 0 && (
              <p role="note" className="mt-3 text-sm font-semibold text-status-falsch">
                ⚠ {f.reviewGruende.map((g) => t(`grund.${GRUND_KEY[g] ?? 'sonstige'}`)).join(' · ')}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {waehlbar && (
                <label className="me-2 flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={auswahl.has(f.id)}
                    onChange={() => toggleAuswahl(f.id)}
                    className="h-5 w-5"
                  />
                  {t('auswaehlen')}
                </label>
              )}
              {f.status === 'entwurf' && (
                <Button type="button" disabled={pending} onClick={() => lauf(async () => {
                  await verifiziereFragen({ frageIds: [f.id] });
                })}>
                  {t('verifizieren')}
                </Button>
              )}
              {f.status === 'verifiziert' && (
                <Button type="button" disabled={pending} onClick={() => lauf(async () => {
                  await frageFreigeben({ frageId: f.id });
                })}>
                  {t('freigeben')}
                </Button>
              )}
              <Button type="button" variant="ghost" disabled={pending} onClick={() => starteEdit(f)}>
                {t('bearbeiten')}
              </Button>
              {f.status !== 'gesperrt' && (
                <Button
                  type="button"
                  variant="ghost"
                  disabled={pending}
                  onClick={() => lauf(async () => {
                    await frageStatusSetzen({ frageId: f.id, status: 'gesperrt' });
                  })}
                >
                  {t('sperren')}
                </Button>
              )}
            </div>
          </>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <p role="note" className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted">
        <span aria-hidden="true" className="me-2">ℹ</span>
        {t('entwurfHinweis')}
      </p>

      {fehler && (
        <p role="alert" className="text-sm font-semibold text-status-falsch">
          ✕ {fehler}
        </p>
      )}
      {ergebnis && (
        <p role="status" className="rounded-xl border border-status-fertig/40 bg-surface px-3 py-2 text-sm font-semibold text-status-fertig">
          ✓ {ergebnis}
        </p>
      )}

      {/* Batch-Generator */}
      <Card>
        <h2 className="text-lg font-bold">{t('generatorTitel')}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block font-semibold">{t('thema')}</span>
            <select
              value={themaId}
              onChange={(e) => setThemaId(e.target.value)}
              className="touchable w-full rounded-xl border border-border bg-bg px-3 text-[15px]"
            >
              {themen.length === 0 && <option value="">{t('keineThemen')}</option>}
              {themen.map((th) => (
                <option key={th.id} value={th.id}>
                  {th.bezeichnung}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">{t('anzahl')}</span>
            <input
              type="number"
              min={1}
              max={50}
              value={anzahl}
              onChange={(e) => setAnzahl(e.target.value)}
              className="touchable w-full rounded-xl border border-border bg-bg px-3 text-[15px]"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">{t('typ.label')}</span>
            <select
              value={typ}
              onChange={(e) => setTyp(e.target.value as 'mc' | 'freitext')}
              className="touchable w-full rounded-xl border border-border bg-bg px-3 text-[15px]"
            >
              <option value="mc">{t('typ.mc')}</option>
              <option value="freitext">{t('typ.freitext')}</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">{t('schwierigkeit')}</span>
            <select
              value={schwierigkeit}
              onChange={(e) => setSchwierigkeit(e.target.value as '1' | '2' | '3')}
              className="touchable w-full rounded-xl border border-border bg-bg px-3 text-[15px]"
            >
              <option value="1">{t('schwierigkeitKurz', { n: 1 })}</option>
              <option value="2">{t('schwierigkeitKurz', { n: 2 })}</option>
              <option value="3">{t('schwierigkeitKurz', { n: 3 })}</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold">{t('zielpool')}</span>
            <select
              value={zielpool}
              onChange={(e) => setZielpool(e.target.value as 'kern' | 'erweiterung')}
              className="touchable w-full rounded-xl border border-border bg-bg px-3 text-[15px]"
            >
              <option value="erweiterung">{t('zielpoolErweiterung')}</option>
              <option value="kern">{t('zielpoolKern')}</option>
            </select>
          </label>
        </div>
        <p className="mt-2 text-xs text-muted">{t('quellenhinweis')}</p>
        <Button type="button" className="mt-3" disabled={pending || !themaId} onClick={generieren}>
          {t('generieren')}
        </Button>
      </Card>

      {/* Werkzeugleiste */}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="ghost" disabled={pending || entwuerfe.length === 0} onClick={alleEntwuerfeVerifizieren}>
          {t('alleVerifizieren', { n: entwuerfe.length })}
        </Button>
        <Button type="button" disabled={pending || auswahl.size === 0} onClick={massenfreigabe}>
          {t('massenfreigabe', { n: auswahl.size })}
        </Button>
      </div>

      {/* Entwürfe */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">{t('entwuerfeTitel', { n: entwuerfe.length })}</h2>
        {entwuerfe.length === 0 ? (
          <p className="text-sm text-muted">{t('leer')}</p>
        ) : (
          entwuerfe.map((f) => renderFrage(f, false))
        )}
      </section>

      {/* Verifiziert */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">{t('verifizierteTitel', { n: verifizierte.length })}</h2>
        {verifizierte.length === 0 ? (
          <p className="text-sm text-muted">{t('leer')}</p>
        ) : (
          verifizierte.map((f) => renderFrage(f, true))
        )}
      </section>
    </div>
  );
}
