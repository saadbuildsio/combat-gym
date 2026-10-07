/**
 * Free vs Pro rules. Free players see ads outside training; Pro players see none.
 * Pure functions so the rules are easy to test and change.
 */

export type Plan = "free" | "pro";

/** Screens that may show a banner. Training, lessons, rounds and fights never do: ads must not distract during exercise. */
export type BannerPlacement = "home" | "progress" | "results" | "challenges" | "profile";

export const BANNER_PLACEMENTS: readonly BannerPlacement[] = ["home", "progress", "results", "challenges", "profile"];

/** What Pro gives today. Add perks here and on the Go Pro screen together. */
export const PRO_BENEFITS = ["noAds", "supportNewSports"] as const;
export type ProBenefit = (typeof PRO_BENEFITS)[number];

export function showsAds(plan: Plan): boolean {
  return plan === "free";
}

/** First sessions are ad-free so new players get hooked before seeing a full-screen ad. */
export const INTERSTITIAL_GRACE_SESSIONS = 3;
/** At most one full-screen ad every this many completed sessions. */
export const INTERSTITIAL_EVERY_SESSIONS = 2;
/** And never twice within this many minutes. */
export const INTERSTITIAL_MIN_GAP_MINUTES = 15;

/**
 * Whether to show a full-screen ad after a finished session.
 * `sessionsCompleted` includes the session just finished.
 */
export function shouldShowInterstitial(input: {
  plan: Plan;
  sessionsCompleted: number;
  /** When the last full-screen ad was shown, or null if never. */
  lastShownAt: Date | null;
  now: Date;
  /** A pain report ends the session for safety; no ad on that screen. */
  reportedPain: boolean;
}): boolean {
  if (!showsAds(input.plan) || input.reportedPain) return false;
  if (input.sessionsCompleted <= INTERSTITIAL_GRACE_SESSIONS) return false;
  if ((input.sessionsCompleted - INTERSTITIAL_GRACE_SESSIONS) % INTERSTITIAL_EVERY_SESSIONS !== 0) return false;
  if (input.lastShownAt && input.now.getTime() - input.lastShownAt.getTime() < INTERSTITIAL_MIN_GAP_MINUTES * 60_000) return false;
  return true;
}
