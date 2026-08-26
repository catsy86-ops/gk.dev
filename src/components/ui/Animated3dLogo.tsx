import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { soundEngine } from "@/lib/audio";
import { hapticLight } from "@/lib/haptics";

interface Animated3dLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  showStatus?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const Animated3dLogo = ({
  size = "md",
  showStatus = true,
  className = "",
  onClick,
}: Animated3dLogoProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for 3D tilt
  const springConfig = { damping: 20, stiffness: 260, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [16, -16]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-16, 16]), springConfig);
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set((mouseX / width) - 0.5);
    y.set((mouseY / height) - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundEngine.playPop(800, 0.02);
    hapticLight();
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    soundEngine.playPop(620, 0.04);
    if (onClick) onClick(e);
  };

  const sizeConfig = {
    sm: {
      cube: "w-8 h-8 rounded-xl text-xs",
      orbit: "w-10 h-10 -inset-1",
      gkText: "text-xs font-black",
      wordmark: "text-sm font-black",
      badge: "text-[9px] px-1 py-0.2",
      radar: "h-2 w-2 -top-0.5 -right-0.5",
    },
    md: {
      cube: "w-10 h-10 rounded-2xl text-sm",
      orbit: "w-13 h-13 -inset-1.5",
      gkText: "text-sm font-black",
      wordmark: "text-lg font-black",
      badge: "text-[10px] px-1.5 py-0.5",
      radar: "h-2.5 w-2.5 -top-1 -right-1",
    },
    lg: {
      cube: "w-14 h-14 rounded-2xl text-lg",
      orbit: "w-18 h-18 -inset-2",
      gkText: "text-lg font-black",
      wordmark: "text-2xl font-black",
      badge: "text-xs px-2 py-0.5",
      radar: "h-3 w-3 -top-1 -right-1",
    },
    xl: {
      cube: "w-20 h-20 rounded-3xl text-2xl",
      orbit: "w-26 h-26 -inset-3",
      gkText: "text-2xl font-black",
      wordmark: "text-4xl font-black",
      badge: "text-sm px-2.5 py-1",
      radar: "h-4 w-4 -top-1.5 -right-1.5",
    },
    hero: {
      cube: "w-28 h-28 sm:w-36 sm:h-36 rounded-[32px] text-4xl sm:text-5xl",
      orbit: "w-36 h-36 sm:w-46 sm:h-46 -inset-4 sm:-inset-5",
      gkText: "text-3xl sm:text-4xl font-black",
      wordmark: "text-4xl sm:text-6xl font-black",
      badge: "text-xs sm:text-sm px-3 py-1",
      radar: "h-5 w-5 -top-2 -right-2",
    },
  }[size];

  return (
    <a
      href="#hero"
      onClick={handleClick}
      className={`group relative inline-flex items-center gap-3 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl transition-all cursor-pointer ${className}`}
      aria-label="GK.dev — 3D Cybernetic Brand Logo"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative perspective-[1000px] flex items-center justify-center"
      >
        {/* Outer Rotating Quantum Gyroscope Ring */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className={`absolute ${sizeConfig.orbit} rounded-full border border-primary/25 border-dashed pointer-events-none opacity-60 group-hover:opacity-100 group-hover:border-primary/60 transition-opacity`}
        >
          {/* Orbital Data Particle */}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
        </motion.div>

        {/* 3D Isometric Cyber-Cube Hologram */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className={`relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-primary/40 shadow-[0_10px_35px_-5px_rgba(59,130,246,0.35)] dark:shadow-[0_15px_45px_-8px_rgba(6,182,212,0.45)] overflow-hidden ${sizeConfig.cube}`}
        >
          {/* Internal Holographic Grid Mesh */}
          <div
            className="absolute inset-0 opacity-25 bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)] bg-[size:8px_8px]"
            style={{ transform: "translateZ(10px)" }}
          />

          {/* Dynamic Specular Light Glare following cursor */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, rgba(6,182,212,0.2) 35%, transparent 70%)`,
              transform: "translateZ(25px)",
            }}
          />

          {/* Glowing Ambient Core Light */}
          <div
            className="absolute inset-2 rounded-full bg-gradient-to-r from-primary/30 via-cyan-500/25 to-indigo-600/30 blur-md pointer-events-none"
            style={{ transform: "translateZ(15px)" }}
          />

          {/* Embossed 3D Monogram */}
          <motion.div
            style={{ transform: "translateZ(30px)" }}
            className={`relative z-10 flex items-center justify-center ${sizeConfig.gkText} tracking-tight font-['Geist']`}
          >
            <span className="bg-gradient-to-r from-white via-cyan-200 to-primary bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              GK
            </span>
          </motion.div>

          {/* Live Online Telemetry Pulse */}
          {showStatus && (
            <span
              className={`absolute flex ${sizeConfig.radar}`}
              style={{ transform: "translateZ(40px)" }}
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500 border border-background shadow-[0_0_10px_rgba(16,185,129,0.95)]" />
            </span>
          )}
        </motion.div>
      </div>

      {/* Cybernetic Typographic Wordmark */}
      <div className="flex items-center gap-1 font-['Geist'] tracking-tight select-none">
        <span className={`font-black text-foreground ${sizeConfig.wordmark} tracking-tight`}>
          GK
        </span>
        <motion.span
          className={`bg-gradient-to-r from-primary via-cyan-400 to-indigo-400 bg-clip-text text-transparent font-black ${sizeConfig.wordmark}`}
          animate={
            isHovered
              ? {
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity }}
        >
          .DEV
        </motion.span>
      </div>
    </a>
  );
};

export default Animated3dLogo;
