import { describe, expect, it } from "vitest";
import { LESSON_MOVES, calloutName, getMove, movesForCallout } from "@/content/boxing/moves";
import { MOVEMENT_CALLOUTS, PUNCH_COMBOS } from "@/content/boxing/callouts";
import { BOXING_LESSONS } from "@/content/boxing/lessons";
import { GUARD_POSE } from "@/content/boxing/moves";
import { poseAt } from "@/domain/pose";

describe("move animations", () => {
  it("has an animation for every callout used in rounds", () => {
    for (const callout of [...PUNCH_COMBOS, ...MOVEMENT_CALLOUTS]) {
      expect(movesForCallout(callout).length, callout).toBeGreaterThan(0);
    }
  });

  it("turns a combo into its punches in order", () => {
    expect(movesForCallout("1, 2, 3")).toEqual(["jab", "cross", "lead-hook"]);
    expect(calloutName("1, 6, 3")).toBe("Jab, rear uppercut, lead hook");
    expect(calloutName("Step back")).toBe("Step back");
  });

  it("has an animation for every lesson", () => {
    for (const lesson of BOXING_LESSONS) {
      const moves = LESSON_MOVES[lesson.id];
      expect(moves?.length, lesson.id).toBeGreaterThan(0);
      for (const id of moves) expect(getMove(id).frames.length).toBeGreaterThan(0);
    }
  });

  it("starts and ends a punch in guard", () => {
    const jab = getMove("jab").frames;
    const total = jab.reduce((s, f) => s + f.ms, 0);
    expect(poseAt(GUARD_POSE, jab, 0).pose.joints.leadFist).toEqual(GUARD_POSE.joints.leadFist);
    expect(poseAt(GUARD_POSE, jab, total + 1).pose.joints.leadFist).toEqual(GUARD_POSE.joints.leadFist);
    // Halfway out, the jab hand is in front of the guard.
    expect(poseAt(GUARD_POSE, jab, jab[0].ms).pose.joints.leadFist.x).toBeGreaterThan(GUARD_POSE.joints.leadFist.x + 30);
  });
});
