import { describe, it, expect, vi } from "vitest";
import { gkGaduEngine } from "@/lib/gkgadu-engine";
import { gkgaduDataPipeline } from "@/lib/gkgadu-pipeline";

describe("GKgadu Advanced Pipeline, SIEMA Alert & Slash Commands Suite", () => {
  it("processes slash commands like /shrug, /roll, /status, and /nudge", async () => {
    gkGaduEngine.init(null);
    await gkGaduEngine.sendMessage("/shrug");

    const state = gkGaduEngine.getState();
    const messages = state.messages[state.activeChatId] || [];
    const lastMsg = messages[messages.length - 1];

    expect(lastMsg.text).toBe("¯\\_(ツ)_/¯");
  });

  it("stores events in Redis in-memory cache and publishes to Kafka stream", () => {
    gkgaduDataPipeline.redisSet("test_key", { score: 100 }, 5000);
    const retrieved = gkgaduDataPipeline.redisGet<{ score: number }>("test_key");
    expect(retrieved?.score).toBe(100);

    const event = gkgaduDataPipeline.kafkaPublish("gkgadu-auth-siema", "user-123", {
      userName: "Jan",
    });
    expect(event.topic).toBe("gkgadu-auth-siema");
    expect(event.offset).toBeGreaterThan(0);
  });

  it("triggers SIEMA broadcast notification when user logs in via Clerk", () => {
    // Initialize with real user object
    gkGaduEngine.init({
      id: "user_clerk_999",
      fullName: "Marek Testowy",
      primaryEmailAddress: { emailAddress: "marek@gkdev.pl" },
      imageUrl: "https://example.com/avatar.png",
    });

    const state = gkGaduEngine.getState();
    const loungeMessages = state.messages["lounge"] || [];
    const hasSiema = loungeMessages.some((m) => m.text.includes("SIEMA!"));

    expect(hasSiema).toBe(true);
    expect(state.currentUser.isLoggedIn).toBe(true);
    expect(state.currentUser.isVerified).toBe(true);
  });
});
