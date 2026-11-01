import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EARTH_CONFIG } from './earth.config';

/**
 * Procedural low-poly cumulus clouds drifting in the sunny daytime sky.
 */
function SkyClouds() {
  const cloudsRef = useRef<THREE.Group>(null);

  const cloudClusters = useMemo(() => {
    return [
      { x: -50, y: 35, z: -40, scale: 1.8 },
      { x: 30, y: 42, z: -60, scale: 2.2 },
      { x: 60, y: 38, z: 20, scale: 1.6 },
      { x: -20, y: 45, z: 50, scale: 2.0 },
      { x: 80, y: 36, z: -30, scale: 1.7 },
      { x: -70, y: 40, z: 10, scale: 2.4 },
    ];
  }, []);

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.003;
    }
  });

  return (
    <group ref={cloudsRef}>
      {cloudClusters.map((cluster, i) => (
        <group key={i} position={[cluster.x, cluster.y, cluster.z]} scale={cluster.scale}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[4.5, 8, 8]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[2.8, -0.6, 1.2]}>
            <sphereGeometry args={[3.2, 7, 7]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[-2.4, -0.4, -1.0]}>
            <sphereGeometry args={[3.0, 7, 7]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Perimeter tree rows lining the spaceport horizon.
 */
function SpaceportTrees() {
  const treePositions = useMemo(() => {
    const list: [number, number, number][] = [];
    const count = 55;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 1.8 + 0.2;
      const radius = 60 + (i % 5) * 6;
      list.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }
    return list;
  }, []);

  return (
    <group>
      {treePositions.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]} scale={0.9 + (i % 4) * 0.2}>
          {/* Trunk */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.22, 0.32, 2.4, 6]} />
            <meshStandardMaterial color="#5c3d28" roughness={0.9} />
          </mesh>
          {/* Foliage */}
          <mesh position={[0, 3.2, 0]}>
            <sphereGeometry args={[1.6, 7, 6]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#4d7c0f' : '#3f6212'}
              roughness={0.85}
              flatShading
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Tarmac crawlerway roads, perimeter runways, and access pathways.
 */
function SpaceportRoads() {
  return (
    <group position={[0, 0.02, 0]}>
      {/* Main wide crawlerway road leading to the pad from the front */}
      <mesh position={[0, 0, 35]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 60]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>

      {/* East-West Perimeter Taxiway Runway */}
      <mesh position={[0, 0, 22]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 7.5]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>

      {/* Diagonal Access Road Left */}
      <mesh position={[-25, 0, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 4]} receiveShadow>
        <planeGeometry args={[5, 70]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>

      {/* Diagonal Access Road Right */}
      <mesh position={[25, 0, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 4]} receiveShadow>
        <planeGeometry args={[5, 70]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>

      {/* Runway White/Yellow Markings */}
      <mesh position={[0, 0.03, 35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 55]} />
        <meshStandardMaterial color="#fef08a" roughness={0.5} />
      </mesh>
    </group>
  );
}

/**
 * Massive elevated concrete launchpad mount with angled flame trench ramps
 * and large stenciled yellow "01" runway apron marker.
 */
function ConcreteLaunchMound() {
  const { moundWidth, moundLength, moundHeight } = EARTH_CONFIG.launchPad;

  return (
    <group position={[0, 0, 0]}>
      {/* Central Elevated Concrete Mound Platform */}
      <mesh position={[0, moundHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[moundWidth, moundHeight, moundLength]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Left Sloping Flame Trench Deflector Ramp */}
      <mesh
        position={[-moundWidth / 2 - 2.8, moundHeight / 2 - 0.25, 0]}
        rotation={[0, 0, 0.55]}
        receiveShadow
      >
        <boxGeometry args={[6.5, 0.6, moundLength]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.75} />
      </mesh>

      {/* Right Sloping Flame Trench Deflector Ramp */}
      <mesh
        position={[moundWidth / 2 + 2.8, moundHeight / 2 - 0.25, 0]}
        rotation={[0, 0, -0.55]}
        receiveShadow
      >
        <boxGeometry args={[6.5, 0.6, moundLength]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.75} />
      </mesh>

      {/* Front Concrete Approach Ramp */}
      <mesh
        position={[0, moundHeight / 2 - 0.4, moundLength / 2 + 3.8]}
        rotation={[0.32, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[moundWidth, 0.5, 8.5]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>

      {/* Deep Center Flame Exhaust Trench Cutout */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[5.2, 1.4, moundLength * 0.85]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* Concrete Apron Surface with Seam Panels */}
      <mesh
        position={[0, moundHeight + 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[moundWidth - 0.4, moundLength - 0.4]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.6} />
      </mesh>

      {/* ========================================================================= */}
      {/* STENCILED YELLOW "01" LAUNCHPAD MARKING (Recreated from Reference Image) */}
      {/* ========================================================================= */}
      <group position={[0, moundHeight + 0.03, 6.5]}>
        {/* Yellow Guideline Bars */}
        <mesh position={[0, 0, 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.4, 0.25]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, -1.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.4, 0.25]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} />
        </mesh>

        {/* Digit '0': Outer Oval Border */}
        <mesh position={[-1.2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.4, 24]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} />
        </mesh>

        {/* Digit '1': Vertical Bar & Top Serifs */}
        <group position={[1.2, 0, 0]}>
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.55, 2.6]} />
            <meshStandardMaterial color="#eab308" roughness={0.4} />
          </mesh>
          <mesh position={[-0.32, 0, -0.9]} rotation={[-Math.PI / 2, 0, 0.6]}>
            <planeGeometry args={[0.45, 0.85]} />
            <meshStandardMaterial color="#eab308" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.5, 0.45]} />
            <meshStandardMaterial color="#eab308" roughness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/**
 * Mobile Launcher Platform (Industrial Steel Table with Yellow Safety Railings).
 */
function MobileLauncherTable() {
  const { tableWidth, tableLength, tableHeight, tableTopY } = EARTH_CONFIG.launchPad;

  return (
    <group position={[0, tableTopY - tableHeight / 2, 0]}>
      {/* Heavy Steel Support Box Platform */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[tableWidth, tableHeight, tableLength]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Top Deck Steel Plating */}
      <mesh
        position={[0, tableHeight / 2 + 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[tableWidth, tableLength]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Central Flame Hole Exhaust Opening */}
      <mesh position={[0, tableHeight / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 3.8]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* Perimeter Yellow Safety Railings (Front, Back, Left, Right) */}
      {[
        // Front railing
        { pos: [0, tableHeight / 2 + 0.4, tableLength / 2 - 0.1], size: [tableWidth - 0.4, 0.8, 0.06] },
        // Back railing
        { pos: [0, tableHeight / 2 + 0.4, -tableLength / 2 + 0.1], size: [tableWidth - 0.4, 0.8, 0.06] },
        // Left railing
        { pos: [-tableWidth / 2 + 0.1, tableHeight / 2 + 0.4, 0], size: [0.06, 0.8, tableLength - 0.4] },
        // Right railing
        { pos: [tableWidth / 2 - 0.1, tableHeight / 2 + 0.4, 0], size: [0.06, 0.8, tableLength - 0.4] },
      ].map((rail, idx) => (
        <group key={idx} position={rail.pos as [number, number, number]}>
          <mesh>
            <boxGeometry args={rail.size as [number, number, number]} />
            <meshStandardMaterial color="#facc15" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Under-table Heavy-duty Hydraulic Wheel Trucks / Crawler Pedestals */}
      {[
        [-tableWidth * 0.38, -tableHeight / 2 - 0.25, -tableLength * 0.38],
        [tableWidth * 0.38, -tableHeight / 2 - 0.25, -tableLength * 0.38],
        [-tableWidth * 0.38, -tableHeight / 2 - 0.25, tableLength * 0.38],
        [tableWidth * 0.38, -tableHeight / 2 - 0.25, tableLength * 0.38],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[1.5, 0.5, 1.5]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Tall Umbilical Launch Gantry Service Tower with Catwalks & Lightning Mast.
 */
function LaunchGantryTower() {
  const beaconRef = useRef<THREE.Mesh>(null);
  const { towerPosition, towerHeight, towerWidth } = EARTH_CONFIG.launchPad;

  useFrame(({ clock }) => {
    if (beaconRef.current) {
      const mat = beaconRef.current.material as THREE.MeshStandardMaterial;
      const pulse = (Math.sin(clock.getElapsedTime() * 5) + 1) * 0.5;
      mat.emissiveIntensity = 0.5 + pulse * 2.5;
    }
  });

  return (
    <group position={towerPosition}>
      {/* Main Structural Lattice Steel Tower Body */}
      <mesh position={[0, towerHeight / 2, 0]} castShadow>
        <boxGeometry args={[towerWidth, towerHeight, towerWidth]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Multi-Tier Catwalk Floors (Platforms) */}
      {[3.5, 6.8, 10.2, 13.5, 16.8].map((yLevel, i) => (
        <group key={i} position={[0, yLevel, 0]}>
          {/* Grated Platform Deck */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[towerWidth + 0.7, 0.16, towerWidth + 0.7]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.4} />
          </mesh>
          {/* Yellow Safety Railing */}
          <mesh position={[0, 0.45, (towerWidth + 0.7) / 2]}>
            <boxGeometry args={[towerWidth + 0.6, 0.7, 0.05]} />
            <meshStandardMaterial color="#facc15" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Swing-arm 1: Mid-core propellant feed umbilical arm */}
      <group position={[towerWidth / 2 + 0.9, 8.5, 0.5]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[1.8, 0.4, 0.5]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} />
        </mesh>
      </group>

      {/* Swing-arm 2: Shuttle Crew Access Arm & White Room */}
      <group position={[towerWidth / 2 + 1.2, 13.2, 0.6]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0.22, 0]}>
          <boxGeometry args={[2.4, 0.6, 0.7]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        {/* White Room Accordion Seal */}
        <mesh position={[1.3, 0, 0]}>
          <boxGeometry args={[0.5, 0.75, 0.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      </group>

      {/* Lightning Protection Arrester Mast (Tall Needle at Tower Apex) */}
      <group position={[0, towerHeight, 0]}>
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[0.08, 0.22, 4.4, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Red Aviation Warning Flashing Beacon */}
        <mesh ref={beaconRef} position={[0, 4.45, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#dc2626"
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Cryogenic spherical storage tanks and industrial support tanks.
 */
function CryogenicStorageTanks() {
  const { storageDomes } = EARTH_CONFIG.launchPad;

  return (
    <group>
      {storageDomes.map((dome, idx) => (
        <group key={idx} position={dome.position}>
          {/* Spherical Tank */}
          <mesh position={[0, dome.radius, 0]} castShadow>
            <sphereGeometry args={[dome.radius, 24, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.3} />
          </mesh>
          {/* Equatorial Catwalk Ring */}
          <mesh position={[0, dome.radius, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[dome.radius, dome.radius + 0.35, 24]} />
            <meshStandardMaterial color="#475569" metalness={0.6} />
          </mesh>
          {/* 6 Steel Support Legs */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i / 6) * Math.PI * 2;
            const r = dome.radius * 0.75;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * r, dome.radius * 0.45, Math.sin(angle) * r]}
              >
                <cylinderGeometry args={[0.1, 0.14, dome.radius * 0.9, 8]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

/**
 * High-intensity floodlight poles stationed around the launchpad perimeter.
 */
function PadFloodlights() {
  const lights = [
    [-11, 0, 12],
    [11, 0, 12],
    [-11, 0, -12],
    [11, 0, -12],
  ];

  return (
    <group>
      {lights.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          {/* Tall Light Pole */}
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.07, 0.12, 5.0, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </mesh>
          {/* Light Fixture Bank */}
          <mesh position={[0, 5.0, 0]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.8, 0.4, 0.2]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Glowing Lens */}
          <mesh position={[0, 4.95, 0.1]} rotation={[0.4, 0, 0]}>
            <planeGeometry args={[0.7, 0.3]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * SpaceportEnvironment aggregates the complete realistic Earth ground space center:
 * - Sunny blue sky & drifting clouds
 * - Green space center lawns and tarmac roads
 * - Raised concrete pad with flame trenches and yellow "01" marker
 * - Mobile launcher table with yellow railings
 * - Launch gantry tower with swing arms
 * - Cryogenic fuel spheres, trees, and perimeter floodlights
 */
export default function SpaceportEnvironment() {
  const { sky, terrain } = EARTH_CONFIG;

  return (
    <group>
      {/* -------------------- 1. LIGHTING & DAYLIGHT ATMOSPHERE -------------------- */}
      <ambientLight color={sky.ambientColor} intensity={sky.ambientIntensity} />
      <hemisphereLight
        color={sky.hemiSkyColor}
        groundColor={sky.hemiGroundColor}
        intensity={sky.hemiIntensity}
      />
      <directionalLight
        position={sky.sunPosition}
        intensity={sky.sunIntensity}
        color={sky.sunColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0005}
      />

      {/* Daytime Skybox Sphere with Atmospheric Horizon Gradient */}
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[180, 24, 24]} />
        <meshBasicMaterial color={sky.skyColor} side={THREE.BackSide} />
      </mesh>

      {/* Floating Cumulus Clouds in the Blue Sky */}
      <SkyClouds />

      {/* -------------------- 2. GROUND & TERRAIN -------------------- */}
      {/* Vast Green Spaceport Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[terrain.groundSize, terrain.groundSize]} />
        <meshStandardMaterial color={terrain.grassColor} roughness={0.9} />
      </mesh>

      {/* Tarmac Crawlerways & Runways */}
      <SpaceportRoads />

      {/* Perimeter Low-poly Trees */}
      <SpaceportTrees />

      {/* -------------------- 3. LAUNCHPAD STRUCTURES -------------------- */}
      {/* Concrete Mound with Flame Trenches & Stenciled "01" */}
      <ConcreteLaunchMound />

      {/* Mobile Launcher Steel Table Platform */}
      <MobileLauncherTable />

      {/* Steel Gantry Umbilical Service Tower */}
      <LaunchGantryTower />

      {/* White Cryogenic Storage Spheres */}
      <CryogenicStorageTanks />

      {/* Pad Perimeter Floodlights */}
      <PadFloodlights />
    </group>
  );
}

