import { motion } from "motion/react";
import { GitCommit, GitPullRequest, Star, Terminal } from "lucide-react";
import { soundEngine } from "@/lib/audio";
import { hapticLight } from "@/lib/haptics";

export const GithubActivityBadge = () => {
  return (
    <motion.a
      href="https://github.com/catsy86"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        soundEngine.playPop(850, 0.02);
        hapticLight();
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-card/60 backdrop-blur-xl px-4 py-1.5 text-xs font-mono shadow-sm hover:border-primary/40 hover:bg-card/90 transition-all active:scale-95 group"
    >
      <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>GitHub Live</span>
      </div>

      <div className="h-3 w-px bg-border/80" />

      <div className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground transition-colors">
        <GitCommit className="h-3.5 w-3.5 text-primary" />
        <span>Active Commits</span>
      </div>

      <div className="h-3 w-px bg-border/80" />

      <div className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground transition-colors">
        <Terminal className="h-3.5 w-3.5 text-primary" />
        <span>Clean Code 100%</span>
      </div>
    </motion.a>
  );
};

export default GithubActivityBadge;
