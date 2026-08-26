import { describe, it, expect } from "vitest";
import { validateForm, sanitizeInput, isValidEmail, type ContactFormData } from "@/lib/validation";

describe("Form Validation & Security Suite", () => {
  describe("sanitizeInput", () => {
    it("should strip HTML tags and script injections", () => {
      const malicious = "<script>alert('xss')</script>Hello <b>World</b>";
      const sanitized = sanitizeInput(malicious);
      expect(sanitized).toBe("alert('xss')Hello World");
      expect(sanitized).not.toContain("<script>");
      expect(sanitized).not.toContain("<b>");
    });

    it("should remove javascript: pseudo protocol", () => {
      const evil = "javascript:void(0)";
      expect(sanitizeInput(evil)).toBe("void(0)");
    });

    it("should handle empty and whitespace strings", () => {
      expect(sanitizeInput("")).toBe("");
      expect(sanitizeInput("   ")).toBe("");
    });
  });

  describe("isValidEmail", () => {
    it("should accept valid email formats", () => {
      expect(isValidEmail("kontakt@gkdev.pl")).toBe(true);
      expect(isValidEmail("user.name+tag@domain.co.uk")).toBe(true);
      expect(isValidEmail("dev123@sub.cloud.io")).toBe(true);
    });

    it("should reject invalid email formats", () => {
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail("plainaddress")).toBe(false);
      expect(isValidEmail("@missingusername.com")).toBe(false);
      expect(isValidEmail("user@domain")).toBe(false);
      expect(isValidEmail("user@.com")).toBe(false);
      expect(isValidEmail("user name@domain.com")).toBe(false);
    });
  });

  describe("validateForm", () => {
    it("should return 0 errors for valid contact data", () => {
      const validData: ContactFormData = {
        name: "Grzegorz",
        email: "grzegorz@gkdev.pl",
        message: "Chciałbym omówić stworzenie dedykowanej aplikacji SaaS w Next.js.",
      };
      const errors = validateForm(validData);
      expect(Object.keys(errors).length).toBe(0);
    });

    it("should reject empty or whitespace-only fields", () => {
      const emptyData: ContactFormData = {
        name: "   ",
        email: "   ",
        message: "   ",
      };
      const errors = validateForm(emptyData);
      expect(errors.name).toBe("Imię jest wymagane");
      expect(errors.email).toBe("Email jest wymagany");
      expect(errors.message).toBe("Wiadomość jest wymagana");
    });

    it("should enforce name and message length limits", () => {
      const shortData: ContactFormData = {
        name: "A",
        email: "valid@email.com",
        message: "Hi",
      };
      const errors = validateForm(shortData);
      expect(errors.name).toBe("Imię musi mieć minimum 2 znaki");
      expect(errors.message).toBe("Wiadomość musi mieć minimum 5 znaków");
    });
  });
});
