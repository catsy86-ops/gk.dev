import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const Particles = ({ count }: { count: number }) => {
  const points = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={points} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={count < 100 ? 0.035 : 0.025}
        color="hsl(217, 91%, 60%)"
        sizeAttenuation
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const ConnectionLines = ({ count }: { count: number }) => {
  const nodeCount = Math.min(count, 60);
  const maxLines = 180;

  const nodes = useMemo(() => {
    const arr = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [nodeCount]);

  const linePositions = useMemo(() => new Float32Array(maxLines * 6), []);
  const lineColors = useMemo(() => new Float32Array(maxLines * 6), []);
  const colorA = useMemo(() => new THREE.Color("hsl(217, 91%, 60%)"), []);
  const colorB = useMemo(() => new THREE.Color("hsl(262, 80%, 60%)"), []);

  const ref = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    let lineIdx = 0;
    const threshold = 3.0;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = nodes[i * 3] - nodes[j * 3];
        const dy = nodes[i * 3 + 1] - nodes[j * 3 + 1];
        const dz = nodes[i * 3 + 2] - nodes[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < threshold && lineIdx < maxLines) {
          const pulse = 0.3 + Math.sin(t * 1.5 + i) * 0.12;
          const alpha = (1 - dist / threshold) * pulse;

          linePositions[lineIdx * 6] = nodes[i * 3];
          linePositions[lineIdx * 6 + 1] = nodes[i * 3 + 1];
          linePositions[lineIdx * 6 + 2] = nodes[i * 3 + 2];
          linePositions[lineIdx * 6 + 3] = nodes[j * 3];
          linePositions[lineIdx * 6 + 4] = nodes[j * 3 + 1];
          linePositions[lineIdx * 6 + 5] = nodes[j * 3 + 2];

          lineColors[lineIdx * 6] = colorA.r * alpha;
          lineColors[lineIdx * 6 + 1] = colorA.g * alpha;
          lineColors[lineIdx * 6 + 2] = colorA.b * alpha;
          lineColors[lineIdx * 6 + 3] = colorB.r * alpha;
          lineColors[lineIdx * 6 + 4] = colorB.g * alpha;
          lineColors[lineIdx * 6 + 5] = colorB.b * alpha;

          lineIdx++;
        }
      }
    }

    const geo = ref.current.geometry;
    const posAttr = geo.attributes.position;
    const colAttr = geo.attributes.color;

    for (let i = lineIdx; i < maxLines; i++) {
      for (let k = 0; k < 6; k++) {
        linePositions[i * 6 + k] = 0;
        lineColors[i * 6 + k] = 0;
      }
    }

    (posAttr.array as Float32Array).set(linePositions);
    (colAttr.array as Float32Array).set(lineColors);
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    geo.setDrawRange(0, lineIdx * 2);
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={maxLines * 2} array={linePositions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={maxLines * 2} array={lineColors} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  );
};

const FloatingShapes = () => {
  const shapes = useMemo(
    () => [
      { pos: [-3, 1.5, -3] as const, scale: 0.6, color: "hsl(217, 91%, 60%)", speed: 0.4 },
      { pos: [2.5, -1, -2] as const, scale: 0.45, color: "hsl(262, 80%, 60%)", speed: 0.3 },
      { pos: [-1, 2, -4] as const, scale: 0.35, color: "hsl(170, 60%, 55%)", speed: 0.5 },
      { pos: [3, 1, -3.5] as const, scale: 0.5, color: "hsl(30, 90%, 60%)", speed: 0.35 },
    ],
    []
  );

  return (
    <>
      {shapes.map((shape, i) => {
        const Component = i % 2 === 0 ? "icosahedronGeometry" : "octahedronGeometry";
        return (
          <Float key={i} speed={shape.speed} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh position={shape.pos} scale={shape.scale}>
              {/* @ts-expect-error dynamic tag */}
              <Component args={[0.7, 0]} />
              <MeshDistortMaterial
                color={shape.color}
                speed={1.2 + i * 0.4}
                distort={0.12}
                radius={0.9}
                transparent
                opacity={0.06}
                metalness={0.1}
                roughness={0.9}
              />
            </mesh>
          </Float>
        );
      })}
    </>
  );
};

const StarField = ({ count }: { count: number }) => {
  const points = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4;
    }
    return pos;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.008;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={points} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="hsl(210, 40%, 80%)"
        sizeAttenuation
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const Scene = ({ mouseRef }: { mouseRef: { current: { x: number; y: number } } }) => {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.04) * 0.4 + mouseRef.current.x * 0.6;
    state.camera.position.y = Math.cos(t * 0.03) * 0.25 + mouseRef.current.y * 0.4;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[3, 2, 3]} intensity={0.35} color="hsl(217, 91%, 60%)" />
      <pointLight position={[-3, -1, -2]} intensity={0.2} color="hsl(262, 80%, 60%)" />
      <Particles count={120} />
      <ConnectionLines count={60} />
      <FloatingShapes />
      <StarField count={80} />
    </>
  );
};

const HeroScene = ({
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
      camera={{ position: [0, 0, 6], fov: 60, near: 0.1, far: 25 }}
      style={{ pointerEvents: "none", width: "100%", height: "100%" }}
    >
      <Scene mouseRef={mouseRef} />
    </Canvas>
  );
};

export default HeroScene;
