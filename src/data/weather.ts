import type { AdvisoryItem, CurrentWeather, ForecastDay } from '../types'

// Demo weather data. Replace with real weather-API responses in
// services/weatherService.ts — never presented as live data.

export const weatherLastUpdated = '10:30 AM'

export const currentWeather: CurrentWeather = {
  temperatureC: 28,
  condition: 'Partly Cloudy',
  humidity: 68,
  rainProbability: 30,
  windSpeedKmh: 12,
  uvIndex: 6,
}

export const forecast: ForecastDay[] = [
  { date: 'Thu', condition: 'partly-cloudy', tempMaxC: 29, tempMinC: 21, rainProbability: 30 },
  { date: 'Fri', condition: 'rainy', tempMaxC: 26, tempMinC: 20, rainProbability: 80 },
  { date: 'Sat', condition: 'rainy', tempMaxC: 25, tempMinC: 19, rainProbability: 70 },
  { date: 'Sun', condition: 'cloudy', tempMaxC: 27, tempMinC: 20, rainProbability: 40 },
  { date: 'Mon', condition: 'sunny', tempMaxC: 31, tempMinC: 22, rainProbability: 10 },
  { date: 'Tue', condition: 'sunny', tempMaxC: 33, tempMinC: 23, rainProbability: 5 },
  { date: 'Wed', condition: 'partly-cloudy', tempMaxC: 30, tempMinC: 22, rainProbability: 25 },
]

export const weatherAlerts: AdvisoryItem[] = [
  {
    id: 'wa1',
    category: 'weather',
    title: 'Rain Expected',
    message: 'Heavy rainfall may occur tomorrow.',
    status: 'Alert',
    severity: 'warning',
    why: 'The 48-hour forecast shows an 80% probability of rain with sustained winds.',
    dataUsed: [
      { label: 'Rain probability (Fri)', value: '80%' },
      { label: 'Temperature', value: '26°C' },
    ],
    nextStep: 'Consider postponing irrigation and keep harvested produce under cover.',
  },
  {
    id: 'wa2',
    category: 'weather',
    title: 'High Temperature',
    message: 'Temperatures rise above 32°C on Mon–Tue.',
    status: 'Watch',
    severity: 'warning',
    why: 'Daytime peaks are forecast well above the season average for your stage of growth.',
    dataUsed: [
      { label: 'Max temp (Mon)', value: '31°C' },
      { label: 'Max temp (Tue)', value: '33°C' },
    ],
    nextStep: 'Increase irrigation monitoring in the morning and evening.',
  },
  {
    id: 'wa3',
    category: 'weather',
    title: 'Strong Winds',
    message: 'Winds near 25 km/h expected Friday afternoon.',
    status: 'Caution',
    severity: 'info',
    why: 'Wind forecasts exceed the safe limit for spray operations.',
    dataUsed: [{ label: 'Wind speed', value: '25 km/h' }],
    nextStep: 'Avoid spraying pesticides or herbicides during windy periods.',
  },
]
