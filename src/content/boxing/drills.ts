import type { Drill } from "@/domain/types";

/**
 * Boxing drills. Only drills that can be honestly scored on a phone produce skill scores.
 * Follow-along rounds (warm-up, shadow rounds, cool-down) count toward consistency and conditioning.
 */
export const BOXING_DRILLS: Drill[] = [
  {
    id: "warmup-basic",
    kind: "warmup",
    title: "Warm Up",
    description: "Joint circles, light bouncing and arm swings to get ready safely.",
    minutes: 2,
    lessonIds: [],
    trains: ["consistency"],
  },
  {
    id: "shadow-fundamentals",
    kind: "shadowRound",
    title: "Stance and Movement Round",
    description: "Follow spoken callouts: step forward, back, left, right. Keep your guard up.",
    minutes: 3,
    lessonIds: ["boxing-stance", "boxing-guard", "boxing-step-drag", "boxing-lateral"],
    trains: ["conditioning", "consistency"],
  },
  {
    id: "shadow-punches",
    kind: "shadowRound",
    title: "Punch Callout Round",
    description: "Throw the punch number you hear (1 to 6) and return to guard.",
    minutes: 3,
    lessonIds: ["boxing-jab", "boxing-cross", "boxing-lead-hook", "boxing-rear-hook", "boxing-lead-uppercut", "boxing-rear-uppercut"],
    trains: ["conditioning", "consistency"],
  },
  {
    id: "reaction-punch-numbers",
    kind: "reaction",
    title: "Number Reaction",
    description: "A number flashes. Tap the matching punch as fast as you can.",
    minutes: 2,
    lessonIds: ["boxing-jab", "boxing-cross", "boxing-lead-hook"],
    trains: ["reaction"],
  },
  {
    id: "recall-combos",
    kind: "comboRecall",
    title: "Combo Recall",
    description: "Watch a combination for 2 seconds, then enter it from memory.",
    minutes: 2,
    lessonIds: ["boxing-jab", "boxing-cross", "boxing-lead-hook", "boxing-rear-hook"],
    trains: ["comboRecall"],
  },
  {
    id: "quiz-lesson",
    kind: "quiz",
    title: "Lesson Check",
    description: "Quick questions on what you just learned.",
    minutes: 1,
    lessonIds: [],
    trains: ["knowledge"],
  },
  {
    id: "fightiq-opponent",
    kind: "fightIQ",
    title: "Read the Opponent",
    description: "Your opponent makes a move. Choose the smartest response.",
    minutes: 3,
    lessonIds: [],
    trains: ["fightIQ"],
  },
  {
    id: "cooldown-basic",
    kind: "cooldown",
    title: "Cool Down",
    description: "Slow breathing and light stretches.",
    minutes: 1,
    lessonIds: [],
    trains: ["consistency"],
  },
];

export function getDrill(id: string): Drill | undefined {
  return BOXING_DRILLS.find((d) => d.id === id);
}
