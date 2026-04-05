import { FoodItem, AnalysisError } from '../types';

const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const ANALYSIS_PROMPT = `Analyze this food image and return nutrition information in JSON format:
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

interface OpenAIVitamin {
  name: string;
  amount: string;
  dailyValue: number;
}

interface OpenAINutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins: OpenAIVitamin[];
}

interface OpenAIResponse {
  name: string;
  confidence: number;
  portionSize: string;
  portionGrams: number;
  nutrition: OpenAINutrition;
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

const parseApiResponse = (text: string): OpenAIResponse => {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in response');
  }
  
  const parsed = JSON.parse(jsonMatch[0]);
  
  if (!parsed.name || !parsed.nutrition) {
    throw new Error('Invalid response format');
  }
  
  return parsed as OpenAIResponse;
};

const convertToFoodItem = (response: OpenAIResponse, imageUri: string): FoodItem => {
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

export const analyzeFoodImageOpenAI = async (imageUri: string): Promise<FoodItem> => {
  const apiKey = OPENAI_API_KEY;
  if (!apiKey || apiKey.length < 10) {
    const error: AnalysisError = {
      code: 'NO_API_KEY',
      message: 'OpenAI API key not configured. Please add your API key in openaiService.ts',
    };
    throw error;
  }

  try {
    const base64Image = await convertToBase64(imageUri);

    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: ANALYSIS_PROMPT },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.4,
      response_format: { type: 'json_object' },
    };

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      const error: AnalysisError = {
        code: 'PARSE_ERROR',
        message: 'Could not parse AI response. Please try again.',
      };
      throw error;
    }

    const textResponse = data.choices[0].message.content;
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

export const setOpenAIApiKey = (key: string): void => {
  console.log('OpenAI API key update not implemented. Update OPENAI_API_KEY in openaiService.ts');
};
