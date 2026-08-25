import { useState } from "react";
import { motion } from "motion/react";
import { soundEngine } from "@/lib/audio";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const BrandLogo = ({
  size = "md",
  showStatus = true,
  className = "",
  onClick,
}: BrandLogoProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: {
      box: "h-7 w-7 rounded-lg text-[11px]",
      text: "text-base",
      radar: "h-2 w-2 -top-0.5 -right-0.5",
    },
    md: {
      box: "h-8.5 w-8.5 rounded-xl text-xs",
      text: "text-lg",
      radar: "h-2.5 w-2.5 -top-1 -right-1",
    },
    lg: {
      box: "h-12 w-12 rounded-2xl text-base",
      text: "text-2xl",
      radar: "h-3 w-3 -top-1 -right-1",
    },
  }[size];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    soundEngine.playPop(620, 0.05);
    if (onClick) onClick(e);
  };

  return (
    <a
      href="#hero"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl transition-transform active:scale-95 ${className}`}
      aria-label="GK.dev — powrót na stronę główną"
    >
      {/* 3D Holographic Monogram Icon */}
      <motion.div
        className={`relative flex items-center justify-center font-black text-white bg-gradient-to-br from-primary via-blue-600 to-indigo-600 shadow-md shadow-primary/30 border border-white/25 overflow-hidden ${sizeClasses.box}`}
        animate={{
          rotate: isHovered ? [0, -6, 6, 0] : 0,
          scale: isHovered ? 1.08 : 1,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* Animated Light Sweep Sheen */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"
          animate={isHovered ? { translateX: ["-100%", "200%"] } : {}}
          transition={{ duration: 0.75, ease: "easeInOut" }}
        />

        <span className="relative z-10 tracking-tight font-['Geist']">GK</span>

        {/* Live Green Radar Pulse */}
        {showStatus && (
          <span className={`absolute flex ${sizeClasses.radar}`}>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500 border border-background shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
          </span>
        )}
      </motion.div>

      {/* Typographic Wordmark */}
      <div className="flex items-center tracking-tight font-bold font-['Geist']">
        <span className="text-foreground transition-colors group-hover:text-foreground">
          GK
        </span>
        <motion.span
          className="bg-gradient-to-r from-primary via-cyan-400 to-indigo-400 bg-clip-text text-transparent"
          animate={
            isHovered
              ? {
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity }}
        >
          .dev
        </motion.span>
      </div>
    </a>
  );
};
