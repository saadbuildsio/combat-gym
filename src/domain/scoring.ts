/**
 * Turns raw drill input into 0-100 scores.
 * Only things a phone can actually measure are scored here.
 */

import type { FightScenario } from "./types";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/** Reaction drill thresholds in milliseconds. */
export const REACTION_FAST_MS = 350; // scores 100
export const REACTION_SLOW_MS = 1200; // scores 0

/**
 * Reaction score: speed on correct taps, scaled by how many taps were correct.
 * A fast but wrong tap is worth nothing.
 */
export function scoreReaction(correctReactionTimesMs: number[], totalPrompts: number): number {
  if (totalPrompts <= 0 || correctReactionTimesMs.length === 0) return 0;
  const avg = correctReactionTimesMs.reduce((a, b) => a + b, 0) / correctReactionTimesMs.length;
  const speed = ((REACTION_SLOW_MS - avg) / (REACTION_SLOW_MS - REACTION_FAST_MS)) * 100;
  const accuracy = correctReactionTimesMs.length / totalPrompts;
  return clamp(clamp(speed) * accuracy);
}

/** Percentage of combinations entered exactly right. */
export function scoreComboRecall(correct: number, total: number): number {
  if (total <= 0) return 0;
  return clamp((correct / total) * 100);
}

/** Percentage of quiz questions answered correctly. */
export function scoreQuiz(correct: number, total: number): number {
  if (total <= 0) return 0;
  return clamp((correct / total) * 100);
}

/** Best answer = full credit, acceptable answer = half credit. */
export function scoreFightIQ(scenarios: FightScenario[], chosenIndexes: number[]): number {
  if (scenarios.length === 0) return 0;
  let points = 0;
  scenarios.forEach((scenario, i) => {
    const choice = chosenIndexes[i];
    if (choice === scenario.bestIndex) points += 1;
    else if (scenario.okIndexes.includes(choice)) points += 0.5;
  });
  return clamp((points / scenarios.length) * 100);
}

/** Conditioning from follow-along rounds: share of the round completed, nudged by reported effort (1-5). */
export function scoreConditioning(secondsCompleted: number, secondsPlanned: number, effort?: number): number {
  if (secondsPlanned <= 0) return 0;
  const completion = Math.min(1, secondsCompleted / secondsPlanned) * 100;
  if (!effort) return clamp(completion);
  const effortFactor = 0.8 + (Math.max(1, Math.min(5, effort)) - 1) * 0.05; // 0.8 to 1.0
  return clamp(completion * effortFactor);
}
