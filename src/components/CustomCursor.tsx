import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  isClicking: boolean;
  hoveredElement: string | null;
}

const CustomCursor = () => {
  const [cursor, setCursor] = useState<CursorState>({
    x: -100,
    y: -100,
    isHovering: false,
    isClicking: false,
    hoveredElement: null,
  });
  const [trails, setTrails] = useState<Array<{ id: number; x: number; y: number; key: string }>>([]);
  const trailIdRef = useRef(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number>(0);
  const posRef = useRef({ x: -100, y: -100 });

  const updateCursorPosition = useCallback(() => {
    setCursor((prev) => ({
      ...prev,
      x: posRef.current.x,
      y: posRef.current.y,
    }));

    const newX = posRef.current.x;
    const newY = posRef.current.y;
    const dist = Math.hypot(newX - lastPositionRef.current.x, newY - lastPositionRef.current.y);
    if (dist > 15) {
      trailIdRef.current += 1;
      setTrails((prev) => [
        ...prev.slice(-20),
        { id: trailIdRef.current, x: newX, y: newY, key: `trail-${trailIdRef.current}` },
      ]);
      lastPositionRef.current = { x: newX, y: newY };
    }
    rafIdRef.current = 0;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(updateCursorPosition);
      }
    };

    const handleMouseDown = () => {
      setCursor((prev) => ({ ...prev, isClicking: true }));
    };

    const handleMouseUp = () => {
      setCursor((prev) => ({ ...prev, isClicking: false }));
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const isInteractive =
        tagName === "a" ||
        tagName === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.getAttribute("role") === "button";

      if (isInteractive) {
        setCursor((prev) => ({
          ...prev,
          isHovering: true,
          hoveredElement: target.getAttribute("aria-label") || tagName,
        }));
      }
    };

    const handleMouseOut = () => {
      setCursor((prev) => ({
        ...prev,
        isHovering: false,
        hoveredElement: null,
      }));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
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
        }
        @media (pointer: coarse) {
          .custom-cursor {
            display: none;
          }
        }
      `}</style>

      {/* Trail particles */}
      <AnimatePresence>
        {trails.map((trail, i) => (
          <motion.div
            key={trail.key}
            className="custom-cursor"
            initial={{ x: trail.x - 4, y: trail.y - 4, opacity: 0.6, scale: 1 }}
            animate={{
              x: trail.x - 4,
              y: trail.y - 4,
              opacity: 0,
              scale: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "hsl(var(--primary))",
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main cursor dot */}
      <motion.div
        className="custom-cursor"
        animate={{
          x: cursor.x - 6,
          y: cursor.y - 6,
          scale: cursor.isClicking ? 0.6 : cursor.isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "hsl(var(--primary))",
        }}
      />

      {/* Cursor ring */}
      <motion.div
        className="custom-cursor"
        animate={{
          x: cursor.x - 20,
          y: cursor.y - 20,
          scale: cursor.isHovering ? 1.8 : 1,
          opacity: cursor.isHovering ? 0.8 : 0.4,
          rotate: cursor.isClicking ? 45 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 0.8,
        }}
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