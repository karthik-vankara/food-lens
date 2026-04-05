import { FoodItem, AnalysisError } from '../types';

export type AIProvider = 'openai' | 'gemini';

export interface FoodAnalysisService {
  analyze(imageUri: string): Promise<FoodItem>;
}

const ACTIVE_PROVIDER: AIProvider = 'openai';

let openaiService: FoodAnalysisService | null = null;
let geminiService: FoodAnalysisService | null = null;

const getOpenAIService = async (): Promise<FoodAnalysisService> => {
  if (!openaiService) {
    const { analyzeFoodImageOpenAI } = await import('./openaiService');
    openaiService = {
      analyze: analyzeFoodImageOpenAI,
    };
  }
  return openaiService;
};

const getGeminiService = async (): Promise<FoodAnalysisService> => {
  if (!geminiService) {
    const { analyzeFoodImage } = await import('./geminiService');
    geminiService = {
      analyze: analyzeFoodImage,
    };
  }
  return geminiService;
};

export const analyzeFood = async (imageUri: string): Promise<FoodItem> => {
  const provider = ACTIVE_PROVIDER;
  
  if (provider === 'openai') {
    const service = await getOpenAIService();
    return service.analyze(imageUri);
  } else if (provider === 'gemini') {
    const service = await getGeminiService();
    return service.analyze(imageUri);
  }
  
  throw {
    code: 'API_ERROR' as const,
    message: 'No AI provider configured',
  };
};

export const setActiveProvider = (provider: AIProvider): void => {
  console.log(`To change AI provider, edit ACTIVE_PROVIDER in src/services/aiService.ts`);
  console.log(`Current provider: ${provider}`);
};

export const getActiveProvider = (): AIProvider => {
  return ACTIVE_PROVIDER;
};