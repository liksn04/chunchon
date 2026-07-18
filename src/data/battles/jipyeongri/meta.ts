import type { BattleMeta } from '../../../types';

/** planned.ts에서 이관 — bbox·cartouche·intro·relief는 저작하며 확정한다. */
export const jipyeongriMeta: BattleMeta = {
  id: "jipyeongri",
  name: { ko: "지평리 전투", en: "Battle of Chipyong-ni" },
  phase: "ccf",
  dateRange: { start: "1951-02-13", end: "1951-02-15" },
  marker: [127.57,37.49],
  summary: "경기도 양평 지평리에서 미 제23연대전투단(프랑스대대 포함)이 사방을 포위한 중공군의 공세를 사흘간 방어해낸 전투로, 중공군 남하 이후 유엔군이 거둔 최초의 확실한 방어 성공 사례로 꼽힌다. 이를 계기로 중공군의 공세에 대한 유엔군의 자신감이 회복되었다.",
  status: 'planned', // 저작 완료 후 'available'
  // TODO: 전투 정면이 화면 과반을 차지하도록 프레이밍 (스타일 표준 §프레이밍)
  // bbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // TODO: bbox보다 넓게 — relief:make가 이 범위로 래스터를 만든다
  // reliefBbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // relief: { light: '/relief/jipyeongri-light.webp', dark: '/relief/jipyeongri-dark.webp' },
  // cartouche: { title: '지평리 전투 상황도', en: '...', sub: '군 작전상황도(도식) · ...' },
  // intro: { headline: '지평리 전투', body: '— ... —' },
  // inset: { label: '...' },
};
