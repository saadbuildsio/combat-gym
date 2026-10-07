import { BOXING_LEVELS } from "@/content/boxing/levels";
import type { CurriculumLevel } from "./types";

/** Levels the player can open: content is ready and they have enough XP. */
export function unlockedLevels(totalXp: number, levels: CurriculumLevel[] = BOXING_LEVELS): CurriculumLevel[] {
  return levels.filter((l) => l.contentReady && totalXp >= l.unlockXp);
}

/** First lesson, in curriculum order, that the player has unlocked but not completed. */
export function nextLessonId(
  totalXp: number,
  completedLessonIds: string[],
  levels: CurriculumLevel[] = BOXING_LEVELS,
): string | null {
  for (const level of unlockedLevels(totalXp, levels)) {
    const next = level.lessonIds.find((id) => !completedLessonIds.includes(id));
    if (next) return next;
  }
  return null;
}

export function isLevelComplete(level: CurriculumLevel, completedLessonIds: string[]): boolean {
  return level.contentReady && level.lessonIds.length > 0 && level.lessonIds.every((id) => completedLessonIds.includes(id));
}
