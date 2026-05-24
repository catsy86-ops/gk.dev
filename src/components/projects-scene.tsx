import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ─── Particles ─── */
const Particles = ({ count }: { count: number }) => {
  const points = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.012;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.06) * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={points} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={count < 100 ? 0.032 : 0.024}
        color="hsl(217, 91%, 60%)"
        sizeAttenuation
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

/* ─── Floating wireframe boxes ─── */
const FloatingBoxes = ({ isMobile }: { isMobile: boolean }) => {
  const shapes = useMemo(
    () => [
      { pos: [-3.5, 1.5, -2.5] as const, rot: [0.3, 0.5, 0.2] as const, scale: 0.35, color: "hsl(217, 91%, 60%)", speed: 0.3 },
      { pos: [2.8, -1.0, -2] as const, rot: [0.5, 0.2, 0.3] as const, scale: 0.28, color: "hsl(262, 80%, 60%)", speed: 0.2 },
      { pos: [-1.0, -1.8, -3] as const, rot: [0.1, 0.8, 0.4] as const, scale: 0.22, color: "hsl(170, 60%, 55%)", speed: 0.35 },
      ...(isMobile
        ? []
        : [
            { pos: [3.2, 1.2, -1.5] as const, rot: [0.7, 0.1, 0.5] as const, scale: 0.3, color: "hsl(30, 90%, 60%)", speed: 0.25 },
            { pos: [0.5, 2.0, -3.5] as const, rot: [0.4, 0.3, 0.6] as const, scale: 0.18, color: "hsl(200, 80%, 58%)", speed: 0.4 },
          ]),
    ],
    [isMobile]
  );

  return (
    <>
      {shapes.map((shape, i) => (
        <Float key={i} speed={shape.speed} rotationIntensity={0.3} floatIntensity={0.4}>
          <mesh position={shape.pos} rotation={shape.rot} scale={shape.scale}>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshBasicMaterial
              color={shape.color}
              transparent
              opacity={0.035}
              wireframe
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
};

/* ─── Mouse follower group ─── */
const MouseFollower = ({ mouseRef, children }: { mouseRef: { current: { x: number; y: number } }; children: React.ReactNode }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouseRef.current.x * 1.0, 0.04);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, mouseRef.current.y * 0.7, 0.04);
  });
  return <group ref={groupRef}>{children}</group>;
};

/* ─── Scene ─── */
const Scene = ({
  isMobile,
  mouseRef,
}: {
  isMobile: boolean;
  mouseRef: { current: { x: number; y: number } };
}) => {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.05) * 0.5 + mouseRef.current.x * 0.4;
    state.camera.position.y = Math.cos(t * 0.04) * 0.3 + mouseRef.current.y * 0.3;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[3, 2, 3]} intensity={0.3} color="hsl(217, 91%, 60%)" />
      <Particles count={isMobile ? 50 : 90} />
      <MouseFollower mouseRef={mouseRef}>
        <FloatingBoxes isMobile={isMobile} />
      </MouseFollower>
    </>
  );
};

/* ─── Canvas wrapper ─── */
const ProjectsScene = ({
  isMobile,
  mouseRef,
}: {
  isMobile: boolean;
  mouseRef: { current: { x: number; y: number } };
}) => {
  return (
    <Canvas
      dpr={isMobile ? 1 : [1, 1.5]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 6], fov: 60, near: 0.1, far: 20 }}
      style={{ pointerEvents: "none", width: "100%", height: "100%" }}
    >
      <Scene isMobile={isMobile} mouseRef={mouseRef} />
    </Canvas>
  );
};

export default ProjectsScene;
