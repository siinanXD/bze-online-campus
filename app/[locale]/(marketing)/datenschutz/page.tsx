import * as React from 'react';
import { useTranslations } from 'next-intl';

/**
 * Datenschutzerklärung (SPEC §6.5, §10 Compliance). Der Name des
 * Verantwortlichen und Kontaktdaten sind Platzhalter, siehe „offene Fragen"
 * der Session, die diese Seite angelegt hat. Diese Datei erfindet keine
 * personenbezogenen oder kammerspezifischen Angaben.
 */
export default function DatenschutzSeite() {
  const t = useTranslations('shell.marketing.datenschutz');

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 text-start">
      <h1 className="text-2xl font-extrabold text-fg">{t('titel')}</h1>
      <p className="text-sm leading-relaxed text-muted">{t('einleitung')}</p>

      <section aria-labelledby="verantwortlicher-titel" className="space-y-1.5">
        <h2 id="verantwortlicher-titel" className="text-sm font-bold uppercase tracking-wide text-accent">
          {t('verantwortlicherTitel')}
        </h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{t('verantwortlicherPlatzhalter')}</p>
      </section>

      <section aria-labelledby="erhebung-titel" className="space-y-1.5">
        <h2 id="erhebung-titel" className="text-sm font-bold uppercase tracking-wide text-accent">
          {t('erhebungTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-muted">{t('erhebungText')}</p>
      </section>

      <section aria-labelledby="hosting-titel" className="space-y-1.5">
        <h2 id="hosting-titel" className="text-sm font-bold uppercase tracking-wide text-accent">
          {t('hostingTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-muted">{t('hostingText')}</p>
      </section>

      <section aria-labelledby="ki-titel" className="space-y-1.5">
        <h2 id="ki-titel" className="text-sm font-bold uppercase tracking-wide text-accent">
          {t('kiTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-muted">{t('kiText')}</p>
      </section>

      <section aria-labelledby="cookies-titel" className="space-y-1.5">
        <h2 id="cookies-titel" className="text-sm font-bold uppercase tracking-wide text-accent">
          {t('cookiesTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-muted">{t('cookiesText')}</p>
      </section>

      <section aria-labelledby="rechte-titel" className="space-y-1.5">
        <h2 id="rechte-titel" className="text-sm font-bold uppercase tracking-wide text-accent">
          {t('rechteTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-muted">{t('rechteText')}</p>
      </section>

      <section aria-labelledby="rechtsgrundlagen-titel" className="space-y-1.5">
        <h2 id="rechtsgrundlagen-titel" className="text-sm font-bold uppercase tracking-wide text-accent">
          {t('rechtsgrundlagenTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-muted">{t('rechtsgrundlagenText')}</p>
      </section>

      <section aria-labelledby="speicher-titel" className="space-y-1.5">
        <h2 id="speicher-titel" className="text-sm font-bold uppercase tracking-wide text-accent">
          {t('speicherTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-muted">{t('speicherText')}</p>
      </section>

      <section aria-labelledby="avv-titel" className="space-y-1.5">
        <h2 id="avv-titel" className="text-sm font-bold uppercase tracking-wide text-accent">
          {t('auftragsverarbeiterTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-muted">{t('auftragsverarbeiterText')}</p>
      </section>

      <section aria-labelledby="beschwerde-titel" className="space-y-1.5">
        <h2 id="beschwerde-titel" className="text-sm font-bold uppercase tracking-wide text-accent">
          {t('beschwerdeTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-muted">{t('beschwerdeText')}</p>
      </section>

      <section aria-labelledby="kontakt-titel" className="space-y-1.5">
        <h2 id="kontakt-titel" className="text-sm font-bold uppercase tracking-wide text-accent">
          {t('kontaktTitel')}
        </h2>
        <p className="text-sm leading-relaxed text-muted">{t('kontaktPlatzhalter')}</p>
      </section>
    </div>
  );
}
