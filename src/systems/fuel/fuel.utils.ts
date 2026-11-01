import { FUEL_CONFIG } from './fuel.config';

export type FuelValidationStatus = 'safe' | 'insufficient' | 'exceeded' | 'invalid';

export interface FuelAnalysis {
  selectedFuel: number;
  tankCapacity: number;
  outboundFuel: number;
  returnFuel: number;
  safetyReserve: number;
  minimumSafeFuel: number;
  remainingSafeExplorationFuel: number;
  canReachMoon: boolean;
  canReturnToEarth: boolean;
  hasSafetyMargin: boolean;
  status: FuelValidationStatus;
  statusTitle: string;
  statusMessage: string;
}

export interface PostTravelFuelStatus {
  initialFuel: number;
  consumedFuel: number;
  currentFuel: number;
  returnReserve: number;
  safetyReserve: number;
  requiredForSafeReturn: number;
  canReturnToEarth: boolean;
  canReturnSafely: boolean;
  extraBuffer: number;
  status: 'safe' | 'risky' | 'stranded';
  statusTitle: string;
  statusMessage: string;
}

/**
 * Calculates the minimum fuel required for a safe round-trip journey:
 * Outbound (70) + Return (55) + Safety Reserve (15) = 140 units.
 */
export function calculateMinimumSafeFuel(config = FUEL_CONFIG): number {
  return config.outboundFuel + config.returnFuel + config.safetyReserve;
}

/**
 * Evaluates the validation state of the chosen fuel quantity.
 */
export function validateFuel(
  fuel: number,
  config = FUEL_CONFIG
): FuelValidationStatus {
  if (fuel < 0) return 'invalid';
  if (fuel > config.tankCapacity) return 'exceeded';
  if (fuel < calculateMinimumSafeFuel(config)) return 'insufficient';
  return 'safe';
}

/**
 * Checks whether the current fuel allows for a safe return journey (55 return + 15 safety = 70).
 */
export function canReturnSafely(currentFuel: number, config = FUEL_CONFIG): boolean {
  return currentFuel >= config.returnFuel + config.safetyReserve;
}

/**
 * Provides comprehensive pre-launch fuel analysis for UI display and mission checks.
 */
export function analyzeFuel(
  selectedFuel: number,
  config = FUEL_CONFIG
): FuelAnalysis {
  const minimumSafeFuel = calculateMinimumSafeFuel(config);
  const remainingSafeExplorationFuel = Math.max(0, selectedFuel - minimumSafeFuel);

  const canReachMoon = selectedFuel >= config.outboundFuel;
  const canReturnToEarth = selectedFuel >= config.outboundFuel + config.returnFuel;
  const hasSafetyMargin = selectedFuel >= minimumSafeFuel;

  let status: FuelValidationStatus = 'safe';
  let statusTitle = 'Safe Round-Trip Fuel';
  let statusMessage = 'Sufficient fuel for Earth-Moon round trip with safety buffer.';

  if (selectedFuel < 0) {
    status = 'invalid';
    statusTitle = 'Invalid Fuel';
    statusMessage = 'Fuel amount cannot be negative.';
  } else if (selectedFuel > config.tankCapacity) {
    status = 'exceeded';
    statusTitle = 'Tank Capacity Exceeded';
    statusMessage = `Cannot load more than ${config.tankCapacity} units into the tank.`;
  } else if (!canReachMoon) {
    status = 'insufficient';
    statusTitle = 'Critical: Cannot Reach Moon';
    statusMessage = `Requires at least ${config.outboundFuel} units just for the outbound flight.`;
  } else if (!canReturnToEarth) {
    status = 'insufficient';
    statusTitle = 'One-Way Risk: Stranded on Moon';
    statusMessage = `Can land on the Moon, but lacks the ${config.returnFuel} units needed to return!`;
  } else if (!hasSafetyMargin) {
    status = 'insufficient';
    statusTitle = 'Insufficient Safety Buffer';
    statusMessage = `Covers flight, but lacks the ${config.safetyReserve}-unit buffer for safety.`;
  } else {
    status = 'safe';
    statusTitle = 'Safe Round-Trip Fuel Loaded';
    statusMessage = remainingSafeExplorationFuel > 0
      ? `Full round trip covered with ${remainingSafeExplorationFuel} units of extra exploration fuel!`
      : 'Optimal recommended fuel loaded for a complete, safe mission.';
  }

  return {
    selectedFuel,
    tankCapacity: config.tankCapacity,
    outboundFuel: config.outboundFuel,
    returnFuel: config.returnFuel,
    safetyReserve: config.safetyReserve,
    minimumSafeFuel,
    remainingSafeExplorationFuel,
    canReachMoon,
    canReturnToEarth,
    hasSafetyMargin,
    status,
    statusTitle,
    statusMessage,
  };
}

/**
 * Analyzes post-travel fuel reserves on the Moon:
 * Evaluates whether the spaceship can safely return to Earth.
 */
export function analyzePostTravelFuel(
  initialFuel: number,
  currentFuel: number,
  outboundConsumed: boolean,
  config = FUEL_CONFIG
): PostTravelFuelStatus {
  const consumedFuel = outboundConsumed ? config.outboundFuel : 0;
  const requiredForSafeReturn = config.returnFuel + config.safetyReserve; // 70 units
  const canReturnToEarth = currentFuel >= config.returnFuel; // 55 units
  const hasSafeMargin = currentFuel >= requiredForSafeReturn; // 70 units
  const extraBuffer = Math.max(0, currentFuel - requiredForSafeReturn);

  let status: 'safe' | 'risky' | 'stranded' = 'safe';
  let statusTitle = 'Safe Return Fuel Intact';
  let statusMessage = `Remaining ${currentFuel} units cover return flight (55) and safety buffer (15).`;

  if (!canReturnToEarth) {
    status = 'stranded';
    statusTitle = 'Critical: Stranded on Moon';
    statusMessage = `Current fuel (${currentFuel}) is below the ${config.returnFuel} units needed to reach Earth!`;
  } else if (!hasSafeMargin) {
    status = 'risky';
    statusTitle = 'Risky Return: Buffer Depleted';
    statusMessage = `Covers the 55-unit return burn, but the 15-unit safety detour margin is missing.`;
  } else {
    status = 'safe';
    statusTitle = 'Safe Return Fuel Intact';
    statusMessage = extraBuffer > 0
      ? `Full return voyage covered with ${extraBuffer} bonus exploration units!`
      : 'Return voyage and 15-unit safety reserve fully intact.';
  }

  return {
    initialFuel,
    consumedFuel,
    currentFuel,
    returnReserve: config.returnFuel,
    safetyReserve: config.safetyReserve,
    requiredForSafeReturn,
    canReturnToEarth,
    canReturnSafely: hasSafeMargin,
    extraBuffer,
    status,
    statusTitle,
    statusMessage,
  };
}

/**
 * Clamps fuel within allowable tank limits (0 to tankCapacity).
 */
export function clampFuel(fuel: number, config = FUEL_CONFIG): number {
  return Math.max(0, Math.min(config.tankCapacity, fuel));
}
