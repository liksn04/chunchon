import { create } from 'zustand';
import { days } from '../data/days';

export type DayKey = string | 'all';
export type Theme = 'light' | 'dark';

interface LayerVisibility {
  arrows: boolean;
  front: boolean;
  units: boolean;
  markers: boolean;
  terrain: boolean;
}

interface BattleState {
  selectedDay: DayKey;
  selectedEventId: string | null;
  layers: LayerVisibility;
  playing: boolean;
  theme: Theme;
  setDay: (d: DayKey) => void;
  selectEvent: (id: string | null) => void;
  toggleLayer: (k: keyof LayerVisibility) => void;
  play: () => void;
  stop: () => void;
  advanceDay: () => void;
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

const LAST_DAY = days[days.length - 1].date;

export const useBattleStore = create<BattleState>((set) => ({
  selectedDay: 'all',
  selectedEventId: null,
  layers: { arrows: true, front: true, units: true, markers: true, terrain: true },
  playing: false,
  theme: initialTheme(),
  // 수동 날짜 선택은 재생을 멈춘다
  setDay: (d) => set({ selectedDay: d, selectedEventId: null, playing: false }),
  // 사건 상세를 열면 재생을 멈춘다
  selectEvent: (id) =>
    set((s) => ({ selectedEventId: id, playing: id ? false : s.playing })),
  toggleLayer: (k) =>
    set((s) => ({ layers: { ...s.layers, [k]: !s.layers[k] } })),
  play: () =>
    set((s) => ({
      playing: true,
      selectedEventId: null,
      selectedDay:
        s.selectedDay === 'all' || s.selectedDay === LAST_DAY
          ? days[0].date
          : s.selectedDay,
    })),
  stop: () => set({ playing: false }),
  advanceDay: () =>
    set((s) => {
      const idx = days.findIndex((d) => d.date === s.selectedDay);
      if (idx < 0 || idx >= days.length - 1) return { playing: false };
      return { selectedDay: days[idx + 1].date };
    }),
  toggleTheme: () =>
    set((s) => {
      const theme: Theme = s.theme === 'light' ? 'dark' : 'light';
      window.localStorage.setItem(THEME_KEY, theme);
      return { theme };
    }),
}));
