/**
 * Configuration values for the Astronaut entity.
 * Centralizes dimensions, proportions, colors, movement mechanics,
 * boundaries, and third-person camera offsets.
 */

export const ASTRONAUT_CONFIG = {
  // Proportions and scale
  dimensions: {
    height: 2.1,
    scale: [1, 1, 1] as [number, number, number],
  },

  // Color palette for the stylized spacesuit
  colors: {
    suitBase: '#f8fafc',         // Clean white suit
    suitSecondary: '#e2e8f0',    // Off-white / light slate fabric
    suitJoints: '#cbd5e1',       // Elbow & knee joint rings
    visor: '#0f172a',            // Dark obsidian reflective visor
    visorAccent: '#f59e0b',      // Golden metallic visor reflection tone
    glovesAndBoots: '#334155',   // Dark industrial slate for boots & gloves
    backpack: '#e2e8f0',         // PLSS life-support backpack
    tanks: '#94a3b8',            // Oxygen tank canisters
    chestPanel: '#1e293b',       // Chest telemetry panel
    stripeAccent: '#0284c7',     // Mission shoulder insignia / stripe
    beaconLight: '#38bdf8',      // Helmet lamp / indicator
    statusGreen: '#22c55e',      // Chest indicator green LED
    statusRed: '#ef4444',        // Chest indicator red LED
  },

  // Materials settings
  materials: {
    suitRoughness: 0.6,
    suitMetalness: 0.1,
    visorRoughness: 0.08,
    visorMetalness: 0.95,
    bootsRoughness: 0.8,
    bootsMetalness: 0.2,
  },

  // Default positioning
  defaultPosition: [1.8, 0.12, 2.0] as [number, number, number],
  defaultRotation: [0, -Math.PI * 0.75, 0] as [number, number, number],

  // Movement physics and boundaries on the lunar surface
  movement: {
    speed: 4.8,                  // Units per second
    rotationSpeed: 10.0,         // Radians per second for smooth directional turning
    boundaryRadius: 35.0,        // Max distance from lunar center [0,0,0]
    groundY: 0.12,               // Fixed elevation on lunar ground/landing site
  },

  // Smooth third-person follow camera settings
  camera: {
    offset: [0, 3.2, 5.8] as [number, number, number],     // Follow offset [X, Y, Z] relative to astronaut
    lookAtOffset: [0, 1.3, 0] as [number, number, number], // Look target at chest/head level
    smoothSpeed: 5.0,                                      // Camera position interpolation damp factor
    lookAtSmoothSpeed: 8.0,                                // Camera lookAt interpolation damp factor
  },
};
