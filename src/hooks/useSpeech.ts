import { useCallback, useEffect, useRef, useState } from 'react'
import type { Language } from '../types'

// Minimal typing for the browser SpeechRecognition API (not in all TS libs).
interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}

const langMap: Record<Language, string> = {
  English: 'en-IN',
  Hindi: 'hi-IN',
  Marathi: 'mr-IN',
}

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

/**
 * Browser speech-to-text wrapper for the AI assistant (spec §20).
 * `supported` is false when the browser has no SpeechRecognition API —
 * the UI then hides the mic button instead of pretending it works.
 */
export function useSpeechToText(language: Language) {
  const supported = useRef(getRecognitionCtor() !== null).current
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

  useEffect(() => {
    return () => recognitionRef.current?.stop()
  }, [])

  const start = useCallback(
    (onResult: (text: string) => void) => {
      const Ctor = getRecognitionCtor()
      if (!Ctor) return
      const recognition = new Ctor()
      recognition.lang = langMap[language]
      recognition.interimResults = false
      recognition.maxAlternatives = 1
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript ?? ''
        if (transcript) onResult(transcript)
      }
      recognition.onend = () => setListening(false)
      recognition.onerror = () => setListening(false)
      recognitionRef.current = recognition
      setListening(true)
      recognition.start()
    },
    [language],
  )

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  return { supported, listening, start, stop }
}

/** Text-to-speech for "Listen to Answer". Graceful when unsupported. */
export function speakText(text: string, language: Language): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = langMap[language]
  window.speechSynthesis.speak(utterance)
  return true
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
