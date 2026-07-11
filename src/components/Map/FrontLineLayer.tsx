import { useEffect, useMemo, useRef, useState } from 'react';
import type { GeoProjection } from 'd3-geo';
import { project } from '../../lib/projection';
import {
  resamplePolyline,
  lerpPolyline,
  smoothPathFromPoints,
  easeInOutCubic,
  prefersReducedMotion,
  type Pt,
} from '../../lib/morph';
import { frontLines, frontLineByDate } from '../../data/frontlines';
import { dayByDate } from '../../data/days';
import { useBattleStore } from '../../store/useBattleStore';

const SAMPLES = 72;
const MORPH_MS = 700;

export default function FrontLineLayer({ projection }: { projection: GeoProjection }) {
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const visible = useBattleStore((s) => s.layers.front);

  const target = useMemo(() => {
    if (selectedDay === 'all') return null;
    const flDate = dayByDate.get(selectedDay)?.frontLineDate;
    const fl = flDate ? frontLineByDate.get(flDate) : undefined;
    if (!fl) return null;
    return {
      date: fl.date,
      pts: resamplePolyline(
        fl.coordinates.map((c) => project(projection, c)),
        SAMPLES,
      ),
    };
  }, [selectedDay, projection]);

  const [drawn, setDrawn] = useState<Pt[] | null>(null);
  const drawnRef = useRef<Pt[] | null>(null);
  drawnRef.current = drawn;
  const rafRef = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    if (!target) {
      setDrawn(null);
      return;
    }
    const from = drawnRef.current;
    if (!from || prefersReducedMotion()) {
      setDrawn(target.pts);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / MORPH_MS);
      setDrawn(lerpPolyline(from, target.pts, easeInOutCubic(t)));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (!visible) return null;

  /* 전체 모드 — 일자별 전선을 겹쳐 남하 흐름을 한눈에 */
  if (selectedDay === 'all') {
    return (
      <g aria-hidden="true">
        {frontLines.map((fl, i) => {
          const pts = fl.coordinates.map((c) => project(projection, c));
          const d = smoothPathFromPoints(pts);
          const [lx, ly] = pts[pts.length - 1];
          const label = `${Number(fl.date.slice(5, 7))}.${Number(fl.date.slice(8, 10))}`;
          return (
            <g key={fl.date} opacity={0.3 + i * 0.02}>
              <path d={d} fill="none" stroke="var(--nk)" strokeWidth={1.5} strokeDasharray="5 4" />
              <text
                className="map-label map-label--mono"
                x={lx + 5}
                y={ly + 3}
                fontSize={8.5}
                fill="var(--nk)"
              >
                {label}
              </text>
            </g>
          );
        })}
      </g>
    );
  }

  if (!drawn || !target) return null;

  const [lx, ly] = drawn[drawn.length - 1];
  const label = `전선 ${Number(target.date.slice(5, 7))}.${Number(target.date.slice(8, 10))}`;

  return (
    <g aria-hidden="true">
      <path
        d={smoothPathFromPoints(drawn)}
        fill="none"
        stroke="var(--nk)"
        strokeWidth={2.6}
        strokeLinecap="round"
        opacity={0.9}
      />
      <text
        className="map-label map-label--mono"
        x={lx + 6}
        y={ly + 4}
        fontSize={10}
        fill="var(--nk)"
      >
        {label}
      </text>
    </g>
  );
}
