import { useBattleStore } from '../store/useBattleStore';
import { strings, type Lang } from './strings';

export type { Lang };

/** 비훅 환경(모듈 함수)용 번역기 — 현재 언어를 스토어에서 읽는다 */
export function tGet(key: string): string {
  const lang = useBattleStore.getState().lang;
  return strings[key]?.[lang] ?? key;
}

/** 컴포넌트용 훅 — 언어 변경 시 리렌더 */
export function useT() {
  const lang = useBattleStore((s) => s.lang);
  return (key: string): string => strings[key]?.[lang] ?? key;
}
