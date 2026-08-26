import { describe, it, expect } from "vitest";
import { calculatePasswordStrength } from "@/lib/password-strength";

describe("calculatePasswordStrength", () => {
  it("returns default score 0 for empty password", () => {
    const result = calculatePasswordStrength("");
    expect(result.score).toBe(0);
    expect(result.hasMinLength).toBe(false);
  });

  it("identifies weak password with only lowercase letters and short length", () => {
    const result = calculatePasswordStrength("abc");
    expect(result.score).toBe(0);
    expect(result.hasMinLength).toBe(false);
  });

  it("identifies medium/fair password", () => {
    const result = calculatePasswordStrength("Abcdefgh");
    expect(result.score).toBeGreaterThanOrEqual(2);
    expect(result.hasMinLength).toBe(true);
    expect(result.hasUppercase).toBe(true);
  });

  it("identifies good password with letters and numbers", () => {
    const result = calculatePasswordStrength("Abcdefg123");
    expect(result.score).toBeGreaterThanOrEqual(3);
    expect(result.hasMinLength).toBe(true);
    expect(result.hasNumber).toBe(true);
    expect(result.hasUppercase).toBe(true);
  });

  it("identifies strong password with length >= 12, uppercase, numbers and symbols", () => {
    const result = calculatePasswordStrength("SuperSecret123!@#");
    expect(result.score).toBe(4);
    expect(result.labelPl).toBe("Pancerne");
    expect(result.labelEn).toBe("Strong");
    expect(result.hasMinLength).toBe(true);
    expect(result.hasNumber).toBe(true);
    expect(result.hasUppercase).toBe(true);
    expect(result.hasSpecialChar).toBe(true);
  });
});
