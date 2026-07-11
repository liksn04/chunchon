import { useEffect, useMemo, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import 'd3-transition';
import { createProjection, project } from '../../lib/projection';
import { prefersReducedMotion } from '../../lib/morph';
import { eventById } from '../../data/events';
import { useBattleStore } from '../../store/useBattleStore';
import TerrainLayer from './TerrainLayer';
import FrontLineLayer from './FrontLineLayer';
import ArrowLayer, { ArrowheadDefs } from './ArrowLayer';
import EventMarkers from './EventMarkers';

const MIN_ZOOM = 1;
const MAX_ZOOM = 6;

export default function MapCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity);
  const transformRef = useRef(transform);
  transformRef.current = transform;

  const selectedEventId = useBattleStore((s) => s.selectedEventId);
  const selectEvent = useBattleStore((s) => s.selectEvent);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const projection = useMemo(
    () => (size.w > 0 && size.h > 0 ? createProjection(size.w, size.h) : null),
    [size],
  );

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || !size.w) return;
    const svg = select(svgEl);
    const z = zoom<SVGSVGElement, unknown>()
      .scaleExtent([MIN_ZOOM, MAX_ZOOM])
      .translateExtent([
        // 남쪽으로 넉넉히 — 철수로(횡성·원주·제천·충주)를 팬으로 따라갈 수 있게
        [-size.w * 0.3, -size.h * 0.2],
        [size.w * 1.3, size.h * 2.6],
      ])
      .on('zoom', (e) => setTransform(e.transform));
    svg.call(z);
    zoomRef.current = z;
    return () => {
      svg.on('.zoom', null);
    };
  }, [size]);

  /* 사건 선택 시 해당 지점으로 카메라 이동 */
  useEffect(() => {
    if (!selectedEventId || !projection || !zoomRef.current || !svgRef.current) return;
    const ev = eventById.get(selectedEventId);
    if (!ev) return;
    const [x, y] = project(projection, ev.coord);
    const k = Math.max(transformRef.current.k, 1.6);
    const t = zoomIdentity
      .translate(size.w / 2 - k * x, size.h / 2.3 - k * y)
      .scale(k);
    const svg = select(svgRef.current);
    if (prefersReducedMotion()) {
      svg.call(zoomRef.current.transform, t);
    } else {
      svg.transition().duration(650).call(zoomRef.current.transform, t);
    }
  }, [selectedEventId, projection, size]);

  return (
    <div ref={wrapRef} className="map-canvas-wrap">
      {projection && (
        <svg
          ref={svgRef}
          width={size.w}
          height={size.h}
          role="application"
          aria-label="춘천–홍천 전투 상황도. 마커를 선택하면 사건 상세가 표시됩니다."
          onClick={() => selectEvent(null)}
        >
          <defs>
            <pattern id="utm-grid" width={64} height={64} patternUnits="userSpaceOnUse">
              <path d="M64 0H0V64" fill="none" stroke="var(--grid-slate)" strokeWidth={1} />
            </pattern>
            <ArrowheadDefs />
          </defs>

          <rect width={size.w} height={size.h} fill="var(--map-buff)" />

          <g transform={transform.toString()}>
            {/* UTM풍 격자 — 지도(지리)와 함께 팬/줌 */}
            <rect
              x={-size.w}
              y={-size.h}
              width={size.w * 3}
              height={size.h * 4.5}
              fill="url(#utm-grid)"
            />
            <TerrainLayer projection={projection} />
            <FrontLineLayer projection={projection} />
            <ArrowLayer projection={projection} />
            <EventMarkers projection={projection} />
          </g>
        </svg>
      )}
    </div>
  );
}
