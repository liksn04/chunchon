/**
 * 1950년(6.25 당시)식 국군 계급장 — 도식 재현.
 * · 위관(소위·중위·대위): 은색 마름모(菱形) 1·2·3개
 * · 영관(소령·중령·대령): 원형에 대나무 잎 9개 + 가운데 마름모 1·2·3개
 * · 사병: 뒤집힌 'ㅅ'자(야마가다/갈매기) — 일등병 2개
 * 출처: 한국민족문화대백과 「육군」 등. (실물 사진이 아닌 도식)
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

const SILVER = '#dfe3e8';
const SILVER_EDGE = '#5b6470';
const GOLD = '#c9a24a';

/** 은색 마름모(菱형) — (cx, cy) 중심, 반너비 w / 반높이 h */
function Diamond({ cx, cy, w, h }: { cx: number; cy: number; w: number; h: number }) {
  return (
    <path
      d={`M${cx},${cy - h} L${cx + w},${cy} L${cx},${cy + h} L${cx - w},${cy} Z`}
      fill={SILVER}
      stroke={SILVER_EDGE}
      strokeWidth={0.8}
    />
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

  if (rank.tier === 'company') {
    const w = rank.n * 12;
    const xs = Array.from({ length: rank.n }, (_, i) => 6 + i * 12);
    return (
      <svg className="rank-insignia" viewBox={`0 0 ${w} 26`} role="img" aria-label={`계급장 ${rankRole}`}>
        {title && <title>{title}</title>}
        {xs.map((cx) => (
          <Diamond key={cx} cx={cx} cy={13} w={4.5} h={9} />
        ))}
      </svg>
    );
  }

  if (rank.tier === 'field') {
    // 대나무 잎 9개를 원형으로 배치
    const leaves = Array.from({ length: 9 }, (_, i) => {
      const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
      const cx = 15 + Math.cos(a) * 10.5;
      const cy = 15 + Math.sin(a) * 10.5;
      const deg = (a * 180) / Math.PI + 90;
      return (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={1.5}
          ry={3.4}
          fill={SILVER}
          stroke={SILVER_EDGE}
          strokeWidth={0.6}
          transform={`rotate(${deg} ${cx} ${cy})`}
        />
      );
    });
    const centers =
      rank.n === 1
        ? [15]
        : rank.n === 2
          ? [11, 19]
          : [8, 15, 22];
    return (
      <svg className="rank-insignia" viewBox="0 0 30 30" role="img" aria-label={`계급장 ${rankRole}`}>
        {title && <title>{title}</title>}
        <circle cx={15} cy={15} r={12.5} fill="none" stroke={SILVER_EDGE} strokeWidth={0.7} opacity={0.55} />
        {leaves}
        {centers.map((cy) => (
          <Diamond key={cy} cx={15} cy={cy} w={2.3} h={3.4} />
        ))}
      </svg>
    );
  }

  // 사병 — 뒤집힌 'ㅅ'(∧) 갈매기
  const rows = Array.from({ length: rank.n }, (_, i) => 6 + i * 5.5);
  return (
    <svg className="rank-insignia" viewBox={`0 0 18 ${6 + rank.n * 5.5}`} role="img" aria-label={`계급장 ${rankRole}`}>
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
