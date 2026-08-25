import { describe, it, expect } from "vitest";
import { queryAiAssistant } from "@/lib/ai-engine";

describe("ai-engine", () => {
  it("matches availability keywords accurately", () => {
    const res = queryAiAssistant("Czy Grzegorz jest dostępny na b2b?");
    expect(res.category).toBe("availability");
    expect(res.answer).toContain("dostępny");
  });

  it("matches stack and technologies keywords", () => {
    const res = queryAiAssistant("W jakim stacku technologicznym piszesz?");
    expect(res.category).toBe("stack");
    expect(res.answer).toContain("React 19");
  });

  it("matches pricing queries", () => {
    const res = queryAiAssistant("Ile kosztuje stworzenie MVP?");
    expect(res.category).toBe("pricing");
    expect(res.answer).toContain("PLN");
  });

  it("returns helpful fallback for unknown queries", () => {
    const res = queryAiAssistant("xyz12345");
    expect(res.category).toBe("general");
    expect(res.answer).toContain("asystentem inżynieryjnym Grzegorza");
  });
});
