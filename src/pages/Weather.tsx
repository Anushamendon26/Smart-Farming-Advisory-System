import { useEffect, useState } from 'react'
import { CloudRain, Sun, SunDim, ThumbsUp, Wind } from 'lucide-react'
import Badge from '../components/ui/Badge'
import { Card, CardTitle } from '../components/ui/Card'
import ExplanationCard from '../components/ui/ExplanationCard'
import PageHeader from '../components/ui/PageHeader'
import { Spinner } from '../components/ui/Loading'
import { useApp } from '../context/AppContext'
import { fetchWeatherBundle, type WeatherBundle } from '../services/weatherService'
import type { ForecastDay } from '../types'

const conditionMeta: Record<ForecastDay['condition'], { emoji: string; label: string }> = {
  sunny: { emoji: '☀️', label: 'Sunny' },
  'partly-cloudy': { emoji: '🌤️', label: 'Partly Cloudy' },
  cloudy: { emoji: '☁️', label: 'Cloudy' },
  rainy: { emoji: '🌧️', label: 'Rain' },
  stormy: { emoji: '⛈️', label: 'Storm' },
}

export default function Weather() {
  const { formatTemp } = useApp()
  const [data, setData] = useState<WeatherBundle | null>(null)

  useEffect(() => {
    let alive = true
    fetchWeatherBundle().then((w) => alive && setData(w))
    return () => {
      alive = false
    }
  }, [])

  if (!data) {
    return (
      <div className="page-container">
        <PageHeader title="Weather Advisory" description="Loading weather data…" />
        <Spinner label="Fetching current weather and forecast…" />
      </div>
    )
  }

  const { current, forecast, recommendations } = data

  const metrics = [
    { label: 'Temperature', value: formatTemp(current.temperatureC), icon: <Sun size={20} className="text-accent" aria-hidden /> },
    { label: 'Humidity', value: `${current.humidity}%`, icon: <CloudRain size={20} className="text-blue-600" aria-hidden /> },
    { label: 'Wind Speed', value: `${current.windSpeedKmh} km/h`, icon: <Wind size={20} className="text-teal-600" aria-hidden /> },
    { label: 'Rain Probability', value: `${current.rainProbability}%`, icon: <CloudRain size={20} className="text-indigo-600" aria-hidden /> },
    { label: 'UV Index', value: String(current.uvIndex), icon: <SunDim size={20} className="text-orange-500" aria-hidden /> },
  ]

  return (
    <div className="page-container">
      <PageHeader
        title="Weather Advisory"
        description="Live weather for your farm location, with farming-focused guidance below."
        action={
          <span className="inline-flex items-center gap-2">
            <Badge tone="neutral">Demo data</Badge>
            <span className="text-sm font-medium text-muted">Last updated: {data.lastUpdated}</span>
          </span>
        }
      />

      {/* Weather alerts — with explanations */}
      <section aria-labelledby="alerts" className="mb-6">
        <h2 id="alerts" className="mb-3 text-xl font-bold text-ink">Weather Alerts</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {data.alerts.map((a) => (
            <Card key={a.id} hoverable className="border-l-4 border-l-accent">
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{a.title}</CardTitle>
                <Badge tone={a.severity === 'info' ? 'info' : 'warning'}>{a.status}</Badge>
              </div>
              <p className="mt-1 text-base text-ink/90">{a.message}</p>
              <ExplanationCard
                what={a.title}
                why={a.why}
                dataUsed={a.dataUsed}
                nextStep={a.nextStep}
                collapsible
              />
            </Card>
          ))}
        </div>
      </section>

      {/* Current conditions */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-6">
          <span className="text-6xl" aria-hidden>🌤️</span>
          <div>
            <p className="text-4xl font-extrabold text-ink">{formatTemp(current.temperatureC)}</p>
            <p className="text-lg text-muted">{current.condition}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl bg-background p-4">
              <div className="flex items-center gap-2">
                {m.icon}
                <p className="text-sm font-medium text-muted">{m.label}</p>
              </div>
              <p className="mt-1 text-xl font-bold text-ink">{m.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 7-day forecast — raw weather data */}
      <section aria-labelledby="forecast" className="mb-6">
        <h2 id="forecast" className="mb-3 text-xl font-bold text-ink">
          7-Day Forecast <span className="text-sm font-medium text-muted">(weather data)</span>
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {forecast.map((d) => (
            <Card key={d.date} className="text-center" padded>
              <p className="text-base font-bold text-ink">{d.date}</p>
              <p className="my-2 text-4xl" aria-hidden>{conditionMeta[d.condition].emoji}</p>
              <p className="text-sm text-muted">{conditionMeta[d.condition].label}</p>
              <p className="mt-1 text-lg font-bold text-ink">
                {formatTemp(d.tempMaxC)}
                <span className="text-base font-medium text-muted"> / {formatTemp(d.tempMinC)}</span>
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-blue-700">
                <CloudRain size={14} aria-hidden /> {d.rainProbability}%
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Recommendations — clearly separated from weather data */}
      <section aria-labelledby="recs">
        <h2 id="recs" className="mb-1 text-xl font-bold text-ink">
          Farming Recommendations <span className="text-sm font-medium text-muted">(advice based on the forecast)</span>
        </h2>
        <p className="mb-3 text-base text-muted">These are suggestions for farm activities — not part of the weather measurement itself.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {recommendations.map((r) => (
            <Card key={r.id} hoverable>
              <div className="flex items-center justify-between">
                <span className="text-3xl" aria-hidden>
                  {r.title.toLowerCase().includes('rain') ? '🌧️' : r.title.toLowerCase().includes('temperature') ? '☀️' : '💨'}
                </span>
                <Badge tone={r.severity === 'warning' ? 'warning' : r.severity === 'success' ? 'success' : 'info'}>
                  {r.status}
                </Badge>
              </div>
              <CardTitle className="mt-3">{r.title}</CardTitle>
              <p className="mt-1 text-base text-muted">{r.message}</p>
              {(r.why || r.dataUsed || r.nextStep) && (
                <ExplanationCard what={r.title} why={r.why} dataUsed={r.dataUsed} nextStep={r.nextStep} collapsible />
              )}
            </Card>
          ))}
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-muted">
          <ThumbsUp size={14} aria-hidden /> Weather numbers come from the weather service; recommendations are generated separately.
        </p>
      </section>
    </div>
  )
}
