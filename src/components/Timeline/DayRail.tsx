import { days } from '../../data/days';
import { useBattleStore } from '../../store/useBattleStore';

export default function DayRail() {
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const setDay = useBattleStore((s) => s.setDay);

  return (
    <nav className="day-rail" aria-label="날짜 필터">
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
