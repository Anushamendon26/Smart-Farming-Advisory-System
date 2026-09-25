import type { CropRecommendation } from '../types'

// Demo crop-recommendation output. These values are NOT produced by a real
// ML model — they are placeholders until services/cropService.ts is pointed
// at a trained model (e.g. Random Forest / XGBoost / Extra Trees).

export const demoCropRecommendations: CropRecommendation[] = [
  {
    crop: 'Wheat',
    emoji: '🌾',
    suitability: 92,
    growingPeriod: '120 days',
    waterRequirement: 'medium',
    explanation:
      'Demo recommendation — suitable based on the provided soil and environmental conditions.',
  },
  {
    crop: 'Maize',
    emoji: '🌽',
    suitability: 87,
    growingPeriod: '90–110 days',
    waterRequirement: 'medium',
    explanation:
      'Demo alternative — responds well in loamy soil with medium water availability.',
  },
  {
    crop: 'Potato',
    emoji: '🥔',
    suitability: 81,
    growingPeriod: '80–100 days',
    waterRequirement: 'high',
    explanation:
      'Demo alternative — suitable given cool nights; keep soil moisture consistent.',
  },
]
