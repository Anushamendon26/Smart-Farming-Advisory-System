import { useEffect, useState } from 'react'
import { CloudRain, Droplets, Sprout, Thermometer, Timer } from 'lucide-react'
import Badge from '../components/ui/Badge'
import { Card, CardTitle } from '../components/ui/Card'
import Gauge from '../components/ui/Gauge'
import PageHeader from '../components/ui/PageHeader'
import { Spinner } from '../components/ui/Loading'
import { fetchIrrigationAdvice } from '../services/irrigationService'
import { useApp } from '../context/AppContext'
import type { IrrigationRecommendation } from '../types'

export default function Irrigation() {
  const { formatTemp } = useApp()
  const [data, setData] = useState<IrrigationRecommendation | null>(null)

  useEffect(() => {
    let alive = true
    fetchIrrigationAdvice().then((d) => alive && setData(d))
    return () => {
      alive = false
    }
  }, [])

  if (!data) {
    return (
      <div className="page-container">
        <PageHeader title="Irrigation Advisory" description="Loading irrigation guidance…" />
        <Spinner label="Checking soil moisture and weather…" />
      </div>
    )
  }

  const inputs = [
    { label: 'Temperature', value: formatTemp(data.temperatureC), icon: <Thermometer size={20} className="text-accent" aria-hidden /> },
    { label: 'Rain Forecast (prob.)', value: `${data.rainForecastNextDays}%`, icon: <CloudRain size={20} className="text-indigo-600" aria-hidden /> },
    { label: 'Recent Rainfall', value: '12 mm (Fri)', icon: <CloudRain size={20} className="text-blue-600" aria-hidden /> },
    { label: 'Crop', value: data.crop, icon: <Sprout size={20} className="text-primary" aria-hidden /> },
    { label: 'Growth Stage', value: data.growthStage, icon: <Droplets size={20} className="text-teal-600" aria-hidden /> },
  ]

  return (
    <div className="page-container">
      <PageHeader
        title="Irrigation Advisory"
        description="Water recommendations based on live soil moisture, weather and your crop stage."
        action={<Badge tone="warning">Demo values</Badge>}
      />

      {/* Soil moisture gauge (spec §16) */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-around gap-6">
          <Gauge value={data.soilMoisture} label="Soil moisture" />
          <div className="max-w-xs">
            <CardTitle>Is the soil thirsty?</CardTitle>
            <p className="mt-1 text-base text-muted">
              {data.soilMoisture < 35
                ? 'Soil is dry — irrigation is needed soon.'
                : data.soilMoisture > 65
                  ? 'Soil is wet enough — you can skip the next session.'
                  : 'Soil moisture is in the comfortable range for your crop.'}
            </p>
            <p className="mt-2 text-sm text-muted">Demo reading — will come from the field sensor once connected.</p>
          </div>
        </div>
      </Card>

      {/* Input conditions */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {inputs.map((i) => (
          <Card key={i.label} className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
              {i.icon}
            </div>
            <p className="mt-2 text-sm text-muted">{i.label}</p>
            <p className="text-lg font-bold text-ink">{i.value}</p>
          </Card>
        ))}
      </div>

      {/* Main recommendation */}
      <Card className="border-l-4 border-l-primary">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-3xl" aria-hidden>
            💧
          </span>
          <div>
            <CardTitle className="text-xl">Irrigation Recommendation</CardTitle>
            <p className="mt-1 text-2xl font-extrabold text-primary">{data.recommendation}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-background p-5">
            <p className="flex items-center gap-2 text-base font-semibold text-muted">
              <Droplets size={18} className="text-blue-600" aria-hidden /> Recommended Water
            </p>
            <p className="mt-1 text-3xl font-extrabold text-ink">{data.waterLiters} liters</p>
            <p className="text-sm text-muted">per acre for the next session</p>
          </div>
          <div className="rounded-xl bg-background p-5">
            <p className="flex items-center gap-2 text-base font-semibold text-muted">
              <Timer size={18} className="text-accent" aria-hidden /> Recommended Time
            </p>
            <p className="mt-1 text-3xl font-extrabold text-ink">{data.timeOfDay}</p>
            <p className="text-sm text-muted">early watering reduces evaporation loss</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-primary-light p-5">
          <p className="text-base font-bold text-primary">Why this recommendation?</p>
          <p className="mt-1 text-lg text-ink">{data.reason}</p>
        </div>
      </Card>

      <p className="mt-4 text-sm text-muted">
        ⚠️ Demo recommendation — the values above are estimated from mock sensor data. They update
        automatically from soil-moisture sensors and the weather service once they are connected.
      </p>
    </div>
  )
}
