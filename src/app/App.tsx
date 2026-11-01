import { useState } from 'react';
import GameCanvas from './GameCanvas';
import EarthScene from '../worlds/earth/EarthScene';
import MoonScene from '../worlds/moon/MoonScene';
import TravelController from '../systems/travel/TravelController';
import StatusOverlay, { type WorldViewId } from '../components/ui/StatusOverlay';
import { EARTH_CONFIG } from '../worlds/earth/earth.config';
import { MOON_CONFIG } from '../worlds/moon/moon.config';
import { TRAVEL_CONFIG, type TravelStage } from '../systems/travel/travel.config';
import { FUEL_CONFIG } from '../systems/fuel/fuel.config';
import { analyzeFuel } from '../systems/fuel/fuel.utils';
import type { LaunchStage } from '../systems/launch/launch.config';
import { ROVER_BATTERY_CONFIG } from '../systems/rover/roverBattery.config';
import { ROVER_CONFIG } from '../entities/rover/rover.config';
import {
  getInitialNavigationTelemetry,
  type NavigationTelemetry,
} from '../systems/navigation/navigation.utils';

/**
 * App root container managing active world views ('earth' | 'travel' | 'moon'),
 * persistent fuel consumption, launch and travel sequences, lunar rover driving
 * and battery telemetry, and HUD overlays.
 */
export default function App() {
  const [activeView, setActiveView] = useState<WorldViewId>('earth');
  const [selectedFuel, setSelectedFuel] = useState<number>(
    FUEL_CONFIG.recommendedStartingFuel
  );
  const [currentFuel, setCurrentFuel] = useState<number>(
    FUEL_CONFIG.recommendedStartingFuel
  );
  const [outboundFuelConsumed, setOutboundFuelConsumed] = useState<boolean>(false);

  // Launch state
  const [launchStage, setLaunchStage] = useState<LaunchStage>('ready');
  const [countdownNumber, setCountdownNumber] = useState<number | null>(null);

  // Space Travel state
  const [travelStage, setTravelStage] = useState<TravelStage>('idle');
  const [travelProgress, setTravelProgress] = useState<number>(0);
  const [hasArrivedAtMoon, setHasArrivedAtMoon] = useState<boolean>(false);

  // Lunar Rover Driving & Battery state (Step 12)
  const [roverBattery, setRoverBattery] = useState<number>(
    ROVER_BATTERY_CONFIG.initialBattery
  );
  const [isRoverOccupied, setIsRoverOccupied] = useState<boolean>(false);
  const [canEnterRover, setCanEnterRover] = useState<boolean>(false);
  const [astronautDismountPos, setAstronautDismountPos] = useState<[number, number, number] | null>(null);
  const [roverTransform, setRoverTransform] = useState<{
    position: [number, number, number];
    heading: number;
  }>({
    position: ROVER_CONFIG.defaultPosition,
    heading: ROVER_CONFIG.defaultRotation[1],
  });

  // Moon Navigation Telemetry state (Step 13)
  const [navigationTelemetry, setNavigationTelemetry] =
    useState<NavigationTelemetry>(() =>
      getInitialNavigationTelemetry(
        MOON_CONFIG.landingZone.futureSlots.astronautSpawn,
        'ON FOOT'
      )
    );

  // Camera settings per view
  const getCameraSettings = () => {
    switch (activeView) {
      case 'travel':
        return {
          position: TRAVEL_CONFIG.camera.position,
          fov: TRAVEL_CONFIG.camera.fov,
        };
      case 'moon':
        return {
          position: MOON_CONFIG.camera.position,
          fov: MOON_CONFIG.camera.fov,
        };
      default:
        return {
          position: EARTH_CONFIG.camera.position,
          fov: EARTH_CONFIG.camera.fov,
        };
    }
  };

  const { position: cameraPosition, fov: cameraFov } = getCameraSettings();

  // Handle fuel quantity change before launch
  const handleFuelChange = (newFuel: number) => {
    if (launchStage !== 'ready') return;
    setSelectedFuel(newFuel);
    setCurrentFuel(newFuel);
    setOutboundFuelConsumed(false);
  };

  // Handle launch initiation
  const handleInitiateLaunch = () => {
    const analysis = analyzeFuel(selectedFuel);
    if (analysis.status !== 'safe' || launchStage !== 'ready') return;

    setLaunchStage('countdown');
    setCountdownNumber(3);
  };

  // Reset launch back to parked launchpad state
  const handleResetLaunch = () => {
    setLaunchStage('ready');
    setCountdownNumber(null);
    setTravelStage('idle');
    setTravelProgress(0);
    setOutboundFuelConsumed(false);
    setHasArrivedAtMoon(false);
    setCurrentFuel(selectedFuel);
    // Reset rover state
    setRoverBattery(ROVER_BATTERY_CONFIG.initialBattery);
    setIsRoverOccupied(false);
    setCanEnterRover(false);
    setAstronautDismountPos(null);
    // Reset navigation telemetry
    setNavigationTelemetry(
      getInitialNavigationTelemetry(
        MOON_CONFIG.landingZone.futureSlots.astronautSpawn,
        'ON FOOT'
      )
    );
  };

  // Initiate Earth-to-Moon Space Travel
  const handleStartTravel = () => {
    if (launchStage !== 'complete' || travelStage !== 'idle') return;

    // Deduct outbound fuel (70 units) exactly once
    if (!outboundFuelConsumed) {
      setCurrentFuel((prev) => Math.max(0, prev - FUEL_CONFIG.outboundFuel));
      setOutboundFuelConsumed(true);
    }

    setTravelStage('traveling');
    setTravelProgress(0);
    setActiveView('travel');
  };

  // Space Travel progress updates from TravelController
  const handleProgressUpdate = (progress: number) => {
    setTravelProgress(progress);
  };

  // Space Travel completion handler
  const handleTravelComplete = () => {
    setTravelStage('arrived');
    setHasArrivedAtMoon(true);
    setActiveView('moon');
  };

  // Rover Handlers (Step 12)
  const handleBatteryDrain = (newBattery: number) => {
    setRoverBattery(newBattery);
  };

  const handleEnterRover = () => {
    setIsRoverOccupied(true);
    setCanEnterRover(false);
  };

  const handleExitRover = (exitPosition: [number, number, number]) => {
    setAstronautDismountPos(exitPosition);
    setIsRoverOccupied(false);
  };

  const handleExitRoverFromUI = () => {
    const exitOffsetDist = 1.2;
    const exitX =
      roverTransform.position[0] - Math.cos(roverTransform.heading) * exitOffsetDist;
    const exitZ =
      roverTransform.position[2] + Math.sin(roverTransform.heading) * exitOffsetDist;
    handleExitRover([exitX, ROVER_CONFIG.driving.groundY, exitZ]);
  };

  const handleRoverTransformUpdate = (
    position: [number, number, number],
    heading: number
  ) => {
    setRoverTransform({ position, heading });
  };

  const handleProximityChange = (inRange: boolean) => {
    setCanEnterRover(inRange);
  };

  const handleNavigationUpdate = (telemetry: NavigationTelemetry) => {
    setNavigationTelemetry(telemetry);
  };

  return (
    <main className="w-screen h-screen relative bg-slate-950 overflow-hidden">
      {/* 3D Canvas - re-calibrates camera per view via key */}
      <GameCanvas
        key={activeView}
        cameraPosition={cameraPosition}
        cameraFov={cameraFov}
        enableOrbitControls={activeView === 'earth' && launchStage === 'ready'}
      >
        {activeView === 'earth' && (
          <EarthScene
            launchStage={launchStage}
            onLaunchStageChange={setLaunchStage}
            onCountdownTick={setCountdownNumber}
          />
        )}

        {activeView === 'travel' && (
          <TravelController
            onProgressUpdate={handleProgressUpdate}
            onTravelComplete={handleTravelComplete}
          />
        )}

        {activeView === 'moon' && (
          <MoonScene
            hasArrivedAtMoon={hasArrivedAtMoon}
            isRoverOccupied={isRoverOccupied}
            roverBattery={roverBattery}
            onBatteryDrain={handleBatteryDrain}
            onEnterRover={handleEnterRover}
            onExitRover={handleExitRover}
            onProximityChange={handleProximityChange}
            astronautDismountPos={astronautDismountPos}
            onRoverTransformUpdate={handleRoverTransformUpdate}
            canEnterRover={canEnterRover}
            onNavigationUpdate={handleNavigationUpdate}
          />
        )}
      </GameCanvas>

      {/* HUD Overlay with View Switcher, Fuel, Flight Progress, Rover Battery & Controls */}
      <StatusOverlay
        activeView={activeView}
        onSelectView={setActiveView}
        selectedFuel={selectedFuel}
        currentFuel={currentFuel}
        outboundFuelConsumed={outboundFuelConsumed}
        onFuelChange={handleFuelChange}
        launchStage={launchStage}
        countdownNumber={countdownNumber}
        travelStage={travelStage}
        travelProgress={travelProgress}
        hasArrivedAtMoon={hasArrivedAtMoon}
        onInitiateLaunch={handleInitiateLaunch}
        onResetLaunch={handleResetLaunch}
        onStartTravel={handleStartTravel}
        roverBattery={roverBattery}
        isRoverOccupied={isRoverOccupied}
        canEnterRover={canEnterRover}
        onEnterRover={handleEnterRover}
        onExitRover={handleExitRoverFromUI}
        navigationTelemetry={navigationTelemetry}
      />
    </main>
  );
}
