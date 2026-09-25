// Soil service — future endpoint: POST /api/soil-analysis
import { delay } from '../utils/service'
import type { SoilInput, SoilResult } from '../types'

export async function analyzeSoil(input: SoilInput): Promise<SoilResult> {
  // Future: return (await fetch('/api/soil-analysis', { method: 'POST', body: JSON.stringify(input) })).json()
  await delay(1000)
  const level = (v: number, low: number, high: number) =>
    v < low ? 'Low' : v > high ? 'High' : 'Medium'
  const scores = [
    { label: 'Nitrogen', value: Math.min(100, Math.round((input.nitrogen / 400) * 100)) },
    { label: 'Phosphorus', value: Math.min(100, Math.round((input.phosphorus / 60) * 100)) },
    { label: 'Potassium', value: Math.min(100, Math.round((input.potassium / 400) * 100)) },
    { label: 'pH Balance', value: Math.max(0, 100 - Math.abs(6.8 - input.ph) * 25) },
    { label: 'Moisture', value: input.moisture },
  ]
  const avg = scores.reduce((s, x) => s + x.value, 0) / scores.length
  return {
    health: avg > 80 ? 'Excellent' : avg > 62 ? 'Good' : avg > 42 ? 'Fair' : 'Poor',
    nutrients: {
      nitrogen: level(input.nitrogen, 280, 560) as SoilResult['nutrients']['nitrogen'],
      phosphorus: level(input.phosphorus, 25, 50) as SoilResult['nutrients']['phosphorus'],
      potassium: level(input.potassium, 200, 380) as SoilResult['nutrients']['potassium'],
    },
    ph: input.ph,
    moisture: input.moisture,
    scores,
    recommendedActions: [
      'Monitor nitrogen through the season and supplement as needed.',
      'Maintain current irrigation practice — moisture is near target.',
      'Recheck soil after fertilization, before the next sowing cycle.',
    ],
  }
}
