import { motion } from "motion/react";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export const BorderBeam = ({
  className = "",
  size = 200,
  duration = 10,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "hsl(var(--primary))",
  colorTo = "hsl(var(--accent-blue, 217 91% 60%))",
  delay = 0,
}: BorderBeamProps) => {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--anchor": anchor,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={`pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] ${className}`}
    >
      <motion.div
        className="absolute aspect-square w-[calc(var(--size)*1px)] [animation-delay:var(--delay)]"
        style={{
          background: `linear-gradient(to left, var(--color-from), var(--color-to), transparent)`,
          offsetAnchor: `calc(var(--anchor)*1%) 50%`,
          offsetPath: `rect(0 auto auto 0 round calc(var(--size)*1px))`,
        }}
        animate={{
          offsetDistance: ["0%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay,
        }}
      />
    </div>
  );
};
