import { msg, type Message } from "@/i18n/message";
import type { MessageKey } from "@/i18n/messages/en";
import { SKILL_LABEL_KEYS, TRAINABLE_SKILLS, weakestSkill } from "./skills";
import type { CompletedSession, MeasuredSkill, SkillRatings } from "./types";

/**
 * Rule-based AI coach.
 * The rules decide WHAT to say from real numbers. A language model may later reword the note,
 * but never invent scores or praise that the numbers do not support.
 * Notes are Messages (dictionary key + values), so the screen shows them in the player's language.
 */

export interface CoachNote {
  tone: "safety" | "progress" | "focus";
  headline: Message;
  detail: Message;
  tomorrowFocus: MeasuredSkill | null;
}

/** Practical tip per skill so feedback is always actionable. */
const SKILL_TIPS: Record<MeasuredSkill, MessageKey> = {
  reaction: "coach.tip.reaction",
  comboRecall: "coach.tip.comboRecall",
  fightIQ: "coach.tip.fightIQ",
  knowledge: "coach.tip.knowledge",
  consistency: "coach.tip.consistency",
  conditioning: "coach.tip.conditioning",
};

const label = (skill: MeasuredSkill): Message => msg(SKILL_LABEL_KEYS[skill]);
const tip = (skill: MeasuredSkill): Message => msg(SKILL_TIPS[skill]);

const STRONG = 75;
const WEAK = 50;

export function coachNoteForSession(
  session: CompletedSession,
  skillsBefore: SkillRatings,
  skillsAfter: SkillRatings,
): CoachNote {
  if (session.results.some((r) => r.reportedPain)) {
    return {
      tone: "safety",
      headline: msg("coach.painHeadline"),
      detail: msg("coach.painDetail"),
      tomorrowFocus: null,
    };
  }

  // Average score per skill in THIS session.
  const sums: Partial<Record<MeasuredSkill, { total: number; count: number }>> = {};
  for (const result of session.results) {
    for (const [skill, score] of Object.entries(result.scores) as [MeasuredSkill, number][]) {
      const entry = sums[skill] ?? { total: 0, count: 0 };
      entry.total += score;
      entry.count += 1;
      sums[skill] = entry;
    }
  }
  const sessionScores = Object.entries(sums).map(([skill, s]) => ({
    skill: skill as MeasuredSkill,
    score: Math.round(s!.total / s!.count),
  }));
  const scored = sessionScores.filter((s) => TRAINABLE_SKILLS.includes(s.skill));

  const focus = weakestSkill(skillsAfter);

  if (scored.length === 0) {
    return {
      tone: "focus",
      headline: msg("coach.noScoresHeadline"),
      detail: msg("coach.noScoresDetail", { skill: label(focus) }),
      tomorrowFocus: focus,
    };
  }

  const best = [...scored].sort((a, b) => b.score - a.score)[0];
  const worst = [...scored].sort((a, b) => a.score - b.score)[0];

  // Biggest improvement against the rating before this session (only for skills measured before).
  const improvements = scored
    .filter((s) => skillsBefore[s.skill] > 0)
    .map((s) => ({ skill: s.skill, delta: skillsAfter[s.skill] - skillsBefore[s.skill] }))
    .sort((a, b) => b.delta - a.delta);
  const topGain = improvements[0];

  let headline: Message;
  if (topGain && topGain.delta >= 3) {
    headline = msg("coach.gainHeadline", { skill: label(topGain.skill), points: topGain.delta });
  } else if (best.score >= STRONG) {
    headline = msg("coach.strongHeadline", { skill: label(best.skill), score: best.score });
  } else {
    headline = msg("coach.solidHeadline", { skill: label(best.skill), score: best.score });
  }

  let detail: Message;
  if (worst.skill !== best.skill && worst.score < WEAK) {
    detail = msg("coach.weakDetail", { skill: label(worst.skill), score: worst.score, tip: tip(worst.skill) });
  } else if (worst.skill !== best.skill) {
    detail = msg("coach.lowestDetail", { skill: label(worst.skill), score: worst.score, tip: tip(worst.skill) });
  } else {
    detail = tip(focus);
  }

  return {
    tone: topGain && topGain.delta >= 3 ? "progress" : "focus",
    headline,
    detail: msg("coach.withTomorrow", { detail, skill: label(focus) }),
    tomorrowFocus: focus,
  };
}

/** One-line message for the Home screen, before today's session. */
export function homeCoachLine(skills: SkillRatings, sessionsCompleted: number): Message {
  if (sessionsCompleted === 0) return msg("coach.homeFirst");
  const focus = weakestSkill(skills);
  return msg("coach.homeFocus", { skill: label(focus), tip: tip(focus) });
}
