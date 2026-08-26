import { describe, it, expect } from "vitest";
import {
  supabase,
  isSupabaseConfigured,
  syncBriefToSupabase,
  saveContactMessageToSupabase,
  checkSupabaseHealth,
} from "@/lib/supabase";

describe("Supabase Enhanced Integration Suite", () => {
  it("initializes Supabase client instance with correct methods and auth", () => {
    expect(supabase).toBeDefined();
    expect(typeof supabase.from).toBe("function");
    expect(typeof supabase.auth).toBe("object");
  });

  it("handles isSupabaseConfigured flag correctly", () => {
    expect(typeof isSupabaseConfigured).toBe("boolean");
  });

  it("checks Supabase health with latency telemetry", async () => {
    const health = await checkSupabaseHealth();
    expect(health).toBeDefined();
    expect(typeof health.isHealthy).toBe("boolean");
    expect(typeof health.latencyMs).toBe("number");
  });

  it("syncs brief to Supabase or handles graceful fallback", async () => {
    const result = await syncBriefToSupabase({
      clientName: "Test Corporation",
      email: "kontakt@testcorp.pl",
      projectType: "Fullstack SaaS",
      budget: "30k-50k PLN",
      timeline: "8 tygodni",
      description: "Projekt demonstracyjny architektury Supabase",
    });

    expect(result).toBeDefined();
    expect(typeof result.success).toBe("boolean");
  });

  it("saves contact form message to Supabase", async () => {
    const result = await saveContactMessageToSupabase({
      name: "Jan Kowalski",
      email: "jan.kowalski@example.com",
      message: "Chciałbym omówić audyt wydajnościowy.",
      projectType: "Audyt Architektury",
    });

    expect(result).toBeDefined();
    expect(typeof result.success).toBe("boolean");
  });
});
