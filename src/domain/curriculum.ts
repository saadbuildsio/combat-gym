import { BOXING_LEVELS } from "@/content/boxing/levels";
import type { CurriculumLevel } from "./types";

/**
 * Levels the player can open. A level opens when its content is ready, the player has its XP,
 * and the level before it is complete. `placedLevel` lets experienced players start higher
 * (onboarding places them at Level 2); every level up to it counts as open.
 */
export function unlockedLevels(
  totalXp: number,
  completedLessonIds: string[],
  placedLevel = 1,
  levels: CurriculumLevel[] = BOXING_LEVELS,
): CurriculumLevel[] {
  const open: CurriculumLevel[] = [];
  for (const [i, level] of levels.entries()) {
    if (!level.contentReady) break;
    const previous = levels[i - 1];
    const placed = level.level <= placedLevel;
    const earned = totalXp >= level.unlockXp && (!previous || isLevelComplete(previous, completedLessonIds));
    if (!placed && !earned) break;
    open.push(level);
  }
  return open;
}

/** Why a level is still locked, for the Train screen. */
export type LockReason = "coming_soon" | "finish_previous" | "need_xp" | null;

export function lockReason(
  level: CurriculumLevel,
  totalXp: number,
  completedLessonIds: string[],
  placedLevel = 1,
  levels: CurriculumLevel[] = BOXING_LEVELS,
): LockReason {
  if (!level.contentReady) return "coming_soon";
  if (unlockedLevels(totalXp, completedLessonIds, placedLevel, levels).some((l) => l.level === level.level)) return null;
  const previous = levels.find((l) => l.level === level.level - 1);
  if (previous && level.level > placedLevel && !isLevelComplete(previous, completedLessonIds)) return "finish_previous";
  return "need_xp";
}

/** Experienced players skip the Level 1 lessons; beginners start at Level 1. */
export function placedLevelFor(experience: string | undefined): number {
  return experience && experience !== "complete_beginner" && experience !== "beginner" ? 2 : 1;
}

/** First lesson, in curriculum order, that the player has unlocked but not completed. */
export function nextLessonId(
  totalXp: number,
  completedLessonIds: string[],
  placedLevel = 1,
  levels: CurriculumLevel[] = BOXING_LEVELS,
): string | null {
  for (const level of unlockedLevels(totalXp, completedLessonIds, placedLevel, levels)) {
    const next = level.lessonIds.find((id) => !completedLessonIds.includes(id));
    if (next) return next;
  }
  return null;
}

/** Punch drills and callouts start once the player has learned the jab. */
export function knowsPunches(completedLessonIds: string[]): boolean {
  return completedLessonIds.includes("boxing-jab");
}

export function isLevelComplete(level: CurriculumLevel, completedLessonIds: string[]): boolean {
  return level.contentReady && level.lessonIds.length > 0 && level.lessonIds.every((id) => completedLessonIds.includes(id));
}

/** True when the player has finished at least one of these lessons. */
export function completedAny(lessonIds: string[], completedLessonIds: string[]): boolean {
  return lessonIds.some((id) => completedLessonIds.includes(id));
}
