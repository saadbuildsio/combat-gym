import { unlockedLevels } from "./curriculum";
import { BOXING_OPPONENTS } from "@/content/boxing/opponents";
import { applySession, type SessionOutcome } from "./progress";
import { xpForSession } from "./xp";
import type { DrillResult, Opponent, PlayerProfile } from "./types";

export interface FinishedBlock {
  result: DrillResult;
  minutes: number;
}

/**
 * Turns the blocks a player just finished into XP and profile changes.
 * Used by the daily session and by standalone Fight IQ matches.
 */
export function finishSession(
  profile: PlayerProfile,
  input: { planId: string; date: string; blocks: FinishedBlock[]; completedLessonIds: string[] },
): SessionOutcome {
  const sessionsToday = profile.history.filter((s) => s.date === input.date).length;
  const minutes = input.blocks.reduce((sum, b) => {
    const stats = b.result.stats;
    // Timed rounds report real seconds; everything else counts its planned minutes when completed.
    if (stats?.secondsCompleted !== undefined) return sum + stats.secondsCompleted / 60;
    return sum + (b.result.completed ? b.minutes : 0);
  }, 0);

  return applySession(
    profile,
    {
      planId: input.planId,
      date: input.date,
      sport: "boxing",
      results: input.blocks.map((b) => b.result),
      xpEarned: xpForSession(input.blocks, sessionsToday),
      minutes: Math.round(minutes),
    },
    input.completedLessonIds,
  );
}

/** Opponents this player can face now. */
/** Opponents this player can face now: each one opens with the curriculum level that teaches what it tests. */
export function availableOpponents(totalXp: number, completedLessonIds: string[] = [], placedLevel = 1): Opponent[] {
  const open = unlockedLevels(totalXp, completedLessonIds, placedLevel);
  const level = open.length ? open[open.length - 1].level : 1;
  return BOXING_OPPONENTS.filter((o) => o.availableInMvp && o.unlockLevel <= level);
}

/** Rotates through unlocked opponents so daily sessions vary. */
export function opponentForSession(totalXp: number, sessionsCompleted: number, completedLessonIds: string[] = [], placedLevel = 1): Opponent {
  const options = availableOpponents(totalXp, completedLessonIds, placedLevel);
  return options.length ? options[sessionsCompleted % options.length] : BOXING_OPPONENTS[0];
}
