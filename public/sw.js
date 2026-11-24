/* global self, importScripts, caches, Request, URL, fetch */
importScripts('./shell-files.js');

const { version, files } = self.trainingShell;
const prefix = 'trainingapp-shell:' + self.registration.scope + ':';
const cacheName = prefix + version;
const shell = new URL('index.html', self.registration.scope).href;
const urls = new Set(files.map(({ path }) => new URL(path, self.registration.scope).href));

self.addEventListener('install', event => {
  // The build supplies integrity hashes for the shell and its exact dependencies.
  const requests = files.map(({ path, integrity }) =>
    new Request(new URL(path, self.registration.scope), {
      cache: 'reload', credentials: 'omit', redirect: 'error', integrity,
    }),
  );
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(requests)));
});

self.addEventListener('activate', event => {
  // Default waiting lifecycle keeps an open session on its original release.
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(prefix) && key !== cacheName)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('authorization')) return;

  const url = request.url;
  // In-page links still refer to the cached start document when reloaded.
  const isStart = request.mode === 'navigate' && url.split('#', 1)[0] === self.registration.scope;
  if (!isStart && !urls.has(url)) return;

  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    return (await cache.match(isStart ? shell : url)) ?? fetch(request);
  })());
});
