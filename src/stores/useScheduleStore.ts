import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DayWork, MonthSchedule } from '../utils/types';

interface ScheduleStore {
  // key: "YYYY-MM" → MonthSchedule
  data: Record<string, MonthSchedule>;
  selectedDate: string | null;

  setDayWork: (date: string, work: DayWork) => void;
  removeDayWork: (date: string) => void;
  getDayWork: (date: string) => DayWork | undefined;
  getMonthSchedule: (yearMonth: string) => MonthSchedule;
  setSelectedDate: (date: string | null) => void;
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      data: {},
      selectedDate: null,

      setDayWork: (date, work) => {
        const ym = date.substring(0, 7); // YYYY-MM
        set((s) => ({
          data: {
            ...s.data,
            [ym]: { ...s.data[ym], [date]: work },
          },
        }));
      },

      removeDayWork: (date) => {
        const ym = date.substring(0, 7);
        set((s) => {
          const month = { ...s.data[ym] };
          delete month[date];
          return { data: { ...s.data, [ym]: month } };
        });
      },

      getDayWork: (date) => {
        const ym = date.substring(0, 7);
        return get().data[ym]?.[date];
      },

      getMonthSchedule: (yearMonth) => get().data[yearMonth] ?? {},

      setSelectedDate: (date) => set({ selectedDate: date }),
    }),
    {
      name: 'moneycalc-schedule',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
