import type { LngLat } from '../types';

/** 인셋 미니맵용 한반도 실루엣 — 도식적 근사 외곽선(시계방향) */
export const koreaOutline: LngLat[] = [
  [124.8, 40.1],
  [126.2, 39.7],
  [127.6, 39.4],
  [128.4, 38.6],
  [129.4, 37.5],
  [129.5, 35.6],
  [128.9, 34.9],
  [127.8, 34.3],
  [126.5, 34.6],
  [126.4, 36.0],
  [126.7, 37.0],
  [126.1, 37.8],
  [125.4, 38.6],
  [125.0, 39.6],
];

/** 인셋 지리 범위 */
export const KOREA_BBOX = {
  lngMin: 124.5,
  lngMax: 131.0,
  latMin: 33.6,
  latMax: 40.6,
};

export const seoul: LngLat = [126.98, 37.57];
export const chuncheon: LngLat = [127.73, 37.88];
