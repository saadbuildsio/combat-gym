import { getAchievement } from "@/content/achievements";
import { newlyEarnedAchievements } from "./achievements";
import { coachNoteForSession, type CoachNote } from "./coach-rules";
import { consistencyFromHistory, emptySkills, updateSkills } from "./skills";
import { emptyStreak, recordTrainingDay } from "./streak";
import { levelForXp } from "./xp";
import type { CompletedSession, OnboardingAnswers, PlayerProfile } from "./types";

/**
 * The one place a finished session changes the player.
 * Pure function: takes the old profile, returns the new one plus what to show on the results screen.
 */

export interface SessionOutcome {
  profile: PlayerProfile;
  xpEarned: number;
  leveledUp: boolean;
  newAchievements: string[];
  coach: CoachNote;
}

export function createProfile(id: string, displayName: string, now: Date): PlayerProfile {
  return {
    id,
    displayName,
    createdAt: now.toISOString(),
    onboarding: null,
    safetyAcknowledgedAt: null,
    favoriteSport: "boxing",
    plan: "free",
    totalXp: 0,
    skills: emptySkills(),
    streak: emptyStreak(),
    achievements: [],
    completedLessonIds: [],
    history: [],
  };
}

export function completeOnboarding(profile: PlayerProfile, answers: OnboardingAnswers, startingXp: number): PlayerProfile {
  return { ...profile, onboarding: answers, totalXp: Math.max(profile.totalXp, startingXp) };
}

/**
 * Applies a finished session. `completedLessonIds` lists lessons whose learn block was finished.
 * Pain reports still save progress but the coach switches to the safety message.
 */
export function applySession(profile: PlayerProfile, session: CompletedSession, completedLessonIds: string[]): SessionOutcome {
  const levelBefore = levelForXp(profile.totalXp);
  const skillsBefore = profile.skills;

  let skills = skillsBefore;
  for (const result of session.results) {
    if (result.completed) skills = updateSkills(skills, result.scores);
  }

  const history = [...profile.history, session];
  skills = {
    ...skills,
    consistency: consistencyFromHistory(
      history.map((h) => h.date),
      session.date,
    ),
  };

  let next: PlayerProfile = {
    ...profile,
    totalXp: profile.totalXp + session.xpEarned,
    skills,
    streak: recordTrainingDay(profile.streak, session.date),
    completedLessonIds: Array.from(new Set([...profile.completedLessonIds, ...completedLessonIds])),
    history,
  };

  const newAchievements = newlyEarnedAchievements(next, session);
  const bonusXp = newAchievements.reduce((sum, id) => sum + (getAchievement(id)?.xpReward ?? 0), 0);
  next = { ...next, achievements: [...next.achievements, ...newAchievements], totalXp: next.totalXp + bonusXp };

  return {
    profile: next,
    xpEarned: session.xpEarned + bonusXp,
    leveledUp: levelForXp(next.totalXp) > levelBefore,
    newAchievements,
    coach: coachNoteForSession(session, skillsBefore, skills),
  };
}
