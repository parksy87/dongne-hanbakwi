const CACHE_NAME = "dongne-hanbakwi-v1";
const STATIC_ASSETS = [
  "/",
  "/login",
  "/records",
  "/ranking",
  "/mypage",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/daily-quote-bg/01.jpg",
  "/daily-quote-bg/02.jpg",
  "/daily-quote-bg/03.jpg",
  "/daily-quote-bg/04.jpg",
  "/daily-quote-bg/05.jpg",
  "/daily-quote-bg/06.jpg",
  "/daily-quote-bg/07.jpg",
  "/daily-quote-bg/08.jpg",
  "/daily-quote-bg/09.jpg",
  "/daily-quote-bg/10.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);

      return cached || fetched;
    })
  );
});
