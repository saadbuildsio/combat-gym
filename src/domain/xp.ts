/**
 * XP and player levels.
 * Curve: reaching level n needs 50 * n * (n - 1) total XP.
 * Level 2 = 100 XP, level 5 = 1,000 XP, level 10 = 4,500 XP, level 12 = 6,600 XP.
 */

import type { MessageKey } from "@/i18n/messages/en";
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
  /** English rank title. Screens show `titleKey` instead, in the player's language. */
  title: string;
  titleKey: MessageKey;
  xpIntoLevel: number;
  xpForNextLevel: number;
  nextTitle: string;
  nextTitleKey: MessageKey;
}

/** Rank titles a player earns as they level up. */
const RANK_TITLES: { minLevel: number; title: string; key: MessageKey }[] = [
  { minLevel: 1, title: "Rookie", key: "rank.rookie" },
  { minLevel: 4, title: "Prospect", key: "rank.prospect" },
  { minLevel: 8, title: "Contender", key: "rank.contender" },
  { minLevel: 13, title: "Counter Puncher", key: "rank.counterPuncher" },
  { minLevel: 18, title: "Ring General", key: "rank.ringGeneral" },
  { minLevel: 25, title: "Fighter", key: "rank.fighter" },
];

function rankFor(level: number) {
  let found = RANK_TITLES[0];
  for (const rank of RANK_TITLES) if (level >= rank.minLevel) found = rank;
  return found;
}

export function rankTitle(level: number): string {
  return rankFor(level).title;
}

/** Dictionary key for the rank title at this level. */
export function rankTitleKey(level: number): MessageKey {
  return rankFor(level).key;
}

export function levelProgress(totalXp: number): LevelProgress {
  const level = levelForXp(totalXp);
  const start = totalXpForLevel(level);
  const next = totalXpForLevel(level + 1);
  return {
    level,
    title: rankTitle(level),
    titleKey: rankTitleKey(level),
    xpIntoLevel: totalXp - start,
    xpForNextLevel: next - start,
    nextTitle: rankTitle(level + 1),
    nextTitleKey: rankTitleKey(level + 1),
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
