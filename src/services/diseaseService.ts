// Disease detection service — future endpoint: POST /api/disease-detect
// Accepts the raw image File so a computer-vision model (CNN / MobileNet /
// ResNet) can be connected later without touching the UI. The current
// response is a clearly labelled DEMO result, not a real inference.
import { demoDiseaseResult } from '../data/soil'
import { delay, ServiceError } from '../utils/service'
import type { DiseaseResult } from '../types'

export async function detectDisease(image: File): Promise<DiseaseResult> {
  if (!image) throw new ServiceError('No image was provided for analysis.')
  if (!image.type.startsWith('image/')) throw new ServiceError('The selected file is not an image.')
  // Future:
  //   const form = new FormData(); form.append('image', image)
  //   return (await fetch('/api/disease-detect', { method: 'POST', body: form })).json()
  await delay(1600)
  return demoDiseaseResult
}
