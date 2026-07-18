import type { BattleMeta } from '../../../types';

/** planned.ts에서 이관 — bbox·cartouche·intro·relief는 저작하며 확정한다. */
export const hyeonriMeta: BattleMeta = {
  id: "hyeonri",
  name: { ko: "현리 전투", en: "Battle of Hyeon-ri" },
  phase: "ccf",
  dateRange: { start: "1951-05-16", end: "1951-05-22" },
  marker: [128.35,37.95],
  summary: "중공군의 5월 공세로 인제 현리 일대에서 국군 제3군단이 오마치 고개 퇴로를 차단당해 큰 피해를 입고 후퇴한 전투다. 이 패퇴는 국군 제3군단이 해체되는 등 지휘 체계를 재정비하는 계기가 되었다.",
  status: 'planned', // 저작 완료 후 'available'
  // TODO: 전투 정면이 화면 과반을 차지하도록 프레이밍 (스타일 표준 §프레이밍)
  // bbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // TODO: bbox보다 넓게 — relief:make가 이 범위로 래스터를 만든다
  // reliefBbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // relief: { light: '/relief/hyeonri-light.webp', dark: '/relief/hyeonri-dark.webp' },
  // cartouche: { title: '현리 전투 상황도', en: '...', sub: '군 작전상황도(도식) · ...' },
  // intro: { headline: '현리 전투', body: '— ... —' },
  // inset: { label: '...' },
};
