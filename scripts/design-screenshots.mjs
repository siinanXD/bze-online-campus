import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASIS = 'http://localhost:3000';
const AUS = process.argv[2] ?? './shots';
fs.mkdirSync(AUS, { recursive: true });

// Echte, oeffentlich erreichbare Routen
const ECHT = [
  ['marketing', '/de', 'Startseite (Marketing)'],
  ['login', '/de/login', 'Anmelden'],
  ['impressum', '/de/impressum', 'Impressum'],
  ['datenschutz', '/de/datenschutz', 'Datenschutz'],
  ['showcase', '/de/showcase', 'Designsystem'],
  ['screens-index', '/de/showcase/screens', 'Screen-Übersicht'],
];

// Entwuerfe der auth-geschuetzten Screens
const ENTWURF = [
  ['campus-lernen', 'Startseite Teilnehmende'],
  ['campus-topic', 'Fachkunde lesen'],
  ['pruefung-start', 'Prüfung — Start'],
  ['pruefung-lauf', 'Prüfung — laufend'],
  ['pruefung-ergebnis', 'Prüfung — Ergebnis'],
  ['campus-fortschritt', 'Fortschritt'],
  ['campus-berichtsheft', 'Berichtsheft'],
  ['campus-mehr', 'Mehr und Einstellungen'],
  ['ausbilder-teilnehmer', 'Teilnehmendenliste'],
  ['ausbilder-review', 'Review-Warteschlange'],
  ['ausbilder-review-leer', 'Review — Leerzustand'],
  ['ausbilder-kohorte', 'Kohortenübersicht'],
  ['admin-nutzer', 'Nutzerverwaltung'],
  ['admin-audit', 'Audit-Log'],
];

const ZIELE = [
  ...ECHT.map(([slug, pfad, titel]) => ({ slug, pfad, titel, art: 'echt' })),
  ...ENTWURF.map(([slug, titel]) => ({
    slug,
    pfad: `/de/showcase/screens/${slug}`,
    titel,
    art: 'entwurf',
  })),
];

const VIEWPORTS = [
  { name: 'mobil', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
];

const browser = await chromium.launch({
  // Vorinstalliertes Chromium der Umgebung; die npm-Version wuerde einen
  // anderen Build erwarten und ihn herunterladen wollen.
  executablePath: process.env.CHROMIUM_PFAD ?? '/opt/pw-browsers/chromium',
});
const ergebnis = [];

for (const { name, width, height } of VIEWPORTS) {
  for (const modus of ['hell', 'dunkel']) {
    const ctx = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 2,
      colorScheme: modus === 'dunkel' ? 'dark' : 'light',
      locale: 'de-DE',
      reducedMotion: 'reduce',
    });
    // Darstellung fest setzen, damit das Inline-Skript nicht die Systemwahl nimmt
    await ctx.addInitScript(
      (m) => window.localStorage.setItem('bze-darstellung', m),
      modus,
    );

    const page = await ctx.newPage();

    for (const ziel of ZIELE) {
      const datei = `${ziel.slug}--${name}--${modus}.png`;
      try {
        const resp = await page.goto(BASIS + ziel.pfad, {
          waitUntil: 'networkidle',
          timeout: 30000,
        });
        await page.waitForTimeout(350);
        const status = resp?.status() ?? 0;
        // Auf schmalen Viewports nur den Ausschnitt aufnehmen: die untere
        // Navigation ist `fixed` und landet bei fullPage mitten im Inhalt.
        await page.screenshot({
          path: path.join(AUS, datei),
          fullPage: name !== 'mobil',
        });
        ergebnis.push({ ...ziel, viewport: name, modus, datei, status });
        console.log(`${status}  ${name}/${modus}  ${ziel.slug}`);
      } catch (e) {
        console.log(`FEHLER ${name}/${modus} ${ziel.slug}: ${e.message}`);
        ergebnis.push({ ...ziel, viewport: name, modus, datei: null, status: -1 });
      }
    }
    await ctx.close();
  }
}

await browser.close();
fs.writeFileSync(path.join(AUS, 'index.json'), JSON.stringify(ergebnis, null, 2));
console.log(`\n${ergebnis.filter((r) => r.status === 200).length} Aufnahmen erstellt.`);
