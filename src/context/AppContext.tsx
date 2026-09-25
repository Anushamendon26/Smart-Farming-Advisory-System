import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppNotification, AreaUnit, FarmProfile, Language, TempUnit, User } from '../types'
import { notifications as demoNotifications } from '../data/advisories'

interface AppState {
  user: User | null
  login: (user: User) => void
  logout: () => void

  farm: FarmProfile
  saveFarm: (farm: FarmProfile) => void

  language: Language
  setLanguage: (l: Language) => void
  areaUnit: AreaUnit
  setAreaUnit: (u: AreaUnit) => void
  tempUnit: TempUnit
  setTempUnit: (u: TempUnit) => void
  formatTemp: (c: number) => string
  formatArea: (acres: number) => string

  notifications: AppNotification[]
  markRead: (id: string) => void
  deleteNotification: (id: string) => void
  unreadCount: number
}

export const defaultFarm: FarmProfile = {
  farmerName: 'Ramesh Patil',
  location: 'Nashik, Maharashtra',
  farmSize: 4.5,
  soilType: 'Loamy',
  waterSource: 'Borewell + Drip',
  currentCrop: 'Tomato',
  sowingDate: '2026-07-15',
  language: 'English',
}

const AppContext = createContext<AppState | null>(null)

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('sf.user')
      return raw ? (JSON.parse(raw) as User) : null
    } catch {
      return null
    }
  })
  const [farm, setFarm] = useState<FarmProfile>(() => load('sf.farm', defaultFarm))
  const [language, setLanguageState] = useState<Language>(
    () => load<FarmProfile>('sf.farm', defaultFarm).language,
  )
  const [areaUnit, setAreaUnitState] = useState<AreaUnit>(
    () => (localStorage.getItem('sf.area') as AreaUnit) || 'acres',
  )
  const [tempUnit, setTempUnitState] = useState<TempUnit>(
    () => (localStorage.getItem('sf.temp') as TempUnit) || 'celsius',
  )
  const [notifications, setNotifications] = useState<AppNotification[]>(demoNotifications)

  const login = useCallback((u: User) => {
    setUser(u)
    localStorage.setItem('sf.user', JSON.stringify(u))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('sf.user')
  }, [])

  const saveFarm = useCallback((f: FarmProfile) => {
    setFarm(f)
    setLanguageState(f.language)
    localStorage.setItem('sf.farm', JSON.stringify(f))
  }, [])

  const setLanguage = useCallback((l: Language) => {
    setLanguageState(l)
    setFarm((f) => {
      const next = { ...f, language: l }
      localStorage.setItem('sf.farm', JSON.stringify(next))
      return next
    })
  }, [])

  const setAreaUnit = useCallback((u: AreaUnit) => {
    setAreaUnitState(u)
    localStorage.setItem('sf.area', u)
  }, [])

  const setTempUnit = useCallback((u: TempUnit) => {
    setTempUnitState(u)
    localStorage.setItem('sf.temp', u)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language === 'Hindi' ? 'hi' : language === 'Marathi' ? 'mr' : 'en'
  }, [language])

  const value = useMemo<AppState>(() => {
    const formatTemp = (c: number) =>
      tempUnit === 'celsius' ? `${Math.round(c)}°C` : `${Math.round(c * 1.8 + 32)}°F`
    const formatArea = (acres: number) =>
      areaUnit === 'acres'
        ? `${acres} acres`
        : `${(acres * 0.4047).toFixed(2)} hectares`
    return {
      user,
      login,
      logout,
      farm,
      saveFarm,
      language,
      setLanguage,
      areaUnit,
      setAreaUnit,
      tempUnit,
      setTempUnit,
      formatTemp,
      formatArea,
      notifications,
      markRead: (id) =>
        setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n))),
      deleteNotification: (id) => setNotifications((ns) => ns.filter((n) => n.id !== id)),
      unreadCount: notifications.filter((n) => !n.read).length,
    }
  }, [user, farm, language, areaUnit, tempUnit, notifications, login, logout, saveFarm, setLanguage, setAreaUnit, setTempUnit])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
