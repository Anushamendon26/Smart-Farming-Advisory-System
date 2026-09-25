// Lightweight i18n layer. Components use useT() and translation keys —
// translated strings are never hardcoded inside components (spec §21).
import en from '../locales/en.json'
import hi from '../locales/hi.json'
import mr from '../locales/mr.json'
import type { Language } from '../types'

export type TranslationKey = keyof typeof en

const dictionaries: Record<Language, Record<string, string>> = {
  English: en,
  Hindi: hi,
  Marathi: mr,
}

export const languageLabels: Record<Language, string> = {
  English: 'English',
  Hindi: 'हिंदी',
  Marathi: 'मराठी',
}

/** Resolve a key for a language, falling back to English. */
export function translate(language: Language, key: TranslationKey): string {
  return dictionaries[language][key] ?? dictionaries.English[key] ?? key
}
