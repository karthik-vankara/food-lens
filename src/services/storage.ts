import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem } from '../types';

const STORAGE_KEYS = {
  FOOD_HISTORY: '@foodlens_food_history',
  API_KEY: '@foodlens_gemini_api_key',
};

export const saveFoodHistory = async (items: FoodItem[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.FOOD_HISTORY, JSON.stringify(items));
};

export const getFoodHistory = async (): Promise<FoodItem[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.FOOD_HISTORY);
  if (!data) return [];
  try {
    return JSON.parse(data) as FoodItem[];
  } catch {
    return [];
  }
};

export const addFoodItem = async (item: FoodItem): Promise<FoodItem[]> => {
  const history = await getFoodHistory();
  const updated = [item, ...history];
  await saveFoodHistory(updated);
  return updated;
};

export const clearFoodHistory = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEYS.FOOD_HISTORY);
};

export const saveApiKey = async (key: string): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.API_KEY, key);
};

export const getApiKey = async (): Promise<string | null> => {
  return AsyncStorage.getItem(STORAGE_KEYS.API_KEY);
};
