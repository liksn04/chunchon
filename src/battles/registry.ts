import type { BattleData, BattleMeta } from '../types';
import { makeBundle, type BattleBundle } from './bundle';
import { chuncheonMeta } from '../data/battles/chuncheon/meta';
import { hangangLineMeta } from '../data/battles/hangang-line/meta';
import { daejeonMeta } from '../data/battles/daejeon/meta';
import { dabudongMeta } from '../data/battles/dabudong/meta';
import { pohangAngangMeta } from '../data/battles/pohang-angang/meta';
import { incheonMeta } from '../data/battles/incheon/meta';
import { seoulRecaptureMeta } from '../data/battles/seoul-recapture/meta';
import { unsanMeta } from '../data/battles/unsan/meta';
import { jangjinhoMeta } from '../data/battles/jangjinho/meta';
import { hungnamMeta } from '../data/battles/hungnam/meta';
import { jipyeongriMeta } from '../data/battles/jipyeongri/meta';
import { hyeonriMeta } from '../data/battles/hyeonri/meta';
import { yongmunsanMeta } from '../data/battles/yongmunsan/meta';
import { baengmagojiMeta } from '../data/battles/baengmagoji/meta';
import { sniperRidgeMeta } from '../data/battles/sniper-ridge/meta';
import { kumsongMeta } from '../data/battles/kumsong/meta';

/**
 * 목록·마커용 메타는 eager 로드. 시간순(개전→정전) 정렬 — 목록·지도 표시 순서의 기준.
 * 모든 전투가 표준 폴더(src/data/battles/<id>/)를 가지며, 저작이 끝난 전투만
 * 아래 loaders에 등록하고 meta.status를 'available'로 바꾼다.
 */
export const battleMetas: BattleMeta[] = [
  chuncheonMeta,
  hangangLineMeta,
  daejeonMeta,
  dabudongMeta,
  pohangAngangMeta,
  incheonMeta,
  seoulRecaptureMeta,
  unsanMeta,
  jangjinhoMeta,
  hungnamMeta,
  jipyeongriMeta,
  hyeonriMeta,
  yongmunsanMeta,
  baengmagojiMeta,
  sniperRidgeMeta,
  kumsongMeta,
];

/** id → 메타 조회 */
export const battleById = new Map(battleMetas.map((m) => [m.id, m]));

/** id → 전투 데이터 dynamic import. planned 전투는 로더 없음 */
const loaders: Record<string, () => Promise<BattleData>> = {
  chuncheon: () => import('../data/battles/chuncheon').then((m) => m.battle),
  dabudong: () => import('../data/battles/dabudong').then((m) => m.battle),
};

/** 전투 데이터를 로드해 번들로 조립 */
export async function loadBattle(id: string): Promise<BattleBundle> {
  const load = loaders[id];
  if (!load) throw new Error(`Unknown or unavailable battle: ${id}`);
  const data = await load();
  return makeBundle(data);
}
