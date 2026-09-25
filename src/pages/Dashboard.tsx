import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Activity,
  Bot,
  CloudRain,
  CloudSun,
  Droplets,
  FlaskConical,
  MapPin,
  ScanLine,
  Sprout,
  Wind,
} from 'lucide-react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import AdvisoryCard from '../components/ui/AdvisoryCard'
import { Card, CardTitle } from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import { Spinner } from '../components/ui/Loading'
import { useApp } from '../context/AppContext'
import { fetchAdvisories, fetchFarmHealthSeries } from '../services/advisoryService'
import { fetchWeatherBundle } from '../services/weatherService'
import type { AdvisoryItem, CurrentWeather, FarmHealthPoint } from '../types'

const quickActions = [
  { label: 'Crop Advisory', emoji: '🌱', to: '/crop-advisory', icon: <Sprout size={22} /> },
  { label: 'Weather', emoji: '🌦️', to: '/weather', icon: <CloudSun size={22} /> },
  { label: 'Soil Analysis', emoji: '🧪', to: '/soil', icon: <FlaskConical size={22} /> },
  { label: 'Detect Disease', emoji: '🐛', to: '/disease', icon: <ScanLine size={22} /> },
  { label: 'Irrigation', emoji: '💧', to: '/irrigation', icon: <Droplets size={22} /> },
  { label: 'Ask AI', emoji: '🤖', to: '/ai-assistant', icon: <Bot size={22} /> },
]

export default function Dashboard() {
  const { user, farm, formatTemp, formatArea } = useApp()
  const navigate = useNavigate()
  const [weather, setWeather] = useState<CurrentWeather | null>(null)
  const [weatherUpdated, setWeatherUpdated] = useState('')
  const [advisories, setAdvisories] = useState<AdvisoryItem[] | null>(null)
  const [series, setSeries] = useState<FarmHealthPoint[] | null>(null)

  useEffect(() => {
    let alive = true
    fetchWeatherBundle().then((w) => {
      if (!alive) return
      setWeather(w.current)
      setWeatherUpdated(w.lastUpdated)
    })
    fetchAdvisories().then((a) => alive && setAdvisories(a))
    fetchFarmHealthSeries().then((s) => alive && setSeries(s))
    return () => {
      alive = false
    }
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
  const name = user?.name || farm.farmerName

  return (
    <div className="page-container">
      {/* Dashboard hero */}
      <Card className="mb-5 bg-primary text-white" padded>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold md:text-3xl">
              {greeting}, {name} 👋
            </h1>
            <p className="mt-1 text-lg text-white/85">Here’s what’s happening on your farm today.</p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-base font-semibold">
              <MapPin size={16} aria-hidden /> {farm.location}
            </p>
          </div>
          {weather && (
            <button
              onClick={() => navigate('/weather')}
              className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-4 text-left transition-colors hover:bg-white/20"
              aria-label="Open weather advisory"
            >
              <CloudSun size={40} className="text-accent" aria-hidden />
              <div>
                <p className="text-2xl font-extrabold">{formatTemp(weather.temperatureC)}</p>
                <p className="text-sm text-white/85">{weather.condition}</p>
                {weatherUpdated && <p className="text-xs text-white/70">Last updated: {weatherUpdated}</p>}
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-white/80">
                  <span>💧 Humidity: {weather.humidity}%</span>
                  <span className="inline-flex items-center gap-1"><CloudRain size={12} /> Rain: {weather.rainProbability}%</span>
                  <span className="inline-flex items-center gap-1"><Wind size={12} /> {weather.windSpeedKmh} km/h</span>
                </div>
              </div>
            </button>
          )}
        </div>
      </Card>

      {/* Farm overview */}
      <section aria-labelledby="farm-overview">
        <h2 id="farm-overview" className="mb-3 text-xl font-bold text-ink">Farm Overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Sprout size={24} />} label="Current Crop" value={farm.currentCrop} />
          <StatCard icon={<Activity size={24} />} label="Farm Area" value={formatArea(farm.farmSize)} />
          <StatCard icon={<Droplets size={24} />} label="Soil Moisture" value="62%" sub="Adequate" />
          <StatCard icon={<span aria-hidden>❤️</span>} label="Crop Health" value="Good" sub="No major issues" />
        </div>
      </section>

      {/* Today's advisory */}
      <section aria-labelledby="today-advisory" className="mt-8">
        <h2 id="today-advisory" className="mb-3 text-xl font-bold text-ink">Today’s Advisory</h2>
        {advisories ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-3">
              {advisories[0] && <AdvisoryCard advisory={advisories[0]} featured link="/weather" />}
            </div>
            {advisories.slice(1).map((a) => (
              <AdvisoryCard
                key={a.id}
                advisory={a}
                link={
                  a.category === 'irrigation'
                    ? '/irrigation'
                    : a.category === 'fertilizer'
                      ? '/fertilizer'
                      : '/disease'
                }
              />
            ))}
          </div>
        ) : (
          <Spinner label="Loading today’s advisory…" />
        )}
      </section>

      {/* Quick actions */}
      <section aria-labelledby="quick-actions" className="mt-8">
        <h2 id="quick-actions" className="mb-3 text-xl font-bold text-ink">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="flex flex-col items-center gap-2 rounded-xl2 border border-gray-100 bg-white p-5 text-center shadow-card transition-shadow hover:shadow-card-hover"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-2xl" aria-hidden>
                {a.emoji}
              </span>
              <span className="text-base font-bold text-ink">{a.label}</span>
            </Link>
          ))}
        </div>
        <p className="sr-only">Icons next to labels are decorative; each link text describes its destination.</p>
      </section>

      {/* Farm health chart */}
      <section aria-labelledby="farm-health" className="mt-8">
        <h2 id="farm-health" className="mb-3 text-xl font-bold text-ink">Farm Health — Last 7 Days</h2>
        <Card>
          {series ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" tick={{ fontSize: 14 }} stroke="#6B7280" />
                  <YAxis tick={{ fontSize: 14 }} stroke="#6B7280" />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 14 }} />
                  <Line type="monotone" dataKey="cropHealth" name="Crop Health (%)" stroke="#2E7D32" strokeWidth={3} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="soilMoisture" name="Soil Moisture (%)" stroke="#0288D1" strokeWidth={3} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#F9A825" strokeWidth={3} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#7E57C2" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Spinner label="Loading farm health data…" />
          )}
          <CardTitle className="sr-only">Farm health chart</CardTitle>
        </Card>
      </section>
    </div>
  )
}
