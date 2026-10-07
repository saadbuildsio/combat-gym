import { BOXING_LEVELS } from "@/content/boxing/levels";
import { isLevelComplete } from "./curriculum";
import type { CompletedSession, PlayerProfile } from "./types";

/** Returns achievement ids newly earned by this profile after the latest session. */
export function newlyEarnedAchievements(profile: PlayerProfile, latest: CompletedSession): string[] {
  const has = (id: string) => profile.achievements.includes(id);
  const earned: string[] = [];
  const check = (id: string, condition: boolean) => {
    if (condition && !has(id)) earned.push(id);
  };

  const sessions = profile.history.length;
  const [level1, level2] = BOXING_LEVELS;

  check("first_session", sessions >= 1);
  check("ten_sessions", sessions >= 10);
  check("streak_3", profile.streak.current >= 3);
  check("streak_7", profile.streak.current >= 7);
  check("stance_ready", isLevelComplete(level1, profile.completedLessonIds));
  check("six_punches", isLevelComplete(level2, profile.completedLessonIds));

  for (const r of latest.results) {
    if (!r.completed) continue;
    const avgMs = r.stats?.avgReactionMs;
    check("quick_hands", r.kind === "reaction" && typeof avgMs === "number" && avgMs < 600);
    check("perfect_recall", r.kind === "comboRecall" && r.scores.comboRecall === 100);
    check("ring_iq", r.kind === "fightIQ" && (r.scores.fightIQ ?? 0) >= 80);
  }

  return earned;
}
