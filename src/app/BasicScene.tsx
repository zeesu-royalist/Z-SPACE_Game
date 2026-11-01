import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';

/**
 * BasicScene represents the initial testing 3D environment:
 * - A ground plane
 * - A centered placeholder cube (with gentle rotation to verify the render loop)
 * - Basic lighting (ambient + directional)
 * - A subtle grid helper for spatial depth
 */
export default function BasicScene() {
  const cubeRef = useRef<THREE.Mesh>(null);

  // Slowly rotate the placeholder cube to visually confirm the render loop
  useFrame((_, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta * 0.4;
      cubeRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <>
      {/* Background space/sky color */}
      <color attach="background" args={['#070a14']} />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 4]} intensity={1.2} />

      {/* Center placeholder cube for verification */}
      <mesh ref={cubeRef} position={[0, 1, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Grid helper for depth perception */}
      <gridHelper args={[24, 24, '#38bdf8', '#334155']} position={[0, 0.01, 0]} />
    </>
  );
}

