import { useEffect, useRef } from 'react';
import MapCanvas from './components/Map/MapCanvas';
import Legend from './components/Map/Legend';
import DayRail from './components/Timeline/DayRail';
import OverviewPanel from './components/Panel/OverviewPanel';
import EventDetailPanel from './components/Panel/EventDetailPanel';
import UnitCard from './components/Panel/UnitCard';
import Coachmarks from './components/Onboarding/Coachmarks';
import { useBattleStore, briefScript } from './store/useBattleStore';
import { useT } from './i18n';
import { days, dayByDate } from './data/days';
import { eventById } from './data/events';

const DAY_ORDER: (string | 'all')[] = ['all', ...days.map((d) => d.date)];

/** 날짜를 한 칸 이동 ('전체' ↔ 6/25 … 7/1) */
function stepDay(dir: 1 | -1) {
  const st = useBattleStore.getState();
  if (st.briefIndex !== null) return;
  const cur = DAY_ORDER.indexOf(st.selectedDay);
  const next = Math.max(0, Math.min(DAY_ORDER.length - 1, (cur < 0 ? 0 : cur) + dir));
  st.setDay(DAY_ORDER[next]);
}

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
  const lang = useBattleStore((s) => s.lang);
  const toggleLang = useBattleStore((s) => s.toggleLang);
  const t = useT();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    // iOS Safari 상단바 색을 지도 표면에 맞춤
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_SURFACE[theme]);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

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

  /* 키보드: ←/→ 날짜 이동 · Esc 상세 닫기 · Space 브리핑 토글 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
      const st = useBattleStore.getState();
      if (e.key === 'ArrowRight') stepDay(1);
      else if (e.key === 'ArrowLeft') stepDay(-1);
      else if (e.key === 'Escape') st.selectEvent(null);
      else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (st.briefIndex !== null) st.stop();
        else st.play();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* 터치 스와이프(패널): ←다음 날짜 / →이전 날짜 */
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    swipe.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!swipe.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - swipe.current.x;
    const dy = t.clientY - swipe.current.y;
    swipe.current = null;
    if (Math.abs(dx) > 55 && Math.abs(dy) < 45) stepDay(dx < 0 ? 1 : -1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <span className="title-year">1950</span>춘천–홍천 전투 상황도
        </h1>
        <span className="app-subtitle">{t('app.subtitle')}</span>
        <div className="header-toggles">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleLang}
            aria-label={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
          >
            {t('app.lang')}
          </button>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? '야간(지휘소 콘솔) 모드로 전환' : '주간 모드로 전환'}
          >
            {theme === 'light' ? t('app.toDark') : t('app.toLight')}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="map-area">
          <MapCanvas />
          <Legend />
          <DayRail />
        </div>

        <aside
          className="side-panel"
          aria-label="개요 및 사건 상세"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {selectedEventId ? (
            <EventDetailPanel eventId={selectedEventId} />
          ) : (
            <OverviewPanel />
          )}
        </aside>
      </main>

      <UnitCard />
      <Coachmarks />
    </div>
  );
}
