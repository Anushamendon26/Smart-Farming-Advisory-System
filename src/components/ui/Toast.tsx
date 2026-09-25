import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle2, Info, X } from 'lucide-react'

interface Toast {
  id: number
  message: string
  tone: 'success' | 'info'
}

interface ToastContextValue {
  showToast: (message: string, tone?: Toast['tone']) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, tone: Toast['tone'] = 'success') => {
    setToasts((t) => [...t, { id: Date.now(), message, tone }])
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast viewport */}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 md:bottom-6" aria-live="polite">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDone={() => setToasts((list) => list.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDone }: { toast: Toast; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3500)
    return () => clearTimeout(timer)
  }, [onDone])
  return (
    <div className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl bg-ink px-4 py-3 text-white shadow-lg">
      {toast.tone === 'success' ? (
        <CheckCircle2 size={20} className="shrink-0 text-secondary" aria-hidden />
      ) : (
        <Info size={20} className="shrink-0 text-accent" aria-hidden />
      )}
      <p className="flex-1 text-base font-medium">{toast.message}</p>
      <button type="button" onClick={onDone} aria-label="Dismiss notification" className="rounded p-1 hover:bg-white/10">
        <X size={16} aria-hidden />
      </button>
    </div>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
