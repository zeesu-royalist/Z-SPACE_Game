import { TRAVEL_CONFIG } from './travel.config';

/**
 * Calculates remaining distance to the Moon based on journey progress (0 to 1).
 */
export function calculateRemainingDistanceKm(progress: number): number {
  const clamped = Math.max(0, Math.min(1, progress));
  return Math.round(TRAVEL_CONFIG.earthToMoonDistanceKm * (1 - clamped));
}

/**
 * Calculates kilometers traveled so far.
 */
export function calculateTraveledDistanceKm(progress: number): number {
  const clamped = Math.max(0, Math.min(1, progress));
  return Math.round(TRAVEL_CONFIG.earthToMoonDistanceKm * clamped);
}

/**
 * Formats a kilometer value with comma separators.
 */
export function formatKm(km: number): string {
  return `${km.toLocaleString()} km`;
}

/**
 * Converts 0..1 progress to an integer percentage (0..100).
 */
export function formatProgressPercent(progress: number): number {
  return Math.min(100, Math.max(0, Math.round(progress * 100)));
}

