import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import SectionDivider from "@/components/ui/SectionDivider";
import { ClickSpark } from "@/components/ui/ClickSpark";
import { TextReveal } from "@/components/ui/text-reveal";
import { ImageReveal } from "@/components/ui/image-reveal";
import { OptimizedImage } from "@/components/ui/optimized-image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { I18nProvider } from "@/components/I18nProvider";

describe("UI Primitives & Design System Suite", () => {
  it("renders Accordion and expands content properly", () => {
    render(
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Pytanie testowe</AccordionTrigger>
          <AccordionContent>Odpowiedź testowa</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText("Pytanie testowe")).toBeInTheDocument();
    expect(screen.getByText("Odpowiedź testowa")).toBeInTheDocument();
  });

  it("renders Tooltip within TooltipProvider", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger asChild>
            <button>Hover me</button>
          </TooltipTrigger>
          <TooltipContent>Podpowiedź tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText("Hover me")).toBeInTheDocument();
    expect(screen.getAllByText("Podpowiedź tooltip").length).toBeGreaterThan(0);
  });

  it("renders SectionDivider, ClickSpark, TextReveal and ImageReveal without crashing", () => {
    const { container: dividerContainer } = render(<SectionDivider />);
    expect(dividerContainer).toBeInTheDocument();

    const { container: sparkContainer } = render(<ClickSpark />);
    expect(sparkContainer).toBeInTheDocument();

    render(<TextReveal text="Architektura Systemów" />);
    expect(screen.getByText(/Architektura/i)).toBeInTheDocument();
    expect(screen.getByText(/Systemów/i)).toBeInTheDocument();

    const { container: imgRevealContainer } = render(
      <ImageReveal src="/og-image.png" alt="Test Reveal" />
    );
    expect(imgRevealContainer).toBeInTheDocument();
  });

  it("renders OptimizedImage and SectionWrapper with semantic attributes", () => {
    render(
      <I18nProvider>
        <SectionWrapper id="test-sec" label="Test Section Label">
          <OptimizedImage src="/favicon.svg" alt="Test Icon" />
        </SectionWrapper>
      </I18nProvider>
    );

    const section = screen.getByLabelText("Test Section Label");
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("id", "test-sec");

    const img = screen.getByAltText("Test Icon");
    expect(img).toBeInTheDocument();
  });
});
