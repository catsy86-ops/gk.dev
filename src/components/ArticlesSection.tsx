import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { BookOpen, Clock, ArrowRight, Sparkles, Search, Bookmark } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import { articlesData, type Article } from "@/lib/articles";
import { ArticleReaderModal } from "@/components/ArticleReaderModal";
import { useClientStore } from "@/hooks/use-client-store";
import { useI18n } from "@/lib/i18n";
import { toast } from "@/hooks/use-toast";
import { soundEngine } from "@/lib/audio";
import { hapticLight, hapticSelection } from "@/lib/haptics";

const categories = ["Wszystkie", "Wydajność", "Architektura", "SaaS & Security"] as const;

export const ArticlesSection = () => {
  const { t } = useI18n();
  const { isBookmarked, toggleBookmark } = useClientStore();
  const [activeCategory, setActiveCategory] = useState<string>("Wszystkie");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return articlesData.filter((article) => {
      const matchesCategory = activeCategory === "Wszystkie" || article.category === activeCategory;
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  return (
    <SectionWrapper id="artykuly" label="Baza Wiedzy" className="relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1240px] px-2 sm:px-4">
        <SectionHeader
          badge={t.articles.badge}
          badgeIcon={<BookOpen className="h-3 w-3" />}
          title={t.articles.title}
          highlight={t.articles.highlight}
          gradient
        />

        {/* Search & Category Filter Toolbar */}
        <div className="space-y-4 mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-2xl mx-auto">
            {/* Search input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder={t.articles.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border/70 bg-card/70 backdrop-blur-md pl-9 pr-4 py-2 text-xs font-['Geist'] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-full border border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      soundEngine.playPop(750, 0.02);
                      hapticSelection();
                      setActiveCategory(cat);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-['Geist'] font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, idx) => {
            const bookmarked = isBookmarked(article.id);
            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => {
                  soundEngine.playPop(800, 0.03);
                  hapticLight();
                  setSelectedArticle(article);
                }}
                className="group relative rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between hover:border-primary/50 hover:bg-card/95 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div>
                  {/* Badge Row with Bookmark toggle */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-primary">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEngine.playPop(850, 0.02);
                          hapticLight();
                          const added = toggleBookmark(article.id);
                          toast({
                            title: added ? t.articles.bookmarkAdded : t.articles.bookmarkRemoved,
                            description: article.title,
                          });
                        }}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          bookmarked
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-secondary/60 border-border/60 text-muted-foreground hover:text-foreground"
                        }`}
                        title={bookmarked ? "Usuń z zakładek" : "Zapisz w zakładkach"}
                        aria-label="Przełącz zakładkę artykułu"
                      >
                        <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? "fill-current" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-['Geist'] text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-3">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="font-['Geist'] text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                    {article.excerpt}
                  </p>
                </div>

                <div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/50 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-secondary/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Read CTA */}
                  <div className="flex items-center justify-between text-xs font-bold text-primary pt-1">
                    <span>{t.articles.readMore}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="py-16 text-center space-y-2">
            <p className="font-bold text-foreground font-['Geist'] text-lg">Brak pasujących publikacji</p>
            <p className="text-xs text-muted-foreground font-mono">
              Spróbuj wpisać inne słowo kluczowe lub zresetuj filtr.
            </p>
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      <ArticleReaderModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </SectionWrapper>
  );
};

export default ArticlesSection;
