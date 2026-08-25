import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Check, Copy, Sparkles, Cpu, Activity } from "lucide-react";

interface Tab {
  id: "code" | "stack" | "metrics";
  label: string;
  icon: typeof Terminal;
  filename: string;
}

const tabs: Tab[] = [
  { id: "code", label: "architect.ts", icon: Terminal, filename: "developer.config.ts" },
  { id: "stack", label: "stack.json", icon: Cpu, filename: "tech-matrix.json" },
  { id: "metrics", label: "vitals.log", icon: Activity, filename: "performance.log" },
];

const codeSnippets = {
  code: `// Modern Fullstack Architecture Blueprint
export const engineer = {
  name: "Grzegorz",
  role: "Senior Fullstack Engineer",
  philosophy: "Clean Code & Ultra-fast UX",
  stack: ["React 19", "TypeScript 5", "Next.js", "Node.js"],
  metrics: {
    cleanArchitecture: true,
    testCoverage: "95%+",
    lighthouseScore: 100,
  },
  status: "Available for new challenges",
} as const;`,
  stack: `{
  "core": {
    "frontend": ["React", "TypeScript", "TailwindCSS", "Motion"],
    "backend": ["Node.js", "Python", "PostgreSQL", "Redis"],
    "cloud": ["AWS", "Docker", "Vercel", "CI/CD"]
  },
  "principles": ["SOLID", "DRY", "TDD", "Zero-Jank 60FPS"]
}`,
  metrics: `[SYSTEM DIAGNOSTICS: OPTIMAL]
✔ Core Web Vitals: LCP < 0.8s, CLS: 0.00, FID: < 15ms
✔ Lighthouse Score: 100 / 100 / 100 / 100
✔ Responsive: Mobile, Tablet, Ultrawide (4K Ready)
✔ A11y & Contrast: WCAG 2.1 AAA Compliant
✔ Security: HTTPS, Strict CSP, Zero Vulnerabilities`,
};

export const HeroCodeTerminal = () => {
  const [activeTab, setActiveTab] = useState<"code" | "stack" | "metrics">("code");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="w-full max-w-[560px] rounded-2xl border border-border/70 bg-card/60 backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300 hover:border-primary/40 group"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {/* Top bar with mac-like dots and tabs */}
      <div className="flex items-center justify-between border-b border-border/50 bg-secondary/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-destructive/70" />
            <span className="h-3 w-3 rounded-full bg-amber-500/70" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
          </div>
          <span className="ml-2 font-mono text-[11px] text-muted-foreground hidden sm:inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-primary/70" />
            gk-developer-core
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-background/50 p-0.5 rounded-lg border border-border/40">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors ${
                  isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-terminal-tab"
                    className="absolute inset-0 bg-secondary rounded-md shadow-sm border border-border/50"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <tab.icon className="h-3 w-3" />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-border/40 bg-background/40 text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
          title="Kopiuj zawartość"
          aria-label="Kopiuj kod"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="relative p-4 sm:p-5 font-mono text-xs text-muted-foreground overflow-x-auto min-h-[160px] max-h-[220px] leading-relaxed select-text">
        <AnimatePresence mode="wait">
          <motion.pre
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-foreground/90 text-[11.5px] sm:text-xs"
          >
            <code>{codeSnippets[activeTab]}</code>
          </motion.pre>
        </AnimatePresence>
      </div>

      {/* Bottom status bar */}
      <div className="flex items-center justify-between border-t border-border/40 bg-secondary/30 px-4 py-1.5 font-mono text-[10px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-500 font-medium">READY</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-3">
          <span>TypeScript 5.8</span>
          <span className="text-primary font-semibold">100% Type Safe</span>
        </div>
      </div>
    </motion.div>
  );
};
