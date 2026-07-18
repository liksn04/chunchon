import type { BattleMeta } from '../../../types';

/** planned.ts에서 이관 — bbox·cartouche·intro·relief는 저작하며 확정한다. */
export const hangangLineMeta: BattleMeta = {
  id: "hangang-line",
  name: { ko: "한강 방어선 전투", en: "Han River Defensive Line" },
  phase: "invasion",
  dateRange: { start: "1950-06-28", end: "1950-07-03" },
  marker: [126.96,37.51],
  summary: "1950년 6월 28일 서울이 함락되고 한강대교가 조기 폭파되며 다수의 인명 피해가 발생한 가운데, 국군은 한강 남안을 따라 방어선을 형성해 며칠간 북한군의 도하를 저지했다. 이 방어선은 이후 병력 재편과 남쪽 방어선 구축을 위한 시간을 벌어주었다.",
  status: 'planned', // 저작 완료 후 'available'
  // TODO: 전투 정면이 화면 과반을 차지하도록 프레이밍 (스타일 표준 §프레이밍)
  // bbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // TODO: bbox보다 넓게 — relief:make가 이 범위로 래스터를 만든다
  // reliefBbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // relief: { light: '/relief/hangang-line-light.webp', dark: '/relief/hangang-line-dark.webp' },
  // cartouche: { title: '한강 방어선 전투 상황도', en: '...', sub: '군 작전상황도(도식) · ...' },
  // intro: { headline: '한강 방어선 전투', body: '— ... —' },
  // inset: { label: '...' },
};
