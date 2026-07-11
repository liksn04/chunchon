import { useEffect, useState } from 'react';
import { useBattleStore, briefScript } from '../../store/useBattleStore';
import { eventById } from '../../data/events';
import { dayByDate } from '../../data/days';
import { prefersReducedMotion } from '../../lib/morph';

function fmtDate(date: string, time?: string) {
  const m = Number(date.slice(5, 7));
  const d = Number(date.slice(8, 10));
  return `1950.${m}.${d}${time ? ` ${time}` : ''}`;
}

/** 브리핑 중 지도 하단에 뜨는 군용 전문(電文) 자막 — 타자기 효과 */
export default function BriefingCaption() {
  const briefIndex = useBattleStore((s) => s.briefIndex);
  const stop = useBattleStore((s) => s.stop);
  const setBriefStep = useBattleStore((s) => s.setBriefStep);

  const step = briefIndex !== null ? briefScript[briefIndex] : null;
  const ev = step?.eventId ? eventById.get(step.eventId) : null;
  const day = step ? dayByDate.get(step.date) : null;

  const meta = step
    ? ev
      ? `전문 № ${String(briefIndex! + 1).padStart(2, '0')} · ${fmtDate(ev.date, ev.time)} · 발신 6사단 → 육본`
      : `상황보고 · ${fmtDate(step.date)} · 제6사단사령부`
    : '';
  const body = step ? (ev ? `${ev.title} — ${ev.summary}` : day?.headline ?? '') : '';

  // 타자기 효과
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!body) return;
    if (prefersReducedMotion()) {
      setShown(body.length);
      return;
    }
    setShown(0);
    const t = setInterval(() => {
      setShown((n) => {
        if (n >= body.length) {
          clearInterval(t);
          return n;
        }
        return n + 1;
      });
    }, 22);
    return () => clearInterval(t);
  }, [body]);

  if (briefIndex === null || !step) return null;

  return (
    <div className="brief-caption" role="status" aria-live="polite">
      <div className="brief-caption-text">
        <div className="brief-meta">{meta}</div>
        <div className="brief-body">
          {body.slice(0, shown)}
          {shown < body.length && <span className="brief-cursor">▌</span>}
        </div>
      </div>
      <div className="brief-controls">
        <button
          type="button"
          aria-label="이전 장면"
          onClick={() => setBriefStep(briefIndex - 1)}
          disabled={briefIndex === 0}
        >
          ⏮
        </button>
        <button type="button" aria-label="브리핑 정지" onClick={stop}>
          ⏸
        </button>
        <button
          type="button"
          aria-label="다음 장면"
          onClick={() => setBriefStep(briefIndex + 1)}
          disabled={briefIndex >= briefScript.length - 1}
        >
          ⏭
        </button>
        <span className="brief-progress">
          {briefIndex + 1}/{briefScript.length}
        </span>
      </div>
    </div>
  );
}
