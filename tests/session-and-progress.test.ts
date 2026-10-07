import { describe, expect, it } from "vitest";
import { buildDailySession } from "@/domain/session-builder";
import { buildStartingProgram } from "@/domain/onboarding";
import { applySession, completeOnboarding, createProfile } from "@/domain/progress";
import { emptySkills } from "@/domain/skills";
import { SPORTS } from "@/content/sports";
import { BOXING_LEVELS } from "@/content/boxing/levels";
import { BOXING_LESSONS } from "@/content/boxing/lessons";
import type { CompletedSession } from "@/domain/types";

describe("content integrity", () => {
  it("only boxing is available", () => {
    expect(SPORTS.filter((s) => s.status === "available").map((s) => s.id)).toEqual(["boxing"]);
  });

  it("every lesson in a ready level exists and has a quiz", () => {
    for (const level of BOXING_LEVELS.filter((l) => l.contentReady)) {
      for (const id of level.lessonIds) {
        const lesson = BOXING_LESSONS.find((l) => l.id === id);
        expect(lesson, id).toBeDefined();
        expect(lesson!.quiz.length).toBeGreaterThan(0);
        expect(lesson!.safetyNotes.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("onboarding", () => {
  it("caps complete beginners at 15 minutes", () => {
    const p = buildStartingProgram({ experience: "complete_beginner", goal: "fitness", minutesPerDay: 45 });
    expect(p.sessionMinutes).toBe(15);
    expect(p.startingXp).toBe(0);
    expect(p.advisory).not.toBeNull();
  });

  it("warns competition-prep users to train with a real coach", () => {
    const p = buildStartingProgram({ experience: "intermediate", goal: "competition_prep", minutesPerDay: 30 });
    expect(p.startingXp).toBe(300);
    expect(p.advisory).toMatch(/qualified coach/);
  });
});

describe("daily session", () => {
  const base = { date: "2026-10-07", totalXp: 0, skills: emptySkills(), completedLessonIds: [] };

  it("always starts with a warm-up and ends with a cool-down, within the time budget", () => {
    for (const minutes of [5, 10, 15, 30]) {
      const plan = buildDailySession({ ...base, minutes });
      expect(plan.blocks[0].type).toBe("warmup");
      expect(plan.blocks.at(-1)!.type).toBe("cooldown");
      expect(plan.totalMinutes).toBeLessThanOrEqual(minutes);
    }
  });

  it("teaches the next lesson for a new user", () => {
    const plan = buildDailySession({ ...base, minutes: 15 });
    expect(plan.blocks.find((b) => b.type === "learn")?.lessonId).toBe("boxing-stance");
  });
});

describe("applying a session", () => {
  it("updates XP, skills, streak, lessons, achievements and coach note", () => {
    let profile = createProfile("p1", "Saad", new Date("2026-10-07T08:00:00Z"));
    profile = completeOnboarding(profile, { experience: "complete_beginner", goal: "learn_boxing", minutesPerDay: 15 }, 0);

    const session: CompletedSession = {
      planId: "session-2026-10-07",
      date: "2026-10-07",
      sport: "boxing",
      minutes: 13,
      xpEarned: 150,
      results: [
        { drillId: "warmup-basic", kind: "warmup", completed: true, scores: {} },
        { drillId: "reaction-punch-numbers", kind: "reaction", completed: true, scores: { reaction: 82 }, stats: { avgReactionMs: 520 } },
        { drillId: "quiz-lesson", kind: "quiz", completed: true, scores: { knowledge: 40 } },
      ],
    };

    const out = applySession(profile, session, ["boxing-stance"]);
    expect(out.profile.skills.reaction).toBe(82);
    expect(out.profile.streak.current).toBe(1);
    expect(out.profile.completedLessonIds).toContain("boxing-stance");
    expect(out.newAchievements).toEqual(expect.arrayContaining(["first_session", "quick_hands"]));
    expect(out.profile.totalXp).toBe(150 + 50 + 75);
    expect(out.coach.detail).toMatch(/Knowledge scored 40 and needs work/);
    expect(out.coach.headline).not.toMatch(/^Great job/);
  });

  it("switches the coach to a safety message when pain is reported", () => {
    const profile = createProfile("p1", "Saad", new Date());
    const out = applySession(
      profile,
      { planId: "s", date: "2026-10-07", sport: "boxing", minutes: 3, xpEarned: 10, results: [{ drillId: "shadow-punches", kind: "shadowRound", completed: false, scores: {}, reportedPain: true }] },
      [],
    );
    expect(out.coach.tone).toBe("safety");
  });
});
