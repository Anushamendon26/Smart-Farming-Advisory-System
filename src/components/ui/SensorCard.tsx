import { BatteryCharging, Wifi, WifiOff } from 'lucide-react'
import Badge from './Badge'
import { Card } from './Card'
import type { Sensor } from '../../types'

/** One IoT sensor reading card (spec §24). Values are mock demo data. */
export default function SensorCard({ sensor }: { sensor: Sensor }) {
  const connected = sensor.status === 'connected'
  return (
    <Card hoverable className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-lg font-bold text-ink">
          <span aria-hidden className="mr-1">{sensor.emoji}</span>
          {sensor.name}
        </p>
        <Badge tone={connected ? 'success' : 'neutral'}>
          {connected ? <Wifi size={14} aria-hidden /> : <WifiOff size={14} aria-hidden />}
          {connected ? 'Connected' : 'Not Connected'}
        </Badge>
      </div>

      {connected ? (
        <>
          <p className="text-3xl font-extrabold text-primary">
            {sensor.value}
            <span className="ml-1 text-base font-semibold text-muted">{sensor.unit}</span>
          </p>
          <div className="flex items-center justify-between text-sm text-muted">
            <span className="inline-flex items-center gap-1" title={`Battery ${sensor.battery}%`}>
              <BatteryCharging size={15} aria-hidden />
              {sensor.battery}% battery
            </span>
            <span>Last sync: {sensor.lastSync}</span>
          </div>
          <p className="text-xs text-muted">Demo reading — mock data until hardware is connected</p>
        </>
      ) : (
        <p className="flex-1 text-base text-muted">
          This sensor is not paired yet. Connect it to start receiving live readings.
        </p>
      )}
    </Card>
  )
}
