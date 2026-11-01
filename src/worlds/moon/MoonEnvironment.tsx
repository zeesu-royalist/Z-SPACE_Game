import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { MOON_CONFIG } from './moon.config';

/**
 * Creates a procedural Earth texture for the distant Earth in the Moon's sky.
 */
function createDistantEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Deep ocean gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#172554');
  oceanGrad.addColorStop(0.5, '#2563eb');
  oceanGrad.addColorStop(1, '#172554');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stylized land blobs
  const drawLand = (cx: number, cy: number, w: number, h: number) => {
    ctx.beginPath();
    ctx.ellipse(cx, cy, w * 1.1, h * 1.1, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#06b6d4';
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(cx, cy, w, h, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#16a34a';
    ctx.fill();
  };

  drawLand(110, 80, 48, 32);
  drawLand(135, 160, 38, 55);
  drawLand(260, 75, 35, 25);
  drawLand(270, 135, 45, 55);
  drawLand(360, 85, 65, 45);
  drawLand(410, 180, 35, 25);

  // Polar ice
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(256, 8, 256, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(256, 248, 256, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * DistantEarthSphere renders planet Earth as seen from the Moon's surface.
 */
function DistantEarth() {
  const earthRef = useRef<THREE.Group>(null);
  const { position, radius, rotationSpeed, atmosphereColor } = MOON_CONFIG.distantEarth;

  const texture = useMemo(() => createDistantEarthTexture(), []);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <group position={position}>
      {/* Rotating Earth Globe */}
      <group ref={earthRef}>
        <mesh>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* Atmospheric Glow Halo */}
      <mesh>
        <sphereGeometry args={[radius * 1.05, 32, 32]} />
        <meshBasicMaterial
          color={atmosphereColor}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/**
 * LandingSite marks the flat lunar landing clearing reserved for future
 * spaceship landing, astronaut egress, and rover parking.
 */
function LandingSite() {
  const { radius, height, baseColor, ringColor, markerColor, futureSlots } =
    MOON_CONFIG.landingZone;

  return (
    <group position={[0, height / 2, 0]}>
      {/* Flat circular landing base */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[radius, radius * 1.04, height, 32]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Outer landing perimeter ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, height / 2 + 0.002, 0]}>
        <ringGeometry args={[radius * 0.88, radius * 0.94, 32]} />
        <meshStandardMaterial color={ringColor} roughness={0.4} />
      </mesh>

      {/* Center spaceship touchdown bullseye */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, height / 2 + 0.003, 0]}>
        <ringGeometry args={[radius * 0.38, radius * 0.44, 32]} />
        <meshStandardMaterial color={markerColor} roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, height / 2 + 0.004, 0]}>
        <circleGeometry args={[radius * 0.18, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* Future Rover Bay parking marker zone */}
      <group position={futureSlots.roverParking}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <planeGeometry args={[1.6, 2.2]} />
          <meshStandardMaterial
            color="#0ea5e9"
            transparent
            opacity={0.25}
            roughness={0.5}
          />
        </mesh>
      </group>

      {/* Future Astronaut spawn platform marker */}
      <group position={futureSlots.astronautSpawn}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <circleGeometry args={[0.5, 16]} />
          <meshStandardMaterial
            color="#22c55e"
            transparent
            opacity={0.3}
            roughness={0.5}
          />
        </mesh>
      </group>

      {/* 4 Corner Navigation Beacon Pylons */}
      {[
        [radius * 0.82, 0, radius * 0.82],
        [-radius * 0.82, 0, radius * 0.82],
        [radius * 0.82, 0, -radius * 0.82],
        [-radius * 0.82, 0, -radius * 0.82],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          {/* Pylon post */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.05, 0.07, 0.6, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Cyan Beacon indicator */}
          <mesh position={[0, 0.62, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={1.8}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * MoonEnvironment renders:
 * - Distant Earth hanging in the black lunar sky
 * - Direct solar illumination and soft earthshine
 * - Deep space stars background
 * - The flat future landing zone
 */
export default function MoonEnvironment() {
  const { sunPosition, sunColor, sunIntensity, ambientColor, ambientIntensity, earthshinePosition, earthshineColor, earthshineIntensity } =
    MOON_CONFIG.lighting;
  const { starsRadius, starsDepth, starsCount, starsSpeed } = MOON_CONFIG.space;

  return (
    <>
      {/* Background Deep Space Stars */}
      <Stars
        radius={starsRadius}
        depth={starsDepth}
        count={starsCount}
        factor={4}
        saturation={0.4}
        fade
        speed={starsSpeed}
      />

      {/* Harsh Direct Solar Radiation */}
      <directionalLight
        position={sunPosition}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
      />

      {/* Soft Ambient Starlight */}
      <ambientLight color={ambientColor} intensity={ambientIntensity} />

      {/* Earthshine Fill Light (pale blue glow reflecting from Earth) */}
      <directionalLight
        position={earthshinePosition}
        color={earthshineColor}
        intensity={earthshineIntensity}
      />

      {/* Distant Earth visible in the sky */}
      <DistantEarth />

      {/* Clearly Identifiable Landing Platform */}
      <LandingSite />
    </>
  );
}

