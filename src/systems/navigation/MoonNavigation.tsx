import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NAVIGATION_CONFIG } from './navigation.config';
import {
  calculateHorizontalDistance,
  calculateBearingDegrees,
  calculateArrowHeadingAngle,
  getCardinalDirection,
  isNearTarget,
  type NavigationTelemetry,
  type NavigationMode,
} from './navigation.utils';

export interface MoonNavigationProps {
  isRoverOccupied: boolean;
  astronautPosRef: React.RefObject<[number, number, number]>;
  roverPosRef: React.RefObject<[number, number, number]>;
  onNavigationUpdate?: (telemetry: NavigationTelemetry) => void;
}

/**
 * MoonNavigation handles:
 * - 3D Directional Navigation Arrow floating above the active player entity (astronaut or rover)
 * - Continuous orientation toward the Moon landing site destination [0, 0.12, 0]
 * - Horizontal distance and compass bearing calculations
 * - Throttled telemetry updates to StatusOverlay to prevent React re-render thrashing
 * - Stylized landing site waypoint beacon pillar
 */
export default function MoonNavigation({
  isRoverOccupied,
  astronautPosRef,
  roverPosRef,
  onNavigationUpdate,
}: MoonNavigationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  const { arrow, targetPosition, targetName } = NAVIGATION_CONFIG;

  // Mutable throttling references
  const lastReportTime = useRef(0);
  const lastReportDistance = useRef(-1);
  const lastMode = useRef<NavigationMode>(isRoverOccupied ? 'ROVER' : 'ON FOOT');

  useFrame((state, delta) => {
    // 1. Determine active position from the current player mode
    const activePos = isRoverOccupied
      ? roverPosRef.current
      : astronautPosRef.current;

    if (!activePos || !groupRef.current) return;

    // 2. Calculate float height and hover bob animation
    const baseHeight = isRoverOccupied
      ? arrow.floatHeightRover
      : arrow.floatHeightAstronaut;

    const bob =
      Math.sin(state.clock.elapsedTime * arrow.hoverBobSpeed) *
      arrow.hoverBobAmplitude;

    // Fast tracking to stay anchored above player
    groupRef.current.position.set(
      activePos[0],
      activePos[1] + baseHeight + bob,
      activePos[2]
    );

    // 3. Distance and Rotation Calculation
    const distance = calculateHorizontalDistance(activePos, targetPosition);

    if (distance > 1.2) {
      // Rotate arrow toward landing site
      const targetAngle = calculateArrowHeadingAngle(activePos, targetPosition);
      let diff = targetAngle - groupRef.current.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      groupRef.current.rotation.y += diff * Math.min(1, delta * 9.0);
    } else {
      // Inside landing pad center: smooth arrival spin
      groupRef.current.rotation.y += delta * arrow.arrivedSpinSpeed;
    }

    // 4. Subtle beacon pillar pulse
    if (beaconRef.current) {
      const material = beaconRef.current.material as THREE.MeshBasicMaterial;
      if (material) {
        material.opacity =
          0.3 + Math.sin(state.clock.elapsedTime * arrow.beaconPulseSpeed) * 0.15;
      }
    }

    // 5. Throttled Telemetry Dispatch to HUD
    const currentMode: NavigationMode = isRoverOccupied ? 'ROVER' : 'ON FOOT';
    const timeSinceLastReport = state.clock.elapsedTime - lastReportTime.current;
    const distanceDelta = Math.abs(distance - lastReportDistance.current);
    const modeChanged = currentMode !== lastMode.current;

    if (
      modeChanged ||
      distanceDelta >= NAVIGATION_CONFIG.hudDistanceDeltaThreshold ||
      timeSinceLastReport >= NAVIGATION_CONFIG.hudUpdateIntervalSeconds
    ) {
      lastReportTime.current = state.clock.elapsedTime;
      lastReportDistance.current = distance;
      lastMode.current = currentMode;

      const bearingDeg = calculateBearingDegrees(activePos, targetPosition);
      const isNearby = isNearTarget(distance);

      onNavigationUpdate?.({
        targetPosition: [...targetPosition],
        targetName,
        distance: Math.round(distance * 10) / 10,
        bearingDeg,
        cardinalDirection: getCardinalDirection(bearingDeg),
        isNearby,
        mode: currentMode,
      });
    }
  });

  return (
    <>
      {/* 3D Directional Navigation Arrow following the active player */}
      <group ref={groupRef} position={[0, 2, 0]}>
        {/* Forward Arrowhead (+Z direction in local space) */}
        <mesh position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[arrow.headRadius, arrow.headLength, 4]} />
          <meshStandardMaterial
            color={arrow.color}
            emissive={arrow.emissiveColor}
            emissiveIntensity={arrow.emissiveIntensity}
            roughness={0.25}
            metalness={0.65}
          />
        </mesh>

        {/* Arrow Shaft */}
        <mesh position={[0, 0, -0.06]}>
          <boxGeometry args={[arrow.shaftSize, 0.06, arrow.shaftLength]} />
          <meshStandardMaterial
            color={arrow.color}
            emissive={arrow.emissiveColor}
            emissiveIntensity={arrow.emissiveIntensity * 0.75}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>

        {/* Left Wing Fin */}
        <mesh position={[-0.1, 0, -0.12]} rotation={[0, -Math.PI / 6, 0]}>
          <boxGeometry args={[0.035, 0.05, 0.16]} />
          <meshStandardMaterial
            color={arrow.glowColor}
            emissive={arrow.emissiveColor}
            emissiveIntensity={arrow.emissiveIntensity}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Right Wing Fin */}
        <mesh position={[0.1, 0, -0.12]} rotation={[0, Math.PI / 6, 0]}>
          <boxGeometry args={[0.035, 0.05, 0.16]} />
          <meshStandardMaterial
            color={arrow.glowColor}
            emissive={arrow.emissiveColor}
            emissiveIntensity={arrow.emissiveIntensity}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Center Glowing Core */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.065, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#38bdf8"
            emissiveIntensity={1.3}
          />
        </mesh>

        {/* Floating Reticle Ring */}
        <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[arrow.reticleRadius * 0.8, arrow.reticleRadius, 16]} />
          <meshBasicMaterial
            color={arrow.glowColor}
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Landing Site Waypoint Beacon Pillar at [0, 0.12, 0] */}
      <group position={targetPosition}>
        {/* Vertical Holographic Light Pillar */}
        <mesh ref={beaconRef} position={[0, 2.5, 0]}>
          <cylinderGeometry args={[0.25, 0.45, 5, 8, 1, true]} />
          <meshBasicMaterial
            color={arrow.glowColor}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Ground Target Ring Marker */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.35, 24]} />
          <meshBasicMaterial
            color={arrow.color}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </>
  );
}

