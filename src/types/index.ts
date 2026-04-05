export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins: VitaminInfo[];
}

export interface VitaminInfo {
  name: string;
  amount: string;
  dailyValue: number;
}

export interface FoodItem {
  id: string;
  name: string;
  confidence: number;
  portionSize: string;
  portionGrams: number;
  nutrition: NutritionInfo;
  imageUrl: string;
  scannedAt: string;
}

export type ScreenNames = {
  Home: undefined;
  Scan: undefined;
  Results: { foodItem: FoodItem };
  History: undefined;
};
