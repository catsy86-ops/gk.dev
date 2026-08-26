import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Chromatic Morphing CustomCursor (Awwwards 2026 standard)
 * Features dynamic contextual states, magnetic physics, chromatic trail glow, and zero React re-renders on mousemove.
 * Yields cleanly to crisp native cursor inside all modals and dialogs.
 */
const CustomCursor = () => {
  const isTouch = useMediaQuery("(pointer: coarse)");
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [badgeText, setBadgeText] = useState("");

  useEffect(() => {
    if (isTouch || prefersReduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const trail = trailRef.current;
    if (!dot || !ring || !trail) return;

    // Hide system cursor on main canvas
    document.body.classList.add("cursor-none");

    let rafId = 0;
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let trailX = -100;
    let trailY = -100;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    const render = () => {
      // Elastic trailing for ring (fast interpolation)
      ringX += (mouseX - ringX) * 0.25;
      ringY += (mouseY - ringY) * 0.25;

      // Soft trailing for chromatic glow (slower interpolation)
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;

      dot.style.transform = `translate3d(${mouseX - 6}px, ${mouseY - 6}px, 0)`;
      ring.style.transform = `translate3d(${ringX - 22}px, ${ringY - 22}px, 0)`;
      trail.style.transform = `translate3d(${trailX - 40}px, ${trailY - 40}px, 0)`;

      if (
        Math.abs(mouseX - ringX) > 0.1 ||
        Math.abs(mouseY - ringY) > 0.1 ||
        Math.abs(mouseX - trailX) > 0.1 ||
        Math.abs(mouseY - trailY) > 0.1
      ) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = 0;
      }
    };

    const onDown = () => {
      dot.classList.add("cursor-clicking");
      ring.classList.add("cursor-clicking");
    };

    const onUp = () => {
      dot.classList.remove("cursor-clicking");
      ring.classList.remove("cursor-clicking");
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInsideDialog =
        target.closest('[role="dialog"]') !== null ||
        target.closest('[aria-modal="true"]') !== null ||
        document.body.classList.contains("modal-open");

      if (isInsideDialog) {
        setBadgeText("");
        dot.classList.add("cursor-hidden");
        ring.classList.add("cursor-hidden");
        trail.classList.add("cursor-hidden");
        return;
      }

      dot.classList.remove("cursor-hidden");
      ring.classList.remove("cursor-hidden");
      trail.classList.remove("cursor-hidden");

      const isProject =
        target.closest("[data-cursor='project']") !== null || target.closest(".project-card") !== null;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.closest("a") !== null ||
        target.closest("button") !== null ||
        target.getAttribute("role") === "button" ||
        target.getAttribute("role") === "tab" ||
        window.getComputedStyle(target).cursor === "pointer";

      if (isProject) {
        setBadgeText("ZOBACZ");
        ring.classList.add("cursor-project");
        dot.classList.add("cursor-hidden");
      } else if (isInteractive) {
        setBadgeText("");
        ring.classList.remove("cursor-project");
        dot.classList.remove("cursor-hidden");
        dot.classList.add("cursor-hovering");
        ring.classList.add("cursor-hovering");
      }
    };

    const onOut = () => {
      setBadgeText("");
      dot.classList.remove("cursor-hovering", "cursor-hidden");
      ring.classList.remove("cursor-hovering", "cursor-project");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.body.classList.remove("cursor-none");
    };
  }, [isTouch, prefersReduced]);

  if (isTouch || prefersReduced) return null;

  const cursorContent = (
    <>
      <style>{`
        .cursor-none:not(.modal-open),
        .cursor-none:not(.modal-open) *:not([role="dialog"]):not([role="dialog"] *):not([aria-modal="true"] *) {
          cursor: none;
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
        [role="dialog"] input,
        [role="dialog"] textarea {
          cursor: text !important;
        }
        .custom-cursor {
          pointer-events: none;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 999999;
          will-change: transform;
        }
        .modal-open .custom-cursor,
        .custom-cursor.cursor-hidden {
          display: none !important;
          opacity: 0 !important;
        }
        .cursor-trail {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, hsl(var(--primary) / 0.18) 0%, rgba(147, 51, 234, 0.08) 50%, transparent 80%);
          filter: blur(8px);
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }
        .cursor-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: hsl(var(--primary));
          box-shadow: 0 0 16px 2px hsl(var(--primary) / 0.9), 0 0 30px 6px hsl(var(--primary) / 0.4);
          transition: transform 0.15s ease, opacity 0.15s ease;
        }
        .cursor-ring {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid hsl(var(--primary) / 0.6);
          background: hsl(var(--primary) / 0.05);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: width 0.25s cubic-bezier(0.25, 1, 0.5, 1), height 0.25s cubic-bezier(0.25, 1, 0.5, 1), border-radius 0.25s ease, background-color 0.25s ease, border-color 0.25s ease;
        }
        .cursor-ring.cursor-hovering {
          width: 64px;
          height: 64px;
          margin: -10px 0 0 -10px;
          background: hsl(var(--primary) / 0.15);
          border-color: hsl(var(--primary) / 0.9);
          box-shadow: 0 0 30px -2px hsl(var(--primary) / 0.4);
        }
        .cursor-ring.cursor-project {
          width: 84px;
          height: 84px;
          margin: -20px 0 0 -20px;
          background: hsl(var(--primary) / 0.9);
          border-color: hsl(var(--primary-foreground) / 0.6);
          box-shadow: 0 0 40px 6px hsl(var(--primary) / 0.6);
        }
        .cursor-dot.cursor-hovering {
          transform: scale(0.5);
        }
        .cursor-dot.cursor-hidden {
          opacity: 0;
          transform: scale(0);
        }
        .cursor-ring.cursor-clicking {
          transform: scale(0.85);
        }
        .cursor-badge-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: hsl(var(--primary-foreground));
          text-transform: uppercase;
        }
        @media (pointer: coarse) {
          .custom-cursor { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .custom-cursor { display: none !important; }
        }
      `}</style>
      <div ref={trailRef} className="custom-cursor cursor-trail" aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="custom-cursor cursor-ring" aria-hidden="true">
        {badgeText && (
          <span ref={badgeRef} className="cursor-badge-text">
            {badgeText}
          </span>
        )}
      </div>
    </>
  );

  return createPortal(cursorContent, document.body);
};

export default CustomCursor;
