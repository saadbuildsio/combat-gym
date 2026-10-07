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

// ---------------- Levels 3-6 ----------------
// Callouts can mix punch numbers with words: "1, 2, slip left". "body 2" means a cross to the body.
// Each list is keyed by the lesson that teaches it; round-callouts.ts adds a list once that lesson is done.

/** Level 2: combos that use only the punches of each lesson learned so far. */
export const PUNCH_COMBOS_BY_LESSON: Record<string, string[]> = {
  "boxing-jab": ["1", "1, 1"],
  "boxing-cross": ["1, 2", "1, 1, 2", "2"],
  "boxing-lead-hook": ["1, 2, 3", "2, 3, 2", "3, 2"],
  "boxing-rear-hook": ["1, 2, 3, 4", "3, 4"],
  "boxing-lead-uppercut": ["1, 2, 5, 2", "5, 2"],
  "boxing-rear-uppercut": ["5, 6", "1, 6, 3"],
};

/** Level 3: longer combinations and body shots. */
export const COMBINATION_CALLOUTS: Record<string, string[]> = {
  "boxing-one-two": ["1, 2", "1, 2, 1, 2", "1, 1, 2"],
  "boxing-jab-cross-hook": ["1, 2, 3", "1, 2, 3, 2", "1, 1, 2, 3"],
  "boxing-body-shots": ["1, body 2", "body 1, 1", "1, 2, body 3", "body 3, 3", "body 2, 3, 2"],
  "boxing-uppercut-hook-combos": ["6, 3", "5, 6, 3", "3, 6, 3", "1, 2, 5, 2", "6, 3, 2"],
};

/** Level 4: single defensive moves, said on their own. */
export const DEFENSE_CALLOUTS: Record<string, string[]> = {
  "boxing-block": ["Block"],
  "boxing-slip": ["Slip left", "Slip right"],
  "boxing-roll": ["Roll"],
  "boxing-parry": ["Parry"],
  "boxing-pull-back": ["Pull back"],
};

/** Level 4: short mixes of punches and the defense just learned. */
export const DEFENSE_MIXED_CALLOUTS: Record<string, string[]> = {
  "boxing-block": ["1, 2, block", "Block, 2"],
  "boxing-slip": ["1, 2, slip left", "Slip right, 2", "Slip left, 3", "1, slip right"],
  "boxing-roll": ["1, 2, roll", "Roll, 3", "1, 2, 3, roll"],
  "boxing-parry": ["Parry, 2", "Parry, 1, 2"],
  "boxing-pull-back": ["Pull back, 2", "1, 2, pull back"],
};

/** Level 5: move, strike and defend together. */
export const COMBINED_CALLOUTS: Record<string, string[]> = {
  "boxing-pivot": ["Pivot", "1, 2, pivot", "Pivot, 1, 2"],
  "boxing-punch-and-move": ["1, 2, step back", "Step forward, 1, 2", "1, 2, 3, step back", "1, 2, step left"],
  "boxing-defend-and-counter": ["Slip right, 2, 3", "Slip left, 3, 2", "Roll, 3, 2", "Block, 3, 2", "Parry, 2, 3"],
  "boxing-cutting-angles": ["1, 2, step left", "1, 2, 3, step right", "Step left, 1, 2", "1, 2, pivot"],
};

/** Level 6: distance, feints, counters and ring control. */
export const FIGHT_IQ_CALLOUTS: Record<string, string[]> = {
  "boxing-distance": ["Step forward, 1, step back", "Step forward, 1, 2, step back", "1, step back"],
  "boxing-feints-timing": ["Feint", "Feint, 2", "Feint, 1, 2", "Feint, 3, 2"],
  "boxing-counter-punching": ["Slip right, 2", "Pull back, 2", "Parry, 2", "Roll, 3, 2", "Slip left, 3"],
  "boxing-ring-control": ["Pivot, 1, 2", "Step left, 1, 2", "Step right, 2, 3", "1, 2, pivot"],
};
