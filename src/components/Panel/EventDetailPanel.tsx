import { eventById } from '../../data/events';
import { unitById } from '../../data/units';
import { useBattleStore } from '../../store/useBattleStore';
import type { Outcome, AxisId } from '../../types';

const OUTCOME_LABEL: Record<Outcome, { text: string; cls: string }> = {
  rok: { text: '국군 우세', cls: 'badge--rok' },
  nk: { text: '북한군 우세', cls: 'badge--nk' },
  mixed: { text: '혼전', cls: 'badge--mixed' },
  none: { text: '—', cls: 'badge--none' },
};

const AXIS_LABEL: Record<AxisId, string> = {
  chuncheon: '춘천 축',
  'inje-hongcheon': '인제–홍천 축',
  both: '양축',
};

function formatDate(date: string, time?: string) {
  const m = Number(date.slice(5, 7));
  const d = Number(date.slice(8, 10));
  return `1950.${m}.${d}${time ? ` ${time}` : ''}`;
}

export default function EventDetailPanel({ eventId }: { eventId: string }) {
  const selectEvent = useBattleStore((s) => s.selectEvent);
  const ev = eventById.get(eventId);
  if (!ev) return null;

  const outcome = OUTCOME_LABEL[ev.outcome];
  const evUnits = ev.unitIds
    .map((id) => unitById.get(id))
    .filter((u) => u !== undefined);

  return (
    <div className="panel-inner">
      <button
        type="button"
        className="close-btn"
        aria-label="상세 닫기, 개요로 돌아가기"
        onClick={() => selectEvent(null)}
      >
        ✕
      </button>
      <div className="panel-kicker">{AXIS_LABEL[ev.axis]}</div>
      <h2 className="panel-title">
        {ev.key && '★ '}
        {ev.title}
      </h2>

      <div className="event-meta">
        <span className="meta-datetime">{formatDate(ev.date, ev.time)}</span>
        <span className={`badge ${outcome.cls}`}>{outcome.text}</span>
        {ev.key && <span className="badge badge--key">핵심 사건</span>}
      </div>

      {evUnits.length > 0 && (
        <div className="panel-section">
          <h3>교전 부대</h3>
          <div className="unit-chips">
            {evUnits.map((u) => (
              <span key={u.id} className={`unit-chip unit-chip--${u.faction}`}>
                {u.designation}
                {u.commander && (
                  <span style={{ fontWeight: 400, opacity: 0.8 }}>{u.commander}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="panel-section">
        <h3>경과</h3>
        <p className="panel-body">{ev.detail}</p>
      </div>

      {ev.significance && (
        <div className="panel-section">
          <h3>의의</h3>
          <p className="panel-body">{ev.significance}</p>
        </div>
      )}

      {ev.tags && ev.tags.length > 0 && (
        <div className="tag-list">
          {ev.tags.map((t) => (
            <span key={t} className="tag">
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
