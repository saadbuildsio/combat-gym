import { getMove, movesForCallout } from "./moves";
import {
  COMBINATION_CALLOUTS,
  COMBINED_CALLOUTS,
  DEFENSE_CALLOUTS,
  DEFENSE_MIXED_CALLOUTS,
  FIGHT_IQ_CALLOUTS,
  MOVEMENT_CALLOUTS,
  PUNCH_COMBOS_BY_LESSON,
} from "./callouts";

/**
 * What a shadow round calls out, based on the round and what the player has learned.
 * A callout only appears after the lesson that teaches every move in it, so the round never asks
 * for something the player has not been shown. Beginners get movement only.
 *
 * - shadow-fundamentals: movement.
 * - shadow-punches: punch combos (only the punches learned), then Level 3 combos and Level 4 punch/defense mixes.
 * - shadow-combos: Level 3 combos (falls back to punch combos).
 * - shadow-defense: defensive moves and punch/defense mixes (falls back to punch combos).
 * - shadow-combined: Level 5 move-strike-defend callouts, plus defense and combos learned.
 * - shadow-ring-iq: Level 6 callouts, plus Level 5 ones.
 */
export interface RoundCallouts {
  callouts: string[];
  /** Seconds between callouts, long enough to hear the callout, watch the animation and throw it. */
  every: number;
}

function learned(table: Record<string, string[]>, done: Set<string>): string[] {
  return Object.entries(table).flatMap(([lessonId, callouts]) => (done.has(lessonId) ? callouts : []));
}

function unique(list: string[]): string[] {
  return [...new Set(list)];
}

/** Gap in seconds for a set of callouts, driven by the longest one. */
export function calloutGap(callouts: string[]): number {
  let longest = 0;
  for (const c of callouts) {
    const moves = movesForCallout(c);
    const ms = moves.reduce((sum, id) => sum + getMove(id).frames.reduce((s, f) => s + f.ms, 0), 0);
    // By count: 1 move 3 s, 2-3 moves 4 s, 4 moves 5 s, 5+ moves 6 s. By time: animation plus 2 s to hear and react.
    const byCount = moves.length <= 1 ? 3 : moves.length <= 3 ? 4 : moves.length === 4 ? 5 : 6;
    const byTime = Math.ceil(ms / 1000) + 2;
    longest = Math.max(longest, byCount, byTime);
  }
  return Math.min(6, Math.max(3, longest));
}

export function shadowRoundCallouts(drillId: string, completedLessonIds: string[]): RoundCallouts {
  const done = new Set(completedLessonIds);
  const punches = learned(PUNCH_COMBOS_BY_LESSON, done);
  const combos = learned(COMBINATION_CALLOUTS, done);
  const defense = learned(DEFENSE_CALLOUTS, done);
  const mixed = learned(DEFENSE_MIXED_CALLOUTS, done);
  const combined = learned(COMBINED_CALLOUTS, done);
  const fightIq = learned(FIGHT_IQ_CALLOUTS, done);

  const punchRound = punches.length ? [...punches, ...combos, ...mixed] : [];
  let list: string[];
  switch (drillId) {
    case "shadow-fundamentals":
      list = MOVEMENT_CALLOUTS;
      break;
    case "shadow-combos":
      list = combos.length ? combos : punchRound;
      break;
    case "shadow-defense":
      list = defense.length ? [...defense, ...defense, ...mixed] : punchRound;
      break;
    case "shadow-combined":
      list = combined.length ? [...combined, ...defense, ...mixed, ...combos] : [...defense, ...mixed, ...combos];
      break;
    case "shadow-ring-iq":
      list = fightIq.length ? [...fightIq, ...combined] : [...combined, ...defense, ...mixed];
      break;
    default: // shadow-punches and any other round
      list = punchRound;
  }
  // Defense appears twice in the defense round on purpose: random picks then favour the new moves.
  if (list.length === 0) list = punchRound;
  const callouts = drillId === "shadow-defense" && defense.length ? list : unique(list);
  if (callouts.length === 0) return { callouts: MOVEMENT_CALLOUTS, every: calloutGap(MOVEMENT_CALLOUTS) };
  return { callouts, every: calloutGap(callouts) };
}
