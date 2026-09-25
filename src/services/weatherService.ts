// Weather service — future endpoint: GET /api/weather (e.g. OpenWeather / IMD).
import { advisories } from '../data/advisories'
import { currentWeather, forecast, weatherAlerts, weatherLastUpdated } from '../data/weather'
import { delay, timeNow } from '../utils/service'
import type { AdvisoryItem, CurrentWeather, ForecastDay } from '../types'

export interface WeatherBundle {
  current: CurrentWeather
  forecast: ForecastDay[]
  recommendations: AdvisoryItem[]
  alerts: AdvisoryItem[]
  lastUpdated: string
  fetchedAt: string
}

export async function fetchWeatherBundle(): Promise<WeatherBundle> {
  await delay()
  return {
    current: currentWeather,
    forecast,
    recommendations: advisories.filter((a) => a.category !== 'crop-health'),
    alerts: weatherAlerts,
    lastUpdated: weatherLastUpdated,
    fetchedAt: timeNow(),
  }
}
