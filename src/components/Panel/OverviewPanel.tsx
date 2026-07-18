import { sourceById } from '../../data/shared/sources';
import { useBattleStore } from '../../store/useBattleStore';
import { useBattle } from '../../battles/useBattle';
import { useT } from '../../i18n';
import StatBar from './StatBar';
import AdvanceChart from './AdvanceChart';

/**
 * 전투 개요 패널 — 모든 전투가 overview 데이터(BattleOverview) 하나로 렌더된다.
 * 선택 섹션(stats·advance)은 데이터가 제공될 때만 표시. (지도 스타일 표준 §개요)
 */
export default function OverviewPanel() {
  const t = useT();
  const { meta, overview, days, dayByDate, plans } = useBattle();
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const day = selectedDay === 'all' ? null : dayByDate.get(selectedDay);
  const dayIndex = day ? days.indexOf(day) : -1;
  if (!overview) return null;

  const tone = overview.result.tone ?? 'rok';
  const badgeClass = tone === 'nk' ? 'badge--nk' : 'badge--rok';
  const counter =
    dayIndex < 0
      ? ''
      : overview.dayCounter === 'dplus'
        ? ` (D+${dayIndex})`
        : ` (국면 ${dayIndex + 1})`;

  return (
    <div className="panel-inner">
      <div className="panel-kicker">{overview.kicker}</div>
      <h2 className="panel-title">{meta.name.ko}</h2>

      <table className="fact-table">
        <tbody>
          <tr>
            <th scope="row">{overview.rokHeader ?? t('panel.rok')}</th>
            <td>{overview.rok}</td>
          </tr>
          <tr>
            <th scope="row">{overview.nkHeader ?? t('panel.nk')}</th>
            <td>{overview.nk}</td>
          </tr>
          <tr>
            <th scope="row">{t('panel.result')}</th>
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
            {counter}
          </span>
          {day.headline}
        </div>
      )}

      {overview.stats && (
        <div className="panel-section">
          <h3>{t('panel.casualties')}</h3>
          <StatBar stats={overview.stats} />
        </div>
      )}

      {overview.advance && (
        <div className="panel-section">
          <h3>{t('panel.advance')}</h3>
          <AdvanceChart advance={overview.advance} />
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
              {section.link && i === section.paragraphs.length - 1 && (
                <>
                  {' '}
                  <a
                    href={sourceById.get(section.link.sourceId)?.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {section.link.label}
                  </a>
                </>
              )}
            </p>
          ))}
        </div>
      ))}

      {plans?.note && (
        <p className="panel-body panel-body--note" style={{ marginTop: 8 }}>
          {plans.note}
        </p>
      )}

      <p className="source-note">{overview.sourceNote}</p>
    </div>
  );
}
