/**
 * A 2D side-view pose for the animated fighter, and the maths to blend between poses.
 * The fighter is orthodox and faces right, towards the bag. "Lead" is the left side, nearest the viewer.
 */

export interface Point {
  x: number;
  y: number;
}

export const JOINTS = [
  "head",
  "neck",
  "hip",
  "leadShoulder",
  "leadElbow",
  "leadFist",
  "rearShoulder",
  "rearElbow",
  "rearFist",
  "leadKnee",
  "leadFoot",
  "rearKnee",
  "rearFoot",
] as const;

export type Joint = (typeof JOINTS)[number];

export interface Pose {
  joints: Record<Joint, Point>;
  /** Whole-body shift for footwork, in drawing units. */
  shiftX: number;
  /** Size change to show a sideways step: bigger is towards the viewer (left), smaller is away (right). */
  scale: number;
  /** How far the bag swings, in degrees. */
  bagSwing: number;
}

/** One step of a move: hold or blend into `pose` over `ms`. */
export interface Keyframe {
  pose: Pose;
  ms: number;
}

/** Smooth start and stop, so punches snap out and come back without looking robotic. */
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function blendPoses(from: Pose, to: Pose, t: number): Pose {
  const joints = {} as Record<Joint, Point>;
  for (const j of JOINTS) {
    joints[j] = { x: lerp(from.joints[j].x, to.joints[j].x, t), y: lerp(from.joints[j].y, to.joints[j].y, t) };
  }
  return {
    joints,
    shiftX: lerp(from.shiftX, to.shiftX, t),
    scale: lerp(from.scale, to.scale, t),
    bagSwing: lerp(from.bagSwing, to.bagSwing, t),
  };
}

/** Total length of a keyframe list in ms. */
export function timelineLength(frames: Keyframe[]): number {
  return frames.reduce((sum, f) => sum + f.ms, 0);
}

/**
 * The pose at `elapsedMs` into a timeline that starts from `start`.
 * Also returns which keyframe is playing, so the screen can highlight the current punch of a combo.
 */
export function poseAt(start: Pose, frames: Keyframe[], elapsedMs: number): { pose: Pose; frameIndex: number } {
  let from = start;
  let t = Math.max(0, elapsedMs);
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    if (t < frame.ms) return { pose: blendPoses(from, frame.pose, easeInOut(frame.ms === 0 ? 1 : t / frame.ms)), frameIndex: i };
    t -= frame.ms;
    from = frame.pose;
  }
  return { pose: from, frameIndex: Math.max(0, frames.length - 1) };
}
