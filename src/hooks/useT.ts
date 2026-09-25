import { useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { translate, type TranslationKey } from '../i18n'

/** Returns a t(key) function bound to the farmer's selected language. */
export function useT() {
  const { language } = useApp()
  return useCallback((key: TranslationKey) => translate(language, key), [language])
}
