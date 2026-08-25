import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ContactSection from "@/components/ContactSection";
import { validateForm } from "@/lib/validation";

vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
  useToast: () => ({ toasts: [], toast: vi.fn(), dismiss: vi.fn() }),
}));

vi.mock("@/hooks/use-magnetic", () => ({
  useMagnetic: () => ({
    ref: { current: null },
    onMouseMove: vi.fn(),
    onMouseLeave: vi.fn(),
  }),
}));

describe("validateForm", () => {
  it("returns errors for empty fields", () => {
    const errors = validateForm({ name: "", email: "", message: "" });
    expect(errors.name).toBe("Imię jest wymagane");
    expect(errors.email).toBe("Email jest wymagany");
    expect(errors.message).toBe("Wiadomość jest wymagana");
  });

  it("validates email format", () => {
    const errors = validateForm({ name: "Jan", email: "invalid", message: "Hello" });
    expect(errors.email).toBe("Nieprawidłowy format email");
  });

  it("passes for valid data", () => {
    const errors = validateForm({ name: "Jan", email: "jan@example.com", message: "Hello" });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("accepts valid email formats", () => {
    const e1 = validateForm({ name: "A", email: "a@b.co", message: "M" });
    expect(e1.email).toBeUndefined();

    const e2 = validateForm({ name: "A", email: "user@domain.com", message: "M" });
    expect(e2.email).toBeUndefined();
  });
});

describe("ContactSection rendering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<ContactSection />);
    expect(screen.getByLabelText(/Imię/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Wiadomość/i)).toBeInTheDocument();
    expect(screen.getByText("Wyślij wiadomość")).toBeInTheDocument();
  });

  it("updates input value on change", () => {
    render(<ContactSection />);
    const input = screen.getByLabelText(/Imię/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Janek" } });
    expect(input.value).toBe("Janek");
  });

  it("has accessible labels for form fields", () => {
    render(<ContactSection />);
    expect(screen.getByLabelText(/Imię/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Wiadomość/i)).toBeInTheDocument();
  });

  it("shows validation errors with role=alert", () => {
    render(<ContactSection />);
    const submitBtn = screen.getByRole("button", { name: /wyślij/i });
    fireEvent.click(submitBtn);
    const alerts = screen.getAllByRole("alert");
    expect(alerts.length).toBeGreaterThan(0);
  });

  it("submit button is accessible", () => {
    render(<ContactSection />);
    const btn = screen.getByRole("button", { name: /wyślij wiadomość/i });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });
});
