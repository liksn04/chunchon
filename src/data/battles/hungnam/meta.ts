import type { BattleMeta } from '../../../types';

/** planned.ts에서 이관 — bbox·cartouche·intro·relief는 저작하며 확정한다. */
export const hungnamMeta: BattleMeta = {
  id: "hungnam",
  name: { ko: "흥남 철수", en: "Hungnam Evacuation" },
  phase: "ccf",
  dateRange: { start: "1950-12-15", end: "1950-12-24" },
  marker: [127.62,39.83],
  summary: "중공군 개입으로 전선이 붕괴하자 유엔군과 국군, 다수의 피난민이 흥남항을 통해 해상으로 철수한 작전이다. 약 열흘간 십만 명이 넘는 병력과 피난민이 선박으로 남쪽으로 이송되었고, 철수 완료 후 항만 시설은 폭파되었다.",
  status: 'planned', // 저작 완료 후 'available'
  // TODO: 전투 정면이 화면 과반을 차지하도록 프레이밍 (스타일 표준 §프레이밍)
  // bbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // TODO: bbox보다 넓게 — relief:make가 이 범위로 래스터를 만든다
  // reliefBbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // relief: { light: '/relief/hungnam-light.webp', dark: '/relief/hungnam-dark.webp' },
  // cartouche: { title: '흥남 철수 상황도', en: '...', sub: '군 작전상황도(도식) · ...' },
  // intro: { headline: '흥남 철수', body: '— ... —' },
  // inset: { label: '...' },
};
