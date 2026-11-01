import { useMemo } from 'react';
import * as THREE from 'three';

export interface RocketStackProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
}

/**
 * RocketStack component creates the iconic heavy-lift launch stack
 * featured in the reference image (Space Shuttle / SLS configuration):
 * - Massive central Orange External Tank (conical ogive nose, foam insulation orange)
 * - White Space Shuttle Orbiter mounted on the front (cockpit windows, delta wings with orange stripes, vertical stabilizer)
 * - Dual Solid Rocket Boosters (SRBs) on the left and right with nose cones and nozzles
 * - 4 Heavy-duty hold-down support posts clamping to the launch table
 */
export default function RocketStack({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: RocketStackProps) {
  const resolvedScale: [number, number, number] = useMemo(
    () => (Array.isArray(scale) ? scale : [scale, scale, scale]),
    [scale]
  );

  // Styling colors directly matching the reference image
  const colors = {
    // External Tank
    orangeTank: '#ea580c',        // Vibrant aerospace insulation foam orange
    orangeTankDark: '#c2410c',
    orangeTankAccent: '#9a3412',
    feedLine: '#cbd5e1',

    // Orbiter Shuttle
    shuttleWhite: '#f8fafc',
    shuttleUnderside: '#1e293b',  // Black heat shield tiles
    cockpitGlass: '#0f172a',
    shuttleOrange: '#ea580c',     // Wing accent stripes
    engineNozzle: '#475569',
    engineGlow: '#0284c7',

    // Solid Rocket Boosters (SRBs)
    boosterWhite: '#f1f5f9',
    boosterOrange: '#ea580c',
    boosterBands: '#334155',
    boosterNozzle: '#1e293b',

    // Hold-down supports
    steelPost: '#475569',
    steelClamp: '#1e293b',
  };

  return (
    <group position={position} rotation={rotation} scale={resolvedScale}>
      {/* ========================================================================= */}
      {/* 1. CENTRAL MASSIVE ORANGE EXTERNAL TANK (ET)                              */}
      {/* ========================================================================= */}
      <group position={[0, 4.8, -0.2]}>
        {/* Main Tank Cylindrical Body */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.05, 1.05, 7.2, 24]} />
          <meshStandardMaterial
            color={colors.orangeTank}
            roughness={0.65}
            metalness={0.15}
          />
        </mesh>

        {/* Ogive Conical Nose Cone */}
        <mesh position={[0, 4.35, 0]} castShadow>
          <coneGeometry args={[1.05, 1.5, 24]} />
          <meshStandardMaterial
            color={colors.orangeTank}
            roughness={0.6}
            metalness={0.15}
          />
        </mesh>

        {/* Extreme Nose Needle / Tip */}
        <mesh position={[0, 5.3, 0]}>
          <coneGeometry args={[0.2, 0.45, 12]} />
          <meshStandardMaterial
            color={colors.orangeTankDark}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>

        {/* Intertank Ribbed Band */}
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[1.07, 1.07, 0.5, 24]} />
          <meshStandardMaterial
            color={colors.orangeTankDark}
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>

        {/* Aft Dome / Skirt */}
        <mesh position={[0, -3.95, 0]}>
          <cylinderGeometry args={[1.05, 0.85, 0.7, 24]} />
          <meshStandardMaterial
            color={colors.orangeTankAccent}
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>

        {/* Pressurization Feedline running down the tank */}
        <mesh position={[0.78, 0, 0.7]}>
          <cylinderGeometry args={[0.045, 0.045, 6.8, 8]} />
          <meshStandardMaterial color={colors.feedLine} metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 2. WHITE SHUTTLE ORBITER (Mounted on the front, facing camera +Z)         */}
      {/* ========================================================================= */}
      <group position={[0, 4.5, 0.95]}>
        {/* Fuselage / Cabin Body */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.55, 0.58, 4.6, 16]} />
          <meshStandardMaterial
            color={colors.shuttleWhite}
            roughness={0.35}
            metalness={0.2}
          />
        </mesh>

        {/* Aerodynamic Cockpit Nose Section */}
        <mesh position={[0, 2.7, 0]} castShadow>
          <coneGeometry args={[0.55, 1.1, 16]} />
          <meshStandardMaterial
            color={colors.shuttleWhite}
            roughness={0.35}
            metalness={0.2}
          />
        </mesh>

        {/* Black Heat Shield Nose Tip */}
        <mesh position={[0, 3.2, 0.04]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial color={colors.cockpitGlass} roughness={0.8} />
        </mesh>

        {/* Cockpit Canopy Windows */}
        <mesh position={[0, 2.45, 0.42]} rotation={[-0.32, 0, 0]}>
          <boxGeometry args={[0.44, 0.22, 0.28]} />
          <meshStandardMaterial
            color={colors.cockpitGlass}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Left Delta Wing */}
        <group position={[-0.9, -0.6, 0]}>
          {/* Main Wing Body */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0.04]} castShadow>
            <boxGeometry args={[1.35, 0.1, 2.4]} />
            <meshStandardMaterial color={colors.shuttleWhite} roughness={0.4} />
          </mesh>
          {/* Orange Wing Leading Edge Stripe */}
          <mesh position={[-0.32, 0.02, 0.4]} rotation={[0, 0.35, 0]}>
            <boxGeometry args={[0.9, 0.11, 0.2]} />
            <meshStandardMaterial color={colors.shuttleOrange} roughness={0.5} />
          </mesh>
          {/* Wingtip Vertical Cant */}
          <mesh position={[-0.68, 0.18, -0.3]}>
            <boxGeometry args={[0.08, 0.38, 0.8]} />
            <meshStandardMaterial color={colors.shuttleWhite} roughness={0.4} />
          </mesh>
        </group>

        {/* Right Delta Wing */}
        <group position={[0.9, -0.6, 0]}>
          {/* Main Wing Body */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, -0.04]} castShadow>
            <boxGeometry args={[1.35, 0.1, 2.4]} />
            <meshStandardMaterial color={colors.shuttleWhite} roughness={0.4} />
          </mesh>
          {/* Orange Wing Leading Edge Stripe */}
          <mesh position={[0.32, 0.02, 0.4]} rotation={[0, -0.35, 0]}>
            <boxGeometry args={[0.9, 0.11, 0.2]} />
            <meshStandardMaterial color={colors.shuttleOrange} roughness={0.5} />
          </mesh>
          {/* Wingtip Vertical Cant */}
          <mesh position={[0.68, 0.18, -0.3]}>
            <boxGeometry args={[0.08, 0.38, 0.8]} />
            <meshStandardMaterial color={colors.shuttleWhite} roughness={0.4} />
          </mesh>
        </group>

        {/* Vertical Tail Stabilizer Fin */}
        <group position={[0, 0.8, -0.45]}>
          <mesh position={[0, 0.85, 0]} castShadow>
            <boxGeometry args={[0.08, 1.7, 1.1]} />
            <meshStandardMaterial color={colors.shuttleWhite} roughness={0.4} />
          </mesh>
          {/* Orange Tail Leading Edge */}
          <mesh position={[0, 0.95, 0.45]} rotation={[0.28, 0, 0]}>
            <boxGeometry args={[0.09, 1.5, 0.16]} />
            <meshStandardMaterial color={colors.shuttleOrange} roughness={0.5} />
          </mesh>
        </group>

        {/* Main SSME Engine Pod Base */}
        <mesh position={[0, -2.4, -0.2]}>
          <boxGeometry args={[0.85, 0.45, 0.65]} />
          <meshStandardMaterial color={colors.engineNozzle} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* 3 SSME Engine Bells (Triangular Cluster) */}
        {[
          [-0.24, -2.75, -0.15],
          [0.24, -2.75, -0.15],
          [0, -2.45, -0.35],
        ].map(([x, y, z], i) => (
          <group key={i} position={[x, y, z]}>
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.16, 0.11, 0.45, 12]} />
              <meshStandardMaterial
                color={colors.engineNozzle}
                metalness={0.8}
                roughness={0.25}
              />
            </mesh>
            {/* Glowing Engine Interior */}
            <mesh position={[0, -0.22, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.05, 12]} />
              <meshStandardMaterial
                color={colors.engineGlow}
                emissive={colors.engineGlow}
                emissiveIntensity={1.5}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 3. SOLID ROCKET BOOSTERS (SRBs) (Flanking Left and Right)                 */}
      {/* ========================================================================= */}
      {[-1.85, 1.85].map((xOffset, srbIndex) => (
        <group key={srbIndex} position={[xOffset, 4.4, -0.1]}>
          {/* Main Booster Cylindrical Body */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.44, 0.44, 8.2, 16]} />
            <meshStandardMaterial
              color={colors.boosterWhite}
              roughness={0.4}
              metalness={0.2}
            />
          </mesh>

          {/* Aerodynamic Forward Nose Cone */}
          <mesh position={[0, 4.65, 0]} castShadow>
            <coneGeometry args={[0.44, 1.1, 16]} />
            <meshStandardMaterial
              color={colors.boosterOrange}
              roughness={0.45}
              metalness={0.2}
            />
          </mesh>

          {/* Pointy Tip */}
          <mesh position={[0, 5.3, 0]}>
            <coneGeometry args={[0.12, 0.3, 8]} />
            <meshStandardMaterial color={colors.boosterBands} roughness={0.6} />
          </mesh>

          {/* Field Joint Ring Bands */}
          {[-2.0, -0.6, 0.8, 2.2, 3.6].map((yBand, bIdx) => (
            <mesh key={bIdx} position={[0, yBand, 0]}>
              <cylinderGeometry args={[0.455, 0.455, 0.14, 16]} />
              <meshStandardMaterial
                color={bIdx === 1 || bIdx === 3 ? colors.boosterOrange : colors.boosterBands}
                roughness={0.5}
                metalness={0.3}
              />
            </mesh>
          ))}

          {/* Aft Flared Skirt */}
          <mesh position={[0, -4.3, 0]}>
            <cylinderGeometry args={[0.44, 0.58, 0.5, 16]} />
            <meshStandardMaterial
              color={colors.boosterBands}
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>

          {/* Heavy Gimbaled Exhaust Bell */}
          <mesh position={[0, -4.75, 0]}>
            <cylinderGeometry args={[0.42, 0.28, 0.55, 16]} />
            <meshStandardMaterial
              color={colors.boosterNozzle}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Core nozzle glow */}
          <mesh position={[0, -5.02, 0]}>
            <circleGeometry args={[0.26, 16]} />
            <meshStandardMaterial
              color="#fb923c"
              emissive="#ea580c"
              emissiveIntensity={1.2}
            />
          </mesh>

          {/* Structural Struts Connecting Booster to Orange Tank */}
          <mesh position={[-Math.sign(xOffset) * 0.45, 1.5, -0.1]} rotation={[0, 0, Math.sign(xOffset) * 0.15]}>
            <boxGeometry args={[0.5, 0.16, 0.16]} />
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </mesh>
          <mesh position={[-Math.sign(xOffset) * 0.45, -2.5, -0.1]} rotation={[0, 0, -Math.sign(xOffset) * 0.15]}>
            <boxGeometry args={[0.5, 0.16, 0.16]} />
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 4. LAUNCH TABLE HOLD-DOWN CLAMPS & UMBILICAL MASTS                        */}
      {/* ========================================================================= */}
      {/* Left Booster Hold-down Post */}
      <group position={[-1.85, -0.6, -0.1]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.45, 0.8, 0.45]} />
          <meshStandardMaterial color={colors.steelPost} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[0.55, 0.15, 0.55]} />
          <meshStandardMaterial color={colors.steelClamp} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Right Booster Hold-down Post */}
      <group position={[1.85, -0.6, -0.1]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.45, 0.8, 0.45]} />
          <meshStandardMaterial color={colors.steelPost} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[0.55, 0.15, 0.55]} />
          <meshStandardMaterial color={colors.steelClamp} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Central Tail Service Umbilical Mast */}
      <group position={[0, -0.6, -0.9]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.8, 1.1, 0.5]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
