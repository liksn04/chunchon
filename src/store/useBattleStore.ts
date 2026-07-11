import { create } from 'zustand';

export type DayKey = string | 'all';

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
  setDay: (d: DayKey) => void;
  selectEvent: (id: string | null) => void;
  toggleLayer: (k: keyof LayerVisibility) => void;
}

export const useBattleStore = create<BattleState>((set) => ({
  selectedDay: 'all',
  selectedEventId: null,
  layers: { arrows: true, front: true, units: true, markers: true, terrain: true },
  setDay: (d) => set({ selectedDay: d, selectedEventId: null }),
  selectEvent: (id) => set({ selectedEventId: id }),
  toggleLayer: (k) =>
    set((s) => ({ layers: { ...s.layers, [k]: !s.layers[k] } })),
}));
