/**
 * Every piece of screen wording in English, by key.
 * Roman Urdu lives in roman.ts with the same keys; TypeScript fails the build if a key is missing there.
 * Use {name} for values filled in at runtime.
 */
export const en = {
  "language.title": "Choose your language",
  "language.subtitle": "You can change this later in your profile.",
  "language.setting": "Language",

  "video.skipIntro": "Skip intro",
  "video.skipIntroHint": "Some videos start with an introduction. Tap Skip intro to jump straight to the training.",
  "video.credit": "Video: {credit}.",
  "video.notReviewed": "Not yet checked by a Combat Gym coach. If it differs from our written steps, follow the steps.",
  "video.notReviewedLeads": "Not yet checked by a Combat Gym coach. Go gently and stop if anything hurts.",
  "video.comingSoon": "Demo video coming soon",
  "video.followSteps": "Follow the written steps below for now.",
} as const;

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;
