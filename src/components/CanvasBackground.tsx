"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Subtle galaxy arm — elegant, non-distracting                            */
/* ────────────────────────────────────────────────────────────────────────── */
function Galaxy({
  count, color, size, radius, branches, spin, speed, opacity,
}: {
  count: number; color: string; size: number; radius: number;
  branches: number; spin: number; speed: number; opacity: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  const [positions] = useState(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * radius;
      const sa = r * spin;
      const ba = ((i % branches) * 2 * Math.PI) / branches;
      const scatter = 0.18;
      arr[i * 3]     = Math.cos(ba + sa) * r + Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * radius * scatter;
      arr[i * 3 + 1] =                         Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * radius * scatter;
      arr[i * 3 + 2] = Math.sin(ba + sa) * r + Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * radius * scatter;
    }
    return arr;
  });

  useFrame((_state, delta) => {
    if (!ref.current) return;
    timeRef.current += delta;
    ref.current.rotation.y -= delta * speed;
    // Gentle breathing motion using manual time accumulator
    ref.current.position.y = Math.sin(timeRef.current * 0.15) * 0.3;
  });

  return (
    <group rotation={[Math.PI / 6, 0, 0]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={color}
          size={size}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={opacity}
        />
      </Points>
    </group>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Export — fixed background, no layout interference                       */
/* ────────────────────────────────────────────────────────────────────────── */
export function CanvasBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.7,
        willChange: "transform",
      }}
    >
      <Canvas
        camera={{ position: [0, 5, 22], fov: 58 }}
        gl={{ antialias: false, powerPreference: "low-power", alpha: true }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Primary galaxy — soft blue */}
        <Galaxy count={2800} color="#007aff" size={0.045} radius={18} branches={3} spin={0.3} speed={0.035} opacity={0.55} />
        {/* Outer dust — very subtle white */}
        <Galaxy count={1200} color="#ffffff" size={0.025} radius={25} branches={4} spin={0.15} speed={0.02} opacity={0.3} />
        {/* Accent gold — sparse */}
        <Galaxy count={500} color="#fbb730" size={0.06} radius={12} branches={2} spin={0.4} speed={0.05} opacity={0.4} />
      </Canvas>

      {/* Smooth vignette overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/30 via-transparent to-brand-dark" style={{ zIndex: 1 }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, transparent 30%, rgba(0,2,10,0.6) 100%)", zIndex: 1 }} />
    </div>
  );
}
