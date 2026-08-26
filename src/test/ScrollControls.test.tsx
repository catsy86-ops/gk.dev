import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ScrollProgress from "@/components/ScrollProgress";
import { ScrollToTop } from "@/components/ScrollToTop";

describe("Scroll Controls Suite", () => {
  it("renders ScrollProgress component without errors", () => {
    const { container } = render(<ScrollProgress />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders ScrollToTop and triggers scrollTo top on click when scrolled", () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    Object.defineProperty(window, "scrollY", { value: 600, writable: true });

    render(<ScrollToTop />);

    const scrollBtn = screen.getByLabelText("Przewiń do góry");
    expect(scrollBtn).toBeInTheDocument();

    fireEvent.click(scrollBtn);
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
