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
  vx: number;
  vy: number;
}

interface Box {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

export function CanvasProjectsBackground() {
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
    const boxes: Box[] = [];

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
      boxes.length = 0;

      const pCount = isMobile ? 20 : 50;
      for (let i = 0; i < pCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: 0.8 + Math.random() * 1.5,
          opacity: 0.04 + Math.random() * 0.08,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.5 + Math.random() * 1,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
        });
      }

      const bCount = isMobile ? 2 : 5;
      for (let i = 0; i < bCount; i++) {
        boxes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: 15 + Math.random() * 30,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.003,
          opacity: 0.025 + Math.random() * 0.025,
        });
      }
    };

    init();

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const t = time * 0.001;

      boxes.forEach((b) => {
        b.rotation += b.rotationSpeed;
        ctx.beginPath();
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rotation);
        ctx.strokeStyle = hsla(b.opacity);
        ctx.lineWidth = 0.8;
        ctx.strokeRect(-b.size / 2, -b.size / 2, b.size, b.size);
        ctx.restore();
      });

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

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