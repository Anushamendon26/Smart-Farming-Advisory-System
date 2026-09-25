import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import Button from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field, SelectField, TextInput } from '../components/ui/Form'
import { useApp } from '../context/AppContext'
import type { Language } from '../types'

const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिंदी (Hindi)' },
  { value: 'Marathi', label: 'मराठी (Marathi)' },
]

export default function Auth({ initialMode = 'login' }: { initialMode?: 'login' | 'signup' }) {
  const { login } = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)

  // Login fields
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  // Signup fields
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [language, setLanguage] = useState<Language>('English')

  const finishAuth = () => {
    login({
      name: mode === 'signup' ? name : name || identifier.split('@')[0] || 'Farmer',
      mobile: mode === 'signup' ? mobile : identifier,
      email: mode === 'signup' ? email : '',
      location: mode === 'signup' ? location : 'Nashik, Maharashtra',
      language,
    })
    navigate('/dashboard')
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    finishAuth()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div className="mb-6 flex items-center gap-2 text-3xl font-extrabold text-primary">
        <Leaf size={30} aria-hidden /> SmartFarm
      </div>

      <Card className="w-full max-w-md p-6 md:p-8">
        {/* Mode switch */}
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-primary-light p-1" role="tablist" aria-label="Login or signup">
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-lg py-2.5 text-base font-bold capitalize transition-colors ${
                mode === m ? 'bg-primary text-white shadow-sm' : 'text-primary'
              }`}
            >
              {m === 'login' ? 'Login' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === 'login' ? (
            <>
              <Field label="Mobile Number / Email">
                <TextInput
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 98765 43210"
                  autoComplete="username"
                  required
                />
              </Field>
              <Field label="Password">
                <TextInput
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </Field>
            </>
          ) : (
            <>
              <Field label="Full Name">
                <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required autoComplete="name" />
              </Field>
              <Field label="Mobile Number">
                <TextInput type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="e.g. 98765 43210" required autoComplete="tel" />
              </Field>
              <Field label="Email">
                <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
              </Field>
              <Field label="Password">
                <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required autoComplete="new-password" />
              </Field>
              <Field label="Location">
                <TextInput value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Village / District, State" required />
              </Field>
              <SelectField
                label="Preferred Language"
                options={languageOptions}
                value={language}
                onChange={(v) => setLanguage(v as Language)}
              />
            </>
          )}

          <Button type="submit" size="lg" fullWidth>
            {mode === 'login' ? 'Login' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-5 text-center text-base text-muted">
          {mode === 'login' ? "New to SmartFarm? " : 'Already have an account? '}
          <button
            type="button"
            className="font-bold text-primary underline-offset-2 hover:underline"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? 'Create Account' : 'Login'}
          </button>
        </p>
      </Card>

      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-6 text-base font-semibold text-muted hover:text-primary"
      >
        ← Back to home
      </button>
    </div>
  )
}
