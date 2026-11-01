import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useKeyboardControls } from '../../controls/useKeyboardControls';
import { ASTRONAUT_CONFIG } from './astronaut.config';
import Astronaut from './Astronaut';

interface AstronautControllerProps {
  spawnPosition?: [number, number, number];
  spawnRotation?: [number, number, number];
  isActive?: boolean;
  onPositionReport?: (pos: [number, number, number]) => void;
  forcedPosition?: [number, number, number] | null;
  onEnterRover?: () => void;
  canEnterRover?: boolean;
}

/**
 * AstronautController handles:
 * - Keyboard input processing (WASD / Arrows)
 * - Frame-rate independent horizontal movement on the lunar surface
 * - Smooth rotation towards the direction of travel
 * - Boundary enforcement to prevent leaving the explorable Moon area
 * - Smooth third-person camera tracking behind the astronaut
 * - Entry into the lunar rover via 'E' key
 * - Dynamic repositioning upon dismounting from the rover
 */
export default function AstronautController({
  spawnPosition = ASTRONAUT_CONFIG.defaultPosition,
  spawnRotation = ASTRONAUT_CONFIG.defaultRotation,
  isActive = true,
  onPositionReport,
  forcedPosition = null,
  onEnterRover,
  canEnterRover = false,
}: AstronautControllerProps) {
  const keysRef = useKeyboardControls();
  const groupRef = useRef<THREE.Group>(null);

  const { movement, camera } = ASTRONAUT_CONFIG;

  // Mutable state stored in refs to bypass React re-renders inside useFrame
  const position = useRef(new THREE.Vector3(...spawnPosition));
  const rotationY = useRef(spawnRotation[1]);
  const lookTarget = useRef(
    new THREE.Vector3(
      spawnPosition[0] + camera.lookAtOffset[0],
      spawnPosition[1] + camera.lookAtOffset[1],
      spawnPosition[2] + camera.lookAtOffset[2]
    )
  );
  const isCameraInitialized = useRef(false);
  const prevInteract = useRef(false);

  // Sync initial position if spawnPosition changes
  useEffect(() => {
    position.current.set(...spawnPosition);
    rotationY.current = spawnRotation[1];
    if (groupRef.current) {
      groupRef.current.position.copy(position.current);
      groupRef.current.rotation.y = rotationY.current;
    }
    onPositionReport?.([position.current.x, position.current.y, position.current.z]);
  }, [spawnPosition, spawnRotation, onPositionReport]);

  // Handle external forced positioning (e.g. dismounting rover)
  useEffect(() => {
    if (forcedPosition) {
      position.current.set(...forcedPosition);
      if (groupRef.current) {
        groupRef.current.position.copy(position.current);
      }
      onPositionReport?.([forcedPosition[0], forcedPosition[1], forcedPosition[2]]);
    }
  }, [forcedPosition, onPositionReport]);

  useFrame((state, delta) => {
    if (!isActive) return;

    // 1. Initial Camera Setup: Snap camera to spawn location on the very first frame to prevent fly-in jumps
    if (!isCameraInitialized.current) {
      state.camera.position.set(
        position.current.x + camera.offset[0],
        position.current.y + camera.offset[1],
        position.current.z + camera.offset[2]
      );
      lookTarget.current.set(
        position.current.x + camera.lookAtOffset[0],
        position.current.y + camera.lookAtOffset[1],
        position.current.z + camera.lookAtOffset[2]
      );
      state.camera.lookAt(lookTarget.current);
      isCameraInitialized.current = true;
    }

    // 2. Process Input
    const { forward, backward, left, right, interact } = keysRef.current;

    // Check for 'E' key press to enter rover if within interaction distance
    if (canEnterRover && interact && !prevInteract.current) {
      onEnterRover?.();
      prevInteract.current = true;
      return;
    }
    prevInteract.current = interact;

    let dx = 0;
    let dz = 0;

    if (forward) dz -= 1;
    if (backward) dz += 1;
    if (left) dx -= 1;
    if (right) dx += 1;

    // 3. Apply Movement & Rotation if keys are actively pressed
    if (dx !== 0 || dz !== 0) {
      // Normalize vector so diagonal movement isn't faster
      const len = Math.hypot(dx, dz);
      dx /= len;
      dz /= len;

      const step = movement.speed * delta;
      let newX = position.current.x + dx * step;
      let newZ = position.current.z + dz * step;

      // Enforce lunar terrain boundary radius
      const distFromCenter = Math.hypot(newX, newZ);
      if (distFromCenter > movement.boundaryRadius) {
        const factor = movement.boundaryRadius / distFromCenter;
        newX *= factor;
        newZ *= factor;
      }

      position.current.x = newX;
      position.current.z = newZ;
      position.current.y = movement.groundY;

      // Smooth rotation toward direction of travel
      const targetAngle = Math.atan2(dx, dz);
      let diff = targetAngle - rotationY.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      rotationY.current += diff * Math.min(1, delta * movement.rotationSpeed);

      // Report updated position
      onPositionReport?.([newX, movement.groundY, newZ]);
    }

    // 4. Update Astronaut Group Transform
    if (groupRef.current) {
      groupRef.current.position.copy(position.current);
      groupRef.current.rotation.y = rotationY.current;
    }

    // 5. Smooth Third-Person Camera Tracking
    const targetCamX = position.current.x + camera.offset[0];
    const targetCamY = position.current.y + camera.offset[1];
    const targetCamZ = position.current.z + camera.offset[2];

    const camDamp = Math.min(1, delta * camera.smoothSpeed);
    state.camera.position.x += (targetCamX - state.camera.position.x) * camDamp;
    state.camera.position.y += (targetCamY - state.camera.position.y) * camDamp;
    state.camera.position.z += (targetCamZ - state.camera.position.z) * camDamp;

    const targetLookX = position.current.x + camera.lookAtOffset[0];
    const targetLookY = position.current.y + camera.lookAtOffset[1];
    const targetLookZ = position.current.z + camera.lookAtOffset[2];

    const lookDamp = Math.min(1, delta * camera.lookAtSmoothSpeed);
    lookTarget.current.x += (targetLookX - lookTarget.current.x) * lookDamp;
    lookTarget.current.y += (targetLookY - lookTarget.current.y) * lookDamp;
    lookTarget.current.z += (targetLookZ - lookTarget.current.z) * lookDamp;

    state.camera.lookAt(lookTarget.current);
  });

  if (!isActive) {
    return null;
  }

  return (
    <group ref={groupRef} position={spawnPosition}>
      {/* Visual Astronaut Model mounted at local origin */}
      <Astronaut position={[0, 0, 0]} rotation={[0, 0, 0]} />
    </group>
  );
}

