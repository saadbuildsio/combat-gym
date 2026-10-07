import type { CurriculumLevel } from "@/domain/types";

/**
 * The six-level Boxing path. Levels 1-2 are written for the MVP;
 * Levels 3-6 show as locked "coming soon" until their content is ready.
 */
export const BOXING_LEVELS: CurriculumLevel[] = [
  {
    sport: "boxing",
    level: 1,
    title: "Fundamentals",
    goal: "Stand, guard and move like a boxer.",
    lessonIds: ["boxing-stance", "boxing-guard", "boxing-step-drag", "boxing-lateral"],
    unlockXp: 0,
    contentReady: true,
  },
  {
    sport: "boxing",
    level: 2,
    title: "Basic Strikes",
    goal: "Throw the six punches with good form.",
    lessonIds: [
      "boxing-jab",
      "boxing-cross",
      "boxing-lead-hook",
      "boxing-rear-hook",
      "boxing-lead-uppercut",
      "boxing-rear-uppercut",
    ],
    unlockXp: 300,
    contentReady: true,
  },
  { sport: "boxing", level: 3, title: "Combinations", goal: "Link punches into fluent combinations.", lessonIds: [], unlockXp: 1200, contentReady: false },
  { sport: "boxing", level: 4, title: "Defense", goal: "High guard, slip, roll, parry and distance.", lessonIds: [], unlockXp: 2500, contentReady: false },
  { sport: "boxing", level: 5, title: "Combined Training", goal: "Move, strike and defend together.", lessonIds: [], unlockXp: 4500, contentReady: false },
  { sport: "boxing", level: 6, title: "Fight IQ", goal: "Distance, timing, counters and reading opponents.", lessonIds: [], unlockXp: 7000, contentReady: false },
];
