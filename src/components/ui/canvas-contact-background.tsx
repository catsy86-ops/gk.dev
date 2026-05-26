import { useRef, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface Bubble {
  x: number;
  y: number;
  r: number;
  speed: number;
  opacity: number;
  drift: number;
  driftPhase: number;
}

interface Shape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  sides: number;
}

export function CanvasContactBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");

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
    const shapes: Shape[] = [];

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

      bubbles.length = 0;
      shapes.length = 0;

      const bubbleCount = isMobile ? 15 : 30;
      for (let i = 0; i < bubbleCount; i++) {
        bubbles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1 + Math.random() * 2.5,
          speed: 3 + Math.random() * 8,
          opacity: 0.04 + Math.random() * 0.06,
          drift: 2 + Math.random() * 4,
          driftPhase: Math.random() * Math.PI * 2,
        });
      }

      if (!isMobile) {
        const shapeCount = 4;
        for (let i = 0; i < shapeCount; i++) {
          shapes.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: 20 + Math.random() * 40,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.005,
            opacity: 0.02 + Math.random() * 0.03,
            sides: 6,
          });
        }
      }
    };

    init();

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const t = time * 0.001;

      shapes.forEach((s) => {
        s.rotation += s.rotationSpeed;
        ctx.beginPath();
        for (let i = 0; i <= s.sides; i++) {
          const angle = (i / s.sides) * Math.PI * 2 + s.rotation;
          const px = s.x + Math.cos(angle) * s.size;
          const py = s.y + Math.sin(angle) * s.size;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `hsla(217, 91%, 60%, ${s.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      bubbles.forEach((b) => {
        b.y -= b.speed * 0.016;
        if (b.y < -b.r) {
          b.y = h + b.r;
          b.x = Math.random() * w;
        }
        const driftX = Math.sin(t * 0.5 + b.driftPhase) * b.drift;
        const pulse = 0.7 + Math.sin(t * 1.2 + b.driftPhase) * 0.3;
        ctx.beginPath();
        ctx.fillStyle = `hsla(217, 91%, 65%, ${b.opacity * pulse})`;
        ctx.arc(b.x + driftX, b.y, b.r, 0, Math.PI * 2);
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
  }, [prefersReduced, isMobile]);

  if (prefersReduced || isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}