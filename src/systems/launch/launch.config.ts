/**
 * Configuration values for the Spaceship Launch System.
 * Centralizes countdown, ignition timing, acceleration physics,
 * visual flame/smoke parameters, and target altitude.
 */

export type LaunchStage =
  | 'ready'
  | 'countdown'
  | 'ignition'
  | 'liftoff'
  | 'complete';

export const LAUNCH_CONFIG = {
  // Timing parameters (in seconds)
  countdownSeconds: 3,         // 3, 2, 1 countdown duration
  ignitionDuration: 1.2,       // Spool-up ignition time prior to vertical motion
  liftoffAcceleration: 4.8,    // Upward acceleration in units/s^2
  maxClimbSpeed: 12.0,         // Terminal visual climb speed in units/s
  targetAltitude: 28.0,        // Visual ceiling altitude for launch completion

  // Procedural visual effects
  effects: {
    flameColorOuter: '#f97316',  // Fiery orange outer plume
    flameColorCore: '#fef08a',   // Bright white/yellow core
    glowColor: '#38bdf8',        // Plasma cyan exhaust glow
    smokeColor: '#94a3b8',       // Billowing ground launchpad smoke
    vibrationIntensity: 0.02,    // Launchpad pre-flight rumble
  },
} as const;

