import { useEffect } from 'react';
import MapCanvas from './components/Map/MapCanvas';
import Legend from './components/Map/Legend';
import DayRail from './components/Timeline/DayRail';
import OverviewPanel from './components/Panel/OverviewPanel';
import EventDetailPanel from './components/Panel/EventDetailPanel';
import { useBattleStore } from './store/useBattleStore';

const THEME_SURFACE = { light: '#e4dec9', dark: '#131a24' } as const;

export default function App() {
  const selectedEventId = useBattleStore((s) => s.selectedEventId);
  const theme = useBattleStore((s) => s.theme);
  const toggleTheme = useBattleStore((s) => s.toggleTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    // iOS Safari 상단바 색을 지도 표면에 맞춤
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_SURFACE[theme]);
  }, [theme]);

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
