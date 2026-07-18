import type { BattleMeta } from '../../../types';

/** planned.ts에서 이관 — bbox·cartouche·intro·relief는 저작하며 확정한다. */
export const incheonMeta: BattleMeta = {
  id: "incheon",
  name: { ko: "인천상륙작전", en: "Operation Chromite (Incheon Landing)" },
  phase: "counter",
  dateRange: { start: "1950-09-15", end: "1950-09-19" },
  marker: [126.62,37.47],
  summary: "유엔군이 인천 월미도와 해안에 상륙해 서울 진격로를 확보한 작전으로, 낙동강 전선에 묶여 있던 북한군의 병참선을 끊는 전환점이 되었다. 조수간만 차가 큰 인천의 지형 조건 때문에 상륙 시각과 항로가 정밀하게 계산되었다.",
  status: 'planned', // 저작 완료 후 'available'
  // TODO: 전투 정면이 화면 과반을 차지하도록 프레이밍 (스타일 표준 §프레이밍)
  // bbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // TODO: bbox보다 넓게 — relief:make가 이 범위로 래스터를 만든다
  // reliefBbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // relief: { light: '/relief/incheon-light.webp', dark: '/relief/incheon-dark.webp' },
  // cartouche: { title: '인천상륙작전 상황도', en: '...', sub: '군 작전상황도(도식) · ...' },
  // intro: { headline: '인천상륙작전', body: '— ... —' },
  // inset: { label: '...' },
};
