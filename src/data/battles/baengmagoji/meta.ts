import type { BattleMeta } from '../../../types';

/** planned.ts에서 이관 — bbox·cartouche·intro·relief는 저작하며 확정한다. */
export const baengmagojiMeta: BattleMeta = {
  id: "baengmagoji",
  name: { ko: "백마고지 전투", en: "Battle of White Horse Hill" },
  phase: "stalemate",
  dateRange: { start: "1952-10-06", end: "1952-10-15" },
  marker: [127.09,38.26],
  summary: "철원 북방 395고지(백마고지)를 두고 국군 제9사단과 중공군이 열흘간 고지의 주인이 여러 차례 바뀌는 공방을 벌인 전투로, 고지전 시기를 대표하는 격전 중 하나다. 격렬한 포격으로 고지의 지형이 바뀔 정도였다는 기록이 남아 있으며, 국군이 최종적으로 고지를 확보했다.",
  status: 'planned', // 저작 완료 후 'available'
  // TODO: 전투 정면이 화면 과반을 차지하도록 프레이밍 (스타일 표준 §프레이밍)
  // bbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // TODO: bbox보다 넓게 — relief:make가 이 범위로 래스터를 만든다
  // reliefBbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // relief: { light: '/relief/baengmagoji-light.webp', dark: '/relief/baengmagoji-dark.webp' },
  // cartouche: { title: '백마고지 전투 상황도', en: '...', sub: '군 작전상황도(도식) · ...' },
  // intro: { headline: '백마고지 전투', body: '— ... —' },
  // inset: { label: '...' },
};
