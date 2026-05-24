import { useRef, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface FlowLine {
  y: number;
  speed: number;
  opacity: number;
  width: number;
}

interface FlowParticle {
  x: number;
  y: number;
  lineIndex: number;
  speed: number;
  size: number;
  opacity: number;
}

export function CanvasFlowBackground() {
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
    };

    resize();

    const lineCount = 12;
    const lines: FlowLine[] = [];
    for (let i = 0; i < lineCount; i++) {
      lines.push({
        y: ((i + 0.5) / lineCount) * h,
        speed: 15 + Math.random() * 25,
        opacity: 0.03 + Math.random() * 0.04,
        width: 0.5 + Math.random() * 0.5,
      });
    }

    const particleCount = 24;
    const particles: FlowParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const lineIdx = Math.floor(Math.random() * lineCount);
      particles.push({
        x: Math.random() * w,
        y: lines[lineIdx].y + (Math.random() - 0.5) * 4,
        lineIndex: lineIdx,
        speed: lines[lineIdx].speed * (0.8 + Math.random() * 0.4),
        size: 1 + Math.random() * 1.5,
        opacity: 0.15 + Math.random() * 0.2,
      });
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      // Draw flow lines
      lines.forEach((line) => {
        const offset = (time * 0.001 * line.speed) % w;
        ctx.beginPath();
        ctx.strokeStyle = `hsla(217, 91%, 60%, ${line.opacity})`;
        ctx.lineWidth = line.width;

        // Dashed line effect with two segments
        const segLen = w * 0.6;
        const gapLen = w * 0.4;
        const start = ((offset - segLen) % (segLen + gapLen) + (segLen + gapLen)) % (segLen + gapLen);

        ctx.moveTo(start, line.y);
        ctx.lineTo(Math.min(start + segLen, w), line.y);

        if (start + segLen > w) {
          ctx.moveTo(0, line.y);
          ctx.lineTo((start + segLen) % (segLen + gapLen), line.y);
        }
        ctx.stroke();
      });

      // Draw particles
      particles.forEach((p) => {
        const line = lines[p.lineIndex];
        p.x += p.speed * 0.016;
        if (p.x > w + 10) p.x = -10;

        const pulse = 0.8 + Math.sin(time * 0.003 + p.lineIndex) * 0.2;
        ctx.beginPath();
        ctx.fillStyle = `hsla(217, 91%, 70%, ${p.opacity * pulse})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
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
