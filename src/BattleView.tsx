import { useEffect, useRef } from 'react';
import MapCanvas from './components/Map/MapCanvas';
import Legend from './components/Map/Legend';
import DayRail from './components/Timeline/DayRail';
import OverviewPanel from './components/Panel/OverviewPanel';
import EventDetailPanel from './components/Panel/EventDetailPanel';
import UnitCard from './components/Panel/UnitCard';
import EquipmentCard from './components/Panel/EquipmentCard';
import Coachmarks from './components/Onboarding/Coachmarks';
import TitleIntro from './components/Onboarding/TitleIntro';
import { useBattleStore } from './store/useBattleStore';
import { battleById } from './battles/registry';
import { navigate } from './router';
import { useT } from './i18n';

/** 날짜를 한 칸 이동 ('전체' ↔ 각 날짜) */
function stepDay(dir: 1 | -1) {
  const st = useBattleStore.getState();
  if (st.briefIndex !== null || !st.battle) return;
  const order = st.battle.dayOrder;
  const cur = order.indexOf(st.selectedDay);
  const next = Math.max(0, Math.min(order.length - 1, (cur < 0 ? 0 : cur) + dir));
  st.setDay(order[next]);
}

/** '1950-06-27' → '0627' (월-일) */
const toParam = (date: string) => date.slice(5, 7) + date.slice(8, 10);

/** 딥링크 day 파라미터('MMDD' 또는 'YYYYMMDD')를 활성 전투의 실제 날짜로 해석 */
function resolveDayParam(param: string, dates: string[]): string | null {
  if (/^\d{8}$/.test(param)) {
    return dates.find((d) => d.replaceAll('-', '') === param) ?? null;
  }
  if (/^\d{4}$/.test(param)) {
    return dates.find((d) => toParam(d) === param) ?? null;
  }
  return null;
}

export default function BattleView({ battleId }: { battleId: string }) {
  const t = useT();
  const battle = useBattleStore((s) => s.battle);
  const loadBattle = useBattleStore((s) => s.loadBattle);
  const battleError = useBattleStore((s) => s.battleError);
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const selectedEventId = useBattleStore((s) => s.selectedEventId);
  const briefIndex = useBattleStore((s) => s.briefIndex);
  const advanceBrief = useBattleStore((s) => s.advanceBrief);

  const meta = battleById.get(battleId);
  // 알 수 없는 id → 안내 화면(자동 이동 없이 URL 유지) · planned → 목록으로
  const notFound = !meta;
  const planned = !!meta && meta.status === 'planned';

  useEffect(() => {
    // planned 전투는 목록에서 링크되지 않으므로 조용히 목록으로 되돌린다
    if (planned) {
      navigate('/');
      return;
    }
    if (notFound) return; // 안내 화면 표시, 로드하지 않음
    loadBattle(battleId);
  }, [battleId, loadBattle, notFound, planned]);

  const ready = !!battle && battle.meta.id === battleId;
  const loadFailed = battleError === battleId;

  /* 브리핑 진행 타이머: 날짜 인트로 3초, 사건 5.6초 */
  useEffect(() => {
    if (briefIndex === null || !battle) return;
    const dur = battle.briefScript[briefIndex].eventId ? 5600 : 3000;
    const t = setTimeout(advanceBrief, dur);
    return () => clearTimeout(t);
  }, [briefIndex, advanceBrief, battle]);

  /* 딥링크: 전투 로드 후 1회 ?day=0627&event=garaemok 복원 */
  const restoredRef = useRef(false);
  useEffect(() => {
    if (!ready || !battle || restoredRef.current) return;
    restoredRef.current = true;
    const p = new URLSearchParams(window.location.search);
    const day = p.get('day');
    const ev = p.get('event');
    const patch: { selectedDay?: string; selectedEventId?: string } = {};
    if (day) {
      const resolved = resolveDayParam(
        day,
        battle.days.map((d) => d.date),
      );
      if (resolved) patch.selectedDay = resolved;
    }
    if (ev && battle.eventById.has(ev)) patch.selectedEventId = ev;
    if (Object.keys(patch).length) useBattleStore.setState(patch);
  }, [ready, battle]);

  /* 딥링크: 상태 → URL 동기화 (복원 완료 후에만) */
  useEffect(() => {
    if (!restoredRef.current) return;
    const p = new URLSearchParams();
    if (selectedDay !== 'all') p.set('day', toParam(selectedDay));
    if (selectedEventId) p.set('event', selectedEventId);
    const q = p.toString();
    window.history.replaceState(null, '', `/b/${battleId}${q ? `?${q}` : ''}`);
  }, [selectedDay, selectedEventId, battleId, battle]);

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

  // 알 수 없는 전투 id → 안내 화면 (URL은 /b/:id 그대로 유지)
  if (notFound) {
    return (
      <div className="battle-notice" role="alert">
        <div className="battle-notice-card">
          <div className="battle-notice-kicker">404 · 상황도</div>
          <h1 className="battle-notice-title">{t('battle.notFound')}</h1>
          <p className="battle-notice-id">/b/{battleId}</p>
          <button
            type="button"
            className="battle-notice-btn"
            onClick={() => navigate('/')}
          >
            {t('battle.toIndex')}
          </button>
        </div>
      </div>
    );
  }

  // 전투 데이터 로드 실패 → 재시도 UI
  if (loadFailed) {
    return (
      <div className="battle-notice" role="alert">
        <div className="battle-notice-card">
          <div className="battle-notice-kicker">ERROR · 상황도</div>
          <h1 className="battle-notice-title">{t('battle.loadError')}</h1>
          <p className="battle-notice-id">/b/{battleId}</p>
          <div className="battle-notice-actions">
            <button
              type="button"
              className="battle-notice-btn"
              onClick={() => loadBattle(battleId)}
            >
              {t('battle.retry')}
            </button>
            <button
              type="button"
              className="battle-notice-btn battle-notice-btn--ghost"
              onClick={() => navigate('/')}
            >
              {t('battle.toIndex')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // planned 전투 리다이렉트 대기 또는 전투 번들 로드 전 → 지도 표면 색만 채운 채 대기
  if (planned || !ready) {
    return <div className="app-body app-body--loading" aria-busy="true" />;
  }

  return (
    <>
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
      <EquipmentCard />
      <TitleIntro />
      <Coachmarks />
    </>
  );
}
