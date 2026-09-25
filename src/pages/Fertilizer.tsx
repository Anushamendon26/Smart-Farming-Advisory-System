import { useState, type FormEvent } from 'react'
import { AlertTriangle, Beaker, Leaf, Sprout } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Card, CardTitle } from '../components/ui/Card'
import { Field, SelectField, TextInput } from '../components/ui/Form'
import PageHeader from '../components/ui/PageHeader'
import { Spinner } from '../components/ui/Loading'
import { useApp } from '../context/AppContext'
import { getFertilizerAdvice } from '../services/fertilizerService'
import type { FertilizerInput, FertilizerRecommendation, NutrientLevel } from '../types'

const levelOptions = (['Low', 'Medium', 'High'] as NutrientLevel[]).map((l) => ({ value: l, label: l }))
const growthStages = ['Sowing', 'Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest']

export default function Fertilizer() {
  const { farm } = useApp()
  const [input, setInput] = useState<FertilizerInput>({
    crop: farm.currentCrop,
    growthStage: 'Flowering',
    soilN: 'Low',
    soilP: 'Medium',
    soilK: 'Medium',
    soilPh: 6.5,
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FertilizerRecommendation | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    const r = await getFertilizerAdvice(input)
    setResult(r)
    setLoading(false)
  }

  const statusTone = (s: string) => (s === 'Deficient' ? 'danger' : s === 'Adequate' ? 'success' : 'info')
  const nutrientIcons: Record<string, string> = { N: '🌿', P: '🌸', K: '🥔' }

  return (
    <div className="page-container">
      <PageHeader
        title="Fertilizer Advisory"
        description="Nutrient recommendations for your crop, growth stage and soil levels."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Crop"
              options={[...new Set([input.crop, 'Tomato', 'Onion', 'Wheat', 'Maize', 'Cotton', 'Potato'])].map((c) => ({ value: c, label: c }))}
              value={input.crop}
              onChange={(v) => setInput((i) => ({ ...i, crop: v }))}
            />
            <SelectField
              label="Growth Stage"
              options={growthStages.map((g) => ({ value: g, label: g }))}
              value={input.growthStage}
              onChange={(v) => setInput((i) => ({ ...i, growthStage: v }))}
            />
            <SelectField label="Soil Nitrogen (N)" options={levelOptions} value={input.soilN} onChange={(v) => setInput((i) => ({ ...i, soilN: v as NutrientLevel }))} />
            <SelectField label="Soil Phosphorus (P)" options={levelOptions} value={input.soilP} onChange={(v) => setInput((i) => ({ ...i, soilP: v as NutrientLevel }))} />
            <SelectField label="Soil Potassium (K)" options={levelOptions} value={input.soilK} onChange={(v) => setInput((i) => ({ ...i, soilK: v as NutrientLevel }))} />
            <Field label="Soil pH">
              <TextInput type="number" step={0.1} min={3} max={12} value={input.soilPh} onChange={(e) => setInput((i) => ({ ...i, soilPh: Number(e.target.value) }))} required />
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" fullWidth disabled={loading}>
                <Beaker size={20} aria-hidden /> Get Fertilizer Advice
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-4 lg:col-span-3">
          {loading && <Spinner label="Preparing nutrient plan…" />}
          {!loading && result && (
            <>
              <Card className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <Sprout size={26} aria-hidden />
                </span>
                <p className="text-lg text-ink">{result.summary}</p>
              </Card>

              <h2 className="text-xl font-bold text-ink">Recommended Nutrients</h2>
              <div className="space-y-4">
                {result.nutrients.map((n) => (
                  <Card key={n.key} hoverable>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-xl" aria-hidden>
                          {nutrientIcons[n.key]}
                        </span>
                        <div>
                          <CardTitle>{n.name}</CardTitle>
                          <p className="text-base font-bold text-primary">{n.dosage}</p>
                        </div>
                      </div>
                      <Badge tone={statusTone(n.status)}>{n.status}</Badge>
                    </div>
                    <p className="mt-3 flex items-start gap-2 text-base text-muted">
                      <Leaf size={16} className="mt-1 shrink-0 text-secondary" aria-hidden />
                      {n.advice}
                    </p>
                  </Card>
                ))}
              </div>
            </>
          )}
          {!loading && !result && (
            <Card className="flex h-full min-h-64 flex-col items-center justify-center text-center">
              <span className="text-5xl" aria-hidden>🧪</span>
              <h3 className="mt-3 text-xl font-bold text-ink">Set your crop and soil levels</h3>
              <p className="mt-1 max-w-sm text-base text-muted">
                Use values from your soil health card for the most accurate nutrient plan.
              </p>
            </Card>
          )}

          <div className="flex items-start gap-3 rounded-xl2 border border-accent/60 bg-accent-light p-5">
            <AlertTriangle size={22} className="mt-0.5 shrink-0 text-[#8a6d1a]" aria-hidden />
            <p className="text-base font-semibold text-ink">
              Recommendations are advisory. Follow local agricultural guidance before applying fertilizers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
