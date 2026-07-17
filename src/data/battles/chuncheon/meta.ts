import type { BattleMeta } from '../../../types';

/**
 * 춘천–홍천 전투 메타.
 * bbox·reliefBbox는 lib/projection.ts의 상수를 그대로 옮겼다(무회귀).
 * cartouche는 MapCanvas의 하드코딩 카투시, intro는 TitleIntro의 카피를 데이터화한 것.
 */
export const chuncheonMeta: BattleMeta = {
  id: 'chuncheon',
  name: { ko: '춘천–홍천 전투', en: 'Battle of Chuncheon–Hongcheon' },
  phase: 'invasion',
  dateRange: { start: '1950-06-25', end: '1950-07-01' },
  marker: [127.73, 37.88],
  summary:
    '1950년 6월 25일 개전과 함께 국군 제6사단이 춘천·홍천 두 축에서 북한 2군단의 남침을 사흘간 저지한 지연전이다. 이 3일이 서울 우회 포위 계획을 무산시켜 한강 방어선 재편과 반격의 발판을 마련했다.',
  status: 'available',
  bbox: {
    sw: [127.6, 37.58],
    ne: [128.25, 38.15],
  },
  reliefBbox: {
    sw: [126.55, 36.8],
    ne: [128.65, 38.3],
  },
  relief: {
    light: '/relief/chuncheon-light.webp',
    dark: '/relief/chuncheon-dark.webp',
  },
  cartouche: {
    title: '춘천–홍천',
    en: 'CHUNCHEON — HONGCHEON',
    sub: '군 작전상황도(도식) · 1950. 6.',
    stamp: '사본 № 3',
  },
  intro: {
    headline: '춘천–홍천 전투',
    body: '— 대한민국을 구한 3일 —',
  },
  inset: {
    label: '춘천',
    seoulFallDate: '1950-06-28',
  },
};
