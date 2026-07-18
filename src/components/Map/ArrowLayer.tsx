import { memo } from 'react';
import type { GeoProjection } from 'd3-geo';
import { project, lineToSmoothPath } from '../../lib/projection';
import { useBattleStore } from '../../store/useBattleStore';
import { useBattle } from '../../battles/useBattle';
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

function ArrowLayer({ projection, k = 1 }: { projection: GeoProjection; k?: number }) {
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const visible = useBattleStore((s) => s.layers.arrows);
  const { movements, dayByDate } = useBattle();
  if (!visible) return null;
  const sc = 1 / k;

  const activeIds =
    selectedDay === 'all' ? null : dayByDate.get(selectedDay)?.activeArrowIds ?? [];
  const shown = movements.filter((m) =>
    activeIds ? activeIds.includes(m.id) : (m.mapLabel?.showPathAtAll ?? true),
  );

  return (
    <g aria-hidden="true">
      {shown.map((a, i) => {
        const d = lineToSmoothPath(projection, a.path);
        const color = a.faction === 'ROK' ? 'var(--rok)' : 'var(--nk)';
        const mid = project(projection, a.path[Math.floor(a.path.length / 2)]);
        const dashed = a.style === 'withdraw';
        const placement = a.mapLabel;
        const showLabel =
          k >= (placement?.minZoom ?? 0) &&
          (selectedDay !== 'all' || (placement?.showAtAll ?? true));
        const dx = placement?.dx ?? 7;
        const dy = placement?.dy ?? -6;
        const anchor = placement?.anchor ?? 'start';
        const label = placement?.text ?? a.label;

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
              vectorEffect="non-scaling-stroke"
              opacity={a.style === 'advance' ? 0.75 : 0.9}
              markerEnd={`url(#${markerId(a)})`}
            />
            <path
              d={d}
              className="arrow-flow"
              fill="none"
              stroke={a.faction === 'ROK' ? '#eaf0fb' : '#fbeaea'}
              strokeWidth={Math.max(1.1, STROKE[a.style] - 1.6)}
              strokeLinecap="round"
              strokeDasharray="0.5 7"
              vectorEffect="non-scaling-stroke"
              opacity={0.8}
            />
            {showLabel && (
              <g transform={`translate(${mid[0].toFixed(1)},${mid[1].toFixed(1)}) scale(${sc})`}>
                <text
                  className="map-label fade-in map-label--mono"
                  style={{ animationDelay: `${i * 0.12 + 0.4}s` }}
                  x={dx}
                  y={dy}
                  textAnchor={anchor}
                  fontSize={9.5}
                  fill={color}
                >
                  {label}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

export default memo(ArrowLayer);
