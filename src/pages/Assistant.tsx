import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Bot, Mic, Send, Speaker, Square } from 'lucide-react'
import { Card } from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import { ProgressDots } from '../components/ui/Loading'
import { askAssistant } from '../services/aiService'
import { suggestedQuestions } from '../data/advisories'
import { useApp } from '../context/AppContext'
import { speakText, stopSpeaking, useSpeechToText } from '../hooks/useSpeech'
import type { ChatMessage } from '../types'

const now = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const initialMessages: ChatMessage[] = [
  {
    id: 'm0',
    role: 'assistant',
    text: 'Namaste! 🙏 I am your farming assistant. Ask me anything about your farm, crops and farming practices.',
    time: now(),
  },
]

export default function Assistant() {
  const { language, farm } = useApp()
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { supported: micSupported, listening, start: startListening, stop: stopListening } = useSpeechToText(language)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  // Stop voice playback and recognition when leaving the page
  useEffect(() => () => stopSpeaking(), [])

  const send = async (text: string) => {
    const question = text.trim()
    if (!question || thinking) return
    setDraft('')
    setMessages((m) => [...m, { id: `f${Date.now()}`, role: 'farmer', text: question, time: now() }])
    setThinking(true)
    const reply = await askAssistant(question, farm)
    setThinking(false)
    setMessages((m) => [...m, { id: `a${Date.now()}`, role: 'assistant', text: reply.text, time: now() }])
  }

  const toggleMic = () => {
    if (listening) {
      stopListening()
      return
    }
    startListening((heard) => void send(heard))
  }

  const listen = (msg: ChatMessage) => {
    if (speakingId === msg.id) {
      stopSpeaking()
      setSpeakingId(null)
    } else if (speakText(msg.text, language)) {
      setSpeakingId(msg.id)
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void send(draft)
  }

  return (
    <div className="page-container">
      <PageHeader
        title="AI Farming Assistant"
        description="Ask questions about your farm, crops and farming practices — by text or voice."
      />

      <Card padded={false} className="flex h-[65vh] min-h-96 flex-col">
        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6" aria-live="polite">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'farmer' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-base md:max-w-[70%] ${
                  m.role === 'farmer'
                    ? 'rounded-br-md bg-primary text-white'
                    : 'rounded-bl-md bg-background text-ink'
                }`}
              >
                {m.role === 'assistant' && (
                  <span className="mb-1 flex items-center justify-between gap-2 text-sm font-bold text-primary">
                    <span className="flex items-center gap-1.5">
                      <Bot size={16} aria-hidden /> SmartFarm Assistant
                      <span className="rounded bg-accent-light px-1.5 py-0.5 text-xs font-semibold text-ink">Demo answer</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => listen(m)}
                      className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-white px-2 py-0.5 text-xs font-semibold text-primary hover:bg-primary-light"
                      aria-label={speakingId === m.id ? 'Stop playing answer' : 'Listen to answer'}
                    >
                      {speakingId === m.id ? <Square size={12} aria-hidden /> : <Speaker size={12} aria-hidden />}
                      {speakingId === m.id ? 'Stop' : 'Listen to Answer'}
                    </button>
                  </span>
                )}
                <p className={m.role === 'farmer' ? 'font-medium' : ''}>{m.text}</p>
                <p className={`mt-1 text-xs ${m.role === 'farmer' ? 'text-white/70' : 'text-muted'}`}>{m.time}</p>
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-background px-4 py-3">
                <ProgressDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested questions */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 border-t border-gray-100 px-4 py-3 md:px-6">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => void send(q)}
                className="rounded-full border border-primary/30 bg-primary-light px-4 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={onSubmit} className="flex gap-3 border-t border-gray-100 p-4 md:px-6">
          {micSupported ? (
            <button
              type="button"
              onClick={toggleMic}
              aria-label={listening ? 'Stop listening' : 'Tap to speak'}
              aria-pressed={listening}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white transition-colors ${
                listening ? 'animate-pulse bg-red-500 hover:bg-red-600' : 'bg-secondary hover:bg-primary'
              }`}
            >
              <Mic size={20} aria-hidden />
            </button>
          ) : (
            <span className="flex h-12 items-center rounded-xl bg-background px-3 text-sm text-muted" title="Voice input is not supported in this browser">
              🎤 Voice not supported here
            </span>
          )}
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={listening ? 'Listening… tap the mic to stop' : 'Ask something about your farm…'}
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base placeholder:text-muted/70 focus:border-primary"
            aria-label="Ask the assistant"
          />
          <button
            type="submit"
            disabled={!draft.trim() || thinking}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            aria-label="Send message"
          >
            <Send size={20} aria-hidden />
          </button>
        </form>
      </Card>

      <p className="mt-3 text-sm text-muted">
        {micSupported
          ? '🎤 Tap the mic and speak your question — your browser converts voice to text.'
          : 'Voice input needs a browser that supports speech recognition (e.g. Chrome). Text questions always work.'}
        {' '}This assistant interface is ready to connect to a real AI service. Replies shown now are demo
        responses and are clearly labelled as such.
      </p>
    </div>
  )
}
