import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "@/components/ErrorBoundary";

// Suppress console.error for expected error boundary logs
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});
afterEach(() => {
  console.error = originalError;
});

// Component that throws on render
const ThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error("Test error");
  return <div>Działa poprawnie</div>;
};

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Działa poprawnie")).toBeInTheDocument();
  });

  it("renders fallback UI when child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/Coś poszło nie tak/i)).toBeInTheDocument();
  });

  it("shows section name in error message when provided", () => {
    render(
      <ErrorBoundary section="Projekty">
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByText(/Projekty/i)).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<div>Własny fallback</div>}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Własny fallback")).toBeInTheDocument();
  });

  it("resets error state when retry button is clicked", async () => {
    // ThrowingComponent controlled by a ref-like variable
    let shouldThrow = true;
    const ControlledComponent = () => {
      if (shouldThrow) throw new Error("Test error");
      return <div>Działa poprawnie</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <ControlledComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Stop throwing before clicking retry
    shouldThrow = false;

    const retryButton = screen.getByRole("button", { name: /spróbuj ponownie/i });
    fireEvent.click(retryButton);

    // Re-render to pick up the reset state
    rerender(
      <ErrorBoundary>
        <ControlledComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Działa poprawnie")).toBeInTheDocument();
  });
});
