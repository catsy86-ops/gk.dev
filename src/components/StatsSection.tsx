import { useRef, useEffect, useState, memo, useMemo } from "react";
import { motion, useInView } from "motion/react";
import { Calendar, Rocket, Code2, Users } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshTransmissionMaterial, Sphere, Torus, Icosahedron } from "@react-three/drei";
import * as THREE from "three";
import { useMediaQuery } from "@/hooks/use-media-query";
import { EASE_STANDARD } from "@/constants/animations";
import SectionWrapper from "@/components/ui/SectionWrapper";

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

  const ref = useRef<THREE.Points>(null!);

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

const FloatingGeometries = ({ isMobile }: { isMobile: boolean }) => {
  const geometryRefs = useRef<THREE.Group[]>([]);

  const shapes = useMemo(() => [
    { pos: [-2.4, 1.2, -2] as const, rot: [0.3, 0.5, 0] as const, scale: 0.45, color: "hsl(217, 91%, 60%)", speed: 0.3 },
    { pos: [1.8, -1.0, -1.5] as const, rot: [0.5, 0.2, 0.3] as const, scale: 0.55, color: "hsl(262, 80%, 60%)", speed: 0.25 },
    { pos: [-1.0, -1.4, -2.5] as const, rot: [0.1, 0.8, 0.4] as const, scale: 0.35, color: "hsl(170, 60%, 55%)", speed: 0.35 },
    ...(isMobile ? [] : [
      { pos: [2.6, 0.8, -1] as const, rot: [0.7, 0.1, 0.5] as const, scale: 0.5, color: "hsl(30, 90%, 60%)", speed: 0.2 },
      { pos: [0.2, 1.6, -3] as const, rot: [0.4, 0.3, 0.6] as const, scale: 0.3, color: "hsl(200, 80%, 58%)", speed: 0.4 },
    ]),
  ], [isMobile]);

  return (
    <>
      {shapes.map((shape, i) => {
        const Component = i % 3 === 0 ? Icosahedron : i % 3 === 1 ? Torus : Sphere;
        const props = i % 3 === 1 ? { args: [0.8, 0.25, 16, 32] as const } : { args: [0.7, 1] as const };

        return (
          <Float key={i} speed={shape.speed} rotationIntensity={0.4} floatIntensity={0.6}>
            <group ref={(el) => { if (el) geometryRefs.current[i] = el; }} position={shape.pos} rotation={shape.rot}>
              {/* @ts-expect-error dynamic props */}
              <Component {...props} scale={shape.scale}>
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
  const ref = useRef<THREE.Mesh>(null!);

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

const Scene = ({ isMobile }: { isMobile: boolean }) => {
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
      <FloatingGeometries isMobile={isMobile} />
      <WireframeRing isMobile={isMobile} />
    </>
  );
};

/* ============================================================
   Stats Section Component
   ============================================================ */

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  delay: number;
  inView: boolean;
}

const useCountUp = (target: number, inView: boolean, duration = 2200) => {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!inView || hasRun.current) return;
    hasRun.current = true;
    const start = performance.now();
    let raf: number;
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return count;
};

const StatItem = memo(({ icon, value, suffix = "", label, delay, inView }: StatItemProps) => {
  const count = useCountUp(value, inView);

  return (
    <motion.div
      className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md p-6 sm:p-8 transition-all duration-500 hover:border-primary/25 hover:bg-card/70 hover:shadow-[0_8px_40px_-12px_rgba(59,130,246,0.15)] hover:-translate-y-1"
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.65, delay, ease: EASE_STANDARD }}
    >
      {/* Card glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Icon */}
      <motion.div
        className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8 text-primary border border-primary/10"
        initial={{ scale: 0, rotate: -25 }}
        animate={inView ? { scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.12, type: "spring", stiffness: 200, damping: 18 }}
        whileHover={{ scale: 1.15, rotate: 5 }}
        aria-hidden="true"
      >
        {icon}
      </motion.div>

      {/* Number */}
      <div className="relative text-center">
        <motion.span
          className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-foreground tabular-nums"
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={inView ? { opacity: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.4, delay: delay + 0.25 }}
          aria-label={`${value}${suffix}`}
        >
          {count}
          <motion.span
            className="text-primary/80"
            initial={{ opacity: 0, x: -4 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3, delay: delay + 0.5 }}
            aria-hidden="true"
          >
            {suffix}
          </motion.span>
        </motion.span>
      </div>

      {/* Label */}
      <motion.p
        className="text-[12px] sm:text-[13px] text-muted-foreground font-medium tracking-[0.04em] uppercase text-center leading-tight"
        initial={{ opacity: 0, y: 6 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, delay: delay + 0.35 }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
});
StatItem.displayName = "StatItem";

const stats = [
  { icon: <Calendar className="h-5 w-5" strokeWidth={1.6} />, value: 7, suffix: "+", label: "Lat doświadczenia" },
  { icon: <Rocket className="h-5 w-5" strokeWidth={1.6} />, value: 25, suffix: "+", label: "Ukończone projekty" },
  { icon: <Code2 className="h-5 w-5" strokeWidth={1.6} />, value: 12, suffix: "+", label: "Technologie" },
  { icon: <Users className="h-5 w-5" strokeWidth={1.6} />, value: 15, suffix: "+", label: "Zadowolonych klientów" },
];

const ThreeBackground = ({ isMobile }: { isMobile: boolean }) => (
  <div className="absolute inset-0 z-0 opacity-40" role="presentation" aria-hidden="true">
    <Canvas
      dpr={isMobile ? 1 : [1, 1.5]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 20 }}
      style={{ pointerEvents: "none" }}
    >
      <Scene isMobile={isMobile} />
    </Canvas>
  </div>
);

const StatsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-28 overflow-hidden"
      id="statystyki"
      aria-label="Statystyki"
    >
      {/* Three.js Background — skip on reduced motion */}
      {!prefersReduced && <ThreeBackground isMobile={isMobile} />}

      {/* Gradient fades at edges */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background)/0.6)_100%)]" aria-hidden="true" />

      {/* Subtle divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary tracking-[0.2em] uppercase mb-4 font-['Geist']"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.span
              className="h-1 w-1 rounded-full bg-primary inline-block"
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              aria-hidden="true"
            />
            W liczbach
          </motion.span>
          <motion.h2
            className="text-2xl md:text-3xl font-bold tracking-[-0.02em] text-foreground font-['Geist']"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Doświadczenie w pigułce
          </motion.h2>
        </motion.div>

        {/* Stats grid */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
          role="list"
          aria-label="Statystyki"
        >
          {stats.map((stat, i) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={i * 0.1}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;