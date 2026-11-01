/**
 * Centralized Configuration for Earth-to-Moon Space Travel.
 * All speeds, durations, distances, and visual positions are defined here.
 */

export type TravelStage = 'idle' | 'traveling' | 'arrived';

export const TRAVEL_CONFIG = {
  // Journey duration in seconds for casual pacing
  travelDurationSeconds: 6.0,

  // Real-world reference distance in kilometers for HUD immersion
  earthToMoonDistanceKm: 384400,

  // Camera settings during space flight
  camera: {
    position: [0, 1.8, 6.2] as [number, number, number],
    lookAt: [0, 0.4, -4] as [number, number, number],
    fov: 52,
  },

  // Spaceship flight transform
  spaceship: {
    position: [0, -0.2, 0] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number], // Facing forward along -Z
    thrustFlickerScale: 1.3,
  },

  // Receding Earth behind the ship
  earth: {
    startZ: 25,
    endZ: 90,
    startScale: 7.0,
    endScale: 1.6,
    x: 0,
    y: -4,
  },

  // Approaching Moon ahead of the ship
  moon: {
    startZ: -140,
    endZ: -20,
    startScale: 1.2,
    endScale: 7.5,
    x: 0,
    y: 1.2,
  },

  // Warp starfield motion
  starfield: {
    count: 2400,
    speedFactor: 2.8,
  },

  // Post-arrival hover altitude on Moon landing pad
  moonApproachAltitude: 5.5,
} as const;

