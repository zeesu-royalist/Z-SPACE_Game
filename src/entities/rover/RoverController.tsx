import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ROVER_CONFIG } from './rover.config';
import { calculateBatteryDrain } from '../../systems/rover/roverBattery.utils';
import { useKeyboardControls } from '../../controls/useKeyboardControls';
import Rover from './Rover';

export interface RoverControllerProps {
  isOccupied: boolean;
  battery: number;
  onBatteryDrain: (newBattery: number) => void;
  onExitRover: (exitPosition: [number, number, number]) => void;
  onPositionChange?: (position: [number, number, number], heading?: number) => void;
}

/**
 * RoverController manages:
 * - Driving physics (acceleration, deceleration, steering)
 * - Wheel rolling animation proportional to distance traveled
 * - Exploration boundary enforcement
 * - Battery consumption only while actively driving
 * - Smooth third-person follow camera when driving
 * - Proximity detection and exit placement
 */
export default function RoverController({
  isOccupied,
  battery,
  onBatteryDrain,
  onExitRover,
  onPositionChange,
}: RoverControllerProps) {
  const keysRef = useKeyboardControls();
  const groupRef = useRef<THREE.Group>(null);

  const { driving, camera, dimensions } = ROVER_CONFIG;

  // Mutable physical state stored in refs for useFrame performance
  const position = useRef(new THREE.Vector3(...ROVER_CONFIG.defaultPosition));
  const rotationY = useRef(ROVER_CONFIG.defaultRotation[1]);
  const speed = useRef(0);
  const wheelRoll = useRef(0);

  // Wheel rotation state passed into visual component
  const [visualWheelRoll, setVisualWheelRoll] = useState(0);

  // Follow camera look target
  const lookTarget = useRef(new THREE.Vector3());
  const prevInteract = useRef(false);

  // Sync initial placement
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.copy(position.current);
      groupRef.current.rotation.y = rotationY.current;
    }
    onPositionChange?.([position.current.x, position.current.y, position.current.z], rotationY.current);
  }, [onPositionChange]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. DRIVING STATE (Astronaut inside the rover)
    if (isOccupied) {
      const { forward, backward, left, right, interact } = keysRef.current;

      // Handle 'E' key exit trigger (single press edge)
      if (interact && !prevInteract.current) {
        // Calculate safe dismount position beside driver side (left of rover)
        const exitOffsetDist = 1.2;
        const exitX = position.current.x - Math.cos(rotationY.current) * exitOffsetDist;
        const exitZ = position.current.z + Math.sin(rotationY.current) * exitOffsetDist;
        speed.current = 0;
        onExitRover([exitX, driving.groundY, exitZ]);
        prevInteract.current = true;
        return;
      }
      prevInteract.current = interact;

      // Accelerate / Brake / Reverse (only if battery is available)
      const canDrive = battery > 0;

      if (canDrive) {
        if (forward) {
          speed.current = Math.min(driving.maxSpeed, speed.current + driving.acceleration * delta);
        } else if (backward) {
          speed.current = Math.max(-driving.reverseSpeed, speed.current - driving.deceleration * delta);
        } else {
          // Friction / deceleration when coasting
          if (speed.current > 0) {
            speed.current = Math.max(0, speed.current - driving.deceleration * delta);
          } else if (speed.current < 0) {
            speed.current = Math.min(0, speed.current + driving.deceleration * delta);
          }
        }

        // Steering (can turn while moving or turning in place)
        if (left) {
          rotationY.current += driving.turnSpeed * delta;
        }
        if (right) {
          rotationY.current -= driving.turnSpeed * delta;
        }
      } else {
        // Battery empty: coast to a halt
        if (speed.current > 0) {
          speed.current = Math.max(0, speed.current - driving.deceleration * delta);
        } else if (speed.current < 0) {
          speed.current = Math.min(0, speed.current + driving.deceleration * delta);
        }
      }

      // Calculate forward displacement vector (+Z is rover front)
      const moveStep = speed.current * delta;
      if (Math.abs(moveStep) > 0.0001) {
        const dx = Math.sin(rotationY.current) * moveStep;
        const dz = Math.cos(rotationY.current) * moveStep;

        let newX = position.current.x + dx;
        let newZ = position.current.z + dz;

        // Enforce lunar terrain boundary
        const distFromCenter = Math.hypot(newX, newZ);
        if (distFromCenter > driving.boundaryRadius) {
          const factor = driving.boundaryRadius / distFromCenter;
          newX *= factor;
          newZ *= factor;
          speed.current = 0; // Stop on boundary impact
        }

        position.current.x = newX;
        position.current.z = newZ;
        position.current.y = driving.groundY;

        // Roll wheels proportionally to distance
        wheelRoll.current += moveStep / dimensions.wheelRadius;
        setVisualWheelRoll(wheelRoll.current);

        // Consume battery only while actively moving
        const updatedBattery = calculateBatteryDrain(speed.current, delta, battery);
        if (updatedBattery !== battery) {
          onBatteryDrain(updatedBattery);
        }

        // Notify parent of position change
        onPositionChange?.([newX, driving.groundY, newZ], rotationY.current);
      } else if (canDrive && (left || right)) {
        onPositionChange?.([position.current.x, driving.groundY, position.current.z], rotationY.current);
      }

      // Update 3D Transform
      groupRef.current.position.copy(position.current);
      groupRef.current.rotation.y = rotationY.current;

      // 2. Smooth Rover Follow Camera
      // Camera is stationed behind and above the rover
      const camDistBehind = camera.offset[2];
      const camHeight = camera.offset[1];

      const targetCamX = position.current.x - Math.sin(rotationY.current) * camDistBehind;
      const targetCamZ = position.current.z - Math.cos(rotationY.current) * camDistBehind;
      const targetCamY = position.current.y + camHeight;

      const camDamp = Math.min(1, delta * camera.smoothSpeed);
      state.camera.position.x += (targetCamX - state.camera.position.x) * camDamp;
      state.camera.position.y += (targetCamY - state.camera.position.y) * camDamp;
      state.camera.position.z += (targetCamZ - state.camera.position.z) * camDamp;

      // Camera looks forward ahead of the rover
      const targetLookX = position.current.x + Math.sin(rotationY.current) * 2.0;
      const targetLookZ = position.current.z + Math.cos(rotationY.current) * 2.0;
      const targetLookY = position.current.y + camera.lookAtOffset[1];

      const lookDamp = Math.min(1, delta * camera.lookAtSmoothSpeed);
      lookTarget.current.x += (targetLookX - lookTarget.current.x) * lookDamp;
      lookTarget.current.y += (targetLookY - lookTarget.current.y) * lookDamp;
      lookTarget.current.z += (targetLookZ - lookTarget.current.z) * lookDamp;

      state.camera.lookAt(lookTarget.current);
    } else {
      // PARKED STATE: Stationary at current position
      prevInteract.current = keysRef.current.interact;
      groupRef.current.position.copy(position.current);
      groupRef.current.rotation.y = rotationY.current;
    }
  });

  return (
    <group ref={groupRef} position={position.current}>
      {/* 3D Rover Model with dynamic wheel rotation and optional seated driver */}
      <Rover
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        wheelRotation={visualWheelRoll}
        isOccupied={isOccupied}
      />
    </group>
  );
}
