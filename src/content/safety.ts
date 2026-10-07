/**
 * Safety copy shown in the app. Kept in one place so it can be reviewed by a coach
 * and a lawyer without reading code.
 */

export const SAFETY_DISCLAIMER =
  "Combat Gym is an educational and fitness app. It is not a substitute for qualified, in-person coaching or medical advice. " +
  "Check with a doctor before starting a new exercise program, especially if you have a health condition or injury.";

/** Shown on first launch. The user must acknowledge before the first session. */
export const SAFETY_CHECKLIST: string[] = [
  "Clear a space of about 2 x 2 metres with nothing you can hit or trip over.",
  "Train on a non-slip floor in trainers or bare feet, not socks.",
  "Remove rings, watches and anything in your pockets.",
  "Keep water nearby and stop if you feel dizzy, short of breath or unwell.",
  "Shadowbox only. Never practise strikes on another person without a qualified coach present.",
];

/** Short reminders the session player rotates through between drills. */
export const SAFETY_TIPS: string[] = [
  "Do not lock your elbow at the end of a punch. Stop just short of full extension.",
  "Keep your movements controlled. Speed comes after good form.",
  "Breathe out with every punch.",
  "If anything hurts (not just tired, but pain), stop the session.",
];

/** Shown when the user reports pain during a session. The session ends; no XP penalty. */
export const PAIN_STOP_MESSAGE =
  "We have stopped your session. Training should not cause sharp or lasting pain. " +
  "Rest, and if the pain continues, speak to a medical professional before training again. " +
  "Your progress so far is saved.";

/** Equipment guidance. Nothing is required for the MVP. */
export const EQUIPMENT_GUIDANCE: string[] = [
  "Required: nothing. All MVP training is shadowboxing.",
  "Optional: hand wraps and 12-16 oz gloves if you later train on a heavy bag.",
  "Never hit a wall, door or improvised bag. Use proper equipment or shadowbox.",
];

/** Minimum age for the MVP until a parental consent policy exists. */
export const MINIMUM_AGE = 16;
