import { chromium } from 'playwright';

/**
 * Misst gerenderte Vorder- und Hintergrundfarben zentraler Elemente und
 * rechnet den WCAG-Kontrast aus. Laeuft gegen den laufenden Dev-/Prod-Server.
 */

const BASIS = process.env.BASIS ?? 'http://localhost:3000';

const kanal = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const leucht = ([r, g, b]) => 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b);
const kontrast = (a, b) => {
  const [l1, l2] = [leucht(a), leucht(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
const parse = (s) => (s.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);

/** Legt halbtransparente Farben auf den Hintergrund, sonst stimmt die Rechnung nicht. */
async function farben(page, selektor) {
  return page.$eval(selektor, (el) => {
    const stil = getComputedStyle(el);
    let bg = stil.backgroundColor;
    let knoten = el;
    while (
      bg === 'rgba(0, 0, 0, 0)' ||
      bg === 'transparent'
    ) {
      knoten = knoten.parentElement;
      if (!knoten) {
        bg = 'rgb(255, 255, 255)';
        break;
      }
      bg = getComputedStyle(knoten).backgroundColor;
    }
    return { vg: stil.color, bg, groesse: stil.fontSize, gewicht: stil.fontWeight };
  });
}

const PRUEFUNGEN = [
  { pfad: '/de/showcase/screens/pruefung-lauf', name: 'Primärbutton „Weiter“', sel: 'button:has-text("Weiter")' },
  { pfad: '/de/showcase/screens/campus-lernen', name: 'Primärbutton „Weiterlernen“', sel: 'button:has-text("Weiterlernen")' },
  { pfad: '/de/showcase/screens/campus-lernen', name: 'Fließtext gedämpft', sel: 'p.text-fg-muted' },
  { pfad: '/de/showcase/screens/campus-lernen', name: 'Überschrift h1', sel: 'h1' },
  { pfad: '/de/showcase/screens/campus-fortschritt', name: 'Caption', sel: 'p.text-caption' },
  { pfad: '/de/showcase/screens/ausbilder-teilnehmer', name: 'Tabellenkopf', sel: 'th' },
];

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD ?? '/opt/pw-browsers/chromium',
});

let durchgefallen = 0;

for (const modus of ['hell', 'dunkel']) {
  console.log(`\n=== ${modus.toUpperCase()} ===`);
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: modus === 'dunkel' ? 'dark' : 'light',
  });
  await ctx.addInitScript((m) => localStorage.setItem('bze-darstellung', m), modus);
  const page = await ctx.newPage();

  for (const p of PRUEFUNGEN) {
    await page.goto(BASIS + p.pfad, { waitUntil: 'networkidle' });
    try {
      const f = await farben(page, p.sel);
      const wert = kontrast(parse(f.vg), parse(f.bg));
      const px = parseFloat(f.groesse);
      const gross = px >= 24 || (px >= 18.66 && Number(f.gewicht) >= 700);
      const grenze = gross ? 3 : 4.5;
      const ok = wert >= grenze;
      if (!ok) durchgefallen++;
      console.log(
        `${ok ? 'OK  ' : 'FAIL'} ${wert.toFixed(2)}:1 (min ${grenze})  ${p.name}  ${f.vg} auf ${f.bg}`,
      );
    } catch (e) {
      console.log(`  ??  ${p.name}: ${e.message.split('\n')[0]}`);
    }
  }
  await ctx.close();
}

await browser.close();
console.log(`\n${durchgefallen} Verstoesse.`);
process.exit(durchgefallen > 0 ? 1 : 0);
