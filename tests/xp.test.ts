import { describe, expect, it } from "vitest";
import { levelForXp, levelProgress, totalXpForLevel, xpForDrill, xpForSession } from "@/domain/xp";

describe("xp and levels", () => {
  it("follows the curve", () => {
    expect(totalXpForLevel(1)).toBe(0);
    expect(totalXpForLevel(2)).toBe(100);
    expect(totalXpForLevel(12)).toBe(6600);
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(99)).toBe(1);
    expect(levelForXp(100)).toBe(2);
    expect(levelForXp(7420)).toBe(12);
  });

  it("reports progress into the level", () => {
    const p = levelProgress(7420);
    expect(p.level).toBe(12);
    expect(p.xpIntoLevel).toBe(820);
    expect(p.xpForNextLevel).toBe(1200);
    expect(p.nextTitle).toBe("Counter Puncher");
  });

  it("gives no XP for unfinished drills and a bonus for good scores", () => {
    expect(xpForDrill({ drillId: "x", kind: "reaction", completed: false, scores: { reaction: 90 } }, 2)).toBe(0);
    expect(xpForDrill({ drillId: "x", kind: "reaction", completed: true, scores: { reaction: 100 } }, 2)).toBe(60);
    expect(xpForDrill({ drillId: "x", kind: "warmup", completed: true, scores: {} }, 2)).toBe(20);
  });

  it("halves XP after two sessions in one day", () => {
    const drills = [{ result: { drillId: "w", kind: "warmup" as const, completed: true, scores: {} }, minutes: 2 }];
    expect(xpForSession(drills, 0)).toBe(45);
    expect(xpForSession(drills, 2)).toBe(23);
  });
});
