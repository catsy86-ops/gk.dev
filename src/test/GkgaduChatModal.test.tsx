import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GkgaduChatModal } from "@/components/GkgaduChatModal";
import { I18nProvider } from "@/components/I18nProvider";

describe("GkgaduChatModal Component Suite", () => {
  it("renders GKgadu chassis with title, sun icon and user GG number", () => {
    render(
      <I18nProvider>
        <GkgaduChatModal isOpen={true} onClose={vi.fn()} />
      </I18nProvider>
    );

    expect(screen.getByText("GKgadu 2026")).toBeInTheDocument();
    expect(screen.getByText(/GG #/i)).toBeInTheDocument();
    expect(screen.getByText("Pokój")).toBeInTheDocument();
    expect(screen.getByText("Puk-Puk!")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Napisz wiadomość/i)).toBeInTheDocument();
  });

  it("switches tabs and opens contacts", () => {
    render(
      <I18nProvider>
        <GkgaduChatModal isOpen={true} onClose={vi.fn()} />
      </I18nProvider>
    );

    const grzegorzTab = screen.getByText("Grzegorz");
    fireEvent.click(grzegorzTab);

    expect(screen.getAllByText(/Grzegorz \(GK\.dev\)/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/GG: 1001/i)).toBeInTheDocument();
  });

  it("sends a message when form is submitted", () => {
    render(
      <I18nProvider>
        <GkgaduChatModal isOpen={true} onClose={vi.fn()} />
      </I18nProvider>
    );

    const input = screen.getByPlaceholderText(/Napisz wiadomość/i);
    fireEvent.change(input, { target: { value: "Hejka na GKgadu!" } });

    const submitBtn = screen.getByRole("button", { name: /Wyślij/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText("Hejka na GKgadu!")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <I18nProvider>
        <GkgaduChatModal isOpen={true} onClose={handleClose} />
      </I18nProvider>
    );

    const closeBtn = screen.getByTitle("Zamknij GKgadu");
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not render when isOpen is false", () => {
    render(
      <I18nProvider>
        <GkgaduChatModal isOpen={false} onClose={vi.fn()} />
      </I18nProvider>
    );

    expect(screen.queryByText("GKgadu 2026")).not.toBeInTheDocument();
  });
});
