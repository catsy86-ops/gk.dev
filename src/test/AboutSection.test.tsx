import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
    expect(screen.getAllByText(/Mid Fullstack Developer/i).length).toBeGreaterThan(0);

    // Switch to education tab
    const eduTab = screen.getByText("Certyfikaty & Edukacja");
    fireEvent.click(eduTab.closest("button") || eduTab);

    // Wait for tab animation to complete
    await waitFor(
      () => {
        expect(screen.getByText(/Meta Front-End Developer Professional/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
