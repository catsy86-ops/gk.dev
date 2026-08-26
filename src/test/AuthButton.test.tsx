import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthButton } from "@/components/auth/AuthButton";
import { I18nProvider } from "@/components/I18nProvider";

describe("AuthButton", () => {
  it("renders authentication user button or sign in trigger", () => {
    render(
      <I18nProvider>
        <AuthButton />
      </I18nProvider>
    );

    expect(screen.getByText("User Avatar")).toBeInTheDocument();
  });
});
