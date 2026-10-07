/**
 * Analytics events. The names match the product plan so dashboards line up later.
 * MVP: events go to the console in development. Later: plug in PostHog via `setAnalyticsSink`.
 * Never put personal data (names, emails) in event properties.
 */

export type AnalyticsEvent =
  | "user_signup"
  | "safety_acknowledged"
  | "onboarding_complete"
  | "training_started"
  | "training_completed"
  | "training_stopped_pain"
  | "lesson_completed"
  | "challenge_started"
  | "challenge_completed"
  | "ai_coach_opened"
  | "opponent_started"
  | "opponent_defeated"
  | "streak_started"
  | "level_up"
  | "achievement_unlocked"
  | "locked_sport_tapped"
  | "subscription_started"
  | "pro_screen_viewed"
  | "pro_purchase_started"
  | "pro_purchased"
  | "ad_interstitial_shown";

export type EventProperties = Record<string, string | number | boolean | null>;

export type AnalyticsSink = (event: AnalyticsEvent, properties: EventProperties) => void;

const consoleSink: AnalyticsSink = (event, properties) => {
  if (process.env.NODE_ENV !== "production") console.info("[analytics]", event, properties);
};

let sink: AnalyticsSink = consoleSink;

export function setAnalyticsSink(next: AnalyticsSink): void {
  sink = next;
}

export function track(event: AnalyticsEvent, properties: EventProperties = {}): void {
  try {
    sink(event, properties);
  } catch {
    // Analytics must never break the app.
  }
}
