import { describe, it, expect } from "vitest";
import {
  ENV,
  isValidClerkKey,
  decodeClerkDomain,
  DEFAULT_CLERK_TEST_KEY,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_ANON_KEY,
  logEnvDiagnostics,
} from "@/lib/env";

describe("GK.dev Environment Configuration & Resolution Suite", () => {
  it("exports valid default fallback constants", () => {
    expect(DEFAULT_CLERK_TEST_KEY).toBeDefined();
    expect(DEFAULT_CLERK_TEST_KEY.startsWith("pk_test_")).toBe(true);
    expect(DEFAULT_SUPABASE_URL.startsWith("https://")).toBe(true);
    expect(DEFAULT_SUPABASE_ANON_KEY).toBeDefined();
  });

  it("validates Clerk publishable key formats correctly", () => {
    // Valid test key
    expect(isValidClerkKey("pk_test_Ymxlc3NlZC1iYXNpbGlzay0zMi5jbGVyay5hY2NvdW50cy5kZXYk")).toBe(true);
    // Valid live key
    expect(isValidClerkKey("pk_live_Ymxlc3NlZC1iYXNpbGlzay0zMi5jbGVyay5hY2NvdW50cy5jb20k")).toBe(true);
    // Invalid keys
    expect(isValidClerkKey("")).toBe(false);
    expect(isValidClerkKey(null)).toBe(false);
    expect(isValidClerkKey(undefined)).toBe(false);
    expect(isValidClerkKey("sk_test_12345678901234567890")).toBe(false);
    expect(isValidClerkKey("invalid_key")).toBe(false);
  });

  it("correctly decodes Clerk domain from publishable key", () => {
    // Base64 of 'blessed-basilisk-32.clerk.accounts.dev$' is 'Ymxlc3NlZC1iYXNpbGlzay0zMi5jbGVyay5hY2NvdW50cy5kZXYk'
    const domain = decodeClerkDomain("pk_test_Ymxlc3NlZC1iYXNpbGlzay0zMi5jbGVyay5hY2NvdW50cy5kZXYk");
    expect(domain).toBe("blessed-basilisk-32.clerk.accounts.dev");

    // Returns null on invalid input
    expect(decodeClerkDomain(null)).toBe(null);
    expect(decodeClerkDomain("invalid")).toBe(null);
  });

  it("resolves unified ENV object with Clerk and Supabase configurations", () => {
    expect(ENV).toBeDefined();
    expect(typeof ENV.isDev).toBe("boolean");
    expect(typeof ENV.isProd).toBe("boolean");
    expect(typeof ENV.isVercel).toBe("boolean");

    // Clerk
    expect(ENV.clerk.publishableKey).toBeDefined();
    expect(ENV.clerk.isValid).toBe(true);
    expect(ENV.clerk.isConfigured).toBe(true);
    expect(typeof ENV.clerk.isLiveKey).toBe("boolean");
    expect(typeof ENV.clerk.isTestKey).toBe("boolean");

    // Supabase
    expect(ENV.supabase.url).toBeDefined();
    expect(ENV.supabase.url.startsWith("https://")).toBe(true);
    expect(ENV.supabase.anonKey).toBeDefined();
    expect(ENV.supabase.isConfigured).toBe(true);
  });

  it("generates safe diagnostics report without exposing full secret keys", () => {
    const diag = ENV.getDiagnostics();
    expect(diag).toBeDefined();
    expect(diag.clerk.configured).toBe(true);
    expect(diag.clerk.validFormat).toBe(true);
    expect(diag.supabase.configured).toBe(true);
    // Keys must be truncated
    expect(diag.clerk.keyPrefix.endsWith("...")).toBe(true);
    expect(diag.supabase.keyPrefix.endsWith("...")).toBe(true);
  });

  it("executes logEnvDiagnostics without runtime errors", () => {
    expect(() => logEnvDiagnostics()).not.toThrow();
  });
});
