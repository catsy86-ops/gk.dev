import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Clock, Copy, Check, Sparkles, BookOpen, Share2, ExternalLink } from "lucide-react";
import { type Article } from "@/lib/articles";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticSuccess } from "@/lib/haptics";
import { toast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { useScrollLock } from "@/hooks/use-scroll-lock";

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
  useScrollLock(isOpen);
  const { lang, t } = useI18n();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!article) return null;

  const contentSections = lang === "en" ? article.contentEn : article.content;
  const categoryLabel = lang === "en" ? article.categoryEn : article.category;
  const readTimeLabel = lang === "en" ? article.readTimeEn : article.readTime;

  const handleCopyCode = (code: string, index: number) => {
    soundEngine.playPop(750, 0.03);
    hapticSuccess();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
    }
    setCopiedIndex(index);
    toast({
      title: lang === "pl" ? "Skopiowano kod" : "Code Copied",
      description: lang === "pl" ? "Fragment kodu zapisany w schowku." : "Code snippet saved to clipboard.",
    });
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
      toast({
        title: lang === "pl" ? "Link skopiowany" : "Link Copied",
        description: lang === "pl" ? "Adres artykułu jest w schowku." : "Article link copied to clipboard.",
      });
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-md cursor-pointer pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              soundEngine.playClick();
              onClose();
            }}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-3xl rounded-t-[32px] sm:rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] my-0 sm:my-6 pointer-events-auto"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={article.title}
          >
            {/* Header Toolbar */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border/60 bg-secondary/40 relative z-20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold">
                      {categoryLabel}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {readTimeLabel}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {lang === "pl" ? "Opublikowano:" : "Published:"} {article.publishDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-30">
                <button
                  type="button"
                  onClick={handleShare}
                  className="h-9 w-9 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer pointer-events-auto"
                  title={lang === "pl" ? "Udostępnij artykuł" : "Share article"}
                  aria-label={lang === "pl" ? "Udostępnij" : "Share"}
                >
                  <Share2 className="h-4 w-4 pointer-events-none" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    soundEngine.playClick();
                    onClose();
                  }}
                  className="h-9 w-9 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer pointer-events-auto"
                  title={lang === "pl" ? "Zamknij" : "Close"}
                  aria-label={lang === "pl" ? "Zamknij" : "Close"}
                >
                  <X className="h-4 w-4 pointer-events-none" />
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
                {contentSections.map((section, idx) => (
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
                                <span className="text-emerald-400">{lang === "pl" ? "Skopiowano" : "Copied"}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>{lang === "pl" ? "Kopiuj" : "Copy"}</span>
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

              {/* Engineering Sources & Citations */}
              {article.sources && article.sources.length > 0 && (
                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-5 space-y-3">
                  <h3 className="text-xs font-mono font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>{t.articles.sourcesHeading}</span>
                  </h3>
                  <ul className="space-y-2">
                    {article.sources.map((src, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary font-mono select-none">[{i + 1}]</span>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground hover:text-primary transition-colors inline-flex items-center gap-1 underline underline-offset-2"
                        >
                          <span>{src.title}</span>
                          <ExternalLink className="h-3 w-3 opacity-70" />
                        </a>
                        <span className="text-muted-foreground font-mono text-[11px]">({src.sourceName})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Author Card Footer */}
              <div className="mt-10 rounded-2xl border border-border/70 bg-secondary/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-md shadow-primary/30">
                    GK
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Grzegorz</h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      {lang === "pl" ? "Senior Fullstack Engineer & Architekt" : "Senior Fullstack Engineer & Architect"}
                    </p>
                  </div>
                </div>

                <a
                  href="#kontakt"
                  onClick={() => {
                    soundEngine.playChime();
                    hapticLight();
                    onClose();
                    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-full bg-gradient-to-r from-primary via-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20 shrink-0"
                >
                  {lang === "pl" ? "Napisz w sprawie projektu" : "Discuss a Project"}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ArticleReaderModal;
