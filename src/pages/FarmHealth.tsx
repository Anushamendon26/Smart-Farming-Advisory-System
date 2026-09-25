import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Satellite, Sprout } from 'lucide-react'
import FarmMap from '../components/FarmMap'
import Badge from '../components/ui/Badge'
import { Card, CardTitle } from '../components/ui/Card'
import { ErrorState } from '../components/ui/States'
import { Spinner } from '../components/ui/Loading'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import { fetchFarmHealthSeries, fetchFieldZones } from '../services/advisoryService'
import { useApp } from '../context/AppContext'
import type { FarmHealthPoint, FieldZone } from '../types'

export default function FarmHealth() {
  const { farm, formatArea } = useApp()
  const [zones, setZones] = useState<FieldZone[] | null>(null)
  const [series, setSeries] = useState<FarmHealthPoint[]>([])
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let alive = true
    setError('')
    Promise.all([fetchFieldZones(), fetchFarmHealthSeries()])
      .then(([z, s]) => {
        if (!alive) return
        setZones(z)
        setSeries(s)
      })
      .catch((e: unknown) => alive && setError(e instanceof Error ? e.message : 'Failed to load farm health data'))
    return () => {
      alive = false
    }
  }, [reload])

  const latest = series[series.length - 1]
  const zoneCount = (s: FieldZone['status']) => zones?.filter((z) => z.status === s).length ?? 0

  if (error) {
    return (
      <div className="page-container">
        <PageHeader title="Farm Health" />
        <ErrorState message={error} onRetry={() => setReload((n) => n + 1)} />
      </div>
    )
  }

  if (!zones) {
    return (
      <div className="page-container">
        <Spinner label="Loading farm health…" />
      </div>
    )
  }

  return (
    <div className="page-container space-y-6">
      <PageHeader
        title="Farm Health"
        description="Zone-by-zone condition overview for your farm, based on the latest advisory data."
        action={<Badge tone="warning">Demo Data</Badge>}
      />

      {/* Summary counts — icon + text, never color alone */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={<Sprout size={22} aria-hidden />} label="Healthy zones" value={`${zoneCount('healthy')} of ${zones.length}`} sub="No action needed" />
        <StatCard icon={<span className="text-xl" aria-hidden>🟡</span>} label="Needs attention" value={`${zoneCount('attention')}`} sub="Monitor closely" />
        <StatCard icon={<span className="text-xl" aria-hidden>🔴</span>} label="Critical zones" value={`${zoneCount('critical')}`} sub="Act today" />
      </div>

      <Card>
        <CardTitle>Field zones map</CardTitle>
        <p className="mb-4 mt-0.5 text-sm text-muted">
          {farm.currentCrop} · {formatArea(farm.farmSize)} · {farm.location}
        </p>
        <FarmMap zones={zones} area={formatArea(farm.farmSize)} crop={farm.currentCrop} />
      </Card>

      {latest && (
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Crop health trend (last 7 days)</CardTitle>
            <p className="text-sm text-muted">Latest score: {latest.cropHealth}/100</p>
          </div>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" tick={{ fontSize: 13 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 13 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 14 }} />
                <Line type="monotone" dataKey="cropHealth" name="Crop health" stroke="#2E7D32" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="soilMoisture" name="Soil moisture" stroke="#F9A825" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* NDVI placeholder — satellite imagery API not connected yet (spec §12) */}
      <Card className="flex flex-col items-center gap-3 border-dashed py-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <Satellite size={28} aria-hidden />
        </span>
        <h3 className="text-xl font-bold text-ink">
          Satellite NDVI Monitoring <Badge tone="info">Coming Soon</Badge>
        </h3>
        <p className="max-w-md text-base text-muted">
          Drone / satellite vegetation indices will appear here once the imagery API is connected. This
          feature is not available in the demo.
        </p>
        <Link
          to="/crop-advisory"
          className="inline-flex items-center justify-center rounded-xl border-2 border-primary bg-white px-5 py-2.5 text-base font-semibold text-primary transition-colors hover:bg-primary-light"
        >
          Get crop advisory instead
        </Link>
      </Card>

      <p className="text-sm text-muted">
        ⚠️ Farm health is estimated from demo sensor and advisory data. Always confirm critical-zone
        actions with your local agriculture expert.
      </p>
    </div>
  )
}
