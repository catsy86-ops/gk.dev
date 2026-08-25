import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const HolographicCard = ({
  children,
  className,
  glowColor = "rgba(59, 130, 246, 0.4)",
}: HolographicCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth springs for 3D tilt
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [10, -10]), {
    stiffness: 250,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), {
    stiffness: 250,
    damping: 25,
  });

  // Foil position
  const foilX = useTransform(mouseX, [0, 1], ["0%", "100%"]);
  const foilY = useTransform(mouseY, [0, 1], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative rounded-3xl border border-border/80 bg-card/85 backdrop-blur-2xl shadow-2xl overflow-hidden transition-shadow duration-500",
          isHovered && "shadow-[0_25px_60px_-15px_rgba(59,130,246,0.3)]",
          className
        )}
      >
        {/* Holographic Rainbow Foil Layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 mix-blend-color-dodge z-20"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `radial-gradient(circle at ${foilX} ${foilY}, rgba(255,0,128,0.6), rgba(0,255,255,0.6), rgba(255,255,0,0.6), transparent 70%)`,
          }}
        />

        {/* Diagonal Light Sheen */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-20"
          style={{
            opacity: isHovered ? 0.25 : 0,
            background: `linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.7) 55%, transparent 80%)`,
          }}
        />

        {/* Ambient Radial Glow */}
        <div
          className="absolute -inset-2 rounded-3xl opacity-0 transition-opacity duration-500 blur-2xl pointer-events-none -z-10"
          style={{
            opacity: isHovered ? 0.6 : 0,
            background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
          }}
        />

        {/* Card Content */}
        <div className="relative z-10">{children}</div>
      </motion.div>
    </div>
  );
};
