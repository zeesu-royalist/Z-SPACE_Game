import { useRef, useCallback, useEffect } from 'react';
import { MOON_CONFIG } from './moon.config';
import MoonEnvironment from './MoonEnvironment';
import MoonTerrain from './MoonTerrain';
import AstronautController from '../../entities/astronaut/AstronautController';
import Spaceship from '../../entities/spaceship/Spaceship';
import RoverController from '../../entities/rover/RoverController';
import { ROVER_CONFIG } from '../../entities/rover/rover.config';
import { TRAVEL_CONFIG } from '../../systems/travel/travel.config';
import MoonNavigation from '../../systems/navigation/MoonNavigation';
import type { NavigationTelemetry } from '../../systems/navigation/navigation.utils';

export interface MoonSceneProps {
  hasArrivedAtMoon?: boolean;
  isRoverOccupied?: boolean;
  roverBattery?: number;
  onBatteryDrain?: (battery: number) => void;
  onEnterRover?: () => void;
  onExitRover?: (exitPosition: [number, number, number]) => void;
  onProximityChange?: (canEnter: boolean) => void;
  astronautDismountPos?: [number, number, number] | null;
  onRoverTransformUpdate?: (position: [number, number, number], heading: number) => void;
  canEnterRover?: boolean;
  onNavigationUpdate?: (telemetry: NavigationTelemetry) => void;
}

/**
 * MoonScene composites the complete 3D Moon world:
 * - Deep dark space background
 * - Lunar environment (distant Earth, harsh solar lighting, flat landing zone)
 * - Procedural lunar terrain (craters, boulders, spires, horizon mountain ring)
 * - Playable Astronaut with keyboard controls & third-person follow camera
 * - Spaceship approaching / hovering above the landing pad upon arrival
 * - Driveable Lunar Rover with battery system & enter/exit mechanics
 */
export default function MoonScene({
  hasArrivedAtMoon = false,
  isRoverOccupied = false,
  roverBattery = 100,
  onBatteryDrain,
  onEnterRover,
  onExitRover,
  onProximityChange,
  astronautDismountPos = null,
  onRoverTransformUpdate,
  canEnterRover = false,
  onNavigationUpdate,
}: MoonSceneProps) {
  const astronautPos = useRef<[number, number, number]>(
    astronautDismountPos || MOON_CONFIG.landingZone.futureSlots.astronautSpawn
  );
  const roverPos = useRef<[number, number, number]>(ROVER_CONFIG.defaultPosition);
  const roverHeading = useRef<number>(ROVER_CONFIG.defaultRotation[1]);

  // Evaluate proximity between astronaut and rover
  const checkProximity = useCallback(() => {
    if (isRoverOccupied) {
      onProximityChange?.(false);
      return;
    }
    const dist = Math.hypot(
      astronautPos.current[0] - roverPos.current[0],
      astronautPos.current[2] - roverPos.current[2]
    );
    const inRange = dist <= ROVER_CONFIG.driving.interactionRadius;
    onProximityChange?.(inRange);
  }, [isRoverOccupied, onProximityChange]);

  // Re-check proximity if occupancy toggles
  useEffect(() => {
    checkProximity();
  }, [checkProximity]);

  const handleAstronautPositionReport = useCallback(
    (pos: [number, number, number]) => {
      astronautPos.current = pos;
      checkProximity();
    },
    [checkProximity]
  );

  const handleRoverPositionChange = useCallback(
    (pos: [number, number, number], heading?: number) => {
      roverPos.current = pos;
      if (heading !== undefined) {
        roverHeading.current = heading;
      }
      onRoverTransformUpdate?.(pos, roverHeading.current);
      checkProximity();
    },
    [checkProximity, onRoverTransformUpdate]
  );

  const handleRoverExit = useCallback(
    (exitPos: [number, number, number]) => {
      astronautPos.current = exitPos;
      onExitRover?.(exitPos);
    },
    [onExitRover]
  );

  return (
    <group>
      {/* Deep space void background */}
      <color attach="background" args={[MOON_CONFIG.space.backgroundColor]} />

      {/* Lunar Environment & Landing Zone */}
      <MoonEnvironment />

      {/* Lunar Surface Terrain & Landmarks */}
      <MoonTerrain />

      {/* Playable Astronaut with keyboard controls & third-person follow camera */}
      <AstronautController
        spawnPosition={MOON_CONFIG.landingZone.futureSlots.astronautSpawn}
        isActive={!isRoverOccupied}
        forcedPosition={astronautDismountPos}
        onPositionReport={handleAstronautPositionReport}
        canEnterRover={canEnterRover && !isRoverOccupied}
        onEnterRover={onEnterRover}
      />

      {/* Driveable Lunar Exploration Rover with Battery System */}
      <RoverController
        isOccupied={isRoverOccupied}
        battery={roverBattery}
        onBatteryDrain={onBatteryDrain ?? (() => {})}
        onExitRover={handleRoverExit}
        onPositionChange={handleRoverPositionChange}
      />

      {/* Moon Navigation System & Landing Site Locator (Step 13) */}
      <MoonNavigation
        isRoverOccupied={isRoverOccupied}
        astronautPosRef={astronautPos}
        roverPosRef={roverPos}
        onNavigationUpdate={onNavigationUpdate}
      />

      {/* Approaching Spaceship hovering above the landing pad upon arrival */}
      {hasArrivedAtMoon && (
        <group position={[0, TRAVEL_CONFIG.moonApproachAltitude, 0]}>
          <Spaceship position={[0, 0, 0]} rotation={[0, -Math.PI * 0.25, 0]} />
        </group>
      )}
    </group>
  );
}
