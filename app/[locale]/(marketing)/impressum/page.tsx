import * as React from 'react';
import { useTranslations } from 'next-intl';

/**
 * Impressum (SPEC §6.5, §10 Compliance). Rechtlich verbindliche Angaben
 * (Anschrift, Vertretungsberechtigte, Registerdaten) sind als Platzhalter
 * markiert — siehe Zusammenfassung „offene Fragen" der Session, die diese
 * Seite angelegt hat. Diese Datei erfindet keine Kammer- oder Trägerdaten.
 */
export default function ImpressumSeite() {
  const t = useTranslations('shell.marketing.impressum');

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 text-start">
      <h1 className="text-2xl font-extrabold text-fg">{t('titel')}</h1>

      <section aria-labelledby="anbieter-titel" className="space-y-1.5">
        <h2 id="anbieter-titel" className="text-sm font-bold uppercase tracking-wide text-primary">
          {t('anbieterTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-fg">{t('anbieterName')}</p>
        <p className="whitespace-pre-line text-sm leading-relaxed text-fg-muted">{t('anschriftPlatzhalter')}</p>
      </section>

      <section aria-labelledby="vertretung-titel" className="space-y-1.5">
        <h2 id="vertretung-titel" className="text-sm font-bold uppercase tracking-wide text-primary">
          {t('vertretungTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-fg-muted">{t('vertretungPlatzhalter')}</p>
      </section>

      <section aria-labelledby="kontakt-titel" className="space-y-1.5">
        <h2 id="kontakt-titel" className="text-sm font-bold uppercase tracking-wide text-primary">
          {t('kontaktTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-fg-muted">{t('kontaktPlatzhalter')}</p>
      </section>

      <section aria-labelledby="verantwortlich-titel" className="space-y-1.5">
        <h2 id="verantwortlich-titel" className="text-sm font-bold uppercase tracking-wide text-primary">
          {t('verantwortlichTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-fg-muted">{t('verantwortlichPlatzhalter')}</p>
      </section>

      <section aria-labelledby="streit-titel" className="space-y-1.5">
        <h2 id="streit-titel" className="text-sm font-bold uppercase tracking-wide text-primary">
          {t('streitschlichtungTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-fg-muted">{t('streitschlichtungText')}</p>
      </section>

      <section aria-labelledby="haftung-titel" className="space-y-1.5">
        <h2 id="haftung-titel" className="text-sm font-bold uppercase tracking-wide text-primary">
          {t('haftungTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-fg-muted">{t('haftungInhalteText')}</p>
        <p className="text-sm leading-relaxed text-fg-muted">{t('haftungLinksText')}</p>
      </section>

      <section aria-labelledby="urheberrecht-titel" className="space-y-1.5">
        <h2 id="urheberrecht-titel" className="text-sm font-bold uppercase tracking-wide text-primary">
          {t('urheberrechtTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-fg-muted">{t('urheberrechtText')}</p>
      </section>
    </div>
  );
}
