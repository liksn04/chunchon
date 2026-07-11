import { create } from 'zustand';
import { days } from '../data/days';

export type DayKey = string | 'all';
export type Theme = 'light' | 'dark';

/** 브리핑 대본의 한 스텝: 날짜 인트로(eventId=null) 또는 사건 클로즈업 */
export interface BriefStep {
  date: string;
  eventId: string | null;
}

/** 브리핑 대본: 각 날짜마다 [인트로 → 그날의 사건들] 순서 */
export const briefScript: BriefStep[] = days.flatMap((d) => [
  { date: d.date, eventId: null },
  ...d.activeEventIds.map((id) => ({ date: d.date, eventId: id })),
]);

interface LayerVisibility {
  arrows: boolean;
  front: boolean;
  units: boolean;
  markers: boolean;
  terrain: boolean;
  plan: boolean;
}

interface BattleState {
  selectedDay: DayKey;
  selectedEventId: string | null;
  layers: LayerVisibility;
  /** 브리핑 진행 중이면 대본 인덱스, 아니면 null */
  briefIndex: number | null;
  theme: Theme;
  setDay: (d: DayKey) => void;
  selectEvent: (id: string | null) => void;
  toggleLayer: (k: keyof LayerVisibility) => void;
  play: () => void;
  stop: () => void;
  setBriefStep: (i: number) => void;
  advanceBrief: () => void;
  toggleTheme: () => void;
}

const THEME_KEY = 'chuncheon1950-theme';

function initialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export const useBattleStore = create<BattleState>((set, get) => ({
  selectedDay: 'all',
  selectedEventId: null,
  layers: {
    arrows: true,
    front: true,
    units: true,
    markers: true,
    terrain: true,
    plan: true,
  },
  briefIndex: null,
  theme: initialTheme(),
  // 수동 날짜 선택은 브리핑을 멈춘다
  setDay: (d) => set({ selectedDay: d, selectedEventId: null, briefIndex: null }),
  // 사용자가 직접 사건을 열거나 닫으면 브리핑을 멈춘다
  selectEvent: (id) => set({ selectedEventId: id, briefIndex: null }),
  toggleLayer: (k) =>
    set((s) => ({ layers: { ...s.layers, [k]: !s.layers[k] } })),
  play: () => get().setBriefStep(0),
  stop: () => set({ briefIndex: null }),
  setBriefStep: (i) => {
    const idx = Math.max(0, Math.min(briefScript.length - 1, i));
    const st = briefScript[idx];
    set({ briefIndex: idx, selectedDay: st.date, selectedEventId: st.eventId });
  },
  advanceBrief: () => {
    const i = get().briefIndex;
    if (i === null) return;
    if (i >= briefScript.length - 1) set({ briefIndex: null });
    else get().setBriefStep(i + 1);
  },
  toggleTheme: () =>
    set((s) => {
      const theme: Theme = s.theme === 'light' ? 'dark' : 'light';
      window.localStorage.setItem(THEME_KEY, theme);
      return { theme };
    }),
}));
