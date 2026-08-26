import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AboutSection from "@/components/AboutSection";
import { I18nProvider } from "@/components/I18nProvider";

describe("AboutSection Comprehensive Suite", () => {
  it("renders about bio, experience timeline, and toggles education tab", async () => {
    render(
      <I18nProvider>
        <AboutSection />
      </I18nProvider>
    );

    // Default experience tab items
    expect(screen.getByText(/Senior Fullstack Developer & Architekt/i)).toBeInTheDocument();

    // Switch to education tab
    const eduButton = screen.getByRole("button", { name: /Certyfikaty & Edukacja/i });
    fireEvent.click(eduButton);

    // Verify education content is displayed with findBy
    expect(await screen.findByText(/AWS Certified Solutions Architect/i)).toBeInTheDocument();
  });
});
