import type { BattleMeta } from '../../../types';

/** planned.ts에서 이관 — bbox·cartouche·intro·relief는 저작하며 확정한다. */
export const yongmunsanMeta: BattleMeta = {
  id: "yongmunsan",
  name: { ko: "용문산 전투", en: "Battle of Yongmunsan" },
  phase: "ccf",
  dateRange: { start: "1951-05-18", end: "1951-05-21" },
  marker: [127.5,37.5],
  summary: "경기도 양평 용문산 일대에서 국군 제6사단이 중공군 5월 공세의 한 축을 격퇴한 전투로, 현리 전투로 흔들리던 중동부 전선에서 유엔군 측이 거둔 대표적 반격 성공 사례다. 이후 국군은 북한강을 넘어 추격전을 벌였다.",
  status: 'planned', // 저작 완료 후 'available'
  // TODO: 전투 정면이 화면 과반을 차지하도록 프레이밍 (스타일 표준 §프레이밍)
  // bbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // TODO: bbox보다 넓게 — relief:make가 이 범위로 래스터를 만든다
  // reliefBbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // relief: { light: '/relief/yongmunsan-light.webp', dark: '/relief/yongmunsan-dark.webp' },
  // cartouche: { title: '용문산 전투 상황도', en: '...', sub: '군 작전상황도(도식) · ...' },
  // intro: { headline: '용문산 전투', body: '— ... —' },
  // inset: { label: '...' },
};
