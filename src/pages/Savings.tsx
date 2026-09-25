import { useMemo, useState, type FormEvent } from 'react'
import { Coins, Droplets, Zap } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Card, CardTitle } from '../components/ui/Card'
import { Field, TextInput } from '../components/ui/Form'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import { useApp } from '../context/AppContext'

// Advisory-driven efficiency assumptions for the demo calculator. A real
// backend would replace these with measured / model-based values.
const WATER_SAVING = 0.3 // 30% water saved with scheduled irrigation
const FERTILIZER_SAVING = 0.15 // 15% fertilizer saved with soil-based dosing
const ENERGY_SAVING = 0.2 // 20% pump energy saved with fewer irrigation runs

const rupees = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

function NumberField({
  label,
  value,
  onChange,
  prefix,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  prefix?: string
}) {
  return (
    <Field label={label}>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base font-semibold text-muted">
            {prefix}
          </span>
        )}
        <TextInput
          type="number"
          min="0"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={prefix ? 'pl-10' : ''}
          required
        />
      </div>
    </Field>
  )
}

export default function Savings() {
  const { farm, formatArea } = useApp()
  const [waterCost, setWaterCost] = useState('2500')
  const [fertilizerCost, setFertilizerCost] = useState('6000')
  const [energyCost, setEnergyCost] = useState('1800')
  const [result, setResult] = useState<{ water: number; fert: number; energy: number } | null>(null)

  const total = useMemo(
    () => (result ? result.water + result.fert + result.energy : 0),
    [result],
  )

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const w = Math.max(0, Number(waterCost) || 0)
    const f = Math.max(0, Number(fertilizerCost) || 0)
    const en = Math.max(0, Number(energyCost) || 0)
    setResult({
      water: w * WATER_SAVING,
      fert: f * FERTILIZER_SAVING,
      energy: en * ENERGY_SAVING,
    })
  }

  const monthlyBill =
    (Math.max(0, Number(waterCost) || 0) +
      Math.max(0, Number(fertilizerCost) || 0) +
      Math.max(0, Number(energyCost) || 0)) /
    12

  return (
    <div className="page-container space-y-6">
      <PageHeader
        title="Farm Savings Calculator"
        description="See how much following smart irrigation and fertilizer advisories could save you every month."
        action={<Badge tone="warning">Estimates</Badge>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Your monthly input costs</CardTitle>
          <p className="mb-4 mt-1 text-sm text-muted">
            Enter approximate spending for the current season (about {formatArea(farm.farmSize)}, {farm.currentCrop}).
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            <NumberField label="Water / irrigation cost (₹ per season)" value={waterCost} onChange={setWaterCost} prefix="₹" />
            <NumberField label="Fertilizer cost (₹ per season)" value={fertilizerCost} onChange={setFertilizerCost} prefix="₹" />
            <NumberField label="Pump energy / electricity cost (₹ per season)" value={energyCost} onChange={setEnergyCost} prefix="₹" />
            <Button type="submit" size="lg" fullWidth>
              Calculate Estimated Savings
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          {result ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard icon={<Droplets size={22} aria-hidden />} label="Water saved" value={rupees(result.water)} sub={`${Math.round(WATER_SAVING * 100)}% of irrigation cost`} />
                <StatCard icon={<Coins size={22} aria-hidden />} label="Fertilizer saved" value={rupees(result.fert)} sub={`${Math.round(FERTILIZER_SAVING * 100)}% of fertilizer cost`} />
                <StatCard icon={<Zap size={22} aria-hidden />} label="Energy saved" value={rupees(result.energy)} sub={`${Math.round(ENERGY_SAVING * 100)}% of pump energy`} />
              </div>
              <Card className="bg-primary-light">
                <p className="text-base font-semibold text-primary">Estimated total savings this season</p>
                <p className="mt-1 text-4xl font-extrabold text-ink">{rupees(total)}</p>
                <p className="mt-2 text-sm text-muted">
                  ≈ {rupees(total / 6)} per month · current avg input bill ≈ {rupees(monthlyBill)}/month
                </p>
              </Card>
              <ul className="space-y-2 text-base text-ink/90">
                <li>💧 Follow the <strong>Irrigation Advisory</strong> schedule instead of fixed watering.</li>
                <li>🧪 Use <strong>soil-health-based fertilizer doses</strong> from the Fertilizer Advisory.</li>
                <li>⚡ Fewer pump runs when rain is forecast → direct electricity savings.</li>
              </ul>
            </>
          ) : (
            <Card className="flex flex-col items-center gap-3 py-14 text-center">
              <span className="text-5xl" aria-hidden>🌾</span>
              <h3 className="text-xl font-bold text-ink">Fill in your costs to see savings</h3>
              <p className="max-w-xs text-base text-muted">
                The estimate appears here instantly — nothing is uploaded, it all runs on this device.
              </p>
            </Card>
          )}
        </div>
      </div>

      <p className="text-sm text-muted">
        ⚠️ These are <strong>estimated demo savings</strong> based on typical efficiency gains from advisory
        adoption, not guarantees. Actual savings depend on your field conditions — consult your local
        agriculture expert before changing practices.
      </p>
    </div>
  )
}
