import { useRef, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useThemeCanvasColor } from "@/hooks/use-theme-canvas-color";

interface Bubble {
  x: number;
  y: number;
  r: number;
  speed: number;
  opacity: number;
  drift: number;
  driftPhase: number;
}

export function CanvasBubblesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { hslaLight } = useThemeCanvasColor();

  useEffect(() => {
    if (prefersReduced || isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let w = 0;
    let h = 0;
    const bubbles: Bubble[] = [];

    const initBubbles = () => {
      bubbles.length = 0;
      const count = Math.floor((w * h) / 25000);
      for (let i = 0; i < count; i++) {
        bubbles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1 + Math.random() * 2.5,
          speed: 4 + Math.random() * 8,
          opacity: 0.04 + Math.random() * 0.06,
          drift: 2 + Math.random() * 4,
          driftPhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const resize = () => {
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
      initBubbles();
    };

    resize();

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const t = time * 0.001;

      bubbles.forEach((b) => {
        b.y -= b.speed * 0.016;
        if (b.y < -b.r) {
          b.y = h + b.r;
          b.x = Math.random() * w;
        }

        const driftX = Math.sin(t * 0.5 + b.driftPhase) * b.drift;
        const pulse = 0.7 + Math.sin(t * 1.2 + b.driftPhase) * 0.3;

        ctx.beginPath();
        ctx.fillStyle = hslaLight(b.opacity * pulse);
        ctx.arc(b.x + driftX, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [prefersReduced, isMobile, hslaLight]);

  if (prefersReduced || isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
