// Shared domain types for the Smart Farming Advisory System.
// These types mirror the expected response shapes of future backend /
// ML / weather / market APIs, so pages never depend on hardcoded data.

export type Language = 'English' | 'Hindi' | 'Marathi'
export type AreaUnit = 'acres' | 'hectares'
export type TempUnit = 'celsius' | 'fahrenheit'

export interface User {
  name: string
  mobile: string
  email: string
  location: string
  language: Language
}

export interface FarmProfile {
  farmerName: string
  location: string
  farmSize: number // stored in acres
  soilType: string
  waterSource: string
  currentCrop: string
  sowingDate: string
  language: Language
}

// ---------- Weather ----------
export interface CurrentWeather {
  temperatureC: number
  condition: string
  humidity: number // %
  rainProbability: number // %
  windSpeedKmh: number
  uvIndex: number
}

export interface ForecastDay {
  date: string
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partly-cloudy'
  tempMaxC: number
  tempMinC: number
  rainProbability: number
}

export interface WeatherAdvisory {
  weather: CurrentWeather
  forecast: ForecastDay[]
  recommendations: AdvisoryItem[]
}

// ---------- Generic advisory ----------
export type AdvisorySeverity = 'info' | 'success' | 'warning' | 'danger'

export interface AdvisoryItem {
  id: string
  category: 'weather' | 'irrigation' | 'fertilizer' | 'crop-health' | 'general'
  title: string
  message: string
  status: string
  severity: AdvisorySeverity
  /** Explainable advisory: WHY the system recommends this */
  why?: string
  /** Explainable advisory: the input data behind the recommendation */
  dataUsed?: { label: string; value: string }[]
  /** Explainable advisory: WHAT to do next */
  nextStep?: string
}

// ---------- Crop advisory (future ML model) ----------
export interface CropAdvisoryInput {
  location: string
  soilType: string
  soilPh: number
  nitrogen: number // kg/ha
  phosphorus: number // kg/ha
  potassium: number // kg/ha
  temperature: number
  humidity: number // %
  rainfall: number
  farmArea: number
  waterAvailability: 'low' | 'medium' | 'high'
  season: string
}

export interface CropRecommendation {
  crop: string
  emoji: string
  suitability: number // 0–100 score returned by the model
  growingPeriod: string
  waterRequirement: 'low' | 'medium' | 'high'
  explanation: string
}

// ---------- Soil analysis ----------
export interface SoilInput {
  nitrogen: number // kg/ha
  phosphorus: number // kg/ha
  potassium: number // kg/ha
  ph: number
  moisture: number // %
  soilType: string
}

export type NutrientLevel = 'Low' | 'Medium' | 'High'

export interface SoilResult {
  health: 'Poor' | 'Fair' | 'Good' | 'Excellent'
  nutrients: {
    nitrogen: NutrientLevel
    phosphorus: NutrientLevel
    potassium: NutrientLevel
  }
  ph: number
  moisture: number
  scores: { label: string; value: number }[]
  recommendedActions: string[]
}

// ---------- Disease detection (future computer-vision model) ----------
export interface DiseaseResult {
  disease: string
  confidence: number // 0–100 from the vision model
  severity: 'Mild' | 'Moderate' | 'Severe'
  symptoms: string[]
  causes: string[]
  recommendedActions: string[]
}

// ---------- Irrigation ----------
export interface IrrigationRecommendation {
  recommendation: string
  waterLiters: number
  timeOfDay: string
  reason: string
  soilMoisture: number
  temperatureC: number
  rainForecastNextDays: number
  crop: string
  growthStage: string
}

// ---------- Fertilizer ----------
export interface FertilizerInput {
  crop: string
  growthStage: string
  soilN: NutrientLevel
  soilP: NutrientLevel
  soilK: NutrientLevel
  soilPh: number
}

export interface FertilizerRecommendation {
  nutrients: {
    key: 'N' | 'P' | 'K'
    name: string
    status: 'Deficient' | 'Adequate' | 'Sufficient'
    dosage: string
    advice: string
  }[]
  summary: string
}

// ---------- Market ----------
export interface MarketPrice {
  crop: string
  market: string
  pricePerQuintal: number
  changePercent: number
  lastUpdated: string
}

export interface PricePoint {
  date: string
  price: number
}

// ---------- AI Assistant ----------
export interface ChatMessage {
  id: string
  role: 'farmer' | 'assistant'
  text: string
  time: string
}

// ---------- History & notifications ----------
export interface HistoryItem {
  id: string
  date: string
  type: 'Crop Recommendation' | 'Weather Advisory' | 'Irrigation' | 'Disease Detection' | 'Fertilizer' | 'Soil Analysis'
  crop: string
  recommendation: string
  status: 'Followed' | 'Pending' | 'Expired'
}

export interface AppNotification {
  id: string
  icon: 'rain' | 'irrigation' | 'disease' | 'crop' | 'market'
  title: string
  message: string
  time: string
  read: boolean
}

// ---------- Dashboard chart series ----------
export interface FarmHealthPoint {
  day: string
  cropHealth: number
  soilMoisture: number
  temperature: number
  rainfall: number
}

// ---------- Farm health zones ----------
export type ZoneStatus = 'healthy' | 'attention' | 'critical'

export interface FieldZone {
  id: string
  name: string
  status: ZoneStatus
  note: string
}

// ---------- IoT sensors ----------
export interface Sensor {
  id: string
  name: string
  emoji: string
  status: 'connected' | 'not-connected'
  value?: number
  unit?: string
  battery?: number // %
  lastSync?: string
}
