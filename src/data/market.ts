import type { MarketPrice, PricePoint } from '../types'

// Demo market prices — NOT live data. Will be replaced by an AGMARKNET /
// market-data API in services/marketService.ts.

export const marketPrices: MarketPrice[] = [
  { crop: 'Tomato', market: 'Nashik Market', pricePerQuintal: 2450, changePercent: 4.2, lastUpdated: 'Today, 9:30 AM' },
  { crop: 'Onion', market: 'Nashik Market', pricePerQuintal: 1820, changePercent: -1.8, lastUpdated: 'Today, 9:30 AM' },
  { crop: 'Wheat', market: 'Pimpalgaon APMC', pricePerQuintal: 2670, changePercent: 0.9, lastUpdated: 'Today, 8:45 AM' },
  { crop: 'Maize', market: 'Lasalgaon APMC', pricePerQuintal: 2140, changePercent: 2.1, lastUpdated: 'Today, 9:05 AM' },
  { crop: 'Potato', market: 'Nashik Market', pricePerQuintal: 1560, changePercent: -0.6, lastUpdated: 'Today, 9:30 AM' },
  { crop: 'Soybean', market: 'Kalwan APMC', pricePerQuintal: 4580, changePercent: 1.4, lastUpdated: 'Yesterday, 5:20 PM' },
]

export const priceTrends: Record<string, PricePoint[]> = {
  Tomato: [
    { date: '01 Sep', price: 2100 },
    { date: '05 Sep', price: 2240 },
    { date: '09 Sep', price: 2180 },
    { date: '13 Sep', price: 2350 },
    { date: '17 Sep', price: 2290 },
    { date: '20 Sep', price: 2410 },
    { date: '23 Sep', price: 2450 },
  ],
  Onion: [
    { date: '01 Sep', price: 1900 },
    { date: '05 Sep', price: 1860 },
    { date: '09 Sep', price: 1790 },
    { date: '13 Sep', price: 1850 },
    { date: '17 Sep', price: 1880 },
    { date: '20 Sep', price: 1840 },
    { date: '23 Sep', price: 1820 },
  ],
  Wheat: [
    { date: '01 Sep', price: 2600 },
    { date: '05 Sep', price: 2620 },
    { date: '09 Sep', price: 2650 },
    { date: '13 Sep', price: 2610 },
    { date: '17 Sep', price: 2640 },
    { date: '20 Sep', price: 2660 },
    { date: '23 Sep', price: 2670 },
  ],
}
