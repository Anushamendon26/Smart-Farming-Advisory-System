import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

interface FieldProps {
  label: string
  children: ReactNode
  hint?: string
}

export function Field({ label, children, hint }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-base font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-sm text-muted">{hint}</span>}
    </label>
  )
}

const inputClasses =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:border-primary'

export function TextInput({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${inputClasses} ${className}`} {...rest} />
}

export function Select({ className = '', children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${inputClasses} ${className}`} {...rest}>
      {children}
    </select>
  )
}

interface Option {
  value: string
  label: string
}

export function SelectField({
  label,
  options,
  value,
  onChange,
  hint,
}: {
  label: string
  options: Option[]
  value: string
  onChange: (v: string) => void
  hint?: string
}) {
  return (
    <Field label={label} hint={hint}>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </Field>
  )
}
