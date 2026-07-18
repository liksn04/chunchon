import type { BattleMeta } from '../../../types';

/** planned.ts에서 이관 — bbox·cartouche·intro·relief는 저작하며 확정한다. */
export const seoulRecaptureMeta: BattleMeta = {
  id: "seoul-recapture",
  name: { ko: "서울 수복", en: "Second Battle of Seoul" },
  phase: "counter",
  dateRange: { start: "1950-09-22", end: "1950-09-28" },
  marker: [126.98,37.57],
  summary: "인천상륙작전 이후 유엔군과 국군이 서울 외곽에서 북한군의 시가전 저항을 뚫고 9월 28일 중앙청에 태극기를 다시 게양하며 수복을 완료했다. 서울이 함락된 지 정확히 3개월 만의 탈환이었다.",
  status: 'planned', // 저작 완료 후 'available'
  // TODO: 전투 정면이 화면 과반을 차지하도록 프레이밍 (스타일 표준 §프레이밍)
  // bbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // TODO: bbox보다 넓게 — relief:make가 이 범위로 래스터를 만든다
  // reliefBbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // relief: { light: '/relief/seoul-recapture-light.webp', dark: '/relief/seoul-recapture-dark.webp' },
  // cartouche: { title: '서울 수복 상황도', en: '...', sub: '군 작전상황도(도식) · ...' },
  // intro: { headline: '서울 수복', body: '— ... —' },
  // inset: { label: '...' },
};
