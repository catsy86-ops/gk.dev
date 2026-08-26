import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ClerkAuthProvider from "@/components/auth/ClerkAuthProvider";
import { I18nProvider } from "@/components/I18nProvider";

describe("ClerkAuthProvider Component Suite", () => {
  it("renders children wrapped inside provider", () => {
    render(
      <I18nProvider>
        <ClerkAuthProvider>
          <div data-testid="protected-child">Test Application Content</div>
        </ClerkAuthProvider>
      </I18nProvider>
    );

    expect(screen.getByTestId("protected-child")).toBeInTheDocument();
    expect(screen.getByText("Test Application Content")).toBeInTheDocument();
  });
});
