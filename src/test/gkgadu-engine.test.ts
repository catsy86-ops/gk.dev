import { describe, it, expect } from "vitest";
import { gkGaduEngine, INITIAL_CONTACTS } from "@/lib/gkgadu-engine";

describe("GKgadu Real-Time Engine Suite", () => {
  it("initializes with default contacts and lounge messages", () => {
    const state = gkGaduEngine.getState();
    expect(state.contacts.length).toBeGreaterThanOrEqual(INITIAL_CONTACTS.length);
    expect(state.messages["lounge"]).toBeDefined();
    expect(state.messages["lounge"].length).toBeGreaterThan(0);
    expect(state.currentUser.ggNumber).toBeGreaterThan(0);
  });

  it("updates user status and custom description", () => {
    gkGaduEngine.setStatus("busy", "Spotkanie z klientem... ☕");
    const state = gkGaduEngine.getState();
    expect(state.currentUser.status).toBe("busy");
    expect(state.currentUser.statusDescription).toBe("Spotkanie z klientem... ☕");
  });

  it("generates deterministic 7-digit GG number from user id", () => {
    const gg1 = gkGaduEngine.hashStringToGgNumber("user_2N9x82910");
    const gg2 = gkGaduEngine.hashStringToGgNumber("user_2N9x82910");
    const gg3 = gkGaduEngine.hashStringToGgNumber("user_different_id_99");

    expect(gg1).toBe(gg2);
    expect(gg1).toBeGreaterThanOrEqual(2000000);
    expect(gg1).toBeLessThanOrEqual(9999999);
    expect(gg1).not.toBe(gg3);
  });

  it("sends message and appends to active chat history", () => {
    gkGaduEngine.setActiveChat("lounge");
    const initialLen = gkGaduEngine.getState().messages["lounge"]?.length || 0;

    gkGaduEngine.sendMessage("Testowa wiadomość na żywo z Vitest!");
    const updatedState = gkGaduEngine.getState();

    expect(updatedState.messages["lounge"].length).toBe(initialLen + 1);
    const lastMsg = updatedState.messages["lounge"][updatedState.messages["lounge"].length - 1];
    expect(lastMsg.text).toBe("Testowa wiadomość na żywo z Vitest!");
  });

  it("sends nudge and activates temporary nudge shake state", () => {
    gkGaduEngine.sendNudge();
    const state = gkGaduEngine.getState();
    expect(state.isNudgeActive).toBe(true);
  });

  it("toggles sound effects", () => {
    const initial = gkGaduEngine.getState().soundEnabled;
    gkGaduEngine.toggleSound();
    expect(gkGaduEngine.getState().soundEnabled).toBe(!initial);
    gkGaduEngine.toggleSound();
  });

  it("handles Clerk user initialization and marks user as verified", () => {
    gkGaduEngine.init({
      id: "clerk_user_pro_999",
      fullName: "Jan Kowalski",
      primaryEmailAddress: { emailAddress: "jan@example.com" },
      imageUrl: "https://images.example.com/avatar.jpg",
    });

    const state = gkGaduEngine.getState();
    expect(state.currentUser.isLoggedIn).toBe(true);
    expect(state.currentUser.isVerified).toBe(true);
    expect(state.currentUser.name).toBe("Jan Kowalski");
    expect(state.currentUser.ggNumber).toBeGreaterThan(2000000);
  });

  it("adds and toggles emoji reactions on messages", () => {
    gkGaduEngine.setActiveChat("lounge");
    const msgs = gkGaduEngine.getState().messages["lounge"];
    const firstMsg = msgs[0];

    gkGaduEngine.addReaction(firstMsg.id, "☀️");
    let updatedMsgs = gkGaduEngine.getState().messages["lounge"];
    let target = updatedMsgs.find((m) => m.id === firstMsg.id);
    expect(target?.reactions?.["☀️"]).toBeDefined();
    expect(target?.reactions?.["☀️"]?.length).toBe(1);

    // Toggle reaction off
    gkGaduEngine.addReaction(firstMsg.id, "☀️");
    updatedMsgs = gkGaduEngine.getState().messages["lounge"];
    target = updatedMsgs.find((m) => m.id === firstMsg.id);
    expect(target?.reactions?.["☀️"]).toBeUndefined();
  });
});
