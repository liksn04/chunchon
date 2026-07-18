import type { BattleMeta } from '../../../types';

/** planned.ts에서 이관 — bbox·cartouche·intro·relief는 저작하며 확정한다. */
export const sniperRidgeMeta: BattleMeta = {
  id: "sniper-ridge",
  name: { ko: "저격능선 전투", en: "Battle of Sniper Ridge" },
  phase: "stalemate",
  dateRange: { start: "1952-10-14", end: "1952-11-24" },
  marker: [127.47,38.33],
  summary: "강원도 김화 오성산 남쪽 저격능선(597고지)을 두고 국군 제2사단과 중공군이 약 40일간 반복적인 쟁탈전을 벌인 고지전이다. 협소한 능선을 놓고 밀고 밀리는 공방이 이어지며 양측 모두 큰 손실을 입었다.",
  status: 'planned', // 저작 완료 후 'available'
  // TODO: 전투 정면이 화면 과반을 차지하도록 프레이밍 (스타일 표준 §프레이밍)
  // bbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // TODO: bbox보다 넓게 — relief:make가 이 범위로 래스터를 만든다
  // reliefBbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // relief: { light: '/relief/sniper-ridge-light.webp', dark: '/relief/sniper-ridge-dark.webp' },
  // cartouche: { title: '저격능선 전투 상황도', en: '...', sub: '군 작전상황도(도식) · ...' },
  // intro: { headline: '저격능선 전투', body: '— ... —' },
  // inset: { label: '...' },
};
