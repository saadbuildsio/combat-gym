import { BOXING_DRILLS } from "@/content/boxing/drills";
import { getLesson } from "@/content/boxing/lessons";
import { completedAny, knowsPunches, nextLessonId } from "./curriculum";
import { weakestSkill } from "./skills";
import type { Drill, MeasuredSkill, SessionBlock, SkillRatings, TrainingSessionPlan } from "./types";

/**
 * Builds today's training session.
 *
 * Template: Warm-up → Learn (next lesson) → Practice (shadow round) → Test (drill for the weakest skill)
 *           → Lesson check → Challenges → Review round → Cool-down.
 * The practice round is the most advanced shadow round the player has lessons for
 * (punches, then combinations, defense, combined training and ring IQ); the review round is the one before it.
 * Warm-up and cool-down are always included for safety. Other blocks are added in priority order
 * until the time budget is used.
 */

export interface SessionInput {
  date: string; // YYYY-MM-DD
  minutes: number;
  totalXp: number;
  skills: SkillRatings;
  completedLessonIds: string[];
  /** Level onboarding placed the player at (experienced players start at 2). */
  placedLevel?: number;
  drills?: Drill[];
}

/** Which drill tests which skill. */
const DRILL_FOR_SKILL: Record<MeasuredSkill, string> = {
  reaction: "reaction-punch-numbers",
  comboRecall: "recall-combos",
  fightIQ: "fightiq-opponent",
  knowledge: "quiz-lesson",
  conditioning: "shadow-punches",
  consistency: "shadow-fundamentals",
};

/** Shadow rounds from most to least advanced. Each opens once any lesson it practises is done. */
const PRACTICE_LADDER = ["shadow-ring-iq", "shadow-combined", "shadow-defense", "shadow-combos", "shadow-punches"];

/** Shadow rounds this player is ready for, most advanced first. Movement is always last. */
export function practiceRounds(completedLessonIds: string[], drills: Drill[] = BOXING_DRILLS): string[] {
  const ready = PRACTICE_LADDER.filter((id) => {
    const d = drills.find((x) => x.id === id);
    if (!d) return false;
    // Punch rounds start with the jab, like the punch drills.
    if (id === "shadow-punches") return knowsPunches(completedLessonIds);
    return completedAny(d.lessonIds, completedLessonIds);
  });
  return [...ready, "shadow-fundamentals"];
}

export function buildDailySession(input: SessionInput): TrainingSessionPlan {
  const drills = input.drills ?? BOXING_DRILLS;
  const drill = (id: string) => {
    const found = drills.find((d) => d.id === id);
    if (!found) throw new Error(`Session builder: missing drill ${id}`);
    return found;
  };

  const warmup = drill("warmup-basic");
  const cooldown = drill("cooldown-basic");
  const focus = weakestSkill(input.skills);
  const lessonId = nextLessonId(input.totalXp, input.completedLessonIds, input.placedLevel ?? 1);
  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const rounds = practiceRounds(input.completedLessonIds, drills);

  // Candidate blocks in priority order. Each is added only if it fits the remaining time.
  const candidates: SessionBlock[] = [];
  if (lesson) {
    candidates.push({ type: "learn", title: lesson.title, minutes: lesson.minutes, lessonId: lesson.id });
  }
  const focusDrillId = focus === "conditioning" ? rounds[0] : DRILL_FOR_SKILL[focus];
  const focusDrill = drill(focusDrillId);
  candidates.push({ type: "test", title: focusDrill.title, minutes: focusDrill.minutes, drillId: focusDrill.id });

  const practice = drill(rounds[0]);
  if (practice.id !== focusDrill.id) {
    candidates.push({ type: "practice", title: practice.title, minutes: practice.minutes, drillId: practice.id });
  }
  if (lesson && focusDrill.id !== "quiz-lesson") {
    const quiz = drill("quiz-lesson");
    candidates.push({ type: "test", title: quiz.title, minutes: quiz.minutes, drillId: quiz.id, lessonId: lesson.id });
  }
  for (const id of ["fightiq-opponent", "recall-combos", "reaction-punch-numbers"]) {
    if (id === focusDrill.id) continue;
    const d = drill(id);
    candidates.push({ type: "challenge", title: d.title, minutes: d.minutes, drillId: d.id });
  }
  // Longer sessions also review the previous round, so older skills stay sharp.
  const review = rounds[1] ? drill(rounds[1]) : undefined;
  if (review && review.id !== focusDrill.id) {
    candidates.push({ type: "practice", title: review.title, minutes: review.minutes, drillId: review.id });
  }

  let budget = Math.max(0, input.minutes - warmup.minutes - cooldown.minutes);
  const middle: SessionBlock[] = [];
  for (const block of candidates) {
    if (block.minutes <= budget) {
      middle.push(block);
      budget -= block.minutes;
    }
  }

  const blocks: SessionBlock[] = [
    { type: "warmup", title: warmup.title, minutes: warmup.minutes, drillId: warmup.id },
    ...middle,
    { type: "cooldown", title: cooldown.title, minutes: cooldown.minutes, drillId: cooldown.id },
  ];

  return {
    id: `session-${input.date}`,
    date: input.date,
    sport: "boxing",
    focus,
    blocks,
    totalMinutes: blocks.reduce((sum, b) => sum + b.minutes, 0),
  };
}
