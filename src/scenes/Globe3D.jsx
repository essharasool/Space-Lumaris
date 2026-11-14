import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function PlanetSphere({ planet = 'moon' }) {
  const meshRef = useRef();

  const isMars = planet === 'mars';
  const color = isMars ? '#b85333' : '#8a919e';
  const roughness = isMars ? 0.9 : 0.95;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={0.05}
      />
    </mesh>
  );
}

export default function Globe3D({ planet = 'moon' }) {
  const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isReduced) {
    return (
      <div className="w-full h-64 md:h-80 rounded-xl bg-[var(--surface)] border border-[var(--muted)]/20 flex items-center justify-center p-6 text-center">
        <span className="hud-label text-xs text-[var(--muted)]">
          Celestial Map ({planet.toUpperCase()}) — Reduced Motion Mode
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden relative border border-[var(--muted)]/20 bg-black/40">
      <div className="absolute top-3 left-3 z-10">
        <span className="hud-label text-[10px] text-zinc-400 bg-black/60 px-2 py-1 rounded">
          ORBITAL RADAR: {planet.toUpperCase()}
        </span>
      </div>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        frameloop="always"
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <PlanetSphere planet={planet} />
      </Canvas>
    </div>
  );
}
