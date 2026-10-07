import { getDrill } from "@/content/boxing/drills";
import { getLesson } from "@/content/boxing/lessons";
import { localizeDrill, localizeLesson } from "@/content/localize";
import { placedLevelFor } from "@/domain/curriculum";
import { buildStartingProgram } from "@/domain/onboarding";
import { buildDailySession } from "@/domain/session-builder";
import { toDateKey } from "@/domain/dates";
import type { PlayerProfile, SessionBlock, TrainingSessionPlan } from "@/domain/types";
import type { Language } from "@/i18n/language";

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
    placedLevel: placedLevelFor(profile.onboarding?.experience),
  });
}

/** A session block's title in the player's language (from its lesson or drill; falls back to the English title). */
export function blockTitle(block: SessionBlock, language: Language): string {
  if (block.type === "learn" && block.lessonId) {
    const lesson = getLesson(block.lessonId);
    if (lesson) return localizeLesson(lesson, language).title;
  }
  if (block.drillId) {
    const drill = getDrill(block.drillId);
    if (drill) return localizeDrill(drill, language).title;
  }
  return block.title;
}
