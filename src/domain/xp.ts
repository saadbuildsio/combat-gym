/**
 * XP and player levels.
 * Curve: reaching level n needs 50 * n * (n - 1) total XP.
 * Level 2 = 100 XP, level 5 = 1,000 XP, level 10 = 4,500 XP, level 12 = 6,600 XP.
 */

import type { DrillResult } from "./types";

export function totalXpForLevel(level: number): number {
  if (level <= 1) return 0;
  return 50 * level * (level - 1);
}

export function levelForXp(totalXp: number): number {
  let level = 1;
  while (totalXpForLevel(level + 1) <= totalXp) level++;
  return level;
}

export interface LevelProgress {
  level: number;
  title: string;
  xpIntoLevel: number;
  xpForNextLevel: number;
  nextTitle: string;
}

/** Rank titles a player earns as they level up. */
const RANK_TITLES: { minLevel: number; title: string }[] = [
  { minLevel: 1, title: "Rookie" },
  { minLevel: 4, title: "Prospect" },
  { minLevel: 8, title: "Contender" },
  { minLevel: 13, title: "Counter Puncher" },
  { minLevel: 18, title: "Ring General" },
  { minLevel: 25, title: "Fighter" },
];

export function rankTitle(level: number): string {
  let title = RANK_TITLES[0].title;
  for (const rank of RANK_TITLES) if (level >= rank.minLevel) title = rank.title;
  return title;
}

export function levelProgress(totalXp: number): LevelProgress {
  const level = levelForXp(totalXp);
  const start = totalXpForLevel(level);
  const next = totalXpForLevel(level + 1);
  return {
    level,
    title: rankTitle(level),
    xpIntoLevel: totalXp - start,
    xpForNextLevel: next - start,
    nextTitle: rankTitle(level + 1),
  };
}

// ---------- XP awards ----------

export const XP_RULES = {
  perCompletedMinute: 10,
  /** Up to this much bonus for a perfect score in a scored drill. */
  maxScoreBonus: 40,
  sessionCompleteBonus: 25,
  /** Sessions after this many in one day earn half XP, so XP reflects training, not grinding. */
  fullXpSessionsPerDay: 2,
} as const;

export function xpForDrill(result: DrillResult, minutes: number): number {
  if (!result.completed) return 0;
  const base = Math.round(minutes * XP_RULES.perCompletedMinute);
  const scores = Object.values(result.scores).filter((s): s is number => typeof s === "number");
  if (scores.length === 0) return base;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return base + Math.round((avg / 100) * XP_RULES.maxScoreBonus);
}

export function xpForSession(
  drills: { result: DrillResult; minutes: number }[],
  sessionsAlreadyToday: number,
): number {
  const drillXp = drills.reduce((sum, d) => sum + xpForDrill(d.result, d.minutes), 0);
  const allCompleted = drills.length > 0 && drills.every((d) => d.result.completed);
  const total = drillXp + (allCompleted ? XP_RULES.sessionCompleteBonus : 0);
  return sessionsAlreadyToday >= XP_RULES.fullXpSessionsPerDay ? Math.round(total / 2) : total;
}
