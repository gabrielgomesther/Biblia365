const CACHE_PREFIX = "biblia-cronologica-static-";
const CACHE_NAME = `${CACHE_PREFIX}__BUILD_ID__`;
const PRECACHE_MANIFEST = "precache-manifest.json";

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const scopeUrl = self.registration.scope;
    const manifestUrl = new URL(PRECACHE_MANIFEST, scopeUrl);
    const response = await fetch(manifestUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Não foi possível carregar a lista de arquivos offline.");
    const { files = [] } = await response.json();
    const cache = await caches.open(CACHE_NAME);
    const urls = [...new Set(files.map((file) => new URL(file, scopeUrl).href))];
    await cache.addAll(urls);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  const scopeUrl = new URL(self.registration.scope);
  if (requestUrl.origin !== scopeUrl.origin || !requestUrl.pathname.startsWith(scopeUrl.pathname)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok && response.type === "basic") await cache.put(request, response.clone());
      return response;
    } catch (error) {
      if (request.mode === "navigate") {
        const shell = await cache.match(new URL("index.html", scopeUrl).href);
        if (shell) return shell;
      }
      throw error;
    }
  })());
});
