import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  delay?: number;
  direction?: "left" | "right" | "up" | "down";
}

export function ImageReveal({
  src,
  alt,
  className,
  containerClassName,
  delay = 0,
  direction = "left",
}: ImageRevealProps) {
  const clipPaths = {
    left: { initial: "inset(0 100% 0 0)", animate: "inset(0 0% 0 0)" },
    right: { initial: "inset(0 0 0 100%)", animate: "inset(0 0 0 0%)" },
    up: { initial: "inset(100% 0 0 0)", animate: "inset(0% 0 0 0)" },
    down: { initial: "inset(0 0 100% 0)", animate: "inset(0 0 0% 0)" },
  };

  return (
    <motion.div
      className={cn("overflow-hidden", containerClassName)}
      initial={{ clipPath: clipPaths[direction].initial }}
      whileInView={{ clipPath: clipPaths[direction].animate }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn("h-full w-full object-cover", className)}
        initial={{ scale: 1.2 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.1, delay: delay + 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      />
    </motion.div>
  );
}
