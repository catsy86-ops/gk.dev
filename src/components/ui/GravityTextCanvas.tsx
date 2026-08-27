import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface GravityTextCanvasProps {
  text: string;
  fontSize: number;
  color?: string[];
  "aria-label"?: string;
}

interface Particle {
  char: string;
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  mass: number;
}

export const GravityTextCanvas = ({
  text,
  fontSize,
  color = ["#3b82f6", "#6366f1"],
  "aria-label": ariaLabel,
}: GravityTextCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isHoveredRef = useRef(false);
  const mouseRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || prefersReduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || typeof ctx.measureText !== "function") return;

    const family = `italic ${fontSize}px 'Instrument_Serif', Georgia, serif`;
    ctx.font = family;

    const chars = text.split("");
    const metrics = chars.map((c) => ctx.measureText(c));
    const totalWidth = metrics.reduce((acc, m) => acc + m.width, 0);
    const capHeight = fontSize * 0.72;

    canvas.width = Math.ceil(totalWidth) + 8;
    canvas.height = Math.ceil(fontSize * 1.4);

    let cursorX = 2;
    particlesRef.current = chars.map((char, i) => {
      const w = metrics[i].width;
      const ox = cursorX;
      const oy = capHeight;
      cursorX += w;
      return { char, x: ox, y: oy, ox, oy, vx: 0, vy: 0, mass: 0.9 + Math.random() * 0.2 };
    });

    const floorY = canvas.height - 2;
    const GRAVITY = 0.42;
    const BOUNCE = 0.58;
    const REPULSION_RADIUS = 90;
    const LERP_STRENGTH = 0.065;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = family;
      ctx.textBaseline = "alphabetic";

      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      grad.addColorStop(0, color[0] ?? "#3b82f6");
      grad.addColorStop(1, color[1] ?? "#6366f1");
      ctx.fillStyle = grad;

      for (const p of particlesRef.current) {
        if (isHoveredRef.current) {
          p.vy += GRAVITY * p.mass;
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPULSION_RADIUS && dist > 0) {
            const force = (REPULSION_RADIUS - dist) / REPULSION_RADIUS;
            p.vx += (dx / dist) * force * 2.5;
            p.vy += (dy / dist) * force * 2.5;
          }
          p.x += p.vx;
          p.y += p.vy;
          if (p.y > floorY) { p.y = floorY; p.vy *= -BOUNCE; p.vx *= 0.88; }
          if (p.x < 0) { p.x = 0; p.vx *= -0.5; }
          if (p.x > canvas.width) { p.x = canvas.width; p.vx *= -0.5; }
        } else {
          p.x += (p.ox - p.x) * LERP_STRENGTH;
          p.y += (p.oy - p.y) * LERP_STRENGTH;
          p.vx *= 0.78;
          p.vy *= 0.78;
        }
        ctx.fillText(p.char, p.x, p.y);
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted, prefersReduced, text, fontSize, color]);

  if (!mounted || prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{ height: `${fontSize * 1.4}px`, display: "inline-block", cursor: "pointer", userSelect: "none" }}
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; mouseRef.current = { x: -999, y: -999 }; }}
      onMouseMove={(e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }}
      aria-label={ariaLabel ?? text}
      role="img"
    />
  );
};
