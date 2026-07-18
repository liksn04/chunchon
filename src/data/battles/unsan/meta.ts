import type { BattleMeta } from '../../../types';

/** planned.ts에서 이관 — bbox·cartouche·intro·relief는 저작하며 확정한다. */
export const unsanMeta: BattleMeta = {
  id: "unsan",
  name: { ko: "운산 전투", en: "Battle of Unsan" },
  phase: "ccf",
  dateRange: { start: "1950-11-01", end: "1950-11-04" },
  marker: [125.8,39.98],
  summary: "평안북도 운산에서 중공군이 처음으로 대규모 병력을 투입해 국군 제1사단과 미 제8기병연대를 기습한 전투로, 중국의 참전을 전선에서 처음 확인시킨 사건이다. 미 제8기병연대 3대대가 큰 피해를 입는 등 유엔군의 북진에 급격히 제동이 걸리는 계기가 되었다.",
  status: 'planned', // 저작 완료 후 'available'
  // TODO: 전투 정면이 화면 과반을 차지하도록 프레이밍 (스타일 표준 §프레이밍)
  // bbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // TODO: bbox보다 넓게 — relief:make가 이 범위로 래스터를 만든다
  // reliefBbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // relief: { light: '/relief/unsan-light.webp', dark: '/relief/unsan-dark.webp' },
  // cartouche: { title: '운산 전투 상황도', en: '...', sub: '군 작전상황도(도식) · ...' },
  // intro: { headline: '운산 전투', body: '— ... —' },
  // inset: { label: '...' },
};
