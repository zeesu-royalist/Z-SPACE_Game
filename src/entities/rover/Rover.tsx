import { ROVER_CONFIG } from './rover.config';

export interface RoverProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  wheelRotation?: number;
  isOccupied?: boolean;
}

/**
 * Single rugged lunar wheel assembly with dynamic rotation around the rolling axis.
 */
function RoverWheel({
  x,
  y,
  z,
  isLeft,
  rotationX = 0,
}: {
  x: number;
  y: number;
  z: number;
  isLeft: boolean;
  rotationX?: number;
}) {
  const { wheelRadius, wheelWidth } = ROVER_CONFIG.dimensions;
  const { colors, materials } = ROVER_CONFIG;

  return (
    <group position={[x, y, z]}>
      {/* Rolling Wheel Assembly (rotates around X axis) */}
      <group rotation={[rotationX, 0, 0]}>
        {/* Outer rugged tire */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[wheelRadius, wheelRadius, wheelWidth, 16]} />
          <meshStandardMaterial
            color={colors.tires}
            roughness={materials.tireRoughness}
            metalness={materials.tireMetalness}
          />
        </mesh>

        {/* Titanium wheel hub rim */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry
            args={[wheelRadius * 0.6, wheelRadius * 0.6, wheelWidth * 1.05, 12]}
          />
          <meshStandardMaterial
            color={colors.wheelHubs}
            roughness={materials.rimRoughness}
            metalness={materials.rimMetalness}
          />
        </mesh>

        {/* Outer hubcap accent */}
        <mesh
          position={[isLeft ? -wheelWidth * 0.55 : wheelWidth * 0.55, 0, 0]}
          rotation={[0, isLeft ? -Math.PI / 2 : Math.PI / 2, 0]}
        >
          <circleGeometry args={[wheelRadius * 0.25, 12]} />
          <meshStandardMaterial color={colors.hubCaps} roughness={0.4} />
        </mesh>
      </group>

      {/* Static suspension / axle arm connecting to chassis */}
      <mesh
        position={[isLeft ? 0.12 : -0.12, 0.05, 0]}
        rotation={[0, 0, isLeft ? -0.3 : 0.3]}
      >
        <boxGeometry args={[0.22, 0.06, 0.08]} />
        <meshStandardMaterial color={colors.chassisSecondary} metalness={0.7} />
      </mesh>
    </group>
  );
}

/**
 * Seated Astronaut Pilot rendered inside the rover driver compartment.
 */
function SeatedAstronaut() {
  return (
    <group position={[0, 0.64, 0.06]}>
      {/* Torso */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <boxGeometry args={[0.38, 0.34, 0.28]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>

      {/* Life-support backpack */}
      <mesh position={[0, 0.18, -0.16]} castShadow>
        <boxGeometry args={[0.32, 0.36, 0.14]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
      </mesh>

      {/* Helmet */}
      <mesh position={[0, 0.44, 0.02]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* Gold/dark reflective visor */}
      <mesh position={[0, 0.45, 0.12]} rotation={[0.08, 0, 0]}>
        <sphereGeometry args={[0.14, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.08} />
      </mesh>

      {/* Left Arm holding steering control */}
      <mesh position={[-0.22, 0.12, 0.14]} rotation={[0.5, 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.28, 8]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Right Arm holding steering control */}
      <mesh position={[0.22, 0.12, 0.14]} rotation={[0.5, -0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.28, 8]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
    </group>
  );
}

/**
 * Low-poly stylized 3D Lunar Rover model:
 * - Four rugged off-road lunar wheels with dynamic rolling rotation
 * - Elevated chassis, driver cockpit, headlights, and solar panel
 * - Optional seated astronaut model when occupied
 */
export default function Rover({
  position = ROVER_CONFIG.defaultPosition,
  rotation = ROVER_CONFIG.defaultRotation,
  scale = ROVER_CONFIG.dimensions.scale,
  wheelRotation = 0,
  isOccupied = false,
}: RoverProps) {
  const { dimensions, colors, materials } = ROVER_CONFIG;
  const { trackWidth, wheelbase, wheelRadius } = dimensions;

  const resolvedScale: [number, number, number] = Array.isArray(scale)
    ? scale
    : [scale, scale, scale];

  const halfTrack = trackWidth / 2; // 0.72
  const halfBase = wheelbase / 2;   // 0.70

  return (
    <group position={position} rotation={rotation} scale={resolvedScale}>
      {/* -------------------- 1. FOUR RUGGED WHEELS -------------------- */}
      <RoverWheel x={-halfTrack} y={wheelRadius} z={halfBase} isLeft={true} rotationX={wheelRotation} />
      <RoverWheel x={halfTrack} y={wheelRadius} z={halfBase} isLeft={false} rotationX={wheelRotation} />
      <RoverWheel x={-halfTrack} y={wheelRadius} z={-halfBase} isLeft={true} rotationX={wheelRotation} />
      <RoverWheel x={halfTrack} y={wheelRadius} z={-halfBase} isLeft={false} rotationX={wheelRotation} />

      {/* -------------------- 2. MAIN CHASSIS BODY -------------------- */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.96, 0.22, 1.8]} />
        <meshStandardMaterial
          color={colors.chassisPrimary}
          roughness={materials.bodyRoughness}
          metalness={materials.bodyMetalness}
        />
      </mesh>

      {/* Undercarriage protective plate */}
      <mesh position={[0, 0.28, 0]} receiveShadow>
        <boxGeometry args={[0.82, 0.08, 1.65]} />
        <meshStandardMaterial color={colors.chassisUnder} roughness={0.8} />
      </mesh>

      {/* Front protective bumper / bullbar */}
      <mesh position={[0, 0.36, 0.96]} castShadow>
        <boxGeometry args={[1.15, 0.1, 0.1]} />
        <meshStandardMaterial color={colors.chassisSecondary} metalness={0.7} />
      </mesh>

      {/* Cyan trim side skirts */}
      <mesh position={[-0.49, 0.45, 0]}>
        <boxGeometry args={[0.03, 0.04, 1.5]} />
        <meshStandardMaterial color={colors.accentCyan} emissive={colors.accentCyan} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.49, 0.45, 0]}>
        <boxGeometry args={[0.03, 0.04, 1.5]} />
        <meshStandardMaterial color={colors.accentCyan} emissive={colors.accentCyan} emissiveIntensity={0.8} />
      </mesh>

      {/* -------------------- 3. COCKPIT / DRIVER COMPARTMENT -------------------- */}
      {/* Driver seat cushion */}
      <mesh position={[0, 0.58, 0.06]} castShadow>
        <boxGeometry args={[0.48, 0.1, 0.42]} />
        <meshStandardMaterial color={colors.seat} roughness={0.8} />
      </mesh>
      {/* Driver seat backrest */}
      <mesh position={[0, 0.82, -0.14]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.46, 0.42, 0.08]} />
        <meshStandardMaterial color={colors.seat} roughness={0.8} />
      </mesh>

      {/* Tubular roll-over protective cage */}
      <group position={[0, 0.98, -0.1]}>
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.78, 0.05, 0.05]} />
          <meshStandardMaterial color={colors.rollCage} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[-0.39, -0.22, 0]}>
          <boxGeometry args={[0.05, 0.75, 0.05]} />
          <meshStandardMaterial color={colors.rollCage} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.39, -0.22, 0]}>
          <boxGeometry args={[0.05, 0.75, 0.05]} />
          <meshStandardMaterial color={colors.rollCage} metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Control console / dashboard */}
      <group position={[0, 0.68, 0.44]}>
        <mesh rotation={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.22, 0.12]} />
          <meshStandardMaterial color={colors.chassisSecondary} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.06, 0.06]} rotation={[-0.4, 0, 0]}>
          <planeGeometry args={[0.28, 0.12]} />
          <meshStandardMaterial
            color={colors.accentCyan}
            emissive={colors.accentBlue}
            emissiveIntensity={0.9}
          />
        </mesh>
        <mesh position={[0, 0.1, 0.04]} rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[0.2, 0.03, 0.03]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* Seated Astronaut rendered only when occupied */}
      {isOccupied && <SeatedAstronaut />}

      {/* -------------------- 4. FRONT HEADLIGHTS -------------------- */}
      <group position={[-0.34, 0.44, 0.94]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 12]} />
          <meshStandardMaterial color={colors.headlightHousing} />
        </mesh>
        <mesh position={[0, 0, 0.052]}>
          <circleGeometry args={[0.07, 12]} />
          <meshStandardMaterial
            color={colors.headlightLens}
            emissive={colors.headlightEmissive}
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>
      </group>

      <group position={[0.34, 0.44, 0.94]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 12]} />
          <meshStandardMaterial color={colors.headlightHousing} />
        </mesh>
        <mesh position={[0, 0, 0.052]}>
          <circleGeometry args={[0.07, 12]} />
          <meshStandardMaterial
            color={colors.headlightLens}
            emissive={colors.headlightEmissive}
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* -------------------- 5. SOLAR PANEL (MOUNTED ON REAR) -------------------- */}
      <group position={[0, 0.92, -0.48]} rotation={[-0.2, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.88, 0.03, 0.68]} />
          <meshStandardMaterial color={colors.solarFrame} metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.82, 0.01, 0.62]} />
          <meshStandardMaterial color={colors.solarCells} roughness={materials.solarRoughness} metalness={materials.solarMetalness} />
        </mesh>
        <mesh position={[-0.35, -0.22, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.42, 6]} />
          <meshStandardMaterial color={colors.chassisSecondary} metalness={0.8} />
        </mesh>
        <mesh position={[0.35, -0.22, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.42, 6]} />
          <meshStandardMaterial color={colors.chassisSecondary} metalness={0.8} />
        </mesh>
      </group>

      {/* -------------------- 6. ANTENNA & SENSOR POD -------------------- */}
      <group position={[-0.38, 0.88, -0.74]}>
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.015, 0.025, 0.65, 8]} />
          <meshStandardMaterial color={colors.antennaMast} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      <group position={[0.32, 0.74, 0.48]}>
        <mesh castShadow>
          <boxGeometry args={[0.14, 0.12, 0.14]} />
          <meshStandardMaterial color={colors.chassisSecondary} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.072]}>
          <circleGeometry args={[0.04, 10]} />
          <meshStandardMaterial color={colors.sensorLens} emissive={colors.sensorLens} emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      </group>

      {/* -------------------- 7. REAR BATTERY / CARGO BAY -------------------- */}
      <mesh position={[0, 0.52, -0.52]} castShadow receiveShadow>
        <boxGeometry args={[0.74, 0.22, 0.52]} />
        <meshStandardMaterial color={colors.chassisSecondary} roughness={0.6} />
      </mesh>
      <mesh position={[0.28, 0.56, -0.79]}>
        <circleGeometry args={[0.02, 8]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
    </group>
  );
}
