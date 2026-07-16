import type { BattleData, BattleMeta } from '../types';
import { makeBundle, type BattleBundle } from './bundle';
import { chuncheonMeta } from '../data/battles/chuncheon/meta';

/** 목록·마커용 메타는 eager 로드 (Stage 3에서 planned 전투 추가) */
export const battleMetas: BattleMeta[] = [chuncheonMeta];

/** id → 메타 조회 */
export const battleById = new Map(battleMetas.map((m) => [m.id, m]));

/** id → 전투 데이터 dynamic import. planned 전투는 로더 없음 */
const loaders: Record<string, () => Promise<BattleData>> = {
  chuncheon: () => import('../data/battles/chuncheon').then((m) => m.battle),
};

/** 전투 데이터를 로드해 번들로 조립 */
export async function loadBattle(id: string): Promise<BattleBundle> {
  const load = loaders[id];
  if (!load) throw new Error(`Unknown or unavailable battle: ${id}`);
  const data = await load();
  return makeBundle(data);
}
