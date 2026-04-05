# FoodLens 🍽️

A minimal, clean food nutrition scanner app built with React Native (Expo). Take a photo of your food and instantly discover calories, macros, vitamins, and more.

---

## Architecture

### System Design

```
┌─────────────────────────────────────────────────────┐
│                    FoodLens App                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────┐    ┌──────────┐    ┌───────────────┐  │
│  │  Camera   │───▶│   AI     │───▶│   Results     │  │
│  │  /Gallery │    │ Analysis │    │   Display     │  │
│  └──────────┘    └──────────┘    └───────────────┘  │
│                      │                     │         │
│                      ▼                     ▼         │
│               ┌──────────┐    ┌──────────────────┐   │
│               │  Google   │    │   AsyncStorage   │   │
│               │  Gemini   │    │   (History)      │   │
│               │  Vision   │    └──────────────────┘   │
│               └──────────┘                            │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo SDK 54 (React Native 0.81.5) |
| Language | TypeScript |
| Navigation | React Navigation 7 (Native Stack) |
| State Management | Zustand 5 |
| Local Storage | @react-native-async-storage/async-storage 2.2.0 |
| Image Handling | expo-image-picker ~17.0.10, expo-camera ~17.0.10 |
| AI Analysis | Google Gemini Vision API (swappable) |
| Icons | @expo/vector-icons |

### Design Pattern: Adapter Pattern for AI

The AI analysis layer uses an adapter pattern for easy API swapping:

```
FoodAnalysisService (interface)
├── GeminiVisionAdapter    ← Primary (current)
├── OpenAIVisionAdapter    ← Future
└── NutritionixAdapter     ← Future
```

### Data Flow

```
User takes photo
    ↓
Image sent to Gemini Vision API
    ↓
AI returns structured JSON:
  - Food name + confidence
  - Portion size estimate
  - Nutrition: calories, protein, carbs, fat, fiber
  - Vitamins & minerals with daily values
    ↓
Results displayed to user
    ↓
User confirms → Saved to AsyncStorage history
```

### Type Definitions

```typescript
interface FoodItem {
  id: string;
  name: string;
  confidence: number;
  portionSize: string;
  portionGrams: number;
  nutrition: NutritionInfo;
  imageUrl: string;
  scannedAt: string;
}

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins: VitaminInfo[];
}
```

---

## Project Structure

```
FoodLens/
├── App.tsx                    # Root component
├── app.json                   # Expo configuration
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Typography.tsx
│   │   └── index.ts
│   ├── screens/
│   │   ├── HomeScreen/        # Landing page
│   │   ├── ScanScreen/        # Camera + image picker
│   │   ├── ResultsScreen/     # Nutrition display
│   │   ├── HistoryScreen/     # Scan history
│   │   └── index.tsx
│   ├── navigation/            # React Navigation setup
│   ├── store/                 # Zustand state management
│   ├── services/              # External services (storage, AI)
│   ├── theme/                 # Colors, spacing, typography
│   ├── types/                 # TypeScript interfaces
│   └── utils/                 # Helper functions
├── progress.md                # Development tracking
└── README.md                  # This file
```

---

## Implementation Phases

### Phase 1: Project Setup ✅
- Expo SDK 54 project initialization
- Dependencies installed and verified (all 17 expo-doctor checks pass)
- Folder structure and architecture
- Theme system and UI components
- Navigation setup
- Zustand store and AsyncStorage service
- Placeholder screens for all flows
- App runs successfully in Expo Go

### Phase 2: Camera & Image ✅
- Camera capture integration (expo-camera via expo-image-picker)
- Gallery image picker
- Image preview with scanned image in Results
- Save to history flow
- Image compression (0.8 quality)
- Mock data generation for testing flow

### Phase 3: AI Integration (Next)
- FoodAnalysisService interface
- Gemini Vision API adapter
- Prompt engineering for nutrition extraction
- JSON response parsing
- Error handling and retries

### Phase 4: Results & Confirmation
- Connect AI results to UI
- Food name confirmation
- Portion size display
- Save to history flow

### Phase 5: History & Polish
- Real history data integration
- Loading states and error handling
- App icon and splash screen
- Performance optimization

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go app (on your phone) or Xcode/Android Studio

### Installation

```bash
cd FoodLens
npm install
```

### Running the App

```bash
# Start Expo dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

### Testing on Physical Device
1. Install **Expo Go** from App Store or Play Store
2. Run `npm start`
3. Scan the QR code with Expo Go

---

## Configuration

### API Key Setup (Phase 3)
The app will use Google Gemini Vision API. Get your API key from:
https://ai.google.dev/

The key is stored securely in AsyncStorage on the device.

### Permissions
- **Camera**: Required for taking food photos
- **Photo Library**: Required for selecting existing food images

---

## Design Decisions

1. **No backend for MVP** - Zero server costs, everything client-side
2. **AsyncStorage** - Works in Expo Go without prebuild/EAS; will migrate to MMKV or SQLite when moving to bare workflow
3. **Zustand over Redux** - Minimal boilerplate, perfect for this scale
4. **Adapter pattern for AI** - Swap APIs without touching UI code
5. **Stack navigation** - Linear flow matches user journey
6. **Minimal & Clean UI** - Focus on data, not decoration

---

## License

Private project. All rights reserved.
