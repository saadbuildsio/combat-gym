import { msg, type Message } from "@/i18n/message";
import type { MinutesPerDay, OnboardingAnswers } from "./types";

export interface StartingProgram {
  /** Minutes per daily session the app will plan. */
  sessionMinutes: number;
  /** XP granted at the start so experienced users skip Level 1 lessons they already know. */
  startingXp: number;
  /** Message shown on the "your program is ready" screen. */
  welcomeMessage: Message;
  /** Extra guidance shown once, e.g. for competition goals. */
  advisory: Message | null;
}

/** Complete beginners are capped at 15 minutes until they have built a base. */
const BEGINNER_MAX_MINUTES = 15;
const MVP_MAX_MINUTES = 30;

export function buildStartingProgram(answers: OnboardingAnswers): StartingProgram {
  const isNew = answers.experience === "complete_beginner" || answers.experience === "beginner";
  const cap = isNew ? BEGINNER_MAX_MINUTES : MVP_MAX_MINUTES;
  const sessionMinutes = Math.min(answers.minutesPerDay as MinutesPerDay, cap);

  // Experienced users unlock Level 2 straight away (300 XP). They can still replay Level 1.
  const startingXp = isNew ? 0 : 300;

  const welcomeMessage = isNew
    ? msg("onboarding.welcomeNew", { minutes: sessionMinutes })
    : msg("onboarding.welcomeExperienced", { minutes: sessionMinutes });

  let advisory: Message | null = null;
  if (answers.goal === "competition_prep") {
    advisory = msg("onboarding.advisoryCompetition");
  } else if (answers.minutesPerDay > cap) {
    advisory = msg("onboarding.advisoryCap", { minutes: cap });
  }

  return { sessionMinutes, startingXp, welcomeMessage, advisory };
}
