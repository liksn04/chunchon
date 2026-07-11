import { useEffect } from 'react';
import { days } from '../../data/days';
import { useBattleStore } from '../../store/useBattleStore';
import { prefersReducedMotion } from '../../lib/morph';

const STEP_MS = 4200;

export default function DayRail() {
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const playing = useBattleStore((s) => s.playing);
  const setDay = useBattleStore((s) => s.setDay);
  const play = useBattleStore((s) => s.play);
  const stop = useBattleStore((s) => s.stop);
  const advanceDay = useBattleStore((s) => s.advanceDay);

  /* 가이드 재생: STEP_MS 간격으로 다음 날짜로 진행, 마지막 날에서 자동 정지 */
  useEffect(() => {
    if (!playing) return;
    const ms = prefersReducedMotion() ? STEP_MS + 1200 : STEP_MS;
    const t = setInterval(advanceDay, ms);
    return () => clearInterval(t);
  }, [playing, advanceDay]);

  return (
    <nav className="day-rail" aria-label="날짜 필터">
      <button
        type="button"
        className="day-chip day-chip--play"
        aria-pressed={playing}
        aria-label={playing ? '브리핑 재생 정지' : '순차 브리핑 재생'}
        onClick={() => (playing ? stop() : play())}
      >
        {playing ? '⏸ 정지' : '▶ 브리핑'}
      </button>
      <button
        type="button"
        className="day-chip"
        aria-pressed={selectedDay === 'all'}
        onClick={() => setDay('all')}
      >
        전체
      </button>
      {days.map((d) => (
        <button
          key={d.date}
          type="button"
          className="day-chip"
          aria-pressed={selectedDay === d.date}
          title={d.headline}
          onClick={() => setDay(d.date)}
        >
          {d.label}
        </button>
      ))}
    </nav>
  );
}
