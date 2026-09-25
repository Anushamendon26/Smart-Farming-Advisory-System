import type { DiseaseResult, SoilInput } from '../types'

// Demo soil and disease-analysis data. The disease result is NOT produced by
// a real computer-vision model — label it as a demo result everywhere until
// services/diseaseService.ts calls a trained CNN / MobileNet / ResNet.

export const defaultSoilInput: SoilInput = {
  nitrogen: 280,
  phosphorus: 32,
  potassium: 240,
  ph: 6.5,
  moisture: 62,
  soilType: 'Loamy',
}

export const demoDiseaseResult: DiseaseResult = {
  disease: 'Leaf Blight',
  confidence: 94,
  severity: 'Moderate',
  symptoms: [
    'Dark brown lesions with yellow halos on older leaves',
    'Small water-soaked spots spreading inward from leaf edges',
    'Lesions merging and causing leaf drop in severe cases',
  ],
  causes: [
    'Fungal spread in warm, humid conditions',
    'Overhead irrigation keeping foliage wet',
    'Infected crop residue from the previous season',
  ],
  recommendedActions: [
    'Remove and destroy heavily infected leaves away from the field.',
    'Ask your local agriculture officer about a recommended fungicide and dose.',
    'Switch to drip/furrow irrigation and water early in the morning.',
    'Re-scan leaves after 5–7 days to watch for changes.',
  ],
}
