const CACHE_PREFIX = "holoo-onboarding-offline-";
const CACHE_NAME = CACHE_PREFIX + "v1";
const OFFLINE_URL = "/offline.html";
const LOGO_URL = "/holooFavIcon.png";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(
        [OFFLINE_URL, LOGO_URL].map(
          (url) => new Request(url, { cache: "reload", credentials: "omit" }),
        ),
      ),
    ),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      ),
    ),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    request.headers.has("authorization") ||
    request.headers.has("range")
  ) {
    return;
  }

  const isNavigation = request.mode === "navigate";
  const isLogo = url.pathname === LOGO_URL && !url.search;
  if (!isNavigation && !isLogo) {
    return;
  }

  event.respondWith(
    fetch(request).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      const fallback = await cache.match(isNavigation ? OFFLINE_URL : LOGO_URL);
      return fallback || new Response("Offline", { status: 503 });
    }),
  );
});
