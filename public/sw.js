/* 6·25 전쟁 전투 상황도 — 오프라인 캐시 서비스워커 */
// __SW_VERSION__ 은 빌드 시 vite.config.ts의 swVersionPlugin이 실제 값(git short
// sha 또는 타임스탬프)으로 치환한다. dev 서버는 public/sw.js를 가공 없이 그대로
// 서빙하므로 플레이스홀더가 살아남는데, 그 경우엔 'dev'로 폴백한다.
const RAW_VERSION = '__SW_VERSION__';
const VERSION = RAW_VERSION.startsWith('__') ? 'dev' : RAW_VERSION;
const CACHE = 'kwatlas-' + VERSION;
const CORE = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg', '/og.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(CORE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // 교차 출처(폰트 CDN 등)는 서비스워커가 건드리지 않는다
  if (url.origin !== self.location.origin) return;

  // SPA 내비게이션: 네트워크 우선, 실패 시 캐시된 셸
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('/index.html')));
    return;
  }

  // 그 외 정적 자원: 캐시 우선, 없으면 네트워크 후 캐시 적재
  e.respondWith(
    caches.match(req).then((cached) => {
      const fetched = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(req, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetched;
    }),
  );
});
