import { MOON_CONFIG } from '../../worlds/moon/moon.config';

/**
 * Configuration for the Moon Navigation System & Landing Site Locator (Step 13).
 * Keeps target coordinates, proximity thresholds, visual arrow parameters,
 * and HUD update rates centralized.
 */
export const NAVIGATION_CONFIG = {
  // Destination: Moon landing pad center from MOON_CONFIG
  targetPosition: [
    MOON_CONFIG.landingZone.futureSlots.shipPosition[0],
    MOON_CONFIG.landingZone.futureSlots.shipPosition[1],
    MOON_CONFIG.landingZone.futureSlots.shipPosition[2],
  ] as [number, number, number],

  targetName: 'Landing Site Alpha',

  // Proximity threshold to trigger "LANDING SITE NEARBY" status (in Moon units)
  nearbyThreshold: 6.0,

  // 3D Directional Navigation Arrow parameters
  arrow: {
    // Floating heights above the respective player entity
    floatHeightAstronaut: 1.85,
    floatHeightRover: 2.2,

    // Dimensions
    headLength: 0.45,
    headRadius: 0.22,
    shaftLength: 0.35,
    shaftSize: 0.09,
    reticleRadius: 0.35,

    // Stylized low-poly cyan accent colors
    color: '#06b6d4',          // Cyan-500
    glowColor: '#38bdf8',      // Sky-400
    emissiveColor: '#0891b2',  // Cyan-600
    emissiveIntensity: 0.85,

    // Animation speeds
    hoverBobSpeed: 2.8,
    hoverBobAmplitude: 0.07,
    beaconPulseSpeed: 3.0,
    arrivedSpinSpeed: 1.8,
  },

  // HUD telemetry update throttling (seconds and distance delta threshold)
  hudUpdateIntervalSeconds: 0.15,
  hudDistanceDeltaThreshold: 0.1,
} as const;

export type NavigationConfig = typeof NAVIGATION_CONFIG;

