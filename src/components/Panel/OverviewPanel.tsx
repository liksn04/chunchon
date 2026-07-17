import { sourceById } from '../../data/shared/sources';
import { useBattleStore } from '../../store/useBattleStore';
import { useBattle } from '../../battles/useBattle';
import { useT } from '../../i18n';
import StatBar from './StatBar';
import AdvanceChart from './AdvanceChart';

function DataDrivenOverview() {
  const { meta, overview, days, dayByDate } = useBattle();
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const day = selectedDay === 'all' ? null : dayByDate.get(selectedDay);
  const dayIndex = day ? days.indexOf(day) : -1;
  if (!overview) return null;

  const tone = overview.result.tone ?? 'rok';
  const badgeClass = tone === 'nk' ? 'badge--nk' : 'badge--rok';

  return (
    <div className="panel-inner">
      <div className="panel-kicker">{overview.kicker}</div>
      <h2 className="panel-title">{meta.name.ko}</h2>

      <table className="fact-table">
        <tbody>
          <tr>
            <th scope="row">국군·유엔군</th>
            <td>{overview.rok}</td>
          </tr>
          <tr>
            <th scope="row">북한군</th>
            <td>{overview.nk}</td>
          </tr>
          <tr>
            <th scope="row">결과</th>
            <td>
              <span className={`badge ${badgeClass}`}>{overview.result.label}</span>{' '}
              {overview.result.note}
            </td>
          </tr>
        </tbody>
      </table>

      {day && (
        <div className="headline-box" aria-live="polite">
          <span className="headline-date">
            {day.label}
            {dayIndex >= 0 && ` (국면 ${dayIndex + 1})`}
          </span>
          {day.headline}
        </div>
      )}

      {overview.sections.map((section) => (
        <div className="panel-section" key={section.title}>
          <h3>{section.title}</h3>
          {section.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className={`panel-body${section.note ? ' panel-body--note' : ''}`}
              style={i > 0 ? { marginTop: 8 } : undefined}
            >
              {paragraph}
            </p>
          ))}
        </div>
      ))}

      <p className="source-note">{overview.sourceNote}</p>
    </div>
  );
}

function ChuncheonOverview() {
  const t = useT();
  const { days, dayByDate, plans } = useBattle();
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const day = selectedDay === 'all' ? null : dayByDate.get(selectedDay);
  const dayIndex = day ? days.indexOf(day) : -1;

  return (
    <div className="panel-inner">
      <div className="panel-kicker">1950.06.25 – 07.01 · 강원 춘천·홍천·인제</div>
      <h2 className="panel-title">{t('panel.battle')}</h2>

      <table className="fact-table">
        <tbody>
          <tr>
            <th scope="row">{t('panel.rok')}</th>
            <td>제6보병사단 (사단장 대령 김종오) — 7·2·19연대, 16포병대대</td>
          </tr>
          <tr>
            <th scope="row">{t('panel.nk')}</th>
            <td>제2군단 (군단장 중장 김광협) — 2·12·15사단, 603모터찌클연대</td>
          </tr>
          <tr>
            <th scope="row">{t('panel.result')}</th>
            <td>
              <span className="badge badge--rok">{t('panel.rokWin')}</span>{' '}
              {t('panel.rokWinNote')}
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
        <h3>{t('panel.casualties')}</h3>
        <StatBar />
      </div>

      <div className="panel-section">
        <h3>{t('panel.advance')}</h3>
        <AdvanceChart />
      </div>

      <div className="panel-section">
        <h3>{t('panel.significance')}</h3>
        <p className="panel-body">
          개전 초 전 전선이 무너지는 가운데 6사단만이 춘천–홍천에서 북한 2군단을
          약 3일간 붙들었다. 서울을 우회해 국군 주력을 포위섬멸하려던 북한군의
          계획은 이 지연으로 무산됐고, 서울을 점령한 북한군 주력조차 2군단이
          수원으로 우회해 퇴로를 끊어주기를 기다리며 한강 앞에서 3일을 지체했다.
          북한군의 양평 도하는 7월 1일, 수원 도달은 7월 5일로 늦춰졌고, 그때는
          이미 국군이 한강 방어선을 재편성한 뒤였다.
        </p>
        <p className="panel-body" style={{ marginTop: 8 }}>
          이 시간에 서부전선 잔존 병력은 한강 남안에 방어선을 폈고(한강 방어선
          전투 전몰장병 약 1,000명 — 2016년 동작구 노들나루공원 명비), 동해안에
          고립됐던 국군 8사단은 태백산맥을 넘어 전력을 보존했으며, 미 24사단 등
          UN군 참전 시간이 확보됐다 — 낙동강 방어선·인천상륙작전으로 이어지는
          반격의 발판. 패전 책임으로 북한 2군단장 김광협, 2사단장 리청송,
          12사단장 전우가 해임됐다.
        </p>
        {plans && (
          <p className="panel-body panel-body--note" style={{ marginTop: 8 }}>
            {plans.note}
          </p>
        )}
      </div>

      <div className="panel-section">
        <h3>{t('panel.shadow')}</h3>
        <p className="panel-body">
          전술적 성공의 이면에는 어두운 기록도 있다. 6사단의 후방 철수와 같은
          시기, 충북 등지에서는 국민보도연맹원·예비검속 대상 민간인들이 군·경에
          의해 집단 학살됐다. 진실·화해를위한과거사정리위원회 조사에 따르면
          청주·청원 일대에서만 2,300명 이상이 희생된 것으로 추정된다. 구국의
          지연전과 개전 초기의 민간인 학살은 같은 시기에 겹쳐 일어난, 함께
          기억해야 할 역사다.{' '}
          <a
            href={sourceById.get('jinsil-bodo')?.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            (진실화해위 자료)
          </a>
        </p>
      </div>

      <p className="source-note">
        전선·일부 지점 좌표는 도식화된 근사값(⚠)이며, 1950년 당시 지형(춘천댐
        담수 이전) 기준으로 단순 작도했다. 전과 수치는 사료마다 편차가 있어
        보수적으로 표기했다. 서술 출처: 국방부 군사편찬연구소 『6.25 전쟁사』,
        한국민족문화대백과 「춘천전투」, 중앙일보·강원일보 보도 등을 재서술.
      </p>
    </div>
  );
}

export default function OverviewPanel() {
  const { overview } = useBattle();
  return overview ? <DataDrivenOverview /> : <ChuncheonOverview />;
}
