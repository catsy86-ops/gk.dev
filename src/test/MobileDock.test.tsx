import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MobileDock } from "@/components/MobileDock";
import { I18nProvider } from "@/components/I18nProvider";

describe("MobileDock", () => {
  it("renders mobile navigation items, CLI button, quick action hub button, and action button", () => {
    render(
      <I18nProvider>
        <MobileDock />
      </I18nProvider>
    );
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("Stack")).toBeInTheDocument();
    expect(screen.getByText("Projekty")).toBeInTheDocument();
    expect(screen.getByText("CLI")).toBeInTheDocument();
    expect(screen.getByText("Więcej")).toBeInTheDocument();
    expect(screen.getByText("Napisz")).toBeInTheDocument();
  });
});
