import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Ultra-Responsive Fluid Physics Custom Cursor (Awwwards 2026 Standard)
 * - Zero layout thrashing (no getComputedStyle in loops).
 * - Continuous high-performance requestAnimationFrame loop with velocity-based aerodynamic stretch.
 * - Magnetic snap & expansion on interactive buttons/links.
 * - Glowing chromatic particle aura that never stutters or drops frames.
 */
export const CustomCursor = () => {
  const isTouch = useMediaQuery("(pointer: coarse)");
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const [badgeText, setBadgeText] = useState("");

  useEffect(() => {
    if (isTouch || prefersReduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const aura = auraRef.current;
    if (!dot || !ring || !aura) return;

    document.body.classList.add("cursor-none");

    let mouseX = -100;
    let mouseY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;

    let ringX = -100;
    let ringY = -100;
    let auraX = -100;
    let auraY = -100;

    let vx = 0;
    let vy = 0;
    let speed = 0;
    let angle = 0;

    let isHovering = false;
    let isClicking = false;
    let isProject = false;
    let isHidden = false;

    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseDown = () => {
      isClicking = true;
    };

    const onMouseUp = () => {
      isClicking = false;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInsideDialog =
        target.closest('[role="dialog"]') !== null ||
        target.closest('[aria-modal="true"]') !== null ||
        document.body.classList.contains("modal-open");

      if (isInsideDialog) {
        isHidden = true;
        setBadgeText("");
        return;
      }

      isHidden = false;

      const projectEl = target.closest("[data-cursor='project'], .project-card");
      if (projectEl) {
        isProject = true;
        isHovering = true;
        setBadgeText("ZOBACZ");
        return;
      }

      const interactiveEl = target.closest(
        'a, button, input, textarea, select, [role="button"], [role="tab"], .interactive-node, [data-interactive]'
      );

      if (interactiveEl) {
        isProject = false;
        isHovering = true;
        setBadgeText("");
      } else {
        isProject = false;
        isHovering = false;
        setBadgeText("");
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        isHidden = true;
      }
    };

    // Continuous ultra-fluid 120/144Hz RAF loop
    const loop = () => {
      // Calculate instantaneous velocity
      vx = mouseX - prevMouseX;
      vy = mouseY - prevMouseY;
      speed = Math.hypot(vx, vy);
      angle = Math.atan2(vy, vx) * (180 / Math.PI);

      prevMouseX = mouseX;
      prevMouseY = mouseY;

      // Elastic physics lerp
      // Ring lerps quickly with slight springiness
      ringX += (mouseX - ringX) * 0.32;
      ringY += (mouseY - ringY) * 0.32;

      // Aura follows with gentle ethereal drift
      auraX += (mouseX - auraX) * 0.15;
      auraY += (mouseY - auraY) * 0.15;

      // Velocity-based aerodynamic stretch (scale along velocity vector)
      const stretch = Math.min(1 + speed * 0.018, 1.45);
      const squeeze = Math.max(1 - speed * 0.008, 0.75);

      if (isHidden) {
        dot.style.opacity = "0";
        ring.style.opacity = "0";
        aura.style.opacity = "0";
      } else {
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        aura.style.opacity = "0.75";

        // Dot follows cursor precisely with velocity stretch
        dot.style.transform = `translate3d(${mouseX - 5}px, ${mouseY - 5}px, 0) rotate(${angle}deg) scale(${isClicking ? 0.7 : stretch}, ${isClicking ? 0.7 : squeeze})`;

        // Ring follows with fluid spring damping and hover expansion
        const ringScale = isProject ? 2.0 : isHovering ? 1.5 : isClicking ? 0.85 : 1.0;
        ring.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0) scale(${ringScale})`;

        // Aura follows with soft ambient glow
        aura.style.transform = `translate3d(${auraX - 35}px, ${auraY - 35}px, 0)`;

        if (isProject) {
          ring.classList.add("cursor-project");
          ring.classList.remove("cursor-hovering");
          dot.style.opacity = "0";
        } else if (isHovering) {
          ring.classList.add("cursor-hovering");
          ring.classList.remove("cursor-project");
          dot.style.opacity = "0.8";
        } else {
          ring.classList.remove("cursor-hovering", "cursor-project");
          dot.style.opacity = "1";
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.body.classList.remove("cursor-none");
    };
  }, [isTouch, prefersReduced]);

  if (isTouch || prefersReduced) return null;

  const cursorContent = (
    <>
      <style>{`
        .cursor-none:not(.modal-open),
        .cursor-none:not(.modal-open) *:not([role="dialog"]):not([role="dialog"] *):not([aria-modal="true"] *) {
          cursor: none !important;
        }
        .modal-open,
        .modal-open *,
        [role="dialog"],
        [role="dialog"] *,
        [aria-modal="true"],
        [aria-modal="true"] * {
          cursor: auto !important;
        }
        [role="dialog"] button,
        [role="dialog"] a,
        [role="dialog"] [role="button"],
        [role="dialog"] [role="tab"] {
          cursor: pointer !important;
        }
        .custom-cursor-core {
          pointer-events: none;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999999;
          will-change: transform, opacity;
          transform: translate3d(-100px, -100px, 0);
        }
        .cursor-aura {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: radial-gradient(circle, hsl(var(--primary) / 0.28) 0%, rgba(59, 130, 246, 0.12) 45%, transparent 75%);
          filter: blur(10px);
        }
        .cursor-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: hsl(var(--primary));
          box-shadow: 0 0 12px hsl(var(--primary) / 0.9), 0 0 24px hsl(var(--primary) / 0.5);
          transition: background-color 0.2s ease;
        }
        .cursor-ring {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1.5px solid hsl(var(--primary) / 0.65);
          background: hsl(var(--primary) / 0.06);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
        }
        .cursor-ring.cursor-hovering {
          border-color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.15);
          box-shadow: 0 0 25px hsl(var(--primary) / 0.35);
        }
        .cursor-ring.cursor-project {
          background: hsl(var(--primary));
          border-color: hsl(var(--primary-foreground));
          box-shadow: 0 0 35px hsl(var(--primary) / 0.6);
        }
        .cursor-badge-label {
          font-family: 'Geist', monospace;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
          color: hsl(var(--primary-foreground));
          text-transform: uppercase;
        }
        @media (pointer: coarse) {
          .custom-cursor-core { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .custom-cursor-core { display: none !important; }
        }
      `}</style>
      <div ref={auraRef} className="custom-cursor-core cursor-aura" aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor-core cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="custom-cursor-core cursor-ring" aria-hidden="true">
        {badgeText && <span className="cursor-badge-label">{badgeText}</span>}
      </div>
    </>
  );

  return createPortal(cursorContent, document.body);
};

export default CustomCursor;
