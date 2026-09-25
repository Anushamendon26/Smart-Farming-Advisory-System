// Irrigation advisory service — future endpoint: GET /api/irrigation-advice
// (threshold-based logic combining soil moisture, weather and crop stage;
// advanced ML/RL can replace the backend later without UI changes).
import { delay } from '../utils/service'
import type { IrrigationRecommendation } from '../types'

export async function fetchIrrigationAdvice(): Promise<IrrigationRecommendation> {
  await delay()
  return {
    recommendation: 'Moderate irrigation recommended.',
    waterLiters: 1600,
    timeOfDay: 'Morning (6–9 AM)',
    reason:
      'Based on current soil moisture, expected rain tomorrow and the flowering growth stage of your crop.',
    soilMoisture: 62,
    temperatureC: 28,
    rainForecastNextDays: 30,
    crop: 'Tomato',
    growthStage: 'Flowering',
  }
}
