import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from '../utils/types';

interface SettingsStore extends Settings {
  setUse24Hour: (value: boolean) => void;
  setHourlyWage: (value: number) => void;
  setDailyWorkHours: (value: number) => void;
  setWeeklyWorkHours: (value: number) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      use24Hour: true,
      hourlyWage: 10_030,       // 2025년 최저임금
      dailyWorkHours: 8,
      weeklyWorkHours: 40,

      setUse24Hour: (value) => set({ use24Hour: value }),
      setHourlyWage: (value) => set({ hourlyWage: value }),
      setDailyWorkHours: (value) => set({ dailyWorkHours: value }),
      setWeeklyWorkHours: (value) => set({ weeklyWorkHours: value }),
    }),
    {
      name: 'moneycalc-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
