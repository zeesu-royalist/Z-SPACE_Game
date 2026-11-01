import SpaceportEnvironment from './SpaceportEnvironment';
import LaunchController from '../../systems/launch/LaunchController';
import type { LaunchStage } from '../../systems/launch/launch.config';

export interface EarthSceneProps {
  launchStage?: LaunchStage;
  onLaunchStageChange?: (stage: LaunchStage) => void;
  onCountdownTick?: (secondsRemaining: number) => void;
}

/**
 * EarthScene composites the authentic ground-level space center launch facility:
 * - Sunny daytime blue sky & drifting clouds
 * - Vast green spaceport landscape with runways and access roads
 * - Massive elevated concrete launch pad with flame trench deflector ramps and yellow "01" marking
 * - Steel Mobile Launcher Table with safety railings
 * - Tall umbilical gantry service tower with catwalks and lightning mast
 * - Cryogenic storage spheres, perimeter trees, and floodlight towers
 * - Heavy-lift Space Shuttle / SLS Rocket Stack with LaunchController
 */
export default function EarthScene({
  launchStage = 'ready',
  onLaunchStageChange = () => {},
  onCountdownTick,
}: EarthSceneProps) {
  return (
    <group>
      {/* Complete Realistic Earth Ground Spaceport Environment */}
      <SpaceportEnvironment />

      {/* Heavy-Lift Rocket Launch Controller (Idle / Countdown / Ignition / Liftoff / Complete) */}
      <LaunchController
        launchStage={launchStage}
        onStageChange={onLaunchStageChange}
        onCountdownTick={onCountdownTick}
      />
    </group>
  );
}
