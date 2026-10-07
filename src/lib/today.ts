import { buildStartingProgram } from "@/domain/onboarding";
import { buildDailySession } from "@/domain/session-builder";
import { toDateKey } from "@/domain/dates";
import type { PlayerProfile, TrainingSessionPlan } from "@/domain/types";

export function todayKey(): string {
  return toDateKey(new Date());
}

export function sessionMinutesFor(profile: PlayerProfile): number {
  return profile.onboarding ? buildStartingProgram(profile.onboarding).sessionMinutes : 10;
}

/** Today's recommended session for this player. */
export function todaysPlan(profile: PlayerProfile, date = todayKey()): TrainingSessionPlan {
  return buildDailySession({
    date,
    minutes: sessionMinutesFor(profile),
    totalXp: profile.totalXp,
    skills: profile.skills,
    completedLessonIds: profile.completedLessonIds,
  });
}
