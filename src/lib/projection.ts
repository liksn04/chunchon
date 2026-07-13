import { geoMercator, geoPath, type GeoProjection } from 'd3-geo';
import type { LngLat } from '../types';

/**
 * 기본 프레이밍은 춘천–홍천–인제 삼각지대(화천~홍천 남쪽).
 * 횡성·원주·제천·충주 방면 철수로는 화면 밖 — 팬/줌으로 따라간다.
 */
export const BBOX = {
  sw: [127.60, 37.58] as LngLat,
  ne: [128.25, 38.15] as LngLat,
};

/**
 * 음영기복 릴리프 범위 — 서울(서)·충주(남)·인제(동)·화천(북)까지 넓게 덮어
 * 팬해도 지형이 끊기지 않게 한다. (프레이밍 BBOX보다 훨씬 큼)
 */
export const RELIEF_BBOX = {
  sw: [126.55, 36.80] as LngLat,
  ne: [128.65, 38.30] as LngLat,
};

const bboxFeature = {
  type: 'Feature' as const,
  properties: {},
  geometry: {
    type: 'Polygon' as const,
    // d3-geo 구면 폴리곤: 외곽 링은 시계방향이어야 내부가 bbox가 된다
    coordinates: [[
      [BBOX.sw[0], BBOX.sw[1]],
      [BBOX.sw[0], BBOX.ne[1]],
      [BBOX.ne[0], BBOX.ne[1]],
      [BBOX.ne[0], BBOX.sw[1]],
      [BBOX.sw[0], BBOX.sw[1]],
    ]],
  },
};

export function createProjection(
  width: number,
  height: number,
  padding = 24,
): GeoProjection {
  return geoMercator().fitExtent(
    [[padding, padding], [width - padding, height - padding]],
    bboxFeature,
  );
}

export function makePathGen(projection: GeoProjection) {
  return geoPath(projection);
}

/** [lng,lat] → 화면 [x,y] */
export function project(projection: GeoProjection, c: LngLat): [number, number] {
  return projection(c) as [number, number];
}

/** 폴리라인 → SVG path d 문자열 */
export function lineToPath(projection: GeoProjection, coords: LngLat[]): string {
  return coords
    .map((c, i) => {
      const [x, y] = project(projection, c);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

/** 폴리라인 → 부드러운 곡선(Catmull-Rom 근사) SVG path */
export function lineToSmoothPath(
  projection: GeoProjection,
  coords: LngLat[],
): string {
  const pts = coords.map((c) => project(projection, c));
  if (pts.length < 3) return lineToPath(projection, coords);
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}
