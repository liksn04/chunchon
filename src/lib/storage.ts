/**
 * localStorage 접근 — 전쟁 전체 앱 공통 접두사 `kwatlas-`.
 * 전역 키: theme / lang / onboarded (코치마크는 전투 공통이라 1회만).
 * 전투별 키: introseen:<battleId>.
 * 구 `chuncheon1950-*` 값은 최초 1회 마이그레이션한다.
 */
const PREFIX = 'kwatlas-';

/** 구 키 → 신 키 1회 마이그레이션 표 (신 키는 접두사 포함 전체) */
const MIGRATIONS: readonly [oldKey: string, newKey: string][] = [
  ['chuncheon1950-theme', `${PREFIX}theme`],
  ['chuncheon1950-lang', `${PREFIX}lang`],
  ['chuncheon1950-onboarded', `${PREFIX}onboarded`],
  ['chuncheon1950-introseen', `${PREFIX}introseen:chuncheon`],
];

let migrated = false;
function migrateOnce(): void {
  if (migrated || typeof window === 'undefined') return;
  migrated = true;
  for (const [oldKey, newKey] of MIGRATIONS) {
    try {
      if (window.localStorage.getItem(newKey) === null) {
        const old = window.localStorage.getItem(oldKey);
        if (old !== null) window.localStorage.setItem(newKey, old);
      }
    } catch {
      /* localStorage 불가 환경 */
    }
  }
}

migrateOnce();

/** 접두사(kwatlas-)를 붙여 읽기. key는 접두사 없는 부분 (예: 'theme', 'introseen:chuncheon') */
export function getStored(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

/** 접두사(kwatlas-)를 붙여 쓰기 */
export function setStored(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PREFIX + key, value);
  } catch {
    /* noop */
  }
}
