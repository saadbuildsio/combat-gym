import { BOXING_DRILLS } from "@/content/boxing/drills";
import { getLesson } from "@/content/boxing/lessons";
import { nextLessonId } from "./curriculum";
import { weakestSkill } from "./skills";
import type { Drill, MeasuredSkill, SessionBlock, SkillRatings, TrainingSessionPlan } from "./types";

/**
 * Builds today's training session.
 *
 * Template: Warm-up → Learn (next lesson) → Practice (shadow round) → Test (drill for the weakest skill)
 *           → Lesson check → Cool-down.
 * Warm-up and cool-down are always included for safety. Other blocks are added in priority order
 * until the time budget is used.
 */

export interface SessionInput {
  date: string; // YYYY-MM-DD
  minutes: number;
  totalXp: number;
  skills: SkillRatings;
  completedLessonIds: string[];
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
  const lessonId = nextLessonId(input.totalXp, input.completedLessonIds);
  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const hasPunchLessons = input.totalXp >= 300; // Level 2 unlocked

  // Candidate blocks in priority order. Each is added only if it fits the remaining time.
  const candidates: SessionBlock[] = [];
  if (lesson) {
    candidates.push({ type: "learn", title: lesson.title, minutes: lesson.minutes, lessonId: lesson.id });
  }
  const focusDrill = drill(DRILL_FOR_SKILL[focus]);
  candidates.push({ type: "test", title: focusDrill.title, minutes: focusDrill.minutes, drillId: focusDrill.id });

  const practice = drill(hasPunchLessons ? "shadow-punches" : "shadow-fundamentals");
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
