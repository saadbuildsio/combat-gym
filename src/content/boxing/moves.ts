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
  | "reset"
  | "body-jab"
  | "body-cross"
  | "body-hook"
  | "block"
  | "slip-left"
  | "slip-right"
  | "roll"
  | "parry"
  | "pull-back"
  | "pivot"
  | "feint";

/** How the move travels, drawn as a faint trail so the shape of the punch is clear. */
export type MoveTrail =
  | "straight-lead"
  | "straight-rear"
  | "hook-lead"
  | "hook-rear"
  | "upper-lead"
  | "upper-rear"
  | "body-lead"
  | "body-rear"
  | "body-hook"
  /** Defense: the opponent's straight punch coming in at head height. */
  | "incoming-straight"
  /** Defense: the opponent's hook passing over the head. */
  | "incoming-hook"
  | "none";

export interface MoveDefinition {
  id: MoveId;
  name: string;
  /** One short coaching cue shown under the animation. */
  cue: string;
  trail: MoveTrail;
  /** Arrow for footwork moves. */
  arrow?: "→" | "←" | "↙" | "↗" | "↻";
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

  // Body shots: bend the knees to drop the shoulders to the target. The bag's middle is at about y = 105.
  bodyJab: pose(
    {
      head: { x: 130, y: 60 },
      neck: { x: 123, y: 76 },
      hip: { x: 110, y: 132 },
      leadShoulder: { x: 128, y: 82 },
      leadElbow: { x: 163, y: 94 },
      leadFist: { x: 199, y: 104 },
      rearShoulder: { x: 119, y: 84 },
      rearElbow: { x: 124, y: 110 },
      rearFist: { x: 136, y: 68 },
      leadKnee: { x: 140, y: 162 },
      rearKnee: { x: 102, y: 170 },
    },
    { bagSwing: 3 },
  ),
  bodyCross: pose(
    {
      head: { x: 136, y: 60 },
      neck: { x: 128, y: 76 },
      hip: { x: 114, y: 132 },
      leadShoulder: { x: 130, y: 82 },
      leadElbow: { x: 136, y: 106 },
      leadFist: { x: 144, y: 68 },
      rearShoulder: { x: 130, y: 80 },
      rearElbow: { x: 166, y: 92 },
      rearFist: { x: 201, y: 102 },
      leadKnee: { x: 142, y: 162 },
      rearKnee: { x: 108, y: 170 },
      rearFoot: { x: 84, y: 198 },
    },
    { bagSwing: 6 },
  ),
  bodyHook: pose(
    {
      head: { x: 130, y: 60 },
      neck: { x: 123, y: 76 },
      hip: { x: 110, y: 132 },
      leadShoulder: { x: 128, y: 82 },
      leadElbow: { x: 156, y: 108 },
      leadFist: { x: 192, y: 108 },
      rearShoulder: { x: 119, y: 84 },
      rearElbow: { x: 124, y: 110 },
      rearFist: { x: 136, y: 68 },
      leadKnee: { x: 140, y: 162 },
      leadFoot: { x: 140, y: 199 },
      rearKnee: { x: 102, y: 170 },
    },
    { bagSwing: 5 },
  ),

  // Defense. The fighter is drawn side-on, so "left" (lead side) is towards the viewer.
  /** High guard: both gloves on the forehead, elbows together, chin down, knees a little bent. */
  block: pose({
    head: { x: 122, y: 52 },
    neck: { x: 117, y: 68 },
    hip: { x: 109, y: 126 },
    leadShoulder: { x: 121, y: 74 },
    leadElbow: { x: 136, y: 96 },
    leadFist: { x: 137, y: 47 },
    rearShoulder: { x: 113, y: 76 },
    rearElbow: { x: 128, y: 98 },
    rearFist: { x: 131, y: 44 },
    leadKnee: { x: 134, y: 162 },
    rearKnee: { x: 100, y: 166 },
  }),
  /** Slip left: rear shoulder turns in a little, head moves forward over the front knee. */
  slipLeft: pose({
    head: { x: 140, y: 60 },
    neck: { x: 131, y: 74 },
    hip: { x: 112, y: 128 },
    leadShoulder: { x: 134, y: 80 },
    leadElbow: { x: 142, y: 106 },
    leadFist: { x: 154, y: 72 },
    rearShoulder: { x: 128, y: 78 },
    rearElbow: { x: 136, y: 104 },
    rearFist: { x: 148, y: 64 },
    leadKnee: { x: 140, y: 162 },
    rearKnee: { x: 102, y: 168 },
  }),
  /** Slip right: lead shoulder turns in a little, head moves back and to the right, weight a little on the back leg. */
  slipRight: pose({
    head: { x: 114, y: 60 },
    neck: { x: 110, y: 75 },
    hip: { x: 104, y: 128 },
    leadShoulder: { x: 118, y: 80 },
    leadElbow: { x: 126, y: 106 },
    leadFist: { x: 136, y: 70 },
    rearShoulder: { x: 107, y: 82 },
    rearElbow: { x: 112, y: 108 },
    rearFist: { x: 124, y: 66 },
    leadKnee: { x: 132, y: 162 },
    rearKnee: { x: 96, y: 166 },
  }),
  /** Roll, part 1: bend the knees and drop the head down. */
  rollDown: pose({
    head: { x: 118, y: 76 },
    neck: { x: 114, y: 92 },
    hip: { x: 106, y: 138 },
    leadShoulder: { x: 118, y: 98 },
    leadElbow: { x: 128, y: 124 },
    leadFist: { x: 136, y: 86 },
    rearShoulder: { x: 110, y: 100 },
    rearElbow: { x: 118, y: 126 },
    rearFist: { x: 128, y: 82 },
    leadKnee: { x: 138, y: 164 },
    rearKnee: { x: 99, y: 172 },
  }),
  /** Roll, part 2: across the bottom of the U, under the punch. */
  rollAcross: pose({
    head: { x: 134, y: 78 },
    neck: { x: 127, y: 93 },
    hip: { x: 112, y: 138 },
    leadShoulder: { x: 130, y: 98 },
    leadElbow: { x: 140, y: 124 },
    leadFist: { x: 150, y: 88 },
    rearShoulder: { x: 122, y: 100 },
    rearElbow: { x: 130, y: 126 },
    rearFist: { x: 142, y: 84 },
    leadKnee: { x: 144, y: 164 },
    rearKnee: { x: 103, y: 172 },
  }),
  /** Roll, part 3: coming up on the other side, ready to punch. */
  rollUp: pose({
    head: { x: 132, y: 56 },
    neck: { x: 125, y: 71 },
    hip: { x: 112, y: 126 },
    leadShoulder: { x: 128, y: 77 },
    leadElbow: { x: 136, y: 104 },
    leadFist: { x: 148, y: 66 },
    rearShoulder: { x: 120, y: 79 },
    rearElbow: { x: 126, y: 106 },
    rearFist: { x: 140, y: 60 },
    leadKnee: { x: 138, y: 162 },
    rearKnee: { x: 102, y: 166 },
  }),
  /** Parry: a short tap with the rear hand, just in front of the face. */
  parryOut: pose({ rearElbow: { x: 132, y: 90 }, rearFist: { x: 156, y: 56 } }),
  parryIn: pose({ rearElbow: { x: 130, y: 94 }, rearFist: { x: 150, y: 68 } }),
  /** Pull back: weight onto the back foot, head moves back but stays over the back leg. */
  pullBack: pose({
    head: { x: 108, y: 50 },
    neck: { x: 105, y: 66 },
    hip: { x: 102, y: 123 },
    leadShoulder: { x: 110, y: 72 },
    leadElbow: { x: 120, y: 100 },
    leadFist: { x: 128, y: 62 },
    rearShoulder: { x: 102, y: 74 },
    rearElbow: { x: 110, y: 102 },
    rearFist: { x: 118, y: 56 },
    leadKnee: { x: 124, y: 162 },
    rearKnee: { x: 94, y: 166 },
  }),
  /** Pivot: stay on the front foot and swing the back foot round, so the body turns. */
  pivotSwing: pose(
    {
      hip: { x: 114, y: 120 },
      neck: { x: 121, y: 62 },
      head: { x: 127, y: 46 },
      rearShoulder: { x: 118, y: 70 },
      rearElbow: { x: 124, y: 98 },
      rearFist: { x: 135, y: 54 },
      rearKnee: { x: 108, y: 158 },
      rearFoot: { x: 100, y: 190 },
    },
    { scale: 1.03 },
  ),
  pivotTurned: pose(
    {
      hip: { x: 118, y: 120 },
      neck: { x: 123, y: 62 },
      head: { x: 128, y: 46 },
      leadShoulder: { x: 126, y: 68 },
      rearShoulder: { x: 120, y: 70 },
      rearElbow: { x: 126, y: 98 },
      rearFist: { x: 136, y: 54 },
      rearKnee: { x: 114, y: 160 },
      rearFoot: { x: 110, y: 200 },
    },
    { scale: 1.06 },
  ),
  /** Feint: a small, fast twitch of the lead shoulder and hand, like the start of a jab. */
  feint: pose({ head: { x: 126, y: 48 }, neck: { x: 120, y: 64 }, leadShoulder: { x: 125, y: 69 }, leadElbow: { x: 140, y: 84 }, leadFist: { x: 158, y: 60 } }),
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
  // Body shots
  { id: "body-jab", name: "Body jab", cue: "Bend your knees to get low, then jab straight to the body.", trail: "body-lead", frames: [{ pose: POSES.bodyJab, ms: 240 }, { pose: GUARD_POSE, ms: 280 }] },
  { id: "body-cross", name: "Body cross", cue: "Bend your knees, turn the back hip, cross to the body.", trail: "body-rear", frames: [{ pose: POSES.bodyCross, ms: 260 }, { pose: GUARD_POSE, ms: 300 }] },
  { id: "body-hook", name: "Body hook", cue: "Bend your knees, elbow low, turn your body into the hook.", trail: "body-hook", frames: [{ pose: POSES.bodyHook, ms: 260 }, { pose: GUARD_POSE, ms: 300 }] },
  // Defense
  { id: "block", name: "Block", cue: "Gloves to your forehead, elbows in, chin down. Eyes open.", trail: "incoming-straight", frames: [{ pose: POSES.block, ms: 200 }, { pose: POSES.block, ms: 450 }, { pose: GUARD_POSE, ms: 300 }] },
  { id: "slip-left", name: "Slip left", cue: "Small turn, bend the knees, head over your front knee.", trail: "incoming-straight", frames: [{ pose: POSES.slipLeft, ms: 220 }, { pose: POSES.slipLeft, ms: 250 }, { pose: GUARD_POSE, ms: 280 }] },
  { id: "slip-right", name: "Slip right", cue: "Small turn the other way, head just off to the right.", trail: "incoming-straight", frames: [{ pose: POSES.slipRight, ms: 220 }, { pose: POSES.slipRight, ms: 250 }, { pose: GUARD_POSE, ms: 280 }] },
  { id: "roll", name: "Roll", cue: "Bend your knees, not your back. Move your head in a U.", trail: "incoming-hook", frames: [{ pose: POSES.rollDown, ms: 300 }, { pose: POSES.rollAcross, ms: 300 }, { pose: POSES.rollUp, ms: 300 }, { pose: GUARD_POSE, ms: 280 }] },
  { id: "parry", name: "Parry", cue: "Small tap with the back hand, then straight back to the chin.", trail: "incoming-straight", frames: [{ pose: POSES.parryOut, ms: 150 }, { pose: POSES.parryIn, ms: 130 }, { pose: GUARD_POSE, ms: 260 }] },
  { id: "pull-back", name: "Pull back", cue: "Weight onto the back foot, head just out of reach. Chin down.", trail: "incoming-straight", frames: [{ pose: POSES.pullBack, ms: 260 }, { pose: POSES.pullBack, ms: 250 }, { pose: GUARD_POSE, ms: 300 }] },
  // Footwork and fight IQ
  { id: "pivot", name: "Pivot", cue: "Stay on the ball of your front foot. Swing the back foot round.", trail: "none", arrow: "↻", frames: [{ pose: POSES.pivotSwing, ms: 300 }, { pose: POSES.pivotTurned, ms: 300 }, { pose: POSES.pivotTurned, ms: 200 }, { pose: GUARD_POSE, ms: 400 }] },
  { id: "feint", name: "Feint", cue: "A small fake jab. Hand comes back fast. Watch the reaction.", trail: "none", frames: [{ pose: POSES.feint, ms: 120 }, { pose: GUARD_POSE, ms: 160 }, { pose: GUARD_POSE, ms: 200 }] },
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

/** Words that can appear in a callout, alone ("Slip left") or as part of a combo ("1, 2, slip left"). Lower case. */
const WORD_TO_MOVE: Record<string, MoveId> = {
  "body 1": "body-jab",
  "body 2": "body-cross",
  "body 3": "body-hook",
  "step forward": "step-forward",
  "step back": "step-back",
  "step left": "step-left",
  "step right": "step-right",
  "guard check": "guard-check",
  "reset your stance": "reset",
  block: "block",
  "slip left": "slip-left",
  "slip right": "slip-right",
  roll: "roll",
  parry: "parry",
  "pull back": "pull-back",
  pivot: "pivot",
  feint: "feint",
};

function calloutParts(callout: string): string[] {
  return callout.split(",").map((p) => p.trim().toLowerCase().replace(/\s+/g, " "));
}

function moveForPart(part: string): MoveId | undefined {
  return PUNCH_NUMBER_TO_MOVE[part] ?? WORD_TO_MOVE[part];
}

/**
 * The moves a callout asks for, in order. "1, 2, 3" gives jab, cross, lead hook;
 * "1, 2, slip left" gives jab, cross, slip left; "body 2" is a cross to the body.
 * Returns an empty list for a callout we have no animation for, so the screen can fall back to text.
 */
export function movesForCallout(callout: string): MoveId[] {
  const moves = calloutParts(callout).map(moveForPart);
  return moves.every((m): m is MoveId => m !== undefined) ? moves : [];
}

/** The name a callout reads as on screen and in speech: "1, 2, slip left" becomes "Jab, cross, slip left". */
export function calloutName(callout: string): string {
  const parts = calloutParts(callout);
  if (!parts.every((p) => moveForPart(p) !== undefined)) return callout;
  const named = parts
    .map((p) => {
      if (p in PUNCH_NAMES) return PUNCH_NAMES[p].toLowerCase();
      const body = /^body ([1-6])$/.exec(p);
      return body ? `body ${PUNCH_NAMES[body[1]].toLowerCase()}` : p;
    })
    .join(", ");
  return named.charAt(0).toUpperCase() + named.slice(1);
}

/** Lesson pages show the move they teach. Combination lessons list each punch of the combo. */
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
  // Level 3: combinations
  "boxing-one-two": ["jab", "cross"],
  "boxing-jab-cross-hook": ["jab", "cross", "lead-hook"],
  "boxing-body-shots": ["body-jab", "body-cross", "body-hook"],
  "boxing-uppercut-hook-combos": ["rear-uppercut", "lead-hook", "lead-uppercut"],
  // Level 4: defense
  "boxing-block": ["block"],
  "boxing-slip": ["slip-right", "slip-left"],
  "boxing-roll": ["roll"],
  "boxing-parry": ["parry"],
  "boxing-pull-back": ["pull-back"],
  // Level 5: combined training
  "boxing-pivot": ["pivot"],
  "boxing-punch-and-move": ["jab", "cross", "step-back", "step-left"],
  "boxing-defend-and-counter": ["slip-right", "cross", "slip-left", "lead-hook"],
  "boxing-cutting-angles": ["step-left", "pivot", "jab"],
  // Level 6: fight IQ
  "boxing-distance": ["step-forward", "jab", "step-back"],
  "boxing-feints-timing": ["feint", "cross"],
  "boxing-counter-punching": ["pull-back", "cross", "parry"],
  "boxing-ring-control": ["pivot", "step-left", "step-right"],
};
