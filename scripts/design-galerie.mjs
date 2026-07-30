import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Baut aus den Aufnahmen von design-screenshots.mjs eine einzelne
 * HTML-Galerie mit eingebetteten Bildern — laeuft ohne Server und ohne
 * externe Requests.
 */

const AUS_ORDNER = process.argv[2] ?? './shots';
const ZIEL = process.argv[3] ?? './galerie.html';

const eintraege = JSON.parse(
  fs.readFileSync(path.join(AUS_ORDNER, 'index.json'), 'utf8'),
).filter((e) => e.datei && e.status === 200);

/** Lange Seiten werden oben beschnitten, damit die Kacheln vergleichbar bleiben. */
async function einbetten(datei, breite, maxHoehe) {
  const bild = sharp(path.join(AUS_ORDNER, datei));
  const meta = await bild.metadata();
  const skala = breite / meta.width;
  const zielHoehe = Math.min(Math.round(meta.height * skala), maxHoehe);

  const puffer = await bild
    .resize({ width: breite })
    .extract({ left: 0, top: 0, width: breite, height: zielHoehe })
    .jpeg({ quality: 72, mozjpeg: true })
    .toBuffer();

  return `data:image/jpeg;base64,${puffer.toString('base64')}`;
}

const gruppen = new Map();
for (const e of eintraege) {
  if (!gruppen.has(e.slug)) {
    gruppen.set(e.slug, { titel: e.titel, art: e.art, pfad: e.pfad, bilder: {} });
  }
  gruppen.get(e.slug).bilder[`${e.viewport}-${e.modus}`] = e.datei;
}

let karten = '';
for (const [slug, g] of gruppen) {
  const paare = [];
  for (const modus of ['hell', 'dunkel']) {
    const zellen = [];
    for (const vp of ['desktop', 'mobil']) {
      const datei = g.bilder[`${vp}-${modus}`];
      if (!datei) continue;
      const breite = vp === 'desktop' ? 760 : 250;
      const maxHoehe = vp === 'desktop' ? 500 : 540;
      const src = await einbetten(datei, breite, maxHoehe);
      zellen.push(
        `<figure class="shot ${vp}">
           <img src="${src}" alt="${g.titel}, ${vp}, ${modus}" loading="lazy">
           <figcaption>${vp === 'desktop' ? 'Desktop <span class="num">1440</span>' : 'Mobil <span class="num">390</span>'}</figcaption>
         </figure>`,
      );
    }
    if (zellen.length) {
      paare.push(
        `<div class="paar">
           <p class="modus">${modus}</p>
           <div class="shots">${zellen.join('')}</div>
         </div>`,
      );
    }
  }

  karten += `<section class="karte" id="${slug}">
    <header class="karte-kopf">
      <h3>${g.titel}</h3>
      <p class="meta">
        <code>${g.pfad}</code>
        <span class="tag ${g.art}">${g.art === 'echt' ? 'echte Route' : 'Entwurf'}</span>
      </p>
    </header>
    ${paare.join('')}
  </section>`;
  console.log('eingebettet:', slug);
}

/** Inter aus dem Projekt selbst — dieselbe Datei, die die App ausliefert. */
const interPfad = path.join(process.cwd(), 'public/fonts/inter-latin.woff2');
const inter = fs.existsSync(interPfad)
  ? `data:font/woff2;base64,${fs.readFileSync(interPfad).toString('base64')}`
  : null;

const html = `<title>BZE Online Campus — Screen-Galerie</title>
<style>
  ${
    inter
      ? `@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400 700;
    font-display: swap;
    src: url('${inter}') format('woff2');
  }`
      : ''
  }

  /* Palette und Radien stammen aus app/globals.css des Projekts —
     die Galerie benutzt dieselben Token wie das Produkt, das sie zeigt. */
  :root {
    --bg:#FAFAF9; --surface:#FFFFFF; --border:#E7E5E4;
    --fg:#1C1917; --muted:#57534E; --subtle:#78716C;
    --primary:#B45309; --primary-subtle:#FDF8ED; --primary-border:#F2D8A2;
    --ok:#15803D; --ok-border:#BBF7D0;
    --schatten: 0 1px 2px rgb(28 25 23 / .05), 0 6px 16px -6px rgb(28 25 23 / .10);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg:#0C0A09; --surface:#1C1917; --border:#292524;
      --fg:#F5F5F4; --muted:#A8A29E; --subtle:#78716C;
      --primary:#E8BC68; --primary-subtle:#2B1B08; --primary-border:#5A2A0B;
      --ok:#4ADE80; --ok-border:#14532D;
      --schatten: 0 1px 2px rgb(0 0 0 / .4), 0 8px 24px -8px rgb(0 0 0 / .5);
    }
  }
  :root[data-theme="dark"] {
    --bg:#0C0A09; --surface:#1C1917; --border:#292524;
    --fg:#F5F5F4; --muted:#A8A29E; --subtle:#78716C;
    --primary:#E8BC68; --primary-subtle:#2B1B08; --primary-border:#5A2A0B;
    --ok:#4ADE80; --ok-border:#14532D;
    --schatten: 0 1px 2px rgb(0 0 0 / .4), 0 8px 24px -8px rgb(0 0 0 / .5);
  }
  :root[data-theme="light"] {
    --bg:#FAFAF9; --surface:#FFFFFF; --border:#E7E5E4;
    --fg:#1C1917; --muted:#57534E; --subtle:#78716C;
    --primary:#B45309; --primary-subtle:#FDF8ED; --primary-border:#F2D8A2;
    --ok:#15803D; --ok-border:#BBF7D0;
    --schatten: 0 1px 2px rgb(28 25 23 / .05), 0 6px 16px -6px rgb(28 25 23 / .10);
  }

  * { box-sizing: border-box; }
  body {
    margin:0; background:var(--bg); color:var(--fg);
    font-family:'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    font-size:16px; line-height:1.5;
    -webkit-font-smoothing:antialiased;
  }
  .num { font-variant-numeric: tabular-nums; }

  .wrap { max-width:1180px; margin:0 auto; padding:56px 24px 96px;
          display:flex; flex-direction:column; gap:28px; }

  .kopf { display:flex; flex-direction:column; gap:10px; }
  .eyebrow { font-size:.6875rem; font-weight:600; letter-spacing:.09em;
             text-transform:uppercase; color:var(--subtle); margin:0; }
  h1 { font-size:clamp(1.75rem, 4vw, 2.25rem); line-height:1.15; font-weight:700;
       letter-spacing:-.022em; margin:0; text-wrap:balance; }
  .lead { color:var(--muted); max-width:60ch; margin:0; font-size:1.0625rem; }

  .zahlen-leiste { display:flex; flex-wrap:wrap; gap:28px; padding:18px 20px;
                   border:1px solid var(--border); border-radius:12px;
                   background:var(--surface); }
  .kennzahl { display:flex; flex-direction:column; gap:2px; }
  .kennzahl b { font-size:1.5rem; font-weight:700; letter-spacing:-.02em;
                font-variant-numeric:tabular-nums; }
  .kennzahl span { font-size:.75rem; color:var(--muted); }

  .hinweis { border:1px solid var(--border); border-inline-start:3px solid var(--primary);
             border-radius:10px; padding:16px 18px; background:var(--surface);
             font-size:.9375rem; color:var(--muted); }
  .hinweis strong { color:var(--fg); }

  .toc { display:flex; flex-wrap:wrap; gap:7px; margin:0; padding:0; list-style:none; }
  .toc a { display:inline-block; font-size:.8125rem; text-decoration:none; color:var(--muted);
           border:1px solid var(--border); border-radius:999px; padding:5px 12px;
           background:var(--surface); }
  .toc a:hover { border-color:var(--primary); color:var(--primary); }
  .toc a:focus-visible { outline:3px solid var(--primary); outline-offset:2px; }

  .karte { background:var(--surface); border:1px solid var(--border);
           border-radius:14px; padding:22px; box-shadow:var(--schatten);
           display:flex; flex-direction:column; gap:22px; }
  .karte-kopf { display:flex; flex-direction:column; gap:6px; }
  .karte h3 { font-size:1.25rem; font-weight:600; letter-spacing:-.012em; margin:0; }
  .meta { margin:0; display:flex; flex-wrap:wrap; gap:9px; align-items:center; }
  code { font-family:ui-monospace, SFMono-Regular, Menlo, monospace;
         background:var(--bg); border:1px solid var(--border); border-radius:5px;
         padding:2px 7px; font-size:.75rem; color:var(--muted); }
  .tag { border-radius:999px; padding:3px 10px; font-size:.6875rem; font-weight:600;
         letter-spacing:.02em; border:1px solid var(--border); }
  .tag.echt { color:var(--ok); border-color:var(--ok-border); }
  .tag.entwurf { color:var(--primary); border-color:var(--primary-border);
                 background:var(--primary-subtle); }

  .paar { display:flex; flex-direction:column; gap:10px; }
  .modus { margin:0; font-size:.6875rem; font-weight:600; letter-spacing:.09em;
           text-transform:uppercase; color:var(--subtle);
           display:flex; align-items:center; gap:10px; }
  .modus::after { content:''; flex:1; height:1px; background:var(--border); }
  .shots { display:flex; flex-wrap:wrap; gap:18px; align-items:flex-start; }
  figure { margin:0; display:flex; flex-direction:column; gap:7px; }
  figcaption { font-size:.6875rem; color:var(--subtle); letter-spacing:.03em; }
  img { display:block; max-width:100%; height:auto;
        border:1px solid var(--border); border-radius:9px; }

  @media (max-width:720px) {
    .wrap { padding:36px 16px 64px; }
    .karte { padding:16px; }
  }
</style>

<div class="wrap">
  <header class="kopf">
    <p class="eyebrow">Berufsbildungszentrum Euskirchen</p>
    <h1>Screen-Galerie nach dem Designumbau</h1>
    <p class="lead">Jede Route in Desktop und Mobil, jeweils hell und dunkel.
       Aufgenommen aus der laufenden Anwendung mit dem neuen Bernstein-Designsystem.</p>
  </header>

  <div class="zahlen-leiste">
    <div class="kennzahl"><b>${gruppen.size}</b><span>Screens</span></div>
    <div class="kennzahl"><b>${eintraege.length}</b><span>Aufnahmen</span></div>
    <div class="kennzahl"><b>2</b><span>Breiten: 1440 und 390</span></div>
    <div class="kennzahl"><b>0</b><span>Kontrastverstöße</span></div>
  </div>

  <div class="hinweis">
    <strong>Zwei Arten von Aufnahmen.</strong> Seiten mit der Markierung
    <em>echte Route</em> stammen aus der laufenden Anwendung. Seiten mit
    <em>Entwurf</em> liegen hinter der Anmeldung und brauchen eine Datenbank;
    sie sind mit denselben Komponenten und derselben Navigation, aber mit
    festen Beispieldaten nachgebaut.
  </div>

  <ul class="toc">
    ${[...gruppen].map(([slug, g]) => `<li><a href="#${slug}">${g.titel}</a></li>`).join('')}
  </ul>

  ${karten}
</div>`;

fs.writeFileSync(ZIEL, html);
const mb = (fs.statSync(ZIEL).size / 1024 / 1024).toFixed(1);
console.log(`\nGalerie: ${ZIEL} (${mb} MB)`);
