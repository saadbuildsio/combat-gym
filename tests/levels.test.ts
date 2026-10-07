import { describe, expect, it } from "vitest";
import { BOXING_LEVELS } from "@/content/boxing/levels";
import { BOXING_LESSONS } from "@/content/boxing/lessons";
import { BOXING_DRILLS } from "@/content/boxing/drills";
import { BOXING_OPPONENTS } from "@/content/boxing/opponents";
import { ALL_MOVE_IDS, LESSON_MOVES, calloutName, getMove, movesForCallout } from "@/content/boxing/moves";
import {
  COMBINATION_CALLOUTS,
  COMBINED_CALLOUTS,
  DEFENSE_CALLOUTS,
  DEFENSE_MIXED_CALLOUTS,
  FIGHT_IQ_CALLOUTS,
  PUNCH_COMBOS_BY_LESSON,
} from "@/content/boxing/callouts";
import { shadowRoundCallouts } from "@/content/boxing/round-callouts";
import { JOINTS } from "@/domain/pose";
import { unlockedLevels } from "@/domain/curriculum";
import { buildDailySession, practiceRounds } from "@/domain/session-builder";
import { emptySkills } from "@/domain/skills";

const allLessonIds = BOXING_LEVELS.flatMap((l) => l.lessonIds);
const throughLevel = (n: number) => BOXING_LEVELS.filter((l) => l.level <= n).flatMap((l) => l.lessonIds);
const SHADOW_DRILLS = BOXING_DRILLS.filter((d) => d.kind === "shadowRound").map((d) => d.id);
const CALLOUT_TABLES = [PUNCH_COMBOS_BY_LESSON, COMBINATION_CALLOUTS, DEFENSE_CALLOUTS, DEFENSE_MIXED_CALLOUTS, COMBINED_CALLOUTS, FIGHT_IQ_CALLOUTS];

describe("levels 1-6", () => {
  it("are in unlock order 1 to 6 with rising XP, all ready", () => {
    expect(BOXING_LEVELS.map((l) => l.level)).toEqual([1, 2, 3, 4, 5, 6]);
    for (let i = 1; i < BOXING_LEVELS.length; i++) expect(BOXING_LEVELS[i].unlockXp).toBeGreaterThan(BOXING_LEVELS[i - 1].unlockXp);
    expect(BOXING_LEVELS.every((l) => l.contentReady && l.lessonIds.length > 0)).toBe(true);
  });

  it("every lesson id in a level has a lesson at that level, and every lesson is in a level", () => {
    expect(new Set(allLessonIds).size).toBe(allLessonIds.length);
    for (const level of BOXING_LEVELS) {
      for (const id of level.lessonIds) {
        const lesson = BOXING_LESSONS.find((l) => l.id === id);
        expect(lesson, id).toBeDefined();
        expect(lesson!.level, id).toBe(level.level);
        expect(lesson!.sport).toBe("boxing");
      }
    }
    expect(BOXING_LESSONS.map((l) => l.id).sort()).toEqual([...allLessonIds].sort());
  });

  it("lessons are complete", () => {
    for (const l of BOXING_LESSONS) {
      expect(l.mechanics.length, l.id).toBeGreaterThanOrEqual(3);
      expect(l.commonMistakes.length, l.id).toBeGreaterThanOrEqual(2);
      expect(l.safetyNotes.length, l.id).toBeGreaterThan(0);
      expect(l.quiz.length, l.id).toBeGreaterThan(0);
      expect(l.minutes).toBeGreaterThan(0);
    }
  });

  it("quiz ids are unique and every correct answer is in range", () => {
    const quiz = BOXING_LESSONS.flatMap((l) => l.quiz);
    expect(new Set(quiz.map((q) => q.id)).size).toBe(quiz.length);
    for (const q of quiz) {
      expect(q.correctIndex, q.id).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex, q.id).toBeLessThan(q.options.length);
    }
  });

  it("opens all six levels for a player who has done everything", () => {
    expect(unlockedLevels(7000, allLessonIds).map((l) => l.level)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(unlockedLevels(7000, throughLevel(3)).map((l) => l.level)).toEqual([1, 2, 3, 4]);
  });
});

describe("moves for the new lessons", () => {
  it("every lesson has moves that exist", () => {
    for (const l of BOXING_LESSONS) {
      const moves = LESSON_MOVES[l.id];
      expect(moves?.length, l.id).toBeGreaterThan(0);
      expect(new Set(moves).size, l.id).toBe(moves.length);
      for (const id of moves) expect(ALL_MOVE_IDS).toContain(id);
    }
  });

  it("keeps every joint on the canvas", () => {
    for (const id of ALL_MOVE_IDS) {
      for (const f of getMove(id).frames) {
        for (const j of JOINTS) {
          const p = f.pose.joints[j];
          const x = (p.x - 110) * f.pose.scale + 110 + f.pose.shiftX;
          const y = (p.y - 200) * f.pose.scale + 200;
          expect(x, `${id} ${j}`).toBeGreaterThan(5);
          expect(x, `${id} ${j}`).toBeLessThan(295);
          expect(y, `${id} ${j}`).toBeGreaterThan(5);
          expect(y, `${id} ${j}`).toBeLessThanOrEqual(202);
        }
      }
    }
  });

  it("slips move the head off the centre line and the roll bends the knees", () => {
    const guard = getMove("guard").frames[1].pose.joints;
    for (const id of ["slip-left", "slip-right"] as const) {
      const head = getMove(id).frames[0].pose.joints.head;
      expect(Math.abs(head.x - guard.head.x) + Math.abs(head.y - guard.head.y), id).toBeGreaterThan(10);
    }
    const low = getMove("roll").frames[0].pose.joints;
    expect(low.hip.y).toBeGreaterThan(guard.hip.y + 10);
    expect(low.head.y).toBeGreaterThan(guard.head.y + 20);
  });
});

describe("callouts", () => {
  it("every callout in every list maps to moves", () => {
    for (const table of CALLOUT_TABLES) {
      for (const [lessonId, callouts] of Object.entries(table)) {
        expect(allLessonIds, lessonId).toContain(lessonId);
        for (const c of callouts) expect(movesForCallout(c).length, c).toBeGreaterThan(0);
      }
    }
  });

  it("parses and names mixed callouts", () => {
    expect(movesForCallout("1, 2, slip left")).toEqual(["jab", "cross", "slip-left"]);
    expect(movesForCallout("Roll, 3, 2")).toEqual(["roll", "lead-hook", "cross"]);
    expect(movesForCallout("1, body 2")).toEqual(["jab", "body-cross"]);
    expect(movesForCallout("1, 2, dance")).toEqual([]);
    expect(calloutName("1, 2, slip left")).toBe("Jab, cross, slip left");
    expect(calloutName("Slip right, 2")).toBe("Slip right, cross");
    expect(calloutName("body 3, 3")).toBe("Body lead hook, lead hook");
    expect(calloutName("Pull back")).toBe("Pull back");
  });

  it("shadowRoundCallouts always returns animated callouts with a sensible gap", () => {
    const stages = [[], ["boxing-stance"], ...BOXING_LEVELS.map((l) => throughLevel(l.level)), ["boxing-jab"]];
    for (const drillId of [...SHADOW_DRILLS, "unknown"]) {
      for (const done of stages) {
        const { callouts, every } = shadowRoundCallouts(drillId, done);
        expect(callouts.length, drillId).toBeGreaterThan(0);
        for (const c of callouts) expect(movesForCallout(c).length, `${drillId}: ${c}`).toBeGreaterThan(0);
        expect(every).toBeGreaterThanOrEqual(3);
        expect(every).toBeLessThanOrEqual(6);
      }
    }
  });

  it("only calls what has been learned", () => {
    expect(shadowRoundCallouts("shadow-punches", ["boxing-stance"]).callouts).toContain("Step forward");
    expect(shadowRoundCallouts("shadow-punches", ["boxing-jab"]).callouts).toEqual(["1", "1, 1"]);
    const level2 = throughLevel(2);
    expect(shadowRoundCallouts("shadow-punches", level2).callouts.some((c) => /slip/i.test(c))).toBe(false);
    const withSlip = shadowRoundCallouts("shadow-defense", [...throughLevel(3), "boxing-block", "boxing-slip"]).callouts;
    expect(withSlip).toContain("Slip left");
    expect(withSlip).toContain("1, 2, slip left");
    expect(withSlip.some((c) => /roll/i.test(c))).toBe(false);
    expect(shadowRoundCallouts("shadow-punches", [...throughLevel(3), "boxing-slip"]).callouts).toContain("Slip right, 2");
  });

  it("gives longer combos more time", () => {
    expect(shadowRoundCallouts("shadow-fundamentals", []).every).toBe(3);
    expect(shadowRoundCallouts("shadow-combos", throughLevel(3)).every).toBeGreaterThanOrEqual(5);
  });
});

describe("practice by progress", () => {
  const base = { date: "2026-10-07", minutes: 30, totalXp: 7000, skills: emptySkills() };
  const practiceIds = (done: string[]) => buildDailySession({ ...base, completedLessonIds: done }).blocks.filter((b) => b.type === "practice").map((b) => b.drillId);

  it("moves up the shadow rounds as lessons are completed", () => {
    expect(practiceRounds([])).toEqual(["shadow-fundamentals"]);
    expect(practiceIds(throughLevel(2))[0]).toBe("shadow-punches");
    expect(practiceIds([...throughLevel(2), "boxing-one-two"])[0]).toBe("shadow-combos");
    expect(practiceIds([...throughLevel(3), "boxing-block"])).toEqual(["shadow-defense", "shadow-combos"]);
    expect(practiceIds([...throughLevel(4), "boxing-pivot"])[0]).toBe("shadow-combined");
    expect(practiceIds(throughLevel(6))[0]).toBe("shadow-ring-iq");
  });

  it("stays within the time budget at every stage", () => {
    for (const minutes of [5, 10, 15, 30, 45]) {
      for (let n = 1; n <= 6; n++) {
        const plan = buildDailySession({ ...base, minutes, completedLessonIds: throughLevel(n) });
        expect(plan.totalMinutes).toBeLessThanOrEqual(minutes);
        expect(plan.blocks[0].type).toBe("warmup");
        expect(plan.blocks.at(-1)!.type).toBe("cooldown");
      }
    }
  });
});

describe("opponents", () => {
  it("are all available with three valid scenarios and unique ids", () => {
    const ids = BOXING_OPPONENTS.flatMap((o) => o.scenarios.map((s) => s.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const o of BOXING_OPPONENTS) {
      expect(o.availableInMvp, o.id).toBe(true);
      expect(o.scenarios.length, o.id).toBe(3);
      for (const s of o.scenarios) {
        expect(s.bestIndex).toBeLessThan(s.options.length);
        for (const i of s.okIndexes) {
          expect(i).toBeLessThan(s.options.length);
          expect(i).not.toBe(s.bestIndex);
        }
      }
    }
    expect(BOXING_OPPONENTS.map((o) => o.unlockLevel)).toEqual([1, 2, 3, 5, 6]);
  });
});
