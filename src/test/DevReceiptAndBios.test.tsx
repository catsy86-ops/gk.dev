import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DevReceiptModal } from "@/components/DevReceiptModal";
import { BiosSimulatorModal } from "@/components/BiosSimulatorModal";
import { I18nProvider } from "@/components/I18nProvider";

describe("DevReceiptModal & BiosSimulatorModal Suite", () => {
  it("renders DevReceiptModal with store brand and receipt items when open", () => {
    render(
      <I18nProvider>
        <DevReceiptModal isOpen={true} onClose={() => {}} />
      </I18nProvider>
    );
    expect(screen.getByText(/PARAGON FISKALNY/i)).toBeInTheDocument();
    expect(screen.getByText(/GK.DEV SOFTWARE LAB/i)).toBeInTheDocument();
    expect(screen.getByText(/2500\+ GODZIN/i)).toBeInTheDocument();
  });

  it("renders BiosSimulatorModal with ROM PCI/ISA BIOS header when open", () => {
    render(
      <I18nProvider>
        <BiosSimulatorModal isOpen={true} onClose={() => {}} />
      </I18nProvider>
    );
    expect(screen.getByText(/ROM PCI\/ISA BIOS SETUP UTILITY/i)).toBeInTheDocument();
    expect(screen.getByText(/CPU FREQUENCY CLOCK/i)).toBeInTheDocument();
    expect(screen.getByText(/THREE\.JS WEBGL RENDER BUFFER/i)).toBeInTheDocument();
  });
});
