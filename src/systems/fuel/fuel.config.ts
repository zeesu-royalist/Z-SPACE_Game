/**
 * Centralized Fuel Configuration for Z-SPACE.
 *
 * NOTE: These are game-balanced values for simple casual gameplay,
 * NOT real-world rocket equations or aerospace physics.
 */

export const FUEL_CONFIG = {
  // Spaceship tank limit
  tankCapacity: 200,

  // Journey requirements
  outboundFuel: 70,     // Earth to Moon journey
  returnFuel: 55,       // Moon to Earth return journey
  safetyReserve: 15,    // Safety buffer for exploration & detours

  // Recommended starting amount: 70 + 55 + 15 = 140
  recommendedStartingFuel: 140,

  // UI slider controls
  sliderStep: 5,
  minSelectableFuel: 0,
} as const;

