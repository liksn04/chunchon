import { create } from 'zustand';
import { days } from '../data/days';

export type DayKey = string | 'all';
export type Theme = 'light' | 'dark';
export type Lang = 'ko' | 'en';

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
  selectedUnitId: string | null;
  layers: LayerVisibility;
  /** 브리핑 진행 중이면 대본 인덱스, 아니면 null */
  briefIndex: number | null;
  /** 스크러버 드래그 중이면 days[] 소수 인덱스, 아니면 null (전선 연속 보간용) */
  scrub: number | null;
  theme: Theme;
  lang: Lang;
  setDay: (d: DayKey) => void;
  selectEvent: (id: string | null) => void;
  selectUnit: (id: string | null) => void;
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

const THEME_KEY = 'chuncheon1950-theme';
const LANG_KEY = 'chuncheon1950-lang';

function initialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'ko';
  const saved = window.localStorage.getItem(LANG_KEY);
  if (saved === 'ko' || saved === 'en') return saved;
  return navigator.language?.startsWith('ko') === false ? 'en' : 'ko';
}

export const useBattleStore = create<BattleState>((set, get) => ({
  selectedDay: 'all',
  selectedEventId: null,
  selectedUnitId: null,
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
  // 수동 날짜 선택은 브리핑을 멈춘다
  setDay: (d) => set({ selectedDay: d, selectedEventId: null, briefIndex: null }),
  // 사용자가 직접 사건을 열거나 닫으면 브리핑을 멈춘다
  selectEvent: (id) => set({ selectedEventId: id, briefIndex: null }),
  selectUnit: (id) => set({ selectedUnitId: id }),
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
  setScrub: (t) => {
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
      window.localStorage.setItem(THEME_KEY, theme);
      return { theme };
    }),
  toggleLang: () =>
    set((s) => {
      const lang: Lang = s.lang === 'ko' ? 'en' : 'ko';
      window.localStorage.setItem(LANG_KEY, lang);
      return { lang };
    }),
}));
