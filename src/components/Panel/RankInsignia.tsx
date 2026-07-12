/**
 * 6.25 전쟁기 국군 계급장 — 도식 재현(옷깃장 형).
 * · 위관(소위·중위·대위): 올리브 옷깃장에 은색 가로 막대 1·2·3개
 * · 영관(소령·중령·대령): 올리브 옷깃장에 무궁화(꽃무늬) 1·2·3개
 * · 사병: 뒤집힌 'ㅅ'(야마가다/갈매기) — 일등병 2개(옷깃장 아님, 소매 계급)
 * 참고: 6.25 당시 ROK 계급장 도표(옷깃장 실물). 실물 사진이 아닌 도식.
 */
type Tier = 'field' | 'company' | 'enlisted';

function parseRank(rankRole: string): { tier: Tier; n: number } | null {
  const r = rankRole;
  if (r.includes('대령')) return { tier: 'field', n: 3 };
  if (r.includes('중령')) return { tier: 'field', n: 2 };
  if (r.includes('소령')) return { tier: 'field', n: 1 };
  if (r.includes('대위')) return { tier: 'company', n: 3 };
  if (r.includes('중위')) return { tier: 'company', n: 2 };
  if (r.includes('소위')) return { tier: 'company', n: 1 };
  if (r.includes('병장')) return { tier: 'enlisted', n: 4 };
  if (r.includes('상병') || r.includes('상등병')) return { tier: 'enlisted', n: 3 };
  if (r.includes('일병') || r.includes('일등병')) return { tier: 'enlisted', n: 2 };
  if (r.includes('이병') || r.includes('이등병')) return { tier: 'enlisted', n: 1 };
  return null;
}

const SILVER = '#e2e6ea';
const SILVER_EDGE = '#8b929b';
const GOLD = '#c9a24a';

/** 무궁화(꽃무늬) 엠블럼 — (cx, cy) 중심 */
function Mugunghwa({ cx, cy }: { cx: number; cy: number }) {
  const petals = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return (
      <ellipse
        key={i}
        cx={cx + Math.cos(a) * 3}
        cy={cy + Math.sin(a) * 3}
        rx={2.1}
        ry={3}
        fill={SILVER}
        stroke={SILVER_EDGE}
        strokeWidth={0.5}
        transform={`rotate(${(a * 180) / Math.PI + 90} ${cx + Math.cos(a) * 3} ${cy + Math.sin(a) * 3})`}
      />
    );
  });
  return (
    <g>
      {petals}
      <circle cx={cx} cy={cy} r={2} fill="#b9202a" stroke={SILVER_EDGE} strokeWidth={0.5} />
    </g>
  );
}

export default function RankInsignia({
  rankRole,
  title,
}: {
  rankRole: string;
  title?: string;
}) {
  const rank = parseRank(rankRole);
  if (!rank) return null;

  // 사병 — 소매 갈매기(옷깃장 아님)
  if (rank.tier === 'enlisted') {
    const rows = Array.from({ length: rank.n }, (_, i) => 6 + i * 5.5);
    return (
      <svg
        className="rank-insignia rank-insignia--sleeve"
        viewBox={`0 0 18 ${6 + rank.n * 5.5}`}
        role="img"
        aria-label={`계급장 ${rankRole}`}
      >
        {title && <title>{title}</title>}
        {rows.map((y) => (
          <path
            key={y}
            d={`M2,${y + 3} L9,${y - 2.5} L16,${y + 3}`}
            fill="none"
            stroke={GOLD}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    );
  }

  // 위관·영관 — 올리브 옷깃장
  const H = 46;
  const W = 22;
  return (
    <svg className="rank-insignia" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`계급장 ${rankRole}`}>
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id="tab-olive" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5a6440" />
          <stop offset="1" stopColor="#414a2c" />
        </linearGradient>
      </defs>
      <rect x={1} y={1} width={W - 2} height={H - 2} rx={3} fill="url(#tab-olive)" stroke="#2c3220" strokeWidth={1} />

      {rank.tier === 'company'
        ? // 은색 막대 n개 (세로 중앙 정렬)
          (() => {
            const bh = 3.8;
            const gap = 4.6;
            const total = rank.n * bh + (rank.n - 1) * gap;
            const y0 = (H - total) / 2;
            return Array.from({ length: rank.n }, (_, i) => (
              <rect
                key={i}
                x={4.5}
                y={y0 + i * (bh + gap)}
                width={13}
                height={bh}
                rx={1.4}
                fill={SILVER}
                stroke={SILVER_EDGE}
                strokeWidth={0.6}
              />
            ));
          })()
        : // 무궁화 n개
          (() => {
            const gap = 12.5;
            const total = (rank.n - 1) * gap;
            const y0 = H / 2 - total / 2;
            return Array.from({ length: rank.n }, (_, i) => (
              <Mugunghwa key={i} cx={W / 2} cy={y0 + i * gap} />
            ));
          })()}
    </svg>
  );
}
