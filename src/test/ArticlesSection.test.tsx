import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ArticlesSection } from "@/components/ArticlesSection";
import { ArticleReaderModal } from "@/components/ArticleReaderModal";
import { articlesData } from "@/lib/articles";

describe("ArticlesSection", () => {
  it("renders articles section and handles filtering", () => {
    render(<ArticlesSection />);

    expect(screen.getByText("Inżynieria & Baza Wiedzy")).toBeInTheDocument();
    expect(screen.getByText(/Maksymalizacja Core Web Vitals/i)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Szukaj/i);
    fireEvent.change(searchInput, { target: { value: "PostgreSQL" } });

    expect(screen.getByText(/Architektura Mikroserwisów/i)).toBeInTheDocument();
  });

  it("renders article reader modal when open and handles copy", () => {
    render(
      <ArticleReaderModal
        article={articlesData[0]}
        isOpen={true}
        onClose={() => {}}
      />
    );

    expect(screen.getByText(articlesData[0].title)).toBeInTheDocument();
    expect(screen.getByText("Kopiuj")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Kopiuj"));
  });
});
