import { isoWeekKey } from "./dates";
import type { CompletedSession } from "./types";

/**
 * Daily missions and weekly challenges, worked out from training history.
 * Progress only for now; claimable XP rewards arrive with the challenge system in Phase 5.
 */

export interface Mission {
  id: string;
  period: "daily" | "weekly";
  title: string;
  progress: number;
  target: number;
  done: boolean;
}

function mission(id: string, period: Mission["period"], title: string, progress: number, target: number): Mission {
  const clamped = Math.min(progress, target);
  return { id, period, title, progress: clamped, target, done: clamped >= target };
}

export function missionsFor(history: CompletedSession[], today: string): Mission[] {
  const todays = history.filter((s) => s.date === today);
  const week = isoWeekKey(today);
  const thisWeek = history.filter((s) => isoWeekKey(s.date) === week);

  const minutesToday = todays.reduce((sum, s) => sum + s.minutes, 0);
  const bestScoreToday = Math.max(
    0,
    ...todays.flatMap((s) => s.results.flatMap((r) => Object.values(r.scores).filter((v): v is number => typeof v === "number"))),
  );
  const daysThisWeek = new Set(thisWeek.map((s) => s.date)).size;
  const fightIqRoundsThisWeek = thisWeek.flatMap((s) => s.results).filter((r) => r.kind === "fightIQ" && r.completed).length;

  return [
    mission("daily-session", "daily", "Complete a training session", todays.length, 1),
    mission("daily-minutes", "daily", "Train for 10 minutes", minutesToday, 10),
    mission("daily-score", "daily", "Score 70 or more in any drill", bestScoreToday >= 70 ? 1 : 0, 1),
    mission("weekly-days", "weekly", "Train on 5 different days", daysThisWeek, 5),
    mission("weekly-fightiq", "weekly", "Finish 3 Fight IQ rounds", fightIqRoundsThisWeek, 3),
  ];
}
