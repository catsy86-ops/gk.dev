/**
 * Ultra-lightweight particle physics confetti engine (Zero dependencies, pure Canvas API)
 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  opacity: number;
}

export const triggerConfetti = (originX?: number, originY?: number) => {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "999999";
  document.body.appendChild(canvas);

  let ctx: CanvasRenderingContext2D | null = null;
  try {
    ctx = canvas.getContext("2d");
  } catch {
    ctx = null;
  }

  if (!ctx) {
    if (document.body.contains(canvas)) {
      document.body.removeChild(canvas);
    }
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const startX = originX ?? width / 2;
  const startY = originY ?? height * 0.7;

  const colors = [
    "#3b82f6",
    "#10b981",
    "#8b5cf6",
    "#f59e0b",
    "#ec4899",
    "#06b6d4",
    "#ffffff",
  ];

  const count = 75;
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * (Math.random() * 1.5 - 1.25)); // upwards burst
    const speed = Math.random() * 12 + 6;
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy: -Math.abs(Math.sin(angle) * speed),
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      opacity: 1,
    });
  }

  let frameId = 0;
  const gravity = 0.35;
  const drag = 0.98;

  const render = () => {
    ctx.clearRect(0, 0, width, height);

    let aliveCount = 0;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += gravity;
      p.vx *= drag;
      p.vy *= drag;
      p.rotation += p.vRot;
      p.opacity -= 0.012;

      if (p.opacity > 0 && p.y < height) {
        aliveCount++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    }

    if (aliveCount > 0) {
      frameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(frameId);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  };

  frameId = requestAnimationFrame(render);
};
