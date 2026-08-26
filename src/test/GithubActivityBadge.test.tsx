import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GithubActivityBadge } from "@/components/GithubActivityBadge";

describe("GithubActivityBadge Component Suite", () => {
  it("renders GitHub Live indicator, active commits and link to github profile", () => {
    render(<GithubActivityBadge />);

    expect(screen.getByText(/GitHub Live/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Commits/i)).toBeInTheDocument();
    expect(screen.getByText(/Clean Code 100%/i)).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://github.com/catsy86");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
