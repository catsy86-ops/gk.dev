import { useRef, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useThemeCanvasColor } from "@/hooks/use-theme-canvas-color";

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

interface Ring {
  cx: number;
  cy: number;
  radius: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

export function CanvasSkillsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { hsla, hslaLight } = useThemeCanvasColor();

  useEffect(() => {
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let w = 0;
    let h = 0;

    const particles: Particle[] = [];
    const rings: Ring[] = [];

    const init = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles.length = 0;
      rings.length = 0;

      const pCount = isMobile ? 25 : 50;
      for (let i = 0; i < pCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: 0.8 + Math.random() * 1.5,
          opacity: 0.04 + Math.random() * 0.08,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.5 + Math.random() * 1,
        });
      }

      if (!isMobile) {
        const ringCount = 3;
        for (let i = 0; i < ringCount; i++) {
          rings.push({
            cx: w * (0.2 + Math.random() * 0.6),
            cy: h * (0.2 + Math.random() * 0.6),
            radius: 60 + Math.random() * 120,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (0.002 + Math.random() * 0.003) * (i % 2 === 0 ? 1 : -1),
            opacity: 0.03 + Math.random() * 0.02,
          });
        }
      }
    };

    init();

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const t = time * 0.001;

      rings.forEach((ring) => {
        ring.rotation += ring.rotationSpeed;
        ctx.beginPath();
        ctx.ellipse(ring.cx, ring.cy, ring.radius, ring.radius * 0.4, ring.rotation, 0, Math.PI * 2);
        ctx.strokeStyle = hsla(ring.opacity);
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      particles.forEach((p) => {
        const pulse = 0.6 + Math.sin(t * p.pulseSpeed + p.pulse) * 0.4;
        ctx.beginPath();
        ctx.fillStyle = hslaLight(p.opacity * pulse);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    const ro = new ResizeObserver(init);
    ro.observe(canvas.parentElement!);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [prefersReduced, isMobile, hsla, hslaLight]);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}