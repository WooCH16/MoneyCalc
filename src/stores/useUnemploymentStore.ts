import { create } from 'zustand';
import { calcUnemployment } from '../utils/unemploymentCalc';
import { UnemploymentInput, UnemploymentResult } from '../utils/types';

interface UnemploymentStore {
  input: UnemploymentInput;
  result: UnemploymentResult | null;

  setAvgDailySalary: (value: number) => void;
  setAge: (value: number) => void;
  setInsuredMonths: (value: number) => void;
  calculate: () => void;
  reset: () => void;
}

export const useUnemploymentStore = create<UnemploymentStore>((set, get) => ({
  input: { avgDailySalary: 0, age: 30, insuredMonths: 0 },
  result: null,

  setAvgDailySalary: (value) => set((s) => ({ input: { ...s.input, avgDailySalary: value } })),
  setAge: (value) => set((s) => ({ input: { ...s.input, age: value } })),
  setInsuredMonths: (value) => set((s) => ({ input: { ...s.input, insuredMonths: value } })),

  calculate: () => {
    const result = calcUnemployment(get().input);
    set({ result });
  },

  reset: () => set({ input: { avgDailySalary: 0, age: 30, insuredMonths: 0 }, result: null }),
}));
