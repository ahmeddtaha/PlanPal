import { create } from 'zustand';
import type { TripPreferences } from '@/types/trip';

interface TripStore extends TripPreferences {
  destinationId: string;
  setDestinationId: (id: string) => void;
  setPrivacyType: (type: TripPreferences['privacyType']) => void;
  setTripType: (type: TripPreferences['tripType']) => void;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  setCulturePreference: (pref: TripPreferences['culturePreference']) => void;
  setNaturePreference: (pref: TripPreferences['naturePreference']) => void;
  setFoodPreference: (pref: TripPreferences['foodPreference']) => void;
  setEntertainmentPreference: (pref: TripPreferences['entertainmentPreference']) => void;
  setBudgetLevel: (level: TripPreferences['budgetLevel']) => void;
  reset: () => void;
}

const initialState = {
  destinationId: '',
  privacyType: 'private' as const,
  tripType: undefined,
  startDate: new Date(),
  endDate: new Date(),
  culturePreference: undefined,
  naturePreference: undefined,
  foodPreference: undefined,
  entertainmentPreference: undefined,
  budgetLevel: 'balanced' as const,
};

export const useTripStore = create<TripStore>((set) => ({
  ...initialState,
  setDestinationId: (id) => set({ destinationId: id }),
  setPrivacyType: (type) => set({ privacyType: type }),
  setTripType: (type) => set({ tripType: type }),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setCulturePreference: (pref) => set({ culturePreference: pref }),
  setNaturePreference: (pref) => set({ naturePreference: pref }),
  setFoodPreference: (pref) => set({ foodPreference: pref }),
  setEntertainmentPreference: (pref) => set({ entertainmentPreference: pref }),
  setBudgetLevel: (level) => set({ budgetLevel: level }),
  reset: () => set(initialState),
}));