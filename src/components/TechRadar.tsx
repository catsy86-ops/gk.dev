import { useState } from "react";
import { motion } from "motion/react";
import { Radar, Sparkles, Activity, ShieldCheck, Zap } from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticLight } from "@/lib/haptics";

interface RadarNode {
  id: string;
  name: string;
  category: "frontend" | "backend" | "cloud" | "ai";
  angle: number; // degrees
  radius: number; // % from center
  level: "Expert" | "Mastery" | "Advanced";
  years: string;
}

const radarNodes: RadarNode[] = [
  { id: "react", name: "React 19", category: "frontend", angle: 30, radius: 28, level: "Mastery", years: "7+ lat" },
  { id: "ts", name: "TypeScript", category: "frontend", angle: 65, radius: 22, level: "Mastery", years: "6+ lat" },
  { id: "next", name: "Next.js 15", category: "frontend", angle: 110, radius: 34, level: "Mastery", years: "5+ lat" },
  { id: "node", name: "Node.js", category: "backend", angle: 155, radius: 48, level: "Expert", years: "6+ lat" },
  { id: "pg", name: "PostgreSQL", category: "backend", angle: 195, radius: 52, level: "Expert", years: "5+ lat" },
  { id: "nest", name: "NestJS", category: "backend", angle: 225, radius: 58, level: "Expert", years: "4+ lat" },
  { id: "aws", name: "AWS Cloud", category: "cloud", angle: 270, radius: 72, level: "Advanced", years: "4+ lat" },
  { id: "docker", name: "Docker", category: "cloud", angle: 310, radius: 76, level: "Advanced", years: "4+ lat" },
  { id: "ai", name: "AI / LLM APIs", category: "ai", angle: 345, radius: 65, level: "Advanced", years: "2+ lata" },
];

export const TechRadar = () => {
  const [activeNode, setActiveNode] = useState<RadarNode | null>(radarNodes[0]);

  return (
    <div className="relative w-full rounded-3xl border border-primary/20 bg-gradient-to-b from-card/90 via-card/60 to-background/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl overflow-hidden mb-12">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Radar className="h-4 w-4 animate-spin [animation-duration:8s]" />
          </div>
          <div>
            <h3 className="font-['Geist'] text-base font-bold text-foreground flex items-center gap-2">
              <span>Radar Architektury & Kompetencji</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="font-mono text-xs text-muted-foreground">360° Real-Time Technology Telemetry</p>
          </div>
        </div>

        {/* Selected Node Status Pill */}
        {activeNode && (
          <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-secondary/80 border border-border/70 backdrop-blur-md">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-primary">
              <Zap className="h-3.5 w-3.5" />
              <span>{activeNode.name}</span>
            </div>
            <span className="h-3 w-[1px] bg-border" />
            <span className="font-mono text-[11px] text-muted-foreground">{activeNode.level} • {activeNode.years}</span>
          </div>
        )}
      </div>

      {/* Radar Canvas Display Area */}
      <div className="relative aspect-square max-w-[420px] mx-auto flex items-center justify-center">
        {/* Concentric Rings */}
        <div className="absolute inset-0 rounded-full border border-primary/20 flex items-center justify-center pointer-events-none">
          <div className="w-[75%] h-[75%] rounded-full border border-primary/20 flex items-center justify-center">
            <div className="w-[66%] h-[66%] rounded-full border border-primary/25 flex items-center justify-center">
              <div className="w-[50%] h-[50%] rounded-full border border-primary/30 flex items-center justify-center">
                {/* Core Nucleus */}
                <div className="h-5 w-5 rounded-full bg-primary/20 border border-primary/60 flex items-center justify-center shadow-lg shadow-primary/40">
                  <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Crosshair Lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-[1px] bg-primary/15" />
          <div className="h-full w-[1px] bg-primary/15 absolute" />
        </div>

        {/* Rotating Radar Scan Sweep Beam */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(59, 130, 246, 0.25) 360deg)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        {/* Nodes plotted on polar coordinates */}
        {radarNodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          const r = node.radius * 2; // scale for percentage radius
          const x = 50 + (r / 2) * Math.cos(rad);
          const y = 50 + (r / 2) * Math.sin(rad);
          const isSelected = activeNode?.id === node.id;

          return (
            <button
              key={node.id}
              onClick={() => {
                soundEngine.playPop(850, 0.02);
                hapticLight();
                setActiveNode(node);
              }}
              onMouseEnter={() => {
                soundEngine.playPop(750, 0.015);
                setActiveNode(node);
              }}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute z-20 group p-1.5 focus:outline-none"
              aria-label={`Technologia: ${node.name}`}
            >
              <div className="relative flex items-center justify-center">
                {/* Ping wave for active */}
                {isSelected && (
                  <span className="absolute -inset-1.5 rounded-full bg-primary/30 animate-ping" />
                )}

                {/* Node Dot */}
                <div
                  className={`h-4 w-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center shadow-md ${
                    isSelected
                      ? "bg-primary border-white scale-125 shadow-primary/60"
                      : "bg-card border-primary/50 group-hover:border-primary group-hover:scale-110"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>

                {/* Floating Label */}
                <span
                  className={`absolute top-5 whitespace-nowrap font-mono text-[10px] px-2 py-0.5 rounded-md border backdrop-blur-md transition-all pointer-events-none ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary font-bold shadow-md scale-105"
                      : "bg-card/90 text-foreground border-border/80 group-hover:border-primary/50"
                  }`}
                >
                  {node.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Radar Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-border/60 text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span>Core (0–35%)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
          <span>Backend (35–60%)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
          <span>Cloud & AI (60–100%)</span>
        </span>
      </div>
    </div>
  );
};
