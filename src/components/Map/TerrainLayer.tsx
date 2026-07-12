import { memo } from 'react';
import type { GeoProjection } from 'd3-geo';
import { project, lineToPath, lineToSmoothPath } from '../../lib/projection';
import { closedSmoothPathFromPoints, type Pt } from '../../lib/morph';
import { terrainPoints, terrainLines, boundary38 } from '../../data/terrain';
import { reliefMassifs } from '../../data/relief';
import { useBattleStore } from '../../store/useBattleStore';
import type { TerrainPoint } from '../../types';

/** 산괴 폴리곤을 중심 방향으로 수축시켜 등고선 링 3단 생성 */
function contourRings(projection: GeoProjection, coords: [number, number][]): string[] {
  const pts: Pt[] = coords.map((c) => project(projection, c));
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return [1, 0.64, 0.34].map((s) =>
    closedSmoothPathFromPoints(
      pts.map(([x, y], i) => {
        // 링마다 점별 수축률에 약간의 요철을 줘 손그림 느낌
        const wobble = 1 + 0.08 * Math.sin(i * 2.4 + s * 7);
        const k = s * wobble;
        return [cx + (x - cx) * k, cy + (y - cy) * k] as Pt;
      }),
    ),
  );
}

function PointSymbol({ p }: { p: TerrainPoint }) {
  switch (p.kind) {
    case 'city':
      return <rect x={-3.2} y={-3.2} width={6.4} height={6.4} fill="var(--ink)" />;
    case 'assembly':
      return (
        <circle
          r={7}
          fill="var(--nk-soft)"
          stroke="var(--nk)"
          strokeWidth={1.4}
          strokeDasharray="3 2"
        />
      );
    case 'peak':
      return <path d="M0,-5 L5,4 L-5,4 Z" fill="var(--contour-bistre)" />;
    case 'hill':
      return (
        <path
          d="M0,-4 L4,3 L-4,3 Z"
          fill="none"
          stroke="var(--contour-bistre)"
          strokeWidth={1.4}
        />
      );
    case 'bridge':
      return (
        <path
          d="M-5,-4 C-2,-1.2 -2,1.2 -5,4 M5,-4 C2,-1.2 2,1.2 5,4"
          fill="none"
          stroke="var(--ink)"
          strokeWidth={1.5}
        />
      );
    case 'spot':
      return (
        <path
          d="M-3,-3 L3,3 M-3,3 L3,-3"
          stroke="var(--ink-soft)"
          strokeWidth={1.5}
        />
      );
  }
}

function pointLabel(p: TerrainPoint): string {
  if (p.kind === 'peak' && p.meta?.elevation) return `${p.name} ${p.meta.elevation}`;
  return p.name;
}

/** 폴리라인 상 위치(0~1)의 좌표 근사 — 라벨 배치용 */
function alongLine(projection: GeoProjection, coords: [number, number][], t: number) {
  const idx = Math.min(coords.length - 1, Math.max(0, Math.round((coords.length - 1) * t)));
  return project(projection, coords[idx]);
}

function TerrainLayer({
  projection,
  detail = false,
}: {
  projection: GeoProjection;
  detail?: boolean;
}) {
  const showLabels = useBattleStore((s) => s.layers.terrain);
  // 소축척에선 세부 지점(× 표시·고지) 라벨을 숨겨 밀집 구역 겹침을 줄인다
  const showDetailLabels = detail;

  const rivers = terrainLines.filter((l) => l.kind === 'river');
  const roads = terrainLines.filter((l) => l.kind === 'road');
  const b38a = project(projection, boundary38[0]);

  return (
    <g>
      {/* 음영 기복 — 도식 산괴 등고선 */}
      {reliefMassifs.map((m) => {
        const rings = contourRings(projection, m.coordinates);
        const it = m.intensity ?? 1;
        return (
          <g key={m.id} aria-hidden="true">
            <path d={rings[0]} fill="var(--ridge-shadow)" opacity={0.35 * it} stroke="none" />
            {rings.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="var(--contour-bistre)"
                strokeWidth={0.9}
                opacity={(0.42 - i * 0.06) * it}
              />
            ))}
          </g>
        );
      })}

      {/* 강 */}
      {rivers.map((r) => (
        <path
          key={r.id}
          d={lineToSmoothPath(projection, r.coordinates)}
          fill="none"
          stroke="var(--water-teal)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* 도로 */}
      {roads.map((r) => (
        <path
          key={r.id}
          d={lineToSmoothPath(projection, r.coordinates)}
          fill="none"
          stroke="var(--contour-bistre)"
          strokeWidth={1.4}
          strokeDasharray="7 4"
          strokeLinecap="round"
          opacity={0.85}
        />
      ))}

      {/* 38선 */}
      <path
        d={lineToPath(projection, boundary38)}
        fill="none"
        stroke="var(--ink)"
        strokeWidth={1.3}
        strokeDasharray="12 5 3 5"
      />
      <text
        className="map-label map-label--mono"
        x={b38a[0] + 6}
        y={b38a[1] - 5}
        fontSize={10}
      >
        38°N — 38선
      </text>

      {showLabels && (
        <g>
          {/* 강·도로 이름 */}
          {rivers.map((r) => {
            const [x, y] = alongLine(projection, r.coordinates, 0.35);
            return (
              <text key={r.id} className="map-label map-label--water" x={x + 6} y={y - 5} fontSize={10.5}>
                {r.name}
              </text>
            );
          })}
          {roads.map((r) => {
            const [x, y] = alongLine(projection, r.coordinates, 0.55);
            return (
              <text key={r.id} className="map-label" x={x + 6} y={y + 12} fontSize={9} fill="var(--contour-bistre)">
                {r.name}
              </text>
            );
          })}

          {/* 지형 지점 */}
          {terrainPoints.map((p) => {
            const [x, y] = project(projection, p.coord);
            const big = p.kind === 'city' || p.kind === 'assembly';
            const detail = p.kind === 'spot' || p.kind === 'hill';
            return (
              <g key={p.id} transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}>
                <PointSymbol p={p} />
                <title>{pointLabel(p)}</title>
                {(!detail || showDetailLabels) && (
                  <text
                    className="map-label"
                    y={big ? -8 : -7}
                    textAnchor="middle"
                    fontSize={big ? 12.5 : 10}
                    fill={p.kind === 'assembly' ? 'var(--nk)' : undefined}
                    opacity={detail ? 0.85 : 1}
                  >
                    {pointLabel(p)}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
}

export default memo(TerrainLayer);
