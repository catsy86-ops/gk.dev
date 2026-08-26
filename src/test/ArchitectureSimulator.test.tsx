import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ArchitectureSimulator } from "@/components/ArchitectureSimulator";
import { architecturePresets } from "@/lib/architecture-presets";

describe("ArchitectureSimulator", () => {
  it("renders architecture presets and switches profiles", () => {
    render(<ArchitectureSimulator />);

    expect(screen.getByText("Symulator Architektury Systemowej")).toBeInTheDocument();
    expect(screen.getByText("Wyślij pakiet testowy")).toBeInTheDocument();

    const ragButton = screen.getByRole("button", { name: /AI Agent & Vector Search/i });
    expect(ragButton).toBeInTheDocument();

    fireEvent.click(ragButton);
    expect(screen.getByText(/Strumieniowanie odpowiedzi LLM/i)).toBeInTheDocument();
  });

  it("toggles traffic spike and cache simulation", () => {
    render(<ArchitectureSimulator />);

    const spikeBtn = screen.getByRole("button", { name: /Symuluj Spike/i });
    fireEvent.click(spikeBtn);
    expect(screen.getByText("Spike ON")).toBeInTheDocument();

    const cacheBtn = screen.getByRole("button", { name: /Cache: Aktywny/i });
    fireEvent.click(cacheBtn);
    expect(screen.getByText("Cache: Wyłączony")).toBeInTheDocument();
  });

  it("starts simulation flow on play click", () => {
    vi.useFakeTimers();
    render(<ArchitectureSimulator />);

    const playBtn = screen.getByRole("button", { name: /Wyślij pakiet testowy/i });
    fireEvent.click(playBtn);

    expect(screen.getByText("Przetwarzanie strumienia...")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3500);
    });
    vi.useRealTimers();
  });
});
