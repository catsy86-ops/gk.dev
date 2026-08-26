import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import * as pwaHook from "@/hooks/use-pwa";

describe("PwaInstallPrompt Comprehensive Suite", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders PWA install prompt when application is installable", () => {
    vi.spyOn(pwaHook, "usePwa").mockReturnValue({
      isInstallable: true,
      isInstalled: false,
      isIos: false,
      isOnline: true,
      hasUpdate: false,
      promptInstall: vi.fn().mockResolvedValue(true),
      applyUpdate: vi.fn(),
      clearAppCache: vi.fn(),
    });

    render(<PwaInstallPrompt />);

    expect(screen.getByText("Pobierz aplikację GK.dev")).toBeInTheDocument();
    expect(screen.getByText("Zainstaluj aplikację")).toBeInTheDocument();
  });

  it("renders offline banner when user is disconnected", () => {
    vi.spyOn(pwaHook, "usePwa").mockReturnValue({
      isInstallable: false,
      isInstalled: false,
      isIos: false,
      isOnline: false,
      hasUpdate: false,
      promptInstall: vi.fn(),
      applyUpdate: vi.fn(),
      clearAppCache: vi.fn(),
    });

    render(<PwaInstallPrompt />);

    expect(screen.getByText("Tryb Offline aktywny")).toBeInTheDocument();
    expect(screen.getByText(/PWA Cache/i)).toBeInTheDocument();
  });

  it("dismisses prompt when user clicks later", () => {
    vi.spyOn(pwaHook, "usePwa").mockReturnValue({
      isInstallable: true,
      isInstalled: false,
      isIos: false,
      isOnline: true,
      hasUpdate: false,
      promptInstall: vi.fn(),
      applyUpdate: vi.fn(),
      clearAppCache: vi.fn(),
    });

    render(<PwaInstallPrompt />);

    const laterBtn = screen.getByText("Później");
    fireEvent.click(laterBtn);

    expect(sessionStorage.getItem("pwa-prompt-dismissed")).toBe("true");
  });
});
