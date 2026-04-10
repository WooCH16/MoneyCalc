import { create } from 'zustand';
import { calcSeverance } from '../utils/severanceCalc';
import { SeveranceInput, SeveranceResult } from '../utils/types';

interface SeveranceStore {
  input: SeveranceInput;
  result: SeveranceResult | null;

  setJoinDate: (value: string) => void;
  setLeaveDate: (value: string) => void;
  setLastThreeMonthSalary: (value: number) => void;
  setLastThreeMonthDays: (value: number) => void;
  calculate: () => void;
  reset: () => void;
}

export const useSeveranceStore = create<SeveranceStore>((set, get) => ({
  input: {
    joinDate: '',
    leaveDate: '',
    lastThreeMonthSalary: 0,
    lastThreeMonthDays: 89,
  },
  result: null,

  setJoinDate: (value) => set((s) => ({ input: { ...s.input, joinDate: value } })),
  setLeaveDate: (value) => set((s) => ({ input: { ...s.input, leaveDate: value } })),
  setLastThreeMonthSalary: (value) => set((s) => ({ input: { ...s.input, lastThreeMonthSalary: value } })),
  setLastThreeMonthDays: (value) => set((s) => ({ input: { ...s.input, lastThreeMonthDays: value } })),

  calculate: () => {
    const result = calcSeverance(get().input);
    set({ result });
  },

  reset: () => set({
    input: { joinDate: '', leaveDate: '', lastThreeMonthSalary: 0, lastThreeMonthDays: 89 },
    result: null,
  }),
}));
