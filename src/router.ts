import { useSyncExternalStore } from 'react';

/**
 * 수제 라우터 — 화면이 2종(목록 `/`, 전투 `/b/:battleId`)뿐이라 라이브러리 없이.
 * 쿼리(`?day=&event=`)는 전투 화면 내부에서 직접 다룬다(라우트 판정엔 경로만 사용).
 */
export type Route = { kind: 'index' } | { kind: 'battle'; id: string };

const normalizePath = (loc: Location = window.location): string =>
  (loc.pathname.replace(/\/+$/, '') || '/');

export function parseRoute(loc: Location = window.location): Route {
  const path = normalizePath(loc);
  const m = path.match(/^\/b\/([^/]+)$/);
  if (m) return { kind: 'battle', id: decodeURIComponent(m[1]) };
  return { kind: 'index' };
}

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

/** pushState + 구독자 통지 */
export function navigate(path: string): void {
  window.history.pushState(null, '', path);
  notify();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  window.addEventListener('popstate', cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('popstate', cb);
  };
}

/** 라우트 변화에 반응하는 스냅샷 — 경로 문자열이 바뀌면 리렌더 */
const getSnapshot = () => normalizePath();

export function useRoute(): Route {
  useSyncExternalStore(subscribe, getSnapshot, () => '/');
  return parseRoute();
}

/**
 * 구형 링크 하위호환: `/?day=0627&event=...`(또는 index.html) 감지 시
 * `/b/chuncheon?...`로 replaceState 후 라우팅에 넘긴다. 최초 1회, 렌더 전에 호출.
 */
export function applyLegacyRedirect(): void {
  if (typeof window === 'undefined') return;
  const loc = window.location;
  const path = normalizePath(loc);
  const isIndex = path === '/' || path.endsWith('/index.html');
  if (!isIndex) return;
  const p = new URLSearchParams(loc.search);
  if (p.has('day') || p.has('event')) {
    window.history.replaceState(null, '', `/b/chuncheon${loc.search}`);
  }
}
