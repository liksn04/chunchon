import { battleMetas } from '../../battles/registry';
import { navigate } from '../../router';
import { useT } from '../../i18n';
import type { WarPhase } from '../../types';
import './BattleIndex.css';

/** 국면 표시 순서 */
const PHASE_ORDER: WarPhase[] = ['invasion', 'naktong', 'counter', 'ccf', 'stalemate'];

/**
 * 전투 목록(임시) — 시기별로 묶은 메타 카드. available은 클릭 시 상황도로,
 * planned는 "준비 중" 회색 카드. 후속 단계에서 한반도 지도 버전으로 교체된다.
 */
export default function BattleIndex() {
  const t = useT();
  const groups = PHASE_ORDER.map((phase) => ({
    phase,
    items: battleMetas.filter((m) => m.phase === phase),
  })).filter((g) => g.items.length > 0);

  return (
    <main className="index-main">
      {groups.map(({ phase, items }) => (
        <section key={phase} className="index-phase">
          <h2 className="index-phase-title">{t(`phase.${phase}`)}</h2>
          <div className="index-grid">
            {items.map((m) => {
              const available = m.status === 'available';
              return (
                <button
                  key={m.id}
                  type="button"
                  className={`index-card${available ? '' : ' index-card--planned'}`}
                  disabled={!available}
                  aria-label={`${m.name.ko} — ${available ? t('index.available') : t('index.planned')}`}
                  onClick={() => available && navigate(`/b/${m.id}`)}
                >
                  <div className="index-card-head">
                    <span className="index-card-name">{m.name.ko}</span>
                    <span className={`index-badge${available ? ' index-badge--on' : ''}`}>
                      {available ? t('index.available') : t('index.planned')}
                    </span>
                  </div>
                  <div className="index-card-dates">
                    {m.dateRange.start} – {m.dateRange.end}
                  </div>
                  <p className="index-card-summary">{m.summary}</p>
                  {available && <span className="index-card-open">{t('index.open')}</span>}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
