// Advisory service — dashboard advisories, farm-health series and history.
import { advisories, farmHealthSeries, fieldZones, historyItems } from '../data/advisories'
import { delay } from '../utils/service'
import type { AdvisoryItem, FarmHealthPoint, FieldZone, HistoryItem } from '../types'

export async function fetchAdvisories(): Promise<AdvisoryItem[]> {
  await delay(400)
  return advisories
}

export async function fetchFarmHealthSeries(): Promise<FarmHealthPoint[]> {
  await delay(400)
  return farmHealthSeries
}

export async function fetchFieldZones(): Promise<FieldZone[]> {
  await delay(400)
  return fieldZones
}

export async function fetchAdvisoryHistory(): Promise<HistoryItem[]> {
  await delay(400)
  return historyItems
}
