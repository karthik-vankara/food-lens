import { FoodItem, AnalysisError } from '../types';

const GEMINI_API_KEY = 'AIzaSyCKX2bd8UzK9Si84BMcz2hUHRXyKDSRvqk';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

const ANALYSIS_PROMPT = `Analyze this food image and return nutrition information in this exact JSON format:
{
  "name": "food name",
  "confidence": 0.0-1.0,
  "portionSize": "description like '1 cup' or '1 medium serving'",
  "portionGrams": estimated weight in grams,
  "nutrition": {
    "calories": number,
    "protein": number in grams,
    "carbs": number in grams,
    "fat": number in grams,
    "fiber": number in grams,
    "vitamins": [{"name": "Vitamin name", "amount": "amount with unit", "dailyValue": number 0-100}]
  }
}

Only respond with valid JSON, no other text.`;

interface GeminiNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins: Array<{
    name: string;
    amount: string;
    dailyValue: number;
  }>;
}

interface GeminiResponse {
  name: string;
  confidence: number;
  portionSize: string;
  portionGrams: number;
  nutrition: GeminiNutrition;
}

const convertToBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const parseApiResponse = (text: string): GeminiResponse => {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in response');
  }
  
  const parsed = JSON.parse(jsonMatch[0]);
  
  if (!parsed.name || !parsed.nutrition) {
    throw new Error('Invalid response format');
  }
  
  return parsed as GeminiResponse;
};

const convertToFoodItem = (response: GeminiResponse, imageUri: string): FoodItem => {
  return {
    id: Date.now().toString(),
    name: response.name,
    confidence: response.confidence || 0.8,
    portionSize: response.portionSize || '1 serving',
    portionGrams: response.portionGrams || 100,
    nutrition: {
      calories: response.nutrition?.calories || 0,
      protein: response.nutrition?.protein || 0,
      carbs: response.nutrition?.carbs || 0,
      fat: response.nutrition?.fat || 0,
      fiber: response.nutrition?.fiber || 0,
      vitamins: response.nutrition?.vitamins || [],
    },
    imageUrl: imageUri,
    scannedAt: new Date().toISOString(),
  };
};

export const analyzeFoodImage = async (imageUri: string): Promise<FoodItem> => {
  const apiKey = GEMINI_API_KEY;
  if (!apiKey || apiKey.length < 10) {
    const error: AnalysisError = {
      code: 'NO_API_KEY',
      message: 'API key not configured. Please add your Gemini API key in geminiService.ts',
    };
    throw error;
  }

  try {
    const base64Image = await convertToBase64(imageUri);

    const requestBody = {
      contents: [{
        parts: [
          { text: ANALYSIS_PROMPT },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: base64Image,
            },
          },
        ],
      }],
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        topK: 40,
      },
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData?.error?.message || `API error: ${response.status}`;
      
      const error: AnalysisError = {
        code: 'API_ERROR',
        message: errorMessage,
      };
      throw error;
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      const error: AnalysisError = {
        code: 'PARSE_ERROR',
        message: 'Could not parse AI response. Please try again.',
      };
      throw error;
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    const parsedResponse = parseApiResponse(textResponse);
    const foodItem = convertToFoodItem(parsedResponse, imageUri);

    return foodItem;
  } catch (error) {
    if ((error as AnalysisError).code) {
      throw error;
    }
    
    const isNetworkError = error instanceof TypeError && error.message.includes('Network request failed');
    
    const analysisError: AnalysisError = {
      code: isNetworkError ? 'NETWORK_ERROR' : 'PARSE_ERROR',
      message: isNetworkError 
        ? 'No internet connection. Please check your network.' 
        : 'Could not analyze food. Please try again with a clearer photo.',
    };
    throw analysisError;
  }
};

export const setApiKey = (key: string): void => {
  // This function is for future use when implementing Settings screen
  // For now, the API key is hardcoded
  console.log('API key update not implemented. Update GEMINI_API_KEY in geminiService.ts');
};
