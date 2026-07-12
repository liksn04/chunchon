import { days } from '../../data/days';
import { useBattleStore } from '../../store/useBattleStore';
import { useT } from '../../i18n';

export default function DayRail() {
  const t = useT();
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const scrub = useBattleStore((s) => s.scrub);
  const playing = useBattleStore((s) => s.briefIndex !== null);
  const setDay = useBattleStore((s) => s.setDay);
  const play = useBattleStore((s) => s.play);
  const stop = useBattleStore((s) => s.stop);
  const setScrub = useBattleStore((s) => s.setScrub);
  const endScrub = useBattleStore((s) => s.endScrub);

  const dayIdx = selectedDay === 'all' ? 0 : days.findIndex((d) => d.date === selectedDay);
  const sliderVal = scrub ?? (dayIdx < 0 ? 0 : dayIdx);
  const isAll = selectedDay === 'all' && scrub === null;

  return (
    <div className="day-rail-wrap">
      <div className="day-scrubber">
        <span className="scrubber-cap">{t('rail.capStart')}</span>
        <input
          type="range"
          className={`scrubber ${isAll ? 'scrubber--idle' : ''}`}
          min={0}
          max={days.length - 1}
          step={0.02}
          value={sliderVal}
          aria-label="시간 스크러버 — 드래그하면 전선이 연속으로 남하합니다"
          onInput={(e) => setScrub(parseFloat(e.currentTarget.value))}
          onPointerUp={endScrub}
          onPointerCancel={endScrub}
          onBlur={endScrub}
          onKeyUp={endScrub}
        />
        <span className="scrubber-cap">{t('rail.capEnd')}</span>
      </div>

      <nav className="day-rail" aria-label="날짜 필터">
        <button
          type="button"
          className="day-chip day-chip--play"
          aria-pressed={playing}
          aria-label={playing ? '브리핑 정지' : '순차 브리핑 재생'}
          onClick={() => (playing ? stop() : play())}
        >
          {playing ? t('rail.stop') : t('rail.brief')}
        </button>
        <button
          type="button"
          className="day-chip"
          aria-pressed={selectedDay === 'all'}
          onClick={() => setDay('all')}
        >
          {t('rail.all')}
        </button>
        {days.map((d) => (
          <button
            key={d.date}
            type="button"
            className="day-chip"
            aria-pressed={selectedDay === d.date && scrub === null}
            title={d.headline}
            onClick={() => setDay(d.date)}
          >
            {d.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
