import { daysBetween, isoWeekKey } from "./dates";
import type { StreakState } from "./types";

/**
 * Streak rules:
 * - Training on consecutive days grows the streak.
 * - One missed day per week is forgiven (a free rest day), because rest is part of training
 *   and a lost streak is the most common reason people quit.
 * - Missing more resets the streak to 1 on the next training day.
 */

export function emptyStreak(): StreakState {
  return { current: 0, longest: 0, lastTrainingDate: null, restDayUsedWeek: null };
}

export function recordTrainingDay(state: StreakState, today: string): StreakState {
  if (state.lastTrainingDate === today) return state;

  let current: number;
  let restDayUsedWeek = state.restDayUsedWeek;

  if (!state.lastTrainingDate) {
    current = 1;
  } else {
    const gap = daysBetween(state.lastTrainingDate, today);
    const restWeek = isoWeekKey(today);
    if (gap === 1) {
      current = state.current + 1;
    } else if (gap === 2 && state.restDayUsedWeek !== restWeek) {
      current = state.current + 1;
      restDayUsedWeek = restWeek;
    } else {
      current = 1;
    }
  }

  return {
    current,
    longest: Math.max(state.longest, current),
    lastTrainingDate: today,
    restDayUsedWeek,
  };
}

/** Streak as the user should see it today: 0 if it has already lapsed. */
export function visibleStreak(state: StreakState, today: string): number {
  if (!state.lastTrainingDate) return 0;
  const gap = daysBetween(state.lastTrainingDate, today);
  if (gap <= 1) return state.current;
  if (gap === 2 && state.restDayUsedWeek !== isoWeekKey(today)) return state.current;
  return 0;
}
