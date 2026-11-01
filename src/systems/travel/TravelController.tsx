import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { TRAVEL_CONFIG } from './travel.config';
import Spaceship from '../../entities/spaceship/Spaceship';

export interface TravelControllerProps {
  onProgressUpdate: (progress: number) => void;
  onTravelComplete: () => void;
}

/**
 * Procedural stylized moon texture for the approaching lunar globe in space.
 */
function createTravelMoonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Base lunar grey gradient
  ctx.fillStyle = '#52525b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Craters and darker lunar maria patches
  const drawMare = (cx: number, cy: number, w: number, h: number) => {
    ctx.beginPath();
    ctx.ellipse(cx, cy, w, h, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#3f3f46';
    ctx.fill();
  };

  drawMare(140, 90, 50, 40);
  drawMare(220, 130, 65, 45);
  drawMare(330, 80, 45, 35);
  drawMare(290, 160, 55, 38);
  drawMare(180, 190, 40, 30);
  drawMare(410, 140, 48, 36);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * TravelCruiseFlames renders active engine thrust plumes during space transit.
 */
function TravelCruiseFlames() {
  const flameRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (flameRef.current) {
      const flicker = 0.9 + Math.random() * 0.25;
      flameRef.current.scale.set(1, flicker, 1);
    }
  });

  return (
    <group ref={flameRef} position={[0, 0, 0]}>
      {[-0.44, 0.44].map((x, i) => (
        <group key={i} position={[x, 1.12, -1.6]}>
          <group rotation={[Math.PI / 2 + 0.1, 0, 0]}>
            <mesh position={[0, -0.7, 0]}>
              <coneGeometry args={[0.2, 1.4, 12]} />
              <meshStandardMaterial
                color="#06b6d4"
                emissive="#0ea5e9"
                emissiveIntensity={2.8}
                transparent
                opacity={0.9}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[0, -0.4, 0]}>
              <coneGeometry args={[0.1, 0.8, 10]} />
              <meshBasicMaterial color="#fef08a" transparent opacity={0.95} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

/**
 * TravelController renders the 3D space scene between Earth and the Moon:
 * - Spaceship cruising steadily forward with active ion/plasma thrusters
 * - Fast starfield motion
 * - Receding Earth globe behind the ship
 * - Approaching and enlarging Moon globe directly ahead
 * - Smooth frame-rate independent progress updates
 */
export default function TravelController({
  onProgressUpdate,
  onTravelComplete,
}: TravelControllerProps) {
  const shipGroupRef = useRef<THREE.Group>(null);
  const moonMeshRef = useRef<THREE.Mesh>(null);
  const earthMeshRef = useRef<THREE.Mesh>(null);

  const elapsedSeconds = useRef(0);
  const isFinished = useRef(false);

  const moonTexture = useMemo(() => createTravelMoonTexture(), []);

  useEffect(() => {
    return () => moonTexture.dispose();
  }, [moonTexture]);

  useFrame((state, delta) => {
    if (isFinished.current) return;

    elapsedSeconds.current += delta;
    const progress = Math.min(
      1.0,
      elapsedSeconds.current / TRAVEL_CONFIG.travelDurationSeconds
    );

    onProgressUpdate(progress);

    // 1. Gentle aerodynamic cruise sway on the spaceship
    if (shipGroupRef.current) {
      const swayY = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.04;
      const swayRoll = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.02;
      shipGroupRef.current.position.y = TRAVEL_CONFIG.spaceship.position[1] + swayY;
      shipGroupRef.current.rotation.z = swayRoll;
    }

    // 2. Approaching Moon: Interpolates from Z = -140 to Z = -20, scaling from 1.2 to 7.5
    if (moonMeshRef.current) {
      const { startZ, endZ, startScale, endScale, x, y } = TRAVEL_CONFIG.moon;
      const currentZ = THREE.MathUtils.lerp(startZ, endZ, progress);
      const currentScale = THREE.MathUtils.lerp(startScale, endScale, progress);

      moonMeshRef.current.position.set(x, y, currentZ);
      moonMeshRef.current.scale.set(currentScale, currentScale, currentScale);
      moonMeshRef.current.rotation.y += delta * 0.05;
    }

    // 3. Receding Earth: Interpolates from Z = 25 to Z = 90, scaling from 7.0 to 1.6
    if (earthMeshRef.current) {
      const { startZ, endZ, startScale, endScale, x, y } = TRAVEL_CONFIG.earth;
      const currentZ = THREE.MathUtils.lerp(startZ, endZ, progress);
      const currentScale = THREE.MathUtils.lerp(startScale, endScale, progress);

      earthMeshRef.current.position.set(x, y, currentZ);
      earthMeshRef.current.scale.set(currentScale, currentScale, currentScale);
      earthMeshRef.current.rotation.y += delta * 0.02;
    }

    // 4. Check for travel completion
    if (progress >= 1.0 && !isFinished.current) {
      isFinished.current = true;
      onTravelComplete();
    }
  });

  return (
    <group>
      {/* Deep Space Background Void */}
      <color attach="background" args={['#020409']} />

      {/* High-speed Warp Stars */}
      <Stars
        radius={70}
        depth={60}
        count={TRAVEL_CONFIG.starfield.count}
        factor={5}
        saturation={0.5}
        speed={TRAVEL_CONFIG.starfield.speedFactor}
        fade
      />

      {/* Directional Space Sunlight illuminating the spaceship and celestial bodies */}
      <directionalLight position={[15, 12, 10]} intensity={2.0} color="#fffbeb" />
      <ambientLight intensity={0.35} color="#93c5fd" />

      {/* Receding Earth in the distance behind the ship */}
      <mesh ref={earthMeshRef} position={[TRAVEL_CONFIG.earth.x, TRAVEL_CONFIG.earth.y, TRAVEL_CONFIG.earth.startZ]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#2563eb" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Approaching Moon directly ahead */}
      <mesh ref={moonMeshRef} position={[TRAVEL_CONFIG.moon.x, TRAVEL_CONFIG.moon.y, TRAVEL_CONFIG.moon.startZ]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial map={moonTexture} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Cruising Spaceship with active engine flames */}
      <group
        ref={shipGroupRef}
        position={TRAVEL_CONFIG.spaceship.position}
        rotation={TRAVEL_CONFIG.spaceship.rotation}
      >
        <Spaceship position={[0, 0, 0]} rotation={[0, 0, 0]} />
        <TravelCruiseFlames />
      </group>
    </group>
  );
}

