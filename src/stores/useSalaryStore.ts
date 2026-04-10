import { create } from 'zustand';
import { calcSalary } from '../utils/salaryCalc';
import { SalaryInput, SalaryResult } from '../utils/types';

interface SalaryStore {
  input: SalaryInput;
  result: SalaryResult | null;

  setBaseSalary: (value: number) => void;
  setMealAllowance: (value: number) => void;
  setVehicleAllowance: (value: number) => void;
  setOtherAllowances: (value: number) => void;
  setDependents: (value: number) => void;
  calculate: () => void;
  reset: () => void;
}

const defaultInput: SalaryInput = {
  baseSalary: 0,
  mealAllowance: 0,
  vehicleAllowance: 0,
  otherAllowances: 0,
  dependents: 1,
};

export const useSalaryStore = create<SalaryStore>((set, get) => ({
  input: { ...defaultInput },
  result: null,

  setBaseSalary: (value) => set((s) => ({ input: { ...s.input, baseSalary: value } })),
  setMealAllowance: (value) => set((s) => ({ input: { ...s.input, mealAllowance: value } })),
  setVehicleAllowance: (value) => set((s) => ({ input: { ...s.input, vehicleAllowance: value } })),
  setOtherAllowances: (value) => set((s) => ({ input: { ...s.input, otherAllowances: value } })),
  setDependents: (value) => set((s) => ({ input: { ...s.input, dependents: value } })),

  calculate: () => {
    const result = calcSalary(get().input);
    set({ result });
  },

  reset: () => set({ input: { ...defaultInput }, result: null }),
}));
