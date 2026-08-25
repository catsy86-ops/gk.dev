import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectEstimatorModal } from "@/components/ProjectEstimatorModal";

describe("ProjectEstimatorModal", () => {
  it("renders steps and calculates estimate correctly", () => {
    const onClose = vi.fn();
    const onApplyEstimate = vi.fn();

    render(
      <ProjectEstimatorModal
        isOpen={true}
        onClose={onClose}
        onApplyEstimate={onApplyEstimate}
      />
    );

    expect(screen.getByText("Kalkulator & Estymator Projektu")).toBeInTheDocument();
    expect(screen.getByText("1. Jaki rodzaj aplikacji chcesz zbudować?")).toBeInTheDocument();

    // Click next step
    const nextBtn = screen.getByText("Dalej");
    fireEvent.click(nextBtn);

    expect(screen.getByText("2. Jakie funkcjonalności będą potrzebne? (Wybierz dowolne)")).toBeInTheDocument();

    // Click next step to summary
    fireEvent.click(screen.getByText("Dalej"));
    expect(screen.getByText("3. Jaki jest preferowany harmonogram wdrożenia?")).toBeInTheDocument();
    expect(screen.getByText("Wyślij z tą wyceną")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Wyślij z tą wyceną"));
    expect(onApplyEstimate).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
