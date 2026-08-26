import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MobileDock } from "@/components/MobileDock";
import { I18nProvider } from "@/components/I18nProvider";

describe("MobileDock", () => {
  it("renders mobile navigation items, CLI button, account/login button, and action button", () => {
    render(
      <I18nProvider>
        <MobileDock />
      </I18nProvider>
    );
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("O mnie")).toBeInTheDocument();
    expect(screen.getByText("Stack")).toBeInTheDocument();
    expect(screen.getByText("Projekty")).toBeInTheDocument();
    expect(screen.getByText("CLI")).toBeInTheDocument();
    expect(screen.getByText(/Konto|Zaloguj/i)).toBeInTheDocument();
    expect(screen.getByText("Napisz")).toBeInTheDocument();
  });
});
