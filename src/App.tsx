import MapCanvas from './components/Map/MapCanvas';
import Legend from './components/Map/Legend';
import DayRail from './components/Timeline/DayRail';
import OverviewPanel from './components/Panel/OverviewPanel';
import EventDetailPanel from './components/Panel/EventDetailPanel';
import { useBattleStore } from './store/useBattleStore';

export default function App() {
  const selectedEventId = useBattleStore((s) => s.selectedEventId);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <span className="title-year">1950</span>춘천–홍천 전투 상황도
        </h1>
        <span className="app-subtitle">
          ROK 6TH DIV · 37°53′N 127°44′E · 1950.06.25–07.01
        </span>
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
