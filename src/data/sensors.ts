import type { Sensor } from '../types'

// Mock sensor readings for the IoT dashboard. No physical devices are
// connected — services/sensorService.ts will call the real ESP32 gateway
// (REST or MQTT) once hardware integration begins.

export const sensors: Sensor[] = [
  { id: 's1', name: 'Soil Moisture Sensor', emoji: '💧', status: 'connected', value: 62, unit: '%', battery: 84, lastSync: '10:42 AM' },
  { id: 's2', name: 'Temperature Sensor', emoji: '🌡️', status: 'connected', value: 28.4, unit: '°C', battery: 71, lastSync: '10:42 AM' },
  { id: 's3', name: 'Humidity Sensor', emoji: '🌦️', status: 'connected', value: 68, unit: '%', battery: 90, lastSync: '10:42 AM' },
  { id: 's4', name: 'NPK Sensor', emoji: '🧪', status: 'not-connected' },
]

export const sensorLastSync = '10:42 AM'
