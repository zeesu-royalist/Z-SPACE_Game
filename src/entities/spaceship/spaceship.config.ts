/**
 * Configuration values for the Spaceship entity.
 * Centralizes dimensions, color palette, material properties,
 * and launchpad placement coordinates.
 */

export const SPACESHIP_CONFIG = {
  // Proportions and bounding dimensions
  dimensions: {
    length: 4.8,
    wingspan: 3.8,
    height: 2.2,
    scale: [1, 1, 1] as [number, number, number],
  },

  // Color palette for the stylized exploration spacecraft
  colors: {
    hullPrimary: '#f8fafc',       // High-reflectance clean orbital white
    hullSecondary: '#e2e8f0',     // Light grey aerodynamic fairing panels
    heatShield: '#1e293b',        // Dark thermal protection underside tiles
    accentBlue: '#0284c7',        // Mission insignia & racing stripe
    accentCyan: '#38bdf8',        // Running glow lights & trim
    cockpitGlass: '#0f172a',      // Dark obsidian-blue tinted canopy glass
    canopyFrame: '#334155',       // Structural canopy reinforcement frame
    engineNozzle: '#475569',      // Heat-resistant metallic titanium bells
    engineGlow: '#06b6d4',        // Static ion/plasma propulsion glow
    landingStruts: '#64748b',     // Hydraulic landing legs & pistons
    landingPads: '#334155',       // Heavy-duty ground touchdown footpads
    beaconRed: '#ef4444',         // Port wingtip navigation light
    beaconGreen: '#22c55e',       // Starboard wingtip navigation light
  },

  // Material physics parameters
  materials: {
    hullRoughness: 0.35,
    hullMetalness: 0.15,
    cockpitRoughness: 0.08,
    cockpitMetalness: 0.92,
    engineRoughness: 0.25,
    engineMetalness: 0.85,
    strutsRoughness: 0.4,
    strutsMetalness: 0.7,
  },

  // Default placement on the Earth launchpad:
  // Launchpad top surface is at Y = 0.20. Landing gear footpads touch at local Y = 0.
  defaultPosition: [0, 0.20, 0] as [number, number, number],
  // Angled gracefully so cockpit, wings, and landing gear are visible to the launchpad camera
  defaultRotation: [0, -Math.PI * 0.25, 0] as [number, number, number],
};

