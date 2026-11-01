import * as THREE from 'three';
import { SPACESHIP_CONFIG } from './spaceship.config';

export interface SpaceshipProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
}

/**
 * Spaceship component renders a low-poly stylized space exploration vehicle:
 * - Rounded aerodynamic fuselage with nose cap and heat shield
 * - Cockpit canopy with dark reflective blue glass
 * - Swept stabilizing delta wings with wingtip navigation lights
 * - Quad hydraulic landing legs with touchdown footpads
 * - Twin rear propulsion rocket bells with static cyan engine glow
 * - Dorsal vertical stabilizer fin and RCS maneuvering thruster blocks
 */
export default function Spaceship({
  position = SPACESHIP_CONFIG.defaultPosition,
  rotation = SPACESHIP_CONFIG.defaultRotation,
  scale = SPACESHIP_CONFIG.dimensions.scale,
}: SpaceshipProps) {
  const { colors, materials } = SPACESHIP_CONFIG;

  const resolvedScale: [number, number, number] = Array.isArray(scale)
    ? scale
    : [scale, scale, scale];

  return (
    <group position={position} rotation={rotation} scale={resolvedScale}>
      {/* -------------------- 1. LANDING GEAR (4 LEGS & PADS) -------------------- */}
      {/* Front-Left Leg */}
      <group position={[-0.95, 0, 1.05]}>
        {/* Footpad */}
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <cylinderGeometry args={[0.22, 0.25, 0.08, 16]} />
          <meshStandardMaterial color={colors.landingPads} roughness={0.7} metalness={0.4} />
        </mesh>
        {/* Angled Piston Strut */}
        <mesh position={[0.2, 0.48, -0.22]} rotation={[0.4, 0, -0.38]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 1.05, 8]} />
          <meshStandardMaterial color={colors.landingStruts} metalness={materials.strutsMetalness} roughness={materials.strutsRoughness} />
        </mesh>
      </group>

      {/* Front-Right Leg */}
      <group position={[0.95, 0, 1.05]}>
        {/* Footpad */}
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <cylinderGeometry args={[0.22, 0.25, 0.08, 16]} />
          <meshStandardMaterial color={colors.landingPads} roughness={0.7} metalness={0.4} />
        </mesh>
        {/* Angled Piston Strut */}
        <mesh position={[-0.2, 0.48, -0.22]} rotation={[0.4, 0, 0.38]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 1.05, 8]} />
          <meshStandardMaterial color={colors.landingStruts} metalness={materials.strutsMetalness} roughness={materials.strutsRoughness} />
        </mesh>
      </group>

      {/* Rear-Left Leg */}
      <group position={[-1.1, 0, -0.95]}>
        {/* Footpad */}
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <cylinderGeometry args={[0.24, 0.27, 0.08, 16]} />
          <meshStandardMaterial color={colors.landingPads} roughness={0.7} metalness={0.4} />
        </mesh>
        {/* Angled Piston Strut */}
        <mesh position={[0.25, 0.5, 0.2]} rotation={[-0.35, 0, -0.42]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 1.1, 8]} />
          <meshStandardMaterial color={colors.landingStruts} metalness={materials.strutsMetalness} roughness={materials.strutsRoughness} />
        </mesh>
      </group>

      {/* Rear-Right Leg */}
      <group position={[1.1, 0, -0.95]}>
        {/* Footpad */}
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <cylinderGeometry args={[0.24, 0.27, 0.08, 16]} />
          <meshStandardMaterial color={colors.landingPads} roughness={0.7} metalness={0.4} />
        </mesh>
        {/* Angled Piston Strut */}
        <mesh position={[-0.25, 0.5, 0.2]} rotation={[-0.35, 0, 0.42]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 1.1, 8]} />
          <meshStandardMaterial color={colors.landingStruts} metalness={materials.strutsMetalness} roughness={materials.strutsRoughness} />
        </mesh>
      </group>

      {/* -------------------- 2. MAIN FUSELAGE HULL -------------------- */}
      {/* Central Aerodynamic Body */}
      <mesh position={[0, 1.15, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.76, 0.92, 2.4, 16]} />
        <meshStandardMaterial
          color={colors.hullPrimary}
          roughness={materials.hullRoughness}
          metalness={materials.hullMetalness}
        />
      </mesh>

      {/* Forward Tapered Nose Section */}
      <mesh position={[0, 1.15, 1.7]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.76, 1.0, 16]} />
        <meshStandardMaterial
          color={colors.hullPrimary}
          roughness={materials.hullRoughness}
          metalness={materials.hullMetalness}
        />
      </mesh>

      {/* Rounded Nose Cap */}
      <mesh position={[0, 1.15, 2.2]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <sphereGeometry args={[0.26, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={colors.heatShield} roughness={0.6} />
      </mesh>

      {/* Underside Ceramic Heat Shield Plate */}
      <mesh position={[0, 0.78, 0.1]} receiveShadow>
        <boxGeometry args={[1.25, 0.14, 2.8]} />
        <meshStandardMaterial color={colors.heatShield} roughness={0.8} />
      </mesh>

      {/* Dorsal Spine Racing Stripe */}
      <mesh position={[0, 1.63, 0.1]}>
        <boxGeometry args={[0.16, 0.04, 2.4]} />
        <meshStandardMaterial color={colors.accentBlue} roughness={0.4} />
      </mesh>

      {/* -------------------- 3. COCKPIT CANOPY & WINDOWS -------------------- */}
      {/* Cockpit Canopy Bubble */}
      <group position={[0, 1.48, 0.95]} rotation={[-0.42, 0, 0]}>
        {/* Dark Blue Glass */}
        <mesh castShadow>
          <sphereGeometry args={[0.42, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial
            color={colors.cockpitGlass}
            roughness={materials.cockpitRoughness}
            metalness={materials.cockpitMetalness}
          />
        </mesh>
        {/* Canopy Structural Frame */}
        <mesh position={[0, 0.02, 0]}>
          <ringGeometry args={[0.41, 0.45, 16]} />
          <meshStandardMaterial color={colors.canopyFrame} roughness={0.5} />
        </mesh>
      </group>

      {/* Port & Starboard Observation Windows */}
      <mesh position={[-0.76, 1.25, 0.3]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial color={colors.cockpitGlass} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.76, 1.25, 0.3]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial color={colors.cockpitGlass} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* -------------------- 4. WINGS & STABILIZERS -------------------- */}
      {/* Port Wing (Left) */}
      <group position={[-1.35, 1.05, -0.3]}>
        <mesh rotation={[-0.05, 0.18, 0.08]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.09, 1.6]} />
          <meshStandardMaterial color={colors.hullSecondary} roughness={materials.hullRoughness} metalness={materials.hullMetalness} />
        </mesh>
        {/* Left Vertical Winglet */}
        <mesh position={[-0.6, 0.28, -0.1]} rotation={[0, 0, -0.15]} castShadow>
          <boxGeometry args={[0.07, 0.55, 0.9]} />
          <meshStandardMaterial color={colors.accentBlue} roughness={0.4} />
        </mesh>
        {/* Red Port Navigation Light */}
        <mesh position={[-0.64, 0.58, -0.1]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color={colors.beaconRed} emissive={colors.beaconRed} emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
      </group>

      {/* Starboard Wing (Right) */}
      <group position={[1.35, 1.05, -0.3]}>
        <mesh rotation={[-0.05, -0.18, -0.08]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.09, 1.6]} />
          <meshStandardMaterial color={colors.hullSecondary} roughness={materials.hullRoughness} metalness={materials.hullMetalness} />
        </mesh>
        {/* Right Vertical Winglet */}
        <mesh position={[0.6, 0.28, -0.1]} rotation={[0, 0, 0.15]} castShadow>
          <boxGeometry args={[0.07, 0.55, 0.9]} />
          <meshStandardMaterial color={colors.accentBlue} roughness={0.4} />
        </mesh>
        {/* Green Starboard Navigation Light */}
        <mesh position={[0.64, 0.58, -0.1]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color={colors.beaconGreen} emissive={colors.beaconGreen} emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
      </group>

      {/* Dorsal Vertical Tail Stabilizer */}
      <group position={[0, 1.9, -0.75]}>
        <mesh rotation={[-0.25, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 0.65, 0.9]} />
          <meshStandardMaterial color={colors.hullPrimary} roughness={materials.hullRoughness} />
        </mesh>
        <mesh position={[0, 0.1, -0.1]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[0.09, 0.5, 0.2]} />
          <meshStandardMaterial color={colors.accentBlue} roughness={0.4} />
        </mesh>
      </group>

      {/* -------------------- 5. REAR PROPULSION & STATIC ENGINE GLOW -------------------- */}
      {/* Engine Bulkhead Aft Plate */}
      <mesh position={[0, 1.15, -1.22]}>
        <boxGeometry args={[1.5, 0.9, 0.1]} />
        <meshStandardMaterial color={colors.canopyFrame} roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Left Rocket Engine Bell */}
      <group position={[-0.44, 1.12, -1.45]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.2, 0.44, 16]} />
          <meshStandardMaterial
            color={colors.engineNozzle}
            roughness={materials.engineRoughness}
            metalness={materials.engineMetalness}
          />
        </mesh>
        {/* Static Cyan Ion Engine Glow Core */}
        <mesh position={[0, 0, -0.12]}>
          <circleGeometry args={[0.18, 16]} />
          <meshBasicMaterial
            color={colors.engineGlow}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Right Rocket Engine Bell */}
      <group position={[0.44, 1.12, -1.45]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.2, 0.44, 16]} />
          <meshStandardMaterial
            color={colors.engineNozzle}
            roughness={materials.engineRoughness}
            metalness={materials.engineMetalness}
          />
        </mesh>
        {/* Static Cyan Ion Engine Glow Core */}
        <mesh position={[0, 0, -0.12]}>
          <circleGeometry args={[0.18, 16]} />
          <meshBasicMaterial
            color={colors.engineGlow}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Upper Auxiliary Orbital Thruster */}
      <group position={[0, 1.48, -1.35]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.08, 0.22, 12]} />
          <meshStandardMaterial color={colors.engineNozzle} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, -0.06]}>
          <circleGeometry args={[0.07, 12]} />
          <meshBasicMaterial color={colors.accentCyan} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* -------------------- 6. SURFACE DETAILS & ACCENT LIGHTS -------------------- */}
      {/* Forward RCS Reaction Thruster Quads (Left & Right) */}
      <mesh position={[-0.74, 1.15, 1.3]}>
        <boxGeometry args={[0.06, 0.12, 0.16]} />
        <meshStandardMaterial color={colors.canopyFrame} metalness={0.8} />
      </mesh>
      <mesh position={[0.74, 1.15, 1.3]}>
        <boxGeometry args={[0.06, 0.12, 0.16]} />
        <meshStandardMaterial color={colors.canopyFrame} metalness={0.8} />
      </mesh>

      {/* Running Cyan Strip Lights along Lower Hull */}
      <mesh position={[-0.82, 0.95, 0.2]}>
        <boxGeometry args={[0.03, 0.03, 1.2]} />
        <meshStandardMaterial color={colors.accentCyan} emissive={colors.accentCyan} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <mesh position={[0.82, 0.95, 0.2]}>
        <boxGeometry args={[0.03, 0.03, 1.2]} />
        <meshStandardMaterial color={colors.accentCyan} emissive={colors.accentCyan} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
    </group>
  );
}

