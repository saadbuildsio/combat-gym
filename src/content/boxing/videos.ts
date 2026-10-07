import type { DemoVideo } from "@/domain/types";

/**
 * Demo videos by lesson or drill id.
 *
 * For now these are existing YouTube videos (embedding checked on 7 Oct 2026). They are placeholders
 * until our own coach-filmed clips exist (see docs/video-shot-list.md). Unreviewed YouTube videos are
 * shown with a "not yet checked by our coach" note; unreviewed uploaded files are never shown.
 *
 * To replace one with our own clip: put the file in public/videos/ and change its line to
 *   { kind: "file", src: "/videos/boxing-jab.mp4", poster: "/videos/boxing-jab.jpg", credit: "Coach name", coachReviewed: true }
 */
export const DEMO_VIDEOS: Record<string, DemoVideo> = {
  // Level 1: fundamentals
  "boxing-stance": { kind: "youtube", src: "Pe1dxJUaoyo", credit: "MyBoxingCoach", coachReviewed: false },
  "boxing-guard": { kind: "youtube", src: "5PtQn5ljHOM", credit: "Prevail Boxing", coachReviewed: false },
  "boxing-step-drag": { kind: "youtube", src: "dHUutXudf8o", credit: "Expert Boxing", coachReviewed: false },
  "boxing-lateral": { kind: "youtube", src: "hPILWoWZ8W0", credit: "Boxing Training at Home (Ivan Beregula)", coachReviewed: false },

  // Level 2: the six punches
  "boxing-jab": { kind: "youtube", src: "odM78vAS86M", credit: "Tony Jeffries for Sanabul", coachReviewed: false },
  "boxing-cross": { kind: "youtube", src: "4ps3eNnnGCM", credit: "Tony Jeffries for Sanabul", coachReviewed: false },
  "boxing-lead-hook": { kind: "youtube", src: "UFVDcNDnpoU", credit: "Tony Jeffries for Sanabul", coachReviewed: false },
  "boxing-rear-hook": { kind: "youtube", src: "0gtMKaCJ5I8", credit: "Tony Jeffries", coachReviewed: false },
  "boxing-lead-uppercut": { kind: "youtube", src: "zl2bZwxM_ws", credit: "Tony Jeffries", coachReviewed: false },
  "boxing-rear-uppercut": { kind: "youtube", src: "iInkodqd5pE", credit: "Tony Jeffries", coachReviewed: false },

  // Rounds
  "warmup-basic": { kind: "youtube", src: "n1FQLqLhrSE", credit: "Boxing Ready", coachReviewed: false },
  "shadow-fundamentals": { kind: "youtube", src: "v0y86288Wt0", credit: "Tony Jeffries", coachReviewed: false },
  "shadow-punches": { kind: "youtube", src: "Q5WrJoYhpHE", credit: "FightCamp", coachReviewed: false },
  "cooldown-basic": { kind: "youtube", src: "1-KSTkJ-bRY", credit: "FightCamp", coachReviewed: false },
};

/**
 * Returns the video to show, or undefined.
 * Our own uploaded clips must be coach-approved. YouTube placeholders are shown with a notice.
 */
export function getDemoVideo(id: string): DemoVideo | undefined {
  const video = DEMO_VIDEOS[id];
  if (!video) return undefined;
  return video.coachReviewed || video.kind === "youtube" ? video : undefined;
}
