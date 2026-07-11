import type { GeoProjection } from 'd3-geo';
import { project, lineToPath, lineToSmoothPath } from '../../lib/projection';
import { terrainPoints, terrainLines, boundary38 } from '../../data/terrain';
import { useBattleStore } from '../../store/useBattleStore';
import type { TerrainPoint } from '../../types';

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

export default function TerrainLayer({ projection }: { projection: GeoProjection }) {
  const showLabels = useBattleStore((s) => s.layers.terrain);

  const rivers = terrainLines.filter((l) => l.kind === 'river');
  const roads = terrainLines.filter((l) => l.kind === 'road');
  const b38a = project(projection, boundary38[0]);

  return (
    <g>
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
            return (
              <g key={p.id} transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}>
                <PointSymbol p={p} />
                <text
                  className="map-label"
                  y={big ? -8 : -7}
                  textAnchor="middle"
                  fontSize={big ? 12.5 : 10}
                  fill={p.kind === 'assembly' ? 'var(--nk)' : undefined}
                  opacity={p.kind === 'spot' || p.kind === 'hill' ? 0.85 : 1}
                >
                  {pointLabel(p)}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
}
