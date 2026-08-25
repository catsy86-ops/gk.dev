import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export const ClickSpark = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (prefersReduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sparks: Spark[] = [];
    let rafId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const colors = [
      "hsl(221, 83%, 53%)", // Primary Blue
      "hsl(190, 95%, 50%)", // Cyan
      "hsl(265, 89%, 66%)", // Violet
      "hsl(160, 84%, 39%)", // Emerald
    ];

    const handleClick = (e: MouseEvent) => {
      const sparkCount = 7;
      const x = e.clientX;
      const y = e.clientY;

      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5;
        const speed = 2 + Math.random() * 3.5;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 2.5,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.08; // subtle gravity
        s.alpha *= 0.91; // fade

        if (s.alpha <= 0.02) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (sparks.length > 0) {
        rafId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rafId = 0;
      }
    };

    window.addEventListener("click", handleClick, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[999998]"
      aria-hidden="true"
    />
  );
};
