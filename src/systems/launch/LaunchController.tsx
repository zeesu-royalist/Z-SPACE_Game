import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LAUNCH_CONFIG, type LaunchStage } from './launch.config';
import { SPACESHIP_CONFIG } from '../../entities/spaceship/spaceship.config';
import Spaceship from '../../entities/spaceship/Spaceship';

export interface LaunchControllerProps {
  launchStage: LaunchStage;
  onStageChange: (stage: LaunchStage) => void;
  onCountdownTick?: (secondsRemaining: number) => void;
}

/**
 * Procedural exhaust flame cones attached to the spaceship thruster bells.
 */
function ExhaustFlames({ scale = 1 }: { scale?: number }) {
  const flameCoreRef = useRef<THREE.Group>(null);
  const flameOuterRef = useRef<THREE.Group>(null);

  // Animate dynamic thrust flicker
  useFrame(() => {
    const flicker = 0.85 + Math.random() * 0.3;
    if (flameCoreRef.current) flameCoreRef.current.scale.set(1, flicker * scale, 1);
    if (flameOuterRef.current) flameOuterRef.current.scale.set(1, flicker * scale * 1.1, 1);
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Dual engine nozzles at x = ±0.44 */}
      {[-0.44, 0.44].map((x, i) => (
        <group key={i} position={[x, 1.12, -1.6]}>
          {/* Angled exhaust stream */}
          <group rotation={[Math.PI / 2 + 0.3, 0, 0]}>
            {/* Outer Orange Flame */}
            <group ref={flameOuterRef}>
              <mesh position={[0, -0.9, 0]}>
                <coneGeometry args={[0.26, 1.8, 12]} />
                <meshStandardMaterial
                  color={LAUNCH_CONFIG.effects.flameColorOuter}
                  emissive={LAUNCH_CONFIG.effects.flameColorOuter}
                  emissiveIntensity={2.5}
                  transparent
                  opacity={0.85}
                  toneMapped={false}
                />
              </mesh>
            </group>

            {/* Inner Core Hot Flame */}
            <group ref={flameCoreRef}>
              <mesh position={[0, -0.5, 0]}>
                <coneGeometry args={[0.14, 1.1, 12]} />
                <meshBasicMaterial
                  color={LAUNCH_CONFIG.effects.flameColorCore}
                  transparent
                  opacity={0.95}
                />
              </mesh>
            </group>
          </group>
        </group>
      ))}
    </group>
  );
}

/**
 * Procedural launchpad billowing smoke cloud on ignition and liftoff.
 */
function LaunchpadSmoke({ progress }: { progress: number }) {
  // 6 smoke puffs around the pad perimeter
  const smokePuffs = [
    { x: -1.8, z: -1.2, r: 0.9 },
    { x: 1.8, z: -1.2, r: 0.9 },
    { x: -2.2, z: 0.8, r: 1.1 },
    { x: 2.2, z: 0.8, r: 1.1 },
    { x: 0, z: -2.4, r: 1.3 },
    { x: 0, z: 2.0, r: 0.8 },
  ];

  const scale = 0.4 + progress * 1.6;
  const opacity = Math.max(0, 0.55 * (1 - progress * 0.8));

  return (
    <group position={[0, 0.35, 0]}>
      {smokePuffs.map((puff, i) => (
        <mesh
          key={i}
          position={[puff.x * (1 + progress * 0.5), 0.2 * scale, puff.z * (1 + progress * 0.5)]}
          scale={[scale, scale * 0.65, scale]}
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
 * LaunchController orchestrates the visual takeoff sequence on Earth:
 * - Countdown state with subtle pre-launch vibration
 * - Engine ignition with procedural exhaust flame and launchpad smoke
 * - Frame-rate independent vertical liftoff acceleration
 * - Dynamic camera tracking to observe the ascending rocket
 * - Clean reset support returning the ship to the launchpad
 */
export default function LaunchController({
  launchStage,
  onStageChange,
  onCountdownTick,
}: LaunchControllerProps) {
  const shipGroupRef = useRef<THREE.Group>(null);

  // Mutable physical state stored in refs for useFrame updates
  const altitude = useRef(SPACESHIP_CONFIG.defaultPosition[1]);
  const velocity = useRef(0);
  const stageTimer = useRef(0);
  const lastReportedCount = useRef<number | null>(null);
  const smokeProgress = useRef(0);

  // Sync / reset transform when launchStage changes
  useEffect(() => {
    if (launchStage === 'ready') {
      altitude.current = SPACESHIP_CONFIG.defaultPosition[1];
      velocity.current = 0;
      stageTimer.current = 0;
      lastReportedCount.current = null;
      smokeProgress.current = 0;

      if (shipGroupRef.current) {
        shipGroupRef.current.position.set(...SPACESHIP_CONFIG.defaultPosition);
        shipGroupRef.current.rotation.set(...SPACESHIP_CONFIG.defaultRotation);
      }
    }
  }, [launchStage]);

  useFrame((state, delta) => {
    const defaultPos = SPACESHIP_CONFIG.defaultPosition;
    const defaultRot = SPACESHIP_CONFIG.defaultRotation;

    if (!shipGroupRef.current) return;

    // 1. READY: Sitting stably parked on the launchpad
    if (launchStage === 'ready') {
      shipGroupRef.current.position.set(...defaultPos);
      shipGroupRef.current.rotation.set(...defaultRot);
      return;
    }

    // 2. COUNTDOWN: 3, 2, 1 with subtle pre-launch rumble
    if (launchStage === 'countdown') {
      stageTimer.current += delta;
      const remaining = Math.max(1, Math.ceil(LAUNCH_CONFIG.countdownSeconds - stageTimer.current));

      if (remaining !== lastReportedCount.current) {
        lastReportedCount.current = remaining;
        onCountdownTick?.(remaining);
      }

      // Pre-launch rumble
      const rumble = (Math.random() - 0.5) * LAUNCH_CONFIG.effects.vibrationIntensity * 0.4;
      shipGroupRef.current.position.set(defaultPos[0] + rumble, defaultPos[1], defaultPos[2] + rumble);

      if (stageTimer.current >= LAUNCH_CONFIG.countdownSeconds) {
        stageTimer.current = 0;
        onStageChange('ignition');
      }
      return;
    }

    // 3. ENGINE IGNITION: Thrusters flare and launchpad smoke begins
    if (launchStage === 'ignition') {
      stageTimer.current += delta;
      smokeProgress.current = Math.min(1, stageTimer.current / LAUNCH_CONFIG.ignitionDuration);

      // Stronger ignition vibration
      const rumble = (Math.random() - 0.5) * LAUNCH_CONFIG.effects.vibrationIntensity;
      shipGroupRef.current.position.set(defaultPos[0] + rumble, defaultPos[1], defaultPos[2] + rumble);

      if (stageTimer.current >= LAUNCH_CONFIG.ignitionDuration) {
        stageTimer.current = 0;
        velocity.current = 0.8; // Initial upward nudge
        onStageChange('liftoff');
      }
      return;
    }

    // 4. LIFTOFF: Vertical acceleration towards the stars
    if (launchStage === 'liftoff') {
      // Accelerate upward
      velocity.current = Math.min(
        LAUNCH_CONFIG.maxClimbSpeed,
        velocity.current + LAUNCH_CONFIG.liftoffAcceleration * delta
      );
      altitude.current += velocity.current * delta;

      // Update smoke dissipation
      smokeProgress.current = Math.min(1, smokeProgress.current + delta * 0.4);

      // Subtle aerodynamic pitch/vibration as speed builds
      const aeroDrift = Math.sin(state.clock.getElapsedTime() * 12) * 0.005;
      shipGroupRef.current.position.set(defaultPos[0] + aeroDrift, altitude.current, defaultPos[2]);

      // Camera smooth tracking: gently tilt/raise view to follow ascending rocket
      const camTargetY = Math.min(altitude.current * 0.65, 18);
      state.camera.lookAt(0, camTargetY + 1.0, 0);

      // Check for visual climb completion
      if (altitude.current >= LAUNCH_CONFIG.targetAltitude) {
        onStageChange('complete');
      }
      return;
    }

    // 5. COMPLETE: Spaceship cruising at target altitude
    if (launchStage === 'complete') {
      shipGroupRef.current.position.set(defaultPos[0], LAUNCH_CONFIG.targetAltitude, defaultPos[2]);
      state.camera.lookAt(0, LAUNCH_CONFIG.targetAltitude * 0.65, 0);
    }
  });

  const showFlames = launchStage === 'ignition' || launchStage === 'liftoff';
  const showSmoke = launchStage === 'ignition' || launchStage === 'liftoff';
  const flameIntensity = launchStage === 'ignition' ? 0.7 : 1.2;

  return (
    <group>
      {/* Animated Spaceship Container */}
      <group
        ref={shipGroupRef}
        position={SPACESHIP_CONFIG.defaultPosition}
        rotation={SPACESHIP_CONFIG.defaultRotation}
      >
        <Spaceship position={[0, 0, 0]} rotation={[0, 0, 0]} />

        {/* Dynamic Procedural Exhaust Thrust Flames */}
        {showFlames && <ExhaustFlames scale={flameIntensity} />}
      </group>

      {/* Ground Smoke Clouds at Launchpad Elevation */}
      {showSmoke && <LaunchpadSmoke progress={smokeProgress.current} />}
    </group>
  );
}

