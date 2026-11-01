import FuelPanel from './FuelPanel';
import type { LaunchStage } from '../../systems/launch/launch.config';
import type { TravelStage } from '../../systems/travel/travel.config';
import {
  calculateRemainingDistanceKm,
  formatKm,
  formatProgressPercent,
} from '../../systems/travel/travel.utils';
import { analyzePostTravelFuel } from '../../systems/fuel/fuel.utils';
import { analyzeRoverBattery } from '../../systems/rover/roverBattery.utils';
import type { NavigationTelemetry } from '../../systems/navigation/navigation.utils';

export type WorldViewId = 'earth' | 'travel' | 'moon';

interface StatusOverlayProps {
  activeView: WorldViewId;
  onSelectView: (view: WorldViewId) => void;
  selectedFuel: number;
  currentFuel: number;
  outboundFuelConsumed: boolean;
  onFuelChange: (fuel: number) => void;
  launchStage?: LaunchStage;
  countdownNumber?: number | null;
  travelStage?: TravelStage;
  travelProgress?: number;
  hasArrivedAtMoon?: boolean;
  onInitiateLaunch?: () => void;
  onResetLaunch?: () => void;
  onStartTravel?: () => void;
  roverBattery?: number;
  isRoverOccupied?: boolean;
  canEnterRover?: boolean;
  onEnterRover?: () => void;
  onExitRover?: () => void;
  navigationTelemetry?: NavigationTelemetry;
}

/**
 * Green 4-petal space agency cloverleaf icon directly inspired by the reference image.
 */
function AgencyCloverIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`${className} filter drop-shadow-md`}>
      {/* Top petal */}
      <path
        d="M 50 8 C 34 8, 26 22, 28 38 C 30 48, 42 50, 50 50 C 58 50, 70 48, 72 38 C 74 22, 66 8, 50 8 Z"
        className="fill-emerald-500"
      />
      {/* Bottom petal */}
      <path
        d="M 50 92 C 34 92, 26 78, 28 62 C 30 52, 42 50, 50 50 C 58 50, 70 52, 72 62 C 74 78, 66 92, 50 92 Z"
        className="fill-emerald-500"
      />
      {/* Left petal */}
      <path
        d="M 8 50 C 8 34, 22 26, 38 28 C 48 30, 50 42, 50 50 C 50 58, 48 70, 38 72 C 22 74, 8 66, 8 50 Z"
        className="fill-emerald-500"
      />
      {/* Right petal */}
      <path
        d="M 92 50 C 92 34, 78 26, 62 28 C 52 30, 50 42, 50 50 C 50 58, 52 70, 62 72 C 78 74, 92 66, 92 50 Z"
        className="fill-emerald-500"
      />
      {/* Center diamond cutout highlight */}
      <polygon points="50,42 58,50 50,58 42,50" className="fill-white/80" />
    </svg>
  );
}

/**
 * StatusOverlay manages the HUD across Earth, Space Travel, and Moon views.
 * Features:
 * - Top-center BETA badge from reference image
 * - Top-left Green 4-petal Agency Clover logo from reference image
 * - Right-hand "Build Your First Rocket" mission control card on Earth
 * - Space Transit telemetry HUD
 * - Moon Telemetry, Lunar Rover Battery, and Navigation locator
 */
export default function StatusOverlay({
  activeView,
  onSelectView,
  selectedFuel,
  currentFuel,
  outboundFuelConsumed,
  onFuelChange,
  launchStage = 'ready',
  countdownNumber = null,
  travelStage = 'idle',
  travelProgress = 0,
  hasArrivedAtMoon = false,
  onInitiateLaunch,
  onResetLaunch,
  onStartTravel,
  roverBattery = 100,
  isRoverOccupied = false,
  canEnterRover = false,
  onEnterRover,
  onExitRover,
  navigationTelemetry,
}: StatusOverlayProps) {
  const postTravelStatus = analyzePostTravelFuel(
    selectedFuel,
    currentFuel,
    outboundFuelConsumed
  );

  const batteryAnalysis = analyzeRoverBattery(roverBattery);

  const percent = formatProgressPercent(travelProgress);
  const remainingKm = calculateRemainingDistanceKm(travelProgress);

  const getStatusText = () => {
    if (activeView === 'travel') {
      return `TRAVELING TO MOON · ${percent}%`;
    }
    if (activeView === 'earth') {
      switch (launchStage) {
        case 'countdown':
          return `COUNTDOWN: T-${countdownNumber ?? 3}`;
        case 'ignition':
          return 'ENGINE IGNITION · FLAME TRENCH FIRING';
        case 'liftoff':
          return 'LIFTOFF · ASCENDING FROM PAD 01';
        case 'complete':
          return 'ORBIT ACHIEVED · READY TO TRAVEL TO MOON';
        default:
          return 'Launch Complex Pad 01 · Rocket Ready';
      }
    }
    // Moon view
    if (navigationTelemetry?.isNearby) {
      return 'LANDING SITE NEARBY';
    }
    if (isRoverOccupied) {
      return batteryAnalysis.canDrive
        ? `ROVER DRIVING · ${batteryAnalysis.percentage}% BATTERY`
        : 'ROVER BATTERY DEPLETED';
    }
    if (canEnterRover) {
      return 'NEAR ROVER · PRESS [E] TO BOARD';
    }
    return hasArrivedAtMoon
      ? 'ARRIVED AT MOON · ORBITAL APPROACH'
      : 'Lunar Exploration Active';
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 select-none overflow-hidden">
      {/* Top Center Subtle "BETA" Badge (Featured in Reference Image) */}
      <div className="pointer-events-none absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-20">
        <span className="text-xs sm:text-sm font-semibold tracking-[0.35em] text-white/85 uppercase bg-slate-900/40 backdrop-blur-xs px-3.5 py-0.5 rounded-full border border-white/20 shadow-sm">
          BETA
        </span>
      </div>

      {/* Top Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        {/* Title & Agency Green Clover Logo (from Reference Image) */}
        <div className="flex items-center gap-2.5">
          <AgencyCloverIcon className="w-8 h-8 sm:w-10 sm:h-10" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-widest text-sky-400 drop-shadow flex items-center gap-2">
              <span>Z-SPACE</span>
            </h1>
            <p className="text-[11px] text-slate-300 font-mono tracking-wider drop-shadow-sm">
              {activeView === 'travel'
                ? 'SPACE TRANSIT · EARTH TO MOON'
                : activeView === 'earth'
                ? 'SPACEPORT LAUNCHPAD 01'
                : 'MOON BASE ALPHA'}
            </p>
          </div>
        </div>

        {/* Center / Right Controls Header */}
        <div className="flex items-center gap-3">
          {/* Development Scene Switcher (Pointer events enabled) */}
          <div className="pointer-events-auto flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700/70 p-1 rounded-xl shadow-xl">
            <button
              type="button"
              onClick={() => onSelectView('earth')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                activeView === 'earth'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/40 ring-1 ring-sky-300'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              🌍 EARTH
            </button>

            {travelStage === 'traveling' && (
              <button
                type="button"
                onClick={() => onSelectView('travel')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  activeView === 'travel'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/40 ring-1 ring-indigo-300'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                🚀 TRAVEL
              </button>
            )}

            <button
              type="button"
              onClick={() => onSelectView('moon')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                activeView === 'moon'
                  ? 'bg-zinc-100 text-slate-900 shadow-md shadow-zinc-100/30 ring-1 ring-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              🌑 MOON
            </button>
          </div>

          {/* Status Indicators & Badges */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Moon Telemetry Pills */}
            {activeView === 'moon' && (
              <>
                {/* Controls Badge */}
                {isRoverOccupied ? (
                  <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-sm border border-amber-500/40 px-2.5 py-1 rounded-full shadow-md">
                    <span className="text-[10px] bg-slate-800 border border-slate-700 text-amber-400 font-mono px-1.5 py-0.5 rounded font-bold">
                      WASD
                    </span>
                    <span className="text-slate-500 text-xs">/</span>
                    <span className="text-[10px] bg-slate-800 border border-slate-700 text-amber-400 font-mono px-1.5 py-0.5 rounded font-bold">
                      ARROWS
                    </span>
                    <span className="text-xs font-semibold text-amber-300 ml-0.5">
                      DRIVE
                    </span>
                    <span className="text-slate-600">|</span>
                    <span className="text-[10px] bg-slate-800 border border-slate-700 text-amber-400 font-mono px-1.5 py-0.5 rounded font-bold">
                      E
                    </span>
                    <span className="text-xs font-semibold text-amber-300">
                      EXIT
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-sm border border-sky-500/40 px-2.5 py-1 rounded-full shadow-md">
                    <span className="text-[10px] bg-slate-800 border border-slate-700 text-sky-400 font-mono px-1.5 py-0.5 rounded font-bold">
                      WASD
                    </span>
                    <span className="text-slate-500 text-xs">/</span>
                    <span className="text-[10px] bg-slate-800 border border-slate-700 text-sky-400 font-mono px-1.5 py-0.5 rounded font-bold">
                      ARROWS
                    </span>
                    <span className="text-xs font-semibold text-slate-300 ml-0.5">
                      MOVE
                    </span>
                    {canEnterRover && (
                      <>
                        <span className="text-slate-600">|</span>
                        <span className="text-[10px] bg-slate-800 border border-emerald-500 text-emerald-400 font-mono px-1.5 py-0.5 rounded font-bold">
                          E
                        </span>
                        <span className="text-xs font-semibold text-emerald-300">
                          ENTER
                        </span>
                      </>
                    )}
                  </div>
                )}

                {/* Navigation Distance Pill */}
                {navigationTelemetry && (
                  <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-sm border border-cyan-500/40 px-2.5 py-1 rounded-full shadow-md font-mono text-xs">
                    <span className="text-cyan-400 text-xs">🧭</span>
                    <span className="font-bold text-cyan-300">
                      {navigationTelemetry.isNearby
                        ? 'NEARBY'
                        : `${navigationTelemetry.distance.toFixed(1)}u`}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {navigationTelemetry.cardinalDirection}
                    </span>
                  </div>
                )}

                {/* Rover Battery Gauge Pill */}
                <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-sm border border-slate-700/80 px-2.5 py-1 rounded-full shadow-md font-mono text-xs">
                  <span className="text-xs">⚡</span>
                  <div className="w-12 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/50">
                    <div
                      className={`h-full transition-all duration-200 ${
                        batteryAnalysis.status === 'empty'
                          ? 'bg-rose-500'
                          : batteryAnalysis.status === 'low'
                          ? 'bg-amber-400 animate-pulse'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${batteryAnalysis.percentage}%` }}
                    />
                  </div>
                  <span
                    className={`font-bold text-[11px] ${
                      batteryAnalysis.status === 'empty'
                        ? 'text-rose-400'
                        : batteryAnalysis.status === 'low'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {batteryAnalysis.percentage}%
                  </span>
                </div>
              </>
            )}

            {/* Current Status Badge */}
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 rounded-full px-3 py-1.5 shadow-md">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    activeView === 'travel'
                      ? 'bg-sky-400'
                      : launchStage === 'liftoff' || launchStage === 'ignition'
                      ? 'bg-amber-400'
                      : navigationTelemetry?.isNearby
                      ? 'bg-cyan-400'
                      : isRoverOccupied
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    activeView === 'travel'
                      ? 'bg-sky-500'
                      : launchStage === 'liftoff' || launchStage === 'ignition'
                      ? 'bg-amber-500'
                      : navigationTelemetry?.isNearby
                      ? 'bg-cyan-400'
                      : isRoverOccupied
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                ></span>
              </span>
              <span className="text-xs font-medium text-emerald-300">
                {getStatusText()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Center Flight Telemetry HUD during Space Travel */}
      {activeView === 'travel' && (
        <div className="self-center my-auto w-full max-w-md bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 shadow-2xl text-center space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5 text-sky-400 font-bold">
              <span>🌍</span> EARTH
            </span>
            <span className="text-slate-400">─────►</span>
            <span className="flex items-center gap-1.5 text-zinc-300 font-bold">
              MOON <span>🌑</span>
            </span>
          </div>

          <div>
            <div className="text-4xl font-extrabold font-mono text-sky-400">
              {percent}%
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {formatKm(remainingKm)} REMAINING
            </p>
          </div>

          {/* Animated Travel Progress Bar */}
          <div className="relative w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 transition-all duration-100"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Active Fuel Consumption Stat */}
          <div className="flex items-center justify-between text-xs font-mono bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-400">Current Fuel:</span>
            <span className="text-emerald-400 font-bold">
              {currentFuel} units
            </span>
            <span className="text-[10px] text-slate-500">(-70 Outbound Burn)</span>
          </div>
        </div>
      )}

      {/* Earth View: Right Side "Build Your First Rocket" Mission Card (Exactly like Reference Image) */}
      {activeView === 'earth' && (
        <div className="flex-1 flex items-center justify-end my-2 py-1 overflow-y-auto max-h-[calc(100vh-140px)] pr-1 sm:pr-4">
          <div className="my-auto">
            <FuelPanel
              selectedFuel={selectedFuel}
              onFuelChange={onFuelChange}
              launchStage={launchStage}
              countdownNumber={countdownNumber}
              travelStage={travelStage}
              onInitiateLaunch={onInitiateLaunch}
              onResetLaunch={onResetLaunch}
              onStartTravel={onStartTravel}
            />
          </div>
        </div>
      )}

      {/* Moon View HUD: Fuel & Rover Panel on Left, Navigation Card on Right */}
      {activeView === 'moon' && (
        <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 overflow-hidden pointer-events-none my-auto">
          {/* Left Column: Mission Fuel Reserves (if arrived) & Rover Controls */}
          <div className="self-start my-auto flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
            {/* Moon Arrival Fuel Status Card (Preserved from Step 9) */}
            {hasArrivedAtMoon && (
              <div className="pointer-events-auto w-full max-w-xs bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-sky-400 flex items-center gap-1.5">
                    <span>⛽</span> FUEL RESERVES
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                    MOON ARRIVAL
                  </span>
                </div>

                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Initial Loaded:</span>
                    <span className="text-slate-200">
                      {postTravelStatus.initialFuel} units
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Outbound Burn:</span>
                    <span className="text-amber-400">
                      -{postTravelStatus.consumedFuel} units
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-200 font-bold pt-1 border-t border-slate-800">
                    <span>Current Remaining:</span>
                    <span className="text-emerald-400">
                      {postTravelStatus.currentFuel} units
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Return Reserve:</span>
                    <span>{postTravelStatus.returnReserve} units</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Safety Buffer:</span>
                    <span>{postTravelStatus.safetyReserve} units</span>
                  </div>
                </div>

                {/* Return Safety Indicator */}
                <div
                  className={`p-2 rounded-lg border text-center font-semibold text-[11px] ${
                    postTravelStatus.canReturnSafely
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-950/40 border-red-500/40 text-red-300'
                  }`}
                >
                  {postTravelStatus.canReturnSafely
                    ? '✓ Return Voyage Protected (70 units reserved)'
                    : '⚠️ Warning: Insufficient Fuel for Safe Return'}
                </div>
              </div>
            )}

            {/* Lunar Rover Telemetry & Action Card (Step 12) */}
            <div className="pointer-events-auto w-full max-w-xs bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span>🚜</span> LUNAR ROVER
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                    isRoverOccupied
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {isRoverOccupied ? 'DRIVING' : 'PARKED'}
                </span>
              </div>

              {/* Battery Power Gauge */}
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Battery Power:</span>
                  <span
                    className={`font-bold ${
                      batteryAnalysis.status === 'empty'
                        ? 'text-rose-400'
                        : batteryAnalysis.status === 'low'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {batteryAnalysis.percentage}% ({batteryAnalysis.currentBattery.toFixed(1)} / 100)
                  </span>
                </div>

                {/* Gauge Bar */}
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700/60">
                  <div
                    className={`h-full transition-all duration-150 ${
                      batteryAnalysis.status === 'empty'
                        ? 'bg-rose-500'
                        : batteryAnalysis.status === 'low'
                        ? 'bg-amber-400'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${batteryAnalysis.percentage}%` }}
                  />
                </div>

                {/* Battery Status Badge */}
                <div
                  className={`p-1.5 rounded-lg border text-center text-[10px] font-semibold ${
                    batteryAnalysis.status === 'empty'
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                      : batteryAnalysis.status === 'low'
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                      : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  {batteryAnalysis.status === 'empty'
                    ? '⚠️ BATTERY DEPLETED — Driving Offline'
                    : batteryAnalysis.status === 'low'
                    ? '⚡ LOW BATTERY (≤20%)'
                    : '✓ Battery Nominal (0.1 u/s moving)'}
                </div>
              </div>

              {/* Rover Specs & Mechanics Info */}
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Speed Limit:</span>
                  <span className="text-slate-200">7.5 m/s (FWD) · 3.5 m/s (REV)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Motors:</span>
                  <span
                    className={
                      batteryAnalysis.canDrive
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }
                  >
                    {batteryAnalysis.canDrive ? 'ONLINE' : 'DEPLETED'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Wheels:</span>
                  <span className="text-slate-200">Independent Rolling</span>
                </div>
              </div>

              {/* Contextual Action Button */}
              {isRoverOccupied ? (
                <button
                  type="button"
                  onClick={onExitRover}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono font-bold py-2 rounded-xl shadow-lg shadow-amber-900/40 border border-amber-400/50 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                >
                  <span className="bg-amber-950/80 px-2 py-0.5 rounded border border-amber-400/60 text-xs">
                    E
                  </span>
                  <span>EXIT ROVER</span>
                  <span>🚶</span>
                </button>
              ) : canEnterRover ? (
                <button
                  type="button"
                  onClick={onEnterRover}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold py-2 rounded-xl shadow-lg shadow-emerald-900/40 border border-emerald-400/50 cursor-pointer transition-all duration-200 hover:scale-[1.02] animate-pulse hover:animate-none"
                >
                  <span className="bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-400/60 text-xs">
                    E
                  </span>
                  <span>ENTER ROVER</span>
                  <span>🚜</span>
                </button>
              ) : (
                <div className="text-center text-[10px] text-slate-400 bg-slate-900/50 p-1.5 rounded-lg border border-slate-800">
                  Approach rover (&le; 3.2m) to board
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Moon Navigation & Landing Site Locator Card (Step 13) */}
          {navigationTelemetry && (
            <div className="pointer-events-auto self-start md:self-center my-auto w-full max-w-xs bg-slate-950/85 backdrop-blur-md border border-cyan-500/50 rounded-2xl p-4 shadow-2xl text-xs space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <span>🧭</span> MOON NAVIGATION
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                    navigationTelemetry.mode === 'ROVER'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  }`}
                >
                  {navigationTelemetry.mode}
                </span>
              </div>

              {/* Primary Distance & Direction Compass */}
              <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                {/* Distance Display */}
                <div className="space-y-0.5">
                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                    Distance to Base
                  </div>
                  <div className="text-2xl font-black font-mono text-cyan-400">
                    {navigationTelemetry.distance.toFixed(1)}
                    <span className="text-xs text-cyan-200 ml-1 font-normal">units</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Horizontal range (X/Z)
                  </div>
                </div>

                {/* Compass Bearing Indicator */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative w-12 h-12 rounded-full border border-cyan-500/40 bg-slate-950 flex items-center justify-center shadow-inner shadow-cyan-950">
                    {/* North marker tick */}
                    <span className="absolute top-0.5 text-[8px] font-bold text-slate-500 font-mono">
                      N
                    </span>
                    {/* Dynamic Rotating Direction Arrow */}
                    <div
                      className="transition-transform duration-150 ease-out"
                      style={{
                        transform: `rotate(${navigationTelemetry.bearingDeg}deg)`,
                      }}
                    >
                      <span className="text-cyan-400 text-lg leading-none inline-block filter drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]">
                        ▲
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-cyan-300">
                    {Math.round(navigationTelemetry.bearingDeg)}° {navigationTelemetry.cardinalDirection}
                  </span>
                </div>
              </div>

              {/* Destination Coordinates */}
              <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Destination:</span>
                  <span className="text-slate-200">{navigationTelemetry.targetName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Target Pos:</span>
                  <span className="text-cyan-300">
                    [{navigationTelemetry.targetPosition.join(', ')}]
                  </span>
                </div>
              </div>

              {/* Proximity Alert / Guidance Banner */}
              {navigationTelemetry.isNearby ? (
                <div className="p-2.5 rounded-xl border bg-emerald-950/50 border-emerald-400/60 text-emerald-300 flex items-center justify-between font-mono animate-pulse shadow-lg shadow-emerald-950/40">
                  <div className="flex items-center gap-2 font-bold text-[11px]">
                    <span className="text-sm">📍</span>
                    <span>LANDING SITE NEARBY</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                    &le; 6.0 u
                  </span>
                </div>
              ) : (
                <div className="p-2 rounded-lg border bg-slate-900/60 border-slate-800 text-slate-400 flex items-center justify-between font-mono text-[10px]">
                  <span className="flex items-center gap-1.5">
                    <span className="text-cyan-400">➤</span> Follow 3D cyan marker to base
                  </span>
                  <span className="text-cyan-400 font-bold">
                    {navigationTelemetry.cardinalDirection}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom Hint */}
      <footer className="text-center md:text-left flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-slate-400 bg-slate-900/70 backdrop-blur-xs px-3 py-1 rounded border border-slate-800">
          {activeView === 'travel'
            ? 'Space transit in progress · Moon is approaching · Spaceship cruising at speed'
            : activeView === 'earth'
            ? launchStage === 'complete'
              ? 'Rocket ready in orbit · Click TRAVEL TO MOON on the right'
              : 'Spaceport Launchpad 01 · Heavy-lift Shuttle Stack on Mobile Launcher · Click LAUNCH ROCKET'
            : isRoverOccupied
            ? 'Driving Lunar Rover · 3D cyan arrow points to Moon landing site · Press [E] to exit rover'
            : canEnterRover
            ? 'Near Lunar Rover · Press [E] on keyboard or click ENTER ROVER to board · 3D cyan arrow points to Moon landing site'
            : 'Moon surface exploration · 3D cyan arrow points to Moon landing site · WASD to move'}
        </span>
      </footer>
    </div>
  );
}
