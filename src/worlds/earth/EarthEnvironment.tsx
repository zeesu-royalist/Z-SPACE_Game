import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { EARTH_CONFIG } from './earth.config';

/**
 * LaunchPlatform component creates the stylized rocket launch pad:
 * - Octagonal/circular beveled base
 * - Concentric guidance circles and hazard perimeter
 * - 4 launch pad perimeter floodlights
 */
function LaunchPlatform() {
  const { padRadius, padHeight, padColor, padAccentColor } = EARTH_CONFIG.launchSite;

  return (
    <group position={[0, padHeight / 2, 0]}>
      {/* Main launch pad base platform */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[padRadius, padRadius * 1.05, padHeight, 32]} />
        <meshStandardMaterial color={padColor} roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Outer perimeter warning border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, padHeight / 2 + 0.002, 0]}>
        <ringGeometry args={[padRadius * 0.88, padRadius * 0.96, 32]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.5} />
      </mesh>

      {/* Inner landing / launch guidance ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, padHeight / 2 + 0.003, 0]}>
        <ringGeometry args={[padRadius * 0.5, padRadius * 0.56, 32]} />
        <meshStandardMaterial color={padAccentColor} roughness={0.4} />
      </mesh>

      {/* Center docking / rocket mount crosshair disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, padHeight / 2 + 0.004, 0]}>
        <circleGeometry args={[padRadius * 0.22, 24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>

      {/* 4 Perimeter floodlight beacons */}
      {[
        [padRadius * 0.9, 0, padRadius * 0.9],
        [-padRadius * 0.9, 0, padRadius * 0.9],
        [padRadius * 0.9, 0, -padRadius * 0.9],
        [-padRadius * 0.9, 0, -padRadius * 0.9],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x * 0.85, y, z * 0.85]}>
          {/* Post */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 0.5, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Glowing beacon cap */}
          <mesh position={[0, 0.52, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={1.2}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Low-poly stylized communications gantry tower and radar dish.
 */
function LaunchGantry() {
  const beaconRef = useRef<THREE.Mesh>(null);

  // Pulse the red warning light on top of the tower
  useFrame(({ clock }) => {
    if (beaconRef.current) {
      const material = beaconRef.current.material as THREE.MeshStandardMaterial;
      const pulse = (Math.sin(clock.getElapsedTime() * 4) + 1) * 0.5;
      material.emissiveIntensity = 0.5 + pulse * 1.5;
    }
  });

  return (
    <group position={[-4.5, 0, -2]}>
      {/* Tower base */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.9, 0.4, 0.9]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Main vertical lattice tower */}
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[0.5, 3.6, 0.5]} />
        <meshStandardMaterial color="#475569" wireframe={false} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Horizontal walkway / service gantry arm */}
      <mesh position={[0.7, 3.2, 0]}>
        <boxGeometry args={[1.0, 0.15, 0.4]} />
        <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Top antenna mast */}
      <mesh position={[0, 4.3, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 1.2, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Flashing aviation red beacon */}
      <mesh ref={beaconRef} position={[0, 4.95, 0]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#dc2626"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>

      {/* Communications / radar dish */}
      <group position={[0.4, 3.9, 0.3]} rotation={[0.4, 0.6, -0.3]}>
        <mesh>
          <sphereGeometry args={[0.5, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f1f5f9" side={THREE.DoubleSide} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Solar power generator unit stationed at the perimeter.
 */
function PowerUnit() {
  return (
    <group position={[4.2, 0, -1.6]} rotation={[0, -0.4, 0]}>
      {/* Foundation */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.8]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      {/* Angled Solar Panel */}
      <mesh position={[0, 0.7, 0]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[1.6, 0.06, 1.1]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Support mast */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} />
      </mesh>
    </group>
  );
}

/**
 * Low-poly stylized decorative rocks scattered naturally on the terrain.
 */
function DecorativeRocks() {
  const rocksData = [
    { pos: [-3.2, 0.25, 2.8] as const, scale: [0.7, 0.5, 0.6] as const, rot: [0.2, 0.8, 0.1] as const },
    { pos: [-4.0, 0.2, 2.1] as const, scale: [0.45, 0.4, 0.4] as const, rot: [0.5, 0.1, 0.7] as const },
    { pos: [3.8, 0.3, 2.4] as const, scale: [0.8, 0.6, 0.7] as const, rot: [0.4, 0.3, 0.5] as const },
    { pos: [4.6, 0.18, 1.7] as const, scale: [0.4, 0.35, 0.4] as const, rot: [0.1, 0.9, 0.3] as const },
    { pos: [1.2, 0.15, -4.2] as const, scale: [0.6, 0.45, 0.5] as const, rot: [0.7, 0.2, 0.4] as const },
    { pos: [-2.1, 0.2, -4.0] as const, scale: [0.5, 0.4, 0.5] as const, rot: [0.3, 0.6, 0.8] as const },
  ];

  return (
    <group>
      {rocksData.map((rock, index) => (
        <mesh
          key={index}
          position={rock.pos}
          rotation={rock.rot}
          scale={rock.scale}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color="#475569" roughness={0.85} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/**
 * EarthEnvironment renders the local Earth launch environment:
 * - Flat-shaded low-poly terrain plateau blending into the planetary curve
 * - The launch platform and guidance markings
 * - Launch gantry tower and power unit
 * - Decorative low-poly rocks
 * - Directional sunlight, ambient light, rim light, and background stars
 */
export default function EarthEnvironment() {
  const { terrainRadius, terrainHeight, terrainColor } = EARTH_CONFIG.launchSite;
  const { sunPosition, sunColor, sunIntensity, ambientColor, ambientIntensity, rimLightPosition, rimLightColor, rimLightIntensity } =
    EARTH_CONFIG.lighting;
  const { starsRadius, starsDepth, starsCount, starsSpeed } = EARTH_CONFIG.space;

  return (
    <>
      {/* Background Deep Space Stars */}
      <Stars
        radius={starsRadius}
        depth={starsDepth}
        count={starsCount}
        factor={4}
        saturation={0.5}
        fade
        speed={starsSpeed}
      />

      {/* Main Directional Sun Lighting */}
      <directionalLight
        position={sunPosition}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
      />

      {/* Soft Ambient Daylight */}
      <ambientLight color={ambientColor} intensity={ambientIntensity} />

      {/* Space Rim Back-Light (soft atmospheric blue accent) */}
      <directionalLight
        position={rimLightPosition}
        color={rimLightColor}
        intensity={rimLightIntensity}
      />

      {/* Surrounding Ground Terrain Plateau */}
      <group position={[0, -terrainHeight / 2, 0]}>
        {/* Main upper launch terrain */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[terrainRadius, terrainRadius * 1.15, terrainHeight, 24]} />
          <meshStandardMaterial
            color={terrainColor}
            roughness={0.85}
            flatShading
          />
        </mesh>

        {/* Lower transitional terrain layer */}
        <mesh receiveShadow position={[0, -terrainHeight * 0.6, 0]}>
          <cylinderGeometry args={[terrainRadius * 1.12, terrainRadius * 1.3, terrainHeight * 0.8, 20]} />
          <meshStandardMaterial
            color="#142820"
            roughness={0.9}
            flatShading
          />
        </mesh>
      </group>

      {/* Launch Platform */}
      <LaunchPlatform />

      {/* Launch Support Gantry & Communication Tower */}
      <LaunchGantry />

      {/* Solar Power & Support Facility */}
      <PowerUnit />

      {/* Decorative Low-poly Terrain Boulders */}
      <DecorativeRocks />
    </>
  );
}

