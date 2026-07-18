import { geoMercator, geoPath, type GeoProjection } from 'd3-geo';
import type { Bbox, LngLat } from '../types';

/** 전투 bbox를 화면에 맞추는 Mercator 투영을 만든다. */
export function createProjection(
  width: number,
  height: number,
  bbox: Bbox,
  padding = 24,
): GeoProjection {
  const bboxFeature = {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'Polygon' as const,
      // d3-geo 구면 폴리곤: 외곽 링은 시계방향이어야 내부가 bbox가 된다
      coordinates: [[
        [bbox.sw[0], bbox.sw[1]],
        [bbox.sw[0], bbox.ne[1]],
        [bbox.ne[0], bbox.ne[1]],
        [bbox.ne[0], bbox.sw[1]],
        [bbox.sw[0], bbox.sw[1]],
      ]],
    },
  };
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
