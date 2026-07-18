import type { BattleMeta } from '../../../types';

/** planned.ts에서 이관 — bbox·cartouche·intro·relief는 저작하며 확정한다. */
export const kumsongMeta: BattleMeta = {
  id: "kumsong",
  name: { ko: "금성 전투", en: "Battle of Kumsong" },
  phase: "stalemate",
  dateRange: { start: "1953-07-13", end: "1953-07-19" },
  marker: [127.62,38.38],
  summary: "정전협정 체결 직전 중공군이 금성 지구 국군 전선을 대상으로 벌인 최후의 대규모 공세로, 국군 여러 사단이 밀려 전선이 남쪽으로 후퇴했다. 정전 발효 직전까지 공방이 이어져 6·25전쟁 최후의 대규모 전투로 꼽힌다.",
  status: 'planned', // 저작 완료 후 'available'
  // TODO: 전투 정면이 화면 과반을 차지하도록 프레이밍 (스타일 표준 §프레이밍)
  // bbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // TODO: bbox보다 넓게 — relief:make가 이 범위로 래스터를 만든다
  // reliefBbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // relief: { light: '/relief/kumsong-light.webp', dark: '/relief/kumsong-dark.webp' },
  // cartouche: { title: '금성 전투 상황도', en: '...', sub: '군 작전상황도(도식) · ...' },
  // intro: { headline: '금성 전투', body: '— ... —' },
  // inset: { label: '...' },
};
