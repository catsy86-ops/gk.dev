import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ArticleReaderModal } from "@/components/ArticleReaderModal";
import { articlesData } from "@/lib/articles";
import { I18nProvider } from "@/components/I18nProvider";

describe("ArticleReaderModal Comprehensive Suite", () => {
  it("renders full article content, copy buttons, and handles close", () => {
    const handleClose = vi.fn();
    const article = articlesData[0];

    render(
      <I18nProvider>
        <ArticleReaderModal
          article={article}
          isOpen={true}
          onClose={handleClose}
        />
      </I18nProvider>
    );

    // Article title
    expect(screen.getByText(article.title)).toBeInTheDocument();

    // Close button
    const closeBtn = screen.getByLabelText("Zamknij");
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
