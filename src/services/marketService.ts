// Market service — future endpoint: GET /api/market-prices (AGMARKNET or
// similar). Prices shown are demo data and clearly labelled — never claim
// they are live.
import { marketPrices, priceTrends } from '../data/market'
import { delay } from '../utils/service'
import type { MarketPrice, PricePoint } from '../types'

export interface MarketBundle {
  prices: MarketPrice[]
  trends: Record<string, PricePoint[]>
  fetchedAt: string
}

export async function fetchMarketPrices(): Promise<MarketBundle> {
  await delay()
  return { prices: marketPrices, trends: priceTrends, fetchedAt: new Date().toLocaleTimeString() }
}
