// Fertilizer advisory service — future endpoint: POST /api/fertilizer-advice
// Dosage guidance is intentionally conservative and advisory-only; real
// plans should come from soil-test based agronomic models.
import { delay } from '../utils/service'
import type { FertilizerInput, FertilizerRecommendation } from '../types'

export async function getFertilizerAdvice(
  _input: FertilizerInput,
): Promise<FertilizerRecommendation> {
  await delay(900)
  return {
    nutrients: [
      {
        key: 'N',
        name: 'Nitrogen (Urea)',
        status: 'Deficient',
        dosage: '≈ 25 kg / acre (estimated)',
        advice:
          'Based on the available data, a nitrogen top-dressing is often useful at this stage. Confirm the dose with your local agricultural guidance.',
      },
      {
        key: 'P',
        name: 'Phosphorus (DAP)',
        status: 'Adequate',
        dosage: 'No top-dressing needed',
        advice: 'Soil P appears sufficient. Continue baseline dose only at the next sowing.',
      },
      {
        key: 'K',
        name: 'Potassium (MOP)',
        status: 'Sufficient',
        dosage: 'Light feed optional (estimated)',
        advice: 'A modest potassium feed can support fruit firmness before harvest.',
      },
    ],
    summary:
      'Demo recommendation — based on the levels you entered, nitrogen is the main nutrient to watch at this growth stage.',
  }
}
