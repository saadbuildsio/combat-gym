import type { CurriculumLevel } from "@/domain/types";

/**
 * The six-level Boxing path. Each level opens with enough XP once the level before it is complete.
 * A level with contentReady: false shows as "coming soon".
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
  {
    sport: "boxing",
    level: 3,
    title: "Combinations",
    goal: "Link punches into fluent combinations.",
    lessonIds: ["boxing-one-two", "boxing-jab-cross-hook", "boxing-body-shots", "boxing-uppercut-hook-combos"],
    unlockXp: 1200,
    contentReady: true,
  },
  {
    sport: "boxing",
    level: 4,
    title: "Defense",
    goal: "High guard, slip, roll, parry and pull back.",
    lessonIds: ["boxing-block", "boxing-slip", "boxing-roll", "boxing-parry", "boxing-pull-back"],
    unlockXp: 2500,
    contentReady: true,
  },
  {
    sport: "boxing",
    level: 5,
    title: "Combined Training",
    goal: "Move, strike and defend together.",
    lessonIds: ["boxing-pivot", "boxing-punch-and-move", "boxing-defend-and-counter", "boxing-cutting-angles"],
    unlockXp: 4500,
    contentReady: true,
  },
  {
    sport: "boxing",
    level: 6,
    title: "Fight IQ",
    goal: "Distance, timing, counters and reading opponents.",
    lessonIds: ["boxing-distance", "boxing-feints-timing", "boxing-counter-punching", "boxing-ring-control"],
    unlockXp: 7000,
    contentReady: true,
  },
];
