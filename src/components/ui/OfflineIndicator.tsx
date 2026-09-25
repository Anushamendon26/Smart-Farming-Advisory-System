import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { useT } from '../../hooks/useT'
import type { TranslationKey } from '../../i18n'

const keyFor = { online: 'status.online', limited: 'status.limited', offline: 'status.offline' } as const
const dotFor = { online: 'bg-primary', limited: 'bg-accent', offline: 'bg-red-500' } as const

/**
 * Header connectivity badge (spec §25). Status is shown with a dot AND a
 * text label — never color alone.
 */
export default function OfflineIndicator() {
  const state = useOnlineStatus()
  const t = useT()
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-ink"
      role="status"
      aria-label={`Connection: ${t(keyFor[state] as TranslationKey)}`}
      title={`Last synchronized: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${dotFor[state]}`} aria-hidden />
      <span className="hidden sm:inline">{t(keyFor[state] as TranslationKey)}</span>
    </span>
  )
}
