// ═══ sw.js — 서비스 워커 (PWA 설치가능 + 오프라인 셸)
// 전략: 네트워크 우선 → 실패 시 캐시. 온라인이면 항상 최신을 받으므로 "새 버전 안 받는" 캐시 함정 없음.
//       (기존 새 버전 배너/ must-revalidate 와도 충돌 없음). 오프라인일 때만 캐시로 게임이 뜸.
const CACHE = 'bokdong-shell-v1';
const SHELL = [
  './', './index.html',
  './src/analytics.js', './src/data.js', './src/render.js', './src/logic.js', './src/cloud.js', './src/boot.js',
  './src/style.css',
  './manifest.json', './assets/icon-192.png', './assets/icon-512.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL).catch(() => {})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;                 // POST 등(Supabase 제출)은 그대로
  let url; try { url = new URL(req.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return;  // 크로스오리진(Supabase·CDN 폰트)은 브라우저 기본 처리
  // 네트워크 우선: 성공하면 최신 반환 + 캐시 갱신, 실패(오프라인)하면 캐시 → 없으면 셸 index로 폴백
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) { const clone = res.clone(); caches.open(CACHE).then((c) => c.put(req, clone)); }
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
  );
});
