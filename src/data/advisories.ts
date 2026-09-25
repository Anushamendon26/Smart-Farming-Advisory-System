import type {
  AdvisoryItem,
  AppNotification,
  FarmHealthPoint,
  FieldZone,
  HistoryItem,
} from '../types'

// Demo advisory, history and notification data consumed via services only.

export const advisories: AdvisoryItem[] = [
  {
    id: 'a1',
    category: 'irrigation',
    title: 'Irrigation Advisory',
    message:
      'Your current soil moisture is adequate and rainfall is expected tomorrow. Consider postponing irrigation today.',
    status: 'Action needed',
    severity: 'warning',
    why: 'Soil moisture is already near the target range and a high rain probability is forecast for tomorrow, so irrigating today would waste water.',
    dataUsed: [
      { label: 'Soil moisture', value: '62%' },
      { label: 'Rain probability', value: '70%' },
      { label: 'Temperature', value: '27°C' },
    ],
    nextStep: 'Check the field tomorrow evening after the rain and re-run the irrigation advisory.',
  },
  {
    id: 'a2',
    category: 'fertilizer',
    title: 'Fertilizer',
    message: 'Your crop may require nitrogen supplementation.',
    status: 'Review',
    severity: 'info',
    why: 'Based on the available data, recent soil readings show nitrogen at the lower end for the flowering stage.',
    nextStep: 'Open Fertilizer Advisory to see the estimated nutrient plan.',
  },
  {
    id: 'a3',
    category: 'crop-health',
    title: 'Crop Health',
    message: 'No major disease detected. Keep monitoring leaves weekly.',
    status: 'Healthy',
    severity: 'success',
    why: 'Your most recent leaf scan showed no significant symptoms, and weather conditions are not high-risk right now.',
    nextStep: 'Re-scan a few leaves from different parts of the field next week.',
  },
]

export const farmHealthSeries: FarmHealthPoint[] = [
  { day: 'Mon', cropHealth: 82, soilMoisture: 58, temperature: 27, rainfall: 0 },
  { day: 'Tue', cropHealth: 84, soilMoisture: 61, temperature: 28, rainfall: 2 },
  { day: 'Wed', cropHealth: 85, soilMoisture: 62, temperature: 28, rainfall: 0 },
  { day: 'Thu', cropHealth: 83, soilMoisture: 59, temperature: 29, rainfall: 5 },
  { day: 'Fri', cropHealth: 86, soilMoisture: 66, temperature: 26, rainfall: 14 },
  { day: 'Sat', cropHealth: 88, soilMoisture: 68, temperature: 25, rainfall: 10 },
  { day: 'Sun', cropHealth: 87, soilMoisture: 64, temperature: 27, rainfall: 3 },
]

export const fieldZones: FieldZone[] = [
  { id: 'z1', name: 'Zone A · North', status: 'healthy', note: 'Uniform growth, no symptoms observed.' },
  { id: 'z2', name: 'Zone B · East', status: 'healthy', note: 'Best performing section of the field.' },
  { id: 'z3', name: 'Zone C · Center', status: 'attention', note: 'Slight yellowing reported near the border rows.' },
  { id: 'z4', name: 'Zone D · West', status: 'critical', note: 'Leaf lesions detected in last scan — inspect closely.' },
  { id: 'z5', name: 'Zone E · South', status: 'healthy', note: 'Soil moisture steady, growth on track.' },
  { id: 'z6', name: 'Zone F · Low corner', status: 'attention', note: 'Water collects after rain; watch for root stress.' },
]

export const historyItems: HistoryItem[] = [
  { id: 'h1', date: '22 Sep 2026', type: 'Weather Advisory', crop: 'Tomato', recommendation: 'Postpone irrigation due to expected rain.', status: 'Pending' },
  { id: 'h2', date: '20 Sep 2026', type: 'Fertilizer', crop: 'Tomato', recommendation: 'Apply urea 25 kg/acre at flowering stage.', status: 'Followed' },
  { id: 'h3', date: '18 Sep 2026', type: 'Disease Detection', crop: 'Tomato', recommendation: 'Leaf blight detected (moderate). Spray recommended fungicide.', status: 'Followed' },
  { id: 'h4', date: '15 Sep 2026', type: 'Irrigation', crop: 'Tomato', recommendation: 'Moderate irrigation, 40 L per plant row, morning.', status: 'Expired' },
  { id: 'h5', date: '12 Sep 2026', type: 'Crop Recommendation', crop: 'Wheat', recommendation: 'Wheat suitable for upcoming season (92% suitability).', status: 'Followed' },
  { id: 'h6', date: '08 Sep 2026', type: 'Soil Analysis', crop: 'Tomato', recommendation: 'Nitrogen low, phosphorus adequate. Add FYM.', status: 'Expired' },
]

export const notifications: AppNotification[] = [
  { id: 'n1', icon: 'rain', title: 'Rain expected tomorrow', message: 'Light to moderate rain likely at your location. Plan field activities accordingly.', time: '20 min ago', read: false },
  { id: 'n2', icon: 'irrigation', title: 'Irrigation recommendation updated', message: 'Soil moisture rising — next irrigation can be skipped.', time: '2 hrs ago', read: false },
  { id: 'n3', icon: 'disease', title: 'Plant analysis completed', message: 'Your leaf image analysis is complete. View the demo result.', time: 'Yesterday', read: true },
  { id: 'n4', icon: 'crop', title: 'Crop advisory available', message: 'New variety recommendations for the upcoming season.', time: '2 days ago', read: true },
  { id: 'n5', icon: 'market', title: 'Tomato price changed', message: 'Tomato price at Nashik Market rose 4.2% (demo data).', time: '2 days ago', read: true },
]

export const suggestedQuestions = [
  'Which crop is suitable for my soil?',
  'When should I irrigate?',
  'How can I improve soil health?',
  'What are common tomato diseases?',
]
