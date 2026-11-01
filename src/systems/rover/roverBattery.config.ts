/**
 * Centralized configuration for the Lunar Rover Battery System.
 * NOTE: This system is completely independent of spaceship rocket fuel.
 */

export const ROVER_BATTERY_CONFIG = {
  // Battery storage units
  capacity: 100,
  initialBattery: 100,

  // Consumption rate: 1 unit per 10 seconds of active movement
  consumptionPerSecondMoving: 0.1, // 1 unit / 10s = 0.1 units/s

  // Consumption when parked or stationary: exactly 0
  consumptionParked: 0,

  // Warning thresholds
  lowBatteryThreshold: 20,
  criticalBatteryThreshold: 5,
} as const;

