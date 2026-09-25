// Shared helpers for the mock service layer.
// Each domain service (weatherService, cropService, …) has the SAME public
// function signatures that a real backend integration will keep, so pages
// never change when APIs replace these mocks.

export const DEFAULT_LATENCY = 700

export const delay = (ms = DEFAULT_LATENCY) => new Promise<void>((r) => setTimeout(r, ms))

/** Current time formatted like "10:42 AM" for "last updated" labels. */
export const timeNow = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export class ServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ServiceError'
  }
}
