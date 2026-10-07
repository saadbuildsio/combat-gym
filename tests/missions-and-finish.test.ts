import { describe, expect, it } from "vitest";
import { missionsFor } from "@/domain/missions";
import { availableOpponents, finishSession } from "@/domain/finish-session";
import { createProfile } from "@/domain/progress";
import type { CompletedSession } from "@/domain/types";

const session = (date: string, minutes: number, score: number): CompletedSession => ({
  planId: `s-${date}`,
  date,
  sport: "boxing",
  minutes,
  xpEarned: 50,
  results: [{ drillId: "fightiq-opponent", kind: "fightIQ", completed: true, scores: { fightIQ: score } }],
});

describe("missions", () => {
  it("tracks daily and weekly progress from history", () => {
    const history = [session("2026-10-05", 6, 50), session("2026-10-07", 5, 80), session("2026-10-07", 6, 60)];
    const byId = Object.fromEntries(missionsFor(history, "2026-10-07").map((m) => [m.id, m]));
    expect(byId["daily-session"].done).toBe(true);
    expect(byId["daily-minutes"].progress).toBe(10);
    expect(byId["daily-score"].done).toBe(true);
    expect(byId["weekly-days"].progress).toBe(2);
    expect(byId["weekly-fightiq"].done).toBe(true);
  });
});

describe("finishSession", () => {
  it("counts real seconds for timed rounds and saves the session", () => {
    const profile = createProfile("p", "Test", new Date());
    const out = finishSession(profile, {
      planId: "s",
      date: "2026-10-07",
      completedLessonIds: [],
      blocks: [
        { minutes: 3, result: { drillId: "shadow-punches", kind: "shadowRound", completed: true, scores: { conditioning: 90 }, stats: { secondsCompleted: 120, secondsPlanned: 180 } } },
        { minutes: 2, result: { drillId: "recall-combos", kind: "comboRecall", completed: true, scores: { comboRecall: 80 } } },
      ],
    });
    expect(out.profile.history).toHaveLength(1);
    expect(out.profile.history[0].minutes).toBe(4);
    expect(out.profile.skills.comboRecall).toBe(80);
  });

  it("unlocks the counter puncher at player level 2", () => {
    expect(availableOpponents(0).map((o) => o.id)).toEqual(["aggressor"]);
    // Opponents open with their curriculum level, not with XP alone.
    expect(availableOpponents(5000).map((o) => o.id)).toEqual(["aggressor"]);
    const level1 = ["boxing-stance", "boxing-guard", "boxing-step-drag", "boxing-lateral"];
    expect(availableOpponents(300, level1).map((o) => o.id)).toEqual(["aggressor", "counter-puncher"]);
  });
});
