import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BasicScene from './BasicScene';

interface GameCanvasProps {
  children?: React.ReactNode;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  enableOrbitControls?: boolean;
}

/**
 * Reusable GameCanvas component wrapping the React Three Fiber Canvas.
 * Manages responsive viewport sizing, perspective camera setup, and optional OrbitControls.
 */
export default function GameCanvas({
  children,
  cameraPosition = [0, 4.5, 9.5],
  cameraFov = 48,
  enableOrbitControls = true,
}: GameCanvasProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: cameraPosition, fov: cameraFov }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        className="w-full h-full block"
        shadows
      >
        <Suspense fallback={null}>
          {children ?? <BasicScene />}
          {enableOrbitControls && (
            <OrbitControls
              makeDefault
              enableDamping
              dampingFactor={0.05}
              minDistance={3}
              maxDistance={35}
              maxPolarAngle={Math.PI / 2 + 0.15}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
