import { ASTRONAUT_CONFIG } from './astronaut.config';

export interface AstronautProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
}

/**
 * Low-poly stylized 3D Astronaut model:
 * - Rounded spacesuit helmet with reflective visor
 * - Torso with chest telemetry pack
 * - Life-support backpack (PLSS) with dual oxygen tanks
 * - Articulated arms with shoulder insignia and gloves
 * - Sturdy legs with knee protectors and lunar exploration boots
 */
export default function Astronaut({
  position = ASTRONAUT_CONFIG.defaultPosition,
  rotation = ASTRONAUT_CONFIG.defaultRotation,
  scale = ASTRONAUT_CONFIG.dimensions.scale,
}: AstronautProps) {
  const { colors, materials } = ASTRONAUT_CONFIG;

  const resolvedScale: [number, number, number] = Array.isArray(scale)
    ? scale
    : [scale, scale, scale];

  return (
    <group position={position} rotation={rotation} scale={resolvedScale}>
      {/* -------------------- BOOTS & FEET -------------------- */}
      {/* Left Boot */}
      <group position={[-0.22, 0.1, 0.04]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.24, 0.2, 0.36]} />
          <meshStandardMaterial
            color={colors.glovesAndBoots}
            roughness={materials.bootsRoughness}
            metalness={materials.bootsMetalness}
          />
        </mesh>
        {/* Sole tread accent */}
        <mesh position={[0, -0.09, 0]} receiveShadow>
          <boxGeometry args={[0.26, 0.04, 0.38]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      </group>

      {/* Right Boot */}
      <group position={[0.22, 0.1, 0.04]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.24, 0.2, 0.36]} />
          <meshStandardMaterial
            color={colors.glovesAndBoots}
            roughness={materials.bootsRoughness}
            metalness={materials.bootsMetalness}
          />
        </mesh>
        {/* Sole tread accent */}
        <mesh position={[0, -0.09, 0]} receiveShadow>
          <boxGeometry args={[0.26, 0.04, 0.38]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      </group>

      {/* -------------------- LEGS & KNEES -------------------- */}
      {/* Left Leg */}
      <group position={[-0.22, 0.46, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.12, 0.13, 0.52, 12]} />
          <meshStandardMaterial
            color={colors.suitBase}
            roughness={materials.suitRoughness}
            metalness={materials.suitMetalness}
          />
        </mesh>
        {/* Left Knee Guard */}
        <mesh position={[0, 0, 0.12]} castShadow>
          <boxGeometry args={[0.18, 0.16, 0.08]} />
          <meshStandardMaterial color={colors.suitJoints} roughness={0.7} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.22, 0.46, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.12, 0.13, 0.52, 12]} />
          <meshStandardMaterial
            color={colors.suitBase}
            roughness={materials.suitRoughness}
            metalness={materials.suitMetalness}
          />
        </mesh>
        {/* Right Knee Guard */}
        <mesh position={[0, 0, 0.12]} castShadow>
          <boxGeometry args={[0.18, 0.16, 0.08]} />
          <meshStandardMaterial color={colors.suitJoints} roughness={0.7} />
        </mesh>
      </group>

      {/* -------------------- PELVIS & BELT -------------------- */}
      <group position={[0, 0.76, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.56, 0.18, 0.36]} />
          <meshStandardMaterial
            color={colors.suitBase}
            roughness={materials.suitRoughness}
          />
        </mesh>
        {/* Utility Belt */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.58, 0.08, 0.38]} />
          <meshStandardMaterial color={colors.glovesAndBoots} roughness={0.7} />
        </mesh>
      </group>

      {/* -------------------- TORSO & CHEST PACK -------------------- */}
      <group position={[0, 1.15, 0]}>
        {/* Main Chest Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.62, 0.6, 0.4]} />
          <meshStandardMaterial
            color={colors.suitBase}
            roughness={materials.suitRoughness}
            metalness={materials.suitMetalness}
          />
        </mesh>

        {/* Chest Telemetry Pack / Control Panel */}
        <group position={[0, 0.04, 0.22]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.24, 0.08]} />
            <meshStandardMaterial color={colors.chestPanel} roughness={0.4} />
          </mesh>
          {/* Status Display Screen */}
          <mesh position={[0, 0.04, 0.042]}>
            <planeGeometry args={[0.22, 0.08]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0369a1"
              emissiveIntensity={0.6}
            />
          </mesh>
          {/* Green Status LED */}
          <mesh position={[-0.07, -0.05, 0.042]}>
            <circleGeometry args={[0.018, 12]} />
            <meshStandardMaterial
              color={colors.statusGreen}
              emissive={colors.statusGreen}
              emissiveIntensity={1.2}
            />
          </mesh>
          {/* Red Warning LED */}
          <mesh position={[0.07, -0.05, 0.042]}>
            <circleGeometry args={[0.018, 12]} />
            <meshStandardMaterial
              color={colors.statusRed}
              emissive={colors.statusRed}
              emissiveIntensity={1.2}
            />
          </mesh>
        </group>
      </group>

      {/* -------------------- BACKPACK (PLSS) -------------------- */}
      <group position={[0, 1.2, -0.26]}>
        {/* Main Life-support Box */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.52, 0.64, 0.24]} />
          <meshStandardMaterial
            color={colors.backpack}
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>

        {/* Left Oxygen Tank */}
        <group position={[-0.15, 0.08, -0.08]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.52, 12]} />
            <meshStandardMaterial
              color={colors.tanks}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
          {/* Valve Cap */}
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        </group>

        {/* Right Oxygen Tank */}
        <group position={[0.15, 0.08, -0.08]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.52, 12]} />
            <meshStandardMaterial
              color={colors.tanks}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
          {/* Valve Cap */}
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* -------------------- ARMS & GLOVES -------------------- */}
      {/* Left Arm */}
      <group position={[-0.41, 1.34, 0]}>
        {/* Shoulder Joint & Insignia */}
        <mesh castShadow>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial color={colors.suitBase} roughness={materials.suitRoughness} />
        </mesh>
        {/* Shoulder Rank Stripe */}
        <mesh position={[-0.04, 0, 0]}>
          <boxGeometry args={[0.08, 0.06, 0.16]} />
          <meshStandardMaterial color={colors.stripeAccent} />
        </mesh>
        {/* Arm Segment */}
        <mesh position={[-0.04, -0.22, 0.02]} rotation={[0.1, 0, 0.1]} castShadow>
          <cylinderGeometry args={[0.09, 0.1, 0.36, 12]} />
          <meshStandardMaterial color={colors.suitBase} roughness={materials.suitRoughness} />
        </mesh>
        {/* Left Glove */}
        <mesh position={[-0.08, -0.44, 0.05]} castShadow>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color={colors.glovesAndBoots} roughness={materials.bootsRoughness} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.41, 1.34, 0]}>
        {/* Shoulder Joint & Insignia */}
        <mesh castShadow>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial color={colors.suitBase} roughness={materials.suitRoughness} />
        </mesh>
        {/* Shoulder Rank Stripe */}
        <mesh position={[0.04, 0, 0]}>
          <boxGeometry args={[0.08, 0.06, 0.16]} />
          <meshStandardMaterial color={colors.stripeAccent} />
        </mesh>
        {/* Arm Segment */}
        <mesh position={[0.04, -0.22, 0.02]} rotation={[0.1, 0, -0.1]} castShadow>
          <cylinderGeometry args={[0.09, 0.1, 0.36, 12]} />
          <meshStandardMaterial color={colors.suitBase} roughness={materials.suitRoughness} />
        </mesh>
        {/* Right Glove */}
        <mesh position={[0.08, -0.44, 0.05]} castShadow>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color={colors.glovesAndBoots} roughness={materials.bootsRoughness} />
        </mesh>
      </group>

      {/* -------------------- HELMET & VISOR -------------------- */}
      <group position={[0, 1.72, 0]}>
        {/* Neck Seal Ring */}
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 0.08, 16]} />
          <meshStandardMaterial color={colors.suitJoints} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Rounded Outer Helmet Shell */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshStandardMaterial
            color={colors.suitBase}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>

        {/* Highly Reflective Dark Visor */}
        <mesh position={[0, 0.02, 0.13]} rotation={[0.05, 0, 0]} castShadow>
          <sphereGeometry args={[0.23, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial
            color={colors.visor}
            roughness={materials.visorRoughness}
            metalness={materials.visorMetalness}
          />
        </mesh>

        {/* Helmet Lamp (Left) */}
        <mesh position={[-0.28, 0.08, 0.1]}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 8]} />
          <meshStandardMaterial
            color={colors.beaconLight}
            emissive={colors.beaconLight}
            emissiveIntensity={1.5}
          />
        </mesh>

        {/* Helmet Lamp (Right) */}
        <mesh position={[0.28, 0.08, 0.1]}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 8]} />
          <meshStandardMaterial
            color={colors.beaconLight}
            emissive={colors.beaconLight}
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>
    </group>
  );
}

