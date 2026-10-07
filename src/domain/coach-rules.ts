import { SKILL_LABELS, TRAINABLE_SKILLS, weakestSkill } from "./skills";
import type { CompletedSession, MeasuredSkill, SkillRatings } from "./types";

/**
 * Rule-based AI coach.
 * The rules decide WHAT to say from real numbers. A language model may later reword the note,
 * but never invent scores or praise that the numbers do not support.
 */

export interface CoachNote {
  tone: "safety" | "progress" | "focus";
  headline: string;
  detail: string;
  tomorrowFocus: MeasuredSkill | null;
}

/** Practical tip per skill so feedback is always actionable. */
const SKILL_TIPS: Record<MeasuredSkill, string> = {
  reaction: "Stay relaxed in your guard. Tension slows your first move.",
  comboRecall: "Say the numbers out loud as you throw them. It locks the pattern in.",
  fightIQ: "Before choosing, ask: what is this opponent trying to make me do?",
  knowledge: "Re-read the common mistakes section before your next round.",
  consistency: "Short sessions count. Ten minutes today beats an hour next week.",
  conditioning: "Finish the full round at a steady pace before trying to go faster.",
};

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
      headline: "Session stopped for your safety.",
      detail: "You reported pain, so we ended training. Rest, and get it checked if it does not settle. Your progress is saved.",
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
      headline: "Rounds completed.",
      detail: `You finished the session, but there were no scored drills today. Tomorrow includes a ${SKILL_LABELS[focus]} test so we can measure progress.`,
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

  let headline: string;
  if (topGain && topGain.delta >= 3) {
    headline = `${SKILL_LABELS[topGain.skill]} is up ${topGain.delta} points.`;
  } else if (best.score >= STRONG) {
    headline = `${SKILL_LABELS[best.skill]} was your strongest area today at ${best.score}.`;
  } else {
    headline = `Solid work. ${SKILL_LABELS[best.skill]} led the session at ${best.score}.`;
  }

  let detail: string;
  if (worst.skill !== best.skill && worst.score < WEAK) {
    detail = `${SKILL_LABELS[worst.skill]} scored ${worst.score} and needs work. ${SKILL_TIPS[worst.skill]}`;
  } else if (worst.skill !== best.skill) {
    detail = `${SKILL_LABELS[worst.skill]} (${worst.score}) is your lowest today. ${SKILL_TIPS[worst.skill]}`;
  } else {
    detail = SKILL_TIPS[focus];
  }

  return {
    tone: topGain && topGain.delta >= 3 ? "progress" : "focus",
    headline,
    detail: `${detail} Tomorrow's session focuses on ${SKILL_LABELS[focus]}.`,
    tomorrowFocus: focus,
  };
}

/** One-line message for the Home screen, before today's session. */
export function homeCoachLine(skills: SkillRatings, sessionsCompleted: number): string {
  if (sessionsCompleted === 0) {
    return "Welcome. Today we build your stance and guard. Everything else starts from there.";
  }
  const focus = weakestSkill(skills);
  return `Today we focus on ${SKILL_LABELS[focus]}. ${SKILL_TIPS[focus]}`;
}
