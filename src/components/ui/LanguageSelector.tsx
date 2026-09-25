import { Globe } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { languageLabels } from '../../i18n'
import type { Language } from '../../types'

const languages = Object.keys(languageLabels) as Language[]

/** Compact globe dropdown for the header — switches the whole UI language. */
export default function LanguageSelector() {
  const { language, setLanguage } = useApp()
  return (
    <label className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-muted hover:bg-gray-50">
      <Globe size={18} aria-hidden />
      <span className="sr-only">Select language</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="cursor-pointer bg-transparent text-sm font-semibold text-ink focus:outline-none"
        aria-label="Select language"
      >
        {languages.map((l) => (
          <option key={l} value={l}>
            {languageLabels[l]}
          </option>
        ))}
      </select>
    </label>
  )
}
