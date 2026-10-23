// Builds the site that stays at the old address, https://nabeelmehmood.github.io/gridshot/, and
// forwards every visit to https://nabeelmehmood.github.io/fpsdojo/. It is published to the old
// `gridshot` repo's Pages with `npm run deploy:redirect`; nothing in it is part of the app.
//
// Both addresses are on nabeelmehmood.github.io, so players' saved data (username, bests, history,
// settings) is already there on arrival; nothing needs handing over.
//
// - index.html and one page per mode: a real 200 page with a canonical link and an instant meta
//   refresh (which Google treats as a permanent redirect), plus a JS redirect that keeps the query
//   (?mode=skeet) and #part.
// - 404.html: GitHub Pages serves it for any other old path; it maps /gridshot/<path> to /fpsdojo/<path>.
// - sw.js: replaces the old service worker for returning players, deleting its cache and unregistering,
//   so nobody keeps getting a cached copy of the old app.
import { copyFileSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';

const NEW_SITE = 'https://nabeelmehmood.github.io/fpsdojo/';
const STILL_SERVED = ['og-image.png', 'favicon.ico', 'favicon.svg'];
const OUT = new URL('../dist-redirect/', import.meta.url);
const MODE_PAGES = new URL('../public/modes/', import.meta.url);

const escape = value => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// `script` computes the address to go to; `target` is the static fallback for crawlers and no-JS.
function page(target, script, { notFound = false } = {}) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Gridshot is now FPS Dojo</title>
    ${notFound ? '' : `<link rel="canonical" href="${escape(target)}" />\n    `}<meta http-equiv="refresh" content="0; url=${escape(target)}" />
    <script>
      location.replace(${script} + location.search + location.hash);
    </script>
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0d1017; color: #e6e9ef; font: 16px system-ui, sans-serif; }
      a { color: #ffcf33; }
    </style>
  </head>
  <body>
    <p>Gridshot is now <a href="${escape(target)}">FPS Dojo</a>. Taking you there…</p>
  </body>
</html>
`;
}

const SERVICE_WORKER = `// The site moved to ${NEW_SITE}. This replaces the old service worker for returning players:
// it deletes the old cache and unregisters itself, so the redirect is never skipped.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('gridshot')).map(key => caches.delete(key))))
      .then(() => self.registration.unregister())
  );
});
`;

const modes = readdirSync(MODE_PAGES, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name);
if (!modes.length) throw new Error('No mode pages found; run `npm run pages` first.');

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
writeFileSync(new URL('index.html', OUT), page(NEW_SITE, JSON.stringify(NEW_SITE)));
for (const mode of modes) {
  const target = `${NEW_SITE}modes/${mode}/`;
  const dir = new URL(`modes/${mode}/`, OUT);
  mkdirSync(dir, { recursive: true });
  writeFileSync(new URL('index.html', dir), page(target, JSON.stringify(target)));
}
const samePathOnNewSite = `${JSON.stringify(NEW_SITE)} + location.pathname.replace(/^\\/gridshot\\/?/, '')`;
writeFileSync(new URL('404.html', OUT), page(NEW_SITE, samePathOnNewSite, { notFound: true }));
writeFileSync(new URL('sw.js', OUT), SERVICE_WORKER);
// Links shared before the move still show their preview image and icon.
for (const file of STILL_SERVED) copyFileSync(new URL(`../public/${file}`, import.meta.url), new URL(file, OUT));
console.log(`Wrote the redirect site (home, ${modes.length} mode pages, 404, sw.js and preview images) to dist-redirect/.`);
