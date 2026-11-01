import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LAUNCH_CONFIG, type LaunchStage } from './launch.config';
import { EARTH_CONFIG } from '../../worlds/earth/earth.config';
import RocketStack from '../../entities/spaceship/RocketStack';

export interface LaunchControllerProps {
  launchStage: LaunchStage;
  onStageChange: (stage: LaunchStage) => void;
  onCountdownTick?: (secondsRemaining: number) => void;
}

/**
 * Procedural exhaust flame cones firing from the Shuttle main engines and dual SRB nozzles.
 */
function MultiEngineFlames({ scale = 1 }: { scale?: number }) {
  const outerPlumesRef = useRef<THREE.Group>(null);
  const corePlumesRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const flicker = 0.85 + Math.random() * 0.3;
    if (outerPlumesRef.current) outerPlumesRef.current.scale.set(1, flicker * scale, 1);
    if (corePlumesRef.current) corePlumesRef.current.scale.set(1, flicker * scale * 1.15, 1);
  });

  // Nozzle positions relative to RocketStack origin:
  // - Left SRB bell: [-1.85, -0.35, -0.1]
  // - Right SRB bell: [1.85, -0.35, -0.1]
  // - Shuttle SSME Cluster: [0, 1.75, 0.8]
  const nozzles = [
    { pos: [-1.85, -0.4, -0.1], size: [0.55, 3.4], coreSize: [0.28, 2.4] },
    { pos: [1.85, -0.4, -0.1], size: [0.55, 3.4], coreSize: [0.28, 2.4] },
    { pos: [-0.24, 1.75, 0.8], size: [0.35, 2.8], coreSize: [0.18, 1.9] },
    { pos: [0.24, 1.75, 0.8], size: [0.35, 2.8], coreSize: [0.18, 1.9] },
    { pos: [0, 2.05, 0.6], size: [0.35, 2.8], coreSize: [0.18, 1.9] },
  ];

  return (
    <group>
      {nozzles.map((nozzle, i) => (
        <group key={i} position={nozzle.pos as [number, number, number]}>
          <group rotation={[Math.PI, 0, 0]}>
            {/* Outer Orange Flame */}
            <group ref={outerPlumesRef}>
              <mesh position={[0, nozzle.size[1] / 2, 0]}>
                <coneGeometry args={[nozzle.size[0], nozzle.size[1], 12]} />
                <meshStandardMaterial
                  color={LAUNCH_CONFIG.effects.flameColorOuter}
                  emissive={LAUNCH_CONFIG.effects.flameColorOuter}
                  emissiveIntensity={2.8}
                  transparent
                  opacity={0.85}
                  toneMapped={false}
                />
              </mesh>
            </group>

            {/* Inner Core Bright White/Yellow Hot Flame */}
            <group ref={corePlumesRef}>
              <mesh position={[0, nozzle.coreSize[1] / 2, 0]}>
                <coneGeometry args={[nozzle.coreSize[0], nozzle.coreSize[1], 12]} />
                <meshBasicMaterial color={LAUNCH_CONFIG.effects.flameColorCore} transparent opacity={0.95} />
              </mesh>
            </group>
          </group>
        </group>
      ))}
    </group>
  );
}

/**
 * Billowing launchpad smoke expanding down the concrete flame trenches.
 */
function LaunchpadSmoke({ progress }: { progress: number }) {
  const smokePuffs = [
    // Left flame trench plume
    { x: -5.5, y: 1.2, z: 0, r: 2.2 },
    { x: -8.5, y: 1.5, z: 2.0, r: 3.2 },
    { x: -11.0, y: 1.8, z: -1.5, r: 3.8 },
    // Right flame trench plume
    { x: 5.5, y: 1.2, z: 0, r: 2.2 },
    { x: 8.5, y: 1.5, z: -2.0, r: 3.2 },
    { x: 11.0, y: 1.8, z: 1.5, r: 3.8 },
    // Trench center blowout
    { x: 0, y: 1.4, z: -4.5, r: 2.8 },
    { x: 0, y: 1.6, z: 4.5, r: 2.8 },
  ];

  const scale = 0.5 + progress * 1.8;
  const opacity = Math.max(0, 0.65 * (1 - progress * 0.7));

  return (
    <group position={[0, 0, 0]}>
      {smokePuffs.map((puff, i) => (
        <mesh
          key={i}
          position={[
            puff.x * (1 + progress * 0.4),
            puff.y * scale,
            puff.z * (1 + progress * 0.4),
          ]}
          scale={[scale, scale * 0.7, scale]}
        >
          <sphereGeometry args={[puff.r, 10, 10]} />
          <meshStandardMaterial
            color={LAUNCH_CONFIG.effects.smokeColor}
            transparent
            opacity={opacity}
            roughness={0.9}
            flatShading
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * LaunchController manages the rocket launch sequence:
 * - Ready: Sitting clamped on the Mobile Launcher Table above the flame trench
 * - Countdown: 3, 2, 1 pre-flight countdown
 * - Ignition: Multi-engine fiery ignition plumes & flame trench smoke
 * - Liftoff: Acceleration rising vertically into the daytime sky
 * - Complete: Rocket clears the atmosphere and readies for space transit
 */
export default function LaunchController({
  launchStage,
  onStageChange,
  onCountdownTick,
}: LaunchControllerProps) {
  const rocketGroupRef = useRef<THREE.Group>(null);

  const defaultBaseY = EARTH_CONFIG.launchPad.rocketBaseY; // 3.3
  const altitude = useRef(defaultBaseY);
  const velocity = useRef(0);
  const stageTimer = useRef(0);
  const lastReportedCount = useRef<number | null>(null);
  const smokeProgress = useRef(0);

  // Sync / reset transform when launchStage changes
  useEffect(() => {
    if (launchStage === 'ready') {
      altitude.current = defaultBaseY;
      velocity.current = 0;
      stageTimer.current = 0;
      lastReportedCount.current = null;
      smokeProgress.current = 0;

      if (rocketGroupRef.current) {
        rocketGroupRef.current.position.set(0, defaultBaseY, 0);
        rocketGroupRef.current.rotation.set(0, 0, 0);
      }
    }
  }, [launchStage, defaultBaseY]);

  useFrame((state, delta) => {
    if (!rocketGroupRef.current) return;

    // 1. READY: Clamped on the launch table
    if (launchStage === 'ready') {
      rocketGroupRef.current.position.set(0, defaultBaseY, 0);
      rocketGroupRef.current.rotation.set(0, 0, 0);
      return;
    }

    // 2. COUNTDOWN: 3, 2, 1 with subtle vibration
    if (launchStage === 'countdown') {
      stageTimer.current += delta;
      const remaining = Math.max(
        1,
        Math.ceil(LAUNCH_CONFIG.countdownSeconds - stageTimer.current)
      );

      if (remaining !== lastReportedCount.current) {
        lastReportedCount.current = remaining;
        onCountdownTick?.(remaining);
      }

      // Pre-launch pad rumble
      const rumble = (Math.random() - 0.5) * LAUNCH_CONFIG.effects.vibrationIntensity * 0.4;
      rocketGroupRef.current.position.set(rumble, defaultBaseY, rumble);

      if (stageTimer.current >= LAUNCH_CONFIG.countdownSeconds) {
        stageTimer.current = 0;
        onStageChange('ignition');
      }
      return;
    }

    // 3. ENGINE IGNITION: Multi-engine exhaust flaring and trench smoke
    if (launchStage === 'ignition') {
      stageTimer.current += delta;
      smokeProgress.current = Math.min(
        1,
        stageTimer.current / LAUNCH_CONFIG.ignitionDuration
      );

      // Stronger ignition vibration
      const rumble = (Math.random() - 0.5) * LAUNCH_CONFIG.effects.vibrationIntensity;
      rocketGroupRef.current.position.set(rumble, defaultBaseY, rumble);

      if (stageTimer.current >= LAUNCH_CONFIG.ignitionDuration) {
        stageTimer.current = 0;
        velocity.current = 1.0; // Initial upward lift nudge
        onStageChange('liftoff');
      }
      return;
    }

    // 4. LIFTOFF: Vertical climb into the blue sunny sky
    if (launchStage === 'liftoff') {
      velocity.current = Math.min(
        LAUNCH_CONFIG.maxClimbSpeed,
        velocity.current + LAUNCH_CONFIG.liftoffAcceleration * delta
      );
      altitude.current += velocity.current * delta;

      // Update smoke dissipation
      smokeProgress.current = Math.min(1, smokeProgress.current + delta * 0.4);

      // High-speed aerodynamic micro-drift
      const aeroDrift = Math.sin(state.clock.getElapsedTime() * 14) * 0.006;
      rocketGroupRef.current.position.set(aeroDrift, altitude.current, aeroDrift);

      // Camera smooth upward track: tilts up to watch the rocket soar
      const camTargetY = Math.min(altitude.current * 0.65, 26);
      state.camera.lookAt(0, camTargetY + 2.0, 0);

      // Check for visual climb completion
      if (altitude.current >= LAUNCH_CONFIG.targetAltitude) {
        onStageChange('complete');
      }
      return;
    }

    // 5. COMPLETE: Cruising at ceiling altitude ready to travel
    if (launchStage === 'complete') {
      rocketGroupRef.current.position.set(0, LAUNCH_CONFIG.targetAltitude, 0);
      state.camera.lookAt(0, LAUNCH_CONFIG.targetAltitude * 0.65, 0);
    }
  });

  const showFlames = launchStage === 'ignition' || launchStage === 'liftoff';
  const showSmoke = launchStage === 'ignition' || launchStage === 'liftoff';
  const flameIntensity = launchStage === 'ignition' ? 0.75 : 1.3;

  return (
    <group>
      {/* Animated Rocket Stack Container */}
      <group ref={rocketGroupRef} position={[0, defaultBaseY, 0]}>
        {/* Authentic Space Shuttle / SLS Heavy Lift Stack */}
        <RocketStack position={[0, 0, 0]} rotation={[0, 0, 0]} />

        {/* Dynamic Multi-Engine Exhaust Plumes */}
        {showFlames && <MultiEngineFlames scale={flameIntensity} />}
      </group>

      {/* Billowing Flame Trench Smoke */}
      {showSmoke && <LaunchpadSmoke progress={smokeProgress.current} />}
    </group>
  );
}
