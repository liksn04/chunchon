import { useEffect, useMemo, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import 'd3-transition';
import type { GeoProjection } from 'd3-geo';
import { createProjection, project } from '../../lib/projection';
import { prefersReducedMotion } from '../../lib/morph';
import { useBattleStore } from '../../store/useBattleStore';
import TerrainLayer from './TerrainLayer';
import FrontLineLayer from './FrontLineLayer';
import ArrowLayer, { ArrowheadDefs } from './ArrowLayer';
import PlanLayer from './PlanLayer';
import UnitLayer from './UnitLayer';
import EventMarkers from './EventMarkers';
import InsetMap from './InsetMap';
import BriefingCaption from '../Briefing/BriefingCaption';

const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const INSET = 14; // 도엽 테두리(neatline) 여백

function fmtDeg(v: number): string {
  const d = Math.floor(v);
  const m = Math.round((v - d) * 60) % 60;
  return `${d}°${String(m).padStart(2, '0')}′`;
}

/** 도엽 테두리 + 팬/줌을 따라가는 위경도 눈금 */
function GraticuleFrame({
  projection,
  transform,
  w,
  h,
}: {
  projection: GeoProjection;
  transform: ZoomTransform;
  w: number;
  h: number;
}) {
  const xOf = (lng: number) => transform.applyX(project(projection, [lng, 37.8])[0]);
  const yOf = (lat: number) => transform.applyY(project(projection, [127.9, lat])[1]);

  const pxPerTickX = Math.abs(xOf(127.8) - xOf(127.7));
  const labelEveryX = pxPerTickX >= 60 ? 1 : 2;
  const pxPerTickY = Math.abs(yOf(37.9) - yOf(37.8));
  const labelEveryY = pxPerTickY >= 44 ? 1 : 2;

  const lngTicks: { x: number; lng: number }[] = [];
  for (let i = 1265; i <= 1290; i++) {
    const lng = i / 10;
    const x = xOf(lng);
    if (x > INSET + 34 && x < w - INSET - 34) lngTicks.push({ x, lng });
  }
  const latTicks: { y: number; lat: number }[] = [];
  for (let i = 365; i <= 386; i++) {
    const lat = i / 10;
    const y = yOf(lat);
    if (y > INSET + 24 && y < h - INSET - 24) latTicks.push({ y, lat });
  }

  return (
    <g pointerEvents="none">
      <rect
        x={INSET - 4}
        y={INSET - 4}
        width={w - 2 * (INSET - 4)}
        height={h - 2 * (INSET - 4)}
        fill="none"
        stroke="var(--ink)"
        strokeWidth={0.8}
        opacity={0.75}
      />
      <rect
        x={INSET}
        y={INSET}
        width={w - 2 * INSET}
        height={h - 2 * INSET}
        fill="none"
        stroke="var(--ink)"
        strokeWidth={1.6}
      />
      {lngTicks.map(({ x, lng }) => (
        <g key={lng}>
          <line x1={x} y1={INSET} x2={x} y2={INSET + 5} stroke="var(--ink)" strokeWidth={1} />
          <line x1={x} y1={h - INSET} x2={x} y2={h - INSET - 5} stroke="var(--ink)" strokeWidth={1} />
          {Math.round(lng * 10) % labelEveryX === 0 && (
            <text x={x} y={INSET + 15} textAnchor="middle" className="frame-label">
              {fmtDeg(lng)}
            </text>
          )}
        </g>
      ))}
      {latTicks.map(({ y, lat }) => (
        <g key={lat}>
          <line x1={INSET} y1={y} x2={INSET + 5} y2={y} stroke="var(--ink)" strokeWidth={1} />
          <line x1={w - INSET} y1={y} x2={w - INSET - 5} y2={y} stroke="var(--ink)" strokeWidth={1} />
          {Math.round(lat * 10) % labelEveryY === 0 && (
            <text x={INSET + 8} y={y + 3} textAnchor="start" className="frame-label">
              {fmtDeg(lat)}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}

/** 방위표 */
function Compass({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`} pointerEvents="none" opacity={0.9}>
      <text
        y={-21}
        textAnchor="middle"
        fontSize={11}
        fontFamily="var(--font-display)"
        fontWeight={700}
        fill="var(--ink)"
      >
        N
      </text>
      <path d="M0,-16 L4.5,6 L0,1.5 Z" fill="var(--ink)" />
      <path d="M0,-16 L-4.5,6 L0,1.5 Z" fill="var(--map-buff)" stroke="var(--ink)" strokeWidth={1} />
      <circle r={2.4} fill="none" stroke="var(--ink)" strokeWidth={1} />
    </g>
  );
}

/** 현재 줌 배율에 맞는 축척바 값 계산 */
function computeScale(projection: GeoProjection, transform: ZoomTransform) {
  const xa = transform.applyX(project(projection, [127.8, 37.85])[0]);
  const xb = transform.applyX(project(projection, [127.9, 37.85])[0]);
  const pxPerDeg = Math.abs(xb - xa) * 10;
  const kmPerDeg = 111.32 * Math.cos((37.85 * Math.PI) / 180);
  const kmPerPx = kmPerDeg / pxPerDeg;
  const target = 88;
  const km = [1, 2, 5, 10, 20, 50].reduce(
    (best, c) =>
      Math.abs(c / kmPerPx - target) < Math.abs(best / kmPerPx - target) ? c : best,
    5,
  );
  return { km, px: km / kmPerPx };
}

export default function MapCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity);
  const transformRef = useRef(transform);
  transformRef.current = transform;

  const battle = useBattleStore((s) => s.battle);
  const selectedEventId = useBattleStore((s) => s.selectedEventId);
  const selectEvent = useBattleStore((s) => s.selectEvent);
  const briefIndex = useBattleStore((s) => s.briefIndex);

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
        // 서쪽(서울)·남쪽(철수로: 횡성·원주·제천·충주)·동쪽(설악)까지
        // 넓게 팬 가능하게 — 확장 릴리프 지형이 끊기지 않는 범위
        [-size.w * 1.5, -size.h * 0.5],
        [size.w * 1.7, size.h * 2.9],
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
    if (!selectedEventId || !projection || !zoomRef.current || !svgRef.current || !battle) return;
    const ev = battle.eventById.get(selectedEventId);
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
  }, [selectedEventId, projection, size, battle]);

  /* 브리핑 날짜 인트로 스텝: 전체 뷰로 카메라 리셋 */
  useEffect(() => {
    if (briefIndex === null || !zoomRef.current || !svgRef.current || !battle) return;
    if (battle.briefScript[briefIndex].eventId !== null) return; // 사건 스텝은 위 효과가 처리
    const svg = select(svgRef.current);
    if (prefersReducedMotion()) {
      svg.call(zoomRef.current.transform, zoomIdentity);
    } else {
      svg.transition().duration(850).call(zoomRef.current.transform, zoomIdentity);
    }
  }, [briefIndex, battle]);

  const scale = projection ? computeScale(projection, transform) : null;

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
            <TerrainLayer projection={projection} k={transform.k} detail={transform.k >= 1.6} />
            <PlanLayer projection={projection} k={transform.k} />
            <FrontLineLayer projection={projection} k={transform.k} />
            <ArrowLayer projection={projection} k={transform.k} />
            <UnitLayer projection={projection} k={transform.k} />
            <EventMarkers projection={projection} k={transform.k} />
          </g>

          {/* 화면 고정 도엽 요소 */}
          <GraticuleFrame projection={projection} transform={transform} w={size.w} h={size.h} />
          <Compass x={size.w - INSET - 26} y={size.h - INSET - 34} />
        </svg>
      )}

      {/* 인셋 미니맵 — 한반도 맥락 */}
      {projection && <InsetMap projection={projection} transform={transform} w={size.w} h={size.h} />}

      {/* 카투시 — 도엽명·축척 */}
      {scale && (
        <div className="cartouche" aria-hidden="true">
          <div className="cartouche-title">
            춘천–홍천 <span>CHUNCHEON — HONGCHEON</span>
          </div>
          <div className="cartouche-sub">
            군 작전상황도(도식) · 1950. 6.
            <span className="cartouche-stamp">사본 № 3</span>
          </div>
          <svg width={scale.px + 10} height={19} className="scalebar">
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={4 + (i * scale.px) / 4}
                y={2}
                width={scale.px / 4}
                height={5}
                fill={i % 2 ? 'transparent' : 'var(--ink)'}
                stroke="var(--ink)"
                strokeWidth={1}
              />
            ))}
            <text x={3} y={17} fontSize={8} fontFamily="var(--font-mono)" fill="var(--ink)">
              0
            </text>
            <text
              x={4 + scale.px}
              y={17}
              textAnchor="end"
              fontSize={8}
              fontFamily="var(--font-mono)"
              fill="var(--ink)"
            >
              {scale.km} km
            </text>
          </svg>
        </div>
      )}

      <BriefingCaption />
    </div>
  );
}
