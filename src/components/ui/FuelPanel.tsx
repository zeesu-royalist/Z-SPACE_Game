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
 * FuelPanel provides an interactive UI for fuel loading, safety validation,
 * launch initiation, and transition to Moon travel.
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
      aria-label="Fuel Planning and Launch System"
      className="pointer-events-auto w-full max-w-sm sm:max-w-md bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl text-white select-none transition-all duration-300"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 text-sm">
            ⛽
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-bold tracking-wider text-slate-100">
              FUEL & LAUNCH
            </h2>
            <p className="text-[11px] text-slate-400">Earth-to-Moon Mission</p>
          </div>
        </div>

        {/* Tank Percentage Tag */}
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-sky-400">
            {tankPercentage}%
          </span>
          <span className="text-[10px] text-slate-500 block">CAPACITY</span>
        </div>
      </div>

      {/* Main Fuel Gauge Readout */}
      <div className="my-3 flex items-baseline justify-between bg-slate-900/80 rounded-xl p-3 border border-slate-800/80">
        <div>
          <span className="text-xs text-slate-400 font-medium block">
            SELECTED FUEL
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span
              className={`text-2xl sm:text-3xl font-extrabold font-mono transition-colors ${
                isSafe ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {selectedFuel}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              / {analysis.tankCapacity} units
            </span>
          </div>
        </div>

        {/* Target Preset Badge */}
        <button
          type="button"
          disabled={!isReady}
          onClick={() => setPresetFuel(analysis.minimumSafeFuel)}
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
            isReady
              ? 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border-sky-500/30 cursor-pointer'
              : 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500 border-slate-700'
          }`}
          title="Click to set recommended 140 units"
        >
          Target: {analysis.minimumSafeFuel}
        </button>
      </div>

      {/* Fuel Level Progress Bar with Safe Divider Marker */}
      <div className="relative w-full bg-slate-800/90 h-2.5 rounded-full overflow-hidden my-2 border border-slate-700/50">
        <div
          className={`h-full transition-all duration-150 ${
            isSafe
              ? 'bg-gradient-to-r from-sky-500 to-emerald-400'
              : 'bg-gradient-to-r from-red-500 to-amber-400'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, tankPercentage))}%` }}
        />
        {/* Safe Threshold Divider (at 70% = 140 / 200) */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-sm"
          style={{ left: `${(analysis.minimumSafeFuel / analysis.tankCapacity) * 100}%` }}
          title="Minimum Safe Threshold (140 units)"
        />
      </div>

      {/* Interactive Range Slider */}
      <div className="mt-3">
        <input
          type="range"
          min={FUEL_CONFIG.minSelectableFuel}
          max={FUEL_CONFIG.tankCapacity}
          step={FUEL_CONFIG.sliderStep}
          value={selectedFuel}
          disabled={!isReady}
          onChange={handleSliderChange}
          aria-label="Adjust fuel amount"
          className={`w-full h-2 rounded-lg appearance-none accent-sky-400 ${
            isReady ? 'bg-slate-800 cursor-pointer' : 'bg-slate-850 opacity-50 cursor-not-allowed'
          }`}
        />

        {/* Quick-Set Preset Buttons */}
        <div className="flex items-center justify-between gap-2 mt-2 pt-1">
          {[0, analysis.outboundFuel, analysis.minimumSafeFuel, analysis.tankCapacity].map((amount) => {
            const isTarget = amount === analysis.minimumSafeFuel;
            const isSelected = selectedFuel === amount;

            return (
              <button
                key={amount}
                type="button"
                disabled={!isReady}
                onClick={() => setPresetFuel(amount)}
                className={`flex-1 py-1 text-[11px] rounded border transition-colors ${
                  !isReady
                    ? 'opacity-40 cursor-not-allowed bg-slate-850 text-slate-600 border-slate-800'
                    : isSelected && isTarget
                    ? 'bg-sky-600 text-white border-sky-400 shadow-sm shadow-sky-500/50 cursor-pointer font-bold'
                    : isTarget
                    ? 'bg-slate-850 hover:bg-slate-800 text-sky-400 border-sky-500/40 cursor-pointer font-semibold'
                    : 'bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700/60 cursor-pointer font-medium'
                }`}
              >
                {amount} {isTarget ? '★' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Flight Plan Fuel Breakdown */}
      <div className="mt-3 space-y-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-xs font-mono">
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            Outbound Flight:
          </span>
          <span className="font-semibold">{analysis.outboundFuel} units</span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            Return Reserve:
          </span>
          <span className="font-semibold">{analysis.returnFuel} units</span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Safety Detour Buffer:
          </span>
          <span className="font-semibold">{analysis.safetyReserve} units</span>
        </div>

        <div className="pt-1 mt-1 border-t border-slate-800 flex items-center justify-between font-sans">
          <span className="text-slate-400 text-[11px]">Safe Minimum:</span>
          <span className="text-slate-200 font-mono font-bold text-xs">
            {analysis.minimumSafeFuel} units
          </span>
        </div>
      </div>

      {/* Validation Status Message */}
      <div
        className={`mt-3 p-2.5 rounded-xl border flex items-start gap-2.5 transition-colors ${
          isSafe
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
        }`}
      >
        <span className="text-sm leading-none mt-0.5">
          {isSafe ? '✅' : '⚠️'}
        </span>
        <div className="flex-1">
          <p className="text-xs font-bold leading-tight">
            {analysis.statusTitle}
          </p>
          <p className="text-[11px] opacity-90 leading-normal mt-0.5">
            {analysis.statusMessage}
          </p>
        </div>
      </div>

      {/* Launch & Travel Control Actions */}
      <div className="mt-3.5 pt-1">
        {launchStage === 'ready' && (
          <button
            type="button"
            disabled={!isSafe}
            onClick={onInitiateLaunch}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200 ${
              isSafe
                ? 'bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 shadow-lg shadow-emerald-500/25 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-slate-850 border border-slate-700/60 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            {isSafe ? (
              <>
                <span>🚀</span>
                <span>INITIATE LAUNCH</span>
              </>
            ) : (
              <>
                <span>🔒</span>
                <span className="text-xs">MIN 140 UNITS REQUIRED</span>
              </>
            )}
          </button>
        )}

        {launchStage === 'countdown' && (
          <div className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono font-bold text-sm text-center animate-pulse flex items-center justify-center gap-2">
            <span>⏱️</span>
            <span>T-MINUS {countdownNumber ?? 3}...</span>
          </div>
        )}

        {launchStage === 'ignition' && (
          <div className="w-full py-2.5 px-4 rounded-xl bg-orange-500/20 border border-orange-500/60 text-orange-300 font-mono font-bold text-sm text-center animate-pulse flex items-center justify-center gap-2">
            <span>🔥</span>
            <span>ENGINE IGNITION...</span>
          </div>
        )}

        {launchStage === 'liftoff' && (
          <div className="w-full py-2.5 px-4 rounded-xl bg-sky-500/20 border border-sky-500/60 text-sky-300 font-mono font-bold text-sm text-center animate-pulse flex items-center justify-center gap-2">
            <span>🚀</span>
            <span>LIFTOFF IN PROGRESS...</span>
          </div>
        )}

        {launchStage === 'complete' && travelStage === 'idle' && (
          <div className="space-y-2">
            <div className="py-1.5 px-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center">
              🎉 LAUNCH COMPLETE · ORBIT ACHIEVED
            </div>

            {/* Travel to Moon Action Button */}
            <button
              type="button"
              onClick={onStartTravel}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 hover:from-sky-400 hover:to-emerald-300 text-slate-950 shadow-lg shadow-sky-500/30 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <span>🌑</span>
              <span>TRAVEL TO MOON</span>
            </button>

            {/* Reset Option */}
            <button
              type="button"
              onClick={onResetLaunch}
              className="w-full py-2 px-4 rounded-xl font-semibold text-xs tracking-wide bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>🔄</span>
              <span>RESET LAUNCH TO PAD</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
