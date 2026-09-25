// AI assistant service — future endpoint: POST /api/chat (LLM backend).
// The demo replies below are simple keyword lookups and are labelled as
// demo answers in the UI. Replace with a real model call; the signature
// (question + farm context in, answer text out) is what the UI expects.
import { delay } from '../utils/service'
import type { FarmProfile } from '../types'

export interface AssistantReply {
  text: string
  demo: true
}

export async function askAssistant(question: string, farm?: FarmProfile): Promise<AssistantReply> {
  // Future: return (await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ question, farm }) })).json()
  await delay(900)
  const q = question.toLowerCase()
  const crop = farm?.currentCrop ?? 'your crop'
  let text =
    'This is a demo answer. Once the AI service is connected, I will answer using your farm data, local weather and advisory services. For now, please explore the advisory pages.'
  if (q.includes('yellow')) {
    text = `Yellow leaves on ${crop} can have several possible causes. Check soil moisture (not too wet or dry), nutrient levels and signs of pests or disease on the leaf underside. You can also upload a leaf photo on the Disease Detection page for analysis. (Demo answer)`
  } else if (q.includes('irrigat') || q.includes('water')) {
    text =
      'Irrigation depends on your soil moisture and the weather ahead. Open the Irrigation Advisory page for a recommendation based on current conditions. (Demo answer)'
  } else if (q.includes('soil')) {
    text =
      'To improve soil health, add organic matter (FYM/compost), avoid compaction, keep the soil covered with mulch, and rotate crops each season. Run a Soil Analysis for specific actions. (Demo answer)'
  } else if (q.includes('crop')) {
    text =
      'Crop suitability depends on your soil type, pH, season and water availability. Try the Crop Advisory page — it is built to call a real recommendation model later. (Demo answer)'
  } else if (q.includes('disease') || q.includes('blight') || q.includes('pest')) {
    text = `Common ${crop} problems include leaf blight, early/late blight in humid weather, and fruit borers. Scan a leaf photo with Disease Detection and consult your local agriculture officer for treatment. (Demo answer)`
  }
  return { text, demo: true }
}
