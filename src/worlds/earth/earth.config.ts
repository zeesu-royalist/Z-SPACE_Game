/**
 * Configuration values for the Earth Ground Spaceport Launch Complex.
 * Recreates the authentic ground-level rocket launch facility:
 * - Daytime blue sky & sunny atmosphere
 * - Vast green spaceport terrain with tarmac access roads & perimeter tree lines
 * - Elevated concrete launch pad mound with dual flame trench ramps
 * - Stenciled yellow "01" launchpad apron markings
 * - Steel Mobile Launcher Table with safety railings
 * - Tall umbilical gantry service tower with swing arms & lightning mast
 * - Cryogenic white spherical storage tanks
 * - High-angle dramatic camera perspective
 */

export const EARTH_CONFIG = {
  // Daytime Sky & Atmosphere
  sky: {
    skyColor: '#7ec0ee',
    horizonColor: '#cce6ff',
    sunPosition: [30, 45, 25] as [number, number, number],
    sunColor: '#fffef0',
    sunIntensity: 2.6,
    ambientColor: '#bae6fd',
    ambientIntensity: 0.75,
    hemiSkyColor: '#93c5fd',
    hemiGroundColor: '#4d7c0f',
    hemiIntensity: 0.6,
    fogColor: '#bde0fe',
    fogNear: 60,
    fogFar: 220,
  },

  // Spaceport Terrain & Ground
  terrain: {
    groundSize: 240,
    grassColor: '#5c8738',
    grassDarkColor: '#4c732c',
    tarmacColor: '#cbd5e1',
    tarmacDarkColor: '#94a3b8',
    treeCount: 65,
    treeFieldRadius: 75,
  },

  // Concrete Launchpad Mound & Flame Trench Complex
  launchPad: {
    // Concrete base mound
    moundWidth: 18,
    moundLength: 26,
    moundHeight: 2.2,
    concreteColor: '#e2e8f0',
    concreteDarkColor: '#cbd5e1',
    apronColor: '#d1d5db',
    hazardYellow: '#eab308',

    // Steel Mobile Launcher Table
    tableWidth: 8.4,
    tableLength: 8.4,
    tableHeight: 1.1,
    tableTopY: 2.75,
    steelColor: '#475569',
    steelDarkColor: '#334155',
    railingColor: '#facc15',

    // Rocket positioning on table
    rocketBaseY: 3.3, // Height where the rocket sits on the table clamps

    // Gantry Umbilical Service Tower
    towerHeight: 18.5,
    towerWidth: 2.2,
    towerPosition: [-4.2, 2.75, -1.8] as [number, number, number],
    towerColor: '#334155',
    towerTrussColor: '#64748b',

    // Cryogenic Storage Domes
    storageDomes: [
      { position: [14, 1.8, -12] as [number, number, number], radius: 2.2 },
      { position: [18, 1.4, -10] as [number, number, number], radius: 1.7 },
      { position: [-16, 1.8, -14] as [number, number, number], radius: 2.0 },
    ],
  },

  // Camera settings matching the reference image's elevated high-angle perspective
  camera: {
    position: [11.5, 14.5, 18.5] as [number, number, number],
    target: [0, 5.5, 0] as [number, number, number],
    fov: 45,
  },

  // Backward compatibility fields for legacy Earth globe/environment components
  planet: {
    radius: 16,
    position: [0, -16, 0] as [number, number, number],
    rotationSpeed: 0.02,
    oceanColor: '#1e3a8a',
    oceanRoughness: 0.25,
    oceanMetalness: 0.1,
    cloudRadiusOffset: 0.15,
    cloudRotationSpeed: 0.035,
    atmosphereRadiusOffset: 0.45,
    atmosphereColor: '#60a5fa',
    atmosphereOpacity: 0.15,
  },

  launchSite: {
    position: [0, 0, 0] as [number, number, number],
    padRadius: 3.6,
    padHeight: 0.2,
    terrainRadius: 10,
    terrainHeight: 0.4,
    padColor: '#334155',
    padAccentColor: '#0284c7',
    hazardColor: '#eab308',
    terrainColor: '#1e3a2f',
  },

  lighting: {
    sunPosition: [16, 24, 14] as [number, number, number],
    sunColor: '#fffbeb',
    sunIntensity: 1.8,
    ambientColor: '#bfdbfe',
    ambientIntensity: 0.45,
    rimLightPosition: [-15, -10, -15] as [number, number, number],
    rimLightColor: '#3b82f6',
    rimLightIntensity: 0.6,
  },

  space: {
    backgroundColor: '#7ec0ee',
    starsCount: 2500,
    starsRadius: 90,
    starsDepth: 40,
    starsSpeed: 0.3,
  },
} as const;
