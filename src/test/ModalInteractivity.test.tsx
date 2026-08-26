import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BookingConsultationModal } from "@/components/BookingConsultationModal";
import { AiAssistantDialog } from "@/components/AiAssistantDialog";
import { ProjectEstimatorModal } from "@/components/ProjectEstimatorModal";
import { B2bProposalModal } from "@/components/B2bProposalModal";
import { TerminalDialog } from "@/components/TerminalDialog";
import { MobileQuickActions } from "@/components/MobileQuickActions";
import { ArticleReaderModal } from "@/components/ArticleReaderModal";
import { articlesData } from "@/lib/articles";
import { I18nProvider } from "@/components/I18nProvider";

describe("Modal Interactivity & ESC/Dismiss Suite", () => {
  it("BookingConsultationModal closes on Escape keydown", () => {
    const handleClose = vi.fn();
    render(
      <I18nProvider>
        <BookingConsultationModal isOpen={true} onClose={handleClose} />
      </I18nProvider>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalled();
  });

  it("AiAssistantDialog closes on Escape keydown", () => {
    const handleClose = vi.fn();
    render(<AiAssistantDialog isOpen={true} onClose={handleClose} />);

    expect(screen.getAllByText(/GK AI Architect/i)[0]).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalled();
  });

  it("ProjectEstimatorModal closes on Escape keydown and handles steps", () => {
    const handleClose = vi.fn();
    const handleApply = vi.fn();
    render(
      <ProjectEstimatorModal
        isOpen={true}
        onClose={handleClose}
        onApplyEstimate={handleApply}
      />
    );

    expect(screen.getByText(/Kalkulator/i)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalled();
  });

  it("B2bProposalModal closes on Escape keydown", () => {
    const handleClose = vi.fn();
    render(<B2bProposalModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText(/Generator Briefu B2B/i)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalled();
  });

  it("TerminalDialog closes on Escape keydown", () => {
    const handleClose = vi.fn();
    render(<TerminalDialog isOpen={true} onClose={handleClose} />);

    expect(screen.getByText(/Interactive Shell/i)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalled();
  });

  it("MobileQuickActions closes on Escape keydown", () => {
    const handleClose = vi.fn();
    render(<MobileQuickActions isOpen={true} onClose={handleClose} />);

    expect(screen.getByText(/Szybkie Akcje|Szybki Kontakt/i)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalled();
  });

  it("ArticleReaderModal closes on Escape keydown", () => {
    const handleClose = vi.fn();
    render(
      <ArticleReaderModal
        article={articlesData[0]}
        isOpen={true}
        onClose={handleClose}
      />
    );

    expect(screen.getByText(articlesData[0].title)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalled();
  });
});
