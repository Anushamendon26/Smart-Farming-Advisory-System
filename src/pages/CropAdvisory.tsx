import { useState, type FormEvent } from 'react'
import { Droplets, Sprout } from 'lucide-react'
import Button from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field, SelectField, TextInput } from '../components/ui/Form'
import PageHeader from '../components/ui/PageHeader'
import { Spinner } from '../components/ui/Loading'
import { useApp } from '../context/AppContext'
import { getCropRecommendations } from '../services/cropService'
import type { CropAdvisoryInput, CropRecommendation } from '../types'

const seasons = ['Kharif', 'Rabi', 'Zaid', 'Summer', 'Winter']
const soilTypes = ['Loamy', 'Clayey', 'Sandy', 'Red', 'Black Cotton', 'Laterite', 'Alluvial']

const initialInput: CropAdvisoryInput = {
  location: '',
  soilType: 'Loamy',
  soilPh: 6.8,
  nitrogen: 280,
  phosphorus: 24,
  potassium: 168,
  temperature: 28,
  humidity: 65,
  rainfall: 650,
  farmArea: 4.5,
  waterAvailability: 'medium',
  season: 'Kharif',
}

export default function CropAdvisory() {
  const { farm } = useApp()
  const [input, setInput] = useState<CropAdvisoryInput>({
    ...initialInput,
    location: farm.location,
    soilType: farm.soilType,
    farmArea: farm.farmSize,
  })
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<CropRecommendation[] | null>(null)

  const set = <K extends keyof CropAdvisoryInput>(key: K, value: CropAdvisoryInput[K]) =>
    setInput((i) => ({ ...i, [key]: value }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResults(null)
    const res = await getCropRecommendations(input)
    setResults(res)
    setLoading(false)
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Which crop should I grow?"
        description="Get personalized crop recommendations based on your soil, weather and water conditions."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
            <Field label="Location">
              <TextInput value={input.location} onChange={(e) => set('location', e.target.value)} required />
            </Field>
            <SelectField
              label="Soil Type"
              options={soilTypes.map((s) => ({ value: s, label: s }))}
              value={input.soilType}
              onChange={(v) => set('soilType', v)}
            />
            <Field label="Soil pH" hint="Typically 5.5 – 8.0">
              <TextInput type="number" step={0.1} min={3} max={12} value={input.soilPh} onChange={(e) => set('soilPh', Number(e.target.value))} required />
            </Field>
            <Field label="Nitrogen (kg/ha)">
              <TextInput type="number" min={0} value={input.nitrogen} onChange={(e) => set('nitrogen', Number(e.target.value))} required />
            </Field>
            <Field label="Phosphorus (kg/ha)">
              <TextInput type="number" min={0} value={input.phosphorus} onChange={(e) => set('phosphorus', Number(e.target.value))} required />
            </Field>
            <Field label="Potassium (kg/ha)">
              <TextInput type="number" min={0} value={input.potassium} onChange={(e) => set('potassium', Number(e.target.value))} required />
            </Field>
            <Field label="Temperature (°C)">
              <TextInput type="number" value={input.temperature} onChange={(e) => set('temperature', Number(e.target.value))} required />
            </Field>
            <Field label="Humidity (%)">
              <TextInput type="number" min={0} max={100} value={input.humidity} onChange={(e) => set('humidity', Number(e.target.value))} required />
            </Field>
            <Field label="Rainfall (mm / season)">
              <TextInput type="number" value={input.rainfall} onChange={(e) => set('rainfall', Number(e.target.value))} required />
            </Field>
            <Field label="Farm Area (acres)">
              <TextInput type="number" step={0.1} min={0.1} value={input.farmArea} onChange={(e) => set('farmArea', Number(e.target.value))} required />
            </Field>
            <SelectField
              label="Water Availability"
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              value={input.waterAvailability}
              onChange={(v) => set('waterAvailability', v as CropAdvisoryInput['waterAvailability'])}
            />
            <SelectField
              label="Season"
              options={seasons.map((s) => ({ value: s, label: s }))}
              value={input.season}
              onChange={(v) => set('season', v)}
            />
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" fullWidth disabled={loading}>
                <Sprout size={20} aria-hidden /> Generate Recommendation
              </Button>
            </div>
          </form>
        </Card>

        <div className="lg:col-span-3">
          {loading && <Spinner label="Analyzing your farm conditions…" />}
          {!loading && results && (
            <div>
              <h2 className="mb-1 text-xl font-bold text-ink">
                Recommended Crops <span className="text-sm font-medium text-accent">(Demo recommendation)</span>
              </h2>
              <p className="mb-3 text-sm text-muted">Scores below are demo values, not from a trained model yet.</p>
              <div className="space-y-4">
                {results.map((r) => (
                  <Card key={r.crop} hoverable>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-2xl" aria-hidden>
                          {r.emoji}
                        </span>
                        <div>
                          <h3 className="text-xl font-bold text-ink">{r.crop}</h3>
                          <p className="text-sm text-muted">{r.growingPeriod} growing period</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-extrabold text-primary">{r.suitability}%</p>
                        <p className="text-sm text-muted">Suitability</p>
                      </div>
                    </div>
                    {/* suitability bar */}
                    <div
                      className="mt-3 h-3 overflow-hidden rounded-full bg-primary-light"
                      role="progressbar"
                      aria-valuenow={r.suitability}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${r.crop} suitability`}
                    >
                      <div className="h-full rounded-full bg-secondary" style={{ width: `${r.suitability}%` }} />
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-base font-semibold text-ink">
                      <Droplets size={18} className="text-blue-600" aria-hidden />
                      Water requirement: <span className="capitalize">{r.waterRequirement}</span>
                    </p>
                    <p className="mt-2 text-base text-muted">{r.explanation}</p>
                  </Card>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted">
                Recommendations are generated from the conditions you entered. Suitability scores will come
                from the trained crop-recommendation model once it is connected. Before spending on seeds,
                please confirm with your local agriculture expert.
              </p>
            </div>
          )}
          {!loading && !results && (
            <Card className="flex h-full min-h-64 flex-col items-center justify-center text-center">
              <span className="text-5xl" aria-hidden>🌾</span>
              <h3 className="mt-3 text-xl font-bold text-ink">Fill in your farm conditions</h3>
              <p className="mt-1 max-w-sm text-base text-muted">
                Enter soil, weather and water details, then tap “Generate Recommendation” to see the best crops for your field.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
