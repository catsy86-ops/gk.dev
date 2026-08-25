import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Smart Morphing CustomCursor (Awwwards 2026 standard)
 * Features dynamic contextual states, magnetic physics, and zero React re-renders on mousemove.
 */
const CustomCursor = () => {
  const isTouch = useMediaQuery("(pointer: coarse)");
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [badgeText, setBadgeText] = useState("");

  useEffect(() => {
    if (isTouch || prefersReduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const badge = badgeRef.current;
    if (!dot || !ring) return;

    // Hide system cursor
    document.body.classList.add("cursor-none");

    let rafId = 0;
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    const render = () => {
      // Elastic trailing for ring (smooth interpolation)
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      dot.style.transform = `translate3d(${mouseX - 6}px, ${mouseY - 6}px, 0)`;
      ring.style.transform = `translate3d(${ringX - 22}px, ${ringY - 22}px, 0)`;

      if (Math.abs(mouseX - ringX) > 0.1 || Math.abs(mouseY - ringY) > 0.1) {
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

      const isProject = target.closest("[data-cursor='project']") !== null || target.closest(".project-card") !== null;
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
        .cursor-none, .cursor-none * {
          cursor: none !important;
        }
        .custom-cursor {
          pointer-events: none;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 999999;
          will-change: transform;
        }
        .cursor-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: hsl(var(--primary));
          box-shadow: 0 0 16px 2px hsl(var(--primary) / 0.8), 0 0 30px 6px hsl(var(--primary) / 0.3);
          transition: transform 0.15s ease, opacity 0.15s ease;
        }
        .cursor-ring {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid hsl(var(--primary) / 0.5);
          background: hsl(var(--primary) / 0.04);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: width 0.25s cubic-bezier(0.25, 1, 0.5, 1), height 0.25s cubic-bezier(0.25, 1, 0.5, 1), border-radius 0.25s ease, background-color 0.25s ease, border-color 0.25s ease;
        }
        .cursor-ring.cursor-hovering {
          width: 64px;
          height: 64px;
          margin: -10px 0 0 -10px;
          background: hsl(var(--primary) / 0.12);
          border-color: hsl(var(--primary) / 0.8);
          box-shadow: 0 0 25px -4px hsl(var(--primary) / 0.3);
        }
        .cursor-ring.cursor-project {
          width: 84px;
          height: 84px;
          margin: -20px 0 0 -20px;
          background: hsl(var(--primary) / 0.85);
          border-color: hsl(var(--primary-foreground) / 0.5);
          box-shadow: 0 0 35px 5px hsl(var(--primary) / 0.5);
        }
        .cursor-dot.cursor-hovering {
          transform: scale(0.6);
        }
        .cursor-dot.cursor-hidden {
          opacity: 0;
          transform: scale(0);
        }
        .cursor-ring.cursor-clicking {
          transform: scale(0.85);
        }
        .cursor-badge-text {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
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
