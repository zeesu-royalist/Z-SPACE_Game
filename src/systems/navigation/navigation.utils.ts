import { NAVIGATION_CONFIG } from './navigation.config';

export type NavigationMode = 'ON FOOT' | 'ROVER';

export interface NavigationTelemetry {
  targetPosition: [number, number, number];
  targetName: string;
  distance: number;
  bearingDeg: number;
  cardinalDirection: string;
  isNearby: boolean;
  mode: NavigationMode;
}

/**
 * Calculates horizontal distance (ignoring vertical Y axis) between two 3D positions.
 */
export function calculateHorizontalDistance(
  posA: [number, number, number],
  posB: [number, number, number] = NAVIGATION_CONFIG.targetPosition
): number {
  const dx = posA[0] - posB[0];
  const dz = posA[2] - posB[2];
  return Math.hypot(dx, dz);
}

/**
 * Calculates the compass bearing in degrees (0° to 360°) from player to target.
 * In 3D space: -Z is North, +X is East, +Z is South, -X is West.
 */
export function calculateBearingDegrees(
  playerPos: [number, number, number],
  targetPos: [number, number, number] = NAVIGATION_CONFIG.targetPosition
): number {
  const dx = targetPos[0] - playerPos[0];
  const dz = targetPos[2] - playerPos[2];
  // -dz is the North component, dx is the East component
  const rad = Math.atan2(dx, -dz);
  let deg = (rad * 180) / Math.PI;
  if (deg < 0) {
    deg += 360;
  }
  return Math.round(deg * 10) / 10;
}

/**
 * Calculates the exact Three.js Y-axis rotation in radians
 * to point a mesh whose forward vector is +Z toward targetPos.
 */
export function calculateArrowHeadingAngle(
  playerPos: [number, number, number],
  targetPos: [number, number, number] = NAVIGATION_CONFIG.targetPosition
): number {
  const dx = targetPos[0] - playerPos[0];
  const dz = targetPos[2] - playerPos[2];
  return Math.atan2(dx, dz);
}

/**
 * Returns the standard 8-point cardinal direction string (N, NE, E, SE, S, SW, W, NW).
 */
export function getCardinalDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

/**
 * Checks whether the horizontal distance is within the nearby landing site threshold.
 */
export function isNearTarget(
  distance: number,
  threshold: number = NAVIGATION_CONFIG.nearbyThreshold
): boolean {
  return distance <= threshold;
}

/**
 * Formats Moon distance into user-friendly world units.
 */
export function formatDistanceUnits(distance: number): string {
  return `${distance.toFixed(1)} u`;
}

/**
 * Creates initial telemetry for default state before movement occurs.
 */
export function getInitialNavigationTelemetry(
  initialPlayerPos: [number, number, number],
  mode: NavigationMode = 'ON FOOT'
): NavigationTelemetry {
  const distance = calculateHorizontalDistance(initialPlayerPos);
  const bearingDeg = calculateBearingDegrees(initialPlayerPos);
  return {
    targetPosition: [...NAVIGATION_CONFIG.targetPosition],
    targetName: NAVIGATION_CONFIG.targetName,
    distance: Math.round(distance * 10) / 10,
    bearingDeg,
    cardinalDirection: getCardinalDirection(bearingDeg),
    isNearby: isNearTarget(distance),
    mode,
  };
}

