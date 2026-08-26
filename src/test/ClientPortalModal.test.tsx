import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ClientPortalModal } from "@/components/ClientPortalModal";
import { I18nProvider } from "@/components/I18nProvider";
import { clientStore } from "@/lib/client-store";

describe("ClientPortalModal", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders client portal tabs and displays bookmarks and briefs", () => {
    clientStore.toggleBookmark("inp-sub-50ms");
    clientStore.saveBrief({
      projectType: "Platforma SaaS B2B",
      timeline: "3 miesiące",
      content: "Brief test details",
    });

    const handleClose = vi.fn();

    render(
      <I18nProvider>
        <ClientPortalModal isOpen={true} onClose={handleClose} />
      </I18nProvider>
    );

    expect(screen.getByRole("dialog", { name: "Strefa Klienta & Panel Użytkownika" })).toBeInTheDocument();
    expect(screen.getByText(/Zakładki wiedzy/)).toBeInTheDocument();

    // Switch to briefs tab
    const briefsTab = screen.getByText(/Historia Briefów/);
    fireEvent.click(briefsTab);

    expect(screen.getByText("Platforma SaaS B2B")).toBeInTheDocument();
  });
});
