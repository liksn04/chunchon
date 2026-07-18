import type { BattleMeta } from '../../../types';

/** planned.ts에서 이관 — bbox·cartouche·intro·relief는 저작하며 확정한다. */
export const daejeonMeta: BattleMeta = {
  id: "daejeon",
  name: { ko: "대전 전투", en: "Battle of Taejon" },
  phase: "invasion",
  dateRange: { start: "1950-07-14", end: "1950-07-21" },
  marker: [127.38,36.35],
  summary: "미 제24보병사단이 금강선에서 밀린 뒤 대전 시가지에서 북한군 제3·4사단을 상대로 지연전을 벌인 전투로, 사단장 윌리엄 딘 소장이 시가전 중 실종·포로가 되었다. 이 저항은 낙동강 방어선을 구축할 시간을 확보하는 대가로 큰 희생을 치렀다.",
  status: 'planned', // 저작 완료 후 'available'
  // TODO: 전투 정면이 화면 과반을 차지하도록 프레이밍 (스타일 표준 §프레이밍)
  // bbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // TODO: bbox보다 넓게 — relief:make가 이 범위로 래스터를 만든다
  // reliefBbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // relief: { light: '/relief/daejeon-light.webp', dark: '/relief/daejeon-dark.webp' },
  // cartouche: { title: '대전 전투 상황도', en: '...', sub: '군 작전상황도(도식) · ...' },
  // intro: { headline: '대전 전투', body: '— ... —' },
  // inset: { label: '...' },
};
