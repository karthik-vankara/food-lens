import { create } from 'zustand';
import { FoodItem } from '../types';
import { addFoodItem, getFoodHistory, clearFoodHistory, saveApiKey, getApiKey } from '../services/storage';

interface AppState {
  foodHistory: FoodItem[];
  isLoading: boolean;
  apiKey: string | null;
  error: string | null;

  setApiKey: (key: string) => Promise<void>;
  loadFoodHistory: () => Promise<void>;
  addFoodItem: (item: FoodItem) => Promise<void>;
  clearFoodHistory: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  foodHistory: [],
  isLoading: false,
  apiKey: null,
  error: null,

  setApiKey: async (key: string) => {
    await saveApiKey(key);
    set({ apiKey: key });
  },

  loadFoodHistory: async () => {
    const history = await getFoodHistory();
    set({ foodHistory: history });
  },

  addFoodItem: async (item: FoodItem) => {
    const updated = await addFoodItem(item);
    set({ foodHistory: updated });
  },

  clearFoodHistory: async () => {
    await clearFoodHistory();
    set({ foodHistory: [] });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
