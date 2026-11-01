import { EARTH_CONFIG } from './earth.config';
import EarthPlanet from './EarthPlanet';
import EarthEnvironment from './EarthEnvironment';
import LaunchController from '../../systems/launch/LaunchController';
import type { LaunchStage } from '../../systems/launch/launch.config';

export interface EarthSceneProps {
  launchStage?: LaunchStage;
  onLaunchStageChange?: (stage: LaunchStage) => void;
  onCountdownTick?: (secondsRemaining: number) => void;
}

/**
 * EarthScene composites the entire Earth world:
 * - Deep space background
 * - The large stylized procedural Earth globe
 * - The surface launch environment (launch pad, terrain, gantry, rocks, lighting)
 * - The animated Spaceship LaunchController stationed on the launchpad
 */
export default function EarthScene({
  launchStage = 'ready',
  onLaunchStageChange = () => {},
  onCountdownTick,
}: EarthSceneProps) {
  return (
    <group>
      {/* Space skybox background color */}
      <color attach="background" args={[EARTH_CONFIG.space.backgroundColor]} />

      {/* Stylized Earth Planet Globe with procedural continents, rotating clouds, and glow */}
      <EarthPlanet />

      {/* Surface Launch Facility Environment */}
      <EarthEnvironment />

      {/* Spaceship Launch Controller (Idle / Countdown / Ignition / Liftoff / Complete) */}
      <LaunchController
        launchStage={launchStage}
        onStageChange={onLaunchStageChange}
        onCountdownTick={onCountdownTick}
      />
    </group>
  );
}
