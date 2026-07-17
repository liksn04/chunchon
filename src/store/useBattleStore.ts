import { create } from 'zustand';
import type { BattleBundle } from '../battles/bundle';
import { loadBattle as loadBattleData } from '../battles/registry';
import { getStored, setStored } from '../lib/storage';

export type DayKey = string | 'all';
export type Theme = 'light' | 'dark';
export type Lang = 'ko' | 'en';

interface LayerVisibility {
  arrows: boolean;
  front: boolean;
  units: boolean;
  markers: boolean;
  terrain: boolean;
  plan: boolean;
}

interface BattleState {
  /** 로드 중이거나 로드된 전투 id */
  battleId: string | null;
  /** 로드된 전투 번들 (파생 lookup·briefScript·dayOrder 포함) */
  battle: BattleBundle | null;
  battleLoading: boolean;
  /** 전투 데이터 로드 실패 시 실패한 전투 id, 아니면 null */
  battleError: string | null;
  selectedDay: DayKey;
  selectedEventId: string | null;
  selectedUnitId: string | null;
  selectedEquipId: string | null;
  layers: LayerVisibility;
  /** 브리핑 진행 중이면 대본 인덱스, 아니면 null */
  briefIndex: number | null;
  /** 스크러버 드래그 중이면 days[] 소수 인덱스, 아니면 null (전선 연속 보간용) */
  scrub: number | null;
  theme: Theme;
  lang: Lang;
  loadBattle: (id: string) => Promise<void>;
  setDay: (d: DayKey) => void;
  selectEvent: (id: string | null) => void;
  selectUnit: (id: string | null) => void;
  selectEquip: (id: string | null) => void;
  toggleLayer: (k: keyof LayerVisibility) => void;
  play: () => void;
  stop: () => void;
  setBriefStep: (i: number) => void;
  advanceBrief: () => void;
  setScrub: (t: number) => void;
  endScrub: () => void;
  toggleTheme: () => void;
  toggleLang: () => void;
}

function initialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const saved = getStored('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'ko';
  const saved = getStored('lang');
  if (saved === 'ko' || saved === 'en') return saved;
  return navigator.language?.startsWith('ko') === false ? 'en' : 'ko';
}

export const useBattleStore = create<BattleState>((set, get) => ({
  battleId: null,
  battle: null,
  battleLoading: false,
  battleError: null,
  selectedDay: 'all',
  selectedEventId: null,
  selectedUnitId: null,
  selectedEquipId: null,
  layers: {
    arrows: true,
    front: true,
    units: true,
    markers: true,
    terrain: true,
    plan: true,
  },
  briefIndex: null,
  scrub: null,
  theme: initialTheme(),
  lang: initialLang(),
  // 전투 로드 → 번들 조립 + 세션 리셋 (layers/theme/lang은 유지)
  loadBattle: async (id) => {
    if (get().battleId === id && get().battle) return;
    set({ battleId: id, battleLoading: true, battleError: null });
    try {
      const bundle = await loadBattleData(id);
      // 경합 가드: 로드 도중 battleId가 바뀌면 stale 결과 무시
      if (get().battleId !== id) return;
      set({
        battle: bundle,
        battleLoading: false,
        battleError: null,
        selectedDay: 'all',
        selectedEventId: null,
        selectedUnitId: null,
        selectedEquipId: null,
        briefIndex: null,
        scrub: null,
      });
    } catch (err) {
      // 동적 import·로더 실패 → 재시도 UI로 노출 (stale 가드 유지)
      if (get().battleId !== id) return;
      console.error(`Failed to load battle "${id}"`, err);
      set({ battle: null, battleLoading: false, battleError: id });
    }
  },
  // 수동 날짜 선택은 브리핑을 멈춘다
  setDay: (d) => set({ selectedDay: d, selectedEventId: null, briefIndex: null }),
  // 사용자가 직접 사건을 열거나 닫으면 브리핑을 멈춘다
  selectEvent: (id) => set({ selectedEventId: id, briefIndex: null }),
  selectUnit: (id) => set({ selectedUnitId: id }),
  selectEquip: (id) => set({ selectedEquipId: id }),
  toggleLayer: (k) =>
    set((s) => ({ layers: { ...s.layers, [k]: !s.layers[k] } })),
  play: () => get().setBriefStep(0),
  stop: () => set({ briefIndex: null }),
  setBriefStep: (i) => {
    const battle = get().battle;
    if (!battle) return;
    const script = battle.briefScript;
    const idx = Math.max(0, Math.min(script.length - 1, i));
    const st = script[idx];
    set({ briefIndex: idx, selectedDay: st.date, selectedEventId: st.eventId });
  },
  advanceBrief: () => {
    const battle = get().battle;
    if (!battle) return;
    const i = get().briefIndex;
    if (i === null) return;
    if (i >= battle.briefScript.length - 1) set({ briefIndex: null });
    else get().setBriefStep(i + 1);
  },
  setScrub: (t) => {
    const battle = get().battle;
    if (!battle) return;
    const days = battle.days;
    const idx = Math.max(0, Math.min(days.length - 1, t));
    // 소수 인덱스로 전선을 연속 보간하되, 개별 사건/부대 레이어는 가까운 날짜에 스냅
    set({
      scrub: idx,
      selectedDay: days[Math.round(idx)].date,
      selectedEventId: null,
      briefIndex: null,
    });
  },
  endScrub: () => set({ scrub: null }),
  toggleTheme: () =>
    set((s) => {
      const theme: Theme = s.theme === 'light' ? 'dark' : 'light';
      setStored('theme', theme);
      return { theme };
    }),
  toggleLang: () =>
    set((s) => {
      const lang: Lang = s.lang === 'ko' ? 'en' : 'ko';
      setStored('lang', lang);
      return { lang };
    }),
}));
