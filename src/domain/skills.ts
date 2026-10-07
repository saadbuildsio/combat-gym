import { MEASURED_SKILLS, type MeasuredSkill, type SkillRatings } from "./types";

/** How much one new result moves a rating. Lower = steadier ratings. */
export const SKILL_SMOOTHING = 0.3;

/** Skills the session builder can target with a drill. Consistency improves by showing up. */
export const TRAINABLE_SKILLS: MeasuredSkill[] = ["reaction", "comboRecall", "fightIQ", "knowledge", "conditioning"];

export function emptySkills(): SkillRatings {
  return { reaction: 0, comboRecall: 0, fightIQ: 0, knowledge: 0, consistency: 0, conditioning: 0 };
}

/**
 * Blend new drill scores into the current ratings.
 * A rating of 0 means "not measured yet", so the first score is taken as-is.
 */
export function updateSkills(current: SkillRatings, newScores: Partial<SkillRatings>): SkillRatings {
  const next = { ...current };
  for (const skill of MEASURED_SKILLS) {
    const score = newScores[skill];
    if (typeof score !== "number") continue;
    const blended = current[skill] === 0 ? score : current[skill] * (1 - SKILL_SMOOTHING) + score * SKILL_SMOOTHING;
    next[skill] = Math.max(0, Math.min(100, Math.round(blended)));
  }
  return next;
}

/** Consistency rating from sessions in the last 14 days (7+ sessions = 100). */
export function consistencyFromHistory(sessionDates: string[], today: string): number {
  const cutoff = new Date(today + "T00:00:00Z").getTime() - 13 * 86_400_000;
  const days = new Set(sessionDates.filter((d) => new Date(d + "T00:00:00Z").getTime() >= cutoff));
  return Math.min(100, Math.round((days.size / 7) * 100));
}

/**
 * The skill most worth training next: lowest measured rating first,
 * but an unmeasured skill (0) wins so every skill gets a baseline.
 */
export function weakestSkill(skills: SkillRatings, candidates: MeasuredSkill[] = TRAINABLE_SKILLS): MeasuredSkill {
  return [...candidates].sort((a, b) => skills[a] - skills[b])[0];
}

export function strongestSkill(skills: SkillRatings, candidates: MeasuredSkill[] = TRAINABLE_SKILLS): MeasuredSkill {
  return [...candidates].sort((a, b) => skills[b] - skills[a])[0];
}

export const SKILL_LABELS: Record<MeasuredSkill, string> = {
  reaction: "Reaction",
  comboRecall: "Combo Recall",
  fightIQ: "Fight IQ",
  knowledge: "Knowledge",
  consistency: "Consistency",
  conditioning: "Conditioning",
};
