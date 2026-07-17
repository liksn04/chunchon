import { memo } from 'react';
import type { GeoProjection } from 'd3-geo';
import { project } from '../../lib/projection';
import { useBattleStore } from '../../store/useBattleStore';
import { useBattle } from '../../battles/useBattle';
import type { Outcome } from '../../types';

/** 결과별 내부 심볼 — 색+형태 이중 부호화 (색맹 대비) */
function OutcomeGlyph({ outcome }: { outcome: Outcome }) {
  switch (outcome) {
    case 'rok':
      return <circle r={4.4} fill="var(--rok)" />;
    case 'nk':
      return <rect x={-3.9} y={-3.9} width={7.8} height={7.8} transform="rotate(45)" fill="var(--nk)" />;
    case 'mixed':
      return (
        <g>
          <path d="M0,-4.4 A4.4,4.4 0 0 0 0,4.4 Z" fill="var(--rok)" />
          <path d="M0,-4.4 A4.4,4.4 0 0 1 0,4.4 Z" fill="var(--nk)" />
        </g>
      );
    case 'none':
      return <circle r={2.6} fill="var(--ink-faint)" />;
  }
}

function EventMarkers({ projection, k = 1 }: { projection: GeoProjection; k?: number }) {
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const selectedEventId = useBattleStore((s) => s.selectedEventId);
  const selectEvent = useBattleStore((s) => s.selectEvent);
  const visible = useBattleStore((s) => s.layers.markers);
  const { events, dayByDate, approxCoordIds } = useBattle();
  if (!visible) return null;
  const sc = 1 / k;

  const activeIds =
    selectedDay === 'all' ? null : dayByDate.get(selectedDay)?.activeEventIds ?? [];
  const shown = events.filter((e) => !activeIds || activeIds.includes(e.id));

  return (
    <g>
      {shown.map((ev) => {
        const [x, y] = project(projection, ev.coord);
        const selected = ev.id === selectedEventId;
        const placement = ev.mapLabel;
        const showAtAll = placement?.showAtAll ?? ev.key ?? false;
        const showTitle =
          k >= (placement?.minZoom ?? 0) &&
          (selected || selectedDay !== 'all' || showAtAll);
        const defaultY = ev.key || selected ? 25 : 21;
        const dx = placement?.dx ?? 0;
        const dy = placement?.dy ?? defaultY;
        const anchor = placement?.anchor ?? 'middle';
        const label = placement?.text ?? ev.title;
        const leader = placement?.leader && (Math.abs(dx) > 10 || Math.abs(dy) > 14);

        return (
          <g
            key={ev.id}
            className="event-marker"
            transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc})`}
            role="button"
            tabIndex={0}
            aria-label={`${ev.title} — ${ev.summary}`}
            aria-pressed={selected}
            onClick={(e) => {
              e.stopPropagation();
              selectEvent(selected ? null : ev.id);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectEvent(selected ? null : ev.id);
              }
            }}
          >
            <circle r={16} fill="transparent" />
            {ev.key && (
              <circle
                r={11.5}
                fill="none"
                stroke="var(--amber)"
                strokeWidth={2.6}
                strokeDasharray="3.5 2.6"
              />
            )}
            {selected && (
              <>
                <circle className="pulse-ring" r={11.5} fill="none" stroke="var(--amber)" strokeWidth={2.6} />
                <circle r={11.5} fill="none" stroke="var(--amber-deep)" strokeWidth={2.2} />
              </>
            )}
            <circle r={7.2} fill="var(--map-buff)" stroke="var(--ink)" strokeWidth={1.6} />
            <OutcomeGlyph outcome={ev.outcome} />
            <title>{ev.title}</title>
            {showTitle && (
              <>
                {leader && (
                  <path
                    d={`M0,0 L${(dx * 0.72).toFixed(1)},${(dy * 0.72).toFixed(1)}`}
                    fill="none"
                    stroke="var(--ink-soft)"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    opacity={0.72}
                  />
                )}
                <text
                  className="map-label"
                  x={dx}
                  y={dy}
                  textAnchor={anchor}
                  fontSize={11}
                  fontWeight={ev.key ? 700 : 600}
                >
                  {approxCoordIds.has(ev.id) && (
                    <tspan fill="var(--ink-faint)" fontFamily="var(--font-mono)">≈ </tspan>
                  )}
                  {label}
                </text>
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}

export default memo(EventMarkers);
