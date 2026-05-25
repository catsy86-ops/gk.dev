import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * CustomCursor — bulletproof decorative cursor.
 *
 * Renders via createPortal directly into document.body to avoid any
 * stacking-context / overflow-hidden issues from parent React layout.
 *
 * Uses direct DOM translate3d (0 React re-renders on mouse move).
 *
 * Accessibility:
 * - Hidden on touch/coarse-pointer devices
 * - Hidden when prefers-reduced-motion is set
 * - All elements are aria-hidden
 */
const CustomCursor = () => {
  const isTouch = useMediaQuery("(pointer: coarse)");
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouch || prefersReduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Hide system cursor while component is mounted
    document.body.classList.add("cursor-none");

    let rafId = 0;
    let pos = { x: -100, y: -100 };

    const onMove = (e: MouseEvent) => {
      pos = { x: e.clientX, y: e.clientY };
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        dot.style.transform = `translate3d(${pos.x - 10}px, ${pos.y - 10}px, 0)`;
        ring.style.transform = `translate3d(${pos.x - 26}px, ${pos.y - 26}px, 0)`;
        rafId = 0;
      });
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
      let isInteractive = false;
      try {
        isInteractive = window.getComputedStyle(target).cursor === "pointer";
      } catch { /* SSR */ }
      if (!isInteractive) {
        const tag = target.tagName;
        isInteractive =
          tag === "A" || tag === "BUTTON" || tag === "INPUT" ||
          tag === "TEXTAREA" || tag === "SELECT" || tag === "LABEL" ||
          target.closest("a") !== null || target.closest("button") !== null ||
          target.getAttribute("role") === "button" ||
          target.getAttribute("contenteditable") === "true";
      }
      if (isInteractive) {
        dot.classList.add("cursor-hovering");
        ring.classList.add("cursor-hovering");
      }
    };

    const onOut = () => {
      dot.classList.remove("cursor-hovering");
      ring.classList.remove("cursor-hovering");
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
  }, []);

  // Feature-gate: skip rendering on touch / reduced-motion
  if (isTouch || prefersReduced) return null;

  const cursorContent = (
    <>
      <style>{`
        .cursor-none, .cursor-none * {
          cursor: none !important;
        }
        .custom-cursor {
          pointer-events: none;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 99999;
          will-change: transform;
        }
        .cursor-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          border: 2.5px solid hsl(var(--background));
          box-shadow: 0 0 0 1.5px hsl(var(--primary) / 0.5), 0 0 14px 3px hsl(var(--primary) / 0.25);
          transition: width 0.2s ease, height 0.2s ease, margin 0.2s ease;
        }
        .cursor-ring {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 2px solid hsl(var(--primary));
          background: transparent;
          box-shadow: 0 0 0 1px hsl(var(--background)), 0 0 18px 3px hsl(var(--primary) / 0.2);
          opacity: 0.35;
          transition: opacity 0.2s ease, width 0.2s ease, height 0.2s ease, margin 0.2s ease;
        }
        .cursor-dot.cursor-hovering {
          width: 30px;
          height: 30px;
          margin: -5px 0 0 -5px;
        }
        .cursor-ring.cursor-hovering {
          width: 78px;
          height: 78px;
          margin: -13px 0 0 -13px;
          opacity: 0.6;
        }
        .cursor-dot.cursor-clicking {
          width: 14px;
          height: 14px;
          margin: 3px 0 0 3px;
        }
        .cursor-ring.cursor-clicking {
          width: 40px;
          height: 40px;
          margin: 6px 0 0 6px;
          opacity: 0.2;
        }
        @media (pointer: coarse) {
          .custom-cursor { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .custom-cursor { display: none !important; }
        }
      `}</style>
      <div ref={dotRef} className="custom-cursor cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="custom-cursor cursor-ring" aria-hidden="true" />
    </>
  );

  return createPortal(cursorContent, document.body);
};

export default CustomCursor;
