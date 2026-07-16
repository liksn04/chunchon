import { useBattle } from '../../battles/useBattle';

/**
 * 일자별 전선 남하 속도(km/일) 막대그래프.
 * 각 날짜 전선의 평균 위도로 남하 거리를 구해 전일 대비 증분을 표시한다.
 * 6/25~6/28 "지연 3일" 구간은 하루 5~8km에 그치다가, 국군 철수 뒤 급가속하는
 * 이 전투의 핵심 서사를 한눈에 보여준다. (전선 좌표는 도식적 근사값)
 */
const KM_PER_DEG = 111.32;
const avgLat = (coords: [number, number][]) =>
  coords.reduce((s, c) => s + c[1], 0) / coords.length;

const W = 268;
const H = 128;
const PAD_L = 6;
const PAD_R = 6;
const PAD_T = 16;
const BASE_Y = H - 24;

/** 지연 구간: 국군이 붙들어 하루 남하가 작았던 6/26~6/28 (앞 3개) */
const DELAY_COUNT = 3;

export default function AdvanceChart() {
  const frontLines = useBattle().frontLines;

  const base = avgLat(frontLines[0].coordinates);
  const cumulative = frontLines.map((fl) => (base - avgLat(fl.coordinates)) * KM_PER_DEG);
  const daily = frontLines.slice(1).map((fl, i) => ({
    date: fl.date,
    label: `${Number(fl.date.slice(5, 7))}.${Number(fl.date.slice(8, 10))}`,
    km: Math.max(0, cumulative[i + 1] - cumulative[i]),
  }));
  const maxKm = Math.max(...daily.map((d) => d.km));
  const bandW = (W - PAD_L - PAD_R) / daily.length;
  const barW = bandW - 8;

  return (
    <figure className="advance-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="일자별 전선 남하 속도 막대그래프. 6월 26~28일은 하루 5~8km로 정체하다가 국군 철수 이후 급가속한다.">
        {/* 기준선 */}
        <line x1={PAD_L} y1={BASE_Y} x2={W - PAD_R} y2={BASE_Y} stroke="var(--ink-faint)" strokeWidth={1} />

        {/* 지연 3일 구간 표시 */}
        <line
          x1={PAD_L + 4}
          y1={BASE_Y + 9}
          x2={PAD_L + DELAY_COUNT * bandW - 4}
          y2={BASE_Y + 9}
          stroke="var(--amber-deep)"
          strokeWidth={1.4}
        />
        <text
          x={PAD_L + (DELAY_COUNT * bandW) / 2}
          y={BASE_Y + 19}
          textAnchor="middle"
          fontSize={8.5}
          fontFamily="var(--font-mono)"
          fill="var(--amber-deep)"
        >
          6사단 지연전 ≈ 3일
        </text>

        {daily.map((d, i) => {
          const h = maxKm > 0 ? (d.km / maxKm) * (BASE_Y - PAD_T) : 0;
          const x = PAD_L + i * bandW + (bandW - barW) / 2;
          const y = BASE_Y - h;
          const delay = i < DELAY_COUNT;
          return (
            <g key={d.date}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={3}
                fill="var(--nk)"
                opacity={delay ? 0.55 : 1}
              />
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={8.5} fontFamily="var(--font-mono)" fill="var(--ink-soft)">
                {Math.round(d.km)}
              </text>
              <text x={x + barW / 2} y={BASE_Y + 10} textAnchor="middle" fontSize={8.5} fontFamily="var(--font-mono)" fill="var(--ink-faint)">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption>
        일자별 전선 남하 <b>km/일</b> — 앞 3일은 하루 5~8km로 묶였다가 철수 뒤
        급가속. 세로축 최댓값 {Math.round(maxKm)}km. <span className="approx-mark">도식 근사</span>
      </figcaption>
    </figure>
  );
}
