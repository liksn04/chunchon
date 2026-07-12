import { useState } from 'react';
import { eventById } from '../../data/events';
import { unitById } from '../../data/units';
import { eventPeople, personById } from '../../data/people';
import { eventSources, sourceById, approxEventIds } from '../../data/sources';
import { useBattleStore } from '../../store/useBattleStore';
import { useT } from '../../i18n';
import PersonCard from './PersonCard';
import type { Outcome, AxisId } from '../../types';

const OUTCOME_CLS: Record<Outcome, string> = {
  rok: 'badge--rok',
  nk: 'badge--nk',
  mixed: 'badge--mixed',
  none: 'badge--none',
};

const AXIS_KEY: Record<AxisId, string> = {
  chuncheon: 'axis.chuncheon',
  'inje-hongcheon': 'axis.inje',
  both: 'axis.both',
};

function formatDate(date: string, time?: string) {
  const m = Number(date.slice(5, 7));
  const d = Number(date.slice(8, 10));
  return `1950.${m}.${d}${time ? ` ${time}` : ''}`;
}

export default function EventDetailPanel({ eventId }: { eventId: string }) {
  const t = useT();
  const selectEvent = useBattleStore((s) => s.selectEvent);
  const selectUnit = useBattleStore((s) => s.selectUnit);
  const [openPerson, setOpenPerson] = useState<string | null>(null);
  const ev = eventById.get(eventId);
  if (!ev) return null;

  const outcomeCls = OUTCOME_CLS[ev.outcome];
  const evUnits = ev.unitIds
    .map((id) => unitById.get(id))
    .filter((u) => u !== undefined);
  const persons = (eventPeople[ev.id] ?? [])
    .map((id) => personById.get(id))
    .filter((p) => p !== undefined);
  const refs = (eventSources[ev.id] ?? [])
    .map((id) => sourceById.get(id))
    .filter((s) => s !== undefined);
  const approx = approxEventIds.has(ev.id);

  return (
    <div className="panel-inner">
      <button
        type="button"
        className="close-btn"
        aria-label={t('panel.close')}
        onClick={() => selectEvent(null)}
      >
        ✕
      </button>
      <div className="panel-kicker">{t(AXIS_KEY[ev.axis])}</div>
      <h2 className="panel-title">
        {ev.key && '★ '}
        {ev.title}
      </h2>

      <div className="event-meta">
        <span className="meta-datetime">{formatDate(ev.date, ev.time)}</span>
        <span className={`badge ${outcomeCls}`}>{t(`outcome.${ev.outcome}`)}</span>
        {ev.key && <span className="badge badge--key">{t('badge.key')}</span>}
        {approx && (
          <span className="badge badge--approx" title="지도 위 위치는 도식적 근사값입니다">
            {t('badge.approx')}
          </span>
        )}
      </div>

      {evUnits.length > 0 && (
        <div className="panel-section">
          <h3>{t('panel.units')}</h3>
          <div className="unit-chips">
            {evUnits.map((u) => (
              <button
                key={u.id}
                type="button"
                className={`unit-chip unit-chip--btn unit-chip--${u.faction}`}
                onClick={() => selectUnit(u.id)}
                title={`${u.designation} 부대 기록`}
              >
                {u.designation}
                {u.commander && (
                  <span style={{ fontWeight: 400, opacity: 0.8 }}>{u.commander}</span>
                )}
                <span className="unit-chip-more">›</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {persons.length > 0 && (
        <div className="panel-section">
          <h3>{t('panel.people')}</h3>
          <div className="unit-chips">
            {persons.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`person-chip person-chip--${p.faction}`}
                onClick={() => setOpenPerson(p.id)}
              >
                <span className="person-chip-dot" aria-hidden="true">
                  {p.name.slice(0, 1)}
                </span>
                {p.name}
                <span className="person-chip-more">{t('person.more')}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="panel-section">
        <h3>{t('panel.course')}</h3>
        <p className="panel-body">{ev.detail}</p>
      </div>

      {ev.significance && (
        <div className="panel-section">
          <h3>{t('panel.meaning')}</h3>
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

      {refs.length > 0 && (
        <div className="panel-section">
          <h3>{t('panel.sources')}</h3>
          <ul className="source-list">
            {refs.map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noreferrer noopener">
                  {s.label}
                </a>
                <span className="source-pub"> · {s.publisher}</span>
              </li>
            ))}
          </ul>
          {approx && (
            <p className="source-note" style={{ marginTop: 8, borderTop: 'none', paddingTop: 0 }}>
              ≈ 표시 사건의 지도 좌표는 1950년 지형 기준의 도식적 근사값이며, 서술은
              위 출처를 재서술한 것입니다.
            </p>
          )}
        </div>
      )}

      {openPerson && (
        <PersonCard personId={openPerson} onClose={() => setOpenPerson(null)} />
      )}
    </div>
  );
}
