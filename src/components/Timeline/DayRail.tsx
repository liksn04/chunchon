import { days } from '../../data/days';
import { useBattleStore } from '../../store/useBattleStore';

export default function DayRail() {
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const playing = useBattleStore((s) => s.briefIndex !== null);
  const setDay = useBattleStore((s) => s.setDay);
  const play = useBattleStore((s) => s.play);
  const stop = useBattleStore((s) => s.stop);

  return (
    <nav className="day-rail" aria-label="날짜 필터">
      <button
        type="button"
        className="day-chip day-chip--play"
        aria-pressed={playing}
        aria-label={playing ? '브리핑 정지' : '순차 브리핑 재생'}
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
