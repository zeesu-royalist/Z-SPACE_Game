import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EARTH_CONFIG } from './earth.config';

/**
 * Creates a stylized procedural Earth texture using an in-memory 2D canvas.
 * Produces deep blue oceans, stylized green landmasses, and polar ice caps.
 */
function createProceduralEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // 1. Deep blue ocean base
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#172554');
  oceanGrad.addColorStop(0.5, '#1d4ed8');
  oceanGrad.addColorStop(1, '#172554');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Helper to draw stylized continent landmasses
  const drawLandBlob = (cx: number, cy: number, w: number, h: number) => {
    ctx.beginPath();
    // Coastal cyan glow
    ctx.ellipse(cx, cy, w * 1.12, h * 1.12, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#06b6d4';
    ctx.fill();

    // Main green landmass
    ctx.beginPath();
    ctx.ellipse(cx, cy, w, h, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#16a34a';
    ctx.fill();

    // Inner lush highlands
    ctx.beginPath();
    ctx.ellipse(cx + w * 0.1, cy - h * 0.1, w * 0.65, h * 0.65, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#15803d';
    ctx.fill();
  };

  // Stylized landmass groups evoking continents
  // Americas (Western Hemisphere)
  drawLandBlob(220, 160, 95, 65);
  drawLandBlob(200, 220, 60, 45);
  drawLandBlob(270, 320, 75, 110);
  drawLandBlob(290, 410, 45, 55);

  // Europe & Africa (Central Hemisphere)
  drawLandBlob(520, 150, 70, 50);
  drawLandBlob(540, 270, 90, 110);
  drawLandBlob(560, 350, 65, 80);

  // Asia & Oceania (Eastern Hemisphere)
  drawLandBlob(710, 150, 130, 85);
  drawLandBlob(780, 220, 105, 75);
  drawLandBlob(720, 290, 50, 45);
  drawLandBlob(820, 360, 70, 50); // Australia
  drawLandBlob(890, 390, 25, 20); // New Zealand

  // Additional island clusters
  drawLandBlob(380, 120, 35, 25); // Greenland
  drawLandBlob(880, 190, 20, 40); // Japan arc
  drawLandBlob(760, 310, 45, 20); // Indonesia arc

  // 2. Polar ice caps
  ctx.fillStyle = '#f8fafc';
  // North Pole
  ctx.beginPath();
  ctx.ellipse(512, 15, 512, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  // South Pole
  ctx.beginPath();
  ctx.ellipse(512, 495, 512, 45, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates a procedural cloud texture for the atmospheric layer.
 */
function createProceduralCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const drawCloudBand = (cx: number, cy: number, w: number, h: number, alpha: number) => {
    ctx.beginPath();
    ctx.ellipse(cx, cy, w, h, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fill();
  };

  // Swirling weather bands across the globe
  const cloudBands = [
    { x: 180, y: 130, w: 140, h: 25, a: 0.5 },
    { x: 360, y: 160, w: 180, h: 30, a: 0.4 },
    { x: 620, y: 120, w: 220, h: 35, a: 0.55 },
    { x: 880, y: 170, w: 160, h: 28, a: 0.45 },
    { x: 260, y: 260, w: 190, h: 28, a: 0.5 },
    { x: 520, y: 240, w: 170, h: 26, a: 0.45 },
    { x: 780, y: 270, w: 210, h: 30, a: 0.55 },
    { x: 190, y: 380, w: 150, h: 30, a: 0.45 },
    { x: 450, y: 390, w: 180, h: 32, a: 0.5 },
    { x: 740, y: 370, w: 190, h: 28, a: 0.4 },
  ];

  cloudBands.forEach((b) => drawCloudBand(b.x, b.y, b.w, b.h, b.a));

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * EarthPlanet renders the stylized 3D planet globe:
 * - Oceans & continents via procedural texture
 * - Rotating atmospheric cloud layer
 * - Soft luminous atmospheric rim glow
 */
export default function EarthPlanet() {
  const planetRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  const earthTexture = useMemo(() => createProceduralEarthTexture(), []);
  const cloudTexture = useMemo(() => createProceduralCloudTexture(), []);

  // Dispose textures on unmount to prevent GPU memory leaks
  useEffect(() => {
    return () => {
      earthTexture.dispose();
      cloudTexture.dispose();
    };
  }, [earthTexture, cloudTexture]);

  // Rotate planet and clouds
  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * EARTH_CONFIG.planet.rotationSpeed;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * EARTH_CONFIG.planet.cloudRotationSpeed;
    }
  });

  const { radius, position, cloudRadiusOffset, atmosphereRadiusOffset, atmosphereColor, atmosphereOpacity } =
    EARTH_CONFIG.planet;

  return (
    <group position={position}>
      {/* Rotating Planet Group (Continents + Ocean) */}
      <group ref={planetRef}>
        <mesh receiveShadow>
          <sphereGeometry args={[radius, 64, 64]} />
          <meshStandardMaterial
            map={earthTexture}
            roughness={EARTH_CONFIG.planet.oceanRoughness}
            metalness={EARTH_CONFIG.planet.oceanMetalness}
          />
        </mesh>
      </group>

      {/* Rotating Atmospheric Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[radius + cloudRadiusOffset, 48, 48]} />
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Atmospheric Outer Halo Glow */}
      <mesh>
        <sphereGeometry args={[radius + atmosphereRadiusOffset, 48, 48]} />
        <meshBasicMaterial
          color={atmosphereColor}
          transparent
          opacity={atmosphereOpacity}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

