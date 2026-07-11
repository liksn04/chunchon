const MAX = 6900; // 스케일 기준: 북한군 피해 상한 추정치

export default function StatBar() {
  const rokPct = (407 / MAX) * 100;
  const nkLowPct = (2000 / MAX) * 100;

  return (
    <div className="statbar">
      <div className="statbar-row">
        <div className="statbar-label">
          <span className="who" style={{ color: 'var(--rok)' }}>
            국군 6사단
          </span>
          <span className="val">407명</span>
        </div>
        <div
          className="statbar-track"
          role="img"
          aria-label="국군 6사단 사상자 407명"
        >
          <div className="statbar-fill--rok" style={{ width: `${rokPct}%` }} />
        </div>
      </div>

      <div className="statbar-row">
        <div className="statbar-label">
          <span className="who" style={{ color: 'var(--nk)' }}>
            북한 2군단
          </span>
          <span className="val">약 2,000 ~ 6,900명</span>
        </div>
        <div
          className="statbar-track"
          role="img"
          aria-label="북한 2군단 사상자 약 2,000명(귀순자 증언)에서 6,900여 명(6사단 집계) 사이"
        >
          <div className="statbar-fill--nk" style={{ width: `${nkLowPct}%` }} />
          <div
            className="statbar-fill--range"
            style={{ width: `${100 - nkLowPct}%` }}
          />
        </div>
      </div>

      <p className="statbar-note">
        빗금은 집계 편차 구간(귀순자 증언 ~2,000 / 6사단 집계 6,900여).
        장비: SU-76 자주포·BA-64 장갑차 다수, T-34 수 대 격파 — 국군은 춘천 상실.
      </p>
    </div>
  );
}
