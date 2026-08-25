import React, { useRef } from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticMedium } from "@/lib/haptics";

export type ButtonVariant = "glow" | "neon" | "glass" | "gradient" | "secondary" | "destructive";
export type ButtonSize = "sm" | "default" | "lg" | "icon";

export interface GlowButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  target?: string;
  rel?: string;
  enableSound?: boolean;
  enableHaptics?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  shimmer?: boolean;
  glowColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export const GlowButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, GlowButtonProps>(
  (
    {
      variant = "glow",
      size = "default",
      href,
      target,
      rel,
      enableSound = true,
      enableHaptics = true,
      icon,
      iconPosition = "right",
      shimmer = true,
      glowColor,
      children,
      className,
      onClick,
      disabled,
      ...motionProps
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement & HTMLAnchorElement>) => {
      if (disabled) return;

      if (enableHaptics) {
        if (variant === "glow" || variant === "gradient") {
          hapticMedium();
        } else {
          hapticLight();
        }
      }

      if (enableSound) {
        if (variant === "glow") {
          soundEngine.playChime();
        } else {
          soundEngine.playPop(750, 0.025);
        }
      }

      if (onClick) {
        onClick(e);
      }
    };

    // Size classes
    const sizeClasses = {
      sm: "px-4 py-1.5 text-xs font-semibold rounded-full gap-1.5",
      default: "px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-full gap-2",
      lg: "px-7 sm:px-9 py-3 sm:py-3.5 text-sm sm:text-base font-black rounded-full gap-2.5",
      icon: "h-10 w-10 p-0 rounded-full flex items-center justify-center",
    }[size];

    // Variant classes
    const variantClasses = {
      glow: "relative bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white shadow-[0_4px_25px_rgba(59,130,246,0.45)] hover:shadow-[0_8px_35px_rgba(59,130,246,0.65)] border border-white/25 dark:border-primary/40",
      neon: "relative bg-card/90 text-foreground border border-primary/50 shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:border-primary hover:text-primary",
      glass: "relative bg-card/60 backdrop-blur-xl text-foreground border border-border/80 shadow-md hover:bg-card/90 hover:border-primary/40 hover:text-primary",
      gradient: "relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500 via-primary to-indigo-600 text-white shadow-xl hover:shadow-2xl border border-white/30",
      secondary: "relative bg-secondary/80 text-foreground border border-border/70 shadow-sm hover:bg-secondary hover:text-primary hover:border-primary/30",
      destructive: "relative bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 border border-destructive/30",
    }[variant];

    const baseClasses = cn(
      "inline-flex items-center justify-center font-['Geist'] tracking-tight select-none cursor-pointer overflow-hidden transition-all duration-300 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      sizeClasses,
      variantClasses,
      disabled && "opacity-50 pointer-events-none cursor-not-allowed",
      className
    );

    const content = (
      <>
        {/* Shimmer Light Beam Effect */}
        {shimmer && !disabled && (
          <motion.div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none -skew-x-12"
            animate={{
              translateX: ["-150%", "250%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.5,
              repeatDelay: 2.5,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Ambient Glow Aura */}
        {glowColor && (
          <span
            className="absolute -inset-1 rounded-full opacity-50 blur-lg pointer-events-none"
            style={{ backgroundColor: glowColor }}
          />
        )}

        {/* Icon Left */}
        {icon && iconPosition === "left" && (
          <span className="shrink-0 transition-transform group-hover:-translate-x-0.5">{icon}</span>
        )}

        {/* Label */}
        {children && <span className="relative z-10">{children}</span>}

        {/* Icon Right */}
        {icon && iconPosition === "right" && (
          <span className="shrink-0 transition-transform group-hover:translate-x-0.5">{icon}</span>
        )}
      </>
    );

    if (href) {
      return (
        <motion.a
          ref={(node) => {
            buttonRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          href={href}
          target={target}
          rel={rel}
          onClick={handleClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
          className={baseClasses}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          {...(motionProps as HTMLMotionProps<"a">)}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        type={motionProps.type || "button"}
        disabled={disabled}
        onClick={handleClick as unknown as React.MouseEventHandler<HTMLButtonElement>}
        className={baseClasses}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...motionProps}
      >
        {content}
      </motion.button>
    );
  }
);

GlowButton.displayName = "GlowButton";
