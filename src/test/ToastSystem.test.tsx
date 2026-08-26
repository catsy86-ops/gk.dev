import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";

describe("Toast Notification System", () => {
  it("dispatches and renders toast notifications", () => {
    render(<Toaster />);

    act(() => {
      toast({
        title: "Test Powiadomienia",
        description: "Operacja powiodła się pomyślnie.",
      });
    });

    expect(screen.getByText("Test Powiadomienia")).toBeInTheDocument();
    expect(screen.getByText("Operacja powiodła się pomyślnie.")).toBeInTheDocument();
  });
});
