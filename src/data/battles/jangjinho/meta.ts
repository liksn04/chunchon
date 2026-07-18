import type { BattleMeta } from '../../../types';

/** planned.ts에서 이관 — bbox·cartouche·intro·relief는 저작하며 확정한다. */
export const jangjinhoMeta: BattleMeta = {
  id: "jangjinho",
  name: { ko: "장진호 전투", en: "Battle of Chosin Reservoir" },
  phase: "ccf",
  dateRange: { start: "1950-11-27", end: "1950-12-11" },
  marker: [127.2,40.48],
  summary: "함경남도 장진호 일대에서 미 해병 제1사단 등이 중공군 제9병단의 포위 공세를 뚫고 흥남으로 철수한 전투로, 영하 수십 도의 혹한 속에서 치러졌다. 포위망을 뚫고 조직적으로 철수에 성공하며 흥남 철수 작전의 기반을 마련했다.",
  status: 'planned', // 저작 완료 후 'available'
  // TODO: 전투 정면이 화면 과반을 차지하도록 프레이밍 (스타일 표준 §프레이밍)
  // bbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // TODO: bbox보다 넓게 — relief:make가 이 범위로 래스터를 만든다
  // reliefBbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // relief: { light: '/relief/jangjinho-light.webp', dark: '/relief/jangjinho-dark.webp' },
  // cartouche: { title: '장진호 전투 상황도', en: '...', sub: '군 작전상황도(도식) · ...' },
  // intro: { headline: '장진호 전투', body: '— ... —' },
  // inset: { label: '...' },
};
