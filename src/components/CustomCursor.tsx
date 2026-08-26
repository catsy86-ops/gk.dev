import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Ultra-Fluid Pointer Physics Custom Cursor (Awwwards Standard)
 * - Rock-solid Pointer Events tracking with auto-recovery (never freezes or drops frames).
 * - Zero layout thrashing (direct transforms without style recomputations).
 * - High-precision velocity stretch and magnetic spring smoothing.
 * - Automatic window re-entry and modal focus synchronization.
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
    let isHidden = true; // start hidden until first pointer event detected
    let isInitialized = false;

    let rafId: number;

    const checkIsInsideModal = (target: HTMLElement | null): boolean => {
      if (!target) return false;
      return (
        target.closest('[role="dialog"]') !== null ||
        target.closest('[aria-modal="true"]') !== null ||
        document.body.classList.contains("modal-open")
      );
    };

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isInitialized) {
        ringX = mouseX;
        ringY = mouseY;
        auraX = mouseX;
        auraY = mouseY;
        isInitialized = true;
      }

      const target = (e.target as HTMLElement) || document.elementFromPoint(e.clientX, e.clientY);
      const isInsideModal = checkIsInsideModal(target as HTMLElement);

      if (isInsideModal) {
        isHidden = true;
        setBadgeText("");
      } else {
        isHidden = false;
      }
    };

    const onPointerDown = () => {
      isClicking = true;
    };

    const onPointerUp = () => {
      isClicking = false;
    };

    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (checkIsInsideModal(target)) {
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

    const onMouseLeaveDoc = () => {
      isHidden = true;
    };

    const onMouseEnterDoc = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      ringX = e.clientX;
      ringY = e.clientY;
      auraX = e.clientX;
      auraY = e.clientY;
      isHidden = false;
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        isHidden = true;
      }
    };

    // Continuous 120/144Hz physics interpolation loop
    const loop = () => {
      if (!isInitialized) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      // Calculate velocity
      vx = mouseX - prevMouseX;
      vy = mouseY - prevMouseY;
      speed = Math.hypot(vx, vy) || 0;
      if (speed > 0.5) {
        angle = Math.atan2(vy, vx) * (180 / Math.PI);
      }

      prevMouseX = mouseX;
      prevMouseY = mouseY;

      // Elastic spring physics
      ringX += (mouseX - ringX) * 0.35;
      ringY += (mouseY - ringY) * 0.35;

      auraX += (mouseX - auraX) * 0.16;
      auraY += (mouseY - auraY) * 0.16;

      // Velocity-based aerodynamic stretch
      const stretch = Math.min(1 + speed * 0.015, 1.4);
      const squeeze = Math.max(1 - speed * 0.007, 0.78);

      if (isHidden) {
        dot.style.opacity = "0";
        ring.style.opacity = "0";
        aura.style.opacity = "0";
      } else {
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        aura.style.opacity = "0.75";

        // Dot follows cursor precisely
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

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeaveDoc, { passive: true });
    document.addEventListener("mouseenter", onMouseEnterDoc, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("mouseleave", onMouseLeaveDoc);
      document.removeEventListener("mouseenter", onMouseEnterDoc);
      document.removeEventListener("visibilitychange", onVisibilityChange);
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
