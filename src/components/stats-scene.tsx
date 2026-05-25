import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshTransmissionMaterial, Sphere, Torus, Icosahedron } from "@react-three/drei";
import * as THREE from "three";

/* ============================================================
   THREE.JS BACKGROUND COMPONENTS
   ============================================================ */

const Particles = ({ count }: { count: number }) => {
  const points = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={count < 100 ? 0.03 : 0.022}
        color="hsl(217, 91%, 60%)"
        sizeAttenuation
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const StarField = ({ count }: { count: number }) => {
  const points = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 5;
    }
    return pos;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    ref.current.rotation.z = state.clock.elapsedTime * 0.005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="hsl(210, 40%, 85%)"
        sizeAttenuation
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const FloatingDust = ({ count }: { count: number }) => {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, [count]);

  const speeds = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) s[i] = 0.2 + Math.random() * 0.5;
    return s;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i] * delta * 0.4;
      pos[i * 3] += Math.sin(delta * 0.5 + i) * 0.001;
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="hsl(220, 60%, 75%)"
        sizeAttenuation
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const ConnectionLines = ({ isMobile }: { isMobile: boolean }) => {
  const nodeCount = 18;
  const maxLines = 120;

  const nodes = useMemo(() => {
    const arr = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, []);

  const linePositions = useMemo(() => new Float32Array(maxLines * 6), []);
  const lineColors = useMemo(() => new Float32Array(maxLines * 6), []);
  const colorA = useMemo(() => new THREE.Color("hsl(217, 91%, 60%)"), []);
  const colorB = useMemo(() => new THREE.Color("hsl(262, 80%, 60%)"), []);

  const ref = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (isMobile || !ref.current) return;
    const t = state.clock.elapsedTime;
    let lineIdx = 0;
    const threshold = 2.8;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = nodes[i * 3] - nodes[j * 3];
        const dy = nodes[i * 3 + 1] - nodes[j * 3 + 1];
        const dz = nodes[i * 3 + 2] - nodes[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < threshold && lineIdx < maxLines) {
          const pulse = 0.35 + Math.sin(t * 2 + i) * 0.15;
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
        <bufferAttribute
          attach="attributes-position"
          args={[linePositions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[lineColors, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
};

const NebulaCloud = ({ isMobile }: { isMobile: boolean }) => {
  const count = 6;
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const data = useMemo(() => Array.from({ length: count }, (_, i) => ({
    radius: 0.4 + Math.random() * 0.35,
    speed: 0.15 + Math.random() * 0.25,
    axis: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2] as [number, number, number],
    phase: Math.random() * Math.PI * 2,
    color: ["hsl(217, 91%, 60%)", "hsl(262, 80%, 60%)", "hsl(170, 60%, 55%)", "hsl(30, 90%, 60%)", "hsl(200, 80%, 58%)", "hsl(340, 70%, 60%)"][i % 6],
  })), []);

  useFrame((state) => {
    if (isMobile) return;
    const t = state.clock.elapsedTime;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const d = data[i];
      const a = d.axis;
      const len = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) || 1;
      mesh.position.x = Math.sin(t * d.speed + d.phase) * 3.2 * (a[0] / len);
      mesh.position.y = Math.cos(t * d.speed * 0.8 + d.phase) * 2.2 * (a[1] / len);
      mesh.position.z = Math.sin(t * d.speed * 0.6 + d.phase) * 1.8 * (a[2] / len);
      mesh.rotation.x = t * 0.1 + i;
      mesh.rotation.y = t * 0.15 + i;
    });
  });

  if (isMobile) return null;

  return (
    <>
      {data.map((d, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}>
          <sphereGeometry args={[d.radius, 8, 8]} />
          <meshBasicMaterial
            color={d.color}
            transparent
            opacity={0.035}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
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
      mesh.rotation.x = t * (0.08 + i * 0.04);
      mesh.rotation.y = t * (0.12 + i * 0.03);
      mesh.rotation.z = t * (0.05 + i * 0.02);
    });
  });

  if (isMobile) return null;

  return (
    <>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }} scale={0.18 + i * 0.04}>
          <torusGeometry args={[2.5 + i * 1.2, 0.015, 16, 80]} />
          <meshBasicMaterial
            color={i === 0 ? "hsl(217, 91%, 60%)" : i === 1 ? "hsl(262, 80%, 60%)" : "hsl(170, 60%, 55%)"}
            transparent
            opacity={0.07}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            wireframe
          />
        </mesh>
      ))}
    </>
  );
};

const FloatingGeometries = ({ isMobile }: { isMobile: boolean }) => {
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const progress = useRef(0);

  const shapes = useMemo(() => [
    { pos: [-2.4, 1.2, -2] as const, rot: [0.3, 0.5, 0] as const, scale: 0.45, color: "hsl(217, 91%, 60%)", speed: 0.3 },
    { pos: [1.8, -1.0, -1.5] as const, rot: [0.5, 0.2, 0.3] as const, scale: 0.55, color: "hsl(262, 80%, 60%)", speed: 0.25 },
    { pos: [-1.0, -1.4, -2.5] as const, rot: [0.1, 0.8, 0.4] as const, scale: 0.35, color: "hsl(170, 60%, 55%)", speed: 0.35 },
    ...(isMobile ? [] : [
      { pos: [2.6, 0.8, -1] as const, rot: [0.7, 0.1, 0.5] as const, scale: 0.5, color: "hsl(30, 90%, 60%)", speed: 0.2 },
      { pos: [0.2, 1.6, -3] as const, rot: [0.4, 0.3, 0.6] as const, scale: 0.3, color: "hsl(200, 80%, 58%)", speed: 0.4 },
    ]),
  ], [isMobile]);

  useFrame((_, delta) => {
    if (progress.current >= 1) return;
    progress.current = Math.min(1, progress.current + delta * 0.55);
    groupRefs.current.forEach((group, i) => {
      if (!group || !shapes[i]) return;
      const delay = i * 0.12;
      const raw = Math.max(0, Math.min(1, (progress.current - delay) / (1 - delay)));
      const eased = 1 - Math.pow(1 - raw, 3);
      group.scale.setScalar(eased * shapes[i].scale);
    });
  });

  return (
    <>
      {shapes.map((shape, i) => {
        const Component = i % 3 === 0 ? Icosahedron : i % 3 === 1 ? Torus : Sphere;
        const props = i % 3 === 1 ? { args: [0.8, 0.25, 16, 32] as const } : { args: [0.7, 1] as const };

        return (
          <Float key={i} speed={shape.speed} rotationIntensity={0.4} floatIntensity={0.6}>
            <group
              ref={(el) => { groupRefs.current[i] = el; }}
              position={shape.pos}
              rotation={shape.rot}
              scale={0}
            >
              {/* @ts-expect-error dynamic props */}
              <Component {...props}>
                <MeshDistortMaterial
                  color={shape.color}
                  speed={1.5 + i * 0.5}
                  distort={0.15}
                  radius={0.8}
                  transparent
                  opacity={0.08}
                  metalness={0.1}
                  roughness={0.8}
                />
              </Component>
            </group>
          </Float>
        );
      })}
    </>
  );
};

const WireframeRing = ({ isMobile }: { isMobile: boolean }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.06;
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  if (isMobile) return null;

  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.8, 0.03, 32, 100]} />
      <MeshTransmissionMaterial
        backside
        backsideThickness={0.3}
        thickness={0.2}
        chromaticAberration={0.05}
        anisotropy={0.1}
        distortion={0}
        distortionScale={0}
        temporalDistortion={0}
        transparent
        opacity={0.12}
        color="hsl(217, 91%, 60%)"
      />
    </mesh>
  );
};

const CursorPulse = ({ mouseRef }: { mouseRef: { current: { x: number; y: number } } }) => {
  const ref = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      const tx = mouseRef.current.x * 3.5;
      const ty = mouseRef.current.y * 2.5;
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, tx, 0.08);
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, ty, 0.08);
      const s = 1 + Math.sin(t * 3) * 0.3;
      ref.current.scale.setScalar(s);
    }
    if (pulseRef.current) {
      const tx = mouseRef.current.x * 3.5;
      const ty = mouseRef.current.y * 2.5;
      pulseRef.current.position.x = ref.current?.position.x ?? tx;
      pulseRef.current.position.y = ref.current?.position.y ?? ty;
      const ps = 1 + Math.sin(t * 2.5 - 0.5) * 0.5;
      pulseRef.current.scale.setScalar(ps * 1.8);
      const mat = pulseRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(t * 2.5) * 0.03;
    }
  });

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial
          color="hsl(217, 91%, 70%)"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial
          color="hsl(217, 91%, 60%)"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
};

const DeformingGrid = ({ isMobile }: { isMobile: boolean }) => {
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
    <mesh rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -1.2, -1.5]}>
      <planeGeometry args={[16, 10, 60, 40]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={`
          uniform float uTime;
          varying float vElevation;
          void main() {
            vec3 pos = position;
            float dist = length(pos.xy);
            float wave = sin(dist * 2.0 - uTime * 1.2) * 0.35;
            wave += sin(pos.x * 3.0 + uTime * 0.8) * 0.15;
            pos.z += wave;
            vElevation = wave;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vElevation;
          void main() {
            float alpha = 0.06 + smoothstep(-0.2, 0.5, vElevation) * 0.1;
            vec3 col = mix(uColor, vec3(0.9, 0.95, 1.0), 0.2);
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

const MouseFollower = ({ mouseRef, children }: { mouseRef: { current: { x: number; y: number } }; children: React.ReactNode }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!groupRef.current) return;
    const targetX = mouseRef.current.x * 1.8;
    const targetY = mouseRef.current.y * 1.2;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
  });
  return <group ref={groupRef}>{children}</group>;
};

const Scene = ({ isMobile, mouseRef }: { isMobile: boolean; mouseRef: { current: { x: number; y: number } } }) => {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.08) * 1.2;
    state.camera.position.y = Math.cos(t * 0.06) * 0.6;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 2, 3]} intensity={0.5} color="hsl(217, 91%, 60%)" />
      <pointLight position={[-3, -1, -2]} intensity={0.3} color="hsl(262, 80%, 60%)" />
      <Particles count={isMobile ? 60 : 180} />
      <StarField count={isMobile ? 30 : 80} />
      <FloatingDust count={isMobile ? 60 : 140} />
      <ConnectionLines isMobile={isMobile} />
      <NebulaCloud isMobile={isMobile} />
      <OrbitRings isMobile={isMobile} />
      <MouseFollower mouseRef={mouseRef}>
        <FloatingGeometries isMobile={isMobile} />
        <WireframeRing isMobile={isMobile} />
        <CursorPulse mouseRef={mouseRef} />
      </MouseFollower>
      <DeformingGrid isMobile={isMobile} />
    </>
  );
};

export const ThreeBackground = ({ isMobile, mouseRef }: { isMobile: boolean; mouseRef: { current: { x: number; y: number } } }) => (
  <div className="absolute inset-0 z-0 opacity-40" role="presentation" aria-hidden="true">
    <Canvas
      dpr={isMobile ? 1 : [1, 1.5]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 20 }}
      style={{ pointerEvents: "none" }}
    >
      <Scene isMobile={isMobile} mouseRef={mouseRef} />
    </Canvas>
  </div>
);
