import { motion } from "motion/react";
import {
  CalendarCheck2,
  HardHat,
  Flame,
  FileText,
  Leaf,
  Activity,
  Calculator,
  Heart,
  Footprints,
  Beer,
  Percent,
  UtensilsCrossed,
  Train,
  CalendarClock,
  Target,
  ShoppingBag,
  Sparkles,
  Scissors,
  BookOpen,
  Kanban,
  Gamepad2,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface ProjectSvgThumbnailProps {
  projectId: string;
  category: string;
  accent: string;
  isHovered?: boolean;
}

const iconRegistry: Record<
  string,
  {
    icon: LucideIcon;
    color: string;
    gradient: [string, string];
    label: string;
    symbol: string;
  }
> = {
  przypominacz: {
    icon: CalendarCheck2,
    color: "#3b82f6",
    gradient: ["#3b82f6", "#60a5fa"],
    label: "TASK ENGINE",
    symbol: "01",
  },
  budowlancy: {
    icon: HardHat,
    color: "#f59e0b",
    gradient: ["#f59e0b", "#fbbf24"],
    label: "BUILD HUB",
    symbol: "02",
  },
  dymek: {
    icon: Flame,
    color: "#ec4899",
    gradient: ["#ec4899", "#f43f5e"],
    label: "LOUNGE",
    symbol: "03",
  },
  "pdf-seven-orcin": {
    icon: FileText,
    color: "#ef4444",
    gradient: ["#ef4444", "#f87171"],
    label: "PDF ENGINE",
    symbol: "04",
  },
  "thc-beige": {
    icon: Leaf,
    color: "#10b981",
    gradient: ["#10b981", "#34d399"],
    label: "DISPENSARY",
    symbol: "05",
  },
  wytrzezwialka: {
    icon: Activity,
    color: "#06b6d4",
    gradient: ["#06b6d4", "#22d3ee"],
    label: "BAC CALC",
    symbol: "06",
  },
  wycenka: {
    icon: Calculator,
    color: "#8b5cf6",
    gradient: ["#8b5cf6", "#a78bfa"],
    label: "ESTIMATOR",
    symbol: "07",
  },
  koty2: {
    icon: Heart,
    color: "#f43f5e",
    gradient: ["#f43f5e", "#fb7185"],
    label: "ADOPTION",
    symbol: "08",
  },
  kroki2: {
    icon: Footprints,
    color: "#14b8a6",
    gradient: ["#14b8a6", "#2dd4bf"],
    label: "FITNESS",
    symbol: "09",
  },
  "piwo-mierz": {
    icon: Beer,
    color: "#eab308",
    gradient: ["#eab308", "#facc15"],
    label: "CRAFT BEER",
    symbol: "10",
  },
  cwaniak: {
    icon: Percent,
    color: "#f97316",
    gradient: ["#f97316", "#fb923c"],
    label: "DEALS",
    symbol: "11",
  },
  "pizzeria-kaczy1": {
    icon: UtensilsCrossed,
    color: "#dc2626",
    gradient: ["#dc2626", "#ef4444"],
    label: "PIZZA LIVE",
    symbol: "12",
  },
  tramwaj: {
    icon: Train,
    color: "#0284c7",
    gradient: ["#0284c7", "#38bdf8"],
    label: "TRANSIT GPS",
    symbol: "13",
  },
  systemrezerw: {
    icon: CalendarClock,
    color: "#6366f1",
    gradient: ["#6366f1", "#818cf8"],
    label: "BOOKING 24/7",
    symbol: "14",
  },
  lucznicza: {
    icon: Target,
    color: "#059669",
    gradient: ["#059669", "#10b981"],
    label: "SPORTS ARENA",
    symbol: "15",
  },
  "fisz-handel": {
    icon: ShoppingBag,
    color: "#14b8a6",
    gradient: ["#14b8a6", "#06b6d4"],
    label: "SKATE COMMERCE",
    symbol: "16",
  },
  "szczecin-styl": {
    icon: Sparkles,
    color: "#a855f7",
    gradient: ["#a855f7", "#ec4899"],
    label: "FASHION BOUTIQUE",
    symbol: "17",
  },
  "lysy-smoky": {
    icon: Scissors,
    color: "#f59e0b",
    gradient: ["#f59e0b", "#d97706"],
    label: "BARBER SALON",
    symbol: "18",
  },
  "notatnik-seven": {
    icon: BookOpen,
    color: "#3b82f6",
    gradient: ["#3b82f6", "#06b6d4"],
    label: "SECOND BRAIN",
    symbol: "19",
  },
  "ghydra-main": {
    icon: Kanban,
    color: "#10b981",
    gradient: ["#10b981", "#14b8a6"],
    label: "AGILE SAAS",
    symbol: "20",
  },
  jednoreki: {
    icon: Gamepad2,
    color: "#e11d48",
    gradient: ["#e11d48", "#f43f5e"],
    label: "ARCADE ENGINE",
    symbol: "21",
  },
  "lucasz-elektro-glow": {
    icon: Zap,
    color: "#eab308",
    gradient: ["#eab308", "#f59e0b"],
    label: "SMART LIGHTING",
    symbol: "22",
  },
};

export const ProjectSvgThumbnail = ({
  projectId,
  isHovered = false,
}: ProjectSvgThumbnailProps) => {
  const item = iconRegistry[projectId] || {
    icon: Sparkles,
    color: "#3b82f6",
    gradient: ["#3b82f6", "#8b5cf6"],
    label: "SOFTWARE",
    symbol: "99",
  };

  const IconComponent = item.icon;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-card/90 via-secondary/70 to-background select-none">
      {/* Dynamic Cyber Grid Background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`grid-${projectId}`}
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-foreground/30"
            />
          </pattern>
          <radialGradient
            id={`glow-${projectId}`}
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop offset="0%" stopColor={item.color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={item.color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${projectId})`} />
        <rect width="100%" height="100%" fill={`url(#glow-${projectId})`} />
      </svg>

      {/* Ambient Pulsing Glow Circle */}
      <motion.div
        className="absolute w-36 h-36 rounded-full blur-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${item.color}40 0%, transparent 70%)`,
        }}
        animate={{
          scale: isHovered ? [1, 1.25, 1.1] : [1, 1.1, 1],
          opacity: isHovered ? 0.8 : 0.45,
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Decorative Geometric Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-32 h-32 rounded-full border border-dashed opacity-30"
          style={{ borderColor: item.color }}
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="w-44 h-44 rounded-full border opacity-15"
          style={{ borderColor: item.color }}
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Central Icon Badge Container */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center gap-2"
        animate={{
          y: isHovered ? -4 : 0,
          scale: isHovered ? 1.08 : 1,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
      >
        <div
          className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border shadow-xl backdrop-blur-xl"
          style={{
            background: `linear-gradient(135deg, ${item.gradient[0]}25, ${item.gradient[1]}10)`,
            borderColor: `${item.color}50`,
            boxShadow: `0 8px 30px -5px ${item.color}40`,
          }}
        >
          {/* Pulsing inner dot */}
          <div
            className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-background animate-pulse"
            style={{ backgroundColor: item.color }}
          />

          <IconComponent
            className="h-7 w-7 sm:h-8 sm:w-8 transition-transform duration-300"
            style={{ color: item.color }}
            strokeWidth={1.8}
          />
        </div>

        {/* Technical Label Pill */}
        <div className="flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 backdrop-blur-md px-2.5 py-0.5 shadow-sm">
          <span
            className="font-mono text-[9px] font-bold tracking-wider"
            style={{ color: item.color }}
          >
            {item.label}
          </span>
        </div>
      </motion.div>

      {/* Bottom Corner Symbol Watermark */}
      <div className="absolute bottom-2 left-3 font-mono text-[10px] font-bold text-muted-foreground/30 select-none">
        PROJ #{item.symbol}
      </div>

      {/* Top Corner Telemetry Live Badge */}
      <div className="absolute top-2 right-3 flex items-center gap-1 font-mono text-[9px] text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 select-none">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>LIVE</span>
      </div>
    </div>
  );
};
