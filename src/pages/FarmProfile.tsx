import { useState, type FormEvent } from 'react'
import { Check, Droplets, Leaf, MapPin, Sprout } from 'lucide-react'
import Button from '../components/ui/Button'
import { Card, CardTitle } from '../components/ui/Card'
import { Field, SelectField, TextInput } from '../components/ui/Form'
import PageHeader from '../components/ui/PageHeader'
import { useApp } from '../context/AppContext'
import type { FarmProfile as FarmProfileType, Language } from '../types'

const soilTypes = ['Loamy', 'Clayey', 'Sandy', 'Red', 'Black Cotton', 'Laterite', 'Alluvial']
const waterSources = ['Borewell', 'Borewell + Drip', 'Canal', 'Well', 'Tank / Pond', 'Rain-fed']
const crops = ['Tomato', 'Onion', 'Wheat', 'Maize', 'Cotton', 'Soybean', 'Potato', 'Sugarcane', 'Other']
const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिंदी (Hindi)' },
  { value: 'Marathi', label: 'मराठी (Marathi)' },
]

export default function FarmProfile() {
  const { farm, saveFarm, formatArea } = useApp()
  const [form, setForm] = useState<FarmProfileType>(farm)
  const [saved, setSaved] = useState(false)

  const set = <K extends keyof FarmProfileType>(key: K, value: FarmProfileType[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setSaved(false)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    saveFarm(form)
    setSaved(true)
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Farm Profile"
        description="Your farm details power every recommendation. Keep them up to date each season."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Overview card */}
        <Card className="h-fit lg:col-span-1">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-light text-primary">
            <Leaf size={28} aria-hidden />
          </div>
          <CardTitle>Farm Overview</CardTitle>
          <ul className="mt-4 space-y-3 text-base">
            <li className="flex items-center gap-2">
              <Sprout size={18} className="text-primary" aria-hidden />
              <span className="text-muted">Crop:</span>
              <strong>{form.currentCrop}</strong>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={18} className="text-primary" aria-hidden />
              <span className="text-muted">Location:</span>
              <strong>{form.location}</strong>
            </li>
            <li className="flex items-center gap-2">
              <Leaf size={18} className="text-primary" aria-hidden />
              <span className="text-muted">Area:</span>
              <strong>{formatArea(form.farmSize)}</strong>
            </li>
            <li className="flex items-center gap-2">
              <Droplets size={18} className="text-primary" aria-hidden />
              <span className="text-muted">Water source:</span>
              <strong>{form.waterSource}</strong>
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden>🧪</span>
              <span className="text-muted">Soil:</span>
              <strong>{form.soilType}</strong>
            </li>
          </ul>
          {saved && (
            <p className="mt-4 flex items-center gap-2 rounded-lg bg-primary-light px-3 py-2 text-base font-semibold text-primary" role="status">
              <Check size={18} aria-hidden /> Farm details saved
            </p>
          )}
        </Card>

        {/* Edit form */}
        <Card className="lg:col-span-2">
          <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
            <Field label="Farmer Name">
              <TextInput value={form.farmerName} onChange={(e) => set('farmerName', e.target.value)} required />
            </Field>
            <Field label="Location">
              <TextInput value={form.location} onChange={(e) => set('location', e.target.value)} required placeholder="Village / District, State" />
            </Field>
            <Field label={`Farm Size (acres)`}>
              <TextInput
                type="number"
                min={0.1}
                step={0.1}
                value={form.farmSize}
                onChange={(e) => set('farmSize', Number(e.target.value))}
                required
              />
            </Field>
            <SelectField
              label="Soil Type"
              options={soilTypes.map((s) => ({ value: s, label: s }))}
              value={form.soilType}
              onChange={(v) => set('soilType', v)}
            />
            <SelectField
              label="Water Source"
              options={waterSources.map((s) => ({ value: s, label: s }))}
              value={form.waterSource}
              onChange={(v) => set('waterSource', v)}
            />
            <SelectField
              label="Current Crop"
              options={crops.map((s) => ({ value: s, label: s }))}
              value={form.currentCrop}
              onChange={(v) => set('currentCrop', v)}
            />
            <Field label="Sowing Date">
              <TextInput type="date" value={form.sowingDate} onChange={(e) => set('sowingDate', e.target.value)} required />
            </Field>
            <SelectField
              label="Preferred Language"
              options={languageOptions}
              value={form.language}
              onChange={(v) => set('language', v as Language)}
            />
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" fullWidth>
                Save Farm Details
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
