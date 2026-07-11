import { days, dayByDate } from '../../data/days';
import { planNote } from '../../data/plans';
import { useBattleStore } from '../../store/useBattleStore';
import StatBar from './StatBar';

export default function OverviewPanel() {
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const day = selectedDay === 'all' ? null : dayByDate.get(selectedDay);
  const dayIndex = day ? days.indexOf(day) : -1;

  return (
    <div className="panel-inner">
      <div className="panel-kicker">1950.06.25 – 07.01 · 강원 춘천·홍천·인제</div>
      <h2 className="panel-title">춘천–홍천 전투</h2>

      <table className="fact-table">
        <tbody>
          <tr>
            <th scope="row">국군</th>
            <td>제6보병사단 (사단장 대령 김종오) — 7·2·19연대, 16포병대대</td>
          </tr>
          <tr>
            <th scope="row">북한</th>
            <td>제2군단 (군단장 중장 김광협) — 2·12·15사단, 603모터찌클연대</td>
          </tr>
          <tr>
            <th scope="row">결과</th>
            <td>
              <span className="badge badge--rok">국군 승리</span>{' '}
              지연전 성공 후 전략적 후퇴
            </td>
          </tr>
        </tbody>
      </table>

      {day && (
        <div className="headline-box" aria-live="polite">
          <span className="headline-date">
            {day.label}
            {dayIndex >= 0 && ` (D+${dayIndex})`}
          </span>
          {day.headline}
        </div>
      )}

      <div className="panel-section">
        <h3>피해</h3>
        <StatBar />
      </div>

      <div className="panel-section">
        <h3>“3일 지연”의 전략적 의의</h3>
        <p className="panel-body">
          개전 초 전 전선이 무너지는 가운데 6사단만이 춘천–홍천에서 북한 2군단을
          약 3일간 붙들었다. 서울을 우회해 국군 주력을 포위섬멸하려던 북한군의
          계획은 이 지연으로 무산됐고, 서울 점령 후 북한군은 한강 앞에서 다시
          3일을 지체했다. 그 사이 국군은 한강 이남에서 재편성했고 UN군 참전
          시간을 벌어, 낙동강 방어선과 인천상륙작전으로 이어지는 반격의 발판이
          마련됐다.
        </p>
        <p className="panel-body" style={{ marginTop: 8 }}>
          문책으로 북한 2군단장 김광협, 2사단장 리청송, 12사단장 전우가
          해임됐다. 지도의 날짜 칩과 마커를 눌러 하루하루의 전개를 따라가 보라.
        </p>
        <p className="panel-body panel-body--note" style={{ marginTop: 8 }}>
          {planNote}
        </p>
      </div>

      <p className="source-note">
        전선·일부 지점 좌표는 도식화된 근사값(⚠)이며, 1950년 당시 지형(춘천댐
        담수 이전) 기준으로 단순 작도했다. 서술 출처: 국방부 군사편찬연구소
        『6.25 전쟁사』, 한국민족문화대백과 「춘천전투」 등을 재서술.
      </p>
    </div>
  );
}
