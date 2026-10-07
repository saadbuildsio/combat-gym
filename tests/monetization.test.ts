import { describe, expect, it } from "vitest";
import { BANNER_PLACEMENTS, shouldShowInterstitial, showsAds } from "@/domain/monetization";

const now = new Date("2026-10-07T12:00:00Z");
const base = { plan: "free" as const, lastShownAt: null, now, reportedPain: false };

describe("free and pro", () => {
  it("never shows ads to Pro", () => {
    expect(showsAds("pro")).toBe(false);
    expect(shouldShowInterstitial({ ...base, plan: "pro", sessionsCompleted: 10 })).toBe(false);
  });

  it("keeps the first sessions ad-free, then shows a full-screen ad every other session", () => {
    const shown = [1, 2, 3, 4, 5, 6, 7, 8].filter((n) => shouldShowInterstitial({ ...base, sessionsCompleted: n }));
    expect(shown).toEqual([5, 7]);
  });

  it("never shows a full-screen ad twice within 15 minutes or after a pain report", () => {
    expect(shouldShowInterstitial({ ...base, sessionsCompleted: 5, lastShownAt: new Date(now.getTime() - 10 * 60_000) })).toBe(false);
    expect(shouldShowInterstitial({ ...base, sessionsCompleted: 5, lastShownAt: new Date(now.getTime() - 20 * 60_000) })).toBe(true);
    expect(shouldShowInterstitial({ ...base, sessionsCompleted: 5, reportedPain: true })).toBe(false);
  });

  it("never places banners on training screens", () => {
    for (const p of ["train", "session", "lesson", "fight"]) expect(BANNER_PLACEMENTS).not.toContain(p);
  });
});
