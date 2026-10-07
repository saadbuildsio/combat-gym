import type { Joint, Keyframe, Point, Pose } from "@/domain/pose";
import { PUNCH_NAMES } from "./callouts";

/**
 * Every move the round screen can animate, drawn as poses for our own fighter figure.
 * Coordinates are in a 300 x 220 drawing; the floor is at y = 200 and the bag hangs on the right.
 */

export type MoveId =
  | "guard"
  | "jab"
  | "cross"
  | "lead-hook"
  | "rear-hook"
  | "lead-uppercut"
  | "rear-uppercut"
  | "step-forward"
  | "step-back"
  | "step-left"
  | "step-right"
  | "guard-check"
  | "reset";

/** How the move travels, drawn as a faint trail so the shape of the punch is clear. */
export type MoveTrail = "straight-lead" | "straight-rear" | "hook-lead" | "hook-rear" | "upper-lead" | "upper-rear" | "none";

export interface MoveDefinition {
  id: MoveId;
  name: string;
  /** One short coaching cue shown under the animation. */
  cue: string;
  trail: MoveTrail;
  /** Arrow for footwork moves. */
  arrow?: "→" | "←" | "↙" | "↗";
  frames: Keyframe[];
}

const GUARD_JOINTS: Record<Joint, Point> = {
  head: { x: 124, y: 46 },
  neck: { x: 118, y: 62 },
  hip: { x: 110, y: 120 },
  leadShoulder: { x: 122, y: 68 },
  leadElbow: { x: 130, y: 96 },
  leadFist: { x: 142, y: 60 },
  rearShoulder: { x: 114, y: 70 },
  rearElbow: { x: 120, y: 98 },
  rearFist: { x: 132, y: 54 },
  leadKnee: { x: 130, y: 160 },
  leadFoot: { x: 142, y: 200 },
  rearKnee: { x: 96, y: 162 },
  rearFoot: { x: 80, y: 200 },
};

export const GUARD_POSE: Pose = { joints: GUARD_JOINTS, shiftX: 0, scale: 1, bagSwing: 0 };

/** The guard pose with some joints and settings changed. */
function pose(changes: Partial<Record<Joint, Point>>, extra: Partial<Omit<Pose, "joints">> = {}): Pose {
  return { ...GUARD_POSE, ...extra, joints: { ...GUARD_JOINTS, ...changes } };
}

const BACK_TO_GUARD: Keyframe = { pose: GUARD_POSE, ms: 220 };

/** Fist reaches the bag at about x = 200. */
const POSES = {
  jab: pose(
    { head: { x: 128, y: 47 }, neck: { x: 121, y: 63 }, leadShoulder: { x: 127, y: 68 }, leadElbow: { x: 162, y: 64 }, leadFist: { x: 199, y: 60 } },
    { bagSwing: 4 },
  ),
  cross: pose(
    {
      head: { x: 134, y: 47 },
      neck: { x: 126, y: 63 },
      hip: { x: 114, y: 120 },
      rearShoulder: { x: 128, y: 67 },
      rearElbow: { x: 165, y: 62 },
      rearFist: { x: 201, y: 57 },
      leadElbow: { x: 128, y: 92 },
      leadFist: { x: 136, y: 56 },
      rearKnee: { x: 104, y: 160 },
      rearFoot: { x: 84, y: 198 },
    },
    { bagSwing: 7 },
  ),
  leadHook: pose(
    { head: { x: 128, y: 48 }, neck: { x: 120, y: 64 }, leadShoulder: { x: 126, y: 66 }, leadElbow: { x: 160, y: 62 }, leadFist: { x: 194, y: 64 }, leadFoot: { x: 140, y: 199 } },
    { bagSwing: 5 },
  ),
  rearHook: pose(
    {
      head: { x: 132, y: 48 },
      neck: { x: 124, y: 64 },
      rearShoulder: { x: 126, y: 66 },
      rearElbow: { x: 158, y: 60 },
      rearFist: { x: 192, y: 62 },
      leadFist: { x: 138, y: 56 },
      rearFoot: { x: 84, y: 198 },
    },
    { bagSwing: 6 },
  ),
  leadUpperDip: pose({ head: { x: 122, y: 54 }, neck: { x: 116, y: 70 }, hip: { x: 108, y: 128 }, leadShoulder: { x: 120, y: 76 }, leadElbow: { x: 134, y: 108 }, leadFist: { x: 150, y: 100 }, rearShoulder: { x: 112, y: 78 }, rearElbow: { x: 118, y: 104 }, rearFist: { x: 130, y: 62 }, leadKnee: { x: 132, y: 166 }, rearKnee: { x: 96, y: 168 } }),
  leadUpper: pose(
    { head: { x: 126, y: 44 }, neck: { x: 120, y: 60 }, leadShoulder: { x: 125, y: 66 }, leadElbow: { x: 168, y: 92 }, leadFist: { x: 194, y: 66 } },
    { bagSwing: 3 },
  ),
  rearUpperDip: pose({ head: { x: 124, y: 54 }, neck: { x: 117, y: 70 }, hip: { x: 108, y: 128 }, rearShoulder: { x: 114, y: 78 }, rearElbow: { x: 128, y: 110 }, rearFist: { x: 146, y: 104 }, leadShoulder: { x: 120, y: 76 }, leadElbow: { x: 128, y: 102 }, leadFist: { x: 140, y: 64 }, leadKnee: { x: 132, y: 166 }, rearKnee: { x: 96, y: 168 } }),
  rearUpper: pose(
    { head: { x: 132, y: 45 }, neck: { x: 125, y: 61 }, rearShoulder: { x: 126, y: 66 }, rearElbow: { x: 170, y: 94 }, rearFist: { x: 196, y: 64 }, rearFoot: { x: 84, y: 198 } },
    { bagSwing: 4 },
  ),
  // Footwork: lead foot moves first, rear foot follows the same distance (step and drag).
  stepForwardLead: pose({ leadKnee: { x: 142, y: 158 }, leadFoot: { x: 162, y: 196 } }, { shiftX: 6 }),
  stepForward: pose({}, { shiftX: 20 }),
  stepBackRear: pose({ rearKnee: { x: 86, y: 162 }, rearFoot: { x: 62, y: 196 } }, { shiftX: -6 }),
  stepBack: pose({}, { shiftX: -20 }),
  stepLeft: pose({}, { scale: 1.08 }),
  stepRight: pose({}, { scale: 0.92 }),
  bounceDown: pose({ head: { x: 124, y: 50 }, neck: { x: 118, y: 66 }, hip: { x: 110, y: 124 }, leadShoulder: { x: 122, y: 72 }, leadElbow: { x: 130, y: 100 }, leadFist: { x: 142, y: 64 }, rearShoulder: { x: 114, y: 74 }, rearElbow: { x: 120, y: 102 }, rearFist: { x: 132, y: 58 }, leadKnee: { x: 132, y: 162 }, rearKnee: { x: 97, y: 164 } }),
  guardTight: pose({ leadElbow: { x: 128, y: 94 }, leadFist: { x: 136, y: 52 }, rearElbow: { x: 118, y: 96 }, rearFist: { x: 128, y: 50 } }),
} satisfies Record<string, Pose>;

const MOVES: MoveDefinition[] = [
  { id: "guard", name: "Guard", cue: "Hands at your cheeks, elbows in, chin down.", trail: "none", frames: [{ pose: POSES.bounceDown, ms: 400 }, { pose: GUARD_POSE, ms: 400 }] },
  { id: "jab", name: "Jab", cue: "Straight out from the chin, snap it back.", trail: "straight-lead", frames: [{ pose: POSES.jab, ms: 170 }, BACK_TO_GUARD] },
  { id: "cross", name: "Cross", cue: "Turn the back hip and heel, rear hand straight out.", trail: "straight-rear", frames: [{ pose: POSES.cross, ms: 220 }, { pose: GUARD_POSE, ms: 260 }] },
  { id: "lead-hook", name: "Lead hook", cue: "Elbow up level with the fist, turn on the front foot.", trail: "hook-lead", frames: [{ pose: POSES.leadHook, ms: 220 }, { pose: GUARD_POSE, ms: 260 }] },
  { id: "rear-hook", name: "Rear hook", cue: "Turn the back hip through, keep the elbow up.", trail: "hook-rear", frames: [{ pose: POSES.rearHook, ms: 240 }, { pose: GUARD_POSE, ms: 260 }] },
  { id: "lead-uppercut", name: "Lead uppercut", cue: "Dip a little, then drive up from the legs.", trail: "upper-lead", frames: [{ pose: POSES.leadUpperDip, ms: 160 }, { pose: POSES.leadUpper, ms: 180 }, { pose: GUARD_POSE, ms: 240 }] },
  { id: "rear-uppercut", name: "Rear uppercut", cue: "Dip, then lift with the back hip, palm facing you.", trail: "upper-rear", frames: [{ pose: POSES.rearUpperDip, ms: 160 }, { pose: POSES.rearUpper, ms: 200 }, { pose: GUARD_POSE, ms: 260 }] },
  { id: "step-forward", name: "Step forward", cue: "Front foot first, back foot follows the same distance.", trail: "none", arrow: "→", frames: [{ pose: POSES.stepForwardLead, ms: 220 }, { pose: POSES.stepForward, ms: 220 }, { pose: GUARD_POSE, ms: 500 }] },
  { id: "step-back", name: "Step back", cue: "Back foot first, front foot follows. Guard stays up.", trail: "none", arrow: "←", frames: [{ pose: POSES.stepBackRear, ms: 220 }, { pose: POSES.stepBack, ms: 220 }, { pose: GUARD_POSE, ms: 500 }] },
  { id: "step-left", name: "Step left", cue: "Left foot first, right foot follows. Never cross your feet.", trail: "none", arrow: "↙", frames: [{ pose: POSES.stepLeft, ms: 400 }, { pose: GUARD_POSE, ms: 500 }] },
  { id: "step-right", name: "Step right", cue: "Right foot first, left foot follows. Never cross your feet.", trail: "none", arrow: "↗", frames: [{ pose: POSES.stepRight, ms: 400 }, { pose: GUARD_POSE, ms: 500 }] },
  { id: "guard-check", name: "Guard check", cue: "Hands up to the cheeks, elbows tucked, chin down.", trail: "none", frames: [{ pose: POSES.guardTight, ms: 300 }, { pose: POSES.guardTight, ms: 400 }, { pose: GUARD_POSE, ms: 300 }] },
  { id: "reset", name: "Reset your stance", cue: "Feet shoulder width, front foot ahead, light bounce.", trail: "none", frames: [{ pose: POSES.bounceDown, ms: 250 }, { pose: GUARD_POSE, ms: 250 }, { pose: POSES.bounceDown, ms: 250 }, { pose: GUARD_POSE, ms: 250 }] },
];

const MOVE_BY_ID = new Map(MOVES.map((m) => [m.id, m]));

export function getMove(id: MoveId): MoveDefinition {
  const move = MOVE_BY_ID.get(id);
  if (!move) throw new Error(`Unknown move ${id}`);
  return move;
}

export const ALL_MOVE_IDS: MoveId[] = MOVES.map((m) => m.id);

const PUNCH_NUMBER_TO_MOVE: Record<string, MoveId> = {
  "1": "jab",
  "2": "cross",
  "3": "lead-hook",
  "4": "rear-hook",
  "5": "lead-uppercut",
  "6": "rear-uppercut",
};

const CALLOUT_TO_MOVE: Record<string, MoveId> = {
  "step forward": "step-forward",
  "step back": "step-back",
  "step left": "step-left",
  "step right": "step-right",
  "guard check": "guard-check",
  "reset your stance": "reset",
};

/**
 * The moves a callout asks for, in order. "1, 2, 3" gives jab, cross, lead hook.
 * Returns an empty list for a callout we have no animation for, so the screen can fall back to text.
 */
export function movesForCallout(callout: string): MoveId[] {
  const parts = callout.split(",").map((p) => p.trim());
  if (parts.length > 0 && parts.every((p) => p in PUNCH_NUMBER_TO_MOVE)) return parts.map((p) => PUNCH_NUMBER_TO_MOVE[p]);
  const move = CALLOUT_TO_MOVE[callout.trim().toLowerCase()];
  return move ? [move] : [];
}

/** The name a callout reads as on screen: "1, 2, 3" becomes "Jab, cross, lead hook". */
export function calloutName(callout: string): string {
  const parts = callout.split(",").map((p) => p.trim());
  if (parts.every((p) => p in PUNCH_NAMES)) {
    const named = parts.map((p) => PUNCH_NAMES[p].toLowerCase()).join(", ");
    return named.charAt(0).toUpperCase() + named.slice(1);
  }
  return callout;
}

/** Lesson pages show the move they teach. */
export const LESSON_MOVES: Record<string, MoveId[]> = {
  "boxing-stance": ["reset"],
  "boxing-guard": ["guard-check"],
  "boxing-step-drag": ["step-forward", "step-back"],
  "boxing-lateral": ["step-left", "step-right"],
  "boxing-jab": ["jab"],
  "boxing-cross": ["cross"],
  "boxing-lead-hook": ["lead-hook"],
  "boxing-rear-hook": ["rear-hook"],
  "boxing-lead-uppercut": ["lead-uppercut"],
  "boxing-rear-uppercut": ["rear-uppercut"],
};
