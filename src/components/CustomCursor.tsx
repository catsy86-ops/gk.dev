import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CURSOR_TRAIL_MAX, CURSOR_TRAIL_MIN_DISTANCE } from "@/constants/animations";

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  isClicking: boolean;
}

interface Trail {
  id: number;
  x: number;
  y: number;
}

/**
 * CustomCursor — decorative cursor with trail effect.
 *
 * Accessibility:
 * - Hidden on touch/coarse-pointer devices (CSS media query)
 * - Hidden when prefers-reduced-motion is set
 * - All elements are aria-hidden
 *
 * Performance:
 * - Uses RAF batching to avoid excessive re-renders
 * - Properly cancels RAF on unmount (no memory leak)
 * - Passive event listeners
 */
const CustomCursor = () => {
  const [cursor, setCursor] = useState<CursorState>({
    x: -100,
    y: -100,
    isHovering: false,
    isClicking: false,
  });
  const [trails, setTrails] = useState<Trail[]>([]);

  const trailIdRef = useRef(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  // Store RAF id — initialise to null so we can safely check
  const rafIdRef = useRef<number | null>(null);
  const posRef = useRef({ x: -100, y: -100 });
  // Track mount state to prevent setState after unmount
  const mountedRef = useRef(true);

  const updateCursorPosition = useCallback(() => {
    if (!mountedRef.current) return;

    const { x: newX, y: newY } = posRef.current;

    setCursor((prev) => ({ ...prev, x: newX, y: newY }));

    const dist = Math.hypot(
      newX - lastPositionRef.current.x,
      newY - lastPositionRef.current.y,
    );

    if (dist > CURSOR_TRAIL_MIN_DISTANCE) {
      trailIdRef.current += 1;
      const id = trailIdRef.current;
      setTrails((prev) => [...prev.slice(-CURSOR_TRAIL_MAX), { id, x: newX, y: newY }]);
      lastPositionRef.current = { x: newX, y: newY };
    }

    rafIdRef.current = null;
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(updateCursorPosition);
      }
    };

    const handleMouseDown = () => {
      if (mountedRef.current) setCursor((prev) => ({ ...prev, isClicking: true }));
    };

    const handleMouseUp = () => {
      if (mountedRef.current) setCursor((prev) => ({ ...prev, isClicking: false }));
    };

    const handleMouseOver = (e: MouseEvent) => {
      if (!mountedRef.current) return;
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") !== null ||
        target.closest("button") !== null ||
        target.getAttribute("role") === "button";

      if (isInteractive) {
        setCursor((prev) => ({ ...prev, isHovering: true }));
      }
    };

    const handleMouseOut = () => {
      if (mountedRef.current) setCursor((prev) => ({ ...prev, isHovering: false }));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      mountedRef.current = false;

      // Cancel any pending RAF before removing listeners
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [updateCursorPosition]);

  return (
    <>
      <style>{`
        .custom-cursor {
          pointer-events: none;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
          mix-blend-mode: difference;
          will-change: transform;
        }
        /* Hide on touch / coarse-pointer devices */
        @media (pointer: coarse) {
          .custom-cursor { display: none; }
        }
        /* Respect user's motion preference */
        @media (prefers-reduced-motion: reduce) {
          .custom-cursor { display: none; }
        }
      `}</style>

      {/* Trail particles */}
      <AnimatePresence>
        {trails.map((trail) => (
          <motion.div
            key={trail.id}
            className="custom-cursor"
            aria-hidden="true"
            initial={{ x: trail.x - 4, y: trail.y - 4, opacity: 0.6, scale: 1 }}
            animate={{ x: trail.x - 4, y: trail.y - 4, opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ width: 8, height: 8, borderRadius: "50%", background: "hsl(var(--primary))" }}
          />
        ))}
      </AnimatePresence>

      {/* Main cursor dot */}
      <motion.div
        className="custom-cursor"
        aria-hidden="true"
        animate={{
          x: cursor.x - 6,
          y: cursor.y - 6,
          scale: cursor.isClicking ? 0.6 : cursor.isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
        style={{ width: 12, height: 12, borderRadius: "50%", background: "hsl(var(--primary))" }}
      />

      {/* Cursor ring */}
      <motion.div
        className="custom-cursor"
        aria-hidden="true"
        animate={{
          x: cursor.x - 20,
          y: cursor.y - 20,
          scale: cursor.isHovering ? 1.8 : 1,
          opacity: cursor.isHovering ? 0.8 : 0.4,
          rotate: cursor.isClicking ? 45 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.8 }}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "2px solid hsl(var(--primary))",
          background: "transparent",
        }}
      />
    </>
  );
};

export default CustomCursor;
