import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { B2bProposalModal } from "@/components/B2bProposalModal";

describe("B2bProposalModal", () => {
  it("renders when open and switches project types", () => {
    render(<B2bProposalModal isOpen={true} onClose={() => {}} />);

    expect(screen.getByText("Generator Briefu B2B & Architektury")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Aplikacja SaaS/i })).toBeInTheDocument();

    const mobileBtn = screen.getByRole("button", { name: /Aplikacja Mobilna/i });
    fireEvent.click(mobileBtn);

    expect(screen.getByText(/React Native \/ Expo/i)).toBeInTheDocument();
  });

  it("handles copy and apply to contact callback", () => {
    const handleApply = vi.fn();
    render(
      <B2bProposalModal
        isOpen={true}
        onClose={() => {}}
        onApplyToContact={handleApply}
      />
    );

    const copyBtn = screen.getByRole("button", { name: /Kopiuj/i });
    fireEvent.click(copyBtn);

    const applyBtn = screen.getByRole("button", { name: /Przejdź do formularza/i });
    fireEvent.click(applyBtn);

    expect(handleApply).toHaveBeenCalled();
  });
});
