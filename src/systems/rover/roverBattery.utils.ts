import { ROVER_BATTERY_CONFIG } from './roverBattery.config';

export type RoverBatteryStatus = 'optimal' | 'low' | 'empty';

export interface RoverBatteryAnalysis {
  currentBattery: number;
  capacity: number;
  percentage: number;
  status: RoverBatteryStatus;
  statusTitle: string;
  canDrive: boolean;
}

/**
 * Clamps battery value between 0 and maximum capacity.
 */
export function clampBattery(
  battery: number,
  config = ROVER_BATTERY_CONFIG
): number {
  return Math.max(0, Math.min(config.capacity, battery));
}

/**
 * Calculates battery drain per frame.
 * Drains battery ONLY when rover is actively moving (speed > threshold).
 * Returns unchanged battery when parked or stationary.
 */
export function calculateBatteryDrain(
  speed: number,
  delta: number,
  currentBattery: number,
  config = ROVER_BATTERY_CONFIG
): number {
  if (Math.abs(speed) < 0.05 || currentBattery <= 0) {
    return currentBattery;
  }
  const drain = config.consumptionPerSecondMoving * delta;
  return Math.max(0, currentBattery - drain);
}

/**
 * Analyzes battery state for UI rendering and warnings.
 */
export function analyzeRoverBattery(
  currentBattery: number,
  config = ROVER_BATTERY_CONFIG
): RoverBatteryAnalysis {
  const percentage = Math.round((currentBattery / config.capacity) * 100);
  const canDrive = currentBattery > 0;

  let status: RoverBatteryStatus = 'optimal';
  let statusTitle = 'Battery Optimal';

  if (currentBattery <= 0) {
    status = 'empty';
    statusTitle = 'EMPTY BATTERY';
  } else if (currentBattery <= config.lowBatteryThreshold) {
    status = 'low';
    statusTitle = 'LOW BATTERY';
  }

  return {
    currentBattery: Math.round(currentBattery * 10) / 10,
    capacity: config.capacity,
    percentage,
    status,
    statusTitle,
    canDrive,
  };
}

