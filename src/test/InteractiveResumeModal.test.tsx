import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { InteractiveResumeModal } from "@/components/InteractiveResumeModal";
import { I18nProvider } from "@/components/I18nProvider";

describe("InteractiveResumeModal Component Suite", () => {
  it("renders modal with Grzegorz profile, stack and experiences when open", () => {
    render(
      <I18nProvider>
        <InteractiveResumeModal isOpen={true} onClose={vi.fn()} />
      </I18nProvider>
    );

    expect(screen.getByText("Grzegorz")).toBeInTheDocument();
    expect(screen.getByText(/Szczecin, Polska/i)).toBeInTheDocument();
    expect(screen.getByText("kontakt@gkdev.pl")).toBeInTheDocument();
    expect(screen.getByText("Drukuj / PDF")).toBeInTheDocument();
    expect(screen.getByText("Markdown")).toBeInTheDocument();
    expect(screen.getByText("JSON")).toBeInTheDocument();
  });

  it("triggers window.print when print button is clicked", () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});
    render(
      <I18nProvider>
        <InteractiveResumeModal isOpen={true} onClose={vi.fn()} />
      </I18nProvider>
    );

    const printBtn = screen.getByText("Drukuj / PDF");
    fireEvent.click(printBtn);

    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  it("does not render when isOpen is false", () => {
    render(
      <I18nProvider>
        <InteractiveResumeModal isOpen={false} onClose={vi.fn()} />
      </I18nProvider>
    );

    expect(screen.queryByText("Grzegorz")).not.toBeInTheDocument();
  });
});
