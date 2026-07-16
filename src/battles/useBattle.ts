import { useBattleStore } from '../store/useBattleStore';

/** 로드된 전투 번들을 읽는 훅. 번들 로드 이후에만 렌더되는 곳에서 사용. */
export const useBattle = () => useBattleStore((s) => s.battle!);
