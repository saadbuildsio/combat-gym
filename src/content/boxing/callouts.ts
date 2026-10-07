/**
 * Spoken and on-screen callouts for follow-along rounds and drill prompts.
 * Punch numbers: 1 jab, 2 cross, 3 lead hook, 4 rear hook, 5 lead uppercut, 6 rear uppercut.
 */

export const WARMUP_STEPS = [
  "Neck circles, slow and gentle",
  "Shoulder rolls forward and back",
  "Arm circles, small then big",
  "Hip circles",
  "Light bounce on the balls of your feet",
  "Easy step forward and back in stance",
];

export const COOLDOWN_STEPS = ["Slow breathing: in for 4, out for 6", "Shoulder and chest stretch", "Shake out your arms and legs"];

export const MOVEMENT_CALLOUTS = ["Step forward", "Step back", "Step left", "Step right", "Guard check", "Reset your stance"];

export const PUNCH_COMBOS = ["1", "1, 2", "1, 1, 2", "1, 2, 3", "2, 3, 2", "1, 6, 3", "3, 2", "1, 2, 5, 2", "5, 6", "1, 2, 3, 4"];

export const PUNCH_NAMES: Record<string, string> = {
  "1": "Jab",
  "2": "Cross",
  "3": "Lead hook",
  "4": "Rear hook",
  "5": "Lead uppercut",
  "6": "Rear uppercut",
};

/** Options for tap drills before and after the punches are unlocked. */
export const DIRECTION_OPTIONS = ["←", "↑", "↓", "→"];
export const DIRECTION_NAMES: Record<string, string> = { "←": "Left", "↑": "Forward", "↓": "Back", "→": "Right" };
export const PUNCH_OPTIONS_BASIC = ["1", "2", "3"];
export const PUNCH_OPTIONS_ALL = ["1", "2", "3", "4", "5", "6"];
