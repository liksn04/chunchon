import { memo } from 'react';
import type { GeoProjection } from 'd3-geo';
import { project, lineToSmoothPath } from '../../lib/projection';
import { movements } from '../../data/movements';
import { dayByDate } from '../../data/days';
import { useBattleStore } from '../../store/useBattleStore';
import type { MovementArrow } from '../../types';

const STROKE: Record<MovementArrow['style'], number> = {
  attack: 3.4,
  advance: 2.4,
  withdraw: 2.4,
};

/** MapCanvas <defs>에 들어갈 화살촉 마커 */
export function ArrowheadDefs() {
  const factions = [
    ['ROK', 'var(--rok)'],
    ['NK', 'var(--nk)'],
  ] as const;
  return (
    <>
      {factions.map(([f, color]) => (
        <g key={f}>
          <marker
            id={`ah-fill-${f}`}
            viewBox="0 0 10 10"
            refX={8}
            refY={5}
            markerWidth={4}
            markerHeight={4}
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill={color} />
          </marker>
          <marker
            id={`ah-open-${f}`}
            viewBox="0 0 10 10"
            refX={7.5}
            refY={5}
            markerWidth={5}
            markerHeight={5}
            orient="auto-start-reverse"
          >
            <path
              d="M1,1 L9,5 L1,9"
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </marker>
        </g>
      ))}
    </>
  );
}

function markerId(a: MovementArrow) {
  return a.style === 'attack' ? `ah-fill-${a.faction}` : `ah-open-${a.faction}`;
}

function ArrowLayer({ projection }: { projection: GeoProjection }) {
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const visible = useBattleStore((s) => s.layers.arrows);
  if (!visible) return null;

  const activeIds =
    selectedDay === 'all' ? null : dayByDate.get(selectedDay)?.activeArrowIds ?? [];
  const shown = movements.filter((m) => !activeIds || activeIds.includes(m.id));

  return (
    <g aria-hidden="true">
      {shown.map((a, i) => {
        const d = lineToSmoothPath(projection, a.path);
        const color = a.faction === 'ROK' ? 'var(--rok)' : 'var(--nk)';
        const mid = project(projection, a.path[Math.floor(a.path.length / 2)]);
        const dashed = a.style === 'withdraw';
        return (
          <g key={`${a.id}-${selectedDay}`}>
            <path
              d={d}
              pathLength={dashed ? undefined : 1}
              className={dashed ? 'fade-in' : 'arrow-draw'}
              style={{ animationDelay: `${i * 0.12}s` }}
              fill="none"
              stroke={color}
              strokeWidth={STROKE[a.style]}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={dashed ? '8 6' : undefined}
              opacity={a.style === 'advance' ? 0.75 : 0.9}
              markerEnd={`url(#${markerId(a)})`}
            />
            <text
              className="map-label fade-in map-label--mono"
              style={{ animationDelay: `${i * 0.12 + 0.4}s` }}
              x={mid[0] + 7}
              y={mid[1] - 6}
              fontSize={9.5}
              fill={color}
            >
              {a.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default memo(ArrowLayer);
