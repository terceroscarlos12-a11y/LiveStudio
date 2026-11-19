const CACHE_NAME = "livestudio-v11";
const ARCHIVOS_CACHE = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.json",
  "./css/style.css",
  "./js/app.js",
  "./js/storage.js",
  "./img/icon-192.png",
  "./img/icon-512.png",
  "./img/logo.header.svg",
  "./img/logo-vertical.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(
        nombres
          .filter((nombre) => nombre !== CACHE_NAME)
          .map((nombre) => caches.delete(nombre))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((respuestaCache) => {
      return respuestaCache || fetch(event.request).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("./offline.html");
        }
      });
    })
  );
});
