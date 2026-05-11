"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Icosahedron, Points, PointMaterial } from "@react-three/drei";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// A subtle, on-brand 3D scene: a glassy wireframe icosahedron at center,
// surrounded by a structured particle lattice. Mouse parallax + gentle rotation.
export function HeroCanvas({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: "none" }}
      >
        <SceneContents />
      </Canvas>
    </div>
  );
}

function SceneContents() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Theme-aware colors
  const wireColor = isDark ? "#FAFAF9" : "#0F0F0E";
  const accentColor = isDark ? "#818CF8" : "#4F46E5";
  const particleColor = isDark ? "#818CF8" : "#4F46E5";

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={0.9} />
      <pointLight position={[-4, -3, -2]} intensity={0.5} color={accentColor} />

      {/* Center wireframe icosahedron */}
      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={0.6}>
        <Icosahedron args={[1.4, 1]}>
          <meshStandardMaterial
            color={wireColor}
            wireframe
            transparent
            opacity={0.45}
          />
        </Icosahedron>
        {/* Inner glow shell */}
        <Icosahedron args={[1.42, 2]}>
          <meshStandardMaterial
            color={accentColor}
            wireframe
            transparent
            opacity={0.18}
          />
        </Icosahedron>
      </Float>

      {/* Surrounding particle lattice */}
      <ParticleLattice color={particleColor} />

      {/* Mouse-following parallax */}
      <ParallaxRig />
    </>
  );
}

function ParticleLattice({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 1400;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // distribute in a spherical shell
      const r = 3 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.06;
    ref.current.rotation.x += delta * 0.02;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={color}
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={0.85}
      />
    </Points>
  );
}

function ParallaxRig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    const targetX = mouse.x * 0.35;
    const targetY = mouse.y * 0.25;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}
