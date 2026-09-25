import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import { useApp } from './context/AppContext'
import { Spinner } from './components/ui/Loading'
import Landing from './pages/Landing'
import Auth from './pages/Auth'

// Heavy pages are lazy-loaded (spec §42). Landing & Auth stay eager so the
// first paint is instant.
const Dashboard = lazy(() => import('./pages/Dashboard'))
const FarmProfile = lazy(() => import('./pages/FarmProfile'))
const CropAdvisory = lazy(() => import('./pages/CropAdvisory'))
const Weather = lazy(() => import('./pages/Weather'))
const SoilAnalysis = lazy(() => import('./pages/SoilAnalysis'))
const DiseaseDetection = lazy(() => import('./pages/DiseaseDetection'))
const Irrigation = lazy(() => import('./pages/Irrigation'))
const Fertilizer = lazy(() => import('./pages/Fertilizer'))
const FarmHealth = lazy(() => import('./pages/FarmHealth'))
const Market = lazy(() => import('./pages/Market'))
const Savings = lazy(() => import('./pages/Savings'))
const Sensors = lazy(() => import('./pages/Sensors'))
const Assistant = lazy(() => import('./pages/Assistant'))
const History = lazy(() => import('./pages/History'))
const Notifications = lazy(() => import('./pages/Notifications'))
const Settings = lazy(() => import('./pages/Settings'))

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

const Lazy = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<div className="page-container"><Spinner /></div>}>{children}</Suspense>
)

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth initialMode="signup" />} />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Lazy><Dashboard /></Lazy>} />
        <Route path="/farm" element={<Lazy><FarmProfile /></Lazy>} />
        <Route path="/advisory" element={<Lazy><CropAdvisory /></Lazy>} />
        <Route path="/crop-advisory" element={<Lazy><CropAdvisory /></Lazy>} />
        <Route path="/soil" element={<Lazy><SoilAnalysis /></Lazy>} />
        <Route path="/weather" element={<Lazy><Weather /></Lazy>} />
        <Route path="/irrigation" element={<Lazy><Irrigation /></Lazy>} />
        <Route path="/fertilizer" element={<Lazy><Fertilizer /></Lazy>} />
        <Route path="/disease" element={<Lazy><DiseaseDetection /></Lazy>} />
        <Route path="/farm-health" element={<Lazy><FarmHealth /></Lazy>} />
        <Route path="/market" element={<Lazy><Market /></Lazy>} />
        <Route path="/savings" element={<Lazy><Savings /></Lazy>} />
        <Route path="/sensors" element={<Lazy><Sensors /></Lazy>} />
        <Route path="/ai-assistant" element={<Lazy><Assistant /></Lazy>} />
        <Route path="/history" element={<Lazy><History /></Lazy>} />
        <Route path="/notifications" element={<Lazy><Notifications /></Lazy>} />
        <Route path="/settings" element={<Lazy><Settings /></Lazy>} />
      </Route>

      {/* Redirects from the earlier URL scheme — no broken routes (spec §39) */}
      <Route path="/advisory/crop" element={<Navigate to="/crop-advisory" replace />} />
      <Route path="/advisory/soil" element={<Navigate to="/soil" replace />} />
      <Route path="/advisory/weather" element={<Navigate to="/weather" replace />} />
      <Route path="/advisory/irrigation" element={<Navigate to="/irrigation" replace />} />
      <Route path="/advisory/fertilizer" element={<Navigate to="/fertilizer" replace />} />
      <Route path="/assistant" element={<Navigate to="/ai-assistant" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
