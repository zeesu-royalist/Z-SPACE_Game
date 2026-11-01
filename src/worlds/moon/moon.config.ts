/**
 * Configuration values for the Moon world module.
 * Centralizes all dimensions, terrain parameters, landmarks,
 * and future vehicle/landing coordinates for simple tuning.
 */

export const MOON_CONFIG = {
  // Designated flat landing site for future spaceship and astronaut
  landingZone: {
    position: [0, 0, 0] as [number, number, number],
    radius: 4.8,
    height: 0.12,
    baseColor: '#334155',
    ringColor: '#38bdf8',
    beaconColor: '#0ea5e9',
    markerColor: '#94a3b8',

    // Future vehicle & player spawn slots (reserved for subsequent steps)
    futureSlots: {
      shipPosition: [0, 0.12, 0] as [number, number, number],
      astronautSpawn: [1.8, 0.12, 2.0] as [number, number, number],
      roverParking: [-2.6, 0.12, 1.8] as [number, number, number],
    },
  },

  // Surface terrain parameters
  terrain: {
    size: 75,
    groundColor: '#3f3f46',       // Stylized lunar grey with brownish undertone
    subGroundColor: '#27272a',
    craterRimColor: '#52525b',
    craterFloorColor: '#18181b',
    rockColor: '#52525b',

    // Predefined lunar craters (x, z, radius, rimHeight)
    craters: [
      { id: 'crater-major-alpha', x: 16, z: -14, radius: 6.5, rimHeight: 0.8 },
      { id: 'crater-crag-west', x: -18, z: -10, radius: 4.8, rimHeight: 0.65 },
      { id: 'crater-south-bowl', x: -12, z: 16, radius: 3.8, rimHeight: 0.5 },
      { id: 'crater-east-small', x: 18, z: 12, radius: 2.8, rimHeight: 0.4 },
      { id: 'crater-rim-north', x: 2, z: -22, radius: 4.2, rimHeight: 0.6 },
      { id: 'crater-pocket-1', x: -8, z: -6, radius: 1.6, rimHeight: 0.3 },
      { id: 'crater-pocket-2', x: 9, z: 4, radius: 1.4, rimHeight: 0.25 },
    ],

    // Landmark rock formations
    rockFormations: [
      { id: 'spire-cluster', x: -10, z: -16, scale: 1.4 },
      { id: 'ridge-outcrop', x: 20, z: -2, scale: 1.2 },
      { id: 'south-arch', x: 10, z: 22, scale: 1.1 },
    ],
  },

  // Distant Earth in the lunar sky
  distantEarth: {
    position: [28, 22, -42] as [number, number, number],
    radius: 4.8,
    rotationSpeed: 0.015,
    cloudRotationSpeed: 0.025,
    oceanColor: '#1d4ed8',
    atmosphereColor: '#60a5fa',
  },

  // Airless Moon lighting setup
  lighting: {
    sunPosition: [32, 22, 24] as [number, number, number],
    sunColor: '#fffdf5',
    sunIntensity: 2.4, // Crisp, direct solar radiation
    ambientColor: '#cbd5e1',
    ambientIntensity: 0.22, // Low ambient fill due to lack of atmosphere
    earthshinePosition: [-25, 20, -35] as [number, number, number],
    earthshineColor: '#93c5fd',
    earthshineIntensity: 0.4,
  },

  // Space sky
  space: {
    backgroundColor: '#020409',
    starsCount: 3200,
    starsRadius: 95,
    starsDepth: 45,
    starsSpeed: 0.2,
  },

  // Camera settings configured for Moon exploration view
  camera: {
    position: [0, 5.5, 11] as [number, number, number],
    target: [0, 0.8, 0] as [number, number, number],
    fov: 50,
  },
};

