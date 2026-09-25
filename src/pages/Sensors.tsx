import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Card, CardTitle } from '../components/ui/Card'
import { Spinner } from '../components/ui/Loading'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import SensorCard from '../components/ui/SensorCard'
import { ErrorState } from '../components/ui/States'
import { useToast } from '../components/ui/Toast'
import { connectSensor, fetchSensors } from '../services/sensorService'
import type { Sensor } from '../types'

export default function Sensors() {
  const { showToast } = useToast()
  const [sensors, setSensors] = useState<Sensor[] | null>(null)
  const [lastSync, setLastSync] = useState('')
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const [pairing, setPairing] = useState<Sensor | null>(null)
  const [pairingBusy, setPairingBusy] = useState(false)

  const load = useCallback(() => {
    setError('')
    setSensors(null)
    fetchSensors()
      .then((bundle) => {
        setSensors(bundle.sensors)
        setLastSync(bundle.lastSync)
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load sensor data'))
  }, [])

  useEffect(() => {
    load()
  }, [load, reload])

  const connect = async () => {
    if (!pairing) return
    setPairingBusy(true)
    const updated = await connectSensor(pairing.id)
    setPairingBusy(false)
    if (updated) {
      // Mock pairing: mark connected with sample readings
      setSensors((list) =>
        (list ?? []).map((s) =>
          s.id === updated.id
            ? { ...s, status: 'connected', value: 50, unit: '%', battery: 100, lastSync: 'just now' }
            : s,
        ),
      )
      showToast(`${updated.name} connected (demo)`, 'success')
    }
    setPairing(null)
  }

  const connectedCount = sensors?.filter((s) => s.status === 'connected').length ?? 0

  return (
    <div className="page-container space-y-6">
      <PageHeader
        title="Sensors & IoT Devices"
        description="Live readings from field sensors. No hardware is connected yet — all values below are mock demo data."
        action={
          <Button variant="outline" size="sm" onClick={() => setReload((n) => n + 1)}>
            <RefreshCw size={16} aria-hidden /> Refresh
          </Button>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={() => setReload((n) => n + 1)} />
      ) : !sensors ? (
        <Spinner label="Reading sensors…" />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="info">
              {connectedCount} of {sensors.length} connected
            </Badge>
            <p className="text-sm text-muted">Last sync: {lastSync} · Demo readings — not from real hardware</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sensors.map((s) => (
              <div key={s.id} className="flex flex-col gap-2">
                <SensorCard sensor={s} />
                {s.status === 'not-connected' && (
                  <Button variant="secondary" onClick={() => setPairing(s)}>
                    Connect Sensor
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Card>
            <CardTitle>How real sensors will connect</CardTitle>
            <p className="mt-2 text-base text-muted">
              This page talks to <code className="rounded bg-gray-100 px-1 text-sm">services/sensorService.ts</code> only.
              When hardware is ready, the same UI will receive live data from an <strong>ESP32 gateway</strong>{' '}
              over REST or MQTT — soil moisture, temperature, humidity and NPK probes stream their readings,
              and this page needs no changes.
            </p>
          </Card>
        </>
      )}

      <Modal open={pairing !== null} onClose={() => !pairingBusy && setPairing(null)} title="Connect Sensor">
        <p className="text-base text-ink">
          Pair <strong>{pairing?.name}</strong> with this farm?
        </p>
        <p className="mt-2 text-sm text-muted">
          In the demo this instantly simulates a successful pairing with mock readings. A production build
          would provision the device through the sensor gateway.
        </p>
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setPairing(null)} disabled={pairingBusy}>
            Cancel
          </Button>
          <Button onClick={connect} disabled={pairingBusy}>
            {pairingBusy ? 'Pairing…' : 'Connect'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
