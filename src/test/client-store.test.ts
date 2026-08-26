import { describe, it, expect, beforeEach } from "vitest";
import { clientStore } from "@/lib/client-store";

describe("clientStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("toggles bookmarks correctly", () => {
    expect(clientStore.isBookmarked("art-1")).toBe(false);
    const added = clientStore.toggleBookmark("art-1");
    expect(added).toBe(true);
    expect(clientStore.isBookmarked("art-1")).toBe(true);

    const removed = clientStore.toggleBookmark("art-1");
    expect(removed).toBe(false);
    expect(clientStore.isBookmarked("art-1")).toBe(false);
  });

  it("saves and removes briefs", () => {
    const brief = clientStore.saveBrief({
      projectType: "SaaS Platform",
      timeline: "3-6 miesięcy",
      content: "Brief content test",
    });

    expect(brief.id).toBeDefined();
    expect(clientStore.getState().briefs.length).toBe(1);

    clientStore.removeBrief(brief.id);
    expect(clientStore.getState().briefs.length).toBe(0);
  });

  it("saves and removes bookings", () => {
    const booking = clientStore.saveBooking({
      date: "2026-09-01",
      timeSlot: "11:00",
      topic: "Architektura SaaS",
      name: "Jan Kowalski",
      email: "jan@example.com",
    });

    expect(booking.id).toBeDefined();
    expect(clientStore.getState().bookings.length).toBe(1);

    clientStore.removeBooking(booking.id);
    expect(clientStore.getState().bookings.length).toBe(0);
  });
});
