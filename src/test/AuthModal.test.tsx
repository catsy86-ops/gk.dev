import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthModal } from "@/components/auth/AuthModal";
import { I18nProvider } from "@/components/I18nProvider";
import * as clerkReact from "@clerk/clerk-react";

type MockUseUserReturn = ReturnType<typeof clerkReact.useUser>;

describe("AuthModal & Advanced 1-Click OAuth Suite", () => {
  it("renders 1-Click Google, GitHub buttons, split-view benefits, and custom form inputs when unauthenticated", () => {
    vi.spyOn(clerkReact, "useUser").mockReturnValue({
      isSignedIn: false,
      user: null,
      isLoaded: true,
    } as unknown as MockUseUserReturn);

    const handleClose = vi.fn();
    render(
      <I18nProvider>
        <AuthModal isOpen={true} onClose={handleClose} />
      </I18nProvider>
    );

    // Verify modal elements
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Google 1-Click/i)).toBeInTheDocument();
    expect(screen.getByText(/GitHub 1-Click/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/twoj.email@firma.pl/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••••••/i)).toBeInTheDocument();

    // Verify close button action
    const closeBtn = screen.getByRole("button", { name: "Zamknij" });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it("handles mode switching between sign-in and sign-up with dynamic labels", () => {
    vi.spyOn(clerkReact, "useUser").mockReturnValue({
      isSignedIn: false,
      user: null,
      isLoaded: true,
    } as unknown as MockUseUserReturn);

    render(
      <I18nProvider>
        <AuthModal isOpen={true} onClose={vi.fn()} initialMode="sign-in" />
      </I18nProvider>
    );

    const registerTab = screen.getByRole("button", { name: "Rejestracja" });
    fireEvent.click(registerTab);
    expect(screen.getByText(/Utwórz konto w GK.dev/i)).toBeInTheDocument();
  });

  it("calculates and displays dynamic password strength when user types password", () => {
    vi.spyOn(clerkReact, "useUser").mockReturnValue({
      isSignedIn: false,
      user: null,
      isLoaded: true,
    } as unknown as MockUseUserReturn);

    render(
      <I18nProvider>
        <AuthModal isOpen={true} onClose={vi.fn()} />
      </I18nProvider>
    );

    const passwordInput = screen.getByPlaceholderText(/••••••••••••/i);
    fireEvent.change(passwordInput, { target: { value: "Secret123!" } });

    expect(screen.getByText(/Siła hasła:/i)).toBeInTheDocument();
    expect(screen.getByText(/Dobre|Pancerne/i)).toBeInTheDocument();
  });

  it("toggles password visibility on eye button click", () => {
    vi.spyOn(clerkReact, "useUser").mockReturnValue({
      isSignedIn: false,
      user: null,
      isLoaded: true,
    } as unknown as MockUseUserReturn);

    render(
      <I18nProvider>
        <AuthModal isOpen={true} onClose={vi.fn()} />
      </I18nProvider>
    );

    const toggleBtn = screen.getByRole("button", { name: "Pokaż hasło" });
    fireEvent.click(toggleBtn);
    expect(screen.getByRole("button", { name: "Ukryj hasło" })).toBeInTheDocument();
  });

  it("renders authenticated VIP state when signed in", () => {
    vi.spyOn(clerkReact, "useUser").mockReturnValue({
      isSignedIn: true,
      user: {
        id: "usr_123",
        fullName: "Grzegorz Tester",
        primaryEmailAddress: { emailAddress: "kontakt@gkdev.pl" },
      },
      isLoaded: true,
    } as unknown as MockUseUserReturn);

    render(
      <I18nProvider>
        <AuthModal isOpen={true} onClose={vi.fn()} />
      </I18nProvider>
    );

    expect(screen.getByText(/jesteś pomyślnie zalogowany/i)).toBeInTheDocument();
    expect(screen.getByText(/VIP Klient/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /wyloguj/i })).toBeInTheDocument();
  });
});
