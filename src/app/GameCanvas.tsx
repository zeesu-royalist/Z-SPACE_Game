import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BasicScene from './BasicScene';

interface GameCanvasProps {
  children?: React.ReactNode;
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
  cameraFov?: number;
  enableOrbitControls?: boolean;
}

/**
 * Reusable GameCanvas component wrapping the React Three Fiber Canvas.
 * Manages responsive viewport sizing, perspective camera setup, and optional OrbitControls.
 */
export default function GameCanvas({
  children,
  cameraPosition = [11.5, 14.5, 18.5],
  cameraTarget = [0, 5.5, 0],
  cameraFov = 45,
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
              target={cameraTarget}
              enableDamping
              dampingFactor={0.05}
              minDistance={4}
              maxDistance={55}
              maxPolarAngle={Math.PI / 2 - 0.04}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
