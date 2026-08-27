import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { I18nProvider } from "@/components/I18nProvider";

describe("Navbar Desktop Menu", () => {
  it("renders brand logo, desktop navigation links, and action tools", () => {
    render(
      <I18nProvider>
        <Navbar />
      </I18nProvider>
    );

    expect(screen.getByLabelText("Główna nawigacja")).toBeInTheDocument();
    expect(screen.getByText("O mnie")).toBeInTheDocument();
    expect(screen.getByText("Umiejętności")).toBeInTheDocument();
    expect(screen.getByText("Projekty")).toBeInTheDocument();
    expect(screen.getByText("Opinie")).toBeInTheDocument();
    expect(screen.getByText("Narzędzia & Lab")).toBeInTheDocument();
    expect(screen.getByText("FAQ")).toBeInTheDocument();
  });
});
