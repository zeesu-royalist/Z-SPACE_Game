import React from 'react';
import { FUEL_CONFIG } from '../../systems/fuel/fuel.config';
import { analyzeFuel, clampFuel } from '../../systems/fuel/fuel.utils';
import type { LaunchStage } from '../../systems/launch/launch.config';
import type { TravelStage } from '../../systems/travel/travel.config';

export interface FuelPanelProps {
  selectedFuel: number;
  onFuelChange: (fuel: number) => void;
  launchStage?: LaunchStage;
  countdownNumber?: number | null;
  travelStage?: TravelStage;
  onInitiateLaunch?: () => void;
  onResetLaunch?: () => void;
  onStartTravel?: () => void;
}

/**
 * FuelPanel implements the iconic "Build Your First Rocket" mission control card
 * from the reference image:
 * - Bold curved red container with serif heading
 * - Space Shuttle / SLS heavy-lift stack configuration
 * - Intuitive fuel loading slider & safety threshold marker
 * - Interactive launch countdown and takeoff ignition triggers
 */
export default function FuelPanel({
  selectedFuel,
  onFuelChange,
  launchStage = 'ready',
  countdownNumber = null,
  travelStage = 'idle',
  onInitiateLaunch,
  onResetLaunch,
  onStartTravel,
}: FuelPanelProps) {
  const analysis = analyzeFuel(selectedFuel);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (launchStage !== 'ready') return;
    const value = clampFuel(Number(e.target.value));
    onFuelChange(value);
  };

  const setPresetFuel = (amount: number) => {
    if (launchStage !== 'ready') return;
    onFuelChange(clampFuel(amount));
  };

  const isSafe = analysis.status === 'safe';
  const isReady = launchStage === 'ready';
  const tankPercentage = Math.round((selectedFuel / analysis.tankCapacity) * 100);

  return (
    <aside
      aria-label="Build Your First Rocket Launch Control"
      className="pointer-events-auto w-full max-w-sm sm:max-w-md bg-gradient-to-br from-red-600 via-red-600 to-red-700 border-2 border-red-400/80 rounded-3xl p-5 sm:p-6 shadow-[0_15px_35px_rgba(220,38,38,0.45)] text-white select-none transition-all duration-300"
    >
      {/* Iconic Headline matching Reference Image: "Build Your First Rocket" */}
      <div className="text-center pb-3 border-b border-red-400/40">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
          Build Your
          <br />
          First Rocket
        </h2>
        <div className="inline-flex items-center gap-1.5 mt-2 bg-red-900/60 backdrop-blur-xs px-3 py-0.5 rounded-full border border-red-300/40 text-[10px] sm:text-xs font-mono font-semibold tracking-wider text-red-100">
          <span>🚀</span>
          <span>ORBITER SHUTTLE + DUAL BOOSTERS</span>
        </div>
      </div>

      {/* Main Fuel Capacity Readout */}
      <div className="my-3 flex items-baseline justify-between bg-red-950/60 backdrop-blur-xs rounded-2xl p-3 border border-red-400/30">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-red-200 uppercase block font-semibold">
            Propellant Load
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white drop-shadow">
              {selectedFuel}
            </span>
            <span className="text-xs text-red-200 font-mono">
              / {analysis.tankCapacity} units
            </span>
          </div>
        </div>

        {/* Target 140 Button */}
        <button
          type="button"
          disabled={!isReady}
          onClick={() => setPresetFuel(analysis.minimumSafeFuel)}
          className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
            selectedFuel === analysis.minimumSafeFuel
              ? 'bg-white text-red-700 border-white shadow-md'
              : 'bg-red-800/80 hover:bg-red-800 text-white border-red-400/50'
          }`}
          title="Click to load recommended 140 units"
        >
          {selectedFuel === analysis.minimumSafeFuel ? '✓ 140 Loaded' : 'Target: 140 ★'}
        </button>
      </div>

      {/* Fuel Level Bar */}
      <div className="relative w-full bg-red-950/80 h-3 rounded-full overflow-hidden my-2 border border-red-400/40">
        <div
          className={`h-full transition-all duration-150 ${
            isSafe
              ? 'bg-gradient-to-r from-amber-300 to-emerald-300'
              : 'bg-gradient-to-r from-red-300 to-amber-300'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, tankPercentage))}%` }}
        />
        {/* Safe Divider Marker at 140u (70%) */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-sm"
          style={{ left: `${(analysis.minimumSafeFuel / analysis.tankCapacity) * 100}%` }}
        />
      </div>

      {/* Interactive Range Slider */}
      <div className="mt-2.5">
        <input
          type="range"
          min={FUEL_CONFIG.minSelectableFuel}
          max={FUEL_CONFIG.tankCapacity}
          step={FUEL_CONFIG.sliderStep}
          value={selectedFuel}
          disabled={!isReady}
          onChange={handleSliderChange}
          aria-label="Adjust fuel amount"
          className={`w-full h-2 rounded-lg appearance-none accent-amber-300 ${
            isReady ? 'bg-red-950/80 cursor-pointer' : 'bg-red-950/50 opacity-50 cursor-not-allowed'
          }`}
        />

        {/* Quick-Set Presets */}
        <div className="flex items-center justify-between gap-1.5 mt-2">
          {[0, analysis.outboundFuel, analysis.minimumSafeFuel, analysis.tankCapacity].map((amount) => {
            const isTarget = amount === analysis.minimumSafeFuel;
            const isSelected = selectedFuel === amount;

            return (
              <button
                key={amount}
                type="button"
                disabled={!isReady}
                onClick={() => setPresetFuel(amount)}
                className={`flex-1 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                  !isReady
                    ? 'opacity-40 cursor-not-allowed bg-red-950/40 border-red-800 text-red-300'
                    : isSelected
                    ? 'bg-white text-red-700 font-bold border-white shadow'
                    : isTarget
                    ? 'bg-red-800/80 hover:bg-red-800 text-amber-200 border-amber-300/50 font-bold cursor-pointer'
                    : 'bg-red-950/50 hover:bg-red-900/60 text-red-100 border-red-400/30 cursor-pointer'
                }`}
              >
                {amount} {isTarget ? '★' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Flight Plan Breakdown */}
      <div className="mt-3 space-y-1 bg-red-950/70 p-2.5 rounded-xl border border-red-400/30 text-xs font-mono">
        <div className="flex items-center justify-between text-red-100">
          <span className="text-red-200">Outbound Flight:</span>
          <span className="font-bold">{analysis.outboundFuel} units</span>
        </div>
        <div className="flex items-center justify-between text-red-100">
          <span className="text-red-200">Return Reserve:</span>
          <span className="font-bold">{analysis.returnFuel} units</span>
        </div>
        <div className="flex items-center justify-between text-red-100">
          <span className="text-red-200">Safety Reserve:</span>
          <span className="font-bold">{analysis.safetyReserve} units</span>
        </div>
      </div>

      {/* Safety Validation Tag */}
      <div
        className={`mt-2.5 p-2 rounded-xl border text-center font-semibold text-xs transition-all ${
          isSafe
            ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-sm'
            : 'bg-amber-950/60 border-amber-400 text-amber-200'
        }`}
      >
        {isSafe
          ? '✓ Ready for Safe Earth-to-Moon-to-Earth Voyage'
          : '⚠️ Insufficient Fuel (Need ≥140 units for return)'}
      </div>

      {/* Launch Actions */}
      <div className="mt-3.5 pt-1">
        {launchStage === 'ready' && (
          <button
            type="button"
            disabled={!isSafe}
            onClick={onInitiateLaunch}
            className={`w-full py-3 px-4 rounded-2xl font-black text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200 shadow-xl ${
              isSafe
                ? 'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 hover:from-white hover:to-amber-200 text-red-950 shadow-amber-900/40 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-red-950/80 border border-red-400/30 text-red-300/60 cursor-not-allowed opacity-60'
            }`}
          >
            {isSafe ? (
              <>
                <span>🚀</span>
                <span>LAUNCH ROCKET</span>
              </>
            ) : (
              <>
                <span>🔒</span>
                <span>MIN 140 UNITS REQUIRED</span>
              </>
            )}
          </button>
        )}

        {launchStage === 'countdown' && (
          <div className="w-full py-3 px-4 rounded-2xl bg-amber-400 text-red-950 font-black text-base text-center animate-bounce flex items-center justify-center gap-2 shadow-xl">
            <span>⏱️</span>
            <span>T-MINUS {countdownNumber ?? 3}...</span>
          </div>
        )}

        {launchStage === 'ignition' && (
          <div className="w-full py-3 px-4 rounded-2xl bg-orange-400 text-red-950 font-black text-base text-center animate-pulse flex items-center justify-center gap-2 shadow-xl">
            <span>🔥</span>
            <span>ENGINE IGNITION!</span>
          </div>
        )}

        {launchStage === 'liftoff' && (
          <div className="w-full py-3 px-4 rounded-2xl bg-amber-300 text-red-950 font-black text-base text-center animate-pulse flex items-center justify-center gap-2 shadow-xl">
            <span>🚀</span>
            <span>LIFTOFF IN PROGRESS...</span>
          </div>
        )}

        {launchStage === 'complete' && travelStage === 'idle' && (
          <div className="space-y-2">
            <div className="py-2 px-3 rounded-xl bg-emerald-900/80 border border-emerald-400 text-emerald-200 text-xs font-bold text-center">
              🎉 LAUNCH COMPLETE · ORBIT ACHIEVED
            </div>

            {/* Travel to Moon Action Button */}
            <button
              type="button"
              onClick={onStartTravel}
              className="w-full py-3 px-4 rounded-2xl font-black text-sm tracking-widest uppercase bg-gradient-to-r from-sky-300 via-indigo-200 to-emerald-300 hover:from-white hover:to-emerald-200 text-slate-950 shadow-xl cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <span>🌑</span>
              <span>TRAVEL TO MOON</span>
            </button>

            {/* Reset Option */}
            <button
              type="button"
              onClick={onResetLaunch}
              className="w-full py-2 px-4 rounded-xl font-bold text-xs bg-red-950/80 hover:bg-red-900 text-red-200 hover:text-white border border-red-400/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>🔄</span>
              <span>RESET LAUNCHPAD</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
