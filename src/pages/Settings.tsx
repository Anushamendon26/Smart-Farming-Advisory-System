import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, Lock, LogOut, Ruler, Trash2, User, Volume2 } from 'lucide-react'
import Button from '../components/ui/Button'
import { Card, CardTitle } from '../components/ui/Card'
import { Field, TextInput } from '../components/ui/Form'
import PageHeader from '../components/ui/PageHeader'
import { useApp } from '../context/AppContext'
import type { AreaUnit, Language, TempUnit } from '../types'

function OptionGroup<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-xl border-2 px-4 py-2.5 text-base font-semibold transition-colors ${
            value === o.value
              ? 'border-primary bg-primary-light text-primary'
              : 'border-gray-200 bg-white text-muted hover:border-primary/40'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-gray-300'}`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
      />
    </button>
  )
}

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <Card>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">{icon}</span>
        <CardTitle>{title}</CardTitle>
      </div>
      {children}
    </Card>
  )
}

export default function Settings() {
  const {
    user,
    farm,
    language,
    setLanguage,
    areaUnit,
    setAreaUnit,
    tempUnit,
    setTempUnit,
    logout,
  } = useApp()
  const navigate = useNavigate()

  const [weatherAlerts, setWeatherAlerts] = useState(true)
  const [advisoryUpdates, setAdvisoryUpdates] = useState(true)
  const [marketAlerts, setMarketAlerts] = useState(false)
  const [shareData, setShareData] = useState(true)

  return (
    <div className="page-container">
      <PageHeader title="Settings" description="Manage your profile, language, units and alerts." />

      <div className="grid gap-5 md:grid-cols-2">
        <Section icon={<User size={20} />} title="Profile">
          <div className="space-y-4">
            <Field label="Full Name">
              <TextInput defaultValue={user?.name || farm.farmerName} />
            </Field>
            <Field label="Mobile Number">
              <TextInput type="tel" defaultValue={user?.mobile || ''} placeholder="98765 43210" />
            </Field>
            <Field label="Email">
              <TextInput type="email" defaultValue={user?.email || ''} placeholder="you@example.com" />
            </Field>
            <Button>Save Profile</Button>
          </div>
        </Section>

        <Section icon={<Volume2 size={20} />} title="Language">
          <p className="mb-3 text-base text-muted">Choose the language used across the app.</p>
          <OptionGroup<Language>
            label="App language"
            value={language}
            onChange={setLanguage}
            options={[
              { value: 'English', label: 'English' },
              { value: 'Hindi', label: 'हिंदी (Hindi)' },
              { value: 'Marathi', label: 'मराठी (Marathi)' },
            ]}
          />
        </Section>

        <Section icon={<Ruler size={20} />} title="Units">
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-base font-semibold text-ink">Farm area</p>
              <OptionGroup<AreaUnit>
                label="Area unit"
                value={areaUnit}
                onChange={setAreaUnit}
                options={[
                  { value: 'acres', label: 'Acres' },
                  { value: 'hectares', label: 'Hectares' },
                ]}
              />
            </div>
            <div>
              <p className="mb-2 text-base font-semibold text-ink">Temperature</p>
              <OptionGroup<TempUnit>
                label="Temperature unit"
                value={tempUnit}
                onChange={setTempUnit}
                options={[
                  { value: 'celsius', label: '°C' },
                  { value: 'fahrenheit', label: '°F' },
                ]}
              />
            </div>
          </div>
        </Section>

        <Section icon={<Volume2 size={20} />} title="Notifications">
          <ul className="space-y-4">
            {[
              { label: 'Weather alerts', on: weatherAlerts, set: setWeatherAlerts },
              { label: 'Advisory updates', on: advisoryUpdates, set: setAdvisoryUpdates },
              { label: 'Market price alerts', on: marketAlerts, set: setMarketAlerts },
            ].map((row) => (
              <li key={row.label} className="flex items-center justify-between">
                <span className="text-base font-semibold text-ink">{row.label}</span>
                <Toggle on={row.on} onChange={row.set} label={row.label} />
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={<Lock size={20} />} title="Privacy">
          <div className="flex items-center justify-between gap-4">
            <p className="text-base text-muted">
              Allow anonymized farm data to be used to improve advisory models for all farmers.
            </p>
            <Toggle on={shareData} onChange={setShareData} label="Share anonymized farm data" />
          </div>
        </Section>

        <Section icon={<KeyRound size={20} />} title="Account">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <KeyRound size={18} aria-hidden /> Change Password
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              <LogOut size={18} aria-hidden /> Log Out
            </Button>
            <Button
              variant="ghost"
              className="text-red-600 hover:bg-red-50"
              onClick={() => alert('Account deletion requires confirmation by email. This will be handled by the backend service.')}
            >
              <Trash2 size={18} aria-hidden /> Delete Account
            </Button>
          </div>
        </Section>
      </div>
    </div>
  )
}
