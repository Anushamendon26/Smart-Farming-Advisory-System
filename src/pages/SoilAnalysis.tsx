import { useState, type FormEvent } from 'react'
import { CheckCircle2, FlaskConical } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Card, CardTitle } from '../components/ui/Card'
import { Field, SelectField, TextInput } from '../components/ui/Form'
import PageHeader from '../components/ui/PageHeader'
import { Spinner } from '../components/ui/Loading'
import { analyzeSoil } from '../services/soilService'
import type { SoilInput, SoilResult } from '../types'
import { defaultSoilInput } from '../data/soil'

const defaultInput: SoilInput = defaultSoilInput

const soilTypes = ['Loamy', 'Clayey', 'Sandy', 'Red', 'Black Cotton', 'Laterite', 'Alluvial']

const levelTone = (l: string) => (l === 'Low' ? 'warning' : l === 'High' ? 'info' : 'success')

export default function SoilAnalysis() {
  const [input, setInput] = useState<SoilInput>(defaultInput)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SoilResult | null>(null)

  const setNum = (key: keyof SoilInput, v: string) =>
    setInput((i) => ({ ...i, [key]: Number(v) }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    const r = await analyzeSoil(input)
    setResult(r)
    setLoading(false)
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Soil Analysis"
        description="Enter your latest soil test values to understand soil health and the actions to take."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
            <Field label="Nitrogen (kg/ha)">
              <TextInput type="number" min={0} value={input.nitrogen} onChange={(e) => setNum('nitrogen', e.target.value)} required />
            </Field>
            <Field label="Phosphorus (kg/ha)">
              <TextInput type="number" min={0} value={input.phosphorus} onChange={(e) => setNum('phosphorus', e.target.value)} required />
            </Field>
            <Field label="Potassium (kg/ha)">
              <TextInput type="number" min={0} value={input.potassium} onChange={(e) => setNum('potassium', e.target.value)} required />
            </Field>
            <Field label="pH" hint="0 (acidic) – 14 (alkaline)">
              <TextInput type="number" step={0.1} min={0} max={14} value={input.ph} onChange={(e) => setNum('ph', e.target.value)} required />
            </Field>
            <Field label="Moisture (%)">
              <TextInput type="number" min={0} max={100} value={input.moisture} onChange={(e) => setNum('moisture', e.target.value)} required />
            </Field>
            <SelectField
              label="Soil Type"
              options={soilTypes.map((s) => ({ value: s, label: s }))}
              value={input.soilType}
              onChange={(v) => setInput((i) => ({ ...i, soilType: v }))}
            />
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" fullWidth disabled={loading}>
                <FlaskConical size={20} aria-hidden /> Analyze Soil
              </Button>
            </div>
          </form>
        </Card>

        <div className="lg:col-span-3">
          {loading && <Spinner label="Analyzing soil sample…" />}
          {!loading && result && (
            <div className="space-y-5">
              {/* Soil health summary */}
              <Card className="flex items-center gap-5">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-3xl" aria-hidden>
                  🪱
                </span>
                <div>
                  <p className="text-base font-medium text-muted">Soil Health</p>
                  <p className="text-3xl font-extrabold text-primary">{result.health}</p>
                </div>
              </Card>

              {/* Nutrient cards */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card className="text-center">
                  <p className="text-sm text-muted">Nitrogen</p>
                  <p className="my-1 text-xl font-bold text-ink">{result.nutrients.nitrogen}</p>
                  <Badge tone={levelTone(result.nutrients.nitrogen)}>{result.nutrients.nitrogen}</Badge>
                </Card>
                <Card className="text-center">
                  <p className="text-sm text-muted">Phosphorus</p>
                  <p className="my-1 text-xl font-bold text-ink">{result.nutrients.phosphorus}</p>
                  <Badge tone={levelTone(result.nutrients.phosphorus)}>{result.nutrients.phosphorus}</Badge>
                </Card>
                <Card className="text-center">
                  <p className="text-sm text-muted">Potassium</p>
                  <p className="my-1 text-xl font-bold text-ink">{result.nutrients.potassium}</p>
                  <Badge tone={levelTone(result.nutrients.potassium)}>{result.nutrients.potassium}</Badge>
                </Card>
                <Card className="text-center">
                  <p className="text-sm text-muted">pH</p>
                  <p className="my-1 text-xl font-bold text-ink">{result.ph}</p>
                  <Badge tone={Math.abs(result.ph - 6.8) < 1 ? 'success' : 'warning'}>
                    {result.ph < 6.5 ? 'Slightly acidic' : result.ph > 7.5 ? 'Slightly alkaline' : 'Balanced'}
                  </Badge>
                </Card>
              </div>

              {/* Visual soil-health breakdown */}
              <Card>
                <CardTitle>Nutrient Balance Chart</CardTitle>
                <div className="mt-4 space-y-4">
                  {result.scores.map((s) => (
                    <div key={s.label}>
                      <div className="mb-1 flex justify-between text-base">
                        <span className="font-semibold text-ink">{s.label}</span>
                        <span className="text-muted">{Math.round(s.value)}%</span>
                      </div>
                      <div
                        className="h-3.5 overflow-hidden rounded-full bg-primary-light"
                        role="progressbar"
                        aria-valuenow={Math.round(s.value)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${s.label} score`}
                      >
                        <div
                          className={`h-full rounded-full ${s.value > 65 ? 'bg-secondary' : s.value > 40 ? 'bg-accent' : 'bg-red-400'}`}
                          style={{ width: `${Math.min(100, s.value)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recommended actions */}
              <Card>
                <CardTitle>Recommended Actions</CardTitle>
                <ul className="mt-3 space-y-2.5">
                  {result.recommendedActions.map((a) => (
                    <li key={a} className="flex items-start gap-2.5 text-base text-ink">
                      <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden />
                      {a}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
          {!loading && !result && (
            <Card className="flex h-full min-h-64 flex-col items-center justify-center text-center">
              <span className="text-5xl" aria-hidden>🧪</span>
              <h3 className="mt-3 text-xl font-bold text-ink">Enter your soil test values</h3>
              <p className="mt-1 max-w-sm text-base text-muted">
                Use the latest soil health card values, or a quick field test kit.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
