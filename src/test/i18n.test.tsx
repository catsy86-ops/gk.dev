import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { I18nProvider } from "@/components/I18nProvider";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";

const TestComponent = () => {
  const { lang, t } = useI18n();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="greeting">{t.hero.greeting}</span>
      <LanguageToggle />
    </div>
  );
};

describe("i18n system", () => {
  it("provides default polish translations and toggles to english", () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId("lang")).toHaveTextContent("pl");
    expect(screen.getByTestId("greeting")).toHaveTextContent("Cześć");

    const toggleBtn = screen.getByRole("button", { name: /Zmień język/i });
    fireEvent.click(toggleBtn);

    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    expect(screen.getByTestId("greeting")).toHaveTextContent("Hello");
  });
});
