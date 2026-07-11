import { useEffect } from 'react';
import MapCanvas from './components/Map/MapCanvas';
import Legend from './components/Map/Legend';
import DayRail from './components/Timeline/DayRail';
import OverviewPanel from './components/Panel/OverviewPanel';
import EventDetailPanel from './components/Panel/EventDetailPanel';
import { useBattleStore, briefScript } from './store/useBattleStore';
import { dayByDate } from './data/days';
import { eventById } from './data/events';

const THEME_SURFACE = { light: '#e4dec9', dark: '#131a24' } as const;

/** '1950-06-27' ↔ '0627' */
const toParam = (date: string) => date.slice(5, 7) + date.slice(8, 10);
const fromParam = (p: string) => `1950-${p.slice(0, 2)}-${p.slice(2)}`;

export default function App() {
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const selectedEventId = useBattleStore((s) => s.selectedEventId);
  const briefIndex = useBattleStore((s) => s.briefIndex);
  const advanceBrief = useBattleStore((s) => s.advanceBrief);
  const theme = useBattleStore((s) => s.theme);
  const toggleTheme = useBattleStore((s) => s.toggleTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    // iOS Safari 상단바 색을 지도 표면에 맞춤
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_SURFACE[theme]);
  }, [theme]);

  /* 브리핑 진행 타이머: 날짜 인트로 3초, 사건 5.6초 */
  useEffect(() => {
    if (briefIndex === null) return;
    const dur = briefScript[briefIndex].eventId ? 5600 : 3000;
    const t = setTimeout(advanceBrief, dur);
    return () => clearTimeout(t);
  }, [briefIndex, advanceBrief]);

  /* 딥링크: 최초 로드 시 ?day=0627&event=garaemok 복원 */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const day = p.get('day');
    const ev = p.get('event');
    const patch: { selectedDay?: string; selectedEventId?: string } = {};
    if (day && /^\d{4}$/.test(day) && dayByDate.has(fromParam(day))) {
      patch.selectedDay = fromParam(day);
    }
    if (ev && eventById.has(ev)) patch.selectedEventId = ev;
    if (Object.keys(patch).length) useBattleStore.setState(patch);
  }, []);

  /* 딥링크: 상태 → URL 동기화 */
  useEffect(() => {
    const p = new URLSearchParams();
    if (selectedDay !== 'all') p.set('day', toParam(selectedDay));
    if (selectedEventId) p.set('event', selectedEventId);
    const q = p.toString();
    window.history.replaceState(null, '', q ? `?${q}` : window.location.pathname);
  }, [selectedDay, selectedEventId]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <span className="title-year">1950</span>춘천–홍천 전투 상황도
        </h1>
        <span className="app-subtitle">
          ROK 6TH DIV · 37°53′N 127°44′E · 1950.06.25–07.01
        </span>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? '야간(지휘소 콘솔) 모드로 전환' : '주간 모드로 전환'}
        >
          {theme === 'light' ? '◐ 야간' : '◑ 주간'}
        </button>
      </header>

      <main className="app-main">
        <div className="map-area">
          <MapCanvas />
          <Legend />
          <DayRail />
        </div>

        <aside className="side-panel" aria-label="개요 및 사건 상세">
          {selectedEventId ? (
            <EventDetailPanel eventId={selectedEventId} />
          ) : (
            <OverviewPanel />
          )}
        </aside>
      </main>
    </div>
  );
}
