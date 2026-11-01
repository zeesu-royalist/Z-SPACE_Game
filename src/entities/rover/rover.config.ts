/**
 * Configuration values for the Lunar Rover entity.
 * Centralizes dimensions, colors, materials, Moon spawn placement,
 * driving physics, and follow-camera parameters.
 */

export const ROVER_CONFIG = {
  // Proportions and scale
  dimensions: {
    length: 2.2,
    width: 1.5,
    height: 1.25,
    wheelRadius: 0.28,
    wheelWidth: 0.22,
    trackWidth: 1.44,   // Distance between left and right wheel centers
    wheelbase: 1.4,     // Distance between front and rear wheel centers
    scale: [1, 1, 1] as [number, number, number],
  },

  // Color palette matching low-poly astronaut and spaceship aesthetic
  colors: {
    chassisPrimary: '#475569',    // Metallic slate body panels
    chassisSecondary: '#334155',  // Darker structural elements & bumper
    chassisUnder: '#1e293b',      // Undercarriage & frame
    tires: '#1e293b',             // Heavy-duty rugged lunar tires
    wheelHubs: '#94a3b8',         // Titanium wheel rims
    hubCaps: '#0284c7',           // Cyan center hubcap detail
    seat: '#1e293b',              // Cockpit driver seat cushion
    rollCage: '#64748b',          // Structural roll-over protection bars
    accentCyan: '#38bdf8',        // Running cyan strip lights & trim
    accentBlue: '#0284c7',        // Mission blue racing accents
    headlightHousing: '#1e293b',
    headlightLens: '#fef08a',     // Warm bright headlight glow
    headlightEmissive: '#fde047',
    solarCells: '#1e3a8a',        // Photovoltaic solar array
    solarFrame: '#475569',
    antennaMast: '#94a3b8',
    sensorLens: '#0ea5e9',        // Optical camera lens
  },

  // Material physics properties
  materials: {
    bodyRoughness: 0.45,
    bodyMetalness: 0.6,
    tireRoughness: 0.9,
    tireMetalness: 0.05,
    rimRoughness: 0.3,
    rimMetalness: 0.8,
    solarRoughness: 0.2,
    solarMetalness: 0.85,
  },

  // Driving dynamics & mechanics
  driving: {
    maxSpeed: 7.5,              // Forward maximum speed (units/s)
    reverseSpeed: 3.5,          // Reverse speed (units/s)
    acceleration: 6.0,          // Forward acceleration (units/s^2)
    deceleration: 8.0,          // Braking / friction deceleration (units/s^2)
    turnSpeed: 2.4,             // Steering rotation speed (rad/s)
    interactionRadius: 3.2,     // Proximity distance to enter rover
    groundY: 0.12,              // Lunar pad / ground contact height
    boundaryRadius: 35.0,       // Max exploration distance from Moon origin
  },

  // Follow camera parameters when driving the rover
  camera: {
    offset: [0, 3.8, 6.8] as [number, number, number],
    lookAtOffset: [0, 0.8, 0] as [number, number, number],
    smoothSpeed: 4.5,
    lookAtSmoothSpeed: 7.0,
  },

  // Default placement parked in the reserved rover bay on the Moon landing pad:
  defaultPosition: [-2.6, 0.12, 1.8] as [number, number, number],
  defaultRotation: [0, Math.PI * 0.15, 0] as [number, number, number],
} as const;
