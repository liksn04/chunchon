import type { BattleMeta } from '../../../types';

/** planned.ts에서 이관 — bbox·cartouche·intro·relief는 저작하며 확정한다. */
export const pohangAngangMeta: BattleMeta = {
  id: "pohang-angang",
  name: { ko: "포항–안강·기계 전투", en: "Battles of Pohang–Angang-Gigye" },
  phase: "naktong",
  dateRange: { start: "1950-08-09", end: "1950-09-14" },
  marker: [129.3,36.02],
  summary: "낙동강 방어선 동부 전선에서 북한군이 포항과 안강·기계 일대를 반복적으로 공격·점령했고, 국군이 여러 차례 이를 탈환하며 한 달 넘게 공방이 이어졌다. 이 전선에는 학도의용군이 투입된 포항여중 전투도 포함되어 있다.",
  status: 'planned', // 저작 완료 후 'available'
  // TODO: 전투 정면이 화면 과반을 차지하도록 프레이밍 (스타일 표준 §프레이밍)
  // bbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // TODO: bbox보다 넓게 — relief:make가 이 범위로 래스터를 만든다
  // reliefBbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // relief: { light: '/relief/pohang-angang-light.webp', dark: '/relief/pohang-angang-dark.webp' },
  // cartouche: { title: '포항–안강·기계 전투 상황도', en: '...', sub: '군 작전상황도(도식) · ...' },
  // intro: { headline: '포항–안강·기계 전투', body: '— ... —' },
  // inset: { label: '...' },
};
