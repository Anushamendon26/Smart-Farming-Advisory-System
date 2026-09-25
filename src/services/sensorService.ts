// Sensor service — future integration: ESP32 gateway via REST or MQTT.
// UI only ever calls these functions; when real hardware is connected, the
// mock readings below are replaced by gateway responses.
import { sensors, sensorLastSync } from '../data/sensors'
import { delay, timeNow } from '../utils/service'
import type { Sensor } from '../types'

export interface SensorBundle {
  sensors: Sensor[]
  lastSync: string
}

export async function fetchSensors(): Promise<SensorBundle> {
  await delay()
  return { sensors, lastSync: sensorLastSync }
}

/** Mock pairing step — a real implementation would provision the device. */
export async function connectSensor(id: string): Promise<Sensor | undefined> {
  await delay(900)
  return sensors.find((s) => s.id === id)
}

export function syncTimestamp(): string {
  return timeNow()
}
