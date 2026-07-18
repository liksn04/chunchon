import type { BattleOverview } from '../../types';

/** 피해 비교 막대 — overview.stats 데이터 주도. rangeToPct는 집계 편차(빗금) 구간. */
export default function StatBar({ stats }: { stats: NonNullable<BattleOverview['stats']> }) {
  return (
    <div className="statbar">
      {stats.rows.map((row) => (
        <div className="statbar-row" key={row.who}>
          <div className="statbar-label">
            <span className="who" style={{ color: row.side === 'rok' ? 'var(--rok)' : 'var(--nk)' }}>
              {row.who}
            </span>
            <span className="val">{row.value}</span>
          </div>
          <div className="statbar-track" role="img" aria-label={row.aria}>
            <div
              className={row.side === 'rok' ? 'statbar-fill--rok' : 'statbar-fill--nk'}
              style={{ width: `${row.pct}%` }}
            />
            {row.rangeToPct !== undefined && (
              <div
                className="statbar-fill--range"
                style={{ width: `${row.rangeToPct - row.pct}%` }}
              />
            )}
          </div>
        </div>
      ))}
      {stats.note && <p className="statbar-note">{stats.note}</p>}
    </div>
  );
}
