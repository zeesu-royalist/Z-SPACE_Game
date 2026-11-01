import { MOON_CONFIG } from './moon.config';

/**
 * LunarCrater renders a single impact crater with:
 * - A raised outer lip/rim (torus)
 * - A depressed, shadowed crater bowl floor
 */
function LunarCrater({
  x,
  z,
  radius,
  rimHeight,
}: {
  x: number;
  z: number;
  radius: number;
  rimHeight: number;
}) {
  const { craterRimColor, craterFloorColor } = MOON_CONFIG.terrain;

  return (
    <group position={[x, 0, z]}>
      {/* Raised circular outer rim */}
      <mesh
        position={[0, rimHeight * 0.45, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <torusGeometry args={[radius, rimHeight * 0.55, 12, 28]} />
        <meshStandardMaterial
          color={craterRimColor}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* Recessed shadowed crater floor */}
      <mesh
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[radius * 0.95, 24]} />
        <meshStandardMaterial
          color={craterFloorColor}
          roughness={0.95}
        />
      </mesh>
    </group>
  );
}

/**
 * DistantMountainRing creates a jagged low-poly horizon
 * reminiscent of classic Apollo lunar mountain ranges.
 */
function DistantMountainRing() {
  const mountains = [
    { angle: 0, distance: 36, scale: [7, 6, 8] as const, rot: 0.2 },
    { angle: 0.45, distance: 38, scale: [9, 8, 10] as const, rot: 0.6 },
    { angle: 0.9, distance: 37, scale: [8, 7, 7] as const, rot: 1.1 },
    { angle: 1.4, distance: 35, scale: [10, 9, 11] as const, rot: 0.4 },
    { angle: 1.9, distance: 38, scale: [8, 6.5, 9] as const, rot: 0.9 },
    { angle: 2.4, distance: 36, scale: [11, 8.5, 10] as const, rot: 0.1 },
    { angle: 2.9, distance: 37, scale: [7, 6, 8] as const, rot: 1.4 },
    { angle: 3.4, distance: 35, scale: [9, 8, 9] as const, rot: 0.7 },
    { angle: 3.9, distance: 39, scale: [10, 7.5, 11] as const, rot: 0.3 },
    { angle: 4.4, distance: 36, scale: [8, 6.5, 8] as const, rot: 1.2 },
    { angle: 4.9, distance: 38, scale: [9, 8, 10] as const, rot: 0.5 },
    { angle: 5.5, distance: 37, scale: [11, 9, 12] as const, rot: 0.8 },
    { angle: 5.9, distance: 35, scale: [7, 6, 8] as const, rot: 1.5 },
  ];

  return (
    <group>
      {mountains.map((m, index) => {
        const x = Math.cos(m.angle) * m.distance;
        const z = Math.sin(m.angle) * m.distance;

        return (
          <mesh
            key={index}
            position={[x, m.scale[1] * 0.45, z]}
            rotation={[0, m.rot, 0]}
            scale={m.scale}
            castShadow
            receiveShadow
          >
            <coneGeometry args={[1, 1, 6]} />
            <meshStandardMaterial
              color="#27272a"
              roughness={0.95}
              flatShading
            />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * RockFormations renders stylized monolithic spires and rock outcroppings.
 */
function RockFormations() {
  return (
    <group>
      {/* North-West Spire Cluster */}
      <group position={[-10, 0, -16]}>
        <mesh position={[0, 1.8, 0]} rotation={[0.1, 0.4, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 3.6, 1.0]} />
          <meshStandardMaterial color="#52525b" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[1.2, 1.1, 0.4]} rotation={[-0.1, 0.8, 0.15]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 2.2, 0.8]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[-0.8, 0.6, 0.6]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial color="#475569" roughness={0.9} flatShading />
        </mesh>
      </group>

      {/* East Ridge Outcropping */}
      <group position={[20, 0, -2]}>
        <mesh position={[0, 1.2, 0]} rotation={[0.2, 0.5, -0.2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 2.2, 2.4, 6]} />
          <meshStandardMaterial color="#52525b" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[1.5, 0.6, -0.8]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.1, 0]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.9} flatShading />
        </mesh>
      </group>

      {/* South Boulder Ridge */}
      <group position={[10, 0, 22]}>
        <mesh position={[0, 0.9, 0]} rotation={[0.4, 0.2, 0.1]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial color="#52525b" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[-1.6, 0.5, 0.8]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial color="#475569" roughness={0.9} flatShading />
        </mesh>
      </group>
    </group>
  );
}

/**
 * ScatteredBoulders places varied low-poly rocks across the exploration zones.
 */
function ScatteredBoulders() {
  const boulders = [
    { pos: [5.2, 0.3, -4.5] as const, scale: 0.6, rot: [0.2, 0.7, 0.1] as const },
    { pos: [6.8, 0.25, -3.2] as const, scale: 0.45, rot: [0.5, 0.1, 0.4] as const },
    { pos: [-6.4, 0.4, 4.2] as const, scale: 0.8, rot: [0.3, 0.9, 0.2] as const },
    { pos: [-5.0, 0.2, 5.8] as const, scale: 0.5, rot: [0.1, 0.4, 0.7] as const },
    { pos: [8.5, 0.35, 7.8] as const, scale: 0.7, rot: [0.6, 0.3, 0.5] as const },
    { pos: [-12.2, 0.5, -2.5] as const, scale: 1.0, rot: [0.4, 0.8, 0.3] as const },
    { pos: [3.4, 0.2, 11.2] as const, scale: 0.55, rot: [0.2, 0.5, 0.8] as const },
    { pos: [-8.8, 0.3, -11.5] as const, scale: 0.65, rot: [0.7, 0.2, 0.3] as const },
  ];

  return (
    <group>
      {boulders.map((b, i) => (
        <mesh
          key={i}
          position={b.pos}
          rotation={b.rot}
          scale={[b.scale, b.scale * 0.85, b.scale]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#52525b"
            roughness={0.9}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * MoonTerrain composites:
 * - Base lunar plains ground
 * - Impact craters of multiple sizes
 * - Horizon mountain rim
 * - Landmark spires and scattered boulders
 */
export default function MoonTerrain() {
  const { groundColor, craters } = MOON_CONFIG.terrain;

  return (
    <group>
      {/* Primary Lunar Ground Plains */}
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <planeGeometry args={[80, 80, 24, 24]} />
        <meshStandardMaterial
          color={groundColor}
          roughness={0.92}
          metalness={0.05}
          flatShading
        />
      </mesh>

      {/* Predefined Lunar Impact Craters */}
      {craters.map((c) => (
        <LunarCrater
          key={c.id}
          x={c.x}
          z={c.z}
          radius={c.radius}
          rimHeight={c.rimHeight}
        />
      ))}

      {/* Monolithic Landmark Formations */}
      <RockFormations />

      {/* Natural Low-poly Boulder Clusters */}
      <ScatteredBoulders />

      {/* Distant Mountain Range encircling the lunar horizon */}
      <DistantMountainRing />
    </group>
  );
}
