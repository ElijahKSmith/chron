import { create } from "zustand";

export interface TimerStore {
  time: number;
  step: (dt: number) => Promise<void>;
  setState: (state: TimerStore | Partial<TimerStore>) => Promise<void>;
  _hydrated: boolean;
}

export const useStore = create<TimerStore>()((set) => ({
  time: 0,
  step: async (dt) => {
    set((state) => ({ time: state.time + dt }));
  },
  setState: async (state) => {
    set({ ...state });
  },
  _hydrated: false,
}));

const hydrate = async () => {
  useStore.setState({ _hydrated: true });
};
hydrate();
