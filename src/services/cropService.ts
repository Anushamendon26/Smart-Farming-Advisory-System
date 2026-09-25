// Crop advisory service.
// Future endpoint: POST /api/crop-recommendations
// The request body will be the CropAdvisoryInput below, and the response an
// array of CropRecommendation from a trained model (Random Forest / XGBoost
// / Extra Trees). Only this file changes when the ML API is connected.
import { demoCropRecommendations } from '../data/crops'
import { delay } from '../utils/service'
import type { CropAdvisoryInput, CropRecommendation } from '../types'

export async function getCropRecommendations(
  _input: CropAdvisoryInput,
): Promise<CropRecommendation[]> {
  await delay(1100)
  return demoCropRecommendations
}
