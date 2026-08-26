import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Clock, Calendar, Bookmark, Copy, Check, Sparkles, BookOpen, Share2 } from "lucide-react";
import { type Article } from "@/lib/articles";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticSuccess } from "@/lib/haptics";
import { toast } from "@/hooks/use-toast";

interface ArticleReaderModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArticleReaderModal = ({
  article,
  isOpen,
  onClose,
}: ArticleReaderModalProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!article) return null;

  const handleCopyCode = (code: string, index: number) => {
    soundEngine.playPop(750, 0.03);
    hapticSuccess();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
    }
    setCopiedIndex(index);
    toast({ title: "Skopiowano kod", description: "Fragment kodu zapisany w schowku." });
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleShare = () => {
    soundEngine.playPop(850, 0.03);
    hapticLight();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link skopiowany", description: "Adres artykułu jest w schowku." });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-3xl rounded-t-[32px] sm:rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] my-0 sm:my-6"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            role="dialog"
            aria-label={article.title}
          >
            {/* Header Toolbar */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border/60 bg-secondary/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold">
                      {article.category}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    Opublikowano: {article.publishDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="h-9 w-9 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Udostępnij artykuł"
                  aria-label="Udostępnij"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    onClose();
                  }}
                  className="h-9 w-9 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Zamknij"
                  aria-label="Zamknij"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 font-['Geist'] scrollbar-thin">
              {/* Article Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight mb-3">
                  {article.title}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed italic border-l-2 border-primary/40 pl-4 py-1">
                  "{article.excerpt}"
                </p>
              </div>

              {/* Tag pills */}
              <div className="flex flex-wrap gap-1.5 pb-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-secondary/80 border border-border/60 px-2.5 py-1 text-[11px] font-mono text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <hr className="border-border/60" />

              {/* Content Sections */}
              <div className="space-y-8">
                {article.content.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary shrink-0" />
                      <span>{section.heading}</span>
                    </h2>

                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {section.body}
                    </p>

                    {/* Code Snippet Box if available */}
                    {section.codeSnippet && (
                      <div className="rounded-2xl border border-border/80 bg-neutral-950 p-4 font-mono text-xs overflow-hidden shadow-md">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-neutral-400">
                          <span className="text-[11px] text-primary font-bold uppercase">
                            {section.codeSnippet.language}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(section.codeSnippet!.code, idx)}
                            className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400">Skopiowano</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Kopiuj</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="overflow-x-auto text-neutral-200 leading-relaxed p-1">
                          <code>{section.codeSnippet.code}</code>
                        </pre>
                        {section.codeSnippet.caption && (
                          <p className="text-[10px] text-neutral-500 mt-2 italic">
                            // {section.codeSnippet.caption}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Author Card Footer */}
              <div className="mt-10 rounded-2xl border border-border/70 bg-secondary/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-md shadow-primary/30">
                    GK
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Grzegorz</h3>
                    <p className="font-mono text-xs text-muted-foreground">Senior Fullstack Engineer & Architekt</p>
                  </div>
                </div>

                <a
                  href="#kontakt"
                  onClick={() => {
                    soundEngine.playClick();
                    onClose();
                    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Napisz w sprawie projektu
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ArticleReaderModal;
