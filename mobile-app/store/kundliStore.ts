import { create } from 'zustand';

type KundliState = {
  name: string;
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  birthPlace: string;
  latitude: string;
  longitude: string;
  timeZone: string;
  isFemale: string;

  setName: (value: string) => void;
  setDay: (value: string) => void;
  setMonth: (value: string) => void;
  setYear: (value: string) => void;
  setHour: (value: string) => void;
  setMinute: (value: string) => void;
  setBirthPlace: (value: string) => void;
  setLatitude: (value: string) => void;
  setLongitude: (value: string) => void;
  setTimeZone: (value: string) => void;
  setIsFemale: (value: string) => void;
  reset: () => void;
};

const initialState = {
  name: '',
  day: '',
  month: '',
  year: '',
  hour: '',
  minute: '',
  birthPlace: '',
  latitude: '',
  longitude: '',
  timeZone: '+00.00',
  isFemale: 'Male',
};

export const useKundliStore = create<KundliState>((set) => ({
  ...initialState,

  setName: (value) => set({ name: value }),
  setDay: (value) => set({ day: value }),
  setMonth: (value) => set({ month: value }),
  setYear: (value) => set({ year: value }),
  setHour: (value) => set({ hour: value }),
  setMinute: (value) => set({ minute: value }),
  setBirthPlace: (value) => set({ birthPlace: value }),
  setLatitude: (value) => set({ latitude: value }),
  setLongitude: (value) => set({ longitude: value }),
  setTimeZone: (value) => set({ timeZone: value }),
  setIsFemale: (value) => set({ isFemale: value }),
  reset: () => set(initialState),
}));

export default useKundliStore;
