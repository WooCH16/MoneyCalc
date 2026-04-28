import { create } from 'zustand';
import { calcYearEnd, YearEndInput, YearEndResult } from '../utils/yearEndCalc';

interface YearEndStore {
  input: YearEndInput;
  result: YearEndResult | null;

  setMonthlyData: (month: number, netSalary: number, taxPaid: number) => void;
  setDependents: (v: number) => void;
  setDisabledCount: (v: number) => void;
  setSeniorCount: (v: number) => void;
  setSingleParent: (v: boolean) => void;
  setCreditCardTotal: (v: number) => void;
  setMedicalExpense: (v: number) => void;
  setEducationExpense: (v: number) => void;
  setDonationExpense: (v: number) => void;
  setPensionSaving: (v: number) => void;
  setHousingFund: (v: number) => void;
  calculate: () => void;
  reset: () => void;
}

const defaultInput: YearEndInput = {
  monthlyNetSalaries: Array(12).fill(0),
  monthlyTaxPaid: Array(12).fill(0),
  dependents: 1,
  disabledCount: 0,
  seniorCount: 0,
  singleParent: false,
  creditCardTotal: 0,
  medicalExpense: 0,
  educationExpense: 0,
  donationExpense: 0,
  pensionSaving: 0,
  housingFund: 0,
};

export const useYearEndStore = create<YearEndStore>((set, get) => ({
  input: { ...defaultInput, monthlyNetSalaries: [...defaultInput.monthlyNetSalaries], monthlyTaxPaid: [...defaultInput.monthlyTaxPaid] },
  result: null,

  setMonthlyData: (month, netSalary, taxPaid) =>
    set((s) => {
      const salaries = [...s.input.monthlyNetSalaries];
      const taxes = [...s.input.monthlyTaxPaid];
      salaries[month] = netSalary;
      taxes[month] = taxPaid;
      return { input: { ...s.input, monthlyNetSalaries: salaries, monthlyTaxPaid: taxes } };
    }),

  setDependents: (v) => set((s) => ({ input: { ...s.input, dependents: v } })),
  setDisabledCount: (v) => set((s) => ({ input: { ...s.input, disabledCount: v } })),
  setSeniorCount: (v) => set((s) => ({ input: { ...s.input, seniorCount: v } })),
  setSingleParent: (v) => set((s) => ({ input: { ...s.input, singleParent: v } })),
  setCreditCardTotal: (v) => set((s) => ({ input: { ...s.input, creditCardTotal: v } })),
  setMedicalExpense: (v) => set((s) => ({ input: { ...s.input, medicalExpense: v } })),
  setEducationExpense: (v) => set((s) => ({ input: { ...s.input, educationExpense: v } })),
  setDonationExpense: (v) => set((s) => ({ input: { ...s.input, donationExpense: v } })),
  setPensionSaving: (v) => set((s) => ({ input: { ...s.input, pensionSaving: v } })),
  setHousingFund: (v) => set((s) => ({ input: { ...s.input, housingFund: v } })),

  calculate: () => set({ result: calcYearEnd(get().input) }),
  reset: () => set({
    input: { ...defaultInput, monthlyNetSalaries: [...defaultInput.monthlyNetSalaries], monthlyTaxPaid: [...defaultInput.monthlyTaxPaid] },
    result: null,
  }),
}));
