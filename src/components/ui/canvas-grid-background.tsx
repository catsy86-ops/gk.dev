import { useRef, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface GridPoint {
  x: number;
  y: number;
  baseOpacity: number;
  phase: number;
}

export function CanvasGridBackground() {
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
    let points: GridPoint[] = [];

    const spacing = 70;
    const connectionDist = 100;

    const initPoints = () => {
      points = [];
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          points.push({
            x: c * spacing + (Math.random() - 0.5) * 10,
            y: r * spacing + (Math.random() - 0.5) * 10,
            baseOpacity: 0.04 + Math.random() * 0.06,
            phase: Math.random() * Math.PI * 2,
          });
        }
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
      initPoints();
    };

    resize();

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      const t = time * 0.001;

      // Draw connections
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.035;
            ctx.beginPath();
            ctx.strokeStyle = `hsla(217, 91%, 60%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw points
      points.forEach((p) => {
        const pulse = 0.6 + Math.sin(t * 0.8 + p.phase) * 0.4;
        const alpha = p.baseOpacity * pulse;
        ctx.beginPath();
        ctx.fillStyle = `hsla(217, 91%, 65%, ${alpha})`;
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
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
