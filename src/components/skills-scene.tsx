import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

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
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color="hsl(217, 91%, 60%)"
        sizeAttenuation
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const FloatingHexagons = ({ isMobile }: { isMobile: boolean }) => {
  const shapes = useMemo(
    () => [
      { pos: [-3.5, 1.2, -2] as const, rot: [0.3, 0.5, 0] as const, scale: 0.4, color: "hsl(217, 91%, 60%)", speed: 0.25 },
      { pos: [2.8, -0.8, -1.5] as const, rot: [0.5, 0.2, 0.3] as const, scale: 0.35, color: "hsl(262, 80%, 60%)", speed: 0.2 },
      { pos: [-1.2, -1.6, -2.5] as const, rot: [0.1, 0.8, 0.4] as const, scale: 0.3, color: "hsl(170, 60%, 55%)", speed: 0.3 },
      { pos: [3.2, 1.0, -1] as const, rot: [0.7, 0.1, 0.5] as const, scale: 0.25, color: "hsl(30, 90%, 60%)", speed: 0.15 },
      { pos: [0.5, 1.8, -3] as const, rot: [0.4, 0.3, 0.6] as const, scale: 0.2, color: "hsl(200, 80%, 58%)", speed: 0.35 },
    ],
    []
  );

  if (isMobile) return null;

  return (
    <>
      {shapes.map((shape, i) => (
        <Float key={i} speed={shape.speed} rotationIntensity={0.3} floatIntensity={0.4}>
          <mesh position={shape.pos} rotation={shape.rot} scale={shape.scale}>
            <octahedronGeometry args={[0.7, 0]} />
            <meshBasicMaterial
              color={shape.color}
              transparent
              opacity={0.04}
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

const OrbitRings = ({ isMobile }: { isMobile: boolean }) => {
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    if (isMobile) return;
    const t = state.clock.elapsedTime;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.rotation.x = t * (0.06 + i * 0.03);
      mesh.rotation.y = t * (0.1 + i * 0.02);
    });
  });

  if (isMobile) return null;

  return (
    <>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }} scale={0.15 + i * 0.03}>
          <torusGeometry args={[2.5 + i * 1.0, 0.012, 16, 80]} />
          <meshBasicMaterial
            color={i === 0 ? "hsl(217, 91%, 60%)" : i === 1 ? "hsl(262, 80%, 60%)" : "hsl(170, 60%, 55%)"}
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            wireframe
          />
        </mesh>
      ))}
    </>
  );
};

const FloorGrid = ({ isMobile }: { isMobile: boolean }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("hsl(217, 91%, 60%)") },
  }), []);

  useFrame((state) => {
    if (isMobile || !materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  if (isMobile) return null;

  return (
    <mesh rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -2.2, -1]}>
      <planeGeometry args={[16, 10, 50, 30]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={`
          uniform float uTime;
          varying float vElevation;
          void main() {
            vec3 pos = position;
            float wave = sin(length(pos.xy) * 1.8 - uTime * 0.8) * 0.25;
            wave += sin(pos.x * 2.5 + uTime * 0.5) * 0.1;
            pos.z += wave;
            vElevation = wave;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vElevation;
          void main() {
            float alpha = 0.04 + smoothstep(-0.15, 0.4, vElevation) * 0.06;
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        wireframe
      />
    </mesh>
  );
};

const MouseFollower = ({ mouseRef, children }: { mouseRef: { current: { x: number; y: number } }; children: React.ReactNode }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouseRef.current.x * 1.2, 0.04);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, mouseRef.current.y * 0.8, 0.04);
  });
  return <group ref={groupRef}>{children}</group>;
};

const Scene = ({
  isMobile,
  mouseRef,
}: {
  isMobile: boolean;
  mouseRef: { current: { x: number; y: number } };
}) => {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.06) * 0.8;
    state.camera.position.y = Math.cos(t * 0.05) * 0.4;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[3, 2, 3]} intensity={0.35} color="hsl(217, 91%, 60%)" />
      <Particles count={isMobile ? 50 : 120} />
      <MouseFollower mouseRef={mouseRef}>
        <FloatingHexagons isMobile={isMobile} />
        <OrbitRings isMobile={isMobile} />
      </MouseFollower>
      <FloorGrid isMobile={isMobile} />
    </>
  );
};

const SkillsScene = ({
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
      camera={{ position: [0, 0, 5.5], fov: 60, near: 0.1, far: 20 }}
      style={{ pointerEvents: "none", width: "100%", height: "100%" }}
    >
      <Scene isMobile={isMobile} mouseRef={mouseRef} />
    </Canvas>
  );
};

export default SkillsScene;
