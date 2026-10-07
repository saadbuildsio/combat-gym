/**
 * Camera-based movement analysis: NOT IMPLEMENTED in the MVP.
 *
 * This file only fixes the shape of the future feature so the rest of the app can plan for it:
 *   Camera → Pose detection (e.g. MediaPipe Pose, on device) → Movement checks → Technique feedback → Coach
 *
 * Video never leaves the device. Only the resulting feedback is stored.
 */

import type { CameraSkill } from "@/domain/types";

/** One body landmark from a pose model, in normalised 0-1 screen coordinates. */
export interface PoseLandmark {
  name: string; // e.g. "left_wrist"
  x: number;
  y: number;
  visibility: number; // 0-1 confidence
}

export interface PoseFrame {
  timestampMs: number;
  landmarks: PoseLandmark[];
}

/** A single observation the coach can turn into feedback. */
export interface TechniqueFinding {
  skill: CameraSkill;
  check: "guard_height" | "stance_width" | "hand_return" | "hip_rotation" | "balance";
  ok: boolean;
  message: string; // e.g. "Your rear hand drops after the cross."
  confidence: number; // 0-1; findings under 0.7 are not shown to users
}

export interface PoseAnalyzer {
  readonly status: "not_implemented" | "ready";
  analyze(frames: PoseFrame[], expectedTechnique: string): Promise<TechniqueFinding[]>;
}

/** Placeholder used until computer vision ships. Returns no findings rather than fake ones. */
export const unavailablePoseAnalyzer: PoseAnalyzer = {
  status: "not_implemented",
  async analyze() {
    return [];
  },
};
