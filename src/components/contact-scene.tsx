import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const FloatingBubbles = ({ count }: { count: number }) => {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, [count]);

  const speeds = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) s[i] = 0.3 + Math.random() * 0.6;
    return s;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i] * delta * 0.35;
      pos[i * 3] += Math.sin(delta * 0.4 + i * 0.5) * 0.002;
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="hsl(217, 91%, 70%)"
        sizeAttenuation
        transparent
        opacity={0.25}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const WavePlane = ({ isMobile }: { isMobile: boolean }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("hsl(217, 91%, 60%)") },
    uColor2: { value: new THREE.Color("hsl(262, 80%, 60%)") },
  }), []);

  useFrame((state) => {
    if (isMobile || !materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  if (isMobile) return null;

  return (
    <mesh rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -2, -1.5]}>
      <planeGeometry args={[14, 8, 40, 25]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={`
          uniform float uTime;
          varying vec2 vUv;
          varying float vElevation;
          void main() {
            vec3 pos = position;
            float wave = sin(pos.x * 2.0 + uTime * 0.9) * 0.2;
            wave += sin(pos.y * 1.5 + uTime * 0.6) * 0.15;
            wave += sin(length(pos.xy) * 3.0 - uTime * 1.1) * 0.1;
            pos.z += wave;
            vUv = uv;
            vElevation = wave;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          varying vec2 vUv;
          varying float vElevation;
          void main() {
            float mixVal = smoothstep(-0.3, 0.4, vElevation);
            vec3 col = mix(uColor1, uColor2, mixVal);
            float alpha = 0.05 + smoothstep(-0.2, 0.3, vElevation) * 0.08;
            gl_FragColor = vec4(col, alpha);
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

const FloatingShapes = ({ isMobile }: { isMobile: boolean }) => {
  const shapes = useMemo(
    () => [
      { pos: [-3, 1, -2.5] as const, scale: 0.25, color: "hsl(217, 91%, 60%)", speed: 0.3 },
      { pos: [2.5, -0.5, -2] as const, scale: 0.2, color: "hsl(262, 80%, 60%)", speed: 0.2 },
      { pos: [-0.5, 1.8, -3.5] as const, scale: 0.15, color: "hsl(170, 60%, 55%)", speed: 0.4 },
    ],
    []
  );

  if (isMobile) return null;

  return (
    <>
      {shapes.map((shape, i) => (
        <Float key={i} speed={shape.speed} rotationIntensity={0.25} floatIntensity={0.35}>
          <mesh position={shape.pos} scale={shape.scale}>
            <icosahedronGeometry args={[0.8, 0]} />
            <meshBasicMaterial
              color={shape.color}
              transparent
              opacity={0.045}
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

const ConnectionNodes = ({ isMobile }: { isMobile: boolean }) => {
  const nodeCount = 12;
  const maxLines = 80;

  const nodes = useMemo(() => {
    const arr = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return arr;
  }, []);

  const linePositions = useMemo(() => new Float32Array(maxLines * 6), []);
  const lineColors = useMemo(() => new Float32Array(maxLines * 6), []);
  const colorA = useMemo(() => new THREE.Color("hsl(217, 91%, 60%)"), []);
  const colorB = useMemo(() => new THREE.Color("hsl(170, 60%, 55%)"), []);

  const ref = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (isMobile || !ref.current) return;
    const t = state.clock.elapsedTime;
    let lineIdx = 0;
    const threshold = 3.2;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = nodes[i * 3] - nodes[j * 3];
        const dy = nodes[i * 3 + 1] - nodes[j * 3 + 1];
        const dz = nodes[i * 3 + 2] - nodes[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < threshold && lineIdx < maxLines) {
          const pulse = 0.25 + Math.sin(t * 2 + i) * 0.1;
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

  if (isMobile) return null;

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

const MouseFollower = ({ mouseRef, children }: { mouseRef: { current: { x: number; y: number } }; children: React.ReactNode }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouseRef.current.x * 1.5, 0.04);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, mouseRef.current.y * 1.0, 0.04);
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
    state.camera.position.x = Math.sin(t * 0.05) * 0.6;
    state.camera.position.y = Math.cos(t * 0.04) * 0.3;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[3, 2, 3]} intensity={0.3} color="hsl(217, 91%, 60%)" />
      <pointLight position={[-3, -1, -2]} intensity={0.2} color="hsl(262, 80%, 60%)" />
      <FloatingBubbles count={isMobile ? 40 : 90} />
      <MouseFollower mouseRef={mouseRef}>
        <FloatingShapes isMobile={isMobile} />
        <ConnectionNodes isMobile={isMobile} />
      </MouseFollower>
      <WavePlane isMobile={isMobile} />
    </>
  );
};

const ContactScene = ({
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

export default ContactScene;
